# Figma Phase 5: Detail & Booking

**Goal:** The conversion funnel. This is where users consume deep content and make a commitment.
**Dependency:** Accessed from the Results List (Phase 4).

---

## Prompt 5.1: Detail Screen (The Product Page)

**Context:**
The user clicked on a specific restaurant, event, or villa. This page must sell the experience.

**Instructions:**
Design the **Detail View**.

### 1. Hero Section
*   **Layout:**
    *   **Desktop:** Split header. Left side is text/title, Right side is a large bleeding-edge image collage (1 Main + 2 Small).
    *   **Mobile:** Full-width carousel of images at the top.
*   **Content:**
    *   **Title:** Large Serif (`Playfair Display`).
    *   **Tags:** Pill badges (e.g., "Rooftop", "Live Jazz", "$$$").
    *   **Rating:** Large Star + Score.

### 2. Main Content Layout (2-Column Grid on Desktop)
*   **Left Column (Content):**
    *   **Description:** Rich text with specific styling for highlights (e.g., "Why the Concierge loves this: ...").
    *   **Amenities/Menu:** Icon grid (Wifi, A/C, Vegan Options).
    *   **Map Preview:** Small static map snippet showing the location.
*   **Right Column (Sticky Sidebar):**
    *   **Booking Widget:** A card that floats as you scroll.
    *   **Content:** Price/Date summary + Large "Book Now" button.

### 3. Mobile Sticky CTA
*   On mobile, the "Book Now" button should be a fixed bar at the bottom of the screen (`z-index` high).

---

## Prompt 5.2: Booking Logic (The Fork)

**Context:**
Not all items are bookable directly. Some require external links (e.g., Ticketmaster) or just a phone call.

**Instructions:**
Design the **Booking Action Modal**.

### Variant A: External Link
*   **Trigger:** User clicks "Get Tickets".
*   **UI:** A small modal or bottom sheet.
*   **Message:** "You are leaving the Concierge."
*   **Action:** "Continue to [Vendor Name]" (Primary) + "Cancel" (Secondary).

### Variant B: Internal Booking/Inquiry
*   **Trigger:** User clicks "Reserve Table".
*   **UI:** Opens the Booking Form overlay (Prompt 5.3).

---

## Prompt 5.3: Booking / Inquiry Form

**Context:**
The user is making a reservation or inquiry directly through the app.

**Instructions:**
Design the **Booking Form Modal**.

### 1. Header
*   **Title:** "Secure your spot."
*   **Summary:** Small recap of the item (e.g., "Dinner at El Cielo • Oct 12").

### 2. Form Fields
*   **Input Style:** Floating labels or clean underlined inputs.
*   **Fields:**
    *   **Date/Time:** Custom calendar picker and time slot pills.
    *   **Guests:** +/- Stepper control.
    *   **Name/Contact:** Pre-filled if logged in.
    *   **Special Requests:** Text area ("Allergies, Occasion...").

### 3. Summary & Pay (If applicable)
*   **Total:** Large bold text at the bottom.
*   **Button:** "Confirm Reservation" (Gold).

---

## Prompt 5.4: Success State

**Context:**
The transaction is complete. Give the user certainty and delight.

**Instructions:**
Design the **Confirmation Screen**.

### 1. Visuals
*   **Icon:** Large animated Checkmark or "Ticket" icon in Emerald Circle.
*   **Confetti:** Subtle gold confetti background effect (optional).

### 2. Content
*   **Headline:** "You're all set!" (Serif).
*   **Subhead:** "Confirmation sent to [Email]."
*   **The 'Ticket':** A digital card summary of the booking.
    *   *Visual:* Perforated edge styling, QR code placeholder.

### 3. Next Actions
*   **Primary:** "Add to Calendar".
*   **Secondary:** "Back to Chat" (Return to the AI to plan more).
