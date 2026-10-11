# Phase 8 — Templates, Integrations, Team, Settings, Help

**Screens:** in `prototype/`: `17-templates`, `20-integrations`, `21-team`, `22-settings-profile`, `23-settings-preferences`, `24-settings-ai`, `25-settings-billing`, `26-help`.
**Prototype functions:** `pTemplates`, `pIntegrations`, `intgHTML`, `pTeam`, `pSettings`, `pHelp`, and the actions `previewTpl`, `defaultTpl`, `newTemplate`, `saveTpl`, `connectIntg`, `manageIntg`, `discIntg`, `invite`, `sendInvite`, `teamMenu`, `removeMember`, `swSet`, `setFormat`, `setDetail`, `upgrade`, `ticket`.

## 8.1 `/templates`

- **Head:** "Templates" / "Note formats the AI follows when it drafts a clinical note", with a primary "+ New Template" button.
- **Grid** of 3 columns (2 below 1200px, 1 on phones). Each card has a 40px blue template tile, the name (15px/600), "Used n times", a blue "Default" pill on the default, the description, tag chips, and buttons "Preview" and "Set as default" (the latter not on the default).
- **Preview modal:** numbered sections, each with "The AI writes this section from the conversation.".
- **New Template modal:** a name and a sections textarea (one per line, prefilled with "Chief complaint, History, Examination, Assessment, Plan"). The toast reads "Template created".

## 8.2 `/integrations`

- **Head:** "Integrations" / "Connect your EMR so approved notes and codes sync to the chart automatically".
- **Left card "EMR Systems":** one row per `INTEGRATIONS` entry. Each row has a 44px letter tile in the brand color and tint, the name and "Connected · two-way sync of notes, codes and patient list" or "Not connected".
  - Connected rows show a green "Connected" pill and a "Manage" button (menu: Sync now, Disconnect in danger style).
  - Other rows show a blue-text "Connect" button. Clicking it spins for 1.5s, then the row becomes connected with the toast "{name} connected".
- **Right column:**
  - A "Sync Activity" timeline from `SYNC_ACTIVITY`.
  - A note card with a shield icon: "HIPAA-aligned data handling" and "Audio is processed for transcription and then discarded by default. Notes sync over encrypted FHIR R4 connections with a full audit trail."
- Disconnecting Epic makes the EMR card show "No EMR connected" with a "Connect" link, and removes the top bar's green check.

## 8.3 `/team`

- **Head:** "Team" / "People in {practice} who can record, review or bill", with a primary "Invite Member" button.
- **Table:** Member (avatar, or the doctor avatar for the owner; name and email), Role (a blue "Owner" pill for the owner), Specialty / Area, Notes This Month ("—" for 0), Status (Active green, Invited amber), and a dots menu on non-owners (Change role → info toast "Role editing opens here in the full app."; Remove from team → warn toast).
- **Invite modal:** Email (type email, required), Name, Role (Physician, Nurse Practitioner, Medical Assistant, Billing Specialist, Admin). It adds an "Invited" row with the toast "Invite created. In this demo no email is sent.".

## 8.4 `/settings` (tab in the `?tab=` query)

- **Head:** "Settings" / "Your profile, practice and how the AI scribe works".
- **Tabs:** Profile · Practice · Preferences · AI Settings · Billing · Integrations.
- **Profile:** a 64px doctor avatar with the name and "Family Medicine · Owner", then a 2-column form: Full name, Specialty (select), Email, Phone, NPI number, Signature line, and "Save Changes" (toast "Changes saved").
- **Practice:** Practice name (saving it renames the practice everywhere), Practice ID (read-only), Address (full width), Time zone (select), Clinic hours, and "Save Changes".
- **Preferences** (setting rows: bold title, muted description, control on the right):
  - Default transcription language (language menu)
  - Note format (SOAP / H&P / DAP segmented; the toast reads "New notes use {f} format")
  - Auto-save consultations (switch)
  - Offline capture (switch, the same state as the top bar pill)
  - Email me a daily summary (switch)
- **AI Settings:**
  - Auto speaker detection
  - Suggest billing codes
  - Summary detail (Concise / Standard / Detailed)
  - Specialty vocabulary (select)
  - Code confidence threshold (range 50–95, step 5, the live value in the description)
  - Require approval before EMR sync
  - Redact identifiers in exports (this one changes Copy note output)
  - Switches toast "Setting saved".
- **Billing:**
  - Left card: a "Current plan" pill, "Starter" at 22px, "$149 per clinician per month · billed monthly", "AI notes this month 48 of 100" with a progress bar, and an "Upgrade to Pro" button.
  - Right card "Invoices": the last 3 months, "Starter · 6 clinicians", $894.00, a "Paid" pill.
- **Integrations:** the same rows as `/integrations`.

## 8.5 `/help`

- **Head:** "Help & Support" / "Answers, shortcuts and ways to reach the support team".
- **Left card:** "Frequently asked questions" as an accordion (details/summary) from `FAQ`, with a help icon and a rotating chevron. Answers are capped at 70ch.
- **Right column:**
  - "Keyboard shortcuts" from `SHORTCUTS`, with keycap-styled keys.
  - "Contact support": email and phone as selectable text (no mailto or tel links), the hours, and a "Send a message" button.
  - The message modal has Subject and Message fields, and toasts "Message saved. In this demo nothing is sent.".

## 8.6 Upgrade modal (shared; Sidebar, Settings → Billing)

- Title "Upgrade to Pro" / "More AI depth for busy practices".
- "$249" at 30px/700 with "per clinician / month", then 5 feature rows with green check-circles.
- Footer: "Pricing shown is sample data", "Not now", and a green "Start 14-day trial" button (toast "Pro trial started for this demo").

## Done when

- [ ] Every control on these pages does something visible and persists where it makes sense.
- [ ] Changing the practice name updates the sidebar.
- [ ] Turning offline capture off in Settings updates the top bar, and the reverse.
- [ ] Build and lint pass.
