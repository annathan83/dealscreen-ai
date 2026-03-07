# Data Safety Disclosure — DealHub AI

This document is a **reference for filling out the Google Play "Data safety" section**. Use it to answer the Play Console questionnaire accurately. Exact wording in the console may vary; align your answers with the facts below.

**Last updated:** March 6, 2025

---

## Summary for users (short disclosure)

- We collect **account info** (email) and **user-generated content** (deal data, notes) to provide the app.
- **Optional:** If you connect Google Drive, we store a token and folder IDs so we can create and manage only the app’s workspace folder; we do not read your other files.
- Data is **not sold or shared** with third parties for marketing.
- Data is **encrypted in transit** (HTTPS). You can request **deletion** via the support email or in-app Disconnect (for Drive).

---

## 1. Does your app collect or share user data?

**Yes.** We collect the data described below to provide the service.

---

## 2. Is all of the user data collected by your app encrypted in transit?

**Yes.** All data is transmitted over HTTPS (TLS).

---

## 3. Do you provide a way for users to request that their data is deleted?

**Yes.**

- **Account and deal data:** Users can contact us (support email) to request full account and data deletion.
- **Google Drive:** Users can use **Disconnect Google Drive** in Settings to revoke access; we then delete the stored token and folder references.

---

## 4. Data types (map to Play Console categories)

Use the following when the Play Console asks what data is collected and how.

### 4.1 Personal info — Email address

| Attribute              | Value |
|------------------------|--------|
| Collected or shared?   | **Collected** |
| Required or optional? | **Required** (to have an account) |
| Purpose                | Account management, sign-in |
| Encrypted in transit?  | Yes |
| User can request delete? | Yes (account deletion) |

### 4.2 Personal info — Name (if you collect display name)

If you only collect email and no name, you can skip "Name." If you add a display name later, mark it as collected and optional.

### 4.3 App activity — Other user-generated content

Covers: deal titles, business names, notes, pasted text (listings, broker emails), and stored analysis results.

| Attribute              | Value |
|------------------------|--------|
| Collected or shared?   | **Collected** |
| Required or optional? | **Required** for core functionality (deals and analysis) |
| Purpose                | App functionality; providing workspace and AI analysis |
| Encrypted in transit?  | Yes |
| User can request delete? | Yes (account/data deletion) |

### 4.4 Files and docs — Files and docs (Google Drive)

Only if the user **connects Google Drive**:

| Attribute              | Value |
|------------------------|--------|
| Collected or shared?   | **Collected** (we store OAuth refresh token and app-created folder IDs; we do not read file contents of user’s other files) |
| Required or optional? | **Optional** (user chooses to connect) |
| Purpose                | Create and manage app workspace folder and per-deal folders in the user’s Drive |
| Encrypted in transit?  | Yes |
| User can request delete? | Yes (Disconnect in Settings; we delete token and references) |

**Important:** We use **drive.file** scope only. We do **not** access the user’s existing Drive files; we only create and access folders the app creates. In the Data safety form, you can clarify in the "Details" that access is limited to app-created folders.

---

## 5. Data sharing with third parties

- **Do you share data with third parties?**  
  We **do not** sell or share user data with third parties for marketing or advertising.
- **Service providers:**  
  Data is processed by Supabase (auth and database), OpenAI (AI processing), and Google (Drive API when user connects Drive). These are processors necessary to operate the service; we do not allow them to use data for their own marketing. In Play’s form, this is typically disclosed as "Data is processed by third parties for app functionality" rather than "shared for advertising."

---

## 6. Security practices (optional but recommended to declare)

- Data is **encrypted in transit** (HTTPS).
- We use **access control** (e.g. row-level security) so users only access their own data.
- You can state that you follow **standard security practices** and that users can request data deletion.

---

## 7. Checklist for Play Console

When filling the form:

- [ ] **Data collection:** Yes — email, user-generated content (deal/notes), and optionally Drive token/folder IDs.
- [ ] **Data sharing for ads:** No.
- [ ] **Encryption in transit:** Yes.
- [ ] **User can request deletion:** Yes (account deletion + Disconnect for Drive).
- [ ] **Privacy policy URL:** Your live app URL, e.g. `https://yourapp.com/privacy`.
- [ ] **Data types:** Map as above (Personal info → Email; App activity → Other user-generated content; Files and docs → only if Drive is used, with limited scope note).

---

*Use this document as the single source of truth when updating the Play Console Data safety section so your public disclosure matches your actual practices.*
