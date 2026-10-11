# Phase 4 — Recording engine and Consultation page

**Goal:** the heart of the demo. A scripted visit plays like a live recording: the timer runs, the waveform reacts, the transcript types out word by word, and the summary and codes fill in as each fact is said. It works from the Dashboard and the Consultation page, with the same live session on both.

**Screens:** `reference/consultation-in-progress.jpeg` (target), and in `prototype/`: `02-case-picker-modal`, `03-consultation-live`, `04-dashboard-while-recording`, `05-consultation-complete-evidence-open`, `06-add-note-modal`, `07-end-consultation-modal`.
**Prototype functions:** `startRec`, `togglePause`, the `setInterval` tick, `srcLive`, `applyReveal`, `pConsult`, `pickModal`, `pickList`, `live`, and the actions `mic`, `endConsult`, `discard`, `addNote`, `saveCNote`, `copyTx`, `toggleRow`, `fullSummary`.

## 4.1 `recording-store.ts`

State: `status: "idle" | "recording" | "paused"`, `caseId`, `mrn`, `t` (seconds), `startedAt` (ms), `lines` (revealed lines with `shown` word count and `done`), `summary` (`sym`, `dx`, `med`, `plan`, `all`, `vit`), `evidence` (per summary key: the lines that set it), `codes` (`{code, addedAt}` in arrival order), `clinicianNotes`, `captured` (script finished), `noteId` (an existing "In Progress" note for this patient, if any), `flash` (per key: last change time), `openRows` (Set of expanded summary rows).

Engine:
- One ticker every 100ms while recording: `t += 0.1 × speed` (speed from demo-store).
- Use `timeCase()` from `src/data/cases.ts` for each line's `at` and `dur`.
- A line appears when `t ≥ at`. Its `shown` word count is `ceil((t − at) / dur × words)`, at least 1.
- When the line is complete, mark it `done` and apply its `reveal`: append unique items to the arrays, set `dx` and `all`, append codes not already present, record the evidence, and set `flash[key] = now`.
- When `t > total + 0.6` for the first time: set `captured` and show the toast "Conversation captured. Review the summary, then click Finish & Generate Note."
- Each line's timestamp is `startedAt + at × 1000`.
- `start(caseId, mrn)`: reset, set status recording, record `startedAt`, find `noteId`, navigate to `/consultation`, toast "Recording started · {patient name}".
- `togglePause()`: toasts "Recording paused" or "Recording resumed".
- `discard()`: resets and toasts "Recording for {name} discarded" (warn).
- `addClinicianNote(text)`: a line with speaker `N` stamped at `startedAt + t × 1000`, merged into the transcript in time order.
- Stop the ticker when idle, and clean up on unmount.
- The engine survives navigation between pages. It does not need to survive a reload.

## 4.2 Case picker modal (wide)

- Title "Start New Consultation", subtitle "Pick a sample visit. The conversation plays back as a live recording."
- Three case cards in a row (one column on phones), each with radius 13 and a 1.5px border; the selected card has a blue border, `#f7f9ff` background and a 3px blue glow. Each card shows:
  - a specialty pill in the case tone
  - a 36px avatar with name and "age / sex"
  - the reason text
  - a clock icon with "About {round(total / speed)} seconds at {speed}×"
- Below the cards: the label "Or run the general visit with another patient", a search input and a list (4 patients when empty, 8 when searching) of non-archived patients that don't have their own case. Each shows "General visit script"; choosing one selects the fever script for that patient.
- Footer: the 1× / 2× / 4× segmented speed control (saved, and the card durations update), "Playback speed", Cancel, and a primary "Start Recording" button with a mic icon.
- The default selection is fever / Emily Davis.

## 4.3 Consultation page `/consultation`

- **Head:** "Consultation in Progress" / "Recording and transcribing the conversation in real time". When idle: "New Consultation" / "Choose a patient, then start recording".
- **Patient chip** on the right: avatar, name, "28 / Female · MRN-11223344". When idle the chip is a button ("Select patient / Pick a sample visit") that opens the picker.
- **Grid** `1.62fr 1fr`:
  - **Left: record card** (RecordCard variant `live`)
    - The left column holds the mic (the icon becomes play when paused; a click pauses or resumes, and when idle it opens the picker). Below the mic:
      - the timer, 26px/600 blue, tabular
      - "Recording…", "Paused · click to resume", or the idle caption
      - an "End Consultation" danger-outline button with a square icon, live only
    - The right column holds the live tag ("LIVE RECORDING" with a blinking red dot, "PAUSED", or "READY TO RECORD"), the waveform and the tip box with a sparkles icon.
    - A bottom bar has the language select, the speaker select ("Auto Detect Speaker" / "Manual Speaker Labels", menus), a spacer, and a "Good Connection" chip with a green signal icon.
    - The two pulse rings around the mic animate only while recording.
  - **Left: Live Transcription card** with a "Copy" button (copies `[hh:mm:ss AM] Doctor: …` lines, toast "Copied to clipboard", with a fallback when the clipboard is blocked).
    - The body scrolls at a maximum of 360px and auto-scrolls to the newest line.
    - The line being typed shows a blinking 2px blue caret. New lines fade in.
    - Clinician notes show "Note:" in amber with an amber-50 rounded background.
    - Footer: an animated equalizer with "AI is listening and transcribing…". When captured it shows a blue check-circle and "Conversation captured. Finish to generate the clinical note."; when paused, "Recording paused"; when idle, "Waiting to start".
    - Empty state: "The transcript appears here as the conversation happens."
  - **Right: AI Summary (Live)** (variant `live`)
    - The same rows as the dashboard, plus a row divider, hover background and a chevron.
    - Empty values show "Listening…" in faint italics.
    - A row that just changed plays the `flash` animation.
    - Clicking a row expands its evidence: timestamp · “quoted line” for each supporting line, with a blue-100 left border. Otherwise it shows "No supporting lines captured yet."
  - **Right: Billing Codes (Live Suggestions)**, where new codes flash. Empty state: "Codes are suggested as the diagnosis and services come up."
  - **Right: EMR Integration** (same card as the dashboard).
- **Save bar** (full width, card, background `#f7f9fe`):
  - a green check circle and "This consultation is being saved automatically", plus "· offline capture on" when offline mode is on
  - "Add Note" (large secondary) and "Finish & Generate Note" (large primary)
  - both buttons are disabled when idle

## 4.4 Modals

- **Add a note:** "Added to the transcript at {time} and included in the final note". A textarea with the placeholder "For example: Patient prefers tablets over syrup. Work note given for 2 days.", then Cancel and "Add Note". The toast reads "Note added to the consultation".
- **End this consultation?:** "{name} · {mm:ss} recorded" and "Generate the clinical note from what was captured, or discard this recording. A discarded recording cannot be recovered." Buttons: Discard (danger), Keep Recording, Finish & Generate Note.
- **Finish & Generate Note** is wired in Phase 5. For now it shows a toast.

## 4.5 Dashboard while recording

The Dashboard's cards switch to the live session:
- The record card header shows LIVE RECORDING and the timer.
- The caption becomes "Recording · **Emily Davis**" with an "Open consultation →" link.
- The transcript shows the last 5 lines.
- The summary and codes are live.
- The mic toggles pause.

## 4.6 Keyboard

Shortcuts are ignored while typing in inputs or editable text, or while a modal is open:
- **Space** on Dashboard or Consultation: idle opens the picker; otherwise pause or resume.
- **F**: finish.
- **N**: add a note.

## Done when

- [ ] Fever at 1× takes about 68s, and the summary ends exactly like the dashboard summary.
- [ ] Diabetes and cardiology play correctly, with their own codes and summaries.
- [ ] Pause freezes the timer, transcript and waveform. Resume continues.
- [ ] Switching to the Dashboard mid-visit shows the same live state, and switching back continues smoothly.
- [ ] Side by side with `reference/consultation-in-progress.jpeg`, the layout matches.
- [ ] Build and lint pass.
