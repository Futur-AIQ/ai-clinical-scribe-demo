# AI Clinical Scribe — live demo app

A clickable demo of Hansa Technologies' **AI Clinical Scribe**: a doctor records a consultation, the AI transcribes it live, builds a summary and billing codes, drafts a SOAP note, and syncs it to the EMR.

**It is a demo.** There is no backend, no real microphone, no real AI and no real EMR. Consultations are scripted and play back as if live. All data is fictional and lives in the browser.

## Source of truth

1. `docs/specs/NN-*.md`: what to build in the current phase. Read only the spec named in the prompt.
2. `docs/screens/prototype/*.png`: how each screen and state must look. Match these closely.
3. `docs/screens/reference/*.jpeg`: the original product screenshots the prototype was built from.
4. `docs/prototype.html`: the working HTML prototype (one file, ~170 KB). **Do not read it whole.** When a spec says "see `pConsult` in the prototype", grep for that function name and read only that region.
5. `seed/`: typed sample data. Copied to `src/data/` in Phase 2. Do not invent other data.

If a spec and a screenshot disagree, follow the screenshot and mention it in your summary.

## Stack

- Next.js (App Router, the version `create-next-app@latest` installed), TypeScript strict, `src/` directory, `@/*` alias
- Tailwind CSS v4 (CSS-first: tokens in `@theme` inside `src/app/globals.css`, no `tailwind.config` file)
- `lucide-react` for every icon, `zustand` for state (with `persist`), `clsx` for class names
- Font: Inter via `next/font/google` (weights 400, 500, 600, 700)
- **Do not add** other UI kits (no shadcn/ui, MUI, Chakra), chart libraries, animation libraries, date libraries or a backend. Charts are hand-written SVG.

Commands: `npm run dev`, `npm run build`, `npm run lint`.

## Folder structure

```
src/
  app/
    layout.tsx                 root: <html>, Inter font, metadata, icon
    page.tsx                   redirects to /dashboard
    (app)/layout.tsx           AppShell: Sidebar + Topbar + <main>, global modals, toasts, demo badge
    (app)/dashboard/page.tsx
    (app)/consultation/page.tsx
    (app)/notes/page.tsx
    (app)/notes/[id]/page.tsx  note review
    (app)/patients/page.tsx
    (app)/patients/[mrn]/page.tsx
    (app)/templates/page.tsx
    (app)/analytics/page.tsx
    (app)/billing-codes/page.tsx
    (app)/integrations/page.tsx
    (app)/team/page.tsx
    (app)/settings/page.tsx    tabs via ?tab=profile|practice|preferences|ai|billing|integrations
    (app)/help/page.tsx
    not-found.tsx
  components/
    ui/                        Card, Button, Pill, StatusPill, Avatar, Tabs, Segmented, Switch,
                               Modal, Menu (floating), Toast, Input, Select, Checkbox, EmptyState
    layout/                    AppShell, Sidebar, Topbar
    charts/                    LineChart, Donut, Gauge (SVG)
    consultation/              RecordCard, Waveform, TranscriptCard, SummaryCard, CodesCard,
                               EmrCard, CasePickerModal, GeneratingModal, AddNoteModal, EndModal
    notes/, patients/, ...     page-specific pieces
  data/                        copy of seed/ (Phase 2)
  store/                       demo-store.ts (persisted data), recording-store.ts (live engine), ui-store.ts
  lib/                         format helpers, hooks (useHydrated, useNow), sync/generation helpers
```

Prototype hash routes map to app paths: `#dashboard`→`/dashboard`, `#consult`→`/consultation`, `#note-<id>`→`/notes/<id>`, `#patient-<mrn>`→`/patients/<mrn>`, `#billing`→`/billing-codes`, others by the same name.

## Design system (copy exactly)

Single light theme. No dark mode.

| Token | Value | Use |
|---|---|---|
| bg | `#f5f7fb` | page background |
| surface | `#ffffff` | cards, sidebar, top bar |
| surface-2 | `#fafbfd` | table header, hover |
| line | `#e6eaf2` | card borders, dividers |
| line-2 | `#eef1f6` | inner dividers |
| ink | `#0e1b3d` | main text |
| ink-2 | `#36425f` | secondary text |
| muted | `#68728c` | captions, timestamps |
| faint | `#97a0b5` | placeholders |
| navy | `#173a8c` | "AI Clinical Scribe" brand text |
| blue / blue-600 / blue-50 / blue-100 | `#1a5cf4` / `#134fdc` / `#eef3ff` / `#dbe5ff` | primary |
| green / green-600 / green-50 | `#10915e` / `#0c7f52` / `#e6f6ee` | success, "Patient:", Upgrade button |
| teal | `#14b8a6` | waveform gradient end, equalizer |
| red / red-50 | `#ef4444` / `#fff1f1` | live dot, End Consultation, badges |
| amber / amber-50 | `#f08c00` / `#fff4e3` | Treatment Plan tile, warnings |
| purple / purple-50 | `#8b5cf6` / `#f2edff` | Medications tile, AI Draft |
| gray-50 | `#f1f3f7` | neutral pills, segmented control |

- **Radius:** cards 14px; buttons and inputs 9px (large buttons 10px); summary icon tiles 11px; pills fully rounded.
- **Shadow:** cards `0 1px 2px rgba(15,32,80,.04), 0 3px 10px rgba(15,32,80,.035)`; modals and menus `0 18px 50px rgba(15,32,80,.18)`.
- **Type:** base 14px Inter. Page title 23px/600, page subtitle 14px muted. Card title 15.5px/600. Body 13–13.5px. Labels 12–12.5px. Table header 12px/500 ink-2. Timestamps and numbers use `tabular-nums`.
- **Layout:** sidebar 248px fixed; top bar 62px, sticky; content padding 26px 28px. Main grids use columns `1.62fr 1fr` with a 20px gap, stacking to one column below 1200px. Below 900px the sidebar becomes a slide-in drawer opened from a hamburger in the top bar.
- **Card header:** 58px minimum height, padding 16px 20px, bottom border line-2, title on the left, a blue link or actions on the right.
- **Buttons:** 38px high (sm 30px, lg 46px). Primary is blue with a soft blue shadow. Secondary is white with a line border. Danger-outline is a red-tinted background with red text.
- **Pills:** 11.5px/500, padding 3px 10px. Completed = green-50/green with a check-circle icon; In Progress = blue-50/blue; Draft = gray-50/ink-2; AI Draft = purple-50/purple; Active = green; Inactive = gray; Archived = amber.
- **Avatars:** patients get initials on a pastel background (`avatarColors()` in seed/patients.ts). The doctor is "SJ" on a peach gradient `#ffd9c7 → #f6b39a`, text `#7a2e12`.
- **Logo:** `public/logo-mark.png` (Hansa "H" mark), 40×40, beside "AI Clinical Scribe" (19px/700 navy) and "Your AI Assistant" (12.5px muted). `public/logo-full.png` is the full wordmark, kept for future use.
- **Icons:** lucide-react, 18px default, stroke width 1.8.

## Rules

- **Client-only demo data.** Every date is computed from "now", and the server clock differs from the browser's. Build data on the client after mount: `src/store/demo-store.ts` has an `init(now)` action called once from AppShell. Until the store is ready, AppShell shows a light skeleton. Never compute seed dates during server rendering.
- **Persistence.** Zustand `persist` under the localStorage key `acs-demo-v1` stores only what the user changed: notes, patient overrides, new patients, team, templates, integrations, settings, practice, language, offline mode, playback speed and notifications read. Wrap storage access so a blocked localStorage never breaks the app. "Reset demo data" clears this key and reloads.
- **One recording at a time.** The recording engine lives in `recording-store.ts`, so the Dashboard and the Consultation page show the same live session.
- **Copy text** (labels, buttons, toasts, empty states) comes from the specs and the prototype. Never invent lorem ipsum. Never claim something really happened outside the demo; for example, the invite toast says no email is sent.
- **No real side effects.** No network calls, no real microphone, no `alert`/`confirm`/`prompt`. Confirmations are in-page modals.
- **Accessibility.** Every icon-only button has an `aria-label`. Focus is visible with a 2px blue outline. Modals close on Esc and backdrop click (except progress modals). Respect `prefers-reduced-motion`.
- **Scope.** Build only what the current spec lists. No mobile-app screens yet; they are a later phase. Pages must still work at phone width.
- **Quality bar for every step.** `npm run build` and `npm run lint` pass with no new warnings. No console errors. Components stay small and typed, with no `any`.
- **Finish each step** with a short summary: files changed, how to see the result, anything that differs from the screenshot. Do not run git commands; the developer commits.

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**This project has a knowledge graph. Start with the code-review-graph
MCP tools to narrow scope, then read the source.** The graph is cheaper than scanning files and
gives you structural context (callers, dependents, test coverage) that file search cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes_tool` or `query_graph_tool` instead of Grep
- **Understanding impact**: `get_impact_radius_tool` instead of manually tracing imports
- **Code review**: `detect_changes_tool` + `get_review_context_tool` instead of reading entire files
- **Finding relationships**: `query_graph_tool` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview_tool` + `list_communities_tool`

### Verify in the source

- Narrow scope with the graph, then read the source. Do not change code from graph output alone.
- For any non-trivial change, read the implementation and the relevant tests before concluding.
- Verify the exact source when touching behavior, database logic, migrations, retries, fallbacks,
  recovery, or compatibility code.
- When the graph and the source disagree, the source wins. The graph may be stale or may not
  model that relationship.
- An empty graph result can mean "not indexed" or "not statically visible", not "does not exist".

### Key Tools

| Tool | Use when |
| ------ | ---------- |
| `detect_changes_tool` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context_tool` | Need source snippets for review — token-efficient |
| `get_impact_radius_tool` | Understanding blast radius of a change |
| `get_affected_flows_tool` | Finding which execution paths are impacted |
| `query_graph_tool` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes_tool` | Finding functions/classes by name or keyword |
| `get_architecture_overview_tool` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes_tool` for code review.
3. Use `get_affected_flows_tool` to understand impact.
4. Use `query_graph_tool` pattern="tests_for" to check coverage.
<!-- /code-review-graph MCP tools -->
