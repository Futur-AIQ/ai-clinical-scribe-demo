# Phase 2 — Data layer and stores

**Goal:** sample data available everywhere through typed stores, built on the client, persisted in the browser, and resettable.

**Read:** `seed/index.ts` and the files it exports. No screenshot is needed for this phase.
**Prototype functions:** `save`, `load`, `rebuildP`, `seedNotes`, `resetR`.

## 2.1 Copy the data

Copy `seed/*` to `src/data/` unchanged, then fix imports only if TypeScript complains. Keep `seed/` as the original.

## 2.2 Hooks (`src/lib/`)

- `useHydrated()`: false on the server and on the first client render, true after mount.
- `format.ts`: re-export the formatters from `src/data/dates.ts`, plus `fmtNumber` (`toLocaleString("en-US")`).

## 2.3 `demo-store.ts` (zustand + persist, key `acs-demo-v1`)

State:
- `ready: boolean` (not persisted)
- `patients: Patient[]` (not persisted; rebuilt from `buildPatients(now)` + `newPatients` + `patientOverrides`, sorted by `lastVisit` descending)
- Persisted: `notes`, `patientOverrides: Record<mrn, Partial<Patient>>`, `newPatients`, `team`, `templates`, `integrations`, `settings`, `practice` ({name, id}), `language`, `offline` (default true), `speed` (1 | 2 | 4, default 1), `notificationsRead`, `lastSync` (ISO)

`settings` defaults: `{ autoSpeaker: true, suggestCodes: true, detail: "Standard", format: "SOAP", redactExports: true, autoSave: true, threshold: 80, vocabulary: "Family Medicine", requireApproval: true, emailSummary: false }`.

Actions:
- `init(now)`: runs once on mount. Builds patients, and seeds notes, team, templates and integrations only where persisted data is missing. Seed notes keep their freshly computed dates even when a persisted copy exists (merge by `id`: take the persisted fields, recompute `date`), so the demo stays current on later days. `lastSync` defaults to now minus 11 minutes. Sets `ready: true`.
- Selectors/helpers: `patientByMrn(mrn)`, `noteById(id)`, `sortedNotes()` (date descending), `notesForPatient(mrn)`.
- Notes: `upsertNote(note)`, `updateNote(id, patch)`, `addAudit(id, action)` (timestamped now), `setCodeIncluded(id, index, on)`, `addCode(id, code)` (confidence 0 = manual), `editSoap(id, key, text)` (marks the section edited and logs "Edited Subjective/Objective/Assessment/Plan" only once per section).
- Patients: `updatePatient(mrn, patch)` (writes to overrides), `addPatient(p)`, `archivePatients(mrns)`, `restorePatient(mrn)`.
- Team: `invite(member)`, `removeMember(index)`. Templates: `addTemplate`, `setDefaultTemplate(id)`. Integrations: `setConnected(id, on)`.
- Preferences: `setLanguage`, `toggleOffline`, `setSpeed`, `setPractice`, `updateSettings(patch)`, `markNotificationsRead`, `touchSync()`.
- `resetDemo()`: removes the localStorage key and reloads the page.

Use the `createJSONStorage` wrapper with a `try`/`catch` around `localStorage`, so private windows and blocked storage fall back to memory without errors.

## 2.4 `ui-store.ts` (not persisted)

`drawerOpen`, `modal` (a discriminated union naming the open modal plus its props) with `openModal`/`closeModal`, and the toast queue behind `toast()`.

## 2.5 AppShell wiring

AppShell calls `init(new Date())` once in an effect. Until `ready` it renders the sidebar and top bar plus a light skeleton: three gray rounded blocks in the content area. No data-driven text appears before `ready`.

## 2.6 Prove it

Temporary: on the Dashboard placeholder, show "1,248 patients · 6 notes" from the store. Remove it in Phase 3.

## Done when

- [ ] No hydration warnings in the browser console.
- [ ] Refreshing keeps a change (for example toggling Offline Mode).
- [ ] `resetDemo()` from the console restores the defaults.
- [ ] Patients count 1,248, of which 86 are new; notes count 6.
- [ ] Build and lint pass.
