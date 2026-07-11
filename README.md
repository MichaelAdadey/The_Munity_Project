# Munity

**Nurtured Stability** — mental wellness · peer support · licensed therapy

| Next.js 16 · React 19 · TypeScript 5 · Tailwind 4 | Preview mode (no backend required) |

| Members | Therapists | Admins |
|:---:|:---:|:---:|
| Feed, communities, therapy, resources, messages | Onboarding, dashboard, patients, notes, sessions | Reviews, moderation, growth, platform overview |
| `/login` → `/home` | `/therapistlogin` → `/therapistdashboard` | `/admin/login` → `/admin` |

> **No backend required.** Without Supabase env vars, the app runs in preview mode with seed data and the demo accounts below.

[Credentials](#demo-credentials) · [Quick start](#quick-start) · [Product map](#product-map) · [Backend handoff](#implementing-a-real-backend) · [Local URLs](#local-urls)

---

## Demo credentials

Use these when Supabase is **not** configured. Login screens also show and pre-fill them.

### Member

| | |
|---|---|
| **Name** | Alex Rivera |
| **Email** | `alex.rivera@munity.app` |
| **Password** | `User1234!` |
| **Login** | [`/login`](http://localhost:3000/login) |
| **Opens** | `/home` — feed, communities, full Resources nav |
| **Access** | Member experience only |

```text
Email:    alex.rivera@munity.app
Password: User1234!
```

### Therapist

| | |
|---|---|
| **Name** | Dr. Elena Aris |
| **Email** | `elena.aris@munity.app` |
| **Password** | `Therapist1234!` |
| **Login** | [`/therapistlogin`](http://localhost:3000/therapistlogin) |
| **Opens** | `/therapistdashboard` — schedule, patients, clinical tools |
| **Access** | Therapist clinical app |

```text
Email:    elena.aris@munity.app
Password: Therapist1234!
```

### Admin

| | |
|---|---|
| **Name** | Munity Admin |
| **Email** | `admin@munity.app` |
| **Password** | `Admin1234!` |
| **Login** | [`/admin/login`](http://localhost:3000/admin/login) |
| **Opens** | `/admin` — applications, members, support overview |
| **Access** | Admin console |

```text
Email:    admin@munity.app
Password: Admin1234!
```

> Credentials are **role-scoped**. Therapist login rejects member/admin passwords (and the reverse). Defined in `lib/mock-credentials.ts`.

---

## Quick start

### Prerequisites

- Node.js **20+**
- npm (lockfile included)

### Install & run

```bash
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**

| Command | What it does |
|---------|----------------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |

### Optional Supabase

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| Mode | Behavior |
|------|----------|
| **Preview** (no env) | Mock logins + seed data + `localStorage` onboarding |
| **Supabase** | Real auth / OAuth; middleware protects member routes |

---

## Brand & stack

### Palette

| Token | Hex | Swatch |
|-------|-----|--------|
| `munity-green` | `#3E5219` | Deep olive |
| `munity-lime` | `#D6E7A1` | Soft lime |
| `munity-bg` | `#FBF9F8` | Warm paper |
| `munity-text` | `#1B1C1C` | Near black |
| `munity-muted` | `#45483C` | Soft olive gray |

### Built with

| Layer | Choice |
|-------|--------|
| UI | Next.js 16 · React 19 · TypeScript |
| Style | Tailwind CSS 4 · Framer Motion · Lucide |
| Auth | Supabase (optional) · mock session cookie |
| Components | Base UI + `components/ui/` |

> This Next.js version may differ from older tutorials — check `node_modules/next/dist/docs/` and `AGENTS.md`.

---

## Product map

### Members

| Path | Feature |
|------|---------|
| `/` | Marketing landing |
| `/login` · `/signup` | Auth (sets mock session in preview) |
| `/home` | Feed with search, mood check-in, composer, bookmark/save (auth) |
| `/dashboard` | Member wellness dashboard (auth) |
| `/Communities` · `/Communities/[slug]` | Browse / join communities |
| `/Therapy` · `/Therapy/[id]` | Therapist directory + booking |
| `/messages` | Threads, send, and call overlays (auth) |
| `/profile` | Edit profile, photo upload, daily reflection (auth) |
| `/settings` · `/saved` | Account + saved posts (auth) |
| `/notifications` | Member notification center (auth) |
| `/resources` | Resource Hub — guides, sessions, audio (public; guests see Resources tab only) |
| `/emergency` | Crisis support + nearby help (Google Maps) |
| `/privacy` · `/terms` · `/help` | Legal / help stubs |

**Resource categories:** Anxiety · Depression · Stress · Grief · Relationships · Addiction  
→ each has its own featured guide, cards, and trending list (`lib/resource-categories.ts`, `lib/resource-content.ts`, `lib/resource-session-audio.ts`).

### Therapists

```text
Join → Onboarding (4 steps) → Review screen → Clinical app
```

| Step | Path |
|------|------|
| 1 · Basic info | `/therapistonboarding/basic-info` |
| 2 · Credentials | `/therapistonboarding/credentials` |
| 3 · Specialties | `/therapistonboarding/specialties` |
| 4 · Payout | `/therapistonboarding/payout` |
| Review | `/therapistcredentialauth` |
| Dashboard | `/therapistdashboard` |
| Patients | `/therapistpatients` (+ per-patient notes, progress, files, care plan) |
| Clinical notes | `/therapistclinicalnotes` |
| Appointments | `/therapistappointments` (live session overlays) |
| Messages | `/therapistmessages` |
| Analytics | `/therapistanalytics` |
| Profile | `/therapistprofile` (editable) |
| Notifications | `/therapistnotifications` |
| Settings · files · care plan · availability | Matching `/therapist*` routes |

Onboarding drafts persist in `localStorage` with validation across steps; read-only previews on the review screen.

Ghana-specific catalogs (licenses, regions, MoMo, banks): `lib/ghana-therapist.ts`

### Admins

| Path | Feature |
|------|---------|
| `/admin/login` | Admin sign-in |
| `/admin` | Platform overview |
| `/admin/moderation` | Report queue with search (warn / remove / suspend / dismiss) |
| `/admin/growth` | Growth metrics |
| `/admin/communities` · `/therapy` · `/resources` · `/settings` | Console sections |
| `/admin/notifications` | Admin notification center |

### Preview data layer

| File | Role |
|------|------|
| `lib/mock-db.ts` | Seed posts, communities, therapists, chats, reports, bookings |
| `lib/mock-store.ts` | Client mutations + `localStorage` (`munity-mock-store-v2`) |
| `lib/mock-credentials.ts` · `lib/mock-session.ts` | Role-scoped demo auth cookie |
| `lib/notifications.ts` | Shared notification shapes for all roles |
| `lib/onboarding-data.ts` · `lib/onboarding-progress.ts` | Therapist application drafts & step validation |
| `lib/therapist-chats.ts` · `lib/therapist-profile.ts` | Therapist messaging + profile helpers |
| `lib/data.ts` · `lib/types.ts` | Legacy seed + domain types (prefer `mock-db` shapes for UI) |
| `lib/supabase/middleware.ts` | Gates member / therapist / admin routes in preview |

---

## Implementing a real backend

The UI is built to be swappable. Preview mode uses an in-browser store and a mock session cookie; production should use real auth + a database (Supabase is already partially wired). Work domain-by-domain — do not flip everything at once.

### How preview mode works today

```text
Auth actions (login/signup)
  └─ no Supabase env? → lib/mock-credentials + munity-mock-session cookie
  └─ Supabase env?    → supabase.auth (password / Google OAuth)

Middleware (lib/supabase/middleware.ts)
  └─ no Supabase? → enforceMockAuth (role cookie)
  └─ Supabase?    → refresh session + guard routes

UI mutations (feed, chats, reports, bookings, …)
  └─ mockStore.*  → lib/mock-store.ts → localStorage (munity-mock-store-v2)

Therapist onboarding
  └─ localStorage drafts (munity-onboarding-*-v2)

Therapist profile edits
  └─ localStorage (munity-therapist-profile-v1)
```

`isSupabaseConfigured()` in `lib/supabase/client.ts` is the feature flag that switches auth. Data mutations are **not** switched yet — they still hit `mockStore` even when Supabase auth is on.

### Recommended order

1. **Schema + roles** — Create tables that match the shapes in `lib/mock-db.ts` / `lib/types.ts` (profiles, posts, comments, communities, memberships, therapists, bookings, chats, messages, reports, session notes, saved items, mood / reflections, notifications). Add a `role` on profiles (`user` | `therapist` | `admin`).
2. **Auth** — Keep using the existing Supabase client. Map the three login entry points (`/login`, `/therapistlogin`, `/admin/login`) to the same auth provider, then reject wrong roles in server actions / middleware (same pattern as mock credentials today).
3. **Read paths** — Replace `useMockStore()` reads with server fetches or React Query / SWR against your API. Start with feed posts + communities (highest traffic).
4. **Write paths** — Replace each `mockStore.*` call with a server action or API route. Keep the same function names in a thin client adapter so components barely change.
5. **Onboarding** — Move therapist application drafts from `localStorage` to a `therapist_applications` table; submit → admin review queue.
6. **Realtime (optional)** — Messages, notifications, live sessions → Supabase Realtime or websockets.
7. **Delete preview code** — Only after each domain is live (see checklist below).

### `mockStore` → API map

| `mockStore` method | Domain | Suggested endpoint / table |
|--------------------|--------|----------------------------|
| `createPost` / `toggleSupport` / `addComment` | Feed | `posts`, `post_supports`, `comments` |
| `toggleSavedPost` / `toggleSavedResource` | Saved | `saved_posts`, `saved_resources` |
| `setMood` / `saveDailyReflection` | Wellness | `mood_entries`, `daily_reflections` |
| `toggleMembership` / `createCommunity` | Communities | `community_members`, `communities` |
| `bookSession` | Therapy | `bookings` |
| `ensureTherapistChat` / `sendMessage` / `markChatRead` | Messaging | `chats`, `messages` |
| `resolveReport` / `updateReportStatus` / `initiateWellnessCheck` | Moderation | `reports` |
| `addSessionNote` | Clinical | `session_notes` |
| `updateProfile` / `updateSettings` | Account | `profiles`, `member_settings` |

Types already live on the seed records in `lib/mock-db.ts` — treat those as the contract for your API responses.

### Auth migration

| Today (preview) | Target |
|-----------------|--------|
| `findMockAccount` / `setMockSession` in login actions | `supabase.auth.signInWithPassword` (already branched when env is set) |
| `munity-mock-session` cookie | Supabase session cookies only |
| `enforceMockAuth` in middleware | Role checks from `profiles.role` after `getUser()` |
| `MockCredentialsHint` on login screens | Remove once real accounts exist |
| Demo emails in README | Replace with your seed / invite flow |

Member auth already has a dual path in `app/(auth)/actions.ts` and `lib/member-auth.ts`. Therapist and admin actions (`app/therapistlogin/actions.ts`, `app/admin/actions.ts`) still lean on mock credentials — mirror the member pattern there.

### Clear mock / preview state

While developing, wipe client preview data in the browser console:

```js
localStorage.removeItem("munity-mock-store-v2");
localStorage.removeItem("munity-onboarding-step-data-v2");
localStorage.removeItem("munity-onboarding-completed-steps-v2");
localStorage.removeItem("munity-therapist-profile-v1");
// then hard-refresh
```

Also clear the `munity-mock-session` cookie (Application → Cookies) or sign out from the app.

### Files to remove when preview mode is retired

Delete only after the matching domain is served from the backend:

| Remove | Replaced by |
|--------|-------------|
| `lib/mock-db.ts` | Database seed migrations / fixtures |
| `lib/mock-store.ts` | API client + server actions |
| `lib/mock-credentials.ts` | Real users + role column |
| `lib/mock-session.ts` | Supabase session helpers |
| `lib/data.ts` | Live queries (legacy seed; prefer not to grow this) |
| `components/auth/MockCredentialsHint.tsx` | Real auth UX |
| Preview branches in auth actions / middleware | Supabase-only paths |

**Keep:** `lib/routes.ts`, `lib/types.ts` (or generated DB types), `lib/ghana-therapist.ts` (catalog data), resource content modules if they stay CMS/static, and all UI under `components/`.

### Suggested adapter pattern

Avoid rewriting every component at once. Introduce a data module that looks like the store, then swap the implementation:

```ts
// lib/api/feed.ts — same shapes the UI already expects
export async function createPost(input: { content: string; /* … */ }) {
  // POST /api/posts or supabase.from("posts").insert(...)
}

export async function listFeedPosts() {
  // return FeedPost[] matching mock-db
}
```

Then in views, replace `mockStore.createPost(...)` / `useMockStore()` with that module. When a domain is done, delete the corresponding `mockStore` methods so TypeScript forces remaining call sites to migrate.

### Done checklist

- [ ] Supabase (or other) env set in every environment; preview fallback disabled in production
- [ ] Tables + RLS policies for members, therapists, admins
- [ ] All three login flows use real auth + role gates
- [ ] Feed, communities, messages, bookings, reports, notes no longer call `mockStore`
- [ ] Onboarding + therapist profile no longer use `localStorage`
- [ ] Mock files and demo credential UI removed
- [ ] `npm run build` passes with zero imports from `lib/mock-*`

---

## Project structure

```text
munity
├── app/                      # App Router pages & server actions
│   ├── (auth)/               # Member auth actions
│   ├── admin/                # Admin login + console
│   ├── therapistonboarding/  # 4-step application
│   ├── therapist*/           # Clinical surfaces
│   ├── Communities/ · Therapy/
│   ├── home/ · resources/ · messages/ · notifications/
│   ├── emergency/ · profile/ · saved/
│   └── login/ · signup/
├── components/
│   ├── auth/                 # Shell, demo credential hints
│   ├── therapist*/ · resources/ · home/ · messages/ · emergency/
│   ├── live/                 # NotificationsMenu, LiveFeedback
│   └── ui/                   # Shared primitives
├── lib/
│   ├── routes.ts             # Canonical paths
│   ├── mock-credentials.ts   # Demo accounts (remove after backend)
│   ├── mock-session.ts       # Cookie session (preview)
│   ├── mock-db.ts · mock-store.ts
│   ├── onboarding-*.ts       # Application progress & drafts
│   ├── resource-*.ts         # Hub content, categories, session audio
│   ├── notifications.ts
│   ├── ghana-therapist.ts
│   ├── supabase/             # Client · server · middleware
│   └── data.ts               # Legacy seed (prefer mock-db)
├── hooks/
├── public/                   # Logos, landing, resources, images
└── README.md
```

Prefer `routes` from `lib/routes.ts` over hard-coded paths.

---

## Auth behavior

| Mode | Flow |
|------|------|
| Preview | Email/password → `munity-mock-session` cookie → role home |
| Supabase | `signInWithPassword` / Google OAuth · middleware guards `/home`, communities, therapy, profile… |

`/resources` stays **public**. Sign out clears mock cookie + Supabase session.

---

## Local URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Landing |
| http://localhost:3000/login | Member login |
| http://localhost:3000/therapistlogin | Therapist login |
| http://localhost:3000/admin/login | Admin login |
| http://localhost:3000/resources | Resource Hub |
| http://localhost:3000/emergency | Crisis support |
| http://localhost:3000/therapistdashboard | Therapist dashboard |
| http://localhost:3000/therapistmessages | Therapist messages |
| http://localhost:3000/dev | All-screen index |

---

## Contributing notes

1. Match existing patterns in the feature folder — don’t invent a parallel design system.
2. Keep PRs scoped; skip drive-by refactors.
3. Navigate with `lib/routes.ts`.
4. Server actions for auth/forms; client components for interaction.
5. From Figma: adapt to Munity tokens/components, don’t paste raw export Tailwind.
6. When adding data features, prefer shapes from `lib/mock-db.ts` so backend handoff stays clean.

---

## License

Private project (`"private": true`). All rights reserved unless otherwise stated by the owners.

---

Munity · Nurtured Stability
