# Figma Phase 2: Mini-Wizards (Context Gathering)

**Goal:** Collect critical context (Location + Preferences) via a lightweight UI *before* dropping the user into the open-ended AI Chat.
**Dependency:** Follows Screen 2 (Mode Selection). Precedes Screen 5 (AI Chat).

---

## Prompt 2.1: Mini-Wizard – Location

**Context:**
Regardless of the mode (Dining, Events, etc.), the AI needs to know *where* to look.

**Instructions:**
Design the **Location Step** of the Mini-Wizard.

### 1. Layout
*   **Format:**
    *   **Mobile:** Bottom Sheet (slide-up panel, 60% height).
    *   **Desktop:** Centered Modal (clean, focused).
*   **Navigation:** "Back" arrow (Top Left). Progress bar (Step 1 of 2) at the top.

### 2. Content
*   **Heading:** "Where should we focus?" (`Playfair Display`).
*   **Selection Grid (Quick Chips):**
    *   Create large, tappable text tiles for popular zones:
        *   "Laureles"
        *   "Poblado"
        *   "Envigado"
        *   "Anywhere / Don't Care"
    *   **State:** Selected item turns Emerald bg with White text. Unselected is White bg with Grey border.
*   **Map Option:**
    *   Below the grid, a subtle button or link: "📍 Select on Map" (leads to a pin dropper).

### 3. Action
*   **Primary Button:** "Next" (Disabled until selection is made, or Active if "Anywhere" is default).

---

## Prompt 2.2: Mini-Wizard – Preferences (Mode Variants)

**Context:**
Each mode needs 1-2 specific inputs to make the initial AI search useful.
*Design one variant for "Events" and one for "Dining" to show the pattern.*

**Instructions:**
Design the **Preferences Step** (Step 2 of 2).

### Variant A: Events Mode
*   **Heading:** "What's the vibe?"
*   **Input 1 (Multi-select Chips):** "Live Music", "Techno", "Salsa", "Cultural", "Sports".
*   **Input 2 (Time Toggle):** Simple segmented control: [Tonight] [This Weekend] [Choose Dates].

### Variant B: Dining Mode
*   **Heading:** "What are you craving?"
*   **Input 1 (Cuisine):** Icons + Text: 🍝 Italian, 🌮 Mexican, 🥩 Steak, 🍣 Asian.
*   **Input 2 (Budget):** 3 Buttons: `$` (Cheap), `$$` (Moderate), `$$$` (Fine Dining).

### Global UI Elements
*   **Visuals:** Clean, touch-friendly targets.
*   **No Chat Bubbles:** This is a standard form UI, not a chat conversation yet.
*   **Transition:** The "Next" button here should be labeled "Find Results" or "Start Chat".
