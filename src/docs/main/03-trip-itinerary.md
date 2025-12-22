# 🗓️ TRIP ITINERARY PAGE - COMPLETE DESIGN DOCUMENTATION
## Trip Operating System - Main Workspace

**Page:** `/trips/:id` or `/itinerary/:id`  
**Component:** `TripDetailsPage.tsx`  
**Status:** ✅ Complete  
**Last Updated:** December 22, 2024

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
The Trip Itinerary page is the main workspace where users build, organize, and manage their entire trip. It features a day-by-day timeline with drag-and-drop functionality, AI-powered tools, and a comprehensive sidebar with bookings, ideas, and media.

### **Key Features**
- Day-by-day itinerary builder
- Drag-and-drop timeline items
- AI-powered optimizations
- Trip Tools sidebar (7 panels)
- Bookings management
- Saved ideas library
- Media gallery
- Real-time collaboration (future)
- Mobile-optimized with bottom sheet

### **Visual Style**
```
Aesthetic: Luxury editorial, calm, organized
Layout: Three-pane (left nav, center timeline, right tools)
Colors: Warm off-white background (#FDFBF7), emerald accents
Typography: Serif headlines, sans-serif body
Cards: Soft shadows, rounded corners
Motion: Smooth drag animations, spring physics
```

---

## 📐 LAYOUT STRUCTURE

### **Desktop Layout (1024px+)**

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌──────┐  ┌────────────────────────────────────┐  ┌───────────┐  │
│  │      │  │  TRIP HERO (Collapsible)           │  │           │  │
│  │      │  │  ┌──────────────────────────────┐  │  │           │  │
│  │      │  │  │    [Hero Image]               │  │  │  TRIP     │  │
│  │ LEFT │  │  │    Medellín Design Week       │  │  │  TOOLS    │  │
│  │ NAV  │  │  │    📅 Jan 15-20 👥 2 📍 Med...│  │  │           │  │
│  │      │  │  │    [Book Trip] [AI] [Share]   │  │  │  [Collapse│  │
│  │(From │  │  └──────────────────────────────┘  │  │   Button]  │  │
│  │App   │  │                                     │  │           │  │
│  │Shell)│  │  ┌────────────────────────┐        │  │  ⚡ AI      │  │
│  │      │  │  │ AI EMPTY STATE         │        │  │  Actions   │  │
│  │• Chat│  │  │ ✨ Start your adventure │       │  │           │  │
│  │• Trips  │  │ Drag ideas from right  │        │  │  📋 Itinerary│  │
│  │• Explore│  │ [Auto-Generate] Button │        │  │  5 Days    │  │
│  │• Saved│  │  └────────────────────────┘        │  │           │  │
│  │      │  │                                     │  │  📖 Bookings│  │
│  │      │  │  DAY 1  📅 Jan 15  [+ Add]         │  │  2 items   │  │
│  │      │  │  ├─ 09:00  [Timeline Dot]          │  │           │  │
│  │      │  │  │  ┌─────────────────────┐        │  │  💡 Ideas  │  │
│  │      │  │  │  │ 🍳 Breakfast Cafe   │        │  │  12 saved  │  │
│  │      │  │  │  │ ⏱ 1.5h • $15       │        │  │           │  │
│  │      │  │  │  │ [Image]             │        │  │  📸 Media  │  │
│  │      │  │  │  └─────────────────────┘        │  │  8 photos  │  │
│  │      │  │  ├─ 11:00                          │  │           │  │
│  │      │  │  │  ┌─────────────────────┐        │  │  🔑 Key    │  │
│  │      │  │  │  │ 🏛 Museum Visit     │        │  │  Details   │  │
│  │      │  │  │  │ ⏱ 2h • $20         │        │  │           │  │
│  │      │  │  │  └─────────────────────┘        │  │  📅 Calendar│  │
│  │      │  │  └─ [Drop Zone Hint]               │  │           │  │
│  │      │  │                                     │  │  ┌────────┐│  │
│  │      │  │  DAY 2  📅 Jan 16  [+ Add]         │  │  │[Ideas  ││  │
│  │      │  │  └─ [Empty - Plan activities]      │  │  │ Grid]  ││  │
│  │      │  │                                     │  │  │🏛️ 🍽️  ││  │
│  │      │  │  [+ Add Day]                        │  │  │🌆 🎭  ││  │
│  │      │  │                                     │  │  └────────┘│  │
│  └──────┘  └────────────────────────────────────┘  └───────────┘  │
│   180px              Flex-grow (60%)                    360px      │
└─────────────────────────────────────────────────────────────────────┘
    Total: ~1440px desktop width
```

### **Mobile Layout (< 1024px)**

```
┌────────────────────────┐
│  ┌──────────────────┐  │
│  │  [Hero Image]    │  │
│  │  Medellín Design │  │
│  │  Week            │  │
│  │  📅 Jan 15-20    │  │
│  │  [Actions...]    │  │
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │ ✨ AI Empty State│  │
│  │ Tap + to add     │  │
│  │ [Auto-Generate]  │  │
│  └──────────────────┘  │
│                        │
│  DAY 1 📅 Jan 15 [+]  │
│  ├─ 09:00             │
│  │  ┌──────────────┐  │
│  │  │ 🍳 Breakfast │  │
│  │  │ 1.5h • $15   │  │
│  │  │ [Image]      │  │
│  │  └──────────────┘  │
│  ├─ 11:00             │
│  │  ┌──────────────┐  │
│  │  │ 🏛 Museum    │  │
│  │  └──────────────┘  │
│                        │
│  DAY 2 📅 Jan 16 [+]  │
│  └─ [Empty]            │
│                        │
│  [+ Add Day]           │
│                        │
│        [🎯]            │ ← Floating Tools Button
│                        │
└────────────────────────┘

WHEN TOOLS BUTTON TAPPED:
┌────────────────────────┐
│  [Bottom Sheet Slides  │
│   up 80% of screen]    │
│  ┌──────────────────┐  │
│  │  TRIP TOOLS      │  │
│  │  [Drag Handle]   │  │
│  ├──────────────────┤  │
│  │  ⚡ AI Actions   │  │
│  │  📋 Itinerary    │  │
│  │  📖 Bookings     │  │
│  │  💡 Ideas        │  │
│  │  📸 Media        │  │
│  │  🔑 Key Details  │  │
│  │  📅 Calendar     │  │
│  └──────────────────┘  │
└────────────────────────┘
```

---

## 🧩 UI COMPONENTS

### **1. Trip Hero Card**

**Location:** Top of center content area  
**Collapsible:** Yes (minimizes to compact bar)

**Expanded State:**
```
┌────────────────────────────────────────┐
│  [Background Hero Image - Parallax]    │
│  Medellín Design Week                  │
│  📅 Jan 15 - Jan 20  👥 2 travelers    │
│  📍 Medellín, Colombia  💰 $2,500      │
│  ┌──────────────────────────────────┐  │
│  │ [Book Trip] [Auto-Generate] [⋯]  │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
Height: 240px
Background: Gradient overlay (black/40)
Text: White serif font
Actions: Sticky bar at bottom
```

**Collapsed State:**
```
Medellín Design Week | Jan 15-20 | 2 travelers [▼]
Height: 60px
Background: White with subtle border
```

**Styling:**
- Image overlay: black gradient from bottom
- Title: 2xl serif font, white
- Metadata icons: 16px with spacing
- Action buttons: Rounded-lg, emerald primary
- Shadow: Soft elevation

---

### **2. AI Empty State**

**Shown:** When itinerary has no items  
**Purpose:** Guide users to add first activity

```
┌──────────────────────────────────────┐
│         ✨                           │
│    Start your adventure              │
│                                      │
│  Your itinerary is empty. Drag      │
│  ideas from the right, or let the   │
│  AI create one for you.             │
│                                      │
│  [🤖 Auto-Generate Itinerary]       │
│                                      │
│  You can also add items manually... │
└──────────────────────────────────────┘

Styling:
- Background: gradient emerald-50 to slate-50
- Border: dashed emerald-200
- Icon: Large sparkles (emerald-600)
- Title: font-serif text-lg
- Button: Primary CTA (emerald-600)
```

**Interactions:**
- Click "Auto-Generate" → Creates async job
- Shows progress: "Generating... 40%"
- Populates days with AI suggestions

---

### **3. Day Section**

**Structure:**
```
DAY 1  📅 Day 1 (Monday, Jan 15)  [+ Add]
├─ Timeline Line (vertical emerald line)
│
├─ 09:00 ─┬─ [Activity Card]
│         └─ Timeline Dot
│
├─ 11:00 ─┬─ [Activity Card]
│         └─ Timeline Dot
│
├─ 14:00 ─┬─ [Activity Card]
│         └─ Timeline Dot
│
└─ [Drop Zone - Glows when dragging]
```

**Styling:**
- Header: font-serif text-xl, flex between
- Date subtitle: text-sm text-slate-500
- Timeline line: 2px emerald-500, absolute left
- Timeline dots: 12px circle, white with emerald border
- Drop zone: Dashed border when active
- Add button: Ghost variant, + icon

**States:**
- Empty: Shows placeholder text
- Drop target: Emerald glow, scale animation
- Has items: Timeline with dots

---

### **4. Activity Card (Draggable)**

**Layout:**
```
┌────────────────────────────────────────┐
│ [Grip] 09:00    [Content Area]    [⋯] │
│        1.5h                            │
│                                        │
│        🍳 Breakfast at Pergamino       │
│        [FOOD] $15  ✓ Booked           │
│        "Best coffee in Poblado..."    │
│                                        │
│        ┌────────────────────┐         │
│        │  [Image Optional]  │         │
│        └────────────────────┘         │
└────────────────────────────────────────┘
```

**Elements:**
- **Time Column:** Left side, 60px fixed width
  - Main time: Bold text-sm
  - Duration: text-xs text-slate-400
  
- **Content Area:** Flex-1
  - Title: font-semibold text-slate-800
  - Type badge: Small pill (food/activity/stay)
  - Cost badge: If available, $XX format
  - Status badge: "✓ Booked" if confirmed
  - Notes: Italic quote in slate-50 background
  - Image: Optional, rounded, 128px height

- **Actions:** Top-right on hover
  - Edit icon (pencil)
  - Grip handle (dots for dragging)

**Styling:**
- Background: White
- Border: 1px slate-200
- Rounded: rounded-xl
- Shadow: sm, elevates to md on hover
- Hover border: emerald-200
- Padding: p-4
- Gap: gap-4 between sections

**Type Colors:**
- Food: Orange badge (orange-50, orange-600)
- Activity: Emerald badge (emerald-50, emerald-600)
- Stay: Blue badge (blue-50, blue-600)
- Logistics: Slate badge

**Drag States:**
- Grabbing: cursor-grab
- Dragging: opacity-50, ring-2 emerald-500
- Active drag: cursor-grabbing

---

### **5. Trip Tools Sidebar**

**Desktop:** Fixed right, 360px width, collapsible  
**Mobile:** Bottom sheet overlay (80vh)

**Navigation List:**
```
TRIP TOOLS              [Collapse Icon]

⚡ AI Actions           ✨
   Smart optimizations

📋 Itinerary           5 Days
   Day-by-day plan

📖 Bookings            2
   Flights, stays, tickets

💡 Ideas               12
   Saved places & inspiration

📸 Media               8
   Photos & screenshots

🔑 Key Details
   Preferences & logistics

📅 Calendar
   Timeline view
```

**Styling:**
- Background: slate-50
- Border left: 1px slate-200
- Each item: Clickable card
- Active item: emerald-100 background
- Icon: 20px with matching color
- Count badge: Small pill, right-aligned
- Hover: subtle scale, emerald-50 bg

**Collapsed State (Desktop):**
- Width: 72px
- Shows only icons
- Tooltips on hover
- Toggle button at top

---

### **6. AI Actions Panel**

**Content:** Smart trip optimizations

```
AI ACTIONS

┌────────────────────────────────┐
│ 🤖 Optimize Schedule           │
│ Reduce travel time by 40min    │
│ [Apply]                        │
└────────────────────────────────┘

┌────────────────────────────────┐
│ 💡 Budget Suggestion            │
│ Save $120 on dining by...      │
│ [View Details]                 │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ⚡ Quick Wins                   │
│ • Book museum tickets now      │
│ • Restaurant closes at 10pm    │
│ • Weather: Pack umbrella       │
└────────────────────────────────┘

[Ask AI for More Ideas]
```

**Styling:**
- Cards: White bg, slate-200 border
- Icons: Colored (emerald for optimize)
- Buttons: Secondary outline
- Spacing: gap-4 between cards

---

### **7. Ideas Panel (Draggable Library)**

**Content:** Saved places grid

```
IDEAS                 View All →

SAVED PLACES

┌──────┐ ┌──────┐
│[Img] │ │[Img] │
│ +    │ │ +    │  ← Plus icon on hover
│Title │ │Title │
└──────┘ └──────┘

┌──────┐ ┌──────┐
│[Img] │ │[Img] │
│Title │ │Title │
└──────┘ └──────┘

[+ Find More Ideas]
```

**Grid:**
- 2 columns on desktop
- 1 column on mobile
- Aspect ratio: 1:1 (square)
- Gap: 12px

**Drag Interaction:**
- Cursor: grab
- Dragging: opacity-50, ring emerald
- Drop on day: Adds to that day
- Plus button: Quick add to Day 1

---

### **8. Bookings Panel**

**Content:** Flights, hotels, tickets

```
BOOKINGS

┌────────────────────────────────┐
│ [FLIGHT] Jan 15                │
│ MIA → MDE                      │
│ AA 1123                        │
│ [✓ Confirmed]           [+]    │
└────────────────────────────────┘

┌────────────────────────────────┐
│ [STAY] Jan 15-20               │
│ Click Clack Hotel              │
│ RES-992                        │
│ [Booked]                [+]    │
└────────────────────────────────┘

[+ Add Booking]
```

**Styling:**
- Type badge: Small uppercase (flight/stay)
- Confirmation code: Monospace font
- Status: Color-coded badge
- Plus icon: Quick add to timeline

---

### **9. Media Panel**

**Content:** Photo gallery

```
MEDIA                  Upload →

┌──────┐ ┌──────┐ ┌──────┐
│[Img] │ │[Img] │ │[Img] │
└──────┘ └──────┘ └──────┘

┌──────┐ ┌──────┐ ┌──────┐
│[Img] │ │[Img] │ │[Img] │
└──────┘ └──────┘ └──────┘

3 columns, 2:3 aspect ratio
Gap: 8px
Click: Opens lightbox
```

---

### **10. Key Details Panel**

**Content:** Trip logistics

```
KEY DETAILS

┌────────────────────────────────┐
│ 🌐 Visa                        │
│ Not Required (90 days)         │
└────────────────────────────────┘

┌────────────────────────────────┐
│ 💵 Currency                    │
│ COP (Colombian Peso)           │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ⚡ Power                        │
│ Type A/B (110V)                │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ☀️ Weather                     │
│ 24°C / 75°F (Spring)           │
└────────────────────────────────┘
```

**Styling:**
- Icon: Large, colored background circle
- Label: Bold, small caps
- Value: Regular text, slate-700
- Background: White cards with subtle border

---

### **11. Calendar Panel**

**Content:** Timeline view

```
CALENDAR

JAN 2024
Su Mo Tu We Th Fr Sa
                15 16
17 18 19 20 21 22 23

[•] Day with activities
[ ] Empty day
[x] Today

Mini calendar with trip dates highlighted
Click date → Scroll to that day in timeline
```

---

## 👤 USER JOURNEYS

### **Journey 1: Create Itinerary from Scratch**

**Steps:**
1. User creates new trip from dashboard
2. Lands on empty itinerary page
3. Sees AI empty state: "Start your adventure"
4. Clicks "Auto-Generate Itinerary" button
5. Modal appears: "What kind of trip?"
6. Selects: "Balanced (sightseeing + relaxation)"
7. AI creates async job
8. Progress bar shows: "Generating... 0% → 100%"
9. Days populate with suggested activities
10. User reviews AI suggestions
11. Drags unwanted items to trash
12. Adds personal touches from Ideas panel

**Duration:** 2-5 minutes  
**Outcome:** 3-day itinerary with 12 activities

---

### **Journey 2: Drag & Drop from Ideas**

**Steps:**
1. User has saved places from Explore page
2. Opens trip itinerary
3. Right sidebar shows "Ideas" panel (12 items)
4. User finds "Pergamino Café" in grid
5. Drags card from sidebar to Day 1
6. Timeline highlights drop zone (emerald glow)
7. Drops card at "09:00" slot
8. Card animates into position
9. Activity appears in timeline with image
10. User repeats for 3 more places
11. Timeline reflows with proper spacing

**Duration:** 1 minute per item  
**Outcome:** Personalized itinerary with saved favorites

---

### **Journey 3: Reorder Activities**

**Steps:**
1. User reviews Day 1 timeline
2. Realizes breakfast is scheduled after museum
3. Hovers over "Museum" card
4. Grip handle appears (top-right)
5. Drags card downward in timeline
6. Drop zone indicators appear between items
7. Releases at new position (after breakfast)
8. Cards reflow with smooth animation
9. Times auto-adjust if needed
10. Timeline dots reconnect

**Duration:** 10 seconds  
**Outcome:** Logical activity order

---

### **Journey 4: Add Booking to Timeline**

**Steps:**
1. User receives flight confirmation email
2. Opens trip itinerary
3. Right sidebar → "Bookings" panel
4. Clicks "+ Add Booking"
5. Modal appears with form
6. Fills in: Type (Flight), Title (MIA → MDE), Code (AA 1123)
7. Clicks "Save"
8. Booking appears in Bookings list
9. Clicks "+" icon on booking card
10. Booking auto-adds to Day 1 at "06:00"
11. Card shows "✓ Confirmed" badge

**Duration:** 30 seconds  
**Outcome:** Flight integrated into itinerary

---

### **Journey 5: Optimize with AI**

**Steps:**
1. User has 5 days of activities planned
2. Travel time seems excessive
3. Opens "AI Actions" panel
4. Sees suggestion: "Optimize Schedule - Save 40min"
5. Clicks "View Details"
6. Modal shows before/after timeline
7. AI grouped nearby activities
8. User clicks "Apply Optimization"
9. Timeline rearranges automatically
10. Activities reordered by proximity
11. Toast: "Saved 40 minutes of travel time"

**Duration:** 20 seconds  
**Outcome:** More efficient schedule

---

### **Journey 6: Mobile Quick Add**

**Steps:**
1. User on mobile, browsing itinerary
2. Scrolls to Day 2
3. Taps "+ Add" button on Day 2 header
4. Bottom sheet slides up with quick add options
5. Selects "Add from Ideas"
6. Ideas grid appears in sheet
7. Taps "Café con Libros"
8. Time picker appears: "What time?"
9. Selects "10:00 AM"
10. Sheet closes, activity added
11. Timeline updates with new card

**Duration:** 15 seconds  
**Outcome:** Quick mobile addition

---

## ⚙️ WORKFLOWS

### **Workflow 1: Page Load & Data Fetching**

**Steps:**
1. User navigates to trips/:id
2. TripDetailsPage mounts
3. Extracts :id from URL params
4. TripDetailsProvider initializes
5. Fetches trip data: GET /trips/:id
6. Fetches trip items: GET /trips/:id/items
7. Organizes items by day
8. Renders hero, timeline, sidebar
9. Connects drag-and-drop handlers
10. Loads saved ideas from AIContext

**Loading States:**
- Hero: Skeleton loader
- Timeline: Pulsing placeholders
- Sidebar: Gray boxes

**Error States:**
- 404: "Trip not found" page
- 500: Error boundary with retry

---

### **Workflow 2: Drag & Drop Interaction**

**Steps:**
1. User hovers over draggable item
2. Cursor changes to "grab"
3. User clicks and holds
4. Item lifts with shadow, opacity 50%
5. Drop zones highlight (emerald glow)
6. User drags over Day 2 section
7. Day 2 scale increases (1.01x)
8. Dashed border appears
9. User releases mouse
10. onDrop handler fires
11. Item data passed to addItemToDay()
12. State updates in TripDetailsContext
13. Timeline re-renders with new item
14. Animation: Item fades in, scales up
15. Timeline dots reconnect

**Drag Sources:**
- Activity cards (reorder within day)
- Ideas panel cards (add new items)
- Bookings panel (add to timeline)

**Drop Targets:**
- Day sections (any day)
- Between existing items (precise positioning)

---

### **Workflow 3: AI Auto-Generation**

**Steps:**
1. User clicks "Auto-Generate Itinerary"
2. Modal appears: "What type of trip?"
3. User selects preferences (pace, interests)
4. Frontend: POST /jobs
   - Body: type: "ai_trip_generation", input: preferences
5. Backend creates job, returns job ID
6. Modal shows progress UI
7. Frontend polls: GET /jobs/:id (every 2 seconds)
8. Backend processes in background:
   - Call Gemini API
   - Generate day-by-day plan
   - Find images for each activity
   - Calculate optimal times
   - Update job progress: 0% → 100%
9. Frontend receives completed status
10. Result contains: days array with items
11. Frontend: Bulk adds items via addItemToDay()
12. Timeline animates in all new cards
13. Toast: "Your itinerary is ready!"

**Progress Indicators:**
- "Analyzing preferences... 20%"
- "Finding activities... 50%"
- "Optimizing schedule... 80%"
- "Finalizing... 100%"

---

### **Workflow 4: Edit Activity**

**Steps:**
1. User hovers over activity card
2. Edit icon (pencil) appears
3. User clicks edit icon
4. Event stops propagation (no drag)
5. Modal opens with form
6. Pre-filled with current values:
   - Title, time, duration, cost, notes
7. User changes time: 09:00 → 10:00
8. Clicks "Save"
9. Frontend: PUT /trips/:id/items/:itemId
10. Backend updates KV store
11. Context state updates
12. Card re-renders with new time
13. Timeline dots adjust positions
14. Modal closes with fade animation

---

### **Workflow 5: Sidebar Panel Switch**

**Steps:**
1. User viewing "Ideas" panel
2. Clicks "Bookings" in nav list
3. setActivePanel('bookings') called
4. React re-renders sidebar content
5. Ideas panel fades out (exit animation)
6. Bookings panel fades in (enter animation)
7. Active indicator moves to Bookings
8. Background color changes to emerald-100
9. Panel content loads (if not cached)
10. Scroll position resets to top

**Animation:**
- Fade duration: 200ms
- Stagger delay: 50ms per item
- Easing: cubic-bezier ease-out

---

## 🔗 ROUTES & LINKS

### **Primary Route**
```
/trips/:id → TripDetailsPage.tsx
Example: /trips/trip-abc123
```

### **Internal Navigation**

| Action | Route/Method | Behavior |
|--------|--------------|----------|
| Back to trips list | `/trips` | Navigate |
| Open AI Concierge | `toggleOpen()` (AIContext) | Panel overlay |
| View place details | `/explore/:id` | New tab |
| Share trip | Copy `${origin}/trips/:id` | Clipboard |
| Edit trip metadata | Modal (no route change) | In-place |
| Delete trip | DELETE `/trips/:id`, redirect `/trips` | Navigate |

### **Sidebar Panel States (No Routes)**
- Panels use local state (activePanel)
- No URL changes when switching panels
- Allows browser back button to work as expected

### **External Links**
- Google Maps: Generated from lat/lng
- Booking confirmations: External websites
- Place websites: Open in new tab

---

## 📱 RESPONSIVE DESIGN

### **Breakpoints**
```
Mobile:   0-767px     (Single column, bottom sheet)
Tablet:   768-1023px  (Hybrid, collapsible sidebar)
Desktop:  1024px+     (Three-pane layout)
```

### **Layout Adaptations**

| Element | Mobile | Desktop |
|---------|--------|---------|
| Left Nav | Bottom nav (from AppShell) | Fixed sidebar |
| Hero Card | Full width, shorter | Full width, taller |
| Timeline | Full width, no margins | Centered with margins |
| Trip Tools | Bottom sheet (on-demand) | Fixed right sidebar (360px) |
| Drag & Drop | Touch gestures | Mouse drag |
| Add Button | Floating action button | Inline buttons |

### **Mobile Optimizations**

**Touch Targets:**
- Minimum 44x44px for all tappable elements
- Day headers: 56px height
- Activity cards: 72px minimum height
- Floating button: 56px circle

**Scrolling:**
- Timeline: Vertical scroll, momentum
- Bottom sheet: Drag handle, snap points
- Ideas grid: Single column on small screens

**Gestures:**
- Long press: Initiates drag
- Swipe right on card: Delete action
- Pull down sheet: Close
- Swipe between days: Optional (future)

**Mobile-Specific UI:**
- Floating tools button (bottom-right)
- Compact hero (1/3 height)
- Stacked activity cards (no time column)
- Simplified drag indicators

---

## 🎨 DESIGN BEST PRACTICES

### **Color System**
```
Primary:       emerald-600 (actions, active states)
Background:    #FDFBF7 (warm off-white)
Cards:         white with slate-200 border
Accents:       Emerald (AI), Orange (food), Blue (stays)
Text:          slate-900 (primary), slate-600 (secondary)
```

### **Typography Scale**
```
Hero title:    text-2xl md:text-3xl font-serif
Day header:    text-xl font-serif font-bold
Card title:    text-base font-semibold
Metadata:      text-xs text-slate-500
Badges:        text-[10px] uppercase tracking-wider
```

### **Spacing System**
```
Cards:         p-4 gap-4
Sections:      space-y-6 md:space-y-8
Timeline:      gap-4 between items
Sidebar:       p-4 for panels
```

### **Shadows**
```
Cards:         shadow-sm hover:shadow-md
Hero:          shadow-lg
Sidebar:       shadow-[-10px_0_30px_rgba(0,0,0,0.03)]
Floating:      shadow-2xl
```

### **Animation Principles**
1. **Purpose:** Every animation serves a function
2. **Duration:** 200-300ms for UI, 400ms for modals
3. **Easing:** spring physics for organic feel
4. **Feedback:** Immediate response to user action
5. **Performance:** Use transform, opacity (GPU accelerated)

### **Drag & Drop Best Practices**
1. **Visual feedback:** Lift, shadow, opacity change
2. **Drop zones:** Clear indicators (glow, dashed border)
3. **Cursor:** Changes to grab/grabbing
4. **Invalid drops:** Red border, shake animation
5. **Success:** Smooth settle animation, toast confirmation

---

## 🛠️ IMPLEMENTATION PROMPTS

### **PROMPT 1: Setup Page Structure**

Create a trip itinerary page with three-pane layout:

**Layout Requirements:**
- Left pane: Navigation sidebar from AppShell (provided by parent)
- Center pane: Main timeline (flex-1, scrollable, warm off-white background)
- Right pane: Trip Tools sidebar (360px desktop, bottom sheet mobile)

**Responsive Behavior:**
- Desktop (1024px+): All three panes visible
- Mobile (< 1024px): Center pane only, tools via floating button

**State Management:**
- Create TripDetailsContext with:
  - days array (each day has items array)
  - activePanel (string for sidebar)
  - addItemToDay function
  - removeItemFromDay function
  - reorderItem function
- Wrap page in DndProvider (react-dnd with HTML5Backend)

**Visual Style:**
- Center background: Warm off-white (#FDFBF7)
- Sidebar background: Slate-50
- Border between panes: Subtle slate-200
- Soft shadow on sidebar: 10px blur

**File Structure:**
- Main page: TripDetailsPage.tsx
- Center content: ItineraryFeed.tsx
- Right sidebar: TripSidebar.tsx
- Context: TripDetailsContext.tsx

---

### **PROMPT 2: Build Trip Hero Card**

Create an expandable hero card at the top of the timeline:

**Content:**
- Background: Hero image with dark gradient overlay
- Title: Trip name (serif font, 2xl, white)
- Metadata row: Date range, travelers count, location, budget
- Action buttons: "Book Trip", "Auto-Generate", "Share", "More"

**States:**
- Expanded: 240px height, shows full image and all details
- Collapsed: 60px height, compact bar with essential info
- Toggle: Smooth height transition (300ms)

**Layout:**
- Image: Absolute background, object-cover
- Overlay: Gradient from transparent to black/60 at bottom
- Content: Absolute positioned at bottom with padding
- Buttons: Sticky bar, flex layout with gap

**Responsive:**
- Mobile: Shorter expanded height (180px)
- Tablet: Medium height (200px)
- Desktop: Full height (240px)
- Always full width of container

**Icons:**
- Calendar icon for dates
- Users icon for travelers count
- MapPin icon for location
- DollarSign icon for budget

**Styling:**
- Rounded corners: rounded-2xl
- Shadow: shadow-lg
- Button style: Primary (emerald), secondary (outline)
- Text contrast: Ensure readability on image

---

### **PROMPT 3: Create Day Section with Timeline**

Build the day section component with vertical timeline:

**Structure:**
Each day contains:
- Header: "DAY 1" label, date, "+ Add" button
- Timeline: Vertical line with connecting dots
- Items: Activity cards attached to timeline
- Drop zone: Highlighted area for drag & drop

**Timeline Visual:**
- Vertical line: 2px solid emerald-500
- Position: Absolute, left side (20px from edge)
- Height: Spans entire day section
- Dots: 12px circles at each activity time

**Timeline Dots:**
- Appearance: White circle with 2px emerald border
- Position: Absolute on timeline line
- Z-index: Above line, below cards
- Hover: Scale to 1.25x
- Active: Pulse animation

**Day Header:**
- Layout: Flex between
- Left: "DAY 1" (uppercase, bold) + date (smaller, muted)
- Right: "+ Add" button (ghost variant)
- Border bottom: Subtle slate-200
- Padding: py-4

**Empty State:**
- When no items: Show placeholder
- Text: "Plan activities for Day 1"
- Icon: Plus icon in dashed circle
- Click: Opens add activity modal

**Drop Zone:**
- Always present at bottom of day
- Default: Invisible
- On drag over: Emerald glow, dashed border
- Height: 100px minimum
- Text hint: "Drop activity here"

---

### **PROMPT 4: Design Draggable Activity Card**

Create the activity card component with drag functionality:

**Card Layout:**
```
[Time Col] [Content Area] [Actions]
  09:00    Title              [Edit]
  1.5h     Type • Cost        [Grip]
           Notes (optional)
           Image (optional)
```

**Time Column (Left, Fixed Width):**
- Width: 60px
- Time: Bold, text-sm
- Duration: Below time, text-xs, muted
- Alignment: Center

**Content Area (Flex-1):**
- Title: font-semibold, text-base
- Badges row: Type, cost, status
- Notes: If present, italic, quoted, slate-50 background
- Image: If present, rounded-lg, 128px height, margin-top

**Type Badges:**
- Food: Orange background, orange text
- Activity: Emerald background, emerald text
- Stay: Blue background, blue text
- Logistics: Slate background, slate text
- Style: Uppercase, text-[10px], px-2, py-0.5, rounded-full

**Actions (Top-Right, On Hover):**
- Edit button: Pencil icon, ghost variant
- Grip handle: Six dots icon for dragging
- Opacity: 0 default, 100 on group hover
- Transition: 200ms fade

**Drag States:**
- Idle: cursor-grab
- Dragging: opacity-50, ring-2 emerald-500, cursor-grabbing
- Drop target indicator: Emerald glow above/below

**Card Styling:**
- Background: White
- Border: 1px slate-200, hover emerald-200
- Rounded: rounded-xl
- Padding: p-4
- Shadow: sm, hover md
- Margin left: 40px (space for timeline)

**Animations:**
- Enter: Fade in + slide up (200ms)
- Exit: Fade out + scale down (200ms)
- Reorder: Smooth position transition (layout animation)

---

### **PROMPT 5: Build Trip Tools Sidebar Navigation**

Create the right sidebar with collapsible navigation:

**Navigation Items (7 total):**
1. AI Actions - Zap icon, "✨" badge
2. Itinerary - Layout icon, "5 Days" count
3. Bookings - BookOpen icon, "2" count
4. Ideas - Search icon, "12" count
5. Media - Image icon, "8" count
6. Key Details - Key icon
7. Calendar - Calendar icon

**Nav Item Structure:**
- Icon: 20px, left aligned
- Label: Primary text, font-medium
- Description: Secondary text, text-xs, muted
- Count/Badge: Right aligned, small pill
- Layout: Flex between, full width click target

**States:**
- Idle: Transparent background
- Hover: Slate-100 background, slight scale
- Active: Emerald-100 background, emerald text, bold

**Collapsed State (Desktop Only):**
- Width: 72px (icons only)
- Hide text, show tooltips on hover
- Center-align icons
- Maintain active indicator (colored background)

**Toggle Button:**
- Position: Top-right of sidebar
- Icon: ChevronLeft (expanded), ChevronRight (collapsed)
- Size: Small icon button
- Behavior: Smooth width transition 300ms

**Mobile Behavior:**
- Never collapsed (always expanded when visible)
- Shown in bottom sheet overlay
- Drag handle at top for easy dismiss
- Rounded top corners: rounded-t-2xl

---

### **PROMPT 6: Implement Ideas Panel (Draggable Grid)**

Create the Ideas panel with draggable saved places:

**Grid Layout:**
- Desktop: 2 columns
- Mobile: 1 column
- Gap: 12px
- Aspect ratio: 1:1 (square cards)

**Idea Card:**
- Background: Place image (object-cover)
- Overlay: Black/20, hover black/40
- Title: Bottom-left, white text, text-xs
- Category: Below title, text-[10px], opacity 80
- Plus button: Top-right, appears on hover

**Drag Behavior:**
- Card is draggable via react-dnd
- Type: "IDEA"
- Item data: title, type, image, duration
- Visual: Opacity 50%, emerald ring while dragging
- Cursor: grab, then grabbing

**Plus Button (Quick Add):**
- Icon: Plus in circle
- Position: Absolute top-2 right-2
- Background: White/90, hover emerald-500
- Click: Adds to Day 1 immediately (no drag needed)
- Stops propagation to prevent card click

**Empty State:**
- Text: "No saved ideas yet"
- Subtext: "Ask the concierge to find some!"
- Icon: Search icon, large, muted
- Center aligned

**Footer Button:**
- Label: "+ Find More Ideas"
- Style: Outline, dashed border, full width
- Action: Opens Explore page or AI Concierge

---

### **PROMPT 7: Create Bookings Panel**

Build the bookings management panel:

**Booking Card Structure:**
- Type badge: Top-left (FLIGHT, STAY, ACTIVITY)
- Date: Top-right, small text
- Title: Large text (e.g., "MIA → MDE")
- Confirmation code: Monospace font, muted
- Status badge: Color-coded (confirmed, booked, pending)
- Quick add button: Plus icon, top-right on hover

**Card Styling:**
- Background: White
- Border: 1px slate-200, hover emerald-200
- Rounded: rounded-xl
- Padding: p-3
- Shadow: sm, hover md

**Status Colors:**
- Confirmed: Emerald (emerald-100, emerald-700)
- Booked: Blue (blue-100, blue-700)
- Pending: Amber (amber-100, amber-700)

**Type Badge Styles:**
- FLIGHT: Sky blue background
- STAY: Purple background
- ACTIVITY: Orange background
- Uppercase, text-[10px], bold

**Add Booking Flow:**
1. Click "+ Add Booking" button at bottom
2. Dialog opens with form fields:
   - Type dropdown (Flight, Stay, Activity, Other)
   - Title input
   - Confirmation code input
   - Date picker (optional)
3. Submit adds to bookings list
4. Auto-adds to Day 1 of timeline if date matches

**Quick Add Button:**
- Shows on hover
- Plus icon
- Adds booking to nearest matching day
- Toast notification: "Added to Day 2"

---

### **PROMPT 8: Build AI Actions Panel**

Create the AI Actions panel with smart suggestions:

**Action Card Types:**
1. **Optimization**
   - Icon: Zap
   - Title: "Optimize Schedule"
   - Description: "Reduce travel time by X minutes"
   - Button: "Apply" (primary)

2. **Budget Suggestion**
   - Icon: DollarSign
   - Title: "Budget Tip"
   - Description: "Save $X by doing Y"
   - Button: "View Details"

3. **Quick Wins**
   - Icon: CheckCircle
   - Title: "Quick Wins"
   - List: Bullet points of actionable items
   - No button (informational)

**Card Structure:**
- Icon: Large, colored, left side
- Content: Flex column, flex-1
- Title: font-semibold, text-sm
- Description: text-xs, text-slate-600
- Button: Bottom, full width within card

**Styling:**
- Background: White
- Border: 1px slate-200
- Rounded: rounded-xl
- Padding: p-4
- Shadow: sm
- Gap: space-y-3 between cards

**Interactions:**
- Click "Apply": Executes optimization
- Shows loading state during processing
- Success: Toast + timeline update
- Error: Error message in card

**Empty State:**
- Text: "No suggestions right now"
- Subtext: "AI is analyzing your trip..."
- Icon: Sparkles, animated

---

### **PROMPT 9: Implement Drag & Drop Logic**

Wire up the drag and drop functionality:

**Drag Sources:**
- Activity cards in timeline (type: "TRIP_ITEM")
- Idea cards in sidebar (type: "IDEA")
- Booking cards (type: "BOOKING")

**Drop Targets:**
- Day sections (accept all types)
- Between items in timeline (precise reordering)

**DnD Setup:**
Use react-dnd library:
- Wrap page in DndProvider with HTML5Backend
- useDrag hook for draggable items
- useDrop hook for drop zones

**Drop Handler Logic:**
1. onDrop receives: dayIndex, draggedItem
2. Extract item data (title, type, etc.)
3. If IDEA: Create new trip item
4. If TRIP_ITEM: Move existing item
5. Call addItemToDay or reorderItem
6. Update context state
7. Trigger re-render with animation

**Visual Feedback:**
- Drag start: Item opacity 50%, lift with shadow
- Drag over: Drop zone gets emerald glow
- Invalid drop: Red border, shake animation
- Drop success: Smooth settle, fade in
- Reorder: Layout animation (motion/react)

**Touch Support (Mobile):**
- Long press (500ms) initiates drag
- Visual indicator on long press
- Drag follows touch point
- Release to drop
- Cancel: Drag outside bounds

---

### **PROMPT 10: Add Mobile Bottom Sheet**

Create mobile-specific bottom sheet for Trip Tools:

**Trigger:**
- Floating action button
- Position: Fixed, bottom-24, right-6 (above global concierge)
- Icon: Layout icon
- Size: 56px circle
- Style: White bg, slate border, shadow-lg

**Bottom Sheet:**
- Component: Use Radix Sheet (SheetContent)
- Side: "bottom"
- Height: 80vh
- Rounded top: rounded-t-2xl
- Background: White

**Behavior:**
- Tap button: Sheet slides up
- Drag handle: Top center, visual indicator
- Swipe down: Closes sheet
- Backdrop: Semi-transparent, click to close

**Content:**
- Full TripSidebar component (always expanded)
- Scrollable if content exceeds height
- All panels accessible via nav list

**Animation:**
- Slide up: From bottom, spring physics
- Duration: 400ms
- Easing: cubic-bezier(0.16, 1, 0.3, 1)
- Backdrop fade: 200ms

**Accessibility:**
- Focus trap: Keep focus within sheet when open
- Escape key: Closes sheet
- ARIA labels: "Trip tools panel"
- Focus first interactive element on open

---

### **PROMPT 11: Create Empty State with AI CTA**

Design the empty state when itinerary has no items:

**Visual Design:**
- Container: Large card, centered
- Background: Gradient emerald-50 to slate-50
- Border: Dashed, 2px, emerald-200
- Padding: p-8
- Rounded: rounded-2xl

**Content:**
- Icon: Sparkles (large, 48px, emerald-600)
- Headline: "Start your adventure" (font-serif, text-xl)
- Subheadline: "Your itinerary is empty. Drag ideas from the right, or let the AI create one for you."
- Primary button: "🤖 Auto-Generate Itinerary"
- Secondary text: "You can also add items manually..."

**Button Styling:**
- Background: Emerald-600
- Text: White
- Size: Large (h-12, px-6)
- Rounded: rounded-xl
- Hover: Emerald-700, slight scale
- Icon: Robot emoji or Wand icon

**Button Action:**
- Click opens modal
- Modal has preference form:
  - Trip pace: Relaxed / Balanced / Packed
  - Interests: Multi-select (food, culture, nature, etc.)
  - Budget level: $, $$, $$$
  - Submit: "Generate with AI"
- On submit: Creates async job
- Shows progress bar
- Populates timeline when complete

**Conditional Display:**
- Show only when: days.every(day => day.items.length === 0)
- Hide after first item added
- Can be dismissed (shows compact version)

---

### **PROMPT 12: Add Responsive Behavior**

Implement mobile-specific layouts and interactions:

**Breakpoint Strategy:**
- Mobile: < 768px
- Tablet: 768-1023px  
- Desktop: 1024px+

**Hero Card:**
- Mobile: Height 180px, compact metadata
- Desktop: Height 240px, full metadata
- Tablet: Height 200px, medium layout

**Timeline:**
- Mobile: Remove time column, stack vertically
- Desktop: Time column + content side-by-side
- Mobile cards: Full width, no left margin

**Activity Cards:**
- Mobile: Simplified layout, smaller images
- Desktop: Full layout with all features
- Touch targets: Minimum 44px height

**Drag & Drop:**
- Mobile: Long press to start drag
- Desktop: Click and drag immediately
- Mobile: Larger drop zones (easier to target)

**Sidebar:**
- Mobile: Bottom sheet overlay (on-demand)
- Desktop: Fixed right pane (always visible)
- Tablet: Can collapse to icons only

**Navigation:**
- Mobile: Bottom nav bar (from AppShell)
- Desktop: Left sidebar (from AppShell)
- Mobile sheet: Full-height, rounded top

**Floating Button:**
- Mobile only: Fixed bottom-24 right-6
- Desktop: Hidden (sidebar always visible)
- Z-index: 40 (below modals, above content)

**Typography:**
- Mobile: Smaller font sizes (scale down by 1 level)
- Desktop: Standard scale
- Maintain readability on small screens

**Images:**
- Mobile: Lazy load, lower resolution
- Desktop: Higher resolution
- Both: WebP with JPEG fallback

---

**Total Prompts:** 12  
**Implementation Order:** Sequential (1→12)  
**Estimated Time:** 8-12 hours total  
**Difficulty:** Advanced (drag-and-drop, complex state)

---

## 📊 FEATURES SUMMARY

### **Core Features** ✅
- Three-pane layout (nav, timeline, tools)
- Day-by-day itinerary builder
- Drag & drop activity cards
- AI-powered auto-generation
- Timeline with visual dots
- Collapsible hero card
- 7 tool panels (AI, Itinerary, Bookings, Ideas, Media, Details, Calendar)
- Responsive mobile with bottom sheet
- Activity card editing
- Saved ideas integration
- Booking management

### **Advanced Features** 🔄
- Real-time collaboration (future)
- Offline mode (PWA)
- Export to PDF/Calendar
- Budget tracking live updates
- Weather integration
- Map view of activities
- Multi-trip comparison
- Template library

### **Mobile Optimizations** 📱
- Touch-friendly drag & drop
- Bottom sheet for tools
- Floating action button
- Simplified card layout
- Compact hero
- Large touch targets

---

## 🎨 DESIGN TOKENS

### **Colors**
```
Background:    #FDFBF7 (warm off-white)
Card:          #FFFFFF (white)
Border:        #E2E8F0 (slate-200)
Primary:       #059669 (emerald-600)
Secondary:     #64748B (slate-500)
```

### **Spacing**
```
Timeline gap:  16px (gap-4)
Card padding:  16px (p-4)
Section gap:   24px (space-y-6)
Panel padding: 16px (p-4)
```

### **Typography**
```
Hero:          text-2xl font-serif
Day header:    text-xl font-serif font-bold
Card title:    text-base font-semibold
Metadata:      text-xs text-slate-500
Badge:         text-[10px] uppercase
```

### **Shadows**
```
Card:          shadow-sm hover:shadow-md
Hero:          shadow-lg
Sidebar:       shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.03)]
Floating:      shadow-2xl
```

---

**Document Version:** 1.0.0  
**Lines:** 997  
**Status:** ✅ Complete  
**Implementation Ready:** Yes
