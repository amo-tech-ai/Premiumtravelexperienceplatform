# Figma Phase 1: Core Entry & Navigation

**Goal:** Establish the "Entry" experience. This sets the luxury tone and routes users into specific AI modes.
**Dependency:** Use the Global Design System (Prompt 0.1) for all colors/fonts.

---

## Prompt 1.1: Home / Entry Screen

**Context:**
The user has just opened the app. They need to understand the value ("AI Concierge") and see clear paths to explore.

**Instructions:**
Design the **Home Screen** for Mobile (375px) and Desktop (1440px).

### 1. Hero Section
*   **Background:** Full-screen (Mobile) or Large Header (Desktop) high-quality lifestyle image of Medellín (e.g., Lush greenery, upscale rooftop at night).
*   **Overlay:** Dark gradient overlay (bottom-up) to ensure text readability.
*   **Heading:** Large `Playfair Display` text: "Experience Medellín, effortlessly."
*   **Subheading:** `Inter` text: "Your intelligent concierge for dining, events, and stays."
*   **Primary CTA:** Large, glowing button: "Ask Concierge" (Gold icon + Emerald bg).

### 2. Category Navigation (The "Modes")
*   **Layout:** A horizontal scroll (Mobile) or Grid (Desktop).
*   **Cards:** 4 Visual Cards. High-quality image background + Label.
    1.  **Restaurants** (Image: Fine dining plate).
    2.  **Events** (Image: Concert lights/Crowd).
    3.  **Rentals/Stays** (Image: Modern villa interior).
    4.  **Tourist** (Image: Comuna 13 art or Metrocable).

### 3. Trust & Footer
*   **Trust Signals:** Small row of logos or "Verified by Locals" badge.
*   **Footer:** Minimal links (About, Login, Contact).

---

## Prompt 1.2: Mode Selection Screen

**Context:**
The user clicked "Ask Concierge" or a Category card. They must explicitly declare their intent before the AI starts.

**Instructions:**
Design a **Mode Selection Modal** (Desktop) or **Interstitial Screen** (Mobile).

### 1. Layout
*   **Mobile:** Full screen with a "Close" (X) button top right.
*   **Desktop:** A centered modal overlaying a blurred version of the Home Screen.

### 2. Header
*   **Text:** "How can I help you today?" (Playfair Display).
*   **Subtext:** "Select a category to start the conversation."

### 3. Interaction Grid (2x2)
Create 4 large, tappable touch targets.
*   **Style:** White cards with soft shadow. `Hover` state adds a Gold border.
*   **Content per card:**
    *   **Icon:** Large, thin stroke icon (Fork, Ticket, Bed, Compass) in Emerald.
    *   **Label:** Bold Text (e.g., "Dining").
    *   **Description:** Small text (e.g., "Reservations & Recommendations").

### 4. Logic
*   **No Chat Input yet:** Do not show the chat bar here. The user *must* pick a mode first.
