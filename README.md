# DealHub AI (MVP)

DealHub AI is a **deal-workspace-first** product for acquisition entrepreneurs. The codebase is the **MVP**—not yet a full app; it is being built so it can **become a web app** later.

For each deal it creates:

- **A structured workspace** with metadata, notes, files, and analysis.
- **A Google Drive folder tree** (`DL-00001 Business Name` with standard subfolders).
- **AI-assisted extraction and narrative** based on consolidated deal inputs.

This repository contains the **MVP** (web-first). Logic lives in `src/lib/**` so the same backend and flows can power a full **web app** later (and optionally PWA or mobile).

**Path to web app:** When ready, the MVP becomes the web app by adding product polish, deployment, and any app-like packaging (e.g. PWA). No separate codebase is required.

**Google Play / compliance:** See **[docs/](docs/README.md)**. **Steps to test locally:** see **[docs/TESTING.md](docs/TESTING.md)**.

---

## High-level architecture

- **Framework**: Next.js App Router (TypeScript, React, server components).
- **Styling**: Tailwind CSS + light shadcn-style UI primitives (Button, Input, etc).
- **Auth & DB**: Supabase (email/password auth, Postgres, RLS).
- **AI**: OpenAI API for extraction + narrative + broker questions.
- **Drive integration**: Google Drive API with a service account for folder + subfolder creation.
- **Domain-centric libs**:
  - `src/lib/analysis/*` – AI orchestration & deterministic analysis.
  - `src/lib/dealCode.ts` – human-readable deal code generator.
  - `src/lib/googleDrive.ts` – Drive folder tree creation.
  - `src/lib/scoring.ts`, `src/lib/riskRules.ts` – deterministic scoring & risk flags.
  - `src/lib/supabase/*` – SSR/browser Supabase clients.

Business logic lives in `src/lib/**` and **not** in page components, keeping the core reusable for mobile clients.

A **mobile UI** (React Native + Expo) lives in **`mobile/`** with its own design system and screens (login, deal dashboard, workspace with notes/files/timeline, quick capture). See **[docs/MOBILE_DESIGN.md](docs/MOBILE_DESIGN.md)** and **[mobile/README.md](mobile/README.md)**.

---

## Core user flows (MVP)

1. **Auth**
   - `/login` – email/password sign-in and simple sign-up (Supabase auth).
   - App Router SSR auth using `@supabase/ssr`.
   - Protected routes for `/deals/**` via `middleware.ts`.

2. **Deal list**
   - `/deals` – user’s deals with:
     - Deal code, title / business name, industry, location, source, status.
     - Latest score, verdict, recommendation (if available).
     - Created date.
   - Mobile-friendly list/table hybrid.

3. **Create deal**
   - `/deals/new` – form for:
     - Title, business name, industry, location, source.
     - Optional initial pasted text (listing, teaser, broker email).
   - On submit (server action):
     - Generates the next **deal code** (`DL-00001`, `DL-00002`, …).
     - Creates a **Google Drive folder** named:
       - `DL-00001 Business Name`, or
       - `DL-00001 Untitled Deal` fallback.
     - Creates standard subfolders:
       - `01 Notes`, `02 Files`, `03 Analysis`, `04 DD`.
     - Stores Drive metadata in `deals.drive_folder_id` and `deals.drive_folder_url`.
     - Inserts the `deals` row with `user_id`.
     - Optionally inserts an initial `deal_inputs` row.
     - Redirects to `/deals/[id]`.

4. **Deal workspace**
   - `/deals/[id]` – central workspace:
     - **Overview**: deal code, title, business name, industry, location, status, source, Drive link.
     - **Notes / Inputs**:
       - Add new input with `input_type`:
         - `listing_text`, `broker_email`, `note`, `manual_summary`, `snippet`.
       - List all inputs newest-first.
     - **Files**:
       - V1 shows **file metadata only** (placeholder for later full Drive upload).
     - **Latest Analysis**:
       - Score, verdict, recommendation.
       - Narrative overview.
       - Risk flags.
     - **Analysis History**:
       - Simple list of prior runs with timestamp, score, verdict.
   - **Run Analysis**:
     - Server action consolidates all inputs + file metadata.
     - Calls OpenAI for structured extraction.
     - Applies deterministic scoring + risk rules.
     - Calls OpenAI again for narrative and broker questions.
     - Stores a new `deal_analyses` row.

---

## Data model assumptions

Supabase has the following tables (approximate; adapt to actual schema as needed):

- `public.deals`
- `public.deal_inputs`
- `public.deal_files`
- `public.deal_analyses`

With shapes like:

- **deals**
  - `id uuid pk`
  - `user_id uuid not null`
  - `deal_code text not null unique`
  - `title text`
  - `business_name text`
  - `industry text`
  - `location text`
  - `source text`
  - `status text`
  - `drive_folder_id text`
  - `drive_folder_url text`
  - `created_at timestamptz`
  - `updated_at timestamptz`

- **deal_inputs**
  - `id uuid pk`
  - `deal_id uuid not null`
  - `user_id uuid not null`
  - `input_type text not null`
  - `title text`
  - `content text not null`
  - `created_at timestamptz`

- **deal_files**
  - `id uuid pk`
  - `deal_id uuid not null`
  - `user_id uuid not null`
  - `file_name text not null`
  - `mime_type text`
  - `storage_provider text`
  - `external_url text`
  - `drive_file_id text`
  - `created_at timestamptz`

- **deal_analyses**
  - `id uuid pk`
  - `deal_id uuid not null`
  - `user_id uuid not null`
  - `extracted_json jsonb`
  - `analysis_json jsonb`
  - `score numeric`
  - `verdict text`
  - `recommendation text`
  - `created_at timestamptz`

RLS is assumed to enforce ownership with `user_id = auth.uid()`; inserts in this app always include `user_id`.

---

## Environment variables

Create a `.env.local` file in the project root with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

OPENAI_API_KEY=sk-...

# Optional legacy service-account-based Drive fallback
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_ROOT_FOLDER_ID=optional-root-folder-id

# Per-user Google OAuth for Drive
GOOGLE_OAUTH_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
GOOGLE_OAUTH_CLIENT_SECRET=YOUR_GOOGLE_OAUTH_CLIENT_SECRET
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/api/drive/oauth-callback

# Optional: override OpenAI model for extraction/narrative/broker Qs
DEALHUB_OPENAI_MODEL=gpt-4.1-mini
```

Notes:

- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` can be stored with literal `\n` in `.env.local`; the app normalizes to real newlines.
- `GOOGLE_DRIVE_ROOT_FOLDER_ID` is optional (Drive folder will be created at the root if omitted).
- Optional: set `APP_ENV=staging` or `APP_ENV=production` in deployment to distinguish environments.

---

## Migrations (run in Supabase SQL editor for test/production)

Apply in order:

1. **`supabase/migrations/001_user_drive_settings.sql`** – `user_drive_settings` table and RLS.
2. **`supabase/migrations/002_rls_deals_and_related.sql`** – RLS on `deals`, `deal_inputs`, `deal_files`, `deal_analyses` so users only see their own data.
3. **`supabase/migrations/003_drive_disconnect_nullable_refresh_token.sql`** – allows disconnecting Drive without deleting the row.
4. **`supabase/migrations/006_deal_changelog.sql`** – `deal_changelog` table and RLS for timestamped activity log.

---

## Google Drive setup assumptions

There are two supported patterns:

1. **Per-user OAuth (recommended)**
   1. In Google Cloud Console, enable the **Drive API**.
   2. Create an **OAuth 2.0 Client ID (Web application)**.
   3. Add `http://localhost:3000/api/drive/oauth-callback` as an authorized redirect URI.
   4. Set:
      - `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET` from the OAuth client.
      - Optionally keep the service-account envs for fallback.
   5. In the app, each user:
      - Visits `/settings/drive`.
      - Clicks **“Connect Google Drive”** and completes consent.
      - The app automatically creates a **DealHub AI** folder in their Drive (or reuses it) and uses that as the workspace root. Users can **Disconnect** to revoke access.

2. **Service account fallback (legacy / shared root)**
   1. Create a **service account** in Google Cloud with Drive API enabled.
   2. Grant the service account access to a **folder** in your Drive that will act as the root for deal folders (or to your whole Drive for testing).
   3. Set:
      - `GOOGLE_SERVICE_ACCOUNT_EMAIL` to the service account’s email.
      - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` to the private key.
      - Optionally `GOOGLE_DRIVE_ROOT_FOLDER_ID` to your chosen root folder.
   4. The app uses `googleapis` with JWT auth and `drive.file` scope to:
      - Create a main folder: `DL-00001 Business Name` (or `DL-00001 Untitled Deal`).
      - Create subfolders: `01 Notes`, `02 Files`, `03 Analysis`, `04 DD`.

File uploads into Drive are **not implemented in V1**; only the folder tree is created and stored on the deal.

---

## How analysis works (high level)

1. **Consolidate content**
   - `src/lib/analysis/consolidateDealContent.ts` merges:
     - All `deal_inputs` (by type and title).
     - `deal_files` metadata (name, mime type, URL).

2. **AI extraction**
   - `runDealAnalysis()` (in `src/lib/analysis/runDealAnalysis.ts`) calls OpenAI with:
     - A strict JSON extraction system prompt (`src/lib/prompts.ts`).
     - The consolidated text.
   - Response is parsed and validated with a Zod schema into `DealExtraction`.

3. **Deterministic scoring & risks**
   - `scoreDeal()` in `src/lib/scoring.ts`:
     - Uses asking price vs SDE/EBITDA multiples.
     - Rewards recurring revenue.
     - Penalizes customer concentration and missing key metrics.
     - Outputs score (0–10), verdict, recommendation.
   - `evaluateRiskFlags()` in `src/lib/riskRules.ts`:
     - Adds flags for:
       - High multiples.
       - Incomplete financials.
       - Customer concentration.
       - Owner dependency.
       - Missing reason for sale.
       - Broker/seller-listed risks.

4. **Narrative & broker questions**
   - AI generates:
     - A concise narrative summary (overview, strengths, weaknesses, what to verify).
     - Practical broker follow-up questions driven by risk flags and gaps.

5. **Persistence**
   - A new `deal_analyses` row is inserted with:
     - `extracted_json`, `analysis_json`, `score`, `verdict`, `recommendation`.

---

## Project structure (key files)

```text
src/
  app/
    layout.tsx                # App shell, header, mobile-friendly layout
    page.tsx                  # "/" – redirects to /deals or /login
    login/page.tsx            # Auth page (SSR + client form)
    deals/page.tsx            # Deals list for current user
    deals/new/page.tsx        # Create deal workspace + Drive folder
    deals/[id]/page.tsx       # Deal workspace (overview, inputs, files, analysis)

  components/
    auth/LoginForm.tsx        # Email/password login + signup
    ui/button.tsx             # shadcn-style button
    ui/input.tsx              # shadcn-style input
    ui/textarea.tsx           # shadcn-style textarea
    ui/card.tsx               # simple card primitives

  lib/
    config.ts                 # env + appConfig
    types.ts                  # Deal, DealInput, DealFile, DealAnalysis, etc.
    utils.ts                  # CSS helpers (cn)
    dealCode.ts               # DL-00001-style code generator
    googleDrive.ts            # Drive folder + subfolder creation
    openai.ts                 # OpenAI client
    prompts.ts                # Extraction + narrative + broker question prompts
    scoring.ts                # Deterministic scoring logic
    riskRules.ts              # Rule-based risk flags
    analysis/
      consolidateDealContent.ts
      runDealAnalysis.ts
    supabase/
      server.ts               # SSR client + getUser()
      client.ts               # Browser client

middleware.ts                 # Protects /deals/** using Supabase SSR
public/manifest.json          # Basic PWA manifest
```

This is intentionally small but **end-to-end functional** and easy to extend.

---

## Running locally

1. **Install dependencies**

```bash
pnpm install
# or
npm install
```

2. **Create `.env.local`**

Populate with the environment variables listed above.

3. **Run dev server**

```bash
npm run dev
```

Then open `http://localhost:3000`.

4. **Set up Supabase**

Ensure your Supabase project has the expected tables, columns, and RLS policies:

- `user_id = auth.uid()` on all four tables (`deals`, `deal_inputs`, `deal_files`, `deal_analyses`).
- `insert` policies allow authenticated users to insert rows with `user_id = auth.uid()`.

---

## What is fully implemented in V1

- **Auth**:
  - Email/password login + signup through Supabase.
  - SSR protection for `/deals/**` via middleware.

- **Deal creation**:
  - Deal code generation (`DL-00001`, `DL-00002`, …) per user, based on max existing code.
  - Inserts `deals` row with `user_id` and Drive metadata.
  - Optional initial `deal_inputs` row.

- **Google Drive**:
  - Server-side Drive service using a service account.
  - On deal creation:
    - One folder per deal with a human-readable name.
    - Standard subfolders (`01 Notes`, `02 Files`, `03 Analysis`, `04 DD`).
    - Folder ID + URL stored in Supabase.

- **Deal workspace**:
  - Overview panel with key fields and Drive link.
  - Input creation (multiple types) and listing.
  - Files section (metadata only).
  - Latest analysis with score, verdict, recommendation, narrative, and risk flags.
  - Analysis history list.

- **Analysis engine**:
  - Consolidation across all deal inputs + file metadata.
  - OpenAI-based extraction into a typed `DealExtraction`.
  - Deterministic scoring and risk rules.
  - OpenAI narrative and broker questions.
  - Persisted analysis history.

- **Responsiveness / mobile readiness**:
  - Layouts and components sized for comfortable touch usage.
  - Deals list and workspace built with stacked/mobile-first layouts.
  - PWA manifest + icon placeholders wired into `metadata`.

---

## What is mocked or simplified in V1

- **File uploads**:
  - No direct file upload to Google Drive yet.
  - `deal_files` are treated as metadata-only; registration UI is intentionally minimal.

- **Analysis richness**:
  - Scoring and risk rules are foundational but not exhaustive.
  - Narrative and broker questions are single-pass.

- **Error handling & logging**:
  - Errors are logged to the server console; no user-facing error surfaces yet for Drive/AI failures beyond basic messaging.

- **Multi-user / collaboration**:
  - Single-user per account; no shared workspaces or roles.

---

## Mobile / Play Store readiness

This MVP is intentionally structured so that a **future mobile client** (Expo / React Native or PWA shell) can:

- Reuse:
  - Supabase types and RLS-secure schema.
  - Domain logic in `src/lib/**` (deal codes, analysis, scoring, risk rules).
  - API contracts implicitly provided by Supabase + Drive conventions.
  - The same OpenAI prompts and analysis orchestration.
- Avoid:
  - Browser-only assumptions in core business logic (Drive + AI + scoring are server-side libs).
  - Messy global state – pages rely on SSR data and local component state.
  - Tight coupling between UI and business logic.

The PWA manifest and clean route structure (`/login`, `/deals`, `/deals/new`, `/deals/[id]`) also map neatly to a mobile navigation stack.

---

## Next recommended improvements

1. **File uploads to Drive (V2)**
   - Add a small upload service that sends files from the browser to Next route handlers, then into Drive via the existing service account.
   - Store resulting Drive file IDs + URLs in `deal_files`.

2. **API route layer**
   - Wrap Supabase + Drive + analysis operations in dedicated API routes (`/api/deals/create`, `/api/deals/[id]/inputs`, `/api/deals/[id]/analyze`) so a mobile client can call them directly.

3. **Richer analysis**
   - Expand scoring, risk flags, and broker question generation with additional heuristics (financeability, structure, offer ranges).

4. **UX polish**
   - Add inline loading states, toasts, and more explicit error messages for Drive/AI failures.
   - Improve tablet and smaller-phone layouts further if needed.

5. **Mobile client**
   - Stand up an Expo or React Native app that:
     - Reuses Supabase auth + database.
     - Calls the same analysis and Drive APIs.
     - Reuses type definitions from this repo for shared safety.

This gives you a **clean, end-to-end V1** that already behaves like a serious acquisition workbench while staying small, understandable, and ready for a future Play Store release.

