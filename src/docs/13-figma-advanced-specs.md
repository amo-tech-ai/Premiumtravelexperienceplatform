# 13-figma-advanced-specs.md — Design System, Interaction & Handoff Specs

## 🔹 Why This Matters
You have the **Screen Prompts** (What to draw).
Now you need the **System Specs** (How to build it so it works with code).

This document covers the **"Invisible Architecture"** inside Figma that ensures a smooth handoff to Cursor/React.

---

## 1️⃣ Design System Setup (The Foundation)

Before drawing screens, set up these **Figma Variables** to match Tailwind CSS.

### 🎨 Color Variables (Collection: `Theme`)
| Variable Name | Value (Hex) | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| `primary/default` | `#064E3B` | `bg-emerald-900` | Main actions, brand headers |
| `primary/hover` | `#043D2E` | `hover:bg-emerald-950` | Button hover states |
| `accent/gold` | `#D4AF37` | `text-amber-500` | Highlights, active tabs, stars |
| `bg/canvas` | `#F7F7F5` | `bg-stone-100` | App background (Off-white) |
| `bg/surface` | `#FFFFFF` | `bg-white` | Cards, modals, input fields |
| `text/main` | `#111827` | `text-gray-900` | Headings, primary body |
| `text/muted` | `#6B7280` | `text-gray-500` | Meta info, placeholders |
| `status/success` | `#059669` | `text-emerald-600` | Verified, Confirmed |

### 📏 Spacing & Radius Variables (Collection: `Metrics`)
*   **Spacing Base:** 4px (0.25rem). Steps: 4, 8, 12, 16, 24, 32, 48, 64.
*   **Radius:**
    *   `radius-sm` (4px) → Buttons
    *   `radius-md` (8px) → Cards
    *   `radius-lg` (16px) → Modals/Sheets
    *   `radius-full` (999px) → Pills/Avatars

### 🔠 Typography Styles (Text Styles)
*   **Display:** Playfair Display (Serif) — `Bold`, `Semibold`.
*   **Body:** Inter (Sans) — `Regular`, `Medium`.
*   **Scale:**
    *   `H1`: 32px/40px (Mobile), 48px/56px (Desktop)
    *   `H2`: 24px/32px
    *   `Body`: 16px/24px
    *   `Caption`: 14px/20px

---

## 2️⃣ Component Logic & Variants (The "Smart" Parts)

### 🤖 Chat Message Component
*   **Property:** `Sender` [User, AI]
*   **Property:** `State` [Typing, Sent, Error]
*   **Property:** `Attachment` [None, Card, MapLink]
*   **Variants:**
    *   **User:** Align Right, Gold Background, Rounded-TL-large.
    *   **AI:** Align Left, White Background, Rounded-TR-large, Avatar visible.
    *   **Typing:** Left align, 3 pulsing dots (Lottie or Smart Animate).

### 🃏 Result Card Component
*   **Property:** `Type` [Event, Restaurant, Rental]
*   **Property:** `Size` [Compact (List), Expanded (Detail)]
*   **Property:** `Availability` [Available, Sold Out, Checking]
*   **Logic:**
    *   **Compact:** Thumbnail (Left 30%) + Content (Right 70%).
    *   **Expanded:** Large Image (Top 100%) + Content (Bottom).
    *   **Sold Out:** Grayscale image + "Sold Out" overlay badge.

### 🧭 Navigation Tabs Component
*   **Property:** `ActiveTab` [Events, Dining, Stays, Map]
*   **Variant:** `Mobile` (Scrollable Horizontal) vs `Desktop` (Centered or Vertical).

---

## 3️⃣ Responsive Layout Rules (Auto Layout)

### 📱 Mobile (375px)
*   **Grid:** 1 column.
*   **Margins:** 16px (px-4).
*   **Modals:** Become **Bottom Sheets** (Slide up from bottom, 90% height).
*   **Map:** Full screen background, cards float on top (bottom 30%).

### 💻 Desktop (1440px)
*   **Grid:** 12 columns, max-width 1280px.
*   **Margins:** Centered container.
*   **Modals:** Center overlay (dialog).
*   **Map:** Split screen (Left: List 40%, Right: Map 60%).
*   **Navigation:** Sticky header or Sidebar.

---

## 4️⃣ Advanced Prototyping (Interactions)

### A. The "Mini-Wizard" Flow
*   **Trigger:** Tap Mode Card.
*   **Action:** `Open Overlay` (Bottom Sheet).
*   **Animation:** `Move In` from Bottom (300ms, Ease-Out).
*   **Logic:** Selection -> `Navigate To` Next Step -> Finish -> `Close Overlay`.

### B. Map <-> List Sync
*   **Trigger:** Hover List Item.
*   **Action:** `Scroll To` Map Pin (prototype fake).
*   **State Change:** Map Pin scales up (1.2x) and turns Gold.

### C. Chat Streaming
*   **Trigger:** After delay (800ms).
*   **Action:** Swap `Typing State` variant to `Message Content` variant.

---

## 5️⃣ Image & Asset Guidelines (Luxury Aesthetic)

*   **Aspect Ratios:**
    *   Hero Images: `16:9` (Cinematic).
    *   Card Thumbnails: `4:3` or `1:1` (Classic).
    *   Portraits (Chefs/Guides): `3:4`.
*   **Treatment:**
    *   **Overlay:** All text-on-image needs a `Linear Gradient` (Black 0% -> 60%) from bottom to top.
    *   **Border Radius:** Soften images with `radius-md` (8px).
    *   **Shadow:** Large, soft shadows (`shadow-xl`) for floating elements, NOT specifically for cards (keep cards flat/bordered for cleaner look).

---

## 6️⃣ Handoff Checklist for Cursor
*Before exporting or asking AI to build:*

1.  [ ] **Name Layers:** Rename `Frame 123` to `EventCard_Active`.
2.  [ ] **Flatten Vectors:** Icons should be flattened simple paths.
3.  [ ] **Group Sections:** Wrap sections in Auto Layout frames named `Section_Hero`, `Section_Features`.
4.  [ ] **Export Assets:** Mark logos and custom icons as "Exportable" (SVG).
5.  [ ] **Annotate Hidden Logic:** Use sticky notes in Figma to say "This list comes from Supabase table 'events'".

---

## 🔍 Missing "Unhappy Paths" to Design
*Don't forget these specific screens:*

1.  **Offline State:** "No internet connection" banner.
2.  **Empty Results:** "No jazz clubs found in Poblado. Try Laureles?"
3.  **Loading Skeletons:** The grey pulse effect while Supabase fetches data.
4.  **404 / Broken Link:** "This event has expired."

---

## 📝 Final Prompt for "Design System" Generation

> **Figma Prompt:**
> "Generate a local variable collection for a 'Luxury Concierge' app.
> **Colors:** Emerald (#064E3B), Gold (#D4AF37), Off-White (#F7F7F5).
> **Spacing:** Based on Tailwind (4px increments).
> **Text:** Playfair Display (Headings) + Inter (Body).
> Create a 'Master Component' sheet containing:
> 1. Buttons (Primary, Secondary, Ghost).
> 2. Input Fields (Default, Active, Error).
> 3. Cards (Event, Restaurant).
> 4. Chat Bubbles (User, AI, Typing).
> Ensure all components use Auto Layout and have variants for Mobile/Desktop."
