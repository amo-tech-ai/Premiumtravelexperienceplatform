# Figma Phase 4: Tabs, Results & Map

**Goal:** Visualizing the AI's recommendations. This is where the user spends the most time browsing.
**Dependency:** Integrates with the Chat Interface (Phase 3).

---

## Prompt 4.1: Navigation Tabs

**Context:**
The AI returns results, often across multiple categories (e.g., "Here is the concert, and some restaurants nearby"). Users need to switch between these categories easily without losing the chat context.

**Instructions:**
Design the **Floating Tab Bar**.

### 1. Visual Style
*   **Container:** Pill-shaped floating container (Mobile) or Toolbar (Desktop).
    *   *Background:* White with high blur (`backdrop-blur-md`).
    *   *Border:* Thin grey stroke.
*   **Tabs (Icons + Text):**
    *   **Icons:** Use Lucide-style strokes. (Ticket, Fork/Knife, Bed, Compass, Map).
    *   **Labels:** Small, uppercase `Inter` (e.g., "EVENTS").

### 2. States
*   **Active Tab:**
    *   Icon turns **Gold** (`#D4AF37`).
    *   Text becomes **Bold Emerald** (`#064E3B`).
    *   Active indicator (underline or pill background).
*   **Inactive Tab:** Grey (`#6B7280`).
*   **Notification:** Small red dot if the AI adds new results to a background tab (e.g., "AI found 3 restaurants").

---

## Prompt 4.2: Results List (The Cards)

**Context:**
The list of recommendations. Design distinct card variants for each mode to highlight specific metadata.

**Instructions:**
Design **Result Cards** for the list view.

### Common Card Architecture
*   **Layout:** Horizontal (Image Left, Content Right).
*   **Style:** White background, no border, subtle shadow on hover.
*   **Image:** 1:1 Aspect ratio (Square) on left, rounded corners (`8px`).

### Variant A: Event Card
*   **Metadata:**
    *   **Date Badge:** Overlay on Image (e.g., "OCT 12").
    *   **Title:** Band Name or Event Title (`Playfair Display Bold`).
    *   **Subtitle:** Venue Name • Time.
*   **Action:** "Get Tickets" (Outline Button).

### Variant B: Restaurant Card
*   **Metadata:**
    *   **Rating:** Star icon + "4.8 (120)".
    *   **Attributes:** "Italian • $$$ • 0.5km away".
*   **Action:** "Reserve" (Solid Emerald Button).

### Variant C: Rental/Hotel Card
*   **Metadata:**
    *   **Price:** "$120 / night" (Large text).
    *   **Features:** "3 Guests • Wi-Fi • A/C".
*   **Action:** "View Deal".

---

## Prompt 4.3: Map View

**Context:**
Users need to see where things are relative to each other.

**Instructions:**
Design the **Map Interface**.

### 1. Map Skin (Custom Style)
*   **Prompt for Map Generator:** "Custom Google Maps style. Desaturated, minimal. Water is deep Emerald Green. Land is Off-White. Roads are pale Gold. POI labels are dark grey."
*   **Vibe:** Sophisticated, not the default bright Google colors.

### 2. Custom Pins
*   **Shape:** Teardrop or Circle.
*   **Color Logic:**
    *   **Events:** Gold Pin.
    *   **Restaurants:** Emerald Pin.
    *   **Selected:** Pin scales up 1.5x and shows a small tooltip.

### 3. "Search This Area" CTA
*   **Component:** A floating pill button at the top center of the map.
*   **Text:** "Search this area" (appears when map is dragged).
*   **Icon:** Refresh/Redo icon.

### 4. Layouts
*   **Desktop:** Split View.
    *   Left: Results List (from Prompt 4.2).
    *   Right: Map (Full height).
*   **Mobile:**
    *   Map is hidden behind a "Map" tab OR
    *   Map is a sticky bottom sheet that can be expanded.
