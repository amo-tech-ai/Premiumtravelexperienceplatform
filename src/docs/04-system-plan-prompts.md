# 🎨 System Implementation Prompts
> **Project**: i love Medellín — Luxury AI Concierge  
> **Purpose**: Sequential, high-fidelity prompts to build the platform from Design to Code.  
> **Aesthetic**: "Luxury Eco-Modern" (Deep Emerald, Soft Gold, Off-White, Serif Headings).
> **Reference**: Strictly follow `/docs/05-design-code-contracts.md` for data shapes.

---

## 🟢 Prompt 1: Design System Foundation & App Shell

**Goal**: Establish the visual language and core navigation structure.

**Input Prompt for AI**:
> "Create a 'Luxury Eco-Modern' design system and the main AppShell for a React application. 
> 
> **1. Visual Style Guide (Figma Spec)**:
> - **Typography**: `Playfair Display` (Headings H1-H3), `Inter` (Body).
> - **Colors**: Bg `#F7F7F5`, Text `#1A1A1A`, Primary `#064E3B`, Accent `#D4AF37`.
> - **Tokens**: `rounded-2xl`, `shadow-luxury`, `backdrop-blur-md`.
> 
> **2. Core Components**:
> - `Button`: Primary (Emerald), Secondary (Outline), Ghost.
> - `LuxuryCard`: Use the exact props interface defined in `/docs/05-design-code-contracts.md` Section 2.1.
> 
> **3. App Shell Architecture**:
> - Sticky **Top Navigation** (Desktop): Home, Events, Real Estate, Itinerary.
> - **Bottom Navigation** (Mobile): Icons.
> - Responsive layout wrapper."

**Success Criteria**:
- [ ] Typography and Colors match the Style Guide.
- [ ] `LuxuryCard` accepts the correct props (`footerRight`, `footerLeft`).
- [ ] Navigation is responsive.

---

## 🟢 Prompt 2: Immersive Home Page

**Goal**: Build a high-conversion landing page with scroll storytelling.

**Input Prompt for AI**:
> "Design and build the **Home Page**.
> 
> **1. Sections**:
> - **Hero**: 'Smarter Discovery for Medellín'. Parallax bg. CTAs: 'Start Exploring', 'Ask Concierge'.
> - **Flow**: Animated 'How it Works' steps.
> - **Categories**: Grid of visual cards.
> - **Trust**: Stats row.
> 
> **2. Interactions**:
> - Scroll-triggered fade-ups using `framer-motion`.
> - Use `Aspect Ratio` component for images."

**Success Criteria**:
- [ ] Hero Parallax works.
- [ ] Scroll animations are smooth.
- [ ] Links route correctly.

---

## 🟢 Prompt 3: Unified AI Concierge UI

**Goal**: The core differentiator—a smart chat interface.

**Input Prompt for AI**:
> "Build the **Unified AI Concierge**.
> 
> **1. Layout**:
> - Desktop: Floating Button -> Split View Overlay.
> - Mobile: Full-screen Modal + Swipeable Bottom Sheet.
> 
> **2. Logic (Mock)**:
> - `AIContext`: Manage `messages`, `intent`.
> - **Mock Logic**: If input contains 'apartment', set `intent='REAL_ESTATE'`.
> 
> **3. Data Contracts**:
> - Use `Intent Classification Schema` from `/docs/05-design-code-contracts.md` Section 3.1.
> - Render `ResultsDrawer` using the `Visual Drawer Result Schema`."

**Success Criteria**:
- [ ] Chat opens/closes smoothly.
- [ ] "Show me apartments" switches tab to Real Estate.
- [ ] Mobile drawer snaps correctly.

---

## 🟢 Prompt 3.5: AI Contract Lock & System States

**Goal**: Ensure robust error handling and data contracts before connecting real AI.

**Input Prompt for AI**:
> "Implement **System States & Fallbacks**.
> 
> **1. Components**:
> - `LoadingSkeleton`: Shimmer effect matching `LuxuryCard`.
> - `EmptyState`: 'No results found' with clear/retry action.
> - `ErrorState`: 'Connection lost' message.
> - `AIThinking`: Pulsing animation.
> 
> **2. Validation**:
> - Ensure `ResultsDrawer` handles `undefined` or malformed JSON gracefully by showing `ErrorState`."

**Success Criteria**:
- [ ] Loading states look premium (no generic spinners).
- [ ] Empty states provide a way out.

---

## 🟢 Prompt 4: Events & Discovery Module

**Goal**: Event directory with filters and map.

**Input Prompt for AI**:
> "Implement the **Events Discovery Page** (`/events`).
> 
> **1. UI**:
> - Header with Search.
> - Filter Rail.
> - Grid of `EventCard` components.
> 
> **2. Data**:
> - Use `EventCardProps` from `/docs/05-design-code-contracts.md` Section 2.2.
> - Mock data should match the `events` table schema (Section 4.3).
> 
> **3. Map**:
> - Toggle between List and Map view."

**Success Criteria**:
- [ ] Grid responsiveness.
- [ ] Data shape matches the contract.
- [ ] Save button works (local state).

---

## 🟢 Prompt 5: Real Estate Module

**Goal**: Investment-focused property search.

**Input Prompt for AI**:
> "Build the **Real Estate Section** (`/real-estate`).
> 
> **1. UI**:
> - Property Search Grid using `PropertyCard` (Contract Section 2.3).
> - Market Data Charts (Recharts).
> 
> **2. Listing Detail** (`/real-estate/listing/:id`):
> - Hero Gallery.
> - Info Grid (Price, Specs, ROI).
> - Agent CTA (Lead Capture Mode).
> 
> **3. Data**:
> - Mock data must match `properties` table schema (Section 4.2)."

**Success Criteria**:
- [ ] Property cards display ROI and Specs correctly.
- [ ] Charts render.
- [ ] Agent CTA opens contact modal.

---

## 🟢 Prompt 6: Trip Planner Wizard

**Goal**: Multi-step itinerary generation.

**Input Prompt for AI**:
> "Create the **Trip Planner Wizard** (`/itinerary/new`).
> 
> **1. Steps**:
> - Duration -> Travelers -> Interests -> Budget.
> 
> **2. Itinerary View**:
> - Timeline with Drag & Drop.
> - Map route visualization."

**Success Criteria**:
- [ ] Form validation.
- [ ] Drag & drop works.

---

## 🟢 Prompt 7: Wiring Supabase & Real Logic

**Goal**: Connect frontend to backend.

**Input Prompt for AI**:
> "Connect to **Supabase**.
> 
> **1. Integration**:
> - Replace mock data with `useSupabaseQuery`.
> - Fetch from `events` and `properties` tables.
> 
> **2. AI Simulation**:
> - Finalize the local mock 'Intent Classifier' to return strict JSON matching Contract 3.1.
> 
> **3. Auth**:
> - Add Sign In modal."

**Success Criteria**:
- [ ] Data loads from DB.
- [ ] Auth works.

---

## 🟢 Prompt 8: Mobile Polish

**Goal**: Native-quality mobile feel.

**Input Prompt for AI**:
> "Perform **Mobile Polish**.
> 
> **1. Gestures**:
> - Swipe-to-dismiss on Bottom Sheet.
> - Horizontal swipe on filters.
> 
> **2. Checks**:
> - Text legibility (>14px).
> - Touch targets (>44px)."

**Success Criteria**:
- [ ] Fluid mobile experience.
- [ ] No layout shifts.
