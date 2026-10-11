# Phase 9 — Presenter controls, polish, QA and deploy

**Screens:** `prototype/29-presenter-panel`, `30-phone-width-dashboard`, `31-phone-width-drawer`.
**Prototype functions:** `presenter`, `resetAsk`, `resetDo`, and the `keydown` listener.

## 9.1 Demo badge and presenter panel

- **Fixed badge** at the bottom-left (left 18px, bottom 14px): a navy `#0f1c3f` pill with a green dot and "Demo · Sample data", 12px/500, with a shadow. It is visible on every page and opens the presenter panel.
- **Presenter panel** (modal):
  - Title "Presenter controls", subtitle "Settings for running the live demo. Your client never sees this panel unless you open it."
  - Rows:
    - Playback speed (1× / 2× / 4×)
    - "Run a sample visit" with a "Choose visit" button, which opens the case picker
    - Keyboard ("Space start or pause · F finish · N add note", with keycaps)
    - "Reset demo data" with "Removes notes, patients and settings created in this browser" and a danger "Reset" button. The button turns into an inline confirm with "Cancel" and "Confirm reset", and confirming calls `resetDemo()`.
  - Footer: "All names, records and codes in this demo are fictional."
- The profile menu's "Presenter controls" item opens the same panel.

## 9.2 Polish pass

- Toast wording matches the specs. No `console.log` left behind.
- Loading skeleton before `ready`, with no flash of wrong data.
- Every icon-only button has an `aria-label`, and focus rings are visible.
- `prefers-reduced-motion` turns off the rings, flash, caret blink and emoji wave, and slows the waveform.
- **Phone width (390px) on every page:**
  - The drawer works.
  - Grids stack, and the KPI rows show 2 columns.
  - Tables scroll inside their cards.
  - Modals fit (case cards stack).
  - The transcript timestamp moves under the text.
  - Nothing scrolls the page sideways.
- Page `<title>`s: "{Page} · AI Clinical Scribe".
- `not-found` and an unknown note or patient id both show the empty state.

## 9.3 QA script (run through it in the browser and report the results)

1. Fresh load (Reset first). Dashboard matches `reference/dashboard.jpeg`.
2. Press Space, choose Diabetes, 2×. Watch the summary fill in. Pause and resume. Open the Dashboard mid-visit, then come back.
3. Add a note. Finish & Generate Note. Edit the Assessment. Remove R03.0, add 2028F. Approve & Sync.
4. Notes shows it Completed and Synced. Robert's record shows the new visit at the top.
5. Run Fever for Emily at 4×. It completes her In Progress note (no duplicate).
6. Patients: search, filter, archive 2, then restore them. New Patient. Reload: everything kept.
7. Disconnect Epic, then check the dashboard EMR card and the top bar. Reconnect.
8. Settings: rename the practice, toggle redaction, then Copy note: it shows the redacted header.
9. Reset demo data: back to the defaults.

## 9.4 Deploy

- `npm run build` must pass clean.
- Add a `README.md` covering what the demo is, `npm install` / `npm run dev`, a presenter tips section (Space to start, 2× speed for live demos, Reset before each client session), and "Deploy: import the GitHub repo in Vercel, framework Next.js, no environment variables".
- No `vercel.json` is needed.

## Done when

- [ ] The QA script passes end to end, with no console errors.
- [ ] `npm run build` and `npm run lint` are clean.
- [ ] The README is written.
