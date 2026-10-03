# VCG Web

Desktop web client for **VCG** — a private community application for Śrī Rādhāraman Parivar.

Implemented from the Claude Design project **VCG Webapp UI mockups** (`VCG Desktop.dc.html`
and its `Sidebar` import), extended to cover the screens `../spec.md` requires.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

---

## Design system

The "warm earth" direction from the design file, encoded once as Tailwind v4 theme
tokens in `src/app/globals.css`. Colour values are taken verbatim from the mock —
they are not approximations.

| Role | Token | Value |
| --- | --- | --- |
| App ground | `ground` | `#F4EEE5` |
| Raised surface | `surface` | `#FBF8F3` |
| Sidebar rail | `rail` | `#F1EADF` |
| Primary ink | `ink` | `#2A241F` |
| Hairline | `line` | `#E4DACB` |
| Primary action (tulsi green) | `tulsi` | `#4F7A5A` |
| Accent (terracotta) | `terracotta` | `#B4613C` |

Type is **Mukta** at 200/300/400/500 throughout, with **Tiro Devanagari Hindi**
reserved for Devanagari section titles and greetings (the `.deva` utility). Both
load through `next/font`, so there is no external stylesheet request.

Chrome follows the design's rules: Phosphor **Light** icons everywhere, hairline
borders, **no shadows on content**, and flags rendered as a coloured dot beside a
word rather than a pill.

Image areas are deliberate hatched placeholders (`.placeholder-hatch`), matching
the mock. Swap them for real photography and covers.

---

## Screens

The seven screens in the design file, ported directly:

| Design | Route | Notes |
| --- | --- | --- |
| 1a Home feed | `/` | Sort tabs, flag filters, announcement + sadhna + agenda rail |
| 1b Post detail | `/posts/[id]` | Comments with one level of replies |
| 1c Create post | `/posts/new` | Flag picker, editor, posting guidance |
| 1d Resources | `/resources` | Continue-reading, books grid, audiobooks, YouTube |
| 1e Resource detail | `/resources/[id]` | Metadata, contents, related rail |
| 1f Events | `/events` | Month grid with tithi; **Week** and **Agenda** added per spec §14 |
| 1g Event detail | `/events/[id]` | Overlapping booking card, schedule |

Screens the design's own navigation implies but did not draw, built in the same
visual language:

| Route | Spec |
| --- | --- |
| `/sadhna` | §9 — dashboard, streak, history calendar, log form |
| `/chat`, `/chat/[id]` | §10 — DM + group list, thread, details rail; `[id]` deep-links one conversation |
| `/notifications` | §15 — in-app feed and per-channel preferences |
| `/profile` | §16 — posts, saved, privacy controls |
| `/admin/*` | §17–19 — dashboard, approvals, users, roles, reports, flags, audit |
| `/login`, `/register` | §3 — provider-agnostic sign-in, minimal registration |

The admin panel covers the **Users**, **Community** and **Audit** branches of the
spec's §17 navigation. The **Resources**, **Events**, **Chat moderation**,
**Notifications** and **Settings** branches are not built — the community-facing
screens for those exist, but the administrative CRUD behind them does not.

---

## RBAC

Permissions are the gate, never role names (spec §20). No component contains
`if (role === 'admin')`.

```ts
import { can } from '@/lib/rbac'

{can(user, 'chat.group.create') ? <NewGroupButton /> : null}
```

`src/lib/rbac.ts` holds the permission catalogue and the seeded roles; roles map to
permission sets so an administrator can define new organisational roles from
`/admin/roles` without a deployment. Navigation entries, action buttons and whole
routes all resolve through `can()` / `canAny()`, so a devotee never sees an Admin
link, and reaching `/admin` directly yields a notice rather than a partial panel.

**Authentication and authorization are separate** (spec §3.3). A devotee can
authenticate successfully and still hold `PENDING_APPROVAL`, in which case
`AppShell` renders the waiting screen instead of the application.

### Trying it without a backend

`/profile` carries a dashed **Demo · view the app as** panel that re-issues the
session as any role, or as a pending/suspended account. The choice persists in
`localStorage`, so it survives a full reload and the gates can be checked on any
screen. **Reset** restores the default devotee session.

---

## Data

`src/data/mock.ts` is the only source of content. Every record is shaped the way
the Go API is expected to return it, and the `get*` helpers are the seam:
replace their bodies with fetches and no component changes.

Two things worth knowing:

- **Tithi labels are not computed.** `src/lib/panchang.ts` is a lookup, not a
  calculator. A correct tithi needs lunar ephemeris data and a location, and a
  wrong tithi on a devotional calendar is worse than none — so the backend is
  expected to supply panchang labels per date. Each entry carries a `full` form
  for prose and a short, cell-safe form for the calendar grid.
- **Dates are pinned** to the design's reference day (26 September 2026) so the
  rendered screens match the mock. In production these come from the request.

---

## Not included

- The Go backend, Postgres/Mongo schemas, Soketi wiring and Typesense indexing
  (spec §11, §13, §21–23) — this package is the web client only.
- Mobile layouts. The design file is desktop-only (1440×900 artboards); the spec's
  mobile bottom navigation is a separate piece of work.
- Real file upload, OAuth and push delivery — the UI affordances exist, the
  transport does not.
