# App Access for Google Play Reviewers

Google Play may require instructions for reviewers to access your app (e.g. if login is required). Use or adapt the text below in the Play Console **"App access"** section.

---

## If your app is login-required (typical for DealHub AI)

**Option A — Test account (recommended)**

Provide a dedicated reviewer account so reviewers can sign in without signing up:

```
This app requires sign-in. Use the following test account to access all features:

Email:    [CREATE: e.g. play.review@yourdomain.com]
Password: [CREATE: a strong, unique password]

After signing in, reviewers can:
- View the deal list and create a new deal
- Open a deal workspace (notes, analysis)
- (Optional) Connect Google Drive from Settings to test folder creation

Do not use this account for production data.
```

**Option B — Sign-up instructions**

If you prefer not to provide a test account:

```
This app requires sign-in. Reviewers can create a free account:

1. Open the app and tap "Sign in".
2. Use the sign-up option and register with any email and password.
3. After sign-up, they can create deals, add notes, and run AI analysis.
4. Google Drive connection is optional (Settings → Connect Google Drive).
```

---

## Features to test (for your own notes)

- Sign in / sign up
- Deal list and create deal
- Deal workspace: add note, run analysis, view result
- Settings: Connect Google Drive (optional), Disconnect
- Privacy and Terms links (footer or Settings)

---

## If you distribute as a TWA (Trusted Web Activity)

- **Start URL:** Your production URL (e.g. `https://yourapp.com` or `https://yourapp.com/deals` if you want logged-in home).
- **Digital Asset Links:** Ensure your domain hosts `/.well-known/assetlinks.json` so the TWA is verified. Document the exact URL in your Play listing if needed.

---

*Update the placeholder email/password and URLs before submitting to Play. Keep the test account secure and only for review use.*
