# Figma Phase 3: AI Concierge (The Spine)

**Goal:** Design the central hub where the conversation happens. This screen connects the initial context (Wizard) to the final results (Tabs/Map).
**Dependency:** Follows Screen 4 (Wizard Completion).

---

## Prompt 3.1: AI Chat Interface (Main Screen)

**Context:**
The user has just finished the Mini-Wizard. The AI now takes that context ("Laureles + Live Music") and starts the session.
**Important:** This is the *primary* view of the application.

**Instructions:**
Design the **Chat Interface**.

### 1. Layout Structure
*   **Desktop:** Split Screen.
    *   **Left Panel (40%):** The Chat Interface (Conversation).
    *   **Right Panel (60%):** Placeholder for Results/Map (will design in Phase 4). For now, show a skeleton loader or a blurred map.
*   **Mobile:** Full Screen Chat.
    *   Includes a "Pull Handle" or Tab Bar at the top (to switch to Results later).

### 2. Message Bubbles
*   **User Message:**
    *   **Align:** Right.
    *   **Style:** `bg-emerald-900` (Primary) with White text. Or `bg-amber-50` (Cream) with Dark text for a softer look. Let's go with **Cream/Gold (`#FFFBEB`) background** with Charcoal text to feel "Editorial".
    *   **Shape:** Rounded corners, sharp bottom-right corner.
*   **AI Message:**
    *   **Align:** Left.
    *   **Style:** White background, subtle shadow, Emerald text for the name "Concierge".
    *   **Avatar:** A sleek, abstract geometric logo or "M" icon in Gold/Emerald.
    *   **Confidence Badge:** Inside the bubble, next to the AI name.
        *   *Verified:* Green Check icon + "Verified".
        *   *Best Guess:* Muted Gold icon + "Suggestion".

### 3. "Thinking" State
*   Design a specific AI bubble variant showing **3 pulsing dots** (Emerald color).
*   *Animation note:* Smooth opacity fade.

### 4. Input Area (Bottom)
*   **Container:** Fixed to bottom, White background with top border.
*   **Field:** Pill-shaped grey input (`#F3F4F6`). Placeholder: "Ask anything..."
*   **Send Button:** Gold Circle with White Arrow.

---

## Prompt 3.2: Follow-Up Question Card

**Context:**
Sometimes the AI needs to ask a structured question *inside* the chat flow to refine results (e.g., "What is your budget?" or "Do you need parking?"). This is NOT a text bubble, but an interactive UI element.

**Instructions:**
Design a **Structured Question Component** that lives inside the chat stream (Left aligned, like an AI message).

### 1. Card Container
*   **Style:** White Card with a thin Gold border (`1px solid #D4AF37`).
*   **Shadow:** Soft floating shadow.

### 2. Content
*   **Question Text:** Bold `Inter` text (e.g., "What price range are you looking for?").
*   **Quick Actions (Chips):**
    *   Row of clickable pills.
    *   *Example:* `Under $20` | `$20 - $50` | `$50+`
    *   *State:* Hover fills the chip with Emerald.
*   **Skip Action:** Small, muted link text at the bottom: "Skip this".

### 3. Placement
*   Show this card appearing *after* an AI text introduction (e.g., "I found a few places, but first...").
