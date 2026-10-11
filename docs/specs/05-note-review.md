# Phase 5 — Note generation, review and EMR sync

**Goal:** finish a visit and get a drafted SOAP note the doctor can edit, adjust codes on, approve and "sync" to Epic, with an audit trail.

**Screens:** `prototype/08-generating-note-modal`, `09-note-review`, `10-sync-modal`, `11-note-completed`.
**Prototype functions:** `generateNote`, `pNote`, `syncModal`, `noteText`, and the actions `finish`, `toggleCode`, `addCode`, `saveDraft`, `approve`, `amend`, `cancelAmend`, `copyNote`, plus the `[data-soap]` input listener.

## 5.1 Generating modal (locked: no close)

- Title "Generating clinical note", subtitle "{name} · {mm:ss} recorded".
- Four steps, 650ms each:
  1. Structuring the transcript
  2. Extracting findings and medications
  3. Matching ICD-10 and CPT codes
  4. Drafting the {format} note
- Step states:
  - waiting: faint, 26px empty circle
  - running: ink text, blue spinning ring
  - done: green filled circle with a white check
- Then create or update the note:
  - If `noteId` exists (Emily's In Progress note), update it. Otherwise create `n{timestamp}`.
  - Fields: `date` = startedAt, `duration` = mm:ss of `t`, `status` "Draft", `aiDraft` true, `dx` = the case's `dxShort`.
  - `soap` comes from the case with {AGE} and {SEX} replaced (sex in lowercase).
  - `codes` = `finalCodes`, all included.
  - `transcript` = all lines including clinician notes; `clinicianNotes`; `edited` = [].
  - Append audit entries: "Recording started" (at the start), "Transcript captured ({n} segments)", "AI note drafted".
- Update the patient: `lastVisit` now, `visits + 1` (not when updating an existing note), status Active, `lastDuration`.
- Reset the recorder, navigate to `/notes/{id}`, and toast "Note drafted. Review it, then approve to sync."
- If no line has finished yet, Finish shows "Let the conversation run a little longer first." (warn) instead.

## 5.2 Note page `/notes/[id]`

- **Head:**
  - Title "Review Clinical Note", or "Clinical Note" when Completed.
  - Subtitle "AI-generated from the consultation on {date} at {time} · {duration} duration". Without `aiDraft` it starts "Consultation on…".
  - On the right: the status (purple "AI Draft" when `aiDraft` and Draft), a green "Synced to Epic" pill when synced, and a secondary button with the patient's small avatar and name linking to the patient.
- **Grid** `1.62fr 1fr`:
  - **Left: note card**
    - Header: file icon, "{dx} · SOAP note" (the format name in small regular weight), a "Copy note" button, and an "Amend" button when Completed.
    - Four sections, S/O/A/P. Each has a 26px blue-50 letter tile, the section name, an amber "Edited" tag once edited, and the faint hint "Click to edit" while editable.
    - Section text is 13.5px, line-height 1.7, ink-2 and `white-space: pre-wrap`. It is `contentEditable` while the note isn't Completed (or while amending); hover shows a light border and focus a blue ring.
    - Edits save to the store (debounced 500ms) and log the audit entry once per section.
    - A "Clinician Notes" section appears if there are any.
    - A collapsible "Transcript · {n} segments" block (details/summary with a rotating chevron) lists the lines read-only.
  - **Right: Billing Codes card**
    - "{n} selected".
    - Rows use the grid `20px 52px 74px 1fr auto`: checkbox, type, code pill, description, confidence ("97%", or "manual").
    - Unchecked rows fade to 45% with the code struck through.
    - When editable, an "Add a code…" select of all library codes not already present, with an "Add" button.
    - Each change logs "Included code X", "Removed code X" or "Added code X".
  - **Right: Patient card:** avatar, name, "age / sex · MRN", then Allergies, Insurance and Conditions, with an "Open record →" link.
  - **Right: Audit Trail card:** newest first. A vertical line joins the dots (13px blue dot with a 3px blue-100 ring). Each entry shows the action (13px/500) over "{Today|Yesterday|date}, hh:mm:ss AM · Dr. Sarah Johnson".
- **Sticky action bar** (bottom, editable only): a lock icon with "Only you can see this draft until it is approved.", then "Save Draft" (or "Cancel" when amending) and a primary "Approve & Sync to EMR" ("Save Amendment & Sync" when amending) with a send icon.
- **Save Draft:** an In Progress note becomes Draft. Logs "Draft saved" and toasts "Draft saved".

## 5.3 Sync modal (locked)

- Title "Approving and syncing" (or "Saving amendment"), subtitle "Epic Systems · encounter {id}".
- The encounter id is the existing one, or `E-` plus a random number from 483000 to 483899.
- Steps, 520ms each: Validating note and codes → Matching the Epic encounter → Uploading note and codes → Confirming chart update.
- Then:
  - status Completed, synced true, store the encounter id, end amending
  - audit "Approved by Dr. Sarah Johnson" (or "Amendment approved by Dr. Sarah Johnson") and "Synced to Epic ({id})"
  - update `lastSync`
  - toast "Note approved and synced to Epic" or "Amendment saved and synced to Epic"

## 5.4 Copy note

Plain text:
- Header: "Patient: {name} · MRN-…". When `redactExports` is on: "Patient: [redacted] · age / sex".
- Then the date, then SUBJECTIVE / OBJECTIVE / ASSESSMENT / PLAN blocks, then CODES (included only, "code – description"), then "Sarah Johnson, MD".

## Done when

- [ ] Full loop works: Dashboard → record → Finish → review → edit → remove a code → add a code → Approve → Completed and synced.
- [ ] The new note tops Recent Consultations, and the patient's last visit updates.
- [ ] Emily's fever run completes her existing In Progress note instead of making a duplicate.
- [ ] Refreshing a draft keeps the edits.
- [ ] Opening a seed Completed note shows it read-only with Amend.
- [ ] Build and lint pass.
