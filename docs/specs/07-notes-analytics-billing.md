# Phase 7 — Notes list, Analytics and Billing Codes

**Screens:** in `prototype/`: `16-notes`, `18-analytics`, `19-billing-codes`. Analytics is based on the analytics panel in `reference/all-screens-overview.jpeg`.
**Prototype functions:** `pNotes`, `ntableHTML`, `pAnalytics`, `anData`, `donut`, `gauge`, `pBilling`, `btableHTML`.

## 7.1 `/notes`

- **Head:** "Notes" / "Every AI-drafted and approved clinical note". Actions: a search box ("Search notes…", matching patient, diagnosis and codes) and a primary "New Consultation" button with a mic icon, going to `/consultation`.
- **Tabs with faint counts:** All, Draft, In Progress, Completed.
- **Table:**
  - Columns: Patient (avatar, name, MRN), Note (dx, 500), Date (date over time), Duration, Codes (up to 3 small code pills, then "+n"), EMR ("Synced" green pill with an icon, or a gray "Not sent" pill), Status.
  - A row click opens the note. Empty state: "No notes match."

## 7.2 `/analytics`

- **Head:** "Analytics" / "Documentation volume, coding and quality across {practice}". On the right, a segmented control: Last 7 days · Last 30 days (default) · Last 90 days.
- **Data:** everything comes from `analyticsFor(range, now)`.
- **KPI row:** each card shows a 48px tile, label, value and "↑ delta vs previous period":
  - Total Consultations (stethoscope, blue)
  - Avg. Duration (clock, green)
  - Completion Rate (check-circle, purple)
  - Notes Generated (file-text, amber)
- **Row 2** (`2fr 1fr`):
  - "Consultations Over Time", with "per day" or "per week" faint on the right, and a LineChart of 640×220 using `labelEvery`.
  - "By Encounter Type", with a `Donut` (140px, ring width 16, 2px gaps between segments, center shows "62%" with "Office Visit" below) and a legend of colored dots with the percentage right-aligned.
- **Row 3** (3 columns):
  - "Top Diagnoses": `TOP_DIAGNOSES × factor` (rounded). Each bar row shows the label, "n (p%)" right-aligned (p = n ÷ consultations), and a 7px track with a blue fill scaled to the top value.
  - "Satisfaction Score": a `Gauge` (180×104 half arc, track line-2 13px, blue value arc, center "4.7 / 5") with "↑ 0.3 vs previous period" and "From 214 post-visit clinician ratings".
  - "Time Saved": "{notes × 6.4 ÷ 60, 1 decimal} h" at 28px/600 with "Estimated documentation time saved, at 6.4 minutes per note", then the 3 `QUALITY_BARS` as green bars.

## 7.3 `/billing-codes`

- **Head:** "Billing Codes" / "ICD-10 and CPT codes suggested by the AI in the last 30 days", with a search box on the right ("Search code or description…").
- **KPI row** from `BILLING_KPIS` (tile, label, value).
- **Tabs:** All codes, ICD-10, CPT.
- **Table** from `BILLING_USAGE`:
  - Columns: Code (pill), Type, Description (wraps, min-width 220px), Times Used, Acceptance (the percentage plus a 90px bar, green, or amber below 88%), and an amber "Review" pill when acceptance is under 88%.

## Done when

- [ ] The notes tabs and counts match the store, and a note approved in Phase 5 shows Synced.
- [ ] The analytics range switch updates every number and the chart. Chart labels never overlap.
- [ ] The billing filters and search work.
- [ ] Build and lint pass.
