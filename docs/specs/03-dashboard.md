# Phase 3 — Dashboard (idle state)

**Goal:** the Dashboard exactly as in the screenshot, using seed data. The live recording behaviour comes in Phase 4; build the cards so they can take live data later.

**Screens:** `docs/screens/reference/dashboard.jpeg` (target) and `docs/screens/prototype/01-dashboard.png`.
**Prototype functions:** `pDash`, `recentCard`, `transcriptCard`, `tlistHTML`, `summaryCard`, `sumRows`, `sumHTML`, `codesCard`, `codesHTML`, `emrCard`, `lineChart`, `frame` (waveform).

## Layout

- Page head: "Welcome back, Dr. Sarah Johnson 👋" (the emoji waves once on load) and "Here's what's happening with your practice today."
- Two columns (`1.62fr 1fr`, 20px gap):
  - **Left:** Start New Consultation, Live Transcription, Recent Consultations.
  - **Right:** AI Summary, Billing Codes, EMR Integration, Consultation Analytics.

## Cards

**Start New Consultation** (`components/consultation/RecordCard.tsx`, variant `dashboard`)
- Header: "Start New Consultation". On the right, idle shows a gray dot with "READY" and a faint "00:00"; live shows a blinking red dot with "LIVE RECORDING" and the timer at 17px.
- Body: a grid with a 210px left column and a vertical divider.
  - Left: the mic button group. A 142px halo circle (two-tone radial blue at 9% and 4.5%) holds the 94px mic button: radial gradient `#2f74ff → #1450e6`, a 7px white ring, then a 2px ring of rgba(26,92,244,.32), plus a soft shadow, with a 38px white mic icon. Below it, the caption "Click to start recording / or press the space bar" in 13px muted.
  - Right: the waveform canvas (78px high, full width) above the tip box (blue-50, radius 10): "**Tip:** Speak clearly and allow AI to capture the full conversation for best results." with "Tip:" in blue/500.
- Clicking the mic or pressing Space opens the case picker. Phase 4 builds it; for now, show a toast "Case picker arrives in Phase 4".

**Waveform** (`Waveform.tsx`, canvas, devicePixelRatio aware)
- Bars 2.6px wide with a 3.4px gap, centered vertically, filled with a horizontal gradient: `#1a5cf4` 0%, `#2c78f5` 50%, `#1aa5c9` 78%, `#14b8a6` 100%.
- Bar height = |mix of 3 sines at different speeds| × an envelope across the width × level × height. Every 9th bar has a small minimum height.
- Level eases toward a target: idle 0.55 moving slowly, recording and speaking 1.0, recording silent 0.3, paused 0.05.
- One `requestAnimationFrame` loop shared by all waveforms. With reduced motion it runs at a tenth of the speed.

**Live Transcription** (`TranscriptCard.tsx`)
- Header: blue audio-lines icon, "Live Transcription", green "Real-time" pill.
- Rows: grid `56px 1fr auto`, 13.5px, 8px vertical padding. "Doctor:" in blue/500, "Patient:" in green/500, the text, then the timestamp (12px muted, tabular).
- Idle data: the first 4 lines of the fever case, timestamps from note `n1003`'s date + 15s + each line's `at`.
- Footer: a small teal 4-bar equalizer (static) and "Last session · Emily Davis · **Open note**" (link to `/notes/n1003`).

**Recent Consultations**
- Header with a "View All →" link to `/notes`.
- Table columns: Patient (36px avatar, name, "MRN: 12345678"), Date (date over time, muted), Duration, Status (StatusPill), Actions (file icon button opening the note, vertical-dots menu with Open note, Open patient and Copy note text).
- Data: the 4 newest notes. A row click opens the note.

**AI Summary** (`SummaryCard.tsx`, variant `dashboard`)
- Header: blue sparkles icon, "AI Summary", "View Full Summary →" link (opens the full summary modal, see below).
- Four rows: grid `44px 1fr`, 13px 20px padding.
  - Each row has a 44px tile, radius 11, with a 22px icon: Key Symptoms (stethoscope, blue), Probable Diagnosis (clipboard-plus, green), Medications (pill, purple, filled look), Treatment Plan (file-text, amber).
  - Each row shows the title (13.5px/600) above the value (12.8px ink-2, line-height 1.6).
  - Diagnosis splits at "\n" onto two lines. Medications show one per line. The plan joins with spaces.
- Idle data: the full fever summary, built by applying every `reveal` of the fever case.

**Full summary modal:** the patient line, then sections for Key Symptoms, Probable Diagnosis, Medications, Treatment Plan, Allergies, Vitals and Findings, and Billing Codes (pill + description). The footer says "From the last session" or "Updates as the visit continues".

**Billing Codes** (`CodesCard.tsx`): receipt icon, "Billing Codes", "View All Codes →" link to `/billing-codes`. Rows use the grid `52px 74px 1fr`: type (500), a code pill (blue-50/blue, 600, centered, radius 7), and the description (12px ink-2). Idle codes, in this order: B34.9, 99213, R50.9.

**EMR Integration** (`EmrCard.tsx`): a 30px green cloud-upload icon, "EMR Integration" over "Connected to **Epic Systems**", and a green "Synced" pill. The footer reads "Last sync: Today, 10:29 AM" (from `lastSync`) with a "Sync Now" button (blue text, refresh icon). Clicking it spins the icon, shows the pill as blue "Syncing…" for 1.5s, then updates the time and shows the toast "Synced with Epic · 0 conflicts".

**Consultation Analytics (This Week)**
- "View Analytics →" link to `/analytics`.
- Four stats from `WEEK_STATS` (label 11.5px ink-2, value 17px/600, green up-arrow delta; the 4th delta is amber).
- `LineChart` (components/charts) of `WEEK_SERIES` with weekday labels for the last 7 days ending today, 140px high.

**LineChart** (SVG, viewBox 560×150 by default)
- Left padding 30, 4 gridlines (0, ⅓, ⅔ and max of a "nice" maximum), tick labels 10px muted.
- An area under the line with a blue gradient from 18% to 0%, and a 2px blue line.
- Points are white circles with a blue 2px stroke (r 3.2); the last point is filled blue at r 4.5. Each point has a `<title>` tooltip.
- Labels show every n-th point, always including the last.

## Done when

- [ ] Side by side with `reference/dashboard.jpeg`, the layout, sizes, colors and copy match. Avatars are initials instead of photos.
- [ ] The waveform animates gently while idle.
- [ ] Every link and menu works, and a row click opens `/notes/<id>` (still a placeholder page).
- [ ] At 1100px the columns stack, and at 390px nothing overflows.
- [ ] Build and lint pass.
