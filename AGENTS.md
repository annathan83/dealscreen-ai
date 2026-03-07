# Agent / AI master prompt — DealHub AI

Use this as the master context when working on this codebase (Cursor, CLI agents, or chat).

---

## What this project is

**DealHub AI** is a deal-workspace MVP for acquisition entrepreneurs. Each deal has: structured metadata, notes/inputs, optional Google Drive folder tree, and AI-assisted first-pass analysis (OpenAI extraction + deterministic scoring + narrative).

**Product stage:** The MVP is not yet a full product/app. It is the foundation that will **become a web app** later (and the structure should stay reusable for a future PWA or React Native client if needed). Build and refactor with that evolution in mind.

---

## Tech stack

- **Next.js 14** App Router, TypeScript, React server components and server actions.
- **Supabase**: Auth (email/password), Postgres, RLS on all tables. **Do not cache** the server Supabase client (each request gets a fresh client so auth works in server actions).
- **Styling**: Tailwind CSS, design tokens in `src/app/globals.css`, shadcn-style UI in `src/components/ui/`.
- **AI**: OpenAI via `src/lib/openai.ts` and `src/lib/analysis/runDealAnalysis.ts`; prompts in `src/lib/prompts.ts`.
- **Google Drive**: Per-user OAuth (`drive.file` only). App creates a single "DealHub AI" folder and per-deal subfolders. See `src/lib/googleDriveUser.ts`, `src/app/api/drive/`.

---

## Conventions

1. **Data & auth**
   - All tables use RLS; rows are scoped by `user_id` or by deal (deal belongs to user). Never bypass RLS.
   - Server actions and API routes use `createSupabaseServerClient()` from `@/lib/supabase/server` (no module-level caching).

2. **Schema changes**
   - Add **Supabase migrations** in `supabase/migrations/` (numbered, e.g. `007_my_change.sql`). No comments on the first line of a migration (Supabase SQL editor can choke). Use `drop policy if exists` before `create policy` so migrations are idempotent.

3. **Deal codes**
   - Unique per user: `DL-00001`, `DL-00002`, … Generated via `nextDealCodeFromExisting(existingCodes)` in `src/lib/dealCode.ts`. DB has unique index on `(user_id, deal_code)`.

4. **Changelog**
   - Log user actions in `deal_changelog` via `insertChangelog(supabase, { user_id, deal_id?, action, details? })` from `@/lib/changelog`. Actions: `deal_created`, `deal_updated`, `input_added`, `analysis_run`, `file_added`, `drive_connected`, `drive_disconnected`.

5. **Status**
   - `deals.status` allowed values (lowercase in DB): `new`, `nda requested`, `cim received`, `loi negotiations`, `loi signed`, `due diligence`, `closed`, `canceled`.

6. **Structure**
   - Business logic in `src/lib/**`; pages in `src/app/**` stay thin. Types in `src/lib/types.ts`. Config and env in `src/lib/config.ts`.

7. **Docs**
   - User-facing: `README.md`, `docs/TESTING.md`, `docs/MOVING_PROJECT.md`. Compliance/Play: `docs/PRIVACY_POLICY.md`, `docs/TERMS_OF_SERVICE.md`, `docs/DATA_SAFETY_DISCLOSURE.md`, `docs/PLAY_STORE_COMPLIANCE.md`.

---

## When making changes

- **New feature:** Add tests or manual test steps if it touches auth, deal creation, or analysis. Update README or docs if you add env vars or migrations.
- **Migrations:** List new files in README “Migrations” section and ensure they run in order.
- **Errors:** Prefer surfacing real API/DB errors to the user (e.g. constraint names) instead of generic “Something went wrong”.
- **Performance:** Deal list and deal workspace already use loading skeletons; keep Drive and Supabase calls minimal and parallel where possible (e.g. subfolder creation with `Promise.all`).

---

## Quick reference

| Area            | Location / note                                      |
|-----------------|------------------------------------------------------|
| Auth            | `middleware.ts`, `src/lib/supabase/server.ts`       |
| Deal CRUD       | `src/app/deals/page.tsx`, `deals/new`, `deals/[id]`  |
| Analysis        | `src/lib/analysis/runDealAnalysis.ts`, `prompts.ts`  |
| Drive           | `src/lib/googleDriveUser.ts`, `src/app/api/drive/*`  |
| Changelog       | `src/lib/changelog.ts`, table `deal_changelog`       |
| Migrations      | `supabase/migrations/001_*` … `006_*`               |

Use this as the single source of context so the agent stays aligned with the project’s design and conventions.
