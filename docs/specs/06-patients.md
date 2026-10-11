# Phase 6 — Patients list and patient record

**Screens:** `reference/patients.jpeg` (target), and in `prototype/`: `12-patients`, `13-patients-filter-menu`, `14-new-patient-modal`, `15-patient-detail`.
**Prototype functions:** `pPatients`, `ptableHTML`, `filteredP`, `pPatient`, `genVisits`, and the actions `ptab`, `pgo`, `selP`, `selAll`, `bulkArchive`, `pfilter`, `pMenu`, `archiveP`, `newPatient`, `submitNP`, `startFor`, `pdtab`.

## 6.1 `/patients`

- **Head:** "Patients" / "Manage and view all your patients".
- **Head actions:**
  - a search box (340px) with the placeholder "Search patients by name, MRN, phone or email…" that matches name, MRN digits, phone digits and the generated email
  - a "Filters" button, which shows a small blue "On" pill when any filter is set
  - a primary "+ New Patient" button
- **KPI row** (4 cards, 20px gap). Each card has a 48px icon tile, a label, a 22px/600 value and a green "↑ x% vs last month" (the "vs last month" part muted):
  - Total Patients (users, blue) = count, "12%"
  - New Patients (user-plus, green) = count of `isNew`, "8%"
  - Consultations (calendar, amber) = sum of visits, "15%"
  - Avg. Visits / Patient (clock, purple) = visits ÷ patients, one decimal, "5%"
- **Tabs:**
  - All Patients
  - Recent (last visit within 30 days)
  - Frequent Visitors (4 or more visits)
  - New Patients
  - Archived (only archived; every other tab hides archived patients)
- **Filters menu** (260px): selects for Status (Any, Active, Inactive), Sex (Any, Female, Male) and Age (Any, Under 18, 18–64, 65 and over), plus "Reset filters". It applies immediately.
- **Table** (inside a card, horizontally scrollable)
  - Columns: checkbox, Patient (38px avatar, name, "34 / Female"), MRN ("MRN-12345678" muted), Last Visit, Last Consultation (date over "10:30 AM • 14:32 min"), Total Visits (centered), Phone, Status, Actions (horizontal dots).
  - A row click opens `/patients/{mrn}`; the checkbox and menu clicks don't.
  - Row menu: View profile, Start consultation, a separator, then "Archive patient" in danger style, or "Restore patient" when archived.
  - Selection: the header checkbox toggles the current page. With any rows selected, a blue-50 bar above the table shows "{n} selected" with "Archive" and "Clear". The archive toast is "{n} patients archived".
  - Empty state: "No patients match these filters." with "Clear search and filters".
- **Pagination:** 10 per page. "Showing 1 to 10 of 1,248 patients" on the left. On the right, prev/next bordered chevron buttons around the numbers in the form 1 2 3 … 125, with the current page in blue-50.
- **New Patient modal:** First name, Last name, Age, Sex, Phone, Insurance. Native validation runs on submit. The new patient gets a random 8-digit MRN starting with 2, 0 visits, Active, new, and the toast "{name} added · MRN-{mrn}". They appear at the top of All Patients.

## 6.2 `/patients/[mrn]`

- **Head:** a "← Patients" link above the title "Patient Record". Actions: "More" (the same row menu) and a primary "Start Consultation" button with a mic icon.
  - Start Consultation uses that patient's own case if there is one (Emily, Robert, David), otherwise the fever script.
  - If a recording is already running, it toasts "Finish the current consultation first." and goes to `/consultation`.
- **Hero card:**
  - A 64px avatar, the name at 20px/600, "age / sex · MRN-… · {n} visits".
  - Chips: status, conditions (gray chips), and a red allergy pill when the patient has a real allergy.
  - For case patients, a tip box: "Sample visit available: **{specialty}**. Start a consultation to play it."
  - A facts strip of 4 cells (2 on phones): Date of birth (derived from the age and the MRN digits), Phone, Email, Insurance.
- **Tabs:**
  - Visit History: the patient's notes plus generated older visits, newest first. Each row shows the date over the time, the reason over "{dur} min · Dr. Sarah Johnson", a status pill, and "View note →" or "Archived note".
  - Notes ({n}): the AI notes with a snippet of the assessment, or an empty state with a Start Consultation button.
  - Details: a read-only grid of Full name, Sex, Allergies, Conditions, Primary physician and EMR record ("Epic · Patient ID EPC-{last 6 digits}").
- An unknown MRN shows the "could not be found" empty state.

## Done when

- [ ] The first page matches `reference/patients.jpeg`: same 7 people in the same order, plus 3 generated.
- [ ] Search "robert" finds Robert Williams, and "5554" style phone digits match.
- [ ] Tabs, filters, pagination, bulk archive, restore and New Patient all work and persist after a reload.
- [ ] Starting a consultation from Robert's record plays the diabetes case.
- [ ] Build and lint pass.
