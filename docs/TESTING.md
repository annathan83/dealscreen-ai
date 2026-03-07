# Steps to test DealHub AI locally

Follow these in order to run and test the app.

---

## 1. Prerequisites

- **Node.js** 18+ and **pnpm** (or npm)
- **Supabase project** — [supabase.com](https://supabase.com) (tables + RLS)
- **OpenAI API key** — for AI analysis
- **Google OAuth** (optional) — for per-user Drive; otherwise deal folders use service account fallback or skip

---

## 2. Install and env

```bash
cd dealhub-ai
pnpm install
```

Create **`.env.local`** in the project root with at least:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=sk-...

# Optional — per-user Drive (recommended)
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/api/drive/oauth-callback

# Optional — service-account fallback when user hasn’t connected Drive
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

See [README → Environment variables](../README.md) for the full list.

---

## 3. Supabase: tables and RLS

In the **Supabase Dashboard → SQL Editor**, run these migrations **in order** (if not already applied):

1. **`supabase/migrations/001_user_drive_settings.sql`** — `user_drive_settings` table + RLS  
2. **`supabase/migrations/002_rls_deals_and_related.sql`** — RLS on `deals`, `deal_inputs`, `deal_files`, `deal_analyses`  
3. **`supabase/migrations/003_drive_disconnect_nullable_refresh_token.sql`** — nullable `drive_refresh_token`

Ensure the four main tables exist with the expected columns (`deals`, `deal_inputs`, `deal_files`, `deal_analyses`). If you created them manually, RLS in step 2 must be applied so users only see their own data.

---

## 4. Run the app

```bash
npm run dev
```

Open **http://localhost:3000**.

If you see npm warnings like `Unknown env config "npm-globalconfig"`, you can run the dev server without going through npm:

```bash
node scripts/run-without-npm-warn.js next dev
```

For install without warnings:

```bash
node scripts/run-without-npm-warn.js npm install
```

---

## 5. Test flows

| Step | What to do | What to check |
|------|------------|----------------|
| **Auth** | Go to `/login`, sign up with email + password | Redirect to `/deals` after sign-up/sign-in |
| **Deals list** | Open `/deals` | Empty list or existing deals; header shows “Deals” and “Settings” |
| **New deal** | Click “New deal” (or go to `/deals/new`), fill form, submit | Redirect to `/deals/[id]`; deal code e.g. DL-00001 |
| **Workspace** | On deal page: add a note (e.g. type “Test note”, submit) | Note appears in the list |
| **Analysis** | Click “Run analysis” | Score, verdict, recommendation and narrative appear (requires `OPENAI_API_KEY`) |
| **Drive (optional)** | Go to **Settings** → Connect Google Drive, complete OAuth | “DealHub AI” workspace folder link appears; “Disconnect” button shown |
| **Deal + Drive** | With Drive connected, create another deal | New deal has a Drive folder link; folder exists in your Drive under “DealHub AI” |
| **Disconnect** | Settings → Disconnect Google Drive | Workspace link disappears; next deal uses service account or no Drive |
| **Policy links** | Footer: Privacy, Terms | Pages load; contact email shown (from `NEXT_PUBLIC_SUPPORT_EMAIL` or default) |
| **Health** | Open `http://localhost:3000/api/health` | `{"ok":true,"env":"development"}` |

---

## 6. Quick checks if something fails

- **“Could not find table”** → Run the Supabase migrations (step 3).  
- **403 on Drive consent** → Add your Google account as a test user in Google Cloud → OAuth consent screen.  
- **Analysis fails** → Confirm `OPENAI_API_KEY` is set and valid.  
- **RLS errors** → Ensure migrations 002 and 003 are applied; user must be logged in for deal/input/file/analysis access.

---

*For production and Play Store, see [docs/README.md](README.md) and [PLAY_STORE_COMPLIANCE.md](PLAY_STORE_COMPLIANCE.md).*
