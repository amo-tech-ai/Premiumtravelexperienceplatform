# 🚀 Implementation Prompts & Design Specifications

**Context**: These prompts are designed to guide the development of the *i love Medellín* luxury travel application. They correspond directly to the phases outlined in `IMPLEMENTATION_PLAN.md`.
**Style Guide**: Luxury, Editorial, Calm, Intelligent, Responsive (Mobile-First).

---

## 🎨 Phase 1: Foundation & Brand

### 1.1 Global Theme & Typography
**Prompt:**
> Configure the Tailwind CSS theme to match a "Luxury Eco-Modern" aesthetic.
> 1.  **Typography**: Set `font-serif` to "Playfair Display" and `font-sans` to "Inter".
> 2.  **Colors**: Define a `medellin` palette:
>     - Primary: Deep Emerald (`#064E3B`)
>     - Accent: Soft Gold/Amber (`#F59E0B`)
>     - Canvas: Off-white/Cream (`#F7F7F5`) for a paper-like feel.
> 3.  **Radius**: Set default border radius to `1rem` (16px) for a soft, friendly look.
> 4.  **Shadows**: Create a `shadow-luxury` class that is diffuse and soft (large spread, low opacity).

**Success Criteria:**
- Typography classes (`font-serif`) work immediately.
- The background color `#F7F7F5` is the default for the app.

### 1.2 Responsive App Shell (Navigation)
**Prompt:**
> Create a `MainLayout` component that acts as the shell for the application.
> **Desktop**:
> - Sticky Header: Transparent on top, becomes white/blurred on scroll.
> - Navigation Links: Centered, with a subtle underline animation on hover.
> - Right Side: "Plan Trip" CTA (Pill shape).
> **Mobile**:
> - Bottom Navigation Bar (optional) OR a top bar with a "Hamburger" menu that triggers a full-screen smooth motion drawer.
> - Prioritize the "Menu" interaction to be thumb-friendly.

**Success Criteria:**
- Header changes style on scroll (Observer pattern).
- Mobile menu opens with a smooth fade/slide transition, no jarring cuts.

### 1.3 Motion System (Framer Motion)
**Prompt:**
> Create a `utils/animation.ts` file exporting standard Framer Motion variants for the application.
> 1.  `fadeInUp`: Moves 20px up and fades in (Duration: 0.6s, Ease: easeOut).
> 2.  `staggerContainer`: For lists (Quick Facts, Cards).
> 3.  `slowScale`: A very subtle zoom (1.0 -> 1.05) over 10 seconds for hero background images.
> 4.  `softSlideIn`: For mobile drawers (Spring physics: stiffness 300, damping 30).

---

## 🗺️ Phase 2: Marketing & Discovery

### 2.1 Hero Search Experience
**Prompt:**
> Build a `HeroSearch` component.
> **Visuals**: Large serif headline "Discover Medellín".
> **Input**: A centered, floating search bar with a "glassmorphism" background (blur).
> **Interactions**:
> - On input focus: The bar expands slightly, and the background dims.
> - "Quick Chips": Below the search, show pills (Coffee, Nature, Nightlife).
> - **Action**: Clicking a chip should auto-fill the search or navigate to the Map Explorer.

**Best Practices:**
- Use `aria-label` on the search input.
- Ensure the contrast ratio of text over the background image is sufficient (use overlay if needed).

### 2.2 Map Explorer Interface
**Prompt:**
> Create a `MapExplorer` page layout.
> **Z-Index Strategy**:
> - Layer 0: Full screen Map container (use a placeholder div with a grey/green map style for now).
> - Layer 10: Top Filter Bar (Horizontal scrollable pills: "Open Now", "Rated 4.5+", "Near Me").
> - Layer 20: Bottom Card Carousel (Mobile) or Left Sidebar (Desktop).
> **Responsiveness**:
> - Mobile: Cards allow swiping (snap-scroll).
> - Desktop: Grid of cards on the left, Map fixed on the right.

---

## 🤖 Phase 3: AI Concierge

### 3.1 Chat Interface (The "Brain")
**Prompt:**
> Develop the `AIConcierge` component.
> **Layout**:
> - **Desktop**: Split screen. Left 40% = Chat, Right 60% = Visual Results (Map/Cards).
> - **Mobile**: Full screen chat with a "Pull Up" drawer handle at the bottom.
> **Chat Bubbles**:
> - User: Dark bubble, right aligned.
> - AI: Transparent/Light bubble, left aligned, with a luxury avatar.
> **States**:
> - Empty: "How can I help you experience Medellín?"
> - Thinking: Three subtle bouncing dots (custom animation, not generic).
> - Result: A "Card" embedded in the chat or pushing content to the Result Panel.

### 3.2 Dynamic Results Drawer
**Prompt:**
> Create a `ResultsDrawer` component for Mobile.
> **Behavior**:
> - It sits at the bottom of the screen (height: 120px) showing a "Preview" of the top recommendation.
> - User can drag it up to snap points: 50% screen and 100% screen.
> - Use `framer-motion` drag constraints.
> **Content**:
> - A list of `ExperienceCard` components.

---

## 📅 Phase 4: Trip Planner

### 4.1 Wizard Flow (State Management)
**Prompt:**
> Build a `TripWizard` component using a "Funnel" pattern.
> **State**: Manage `step` (1-4) and `selections` object.
> **UI**:
> - Top: Simple progress bar (Emerald line).
> - Center: The active question (Transition: Slide Left/Right).
> **Steps**:
> 1.  **Duration**: Number counter.
> 2.  **Vibe**: Grid of selectable image cards (Relaxed, Adventure, Party).
> 3.  **Interests**: Multi-select pills.
> **Output**: Generate a mock itinerary view.

**Success Criteria:**
- Smooth transitions between steps.
- "Next" button is disabled until a selection is made.

---

## 💎 Phase 5: Detail & Action

### 5.1 Universal Detail Template
**Prompt:**
> Refactor the existing `ExperienceDetail` page into a reusable `PlaceDetail` template.
> **Props**: `heroImage`, `title`, `rating`, `description`, `amenities`, `location`, `images`.
> **New Feature - Sticky Action Bar (Mobile)**:
> - On scroll down, a bottom bar appears with "Reserve" and "Directions" buttons.
> - Use `AnimatePresence` to slide it up when the main CTA scrolls out of view.

---

## 🛠️ Responsive & Best Practices Checklist

### Mobile-First Implementation
- [ ] **Touch Targets**: Ensure all buttons and pills are at least 44px high.
- [ ] **Safe Areas**: Account for the iPhone notch and home indicator in the layout (padding-bottom/top).
- [ ] **Inputs**: Font size must be at least 16px to prevent iOS from zooming in on focus.

### Performance
- [ ] **Images**: Use the `ImageWithFallback` component. Ensure distinct sizes are requested from Unsplash (w=400 for cards, w=1200 for hero).
- [ ] **Code Splitting**: Lazy load the Map component and the Experience Gallery.

### Interaction Polish
- [ ] **Hover**: Desktop hover states should lift the card (`y: -5px`) and slightly deepen the shadow.
- [ ] **Tap**: Mobile tap states should scale down slightly (`scale: 0.98`) to provide tactile feedback.
