# DealHub AI — Documentation

## Google Play Store compliance

These documents support listing DealHub AI on the Google Play Store and other distribution channels.

| Document | Purpose |
|----------|---------|
| [PRIVACY_POLICY.md](PRIVACY_POLICY.md) | Full privacy policy (source for the in-app `/privacy` page and Play Console privacy policy URL). |
| [TERMS_OF_SERVICE.md](TERMS_OF_SERVICE.md) | Full terms of service (source for the in-app `/terms` page). |
| [DATA_SAFETY_DISCLOSURE.md](DATA_SAFETY_DISCLOSURE.md) | Reference for filling the **Google Play Data safety** form (what data is collected, shared, encrypted, deletable). |
| [PLAY_STORE_APP_ACCESS.md](PLAY_STORE_APP_ACCESS.md) | Text and instructions for the **App access** section (how reviewers can sign in or test the app). |
| [PLAY_STORE_COMPLIANCE.md](PLAY_STORE_COMPLIANCE.md) | **Checklist** of required and recommended steps (policy URLs, Data safety, app access, contact, content rating). |

### Before going live

1. Set **support email** in production: `NEXT_PUBLIC_SUPPORT_EMAIL` (and optionally `NEXT_PUBLIC_DEVELOPER_NAME`) in your deployment environment so the in-app Privacy and Terms pages show your real contact.
2. Replace any placeholder (e.g. `support@example.com`) in the markdown docs if you publish them elsewhere.
3. Use [PLAY_STORE_COMPLIANCE.md](PLAY_STORE_COMPLIANCE.md) when submitting to Play.

---

*The in-app pages at `/privacy` and `/terms` are the user-facing versions; the markdown files in this folder are the canonical source and can be used for Play Console and other stores.*
