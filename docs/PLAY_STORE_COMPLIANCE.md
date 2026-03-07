# Google Play Store Compliance Checklist — DealHub AI

Use this checklist when preparing your app for Google Play. Items marked **(required)** are typically mandatory.

**Last updated:** March 6, 2025

---

## 1. Policy and legal URLs **(required)**

| Item | Where to set | Value / action |
|------|----------------|----------------|
| **Privacy Policy** | Play Console → App content → Privacy policy | Public URL to your privacy policy, e.g. `https://yourapp.com/privacy` |
| **Terms of Service** | Optional; some apps link in store listing or in-app | e.g. `https://yourapp.com/terms` |

Ensure both URLs are **publicly accessible** (no login required) and match the content in `docs/PRIVACY_POLICY.md` and `docs/TERMS_OF_SERVICE.md`.

---

## 2. Data safety **(required)**

| Item | Action |
|------|--------|
| **Data safety form** | Play Console → App content → Data safety. Fill out using `docs/DATA_SAFETY_DISCLOSURE.md`. |
| **Data types** | Declare: Email (required), User-generated content (required for app), optional Files/docs if Drive is used. |
| **Encryption** | Declare that data is encrypted in transit (HTTPS). |
| **Data deletion** | Declare that users can request deletion (account + Disconnect for Drive). |
| **No selling data** | Confirm you do not sell user data. |

---

## 3. App access **(required if app requires login)**

| Item | Action |
|------|--------|
| **Instructions** | Play Console → App content → App access. Provide test account or sign-up instructions so reviewers can use the app. See `docs/PLAY_STORE_APP_ACCESS.md`. |

---

## 4. Developer contact **(required)**

| Item | Action |
|------|--------|
| **Email** | Set a valid support/contact email in Play Console (and optionally in app via `NEXT_PUBLIC_SUPPORT_EMAIL`). |
| **In-app** | Ensure Privacy and Terms pages or footer include a way to contact you (e.g. support email). |

---

## 5. Permissions and APIs

| Item | Action |
|------|--------|
| **Sensitive permissions** | If your Android app uses sensitive permissions (e.g. storage, identity), declare them and provide justification. For a web app or TWA, permissions may be limited to network/identity. |
| **Google APIs** | If you use Google Sign-In or Drive API, ensure OAuth consent screen is configured and, for production, publish the app (not just "Testing"). Add your app’s package name / redirect URIs where required. |

---

## 6. Content and targeting

| Item | Action |
|------|--------|
| **Content rating** | Complete the questionnaire in Play Console (e.g. IARC). DealHub AI is typically business/productivity; expect low risk. |
| **Target audience** | Set age groups if required. DealHub AI is not directed at children; you can select 13+ or 18+ as appropriate. |
| **Ads** | If you do not show ads, say so in the listing and in Data safety. |

---

## 7. Store listing

| Item | Action |
|------|--------|
| **Short description** | Clear, accurate description of the app (no misleading claims). |
| **Full description** | Describe features, optional Drive integration, and that AI is for first-pass use only. |
| **Screenshots** | Provide for required device types (phone, tablet if applicable). |

---

## 8. In-app alignment

| Item | Action |
|------|--------|
| **Privacy link** | Visible in app (e.g. footer or Settings). Points to same URL as Play Console. |
| **Terms link** | Visible where appropriate (e.g. footer or sign-up). |
| **Contact** | Support email or contact method visible (e.g. footer, Privacy page, Settings). |
| **Disconnect / revoke** | Users can disconnect Google Drive from Settings; document in Privacy and Data safety. |

---

## 9. Document sources in this repo

| Document | Purpose |
|----------|---------|
| `docs/PRIVACY_POLICY.md` | Full privacy policy (source for web page and Play). |
| `docs/TERMS_OF_SERVICE.md` | Full terms (source for web page and Play). |
| `docs/DATA_SAFETY_DISCLOSURE.md` | Reference for filling Play Data safety form. |
| `docs/PLAY_STORE_APP_ACCESS.md` | Text for "App access" (reviewer instructions). |
| `docs/PLAY_STORE_COMPLIANCE.md` | This checklist. |

---

## 10. Before you submit

- [ ] Privacy policy URL live and matches `docs/PRIVACY_POLICY.md`.
- [ ] Terms URL live (if used) and matches `docs/TERMS_OF_SERVICE.md`.
- [ ] Data safety form completed using `docs/DATA_SAFETY_DISCLOSURE.md`.
- [ ] App access instructions or test account set in Play Console.
- [ ] Developer contact email set and visible in app.
- [ ] Content rating and target audience completed.
- [ ] Replace any placeholder (e.g. `support@example.com`) with your real support email in app config and in the docs you publish.

---

*Google’s requirements can change. Always check the latest [Google Play Developer Program Policies](https://play.google.com/about/developer-content-policy/) and [Data safety](https://support.google.com/googleplay/android-developer/answer/10787469) guidance when submitting.*
