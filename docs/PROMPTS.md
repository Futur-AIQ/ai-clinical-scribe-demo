# Claude Code prompts — phase by phase

How to use this file:
- Paste **one step at a time** into Claude Code and wait for it to finish and summarize.
- After each step: run `npm run dev`, check the page against the screenshot named in the step, then commit (`git add -A && git commit -m "…"`). Commit messages are suggested below.
- Type `/clear` at the end of each **phase** (not each step). `CLAUDE.md` loads automatically, so a fresh session still knows the project.
- If something looks wrong, reply in the same session with the screenshot name and what differs, for example: "The summary rows have too much padding compared to docs/screens/reference/dashboard.jpeg. Fix it."
- On the Pro plan, if you hit the usage limit mid-step, wait for the reset and send: "Continue the current step from where you stopped."

---

## Phase 0 — Project setup (you, in a terminal)

```bash
npx create-next-app@latest ai-clinical-scribe-demo --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
cd ai-clinical-scribe-demo
npm install zustand lucide-react clsx
```

If it asks extra questions (Turbopack and so on), accept the defaults.

Copy everything from the starter kit's `ai-clinical-scribe-demo/` folder into the new project folder: `CLAUDE.md`, `docs/`, `seed/`, and `public/logo-mark.png` with `public/logo-full.png`. Merge into `public/` when asked.

Then open the folder in VS Code, open the terminal, run `claude`, and paste:

### Step 0.1 — Check the setup

```
Read CLAUDE.md and list the files in docs/specs and seed. Then check package.json and tell me the installed versions of next, react, tailwindcss, zustand and lucide-react, and confirm Tailwind is v4 with @import "tailwindcss" in src/app/globals.css.
Do not build any feature yet. Only replace the default create-next-app home page content with a plain "Setup OK" text, and remove the default Next.js SVGs from public/ (keep logo-mark.png and logo-full.png).
Run npm run build and npm run lint and report the result.
```

Commit: `chore: project setup with starter kit`

---

## Phase 1 — Design system and app shell

### Step 1.1 — Tokens, fonts and UI primitives

```
Phase 1, step 1. Read docs/specs/01-design-system-shell.md, sections 1.1 and 1.2 only.
Look at docs/screens/prototype/01-dashboard.png for the visual style.
If you need an exact CSS value, grep docs/prototype.html for the class name (for example ".card-h" or ".btn") and read only those lines.
Build the tokens in globals.css, the root layout (Inter font, metadata, icon) and every UI primitive in src/components/ui.
Add a temporary page at /ui-preview that shows each primitive in its variants, so I can check them.
Finish with the build/lint result and a summary.
```

Commit: `feat: design tokens and UI primitives`

### Step 1.2 — Sidebar, top bar, routes

```
Phase 1, step 2. Read docs/specs/01-design-system-shell.md sections 1.3 to 1.5.
Match docs/screens/reference/dashboard.jpeg and docs/screens/prototype/01-dashboard.png for the sidebar and top bar, and 27-notifications-menu.png and 28-profile-menu.png for the menus.
Prototype references: renderSide and renderTop in docs/prototype.html (grep, then read only those functions).
The menus can use hard-coded values for now (language "English (US)", offline on, 3 notifications); Phase 2 connects them to the store.
Build the (app) route group with AppShell, Sidebar, Topbar, the drawer below 900px, every placeholder route and not-found.
Check every item in the "Done when" list and report.
```

Commit: `feat: app shell with sidebar, top bar and routes`

Then `/clear`.

---

## Phase 2 — Data layer and stores

### Step 2.1 — Data, stores and hydration

```
Phase 2. Read docs/specs/02-data-store.md.
Copy seed/ to src/data/, then build src/lib (useHydrated, format), src/store/demo-store.ts with persist, and src/store/ui-store.ts, and wire init() and the skeleton into AppShell.
Connect the Phase 1 top bar to the store: language, offline mode, notifications read, practice switcher, toasts.
Add the temporary "1,248 patients · 6 notes" proof on the Dashboard.
Check the "Done when" list, including that the browser console has no hydration warnings, and report.
```

Commit: `feat: demo data store with persistence`

Then `/clear`.

---

## Phase 3 — Dashboard

### Step 3.1 — Dashboard cards

```
Phase 3. Read docs/specs/03-dashboard.md.
The target is docs/screens/reference/dashboard.jpeg; also see docs/screens/prototype/01-dashboard.png.
Prototype references: pDash, recentCard, transcriptCard, tlistHTML, summaryCard, sumHTML, codesCard, emrCard, lineChart, and frame (the waveform). Grep each and read only that function.
Build the components so they can later accept a live data source (props: lines, summary, codes, a live flag) without a rewrite.
Remove the temporary Phase 2 proof text.
Compare your result with the reference screenshot section by section and list any differences you couldn't fix.
```

Commit: `feat: dashboard`

Then `/clear`.

---

## Phase 4 — Recording engine and Consultation page

### Step 4.1 — Engine and case picker

```
Phase 4, step 1. Read docs/specs/04-consultation.md sections 4.1, 4.2 and 4.6.
Prototype references: startRec, togglePause, the setInterval tick, srcLive, applyReveal, pickModal, pickList.
Build src/store/recording-store.ts and the CasePickerModal (match docs/screens/prototype/02-case-picker-modal.png).
Wire the Dashboard mic button and the Space key to open the picker, and make Start Recording navigate to /consultation (the page can stay a placeholder that shows the timer and the raw transcript text for now).
Report how you verified the fever case ends with the full summary.
```

Commit: `feat: scripted recording engine and case picker`

### Step 4.2 — Consultation page

```
Phase 4, step 2. Read docs/specs/04-consultation.md sections 4.3 to 4.5.
The target is docs/screens/reference/consultation-in-progress.jpeg; also see prototype/03-consultation-live.png, 04-dashboard-while-recording.png, 05-consultation-complete-evidence-open.png, 06-add-note-modal.png and 07-end-consultation-modal.png.
Prototype references: pConsult, live, and the actions endConsult, discard, addNote, saveCNote, copyTx, toggleRow, fullSummary.
Build the full /consultation page, the Add Note and End modals, the full summary modal, and the Dashboard's live mode.
Finish & Generate Note shows a toast for now.
Check the "Done when" list and report.
```

Commit: `feat: live consultation page`

Then `/clear`.

---

## Phase 5 — Note generation, review and sync

### Step 5.1 — Generate and review

```
Phase 5, step 1. Read docs/specs/05-note-review.md sections 5.1 and 5.2.
Match docs/screens/prototype/08-generating-note-modal.png and 09-note-review.png.
Prototype references: generateNote, pNote, the actions toggleCode, addCode, saveDraft, and the [data-soap] input listener.
Wire Finish & Generate Note (on the page, in the End modal and on the F key) to the generating modal, then build /notes/[id] with editing, codes, the patient card and the audit trail.
```

Commit: `feat: AI note generation and review`

### Step 5.2 — Approve, sync, amend, copy

```
Phase 5, step 2. Read docs/specs/05-note-review.md sections 5.3 and 5.4 and the "Done when" list.
Match docs/screens/prototype/10-sync-modal.png and 11-note-completed.png.
Prototype references: syncModal, noteText, and the actions approve, amend, cancelAmend, copyNote.
Build the sync modal, the Completed read-only state, Amend, and Copy note. Then walk through the full loop in the "Done when" list and report each item.
```

Commit: `feat: approve and sync to EMR`

Then `/clear`.

---

## Phase 6 — Patients

### Step 6.1 — Patients list

```
Phase 6, step 1. Read docs/specs/06-patients.md section 6.1.
The target is docs/screens/reference/patients.jpeg; also see prototype/12-patients.png, 13-patients-filter-menu.png and 14-new-patient-modal.png.
Prototype references: pPatients, ptableHTML, filteredP, and the actions ptab, pgo, selP, selAll, bulkArchive, pfilter, pMenu, archiveP, newPatient, submitNP.
Keep search fast (filter in a useMemo, and render only the current page of 10).
```

Commit: `feat: patients list`

### Step 6.2 — Patient record

```
Phase 6, step 2. Read docs/specs/06-patients.md section 6.2 and the "Done when" list.
Match docs/screens/prototype/15-patient-detail.png. Prototype references: pPatient, genVisits, and the actions startFor, pdtab.
Build /patients/[mrn] and wire "Start consultation" everywhere it appears (row menu, record page).
Check the "Done when" list and report.
```

Commit: `feat: patient record`

Then `/clear`.

---

## Phase 7 — Notes, Analytics, Billing Codes

### Step 7.1 — Notes and Billing Codes

```
Phase 7, step 1. Read docs/specs/07-notes-analytics-billing.md sections 7.1 and 7.3.
Match docs/screens/prototype/16-notes.png and 19-billing-codes.png. Prototype references: pNotes, ntableHTML, pBilling, btableHTML.
```

Commit: `feat: notes list and billing codes`

### Step 7.2 — Analytics

```
Phase 7, step 2. Read docs/specs/07-notes-analytics-billing.md section 7.2 and the "Done when" list.
Match docs/screens/prototype/18-analytics.png. Prototype references: pAnalytics, donut, gauge, and the existing LineChart component.
Build Donut and Gauge in src/components/charts and the /analytics page.
```

Commit: `feat: analytics`

Then `/clear`.

---

## Phase 8 — Templates, Integrations, Team, Settings, Help

### Step 8.1 — Templates, Integrations, Team

```
Phase 8, step 1. Read docs/specs/08-templates-integrations-team-settings-help.md sections 8.1 to 8.3.
Match docs/screens/prototype/17-templates.png, 20-integrations.png and 21-team.png.
Prototype references: pTemplates, pIntegrations, intgHTML, pTeam, and the related actions.
```

Commit: `feat: templates, integrations and team`

### Step 8.2 — Settings, Help, Upgrade

```
Phase 8, step 2. Read docs/specs/08-templates-integrations-team-settings-help.md sections 8.4 to 8.6 and the "Done when" list.
Match docs/screens/prototype/22-settings-profile.png, 23-settings-preferences.png, 24-settings-ai.png, 25-settings-billing.png and 26-help.png.
Prototype references: pSettings, pHelp, and the actions upgrade, ticket, swSet, setFormat, setDetail.
Replace the Phase 1 placeholder Upgrade modal with the real one.
```

Commit: `feat: settings, help and upgrade`

Then `/clear`.

---

## Phase 9 — Presenter controls, polish, deploy

### Step 9.1 — Presenter panel and polish

```
Phase 9, step 1. Read docs/specs/09-polish-deploy.md sections 9.1 and 9.2.
Match docs/screens/prototype/29-presenter-panel.png, 30-phone-width-dashboard.png and 31-phone-width-drawer.png.
Build the demo badge and presenter panel, then do the polish pass page by page at 1440px and at 390px. Remove the /ui-preview page.
List what you changed in the polish pass.
```

Commit: `feat: presenter controls and polish`

### Step 9.2 — QA and README

```
Phase 9, step 2. Read docs/specs/09-polish-deploy.md sections 9.3 and 9.4.
Go through the QA script step by step. Where you can't click in a browser, verify by reading the code paths, and tell me which steps I need to check by hand.
Fix any problems you find, write README.md, and finish with a clean npm run build and npm run lint.
```

Commit: `docs: README and final QA`

### Deploy (you)

1. Create the GitHub repo `ai-clinical-scribe-demo` (private) and push.
2. In Vercel: Add New → Project → import the repo → framework Next.js → Deploy. No environment variables are needed.
3. Open `https://<project>.vercel.app`, click the Demo badge, and choose Reset before every client session.
