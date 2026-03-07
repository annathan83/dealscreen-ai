# DealHub AI — Mobile UI/UX Design Specification

**Version:** MVP  
**Platform:** React Native + Expo (mobile-first)  
**Design goal:** *"A calm workspace for serious dealmakers."*

---

## 1. Design principles

| Principle | Application |
|-----------|-------------|
| **Capture-first UX** | Add note / upload file / paste in &lt;5 seconds. Quick Capture is the primary action. |
| **Minimal navigation** | No deep menus. Tab bar or single stack; max 2 taps to any screen. |
| **Calm interface** | Generous whitespace, no decorative clutter, soft shadows. |
| **Professional look** | No playful or consumer aesthetics; typography and hierarchy carry the brand. |
| **Information hierarchy** | Deal name, key stats, and last activity visible at a glance on cards. |

---

## 2. Visual style

**Design language:** Notion, Linear, Stripe Dashboard — clean typography, soft shadows, rounded cards, neutral palette.

### 2.1 Color palette

| Token | Hex | Usage |
|-------|-----|--------|
| **Background** | `#F8FAFC` | Screen background (off-white) |
| **Surface** | `#FFFFFF` | Cards, modals, inputs |
| **Primary** | `#1E3A5F` | Primary actions, key labels (deep blue) |
| **Primary light** | `#2E5A8C` | Pressed / hover states |
| **Secondary** | `#64748B` | Body text, secondary labels (slate) |
| **Muted** | `#94A3B8` | Placeholders, timestamps |
| **Border** | `#E2E8F0` | Card borders, dividers |
| **Success** | `#0D9488` | Success states, confirmations (subtle teal-green) |
| **Success bg** | `#CCFBF1` | Success badges background |
| **Error** | `#DC2626` | Errors, destructive actions |

### 2.2 Typography

- **Font family:** Inter (or system `-apple-system` / `Roboto` fallback).
- **Scale:**

| Style | Size | Weight | Use |
|-------|------|--------|-----|
| **H1** | 24px | Semibold (600) | Screen titles, deal name in workspace |
| **H2** | 18px | Semibold (600) | Card titles, section headers |
| **Body** | 16px | Regular (400) | Body text, inputs |
| **Body small** | 14px | Regular | Previews, metadata |
| **Caption** | 12px | Medium (500) | Labels, timestamps, badges |
| **Overline** | 11px | Semibold, uppercase, letter-spacing | Section labels |

### 2.3 Spacing & layout

- **Screen padding:** 20px horizontal, 16px top/bottom for content.
- **Card padding:** 16px.
- **Gap between cards:** 12px.
- **Border radius:** Cards 16px; buttons 12px; inputs 10px; FAB 28px (circle).

### 2.4 Shadows

- **Card:** `0 2px 8px rgba(15, 23, 42, 0.06)`; border `1px #E2E8F0`.
- **FAB:** `0 4px 14px rgba(30, 58, 95, 0.25)`.
- **Modal:** `0 20px 40px rgba(15, 23, 42, 0.12)`.

---

## 3. Core screens (wireframes → high-fidelity)

### 3.1 Login screen

- **Layout:** Centered vertical stack.
- **Elements:** Logo (wordmark “DealHub AI”) → email field → password field → “Log in” primary button.
- **Secondary:** “Create account” text link; “Forgot password?” link below button.
- **No clutter:** No illustrations; optional subtle gradient or solid off-white background.

### 3.2 Deal dashboard (home)

- **Header:** “Deals” title; optional profile/avatar top-right.
- **List:** Vertical list of deal cards (see Component: Deal card).
- **Empty state:** “No deals yet” + “Create your first deal” CTA.
- **FAB:** Bottom-right, primary color, “+” icon → opens Quick Capture (or “New deal” if you prefer FAB = new deal; spec uses FAB = Quick Capture).

### 3.3 Create deal screen

- **Fields:** Deal name (required), Description (optional, multiline).
- **Single CTA:** “Create deal” (primary button). On success → navigate to Deal Workspace.

### 3.4 Deal workspace

- **Top:** Deal title (H1); optional deal code (e.g. DL-00001); key stats row (e.g. X notes, Y files) in caption style.
- **Tabs:** Overview | Notes | Files | Timeline — horizontal scrollable or fixed 4 tabs.
- **Content area:** Renders the selected tab (overview summary, notes list, files list, or timeline).

### 3.5 Notes screen (within workspace)

- **List:** Note cards (see Component: Note card). Each: title, preview text (1–2 lines), created date.
- **CTA:** “New note” at top or bottom of list.
- **Note editor:** Full-screen or modal: title field + body (multiline). Save on blur or explicit “Save” with confirmation microinteraction.

### 3.6 File upload screen (within workspace)

- **Upload area:** Drop zone or “Upload file” button (opens picker). Support PDF, images, documents.
- **List:** File cards (see Component: File card): file name, file type badge, upload date. Optional: progress bar during upload.

### 3.7 Activity timeline

- **Layout:** Chronological feed (newest first or oldest first — recommend newest first).
- **Event types:** Note created, File uploaded, Deal created. Each item: icon + short description + relative time (e.g. “2h ago”).

### 3.8 Quick capture modal

- **Trigger:** FAB on Deal Dashboard (or global).
- **Content:** Three actions in a bottom sheet or modal:
  - **Add note** → quick note composer or navigate to note editor.
  - **Upload file** → open file picker.
  - **Paste text** → pasteboard + optional “Assign to deal” if multiple deals.
- **UX:** No more than one tap after opening to start capture; minimal fields.

---

## 4. Component system (reusable)

### 4.1 Deal card

- **Content:** Deal name (H2), date created (caption), counts (e.g. “3 notes · 2 files”), last activity (caption).
- **Style:** Surface background, 16px radius, 16px padding, soft shadow, border.
- **Interaction:** Tappable → Deal Workspace. Optional long-press for actions later.

### 4.2 Note card

- **Content:** Title (H2 or Body bold), preview text (Body small, 2 lines max), created date (caption).
- **Style:** Same as deal card; consistent padding and radius.

### 4.3 File card

- **Content:** File name (truncated), file type badge (e.g. PDF, Image), upload date (caption). Optional small icon by type.
- **Style:** Same card style; badge uses muted background + secondary text.

### 4.4 Buttons

- **Primary:** Filled, primary color, white text, 12px radius, comfortable tap target (min 44pt).
- **Secondary:** Outline, border primary, primary text.
- **Ghost:** No border, secondary or muted text (e.g. “Cancel”, “Forgot password”).

### 4.5 Tabs

- **Style:** Underline or pill; selected = primary color + bold; unselected = muted. Smooth transition on change.

### 4.6 Inputs

- **Text field:** Surface bg, border, 10px radius, 14–16px text; placeholder muted.
- **Accessibility:** Labels, error state (border + error text).

### 4.7 FAB (floating action button)

- **Style:** Circle, primary color, white “+” icon, shadow. Position: bottom-right, 24px from edges.

---

## 5. Microinteractions

- **File upload:** Progress bar (linear or circular) with percentage or indeterminate until done; on success → brief checkmark or “Uploaded” toast.
- **Note save:** Brief “Saved” confirmation (toast or inline) and/or subtle checkmark.
- **Tab switch:** 200–300ms transition (opacity or slide).
- **Buttons:** Light opacity change on press (e.g. 0.9).

---

## 6. Future expansion (not in MVP UI)

- AI deal summaries, document analysis, financial extraction, multi-user collaboration.
- **Deal Inbox (strategic):** “Forward emails or paste documents → app sorts into the correct deal.” Reserve a slot in nav or Quick Capture for “Inbox” or “Assign to deal” so the feature can be added without reflow.

---

## 7. Deal Inbox (strategic killer feature)

**Concept:** Users forward emails or paste content → DealHub AI suggests or lets user assign the item to a deal. In MVP, design for it by:

- **Quick Capture:** Include “Paste text” and optionally “From email” (placeholder or disabled with “Coming soon”).
- **Navigation:** Optional “Inbox” entry in tab bar or inside Quick Capture modal (e.g. “Inbox” as fourth option) so that when the feature ships, it fits in without redesign.

---

## 8. React Native implementation notes

- Use design tokens (Theme) for colors, spacing, typography; keep components in `components/ui/`.
- Use `Pressable` with opacity feedback for buttons and cards.
- Prefer `FlatList` for deal list, notes list, file list, timeline.
- Modal: `Modal` or bottom sheet library (e.g. `@gorhom/bottom-sheet`) for Quick Capture.
- Safe area: `SafeAreaView` or `react-native-safe-area-context` for notches and home indicator.

---

*End of design specification. Implement in `mobile/` with Expo and the component library described above.*
