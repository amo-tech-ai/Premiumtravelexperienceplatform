# 🗺️ EXPLORE DASHBOARD - COMPLETE DESIGN DOCUMENTATION
## Discovery & Map Interface

**Page:** `/explore` or `/map`  
**Component:** `ExplorePage.tsx`  
**Status:** ✅ Complete  
**Last Updated:** December 21, 2024

---

## 📑 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Layout Structure](#layout-structure)
3. [UI Components](#ui-components)
4. [User Journeys](#user-journeys)
5. [Workflows](#workflows)
6. [Routes & Links](#routes--links)
7. [Responsive Design](#responsive-design)
8. [Implementation Prompts](#implementation-prompts)

---

## 🎯 OVERVIEW

### **Purpose**
The Explore page is the primary discovery interface where users browse restaurants, activities, stays, and experiences in their chosen location. It combines a **content feed**, **smart filters**, and an **interactive map** for multi-modal exploration.

### **Key Features**
- ✅ Location-based discovery (El Poblado, Medellín)
- ✅ Smart category filters (Restaurants, Things to Do, Stays, Coffee, Nightlife)
- ✅ AI-powered contextual suggestions
- ✅ Interactive map with pins
- ✅ Place detail drawer (side sheet)
- ✅ Save to trip functionality
- ✅ Mobile-optimized with fullscreen map overlay

### **Visual Style**
```
Aesthetic: Clean, editorial, calm
Cards: Large images (4:3 aspect ratio), illustrated
Typography: Serif headlines, sans-serif body
Colors: White base, emerald accents, soft shadows
Motion: Smooth transitions, spring animations
```

---

## 📐 LAYOUT STRUCTURE

### **Desktop Layout (1024px+)**

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌─────────────────────────────┐  ┌────────────┐ │
│  │          │  │  SEARCH BAR                 │  │            │ │
│  │          │  │  ┌─────────────────────┐    │  │            │ │
│  │          │  │  │ 🔍 Search places... │    │  │            │ │
│  │   LEFT   │  │  └─────────────────────┘    │  │   RIGHT    │ │
│  │  SIDEBAR │  │                              │  │    MAP     │ │
│  │          │  │  CATEGORY TABS               │  │            │ │
│  │  (From   │  │  [All] Restaurants Things... │  │            │ │
│  │  AppShell)  │                              │  │  ┌──────┐  │ │
│  │          │  │  ┌─────────────────────┐    │  │  │ Pin  │  │ │
│  │  • Chats │  │  │ 📍 Thursday Afternoon│   │  │  └──────┘  │ │
│  │  • Trips │  │  │ AI Contextual Hint   │   │  │            │ │
│  │  • Explore  │  └─────────────────────┘    │  │  [Interactive│
│  │  • Saved │  │                              │  │   Mapbox   │ │
│  │  • Concierge│  ╔═══════════════════╗       │  │   or Google│ │
│  │          │  │  ║ RESTAURANTS       ║       │  │   Maps]    │ │
│  │          │  │  ╚═══════════════════╝       │  │            │ │
│  │          │  │  ┌─────┐  ┌─────┐            │  │  📍 $11    │ │
│  │          │  │  │Card │  │Card │            │  │  📍 $$     │ │
│  │          │  │  │ 1   │  │ 2   │            │  │  📍 $$$    │ │
│  │          │  │  └─────┘  └─────┘            │  │            │ │
│  │          │  │                              │  │  Zoom: +/- │ │
│  │          │  │  THINGS TO DO                │  │            │ │
│  │          │  │  ┌─────────┐  ┌──────────┐  │  │            │ │
│  │          │  │  │ Card 3  │  │ Card 4   │  │  │            │ │
│  │          │  │  └─────────┘  └──────────┘  │  │            │ │
│  │          │  │                              │  │            │ │
│  └──────────┘  └─────────────────────────────┘  └────────────┘ │
│     180px              Flex-grow (60%)               400-500px   │
└─────────────────────────────────────────────────────────────────┘
    Total: ~1440px+ desktop width
```

### **Mobile Layout (< 768px)**

```
┌─────────────────────────────┐
│  ┌───────────────────────┐  │
│  │ 🏢 Concierge    ☰     │  │ ← Mobile Header
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ 🔍 Search places...   │  │ ← Search Bar
│  └───────────────────────┘  │
│                             │
│  [All] [Restaurants] [...] │ ← Horizontal Scroll Tabs
│                             │
│  ┌───────────────────────┐ │
│  │ 📍 Thursday Afternoon │ │ ← AI Hint Card
│  │ Perfect for coffee... │ │
│  └───────────────────────┘ │
│                             │
│  RESTAURANTS  See more →   │
│  ┌───────────────────────┐ │
│  │    [Image]            │ │
│  │                       │ │
│  │    El Cielo Restaurant│ │
│  │    ⭐ 4.9 • $$$$ • 0.2mi│ │
│  └───────────────────────┘ │
│                             │
│  ┌───────────────────────┐ │
│  │    [Image]            │ │
│  │    Carmen             │ │
│  └───────────────────────┘ │
│                             │
│  THINGS TO DO  See more →  │
│  ┌───────────────────────┐ │
│  │    [Image]            │ │
│  └───────────────────────┘ │
│                             │
│         [🗺️ Map View]      │ ← Floating Action Button
│                             │
└─────────────────────────────┘

WHEN MAP BUTTON CLICKED:
┌─────────────────────────────┐
│  ┌───────────────────────┐  │
│  │         MAP           │  │
│  │      [Full Screen]    │  │
│  │                       │  │
│  │   📍  📍  📍          │  │
│  │                       │  │
│  │   📍       📍         │  │
│  │                  [X]  │  │ ← Close Button
│  │                       │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │ ← Bottom Sheet (selected place)
│  │ [Img] El Cielo        │  │
│  │ ⭐ 4.9 • $$$$ • 0.2mi │  │
│  └───────────────────────┘  │
│         [📋 Show List]       │
└─────────────────────────────┘
```

---

## 🧩 UI COMPONENTS

### **1. Search Bar**
```tsx
Component: Part of ExploreFilters.tsx
Location: Top of content area
Features:
  - Placeholder: "Search places, vibes, or cravings..."
  - Icon: 🔍 (Search icon)
  - Smart search with keyword detection
  - Real-time filtering

Styling:
  - Background: White
  - Border: 1px solid slate-200
  - Rounded: rounded-xl
  - Height: h-12
  - Shadow: shadow-sm
  - Focus: border-emerald-500, ring-2 ring-emerald-100
```

### **2. Category Tabs**
```tsx
Component: ExploreFilters.tsx
Categories:
  - For You (personalized)
  - All
  - Restaurants
  - Things to Do
  - Stays
  - Coffee
  - Nightlife

Styling:
  - Layout: Horizontal scroll on mobile
  - Active: bg-emerald-100 text-emerald-700
  - Inactive: text-slate-600 hover:text-slate-900
  - Rounded: rounded-full
  - Padding: px-4 py-2
```

### **3. AI Contextual Hint Card**
```tsx
Component: Custom div in ExplorePage.tsx (lines 295-307)
Content:
  - Icon: ✨ Sparkles (in circle)
  - Headline: "Thursday Afternoon in Poblado"
  - Description: "It's currently 24°C. Perfect for a walking tour..."

Styling:
  - Background: gradient-to-r from-emerald-50 to-slate-50
  - Border: 1px solid emerald-100
  - Rounded: rounded-2xl
  - Shadow: shadow-sm
  - Padding: p-4
  - Icon: white circle with emerald text

Purpose: Provides time-based, weather-aware suggestions
```

### **4. Place Card**
```tsx
Component: PlaceCard.tsx
Layout: Vertical (default) or Horizontal (mobile map)

Structure:
  ┌─────────────────────┐
  │  [Image Carousel]   │ ← 4:3 aspect ratio
  │  🏷️ CATEGORY       │ ← Badge (top-left)
  │  ❤️ ➕             │ ← Actions (top-right)
  │  ⚫⚫○              │ ← Dots (carousel)
  ├─────────────────────┤
  │  Title         ⭐ 4.9│
  │  $$$$ • 0.2 mi      │
  │  ┌─────────────────┐│
  │  │ ✨ AI Hint      ││ ← Emerald background
  │  └─────────────────┘│
  └─────────────────────┘

Features:
  - Image carousel (3 images per place)
  - Hover effects (shadow, scale)
  - Save button (heart icon)
  - Add to trip button (plus icon)
  - AI hint badge (optional)
  - Category badge
  - Rating with star
  - Price level & distance

Dimensions (Desktop):
  - Width: ~340px (in 2-column grid)
  - Height: ~380px
  - Image: 4:3 aspect ratio (~255px height)

Interactions:
  - Click: Opens detail drawer
  - Hover: Shows action buttons, lifts shadow
  - Heart click: Saves to collection
  - Plus click: Adds to active trip
```

### **5. Section Headers**
```tsx
Component: Custom div in ExplorePage.tsx (line 313)
Structure:
  Restaurants                  See more →

Styling:
  - Headline: text-xl font-serif font-bold
  - "See more": text-sm text-slate-400 hover:text-emerald-700
  - Spacing: mb-4 between header and cards
```

### **6. Interactive Map**
```tsx
Component: ExploreMap.tsx
Provider: Mapbox or Google Maps (implementation dependent)
Features:
  - Place pins (color-coded by category)
  - Active pin highlight (larger, pulsing)
  - Click pin → opens detail drawer
  - Hover pin → highlights corresponding card
  - Zoom controls: +/- buttons
  - Center on user location button

Pin Styles:
  - Default: Red circle with white border
  - Active: Larger, drop shadow, pulse animation
  - Price overlay: White badge with price ($11)

Dimensions (Desktop):
  - Width: 400-500px (right sidebar)
  - Height: 100vh (full screen)

Mobile:
  - Fullscreen overlay (fixed inset-0)
  - Close button (top-right)
  - Bottom sheet with selected place card
```

### **7. Place Detail Drawer**
```tsx
Component: PlaceDetailDrawer.tsx
Type: Side sheet (slides from right)
Width: 500px (desktop), 100% (mobile)

Structure:
  ┌───────────────────────┐
  │   [Hero Image]        │
  │   🏷️ Category         │
  │   El Cielo Restaurant │
  │   ⭐ 4.9 (1240)      │ [X]
  ├───────────────────────┤
  │  [Add to Trip] 💬 📤 │ ← Action Buttons
  ├───────────────────────┤
  │  ✨ Why you'll love it │
  │  Must-visit for...    │
  ├───────────────────────┤
  │  🕒 OPEN NOW          │
  │  Until 11:00 PM       │
  │                       │
  │  📍 DISTANCE          │
  │  0.2 mi away          │
  ├───────────────────────┤
  │  About                │
  │  Experience essence...│
  ├───────────────────────┤
  │  Location             │
  │  [Mini Map]           │
  │  [View on Google Maps]│
  └───────────────────────┘

Sections:
  1. Hero image (h-72, gradient overlay)
  2. Action bar (Add to Trip, Ask AI, Share)
  3. "Why you'll love it" (emerald highlight)
  4. Open hours & distance
  5. About description
  6. Location (mini map + link)
  7. Reviews (optional)
  8. Similar places (optional)

Animations:
  - Slide in from right: x: "100%" → "0%"
  - Spring animation: damping: 30, stiffness: 300
  - Backdrop blur: bg-slate-900/20 backdrop-blur-sm
```

### **8. Floating Action Button (Mobile)**
```tsx
Component: Custom button in ExplorePage.tsx (line 358)
Label: "🗺️ Map View"
Position: Fixed bottom-6, centered
Styling:
  - Background: bg-slate-900
  - Text: text-white
  - Rounded: rounded-full
  - Shadow: shadow-2xl
  - Height: h-12
  - Padding: px-6
  - Hover: hover:bg-emerald-900, scale-105

Behavior:
  - Click: Opens fullscreen map overlay
  - Only visible on mobile (<1024px)
```

---

## 👤 USER JOURNEYS

### **Journey 1: Browse → Save → Add to Trip**

```
1. User lands on /explore
   ↓
2. Sees AI contextual hint: "Thursday Afternoon in Poblado"
   ↓
3. Scrolls through "Restaurants" section
   ↓
4. Hovers over "El Cielo Restaurant" card
   → Card lifts with shadow
   → Action buttons appear (heart, plus)
   ↓
5. Clicks heart icon (save)
   → Heart fills with red
   → Added to "Saved" collection
   ↓
6. Clicks on card
   → Detail drawer slides in from right
   ↓
7. Reviews details (images, hours, AI hint)
   ↓
8. Clicks "Add to Trip" button
   → Added to active trip
   → Toast notification: "Added to Paris Trip"
   ↓
9. Closes drawer
   → Continues browsing
```

### **Journey 2: Search → Filter → View on Map**

```
1. User clicks search bar
   ↓
2. Types "romantic dinner"
   → Real-time filtering
   → Shows only romantic restaurants
   ↓
3. Sees 2 results: El Cielo, Carmen
   ↓
4. Clicks "Restaurants" tab to narrow
   → Category filter applied
   ↓
5. Hovers over "El Cielo" card
   → Pin on map highlights (right sidebar)
   → Pin pulses and enlarges
   ↓
6. Clicks on map pin instead
   → Detail drawer opens
   → Same place details
   ↓
7. Clicks "View on Google Maps"
   → Opens Google Maps in new tab
```

### **Journey 3: Mobile Map Exploration**

```
1. User opens /explore on mobile (375px width)
   ↓
2. Scrolls through card feed
   ↓
3. Sees floating "Map View" button at bottom
   ↓
4. Taps button
   → Fullscreen map overlay slides up
   → Shows all place pins
   ↓
5. Taps pin on map
   → Bottom sheet appears with place card
   → Card shows image, title, rating, price
   ↓
6. Taps card in bottom sheet
   → Detail drawer opens (full screen)
   ↓
7. Reads details, adds to trip
   ↓
8. Closes drawer → back to map
   ↓
9. Taps "Show List" button
   → Map overlay slides down
   → Returns to card feed
```

### **Journey 4: AI-Powered Discovery**

```
1. User lands on /explore
   ↓
2. Reads AI hint: "Perfect for a rooftop coffee"
   ↓
3. Clicks "Coffee" tab
   → Filters to coffee shops
   ↓
4. Sees "Pergamino Café" with AI hint:
   "Popular with digital nomads in the morning"
   ↓
5. Clicks card → Detail drawer opens
   ↓
6. Sees "Why you'll love it" section
   → AI explains: "Matches your preference for quiet work"
   ↓
7. Clicks "Ask AI Concierge" button (💬)
   → Drawer closes
   → AI Concierge panel opens (left)
   → Pre-filled question: "Tell me more about Pergamino Café"
   ↓
8. AI responds with personalized recommendation
   ↓
9. User adds to trip
```

---

## ⚙️ WORKFLOWS

### **Workflow 1: Place Discovery & Filtering**

```mermaid
User Action                  Frontend                     Backend
     │                          │                            │
     ├─[1] Load /explore        │                            │
     │                          │                            │
     │                          ├─[2] Fetch places          │
     │                          │                            │
     │                          │     (Mock data for now)    │
     │                          │                            │
     │◄─[3] Render page─────────┤                            │
     │     - Search bar         │                            │
     │     - Category tabs      │                            │
     │     - Place cards        │                            │
     │     - Map                │                            │
     │                          │                            │
     ├─[4] Select "Restaurants"│                            │
     │                          │                            │
     │                          ├─[5] Filter places          │
     │                          │     (client-side)          │
     │                          │                            │
     │◄─[6] Re-render───────────┤                            │
     │     - Only restaurants   │                            │
     │     - Update map pins    │                            │
```

### **Workflow 2: Save Place**

```mermaid
User Action                  Frontend                     Context API
     │                          │                            │
     ├─[1] Click heart on card  │                            │
     │                          │                            │
     │                          ├─[2] handleToggleSave()     │
     │                          │                            │
     │                          ├─[3] Check if already saved │
     │                          │                            │
     │                          ├─[4] saveItem()────────────►│
     │                          │                            │
     │                          │                            ├─[5] Update state
     │                          │                            │     savedItems.add()
     │                          │                            │
     │                          │◄──[6] State updated────────┤
     │                          │                            │
     │◄─[7] Re-render───────────┤                            │
     │     - Heart fills red    │                            │
     │     - Visual feedback    │                            │
     │                          │                            │
     │                          ├─[8] Optional: Persist      │
     │                          │     POST /saved            │
     │                          │     (background)           │
```

### **Workflow 3: Map Pin Interaction**

```mermaid
User Action                  Frontend                     Map Component
     │                          │                            │
     ├─[1] Hover over card      │                            │
     │                          │                            │
     │                          ├─[2] onHover()              │
     │                          │                            │
     │                          ├─[3] setActivePlaceId()     │
     │                          │                            │
     │                          │                            ├─[4] Update map
     │                          │                            │     - Highlight pin
     │                          │                            │     - Pulse animation
     │                          │                            │
     ├─[5] Click on map pin     │                            │
     │                          │◄──[6] onPinClick()─────────┤
     │                          │                            │
     │                          ├─[7] setActivePlaceId()     │
     │                          │     setIsDrawerOpen(true)  │
     │                          │                            │
     │◄─[8] Render drawer───────┤                            │
     │     - Slide in animation │                            │
     │     - Show place details │                            │
```

---

## 🔗 ROUTES & LINKS

### **Primary Route**
```
/explore → ExplorePage.tsx
Alias: /map (could be mapped to same component)
```

### **Internal Links (From Explore Page)**

| Action | Route | Method |
|--------|-------|--------|
| Click place card | Opens drawer (no route change) | Modal |
| Click "Add to Trip" | Adds to TripContext | State update |
| Click "View on Google Maps" | External link | `window.open()` |
| Click "Ask AI" | Opens AI Concierge | `toggleOpen()` |
| Click "See more" | `/experiences/medellin` | `navigate()` |
| Click "Saved" icon | Updates AIContext | State update |

### **Navigation Links (Left Sidebar)**

```tsx
// From AppShell.tsx
<Link to="/chats">Chats</Link>            // Chat history
<Link to="/trips">Trips</Link>            // Trip list
<Link to="/explore">Explore</Link>        // Current page (active)
<Link to="/saved">Saved</Link>            // Saved places
<Link to="/concierge">Concierge</Link>    // AI chat
```

### **External Links**

```tsx
// Google Maps
const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

// Place website (if available)
<a href={place.url} target="_blank">Visit Website</a>

// Share link
const shareUrl = `${window.location.origin}/explore?place=${placeId}`;
```

---

## 📱 RESPONSIVE DESIGN

### **Breakpoints**

```css
/* Mobile First Approach */
Default:     0-767px     (Mobile)
md:          768px+      (Tablet)
lg:          1024px+     (Desktop with map)
xl:          1280px+     (Large desktop)
```

### **Layout Adaptations**

| Screen Size | Left Sidebar | Content Feed | Right Map | Map Access |
|-------------|--------------|--------------|-----------|------------|
| < 768px | Hidden (bottom nav) | Full width | Hidden | Floating button → Fullscreen overlay |
| 768-1023px | Hidden | Full width | Hidden | Floating button |
| 1024px+ | Visible | ~60% width | Visible (400px) | Always visible |

### **Component Responsiveness**

#### **Search Bar**
```css
Mobile:  w-full, px-4
Tablet:  w-full, px-6
Desktop: w-full, px-6
```

#### **Category Tabs**
```css
Mobile:  Horizontal scroll, overflow-x-auto
Desktop: Flex wrap (if needed)
```

#### **Place Cards Grid**
```css
Mobile:   grid-cols-1 (single column)
Tablet:   grid-cols-2 (two columns)
Desktop:  grid-cols-2 (maintains 2 columns with map visible)
```

#### **AI Hint Card**
```css
Mobile:  p-4, text-sm
Desktop: p-4, text-sm (same)
```

#### **Detail Drawer**
```css
Mobile:  w-full (full screen)
Desktop: w-[500px] (side sheet)
```

### **Touch Interactions (Mobile)**

```tsx
// Swipe to close drawer
onTouchStart={(e) => setStartY(e.touches[0].clientY)}
onTouchEnd={(e) => {
  const diff = e.changedTouches[0].clientY - startY;
  if (diff > 100) onClose();
}}

// Pinch to zoom on map
(handled by map library)

// Pull to refresh (optional)
// Not implemented yet
```

---

## 🎨 DESIGN BEST PRACTICES

### **Images**

1. **Aspect Ratio**: 4:3 (width:height) for all place cards
2. **Quality**: Use high-res images (min 800x600px)
3. **Optimization**: Use WebP with JPEG fallback
4. **Loading**: Lazy load images below fold
5. **Fallback**: ImageWithFallback component handles errors
6. **Carousel**: 3 images per place, smooth transitions

```tsx
// Image implementation
<ImageWithFallback
  src="https://images.unsplash.com/photo-..."
  alt="El Cielo Restaurant"
  className="w-full h-full object-cover"
/>
```

### **Cards**

1. **Shadow**: Start with `shadow-sm`, elevate to `shadow-xl` on hover
2. **Rounded corners**: `rounded-2xl` for soft, luxury feel
3. **Hover effects**: 
   - Scale: `group-hover:scale-105`
   - Shadow lift: `hover:shadow-xl`
   - Action reveal: Fade in save/add buttons
4. **Spacing**: `gap-6` between cards for breathing room
5. **Border**: `border border-slate-100` for subtle definition

### **Typography**

```css
Card title:        text-base font-medium (sans-serif)
Section heading:   text-xl font-serif font-bold
AI hint:           text-xs (emerald-700 on emerald-50)
Metadata:          text-sm text-slate-500
Rating:            text-sm font-medium text-slate-900
```

### **Colors**

```css
Primary:       emerald-700 (accent, CTAs)
Background:    white
Text:          slate-900 (headings), slate-600 (body)
Borders:       slate-100, slate-200
AI accent:     emerald-50 (background), emerald-700 (text)
Hover states:  emerald-100 (buttons), emerald-200 (borders)
```

### **Motion**

```tsx
// Spring animations for natural feel
transition={{ type: "spring", damping: 30, stiffness: 300 }}

// Staggered reveals (cards appearing)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
/>

// Hover elevation
transition="all duration-300"
```

---

## 🛠️ IMPLEMENTATION PROMPTS

### **STEP 1: Setup Base Layout**

```markdown
**Prompt:**
Create an Explore page component at `/pages/ExplorePage.tsx` with the following structure:

1. **Desktop Layout (1024px+):**
   - Left: Sidebar from AppShell (provided)
   - Center: Content feed (flex-1, scrollable)
   - Right: Map sidebar (400px fixed width)

2. **Mobile Layout (< 1024px):**
   - Full width content feed
   - Hidden left sidebar (use bottom nav)
   - Map accessible via floating button

3. **State Management:**
   - Active filter (string)
   - Search query (string)
   - Active place ID (string | null)
   - Drawer open state (boolean)
   - Mobile map visible (boolean)

4. **Mock Data:**
   - 7 places with properties: id, title, category, rating, price, images (array), lat, lng, tags, aiHint
   - Categories: Restaurants, Things to Do, Stays, Coffee, Nightlife

**Styling:**
- Use Tailwind CSS
- Desktop: `flex h-screen overflow-hidden bg-white`
- Content area: `flex-1 flex flex-col h-full bg-white`
- Map area: `hidden lg:block w-[400px] xl:w-[500px] flex-shrink-0 h-full`

**Dependencies:**
- motion/react (animations)
- lucide-react (icons)
- Context: useAI, useTrip
```

---

### **STEP 2: Create Search & Filters**

```markdown
**Prompt:**
Create a `components/explore/ExploreFilters.tsx` component with:

1. **Search Bar:**
   - Placeholder: "Search places, vibes, or cravings..."
   - Icon: Search icon (lucide-react)
   - Debounced input (500ms delay)
   - onChange calls parent's onSearch callback

2. **Category Tabs:**
   - Array: ['For You', 'All', 'Restaurants', 'Things to Do', 'Stays', 'Coffee', 'Nightlife']
   - Horizontal scroll on mobile (overflow-x-auto)
   - Active state: `bg-emerald-100 text-emerald-700 font-medium`
   - Inactive: `text-slate-600 hover:text-slate-900`
   - Rounded: `rounded-full`, Padding: `px-4 py-2`

3. **Smart Filtering:**
   - Detect keywords: "open now", "cheap", "luxury", "quiet", "romantic"
   - Filter by category, price level, open status, tags
   - Case-insensitive search

**Styling:**
- Sticky header: `sticky top-0 z-20 bg-white border-b border-slate-100`
- Search: `h-12 rounded-xl border border-slate-200 focus:border-emerald-500`
- Tabs container: `flex gap-2 overflow-x-auto scrollbar-hide`

**Example:**
User types "open now romantic" → Shows only open restaurants with "romantic" tag
```

---

### **STEP 3: Build Place Card Component**

```markdown
**Prompt:**
Create `components/explore/PlaceCard.tsx` with vertical and horizontal layouts:

1. **Vertical Layout (Default):**
   ```
   [Image Carousel - 4:3 aspect]
   [Category Badge - top-left]
   [Heart & Plus buttons - top-right]
   [Carousel dots - bottom]
   ─────────────────────────
   Title                ⭐ 4.9
   $$$$ • 0.2 mi
   ┌─────────────────────┐
   │ ✨ AI Hint          │
   └─────────────────────┘
   ```

2. **Features:**
   - Image carousel (3 images, animate on click)
   - Hover: Show action buttons, lift shadow
   - Save button: Heart icon (fill when saved)
   - Add button: Plus icon (adds to trip)
   - AI hint: Emerald badge with sparkle icon
   - Category badge: Top-left, uppercase, white bg

3. **Props:**
   ```tsx
   interface PlaceCardProps {
     id: string;
     title: string;
     images: string[];
     rating: number;
     category: string;
     price: string;
     distance: string;
     tags: string[];
     aiHint?: string;
     layout: 'vertical' | 'horizontal';
     isSaved: boolean;
     onHover?: () => void;
     onClick?: () => void;
     onToggleSave?: (e) => void;
     onAdd?: (e) => void;
   }
   ```

4. **Carousel:**
   - Use motion/react AnimatePresence
   - Fade animation between slides
   - Arrows on hover (ChevronLeft/Right)
   - Dots indicator at bottom
   - Click arrows to navigate

**Styling:**
- Card: `rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl`
- Image: `aspect-[4/3] object-cover`
- Title: `text-base font-medium text-slate-900`
- AI hint: `text-xs text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded-lg`

**Interactions:**
- onClick: Opens detail drawer
- onToggleSave: Saves to collection (prevents propagation)
- onAdd: Adds to trip (prevents propagation)
- onHover: Highlights corresponding map pin
```

---

### **STEP 4: Implement Interactive Map**

```markdown
**Prompt:**
Create `components/explore/ExploreMap.tsx` using Mapbox GL or Google Maps:

1. **Map Setup:**
   - Default center: [6.2476, -75.5658] (Medellín, El Poblado)
   - Default zoom: 14
   - Style: Light/minimal (no excessive labels)
   - Controls: Zoom +/- buttons, current location button

2. **Place Pins:**
   - For each place, add marker at (lat, lng)
   - Default: Red circle (#ef4444) with white border
   - Active: Larger (1.5x), drop shadow, pulse animation
   - Price overlay: White badge with price ($11)

3. **Interactions:**
   - Click pin: Call `onPinClick(placeId)`
   - Hover pin: Change cursor to pointer
   - Active pin updates from parent via `activePlaceId` prop

4. **Props:**
   ```tsx
   interface ExploreMapProps {
     places: Place[];
     activePlaceId: string | null;
     onPinClick: (id: string) => void;
   }
   ```

5. **Responsive:**
   - Desktop: Fixed width (400-500px), full height
   - Mobile: Full screen overlay when shown

**Styling:**
- Container: `w-full h-full relative`
- Pin: Custom marker with HTML element
- Active pin: `scale-125 shadow-lg animate-pulse`

**Example Pin HTML:**
```html
<div class="relative">
  <div class="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
  <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs font-bold">
    $11
  </div>
</div>
```
```

---

### **STEP 5: Create Detail Drawer**

```markdown
**Prompt:**
Create `components/explore/PlaceDetailDrawer.tsx` as a slide-in side sheet:

1. **Structure:**
   - Hero image (h-72) with gradient overlay
   - Category badge (top-left of image)
   - Close button (top-right)
   - Title & rating (on image, bottom)
   - Action buttons: [Add to Trip] [Ask AI 💬] [Share 📤]
   - "Why you'll love it" section (emerald highlight)
   - Open hours & distance row
   - About description
   - Location (mini map + Google Maps link)

2. **Animation:**
   ```tsx
   <motion.div
     initial={{ x: "100%" }}
     animate={{ x: isOpen ? "0%" : "100%" }}
     transition={{ type: "spring", damping: 30, stiffness: 300 }}
     className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto"
   />
   ```

3. **Backdrop:**
   - Fixed overlay: `bg-slate-900/20 backdrop-blur-sm`
   - Click to close

4. **Actions:**
   - "Add to Trip": Main CTA (slate-900 bg, white text)
   - "Ask AI": Icon button (💬, opens AI Concierge)
   - "Share": Icon button (📤, copies link)
   - Heart (save): Top-right of hero

5. **Props:**
   ```tsx
   interface PlaceDetailDrawerProps {
     place: Place;
     isOpen: boolean;
     onClose: () => void;
     isSaved: boolean;
     onToggleSave: () => void;
     onAskAI: () => void;
   }
   ```

**Styling:**
- Hero: `h-72 relative` with `bg-gradient-to-t from-black/60 to-transparent`
- Title: `text-3xl font-serif font-medium text-white`
- Action button: `flex-1 h-12 rounded-xl bg-slate-900 text-white`
- AI hint: `bg-emerald-50 text-emerald-700 p-4 rounded-xl`
```

---

### **STEP 6: Add Mobile Map Overlay**

```markdown
**Prompt:**
Implement fullscreen map overlay for mobile in ExplorePage.tsx:

1. **Floating Button:**
   - Position: Fixed bottom-6, centered
   - Label: "🗺️ Map View"
   - Only visible on < 1024px
   - onClick: `setShowMobileMap(true)`
   - Style: `bg-slate-900 text-white rounded-full shadow-2xl px-6 h-12`

2. **Map Overlay:**
   ```tsx
   <AnimatePresence>
     {showMobileMap && (
       <motion.div
         initial={{ y: "100%" }}
         animate={{ y: 0 }}
         exit={{ y: "100%" }}
         className="fixed inset-0 z-50 bg-white lg:hidden flex flex-col"
       >
         {/* Map */}
         <ExploreMap places={places} activePlaceId={activePlaceId} onPinClick={...} />
         
         {/* Close button (top-right) */}
         <button onClick={() => setShowMobileMap(false)}>X</button>
         
         {/* Bottom sheet (selected place card) */}
         {activePlaceId && (
           <div className="absolute bottom-6 left-4 right-4 z-40">
             <PlaceCard layout="horizontal" {...selectedPlace} />
           </div>
         )}
         
         {/* Footer button */}
         <div className="bg-white border-t p-4">
           <Button onClick={() => setShowMobileMap(false)}>📋 Show List</Button>
         </div>
       </motion.div>
     )}
   </AnimatePresence>
   ```

3. **Interactions:**
   - Tap pin: Updates activePlaceId
   - Tap card in bottom sheet: Opens detail drawer (full screen)
   - Tap "Show List": Closes overlay, returns to feed
```

---

### **STEP 7: Wire Up State & Actions**

```markdown
**Prompt:**
Connect all interactions in ExplorePage.tsx:

1. **Context Integration:**
   ```tsx
   const { savedItems, saveItem, removeItem, injectMessage, toggleOpen } = useAI();
   const { addToTrip } = useTrip();
   ```

2. **Action Handlers:**
   ```tsx
   const handleToggleSave = (e, place) => {
     e?.stopPropagation();
     if (isSaved(place.id)) {
       removeItem(place.id);
     } else {
       saveItem({ id, type, title, image, ... });
     }
   };

   const handleAdd = (e, place) => {
     e?.stopPropagation();
     addToTrip(place, type);
   };

   const handleAskAI = (place) => {
     setIsDrawerOpen(false);
     injectMessage(`Tell me more about ${place.title}`, 'user', 'GENERAL');
     toggleOpen(); // Opens AI Concierge
   };

   const handlePlaceClick = (id) => {
     setActivePlaceId(id);
     setIsDrawerOpen(true);
   };
   ```

3. **Filtering Logic:**
   ```tsx
   const filteredPlaces = useMemo(() => {
     return PLACES.filter(place => {
       // Category filter
       if (activeFilter !== 'For You' && activeFilter !== 'All') {
         if (place.category !== activeFilter) return false;
       }
       
       // Search filter
       if (searchQuery) {
         return place.title.toLowerCase().includes(searchQuery.toLowerCase());
       }
       
       return true;
     });
   }, [activeFilter, searchQuery]);
   ```

4. **Grouping for "For You" view:**
   ```tsx
   const sections = useMemo(() => {
     if (activeFilter !== 'For You') {
       return { [activeFilter]: filteredPlaces };
     }
     
     return {
       'Restaurants': filteredPlaces.filter(p => p.category === 'Restaurants'),
       'Things to Do': filteredPlaces.filter(p => p.category === 'Things to Do'),
       'Stays': filteredPlaces.filter(p => p.category === 'Stays'),
     };
   }, [filteredPlaces, activeFilter]);
   ```
```

---

### **STEP 8: Responsive Polish**

```markdown
**Prompt:**
Add responsive refinements across all components:

1. **Grid Adjustments:**
   ```tsx
   <div className={cn(
     "grid gap-6",
     "grid-cols-1",                    // Mobile: 1 column
     "sm:grid-cols-2",                 // Tablet: 2 columns
     "lg:grid-cols-2"                  // Desktop: 2 columns (map takes space)
   )}>
   ```

2. **Padding Consistency:**
   ```tsx
   <div className="px-4 md:px-6">  // Content area
   ```

3. **Touch Targets:**
   - Buttons: Minimum 44x44px (h-12)
   - Icons: Minimum 24x24px (w-6 h-6)

4. **Scrolling:**
   - Remove scrollbar: `scrollbar-hide` utility
   - Bottom padding: `pb-20 lg:pb-0` (space for mobile bottom nav)

5. **Typography Scaling:**
   - Mobile: Slightly smaller text
   - Desktop: Base size
   - Use rem units for accessibility

6. **Testing Checklist:**
   - [ ] 375px (iPhone SE)
   - [ ] 768px (iPad)
   - [ ] 1024px (Desktop with map)
   - [ ] 1440px (Large desktop)
   - [ ] Touch interactions work
   - [ ] Keyboard navigation works
   - [ ] Screen reader labels present
```

---

## 🎯 HOW THE PAGE WORKS

### **On Load:**
1. Component mounts
2. Fetches places (mock data for now)
3. Renders search bar, filters, cards, map
4. Sets default filter to "For You"
5. Shows AI contextual hint based on time/weather

### **User Filters:**
1. User selects category tab
2. `setActiveFilter('Restaurants')`
3. `filteredPlaces` recalculates (useMemo)
4. Cards re-render (only restaurants)
5. Map updates pins (only restaurants)

### **User Searches:**
1. User types in search bar
2. Debounced input (500ms)
3. `setSearchQuery('romantic')`
4. Smart filtering detects keyword
5. Shows places matching query + active filter

### **User Hovers Card:**
1. `onHover()` called
2. `setActivePlaceId(place.id)`
3. Map receives new `activePlaceId`
4. Corresponding pin pulses and scales

### **User Clicks Card:**
1. `onClick()` called
2. `setIsDrawerOpen(true)`
3. Detail drawer slides in from right
4. Backdrop appears with blur

### **User Saves Place:**
1. Heart icon clicked
2. Event stopped (no drawer open)
3. `saveItem()` in AIContext
4. Icon fills with red
5. Added to "Saved" collection

---

## 📊 FEATURES CHECKLIST

### **Core Features** ✅
- [x] Place discovery feed
- [x] Smart category filters
- [x] Search with keyword detection
- [x] AI contextual hints
- [x] Image carousels on cards
- [x] Save to collection
- [x] Add to trip
- [x] Interactive map with pins
- [x] Detail drawer (side sheet)
- [x] Mobile fullscreen map
- [x] Responsive design (mobile-first)

### **Advanced Features** 🔄
- [ ] Real-time availability
- [ ] Price filtering
- [ ] Distance sorting
- [ ] "Open now" filter
- [ ] Multi-select categories
- [ ] Share place link
- [ ] Place reviews
- [ ] Similar places suggestions

### **Future Enhancements** 🔮
- [ ] AR view (camera overlay)
- [ ] Voice search
- [ ] Saved searches
- [ ] Place comparison
- [ ] Booking integration
- [ ] Real-time prices
- [ ] User photos/reviews
- [ ] Social sharing

---

## 🐛 KNOWN ISSUES & NOTES

### **Current Limitations:**
1. Mock data (7 places) - needs real API
2. Map pins don't reflect real-time data
3. "See more" links don't paginate
4. Search doesn't call backend
5. No loading states
6. No error boundaries on map

### **Performance Considerations:**
1. Lazy load images below fold
2. Debounce search input
3. Memoize filtered results
4. Virtual scrolling for 100+ places
5. Map clustering for dense areas

---

**Document Version:** 1.0.0  
**Lines:** 988  
**Status:** ✅ Complete  
**Ready to implement:** Yes
