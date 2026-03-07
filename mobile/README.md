# DealHub AI — Mobile (React Native + Expo)

Mobile-first UI for DealHub AI. Implements the screens and component library from [../docs/MOBILE_DESIGN.md](../docs/MOBILE_DESIGN.md).

## Run

```bash
cd mobile
npm install
npx expo start
```

Then open in iOS Simulator, Android emulator, or Expo Go on device.

## Assets

If you see missing asset errors, add to `mobile/assets/`:

- `icon.png` (1024×1024) — app icon
- `splash-icon.png` — splash screen
- `adaptive-icon.png` — Android adaptive icon

Or copy from a fresh Expo app: `npx create-expo-app@latest temp --template blank-typescript` and copy the `assets` folder from `temp/` into `mobile/`.

## Structure

| Path | Purpose |
|------|---------|
| `app/` | Expo Router screens (file-based routing) |
| `src/theme/tokens.ts` | Design tokens (colors, spacing, typography) |
| `src/components/ui/` | Reusable UI (DealCard, NoteCard, FileCard, Button, Input, Tabs, FAB, TimelineItem) |
| `src/components/QuickCaptureModal.tsx` | Quick capture bottom sheet |

## Screens

1. **Login** — Email/password, create account, forgot password
2. **Deal Dashboard** — List of deals, FAB → Quick Capture, "New deal" in header
3. **Create Deal** — Deal name, optional description → Deal Workspace
4. **Deal Workspace** — Tabs: Overview, Notes, Files, Timeline
5. **Notes** — Note cards + "New note" (inside workspace)
6. **Files** — Upload area + file cards (inside workspace)
7. **Activity Timeline** — Chronological feed (inside workspace)
8. **Quick Capture Modal** — Add Note, Upload File, Paste Text, Deal Inbox (coming soon)

## Design

- **Palette:** Off-white background, deep blue primary, slate secondary, subtle green success
- **Typography:** System sans (Inter-like); see `src/theme/tokens.ts`
- **Principles:** Capture-first (&lt;5s), minimal nav, calm UI, professional

## Future

- Connect to DealHub AI backend (Supabase auth, deals, notes, files)
- **Deal Inbox:** Forward emails / paste → auto-assign to deal (slot reserved in Quick Capture)
