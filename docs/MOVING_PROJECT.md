# Moving this project to another computer

Follow these steps to run DealHub AI on a new machine.

---

## 1. Copy the project

**Option A – Using Git (recommended)**

- If the project is in a Git repo, on the new computer run:
  ```bash
  git clone <your-repo-url> dealhub-ai
  cd dealhub-ai
  ```
- If you haven’t pushed to a remote yet, create a repo on GitHub/GitLab, then:
  ```bash
  git remote add origin <url>
  git push -u origin main
  ```
  Then clone from that URL on the new computer.

**Option B – Copy the folder**

- Copy the whole project folder (e.g. via USB, cloud drive, or zip).
- Do **not** copy `node_modules` (you’ll reinstall on the new machine). You can delete it before copying to keep the transfer small.

---

## 2. On the new computer: prerequisites

- Install **Node.js** 18+ from [nodejs.org](https://nodejs.org).
- (Optional) Install **pnpm**: `npm install -g pnpm`

---

## 3. Install dependencies

```bash
cd dealhub-ai
npm install
```

(or `pnpm install` if you use pnpm)

---

## 4. Environment variables

You need the same env vars on the new machine. Either:

- **Copy `.env.local`** from the old computer into the project root on the new one (same path: `dealhub-ai/.env.local`), or  
- **Recreate `.env.local`** with the same values.

Required (see [README → Environment variables](../README.md)):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- Optional: `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REDIRECT_URI` (use the new machine’s URL if different, e.g. `http://localhost:3000/api/drive/oauth-callback`)

**Important:** Don’t commit `.env.local` to Git (it should be in `.gitignore`). Copy it manually or use a secure method (password manager, encrypted backup).

---

## 5. Supabase and Google Cloud

- **Supabase:** No “move” needed. The same project and database are used from anywhere. Just set the same `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` on the new machine.
- **Migrations:** If the new machine is the first time you’re using this project against this Supabase project, run the SQL migrations in order in the Supabase SQL Editor (see [README → Migrations](../README.md)).
- **Google OAuth:** Same client ID/secret work from the new computer. If you run the app at a different URL (e.g. different port or hostname), add that URL as an authorized redirect URI in Google Cloud Console (APIs & Services → Credentials → your OAuth client → Redirect URIs).

---

## 6. Run the app

```bash
npm run dev
```

Open **http://localhost:3000** and sign in. Your data is in Supabase, so it will be the same as on the old computer.

---

## Checklist

- [ ] Project folder on new computer (clone or copy)
- [ ] Node.js 18+ installed
- [ ] `npm install` (or `pnpm install`) run
- [ ] `.env.local` present with correct values
- [ ] If new Supabase project: run migrations 001–006 in order
- [ ] If different app URL: add redirect URI in Google Cloud for OAuth
- [ ] `npm run dev` works and you can sign in
