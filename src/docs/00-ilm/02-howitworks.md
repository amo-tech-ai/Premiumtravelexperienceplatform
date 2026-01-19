# FIGMA DESIGN PROMPT — HOW IT WORKS (SCROLL-DRIVEN PRODUCT DEMO)
**Brand:** I Love Medellín — AI Concierge  
**Pattern:** Breef-style scroll narrative (sticky story + fixed product window)  
**Goal:** Prove the system works using **real dashboard screenshots** (not illustrations)  
**Design System:** Luxury, calm, editorial typography, emerald + amber accents (no neon)

---

## 1) ROLE & OBJECTIVE
You are a **senior product designer** designing a scroll-driven "How it Works" section for the I Love Medellín homepage.

**Primary objective:**  
Show 4 real product screens crossfading as the user scrolls — demonstrating the AI concierge coordinating:
- Restaurants
- Events
- Rentals
- Trips/Itinerary
(Optionally: Auto/Mobility as a 5th later)

**This section must build trust:**  
AI suggests. User approves. Everything is grounded in Medellín neighborhoods.

---

## 2) CORE INTERACTION (NON-NEGOTIABLE)
A single fixed **app window** on the right displays **4 real dashboard screenshots** that crossfade as users scroll.

**Left side:**
- Sticky narrative
- Step indicator (1–4)
- Minimal copy that explains what's happening

**Right side:**
- Fixed product demo window
- Crossfade between screenshots
- Subtle callouts + cursor choreography (optional, minimal)

**Scroll length:** 4 viewport heights  
**Step distribution:** 25% scroll per step

---

## 3) VISUAL STYLE (STYLE GUIDE ALIGNED)

### Color Tokens
- Section background: **slate-50 / soft grey**
- App window: **white**, hairline border **slate-100**
- Active indicator: **emerald-950**
- Accent: **amber-500** (sparingly, only for highlights/CTAs)
- Secondary UI hints: **emerald-400 / emerald-500**

### Typography
- Eyebrow: 12–14px sans, uppercase, **amber-500**
- Headline: large serif, **slate-900**
- Step titles: 16–18px sans, bold when active
- Step descriptions: 14–16px sans, **slate-600**

### Cards & Shadows
- Rounded corners: **16–24px**
- Shadows: soft, minimal
- No harsh borders, no neon, no glassmorphism

---

## 4) LAYOUT SPEC
- Two-column layout
- Left column: **40% width**, sticky
- Right column: **60% width**, fixed app window
- Section height: **400vh**
- Gap between columns: 24–32px

---

## 5) SECTION HEADER (TOP OF SECTION)
**Eyebrow:** HOW IT WORKS  
**Headline (Serif):** Medellín, organized by one AI concierge.  
**Subtext:** Restaurants, events, rentals, and itineraries — planned intelligently, approved by you.

Optional micro-trust row:
- "Preview first"
- "Approve actions"
- "Undo anytime"

---

## 6) STEP-BY-STEP SCREENS (4 STATES)

> IMPORTANT: Each screen should be a **real dashboard screenshot** styled consistently with your UI:
> left sidebar + center feed/cards + right map panel (when relevant).

---

### STEP 1 — DISCOVER (Restaurants + Vibes)
**Scroll Range:** 0%–25%  
**Left Column Copy**
1. **Discover** — Tell us your vibe. We surface the best nearby picks.

**Right Panel Screenshot: "Explore / Home Feed"**
Must show:
- Neighborhood selector: *El Poblado* (or Laureles)
- Search bar: "Search places, vibes, or cravings…"
- Category chips: Restaurants / Coffee / Nightlife
- 2 featured restaurant cards with:
  - rating, distance, price
  - "AI pick" badge (subtle)
- Map panel showing pins near the neighborhood

**Optional minimal cursor choreography**
- Cursor clicks "Restaurants" chip
- One card highlights and the map pin glows

---

### STEP 2 — PLAN (Events + Time-Aware Suggestions)
**Scroll Range:** 25%–50%  
**Left Column Copy**
2. **Plan** — AI matches your schedule and location with what's happening tonight.

**Right Panel Screenshot: "Events near you"**
Must show:
- Events list or card grid
- A "Tonight" or "This weekend" toggle
- One highlighted event card
- A small "Best time to go" / "Weather-aware" tag
- Map pins aligned to event venues

**Optional cursor choreography**
- Cursor hovers "Tonight"
- Tooltip appears: "Best time: 8:00 PM — short Uber from you"

---

### STEP 3 — STAY (Rentals + Neighborhood Fit)
**Scroll Range:** 50%–75%  
**Left Column Copy**
3. **Stay** — Find the right neighborhood and rental, not just a listing.

**Right Panel Screenshot: "Rentals"**
Must show:
- Filters: Stay length, budget, neighborhood
- 2–3 rental cards with:
  - photos, price/month, Wi-Fi badge (optional), rating
  - "Matches your stay" badge
- Map with rental pins
- Neighborhood label visible (Laureles / Envigado)

**Optional cursor choreography**
- Cursor drags price slider slightly
- Cards update (shown via subtle highlight, not heavy animation)

---

### STEP 4 — ITINERARY (Trips + One-Click Day Plan)
**Scroll Range:** 75%–100%  
**Left Column Copy**
4. **Itinerary** — Turn picks into a day plan with routes and timing.

**Right Panel Screenshot: "Trip / Itinerary Builder"**
Must show:
- A day plan timeline (Morning / Afternoon / Night)
- 3 items pulled from earlier steps:
  - café → event → dinner
- "Optimize route" button
- Map route line + stop pins
- "Approve plan" CTA (small but visible)

**Optional cursor choreography**
- Cursor clicks "Optimize route"
- Route line highlights + "Saved to Trip" toast appears

---

## 7) STEP INDICATOR (LEFT COLUMN)
Design a vertical step list with:
- Step number (01–04)
- Step title
- Short description
- Active indicator: emerald marker + bold text
- Inactive: slate-400 at 40–60% opacity

---

## 8) APP WINDOW SHELL (RIGHT PANEL)
The right panel must look like a **real product**:
- Browser chrome (3 dots) OR native app chrome
- Subtle border: slate-100
- Rounded: 20px
- Soft shadow
- Optional label at top-left: "Live Dashboard Preview"

Add subtle caption under the window:
- "Real dashboard screens — not mockups"

---

## 9) MOTION & TIMING (CALM, PREMIUM)
- Crossfade between screens: **400ms ease-in-out**
- Step indicator update: **200–300ms**
- Tooltip fades: **200ms**
- No bounce, no overshoot
- Support "prefers reduced motion" (static swap)

---

## 10) MOBILE ADAPTATION (<768px)
- Remove sticky/fixed behavior
- Convert into 4 stacked blocks:
  - Step text → screenshot below each step
- No cursor animations on mobile
- Show final states (no motion required)

---

## 11) SUCCESS CRITERIA
- [ ] Users understand it's **real product UI** in 5 seconds
- [ ] Each scroll step shows a **different module**
- [ ] Map and cards stay consistent with the brand
- [ ] Copy is minimal and confidence-building
- [ ] AI feels helpful, not overwhelming
- [ ] Looks premium and calm (no neon, no clutter)

---

## FINAL DESIGN INTENT
This section should feel like:

> "I can see the actual dashboard. It's real, it's structured, and it can run my Medellín day."

Build trust through **real screens**, **progressive disclosure**, and **quiet intelligence**.

---

# SCREEN SPECIFICATIONS

## SCREEN 01 — DISCOVER (Restaurants + Vibes)
**Product:** I Love Medellín — AI Concierge  
**Screen:** Dashboard → Home/Explore (Discover)  
**Goal:** Show "right now" recommendations with map context (clearly a real dashboard screen)

### Layout
- 3-panel desktop layout:
  - Left: Sidebar nav
  - Center: Feed + cards
  - Right: Map panel (pins)

### Left Sidebar (must include)
- Logo: "I Love Medellín"
- Nav items:
  - Home (active)
  - Chats
  - Trips
  - Explore
  - Events
  - Restaurants
  - Rentals
  - Saved
  - Concierge
- Profile card at bottom

### Center Top Bar
- Neighborhood selector: **Exploring · El Poblado**
- Search input (full width):  
  **Placeholder:** "Search places, vibes, or cravings…"
- Filter chips:
  - All (active)
  - Restaurants
  - Coffee
  - Nightlife
  - Things to Do

### Context Banner (under chips)
- Soft emerald-tinted banner with sparkle icon
- Title (serif): **Thursday Afternoon in El Poblado**
- Subtext: "24°C — perfect for a rooftop coffee. Here are top picks near you."

### Cards (Restaurants section)
- Section header: **Restaurants** + "See more"
- 2 large cards with:
  - Editorial photo
  - Category pill: "Restaurants"
  - Heart icon
  - Name + price + distance
  - Rating star (amber)
  - AI insight badge (emerald tint):
    - "AI pick · Great rooftop views"
    - "Popular with locals · Easy walk"

### Right Map Panel
- Soft neutral map style
- Pins near El Poblado
- One active pin highlighted (emerald glow)

### Style Guide
- Background: slate-50
- Cards: white, radius 16–20, soft shadow
- Accent: emerald-500, amber-500
- Typography: serif for headers, sans for UI

### Must Feel Like
A real, usable dashboard screenshot — not a marketing illustration.

---

## SCREEN 02 — PLAN (Events + Time-Aware Suggestions)
**Product:** I Love Medellín — AI Concierge  
**Screen:** Dashboard → Events (Plan Tonight)  
**Goal:** Show AI selecting the best event "tonight" based on time, location, and vibe.

### Layout
- Same 3-panel dashboard layout (sidebar + content + map)

### Center Top Bar
- Neighborhood selector: **Tonight in · Laureles**
- Search: "Search events, venues, or vibes…"
- Filter chips:
  - Tonight (active)
  - This Weekend
  - Live Music
  - Culture
  - Nightlife

### AI Context Banner
- Title: **Tonight's Plan — Based on your vibe**
- Subtext: "Cool evening, low rain risk. Best start time: 8:00 PM."

### Events Section (Primary)
- Section header: **Events Near You** + "See more"
- 3 event cards (2 visible + 1 partial)
Each card includes:
- Event image
- Tag (pill): "Live Music" / "Culture"
- Title + venue
- Start time + distance
- Price indicator (optional)
- AI badge:
  - "Best match · Short Uber"
  - "Good crowd · Fits your schedule"

### Suggested Sequence (Mini)
A small horizontal "Tonight flow" strip:
- Drink → Event → Late bite  
(3 tiny chips/cards)

### Right Map Panel
- Map pins for venues
- Highlight selected event pin
- Tooltip style (small):
  - "Starts 8:00 PM · 12 min away"

### Style Guide
- Minimal, calm
- Emerald for active states
- Amber only for key highlight (CTA or star)

### Must Feel Like
A real planning screen that makes "Tonight" decisions fast.

---

## SCREEN 03 — STAY (Rentals + Neighborhood Fit)
**Product:** I Love Medellín — AI Concierge  
**Screen:** Dashboard → Rentals (Find a Place)  
**Goal:** Show rentals filtered by neighborhood fit + stay length, with map pins.

### Layout
- 3-panel dashboard layout

### Center Top Bar
- Neighborhood selector: **Stays in · Envigado**
- Search: "Search rentals, neighborhoods, or needs…"
- Filter chips:
  - Short stay
  - Monthly (active)
  - Pet-friendly
  - Fast Wi-Fi
  - Quiet

### Filter Row (compact)
- Budget slider
- Bedrooms dropdown
- Stay length dropdown (2 months)
- Sort: "Best match"

### AI Context Banner
- Title: **Best neighborhoods for your stay**
- Subtext: "Envigado is calmer, walkable, great for longer stays."

### Rental Cards (Primary)
- Section header: **Top Matches** + "See more"
- 2 large cards + 1 smaller
Each card includes:
- Photo
- Name (serif)
- Price (monthly)
- Rating + reviews count
- Badges:
  - "Fast Wi-Fi"
  - "Quiet street"
  - "Matches your stay" (emerald tint)
- Small AI note:
  - "Near cafés + gym · 8 min walk"

### Right Map Panel
- Pins for rentals
- Selected rental pin highlighted
- Small legend:
  - Emerald pin = recommended
  - Gray pin = other results

### Style Guide
- Same card style, soft shadows, rounded corners
- Calm slate backgrounds, emerald accents, no noise

### Must Feel Like
A premium "find the right place" dashboard, not an Airbnb clone.

---

## SCREEN 04 — ITINERARY (Trip Builder + Route Optimization)
**Product:** I Love Medellín — AI Concierge  
**Screen:** Dashboard → Trips (Itinerary Builder)  
**Goal:** Convert recommendations into a day plan with route + approval control.

### Layout
- 3-panel dashboard layout

### Center Top Bar
- Trip title: **Saturday in Medellín**
- Secondary meta: "El Poblado → Laureles"
- Buttons:
  - "Optimize route" (primary emerald)
  - "Share" (outline)

### Itinerary Timeline (Center)
Vertical timeline with blocks:
- Morning
- Afternoon
- Night

Each block contains 1–2 items pulled from prior modules:
- Coffee spot (from Discover)
- Event (from Plan)
- Dinner (from Discover)

Each itinerary item includes:
- Place image thumbnail
- Name + neighborhood
- Time range
- Small tags: "Saved" / "AI pick"
- Drag handle (subtle)

### AI Suggestions Panel (within center, below timeline)
- Title: **AI Suggestions**
- Suggestions:
  - "Swap dinner to reduce travel time (-18 min)"
  - "Add scenic viewpoint at sunset"
- Each has an "Apply" button (small)

### Right Map Panel
- Route line connecting stops
- Pins numbered 1–4
- Selected stop highlights on click

### Approval Control (very clear)
A bottom bar or top-right chip:
- "Preview mode"
- CTA: **Approve plan**
Microcopy: "Nothing is booked until you approve."

### Style Guide
- Editorial, calm, premium
- Serif for main titles, sans for UI
- Emerald + amber minimal accents

### Must Feel Like
A real trip planning tool with control + clarity.
