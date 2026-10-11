# Phase 1 — Design system and app shell

**Goal:** the shared look and the frame every page sits in: tokens, UI primitives, sidebar, top bar, routes with placeholder pages.

**Screens:** `docs/screens/prototype/01-dashboard.png` (shell), `30-phone-width-dashboard.png`, `31-phone-width-drawer.png`, `27-notifications-menu.png`, `28-profile-menu.png`.
**Prototype functions:** `renderSide`, `renderTop`, `openFloat`, `modal`, `toast`, `statusPill`, `avatar` and the CSS at the top of the file.

## 1.1 Tokens and globals

- `src/app/globals.css`: `@import "tailwindcss";` then `@theme` with every color token from CLAUDE.md as `--color-*`, for example `--color-ink`, `--color-blue-50` and `--color-line-2`. Add `--font-sans` for Inter, `--radius-card: 14px` and the two shadows as `--shadow-card` and `--shadow-pop`.
- `body`: background bg, color ink, 14px, line-height 1.45, antialiased.
- Global focus ring: `:focus-visible { outline: 2px solid var(--color-blue); outline-offset: 2px; border-radius: 6px }`.
- Keyframes used later: `blink` (opacity to .25 at 50%, 1.2s), `ring` (scale .75→1.08 with opacity 1→0, 2s), `fadein` (4px rise), `pop` (4px drop with fade, .14s), `flash` (background `#e9f0ff` → transparent, 1.6s), `spin`, `eq` (height 4px↔12px).
- `@media (prefers-reduced-motion: reduce)`: animations and transitions effectively off.
- Root layout: Inter through `next/font/google`, `<title>` "AI Clinical Scribe · Hansa Technologies", description "Live demo of the AI Clinical Scribe platform", and the icon from `public/logo-mark.png` (also copy it to `src/app/icon.png`).

## 1.2 UI primitives (`src/components/ui/`)

Typed, small and styled with Tailwind classes that use the tokens:

- `Card` with `CardHeader` (min-height 58px, padding 16px 20px, bottom border line-2; props `icon`, `title`, `subtitle` shown as a small regular-weight suffix like "(Live)", and `actions`) and `CardBody` (padding 18px 20px).
- `Button` with variants primary, secondary, danger-outline and ghost; sizes sm (30px), md (38px) and lg (46px). Support `icon` and `disabled`.
- `IconButton`: 32×32, radius 8, hover gray-50, `aria-label` required.
- `Pill` with tones green, blue, gray, amber, red and purple. `StatusPill` maps statuses as listed in CLAUDE.md; Completed shows a 13px check-circle after the text.
- `Avatar` with `name`, `size` and `variant: "patient" | "doctor"`. The doctor variant takes an optional green online dot.
- `Tabs`: an underline style (active tab blue with a 2px bottom border) inside a row with a bottom border line.
- `Segmented`: gray-50 track with 3px padding; the active segment is white with a small shadow.
- `Switch`: 38×22, with `role="switch"` and `aria-checked`.
- `Input`, `Select` (custom chevron, appearance none), `Textarea`, `SearchInput` (search icon inside, left padding 36px), `Checkbox` (16px square, blue when on).
- `Modal`: 620px wide (`wide` = 820px), radius 16, header, scrollable body and footer slots. Closes on Esc and backdrop click unless `locked` is set (used for progress modals). Focuses the first input.
- `Menu`: a floating panel anchored to a trigger, aligned right or left, 6px below and flipped up if there's no room. Closes on outside click, Esc and route change. Items take an icon, a label, an optional check mark and a `danger` style; headings and separators too.
- `Toast` system: `toast(message, type?)` where type is ok, info or warn. Navy `#0f1c3f` pill at the bottom center with an icon, auto-hides after 3.4s and can stack.
- `EmptyState`: icon, text and an optional action.

## 1.3 Sidebar (`components/layout/Sidebar.tsx`)

- 248px wide, white, right border, full height and sticky, scrolls if short.
- Brand row: logo mark 40px, "AI Clinical Scribe" and "Your AI Assistant", padding 16px 10px 15px with 20px on the left, full-width bottom border.
- Nav items in this order, all 21px icons, padding 10.5px 14px, radius 10, 14.5px/500 ink-2:
  Dashboard (`home`, filled when active), Patients (`users`), Notes (`file-text`), Templates (`clipboard-list`), Analytics (`bar-chart-3`), Billing Codes (`receipt`), Integrations (`plug`), Team (`users-round`), Settings (`settings`), Help & Support (`circle-help`).
- Active item: blue-50 background, blue text and icon, weight 600. Active mapping: `/consultation` → Dashboard, `/notes/*` → Notes, `/patients/*` → Patients.
- "Upgrade to Pro" card: background `#f1f8fb`, border `#dfedf3`, radius 12, padding 16px 14px 14px. The title has a blue sparkles icon. The text "Unlock advanced AI insights, custom templates and more." is 12.5px and indented 30px. A full-width green "Upgrade Now" button, 38px, sits below. The button opens the Upgrade modal; the modal content arrives in Phase 8, so a placeholder modal is fine for now.
- Practice switcher, pinned to the bottom: building icon, "Healthy Life Clinic" over "Practice ID: 124578", chevron. It opens a menu of the two practices in `PRACTICES`, with a check on the current one.

## 1.4 Top bar (`components/layout/Topbar.tsx`)

- 62px high, sticky, white at 96% opacity with a backdrop blur and a bottom border. Items are right-aligned with a 12px gap.
- From left to right:
  - Hamburger, visible below 900px only.
  - Language pill: globe icon, the current language, chevron. Opens a "Transcription language" menu built from `LANGUAGES`.
  - "Offline Mode" pill with a green dot (gray dot and "Online only" when off). It toggles with a toast.
  - "EMR Connected" pill with a green check-circle. Opens a menu: an Epic logo tile with "Last sync hh:mm", "Sync now", "Manage integrations".
  - Notification bell, 38×38, with a red count badge (3). Opens the Notifications menu (330px) from `NOTIFICATIONS` with "Mark all as read".
  - Profile: doctor avatar 38px, "Dr. Sarah Johnson" over "Family Medicine", chevron. Opens a menu: My profile, Help & Support, Presenter controls, a separator, then Sign out in danger style, which shows the toast "Sign out is turned off in the demo."
- All pills: 38px high, radius 10, border line, 13px/500.
- Below 900px: the pill labels hide (icons only), the profile name hides, and the EMR pill hides below 640px.

## 1.5 Routes

Create every route from CLAUDE.md with a placeholder page: the page title and subtitle in the page-head style (title 23px/600, subtitle 14px muted, 22px bottom margin). `/` redirects to `/dashboard`. Add a `not-found` page with a search icon, "That page could not be found." and a "Back to Dashboard" button.

## Done when

- [ ] Every sidebar link opens its page, and the active state follows the mapping above.
- [ ] Every top bar menu opens and closes (outside click, Esc, route change).
- [ ] At 390px wide the sidebar is a drawer with a dark scrim, closed by tapping the scrim or choosing a link, and nothing scrolls sideways.
- [ ] The shell matches `01-dashboard.png` around the content area (spacing, borders, logo).
- [ ] `npm run build` and `npm run lint` pass.
