# Privacy Policy — DealHub AI

**Last updated:** March 6, 2025

**Effective for:** DealHub AI web application and any associated mobile or PWA distribution (e.g. Google Play).

---

## 1. Introduction

DealHub AI ("we", "our", "the app") is a deal-workspace and first-pass analysis service. This Privacy Policy explains what data we collect, how we use it, how we protect it, and your choices. By using DealHub AI, you agree to this policy.

**Contact for privacy and data requests:** Replace `support@example.com` with your support/privacy email in production. You can set `NEXT_PUBLIC_SUPPORT_EMAIL` in your deployment.

---

## 2. Data We Collect

### 2.1 Account and identity

- **Email address** — Used to create and sign in to your account (via Supabase Auth).
- **Account identifier** — A unique user ID tied to your account, used to associate your deals and settings with you.

This data is **required** to use the service.

### 2.2 Content you create

- **Deal data** — Deal titles, business names, industry, location, source, notes, and any text you paste (e.g. listing text, broker emails).
- **Analysis results** — AI-generated extractions, scores, verdicts, recommendations, and narrative text we store so you can view history.

This data is **required** for the core product and is stored in our database. It is visible only to you (enforced by access controls and row-level security).

### 2.3 Google Drive (optional)

- If you choose **Connect Google Drive**:
  - We store a **refresh token** on our servers so we can create and manage a single app-created folder ("DealHub AI") and its subfolders (one per deal).
  - We use the minimum permission (**drive.file**): we can only create and access files/folders that the app creates. We **do not** read, scan, or access your other Drive files or folders.
  - We store the **folder ID and URL** of the app-created workspace folder so we can link you to it from the app.

You can **Disconnect** at any time from Settings; we then clear the refresh token and folder references and no longer access your Drive on your behalf.

### 2.4 Technical and usage data

- **Logs** — Server logs may include request metadata (e.g. IP, user agent, request path). We do not log sensitive content (passwords, full deal text, or file contents) in a way that identifies you in plain text.
- **Cookies / local storage** — Used for session and authentication (e.g. Supabase auth cookies) so you stay signed in.

We do **not** sell or share your data with third parties for advertising or marketing.

---

## 3. How We Use Your Data

- To provide, maintain, and improve DealHub AI (deal workspaces, AI analysis, Drive folder creation).
- To authenticate you and enforce access control (only you see your deals).
- To send you essential service-related messages (e.g. password reset) if applicable.
- To comply with law and protect our rights and safety, where required.

We do **not** use your data for advertising or to build profiles for third-party ads.

---

## 4. Third-Party Services and Sharing

We use the following to operate the service:

- **Supabase** — Authentication and database hosting. Your account and deal data are stored in Supabase; their policies apply to their processing.
- **OpenAI** — To generate extraction and narrative analysis. Content you submit for analysis (e.g. deal notes) is sent to OpenAI for processing. See [OpenAI’s privacy policy](https://openai.com/policies/privacy-policy).
- **Google (Drive API)** — Only if you connect Drive; we use OAuth and the Drive API to create and manage the app’s workspace folder. We do not share your data with Google for advertising.

We do **not** sell or rent your personal information. We may disclose data if required by law (e.g. subpoena) or to protect our rights and safety.

---

## 5. Data Retention and Deletion

- **Account and deal data** — Retained until you close your account or request deletion.
- **Google Drive** — After you Disconnect, we stop accessing your Drive and delete the stored refresh token and folder references. Files already created in your Drive (e.g. "DealHub AI" folder) remain in your Drive until you delete them.
- **Logs** — Retained for a limited period for security and operations, then removed or anonymized.

**Your rights:** You may request access, correction, or deletion of your data. To request account or data deletion, contact us at the support email (see Section 1). After verification, we will delete or anonymize your account and associated deal data within a reasonable period. For Drive, use **Disconnect** in Settings to revoke access immediately.

---

## 6. Security

We use industry-standard measures to protect your data:

- **Encryption in transit** — HTTPS for all traffic.
- **Access control** — Database row-level security so users only access their own data.
- **Secrets** — API keys and OAuth credentials are stored on the server and not exposed to the client.

You are responsible for keeping your password and account secure.

---

## 7. Children’s Privacy

DealHub AI is not directed at children under 13 (or the applicable age in your jurisdiction). We do not knowingly collect personal information from children. If you believe a child has provided us data, contact us and we will delete it.

---

## 8. International Data and Jurisdiction

Data may be processed in the United States or other countries where our providers operate. If you are in the European Economic Area (EEA), UK, or another region with specific privacy laws, you may have additional rights (e.g. access, rectification, erasure, portability, objection). Contact us to exercise them.

---

## 9. Changes to This Policy

We may update this Privacy Policy from time to time. We will post the updated policy on this page (or the in-app Privacy page) and update the "Last updated" date. Continued use of the app after changes constitutes acceptance. For material changes, we may notify you via email or an in-app notice if we have your contact details.

---

## 10. Contact

For privacy questions, data deletion requests, or other inquiries:

- **Email:** Use the support email configured for the app (e.g. set `NEXT_PUBLIC_SUPPORT_EMAIL` in production).
- **In-app:** See Settings or the footer for the current contact link.

---

*This document is the source of truth for DealHub AI’s privacy practices and is intended to satisfy Google Play’s requirement for a publicly accessible, comprehensive privacy policy.*
