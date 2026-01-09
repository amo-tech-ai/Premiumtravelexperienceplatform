# MOBILE-FIRST OPTIMIZATION PLAN

**Project:** Local Scout Trip Operating System  
**Version:** 2.0.0  
**Date:** December 27, 2024  
**Author:** Senior Mobile UX Architect  
**Status:** Strategic Plan for Mobile Refactoring

---

## EXECUTIVE SUMMARY

### Current State Analysis

**What Exists:**
- 32 total screens across 7 dashboard categories
- 4 production-ready V2 screens (Trips system)
- 15 active V1 screens
- 13 planned screens
- 7 mobile components (drag, swipe, bottom nav)
- AI chatbot integration

**Mobile Readiness:**

| Category | Desktop-First Issues | Mobile Impact | Priority |
|----------|---------------------|---------------|----------|
| Trips Hub | Grid layout not optimized | Medium - Works but not ideal | HIGH |
| Wizard Flows | 5 steps feel long on mobile | High - User drop-off risk | CRITICAL |
| Command Center | Information overload | High - Too dense | HIGH |
| Itinerary Builder | Complex interactions | Medium - Some gestures work | MEDIUM |
| Dashboards (All) | Desktop grid patterns | Medium - Responsive but not mobile-first | HIGH |
| Chatbot | Full-screen overlay | Low - Works well | LOW |
| Detail Pages | Long scrolling required | Medium - Fatigue | MEDIUM |

**Key Findings:**

**CRITICAL ISSUES (Fix First):**
1. Wizard flows too long - causing drop-off
2. Dashboard information density too high
3. Tap targets below 44px in some areas
4. Navigation patterns inconsistent
5. Form inputs not optimized for mobile keyboards

**MEDIUM ISSUES (Fix Soon):**
1. Grid layouts should be single column
2. Cards too small on mobile
3. Bottom sheet usage inconsistent
4. Modals better than full-page overlays
5. Search patterns vary by screen

**LOW ISSUES (Polish Later):**
1. Animation performance
2. Haptic feedback consistency
3. Pull-to-refresh everywhere
4. Loading states

---

## SECTION 1: MOBILE-FIRST LAYOUT SYSTEM

### 1.1 Grid System Standards

**Mobile Grid Specifications:**

| Element | Mobile (320-767px) | Tablet (768-1023px) | Desktop (1024px+) |
|---------|-------------------|---------------------|-------------------|
| **Columns** | 4 columns | 8 columns | 12 columns |
| **Gutter** | 16px | 24px | 24px |
| **Margin** | 16px | 24px | Auto (max 1280px) |
| **Max Width** | 100% (minus margins) | 100% (minus margins) | 1280px |

**Column Usage by Screen Type:**

| Screen Type | Mobile Columns | Layout Pattern |
|-------------|----------------|----------------|
| Dashboard | Full-width (4/4) | Single column stack |
| List View | Full-width (4/4) | Card list, vertical |
| Card Grid | 2 columns (2/4 each) | Small cards only |
| Detail View | Full-width (4/4) | Content sections stacked |
| Wizard | Full-width (4/4) | One question at a time |
| Form | Full-width (4/4) | Stacked fields |

### 1.2 Spacing System

**Core Spacing Scale:**

| Token | Value | Use Case |
|-------|-------|----------|
| space-xs | 4px | Icon padding, tight groups |
| space-sm | 8px | Between related elements |
| space-md | 16px | Standard vertical rhythm, card padding |
| space-lg | 24px | Section spacing |
| space-xl | 32px | Major section breaks |
| space-2xl | 48px | Page sections |

**Screen Margins:**

| Edge | Minimum | Recommended | Rationale |
|------|---------|-------------|-----------|
| Left/Right | 16px | 20px | Thumb-friendly, prevents edge taps |
| Top (Below Nav) | 16px | 20px | Clear separation |
| Bottom (Above Nav) | 16px + nav height | 80px total | Safe zone for bottom nav |

**Safe Zones:**

| Zone | Height | Purpose |
|------|--------|---------|
| Top Status Bar | 44px (iOS) / 24px (Android) | Avoid content here |
| Bottom Home Indicator | 34px (iPhone X+) / 0px (Android) | Swipe gesture area |
| Keyboard | Variable (250-350px) | Forms must scroll above |
| Bottom Navigation | 56-64px | Primary navigation |

### 1.3 Touch Target Standards

**Minimum Sizes (Apple HIG + Material Design):**

| Element | Minimum Size | Recommended Size | Spacing Between |
|---------|-------------|------------------|-----------------|
| Primary Button | 44x44px | 48x48px | 8px minimum |
| Secondary Button | 44x44px | 44x44px | 8px minimum |
| Icon Button | 44x44px | 48x48px | 12px minimum |
| List Item | Full width x 56px | Full width x 64px | 0px (divider only) |
| Checkbox/Radio | 44x44px | 44x44px | 16px from label |
| Text Link | 44px height | 48px height | 8px vertical |
| Drag Handle | 44x44px | 48x60px | Visual only |
| Swipe Target | Full width x 64px | Full width x 72px | 0px |

**Touch Target Audit Required For:**
- All wizard step buttons
- Dashboard filter chips
- Card action buttons
- List item tap areas
- Form input fields

### 1.4 Section Stacking Order

**Universal Mobile Stacking Pattern:**

| Order | Section | Rationale |
|-------|---------|-----------|
| 1 | Critical Action / CTA | Users see primary action first |
| 2 | Summary / Overview | Quick context |
| 3 | Primary Content | Main information |
| 4 | Secondary Actions | Less critical options |
| 5 | Details / Metadata | Supplementary info |
| 6 | Related Content | Suggestions, similar items |
| 7 | Footer / Legal | Least important |

**Example: Trip Detail Page**

| Mobile Stack Order | Desktop Location | Why It Moves |
|-------------------|------------------|--------------|
| 1. Trip header (destination, dates) | Top | Same - Critical |
| 2. "View Itinerary" button | Sidebar | Move up - Primary action |
| 3. Trip stats (days, budget, items) | Top | Same - Quick context |
| 4. Weather widget | Sidebar | Move up - Useful |
| 5. Quick actions (edit, share, delete) | Top bar | Move down - Secondary |
| 6. Traveler list | Sidebar | Move down - Metadata |
| 7. Trip notes | Bottom | Same - Supplementary |
| 8. Similar trips | Bottom | Same - Suggestions |

### 1.5 Bottom Sheets vs Modals vs Full-Page

**Decision Matrix:**

| Content Type | Mobile Pattern | Desktop Pattern | Reasoning |
|-------------|----------------|-----------------|-----------|
| **Quick Actions** (1-5 options) | Bottom Sheet | Dropdown Menu | Thumb-friendly, dismissible |
| **Filters** (3-10 options) | Bottom Sheet | Sidebar Drawer | Can see results, easy close |
| **Forms** (Short, 1-3 fields) | Bottom Sheet | Modal | Quick input, context visible |
| **Forms** (Long, 4+ fields) | Full-Page | Modal/Page | Focus required, multi-step |
| **Details** (Read-only info) | Full-Page | Modal/Sidebar | Lots of content to scroll |
| **Confirmations** | Modal (Center) | Modal (Center) | Same - Critical decision |
| **Image Gallery** | Full-Page | Modal Overlay | Same - Immersive view |
| **Chatbot** | Bottom Sheet (Docked) | Sidebar | Persistent, non-blocking |

**Bottom Sheet Guidelines:**

| Use Case | Sheet Height | Handle | Backdrop |
|----------|-------------|--------|----------|
| Quick Actions | 30% screen | Yes | Tap to dismiss |
| Filters | 50% screen | Yes | Tap to dismiss |
| Short Forms | 60% screen | Yes | Tap to dismiss |
| Detail Preview | 70% screen | Yes | Swipe to dismiss |

**Modal Guidelines:**

| Use Case | Size | Close Method | Backdrop |
|----------|------|--------------|----------|
| Confirmation | Small (auto-height) | Button only | Dark, no dismiss |
| Alert | Small (auto-height) | Button only | Dark, no dismiss |
| Error | Medium (auto-height) | Button or X | Dark, no dismiss |
| Image Zoom | Full-screen | X or swipe | Black, swipe dismiss |

---

## SECTION 2: SCREEN-BY-SCREEN IMPROVEMENTS

### 2.1 TRIPS HUB (Dashboard)

**Current State:**

| Element | Desktop | Mobile (Current) | Issue |
|---------|---------|------------------|-------|
| Layout | 3-column grid | 2-column grid | Cards too small |
| Filters | Horizontal chips | Horizontal chips | Works OK |
| Search | Top bar | Top bar | Works OK |
| Sort | Dropdown | Dropdown | Works OK |
| Trip Cards | Large (300px) | Medium (160px) | Content cramped |

**What Works:**
- Bottom navigation is excellent
- Search bar is properly sized
- Filter chips are tappable
- Pull-to-refresh implemented

**What Breaks on Mobile:**
- Trip cards in 2-column grid are too small
- Card images barely visible
- Text is cramped at small size
- Action buttons inside cards hard to tap
- Empty state takes full screen (wasteful)

**What Should Change:**

| Element | Change | Reason |
|---------|--------|--------|
| Grid | 2-column → 1-column list | More space per card |
| Cards | Horizontal layout | Better use of width |
| Images | Left side, 100x100px | Thumbnail-sized |
| Content | Right side, full info | Room for details |
| Actions | Swipe gestures | Native mobile pattern |
| Empty State | Centered, compact | Less scrolling |

**Mobile Layout Specification:**

**Trips Hub - Mobile Single Column**

| Layer | Content | Height | Spacing |
|-------|---------|--------|---------|
| 1. Header | Title "My Trips" + Add button | 56px | Fixed top |
| 2. Search | Search bar with icon | 48px | 16px margin |
| 3. Filters | Horizontal scroll chips | 40px | 12px margin |
| 4. Trip List | Horizontal cards, swipeable | Variable | 16px between |
| 5. Bottom Nav | Navigation tabs | 64px | Fixed bottom |

**Individual Trip Card - Horizontal Layout:**

| Section | Width | Content | Interactions |
|---------|-------|---------|--------------|
| Left - Image | 100px | Destination photo, status badge | Tap to view |
| Right - Info | Remaining | Title, dates, stats (3-line) | Tap to view |
| Swipe Left | Full width | Red delete action | Swipe to delete |
| Swipe Right | Full width | Blue edit action | Swipe to edit |

---

### 2.2 CREATE TRIP WIZARD (5 Steps)

**Current State:**

| Step | Question | Input Type | Mobile Issue |
|------|----------|------------|--------------|
| 1 | Destination | Text + autocomplete | Keyboard covers suggestions |
| 2 | Dates | Date picker | Picker is cramped |
| 3 | Travelers | Number input | Works fine |
| 4 | Budget | Range slider | Works fine |
| 5 | Review | Summary + confirm | Too much scrolling |

**What Works:**
- Progress indicator at top
- One question per screen
- Clear next/back buttons
- Step numbers visible

**What Breaks on Mobile:**
- 5 steps feel long on small screen
- Date picker UI cramped
- Review step requires scrolling
- Back button sometimes hidden by keyboard
- Progress dots too small to tap

**What Should Change:**

| Current Problem | Mobile Solution | Benefit |
|----------------|-----------------|---------|
| 5 steps too many | Combine steps 3+4 (travelers + budget) | 4 steps faster |
| Date picker cramped | Native mobile date picker | Familiar, larger |
| Review requires scroll | Sticky "Create Trip" button | Always visible |
| Progress dots small | Progress bar instead | Clearer, not tappable |
| Back hidden by keyboard | Floating back button | Always accessible |

**Optimized Wizard Flow (4 Steps):**

| Step | Question | Mobile-Optimized Input | Improvements |
|------|----------|----------------------|--------------|
| 1 | Where? | Large search bar, recent destinations below | Autocomplete above keyboard |
| 2 | When? | Native date picker (iOS/Android) | Platform-native UI |
| 3 | Who & How Much? | Travelers (steppers) + Budget (preset chips) | Combined into one step |
| 4 | Review & Create | Summary cards + sticky CTA | Clear, action always visible |

**Mobile Wizard Layout Per Step:**

| Layer | Content | Height | Behavior |
|-------|---------|--------|----------|
| 1. Progress | Linear bar (not dots) | 4px | Fixed top |
| 2. Step Number | "Step 1 of 4" text | 24px | Below progress |
| 3. Question | Large heading | 44px | Clear hierarchy |
| 4. Input Area | Form elements | Variable | Focus scrolls into view |
| 5. Navigation | Back (left) + Next (right) | 48px buttons | Fixed bottom (above keyboard) |

---

### 2.3 TRIP COMMAND CENTER (Dashboard)

**Current State:**

| Section | Desktop Layout | Mobile Layout | Issue |
|---------|---------------|---------------|-------|
| Header | Full width | Full width | Works OK |
| Stats Cards | 3 columns | 2 columns | Cramped |
| Quick Actions | Horizontal | Horizontal | Works OK |
| Overview | Sidebar (33%) | Stacked | Too much scrolling |
| Timeline | Main (66%) | Stacked | Buried below fold |

**What Works:**
- Header with trip title
- Quick action buttons sized OK
- Weather widget is useful
- Edit button accessible

**What Breaks on Mobile:**
- Information density too high
- Stats cards too small (2-column)
- Scrolling required to see important info
- Primary action "View Itinerary" below fold
- No clear visual hierarchy

**What Should Change:**

| Element | Current | Mobile-First | Reason |
|---------|---------|--------------|--------|
| Stats | 2-column grid | Single column, larger | Readable at a glance |
| Primary CTA | Below stats | Top of page | Action hierarchy |
| Quick Actions | Icon grid | Bottom sheet | Save screen space |
| Weather | Card | Chip at top | At-a-glance |
| Overview | Long cards | Progressive disclosure | Reduce scroll |

**Mobile Command Center Layout:**

| Layer | Content | Height | Rationale |
|-------|---------|--------|-----------|
| 1. Header | Trip title, destination, dates | 80px | Context |
| 2. Primary CTA | "View Itinerary" button (full-width) | 48px | Primary action first |
| 3. Weather Chip | "Sunny, 75°F" with icon | 32px | Quick reference |
| 4. Stats (Stacked) | Days, Budget, Activities (one per line) | 180px | Clear hierarchy |
| 5. Quick Actions | "More Actions" button → Bottom sheet | 48px | Save space |
| 6. Overview | Accordion sections (collapsed by default) | Variable | Progressive disclosure |
| 7. Travelers | Avatar list | 56px | Visual, compact |

**Quick Actions Bottom Sheet:**

When user taps "More Actions", sheet slides up with:

| Action | Icon | Description |
|--------|------|-------------|
| Edit Trip | Pencil | Modify details |
| Share Trip | Share | Send to others |
| Duplicate | Copy | Clone this trip |
| Export PDF | Download | Offline copy |
| Delete Trip | Trash | Remove (with confirmation) |

---

### 2.4 ITINERARY BUILDER (Interactive Dashboard)

**Current State:**

| Element | Desktop | Mobile (Current) | Mobile Status |
|---------|---------|------------------|---------------|
| Day Accordion | Sidebar list | Vertical list | ✅ Works |
| Add Item | Modal form | Bottom sheet | ✅ Works |
| Item Cards | Horizontal | Vertical | ✅ Works |
| Drag & Drop | Mouse | Touch handles | ✅ Works |
| Swipe Actions | N/A | Delete/Edit | ✅ Works |
| Timeline View | Visual graph | List view | ⚠️ Could improve |
| Cost Tracker | Sidebar | Sticky footer | ✅ Works |

**What Works:**
- Drag & drop with handles (200ms hold)
- Swipe left to delete
- Swipe right to edit
- Bottom sheet for adding items
- Day accordions collapse/expand
- Long press context menus

**What Breaks on Mobile:**
- Timeline view not optimized for mobile
- Map view (if added) would be cramped
- Too many items per day = long scroll
- Conflict indicators not prominent enough
- AI suggestions not immediately visible

**What Should Change:**

| Element | Current Behavior | Mobile Enhancement | Benefit |
|---------|------------------|-------------------|---------|
| Timeline | Visual graph | Option to toggle to list | Choice |
| Map View | Full screen | Bottom sheet preview | Context maintained |
| AI Button | Floating button | Docked bottom bar | Always accessible |
| Conflicts | Inline warning | Toast notification | More noticeable |
| Cost Total | Sidebar | Sticky footer badge | Always visible |

**Mobile Itinerary Layout:**

| Layer | Content | Height | Interactions |
|-------|---------|--------|--------------|
| 1. Header | Trip title + day selector | 56px | Fixed top |
| 2. Day Tabs | Horizontal scroll (Day 1, 2, 3...) | 44px | Swipe to change day |
| 3. Day Summary | Stats: X items, Y hours, $Z | 48px | Tap to expand |
| 4. Item List | Itinerary cards (vertical) | Variable | Swipe, drag, tap |
| 5. Add Button | "Add Activity" + AI assist | 56px | Fixed at bottom |
| 6. Cost Footer | Total cost badge | 32px | Sticky, tap to expand |

**Individual Itinerary Item Card:**

| Section | Layout | Size |
|---------|--------|------|
| Drag Handle | Left, vertical dots | 44px wide |
| Time | Top left | 14px text |
| Content | Center, 2-3 lines | Variable |
| Cost | Top right | Badge |
| Actions | Swipe reveals | Full width |

---

### 2.5 DASHBOARDS (Events, Restaurants, Rentals, Explore)

**Current Pattern (All Dashboards):**

| Element | Desktop | Mobile (Current) | Issue |
|---------|---------|------------------|-------|
| Grid | 3-4 columns | 2 columns | Cards too small |
| Filters | Sidebar | Top or bottom sheet | Inconsistent |
| Search | Header | Header | Works OK |
| Sort | Dropdown | Dropdown | Works OK |
| Map Toggle | Button | Button | Works OK |

**Universal Dashboard Issues:**

| Problem | Impact | Priority |
|---------|--------|----------|
| 2-column grid too cramped | Content hard to read | HIGH |
| Filter pattern inconsistent | Confusing UX | HIGH |
| Cards lack hierarchy | Everything looks same | MEDIUM |
| Images too small | Not appealing | MEDIUM |
| Too much scrolling | User fatigue | MEDIUM |

**Mobile Dashboard Template (All Categories):**

| Layer | Content | Behavior |
|-------|---------|----------|
| 1. Header | Title + search icon | Fixed |
| 2. Search Bar | Expandable from icon | Expands when tapped |
| 3. Filters | Horizontal scroll chips | Always visible |
| 4. Sort + View Toggle | "Sort: Recent" + Grid/List icons | Top right |
| 5. Content Area | Cards (1 column) OR List | Main scroll area |
| 6. Bottom Nav | Primary navigation | Fixed |

**Card Layouts - Two Options:**

**Option A: Large Cards (Visual Focus)**

| Element | Dimensions | Content |
|---------|-----------|---------|
| Card | Full width x 280px | Vertical layout |
| Image | Full width x 160px | Large, prominent |
| Content | Padding 16px | Title, price, rating, distance |
| Action | Bottom, full width | Primary button |

**Option B: List Items (Information Dense)**

| Element | Dimensions | Content |
|---------|-----------|---------|
| Item | Full width x 120px | Horizontal layout |
| Image | 100x100px (left) | Thumbnail |
| Content | Remaining width | Title, details (2-3 lines) |
| Action | Icon button (right) | Chevron or heart |

**Filter Bottom Sheet Standard:**

| Section | Content | Behavior |
|---------|---------|----------|
| Handle | Drag indicator | Swipe to dismiss |
| Header | "Filters" + Clear all | Resets filters |
| Filter Groups | Collapsible sections | Tap to expand |
| Apply Button | Full width, sticky | Always visible |

---

### 2.6 DETAIL PAGES (Event, Restaurant, Rental, Destination)

**Current Pattern (All Detail Pages):**

| Section | Desktop | Mobile | Issue |
|---------|---------|--------|-------|
| Hero Image | Full width | Full width | ✅ Works |
| Title & Info | Below image | Below image | ✅ Works |
| Action Buttons | Below title | Below title | ⚠️ Could improve |
| Details | Long scroll | Very long scroll | ❌ Too much |
| Reviews | Bottom section | Far below fold | ❌ Hidden |
| Map | Sidebar or bottom | Bottom | ⚠️ Small |

**What Works:**
- Hero images are impactful
- Titles are clear and large
- Basic info is accessible
- Share button works

**What Breaks on Mobile:**
- Excessive scrolling (10+ screens)
- Important info buried (reviews, menu, amenities)
- Map too small to be useful
- No quick navigation to sections
- Primary action button scrolls away

**What Should Change:**

| Element | Current | Mobile Solution | Benefit |
|---------|---------|----------------|---------|
| Primary CTA | Static position | Sticky bottom button | Always accessible |
| Long Content | Single scroll | Tab sections | Faster navigation |
| Map | Small embed | Tap to full-screen | Better usability |
| Reviews | Bottom of page | Separate tab | Easier to find |
| Image Gallery | In-line | Carousel at top | Better browsing |

**Mobile Detail Page Template:**

| Layer | Content | Behavior |
|-------|---------|----------|
| 1. Image Carousel | Swipeable photos with dots | Full-width hero |
| 2. Title & Key Info | Name, rating, price, distance | Just below images |
| 3. Tab Navigation | Overview / Menu / Reviews / Location | Sticky below title |
| 4. Tab Content | Scrollable content per tab | Main area |
| 5. Primary CTA | "Reserve" / "Book" / "Add to Trip" | Sticky bottom |

**Tab Content Organization:**

| Tab | Content | Depth |
|-----|---------|-------|
| Overview | Description, highlights, hours, contact | 2-3 screens |
| Menu/Amenities | Full list, categories | 3-5 screens |
| Reviews | User reviews, ratings, photos | 5-10 screens |
| Location | Map, directions, transit | 1-2 screens |

---

### 2.7 CHATBOT (AI Concierge)

**Current State:**

| Element | Desktop | Mobile (Current) | Status |
|---------|---------|------------------|--------|
| Trigger | Floating button (bottom right) | Floating button (bottom right) | ✅ Works |
| Panel | Slide-out sidebar (right) | Full-screen overlay | ⚠️ Blocks content |
| Chat Interface | Messages, input at bottom | Same | ✅ Works |
| Agent Selector | Tabs at top | Tabs at top | ✅ Works |
| Suggestions | Cards below messages | Cards below messages | ✅ Works |

**What Works:**
- Floating button is accessible
- Chat interface is familiar
- Suggestions are tappable
- Agent switching is clear
- Message history preserved

**What Breaks on Mobile:**
- Full-screen overlay is too intrusive
- User loses context of what they were doing
- Can't see itinerary while chatting
- No quick minimize/maximize
- Takes over entire screen

**What Should Change:**

| Current | Problem | Mobile Solution |
|---------|---------|----------------|
| Full-screen overlay | Blocks all content | Docked bottom sheet (50% screen) |
| Modal-like behavior | Feels heavy | Persistent, can minimize |
| No context | Can't reference trip | See content behind sheet |
| Single mode | Chat or nothing | Quick peek mode |

**Mobile Chatbot Layout - Docked Bottom Sheet:**

**Collapsed State (Always Visible):**

| Element | Size | Content |
|---------|------|---------|
| Docked Bar | Full width x 56px | "AI Assistant" + avatar + minimize/expand |
| Position | Bottom of screen | Above bottom nav (if present) |

**Expanded State (Chat Active):**

| Layer | Height | Content |
|-------|--------|---------|
| Sheet Background | 60% screen | White background, rounded top corners |
| Handle | 32px | Drag to resize or dismiss |
| Agent Selector | 44px | Tabs (Discovery / Planning / Optimization) |
| Messages | Remaining | Chat history, scrollable |
| Input Bar | 56px + keyboard | Text input, send button |

**Three Size States:**

| State | Screen Coverage | Use Case |
|-------|----------------|----------|
| Collapsed | 56px bar | Not using, but available |
| Medium | 50% screen | Active chat, can see context |
| Full | 85% screen | Deep conversation, focus mode |

**Interaction Patterns:**

| Gesture | Action | Result |
|---------|--------|--------|
| Tap collapsed bar | Expand to medium | Show chat |
| Drag handle down | Minimize to collapsed | Hide chat |
| Drag handle up | Expand to full | More space |
| Tap outside (medium) | Stay open | Keep context |
| Swipe down quickly | Collapse to bar | Quick dismiss |

---

## SECTION 3: WIZARD BEST PRACTICES

### 3.1 Optimal Step Count

**Research-Based Recommendations:**

| Wizard Type | Ideal Steps | Maximum Steps | Rationale |
|-------------|-------------|---------------|-----------|
| Simple Form | 2-3 steps | 4 steps | Quick completion, low drop-off |
| Standard Flow | 4-5 steps | 6 steps | Balance detail vs. time |
| Complex Setup | 5-7 steps | 8 steps | Necessary complexity |
| Onboarding | 3-4 steps | 5 steps | Don't overwhelm new users |

**Mobile-Specific Guidelines:**

| Rule | Guideline | Reason |
|------|-----------|--------|
| One question per step | Single focus, clear action | Reduces cognitive load |
| Maximum 5 steps for mobile | More = higher drop-off | Mobile attention span shorter |
| Allow skipping optional steps | Users can proceed faster | Respect user's time |
| Show progress clearly | User knows how much left | Reduces abandonment |
| Save partial progress | Return later if interrupted | Mobile usage is fragmented |

**Current Wizards Audit:**

| Wizard | Current Steps | Recommended Steps | Action Required |
|--------|---------------|-------------------|-----------------|
| Create Trip | 5 steps | 4 steps | Combine Travelers + Budget |
| Create Event | 7 steps | 5 steps | Combine Details, merge optional |
| Create Restaurant | 6 steps | 4 steps | Group amenities, simplify |
| Create Rental | 8 steps | 5-6 steps | Merge property details |

### 3.2 Progress Indicators - Mobile

**Pattern Comparison:**

| Pattern | Mobile Size | Pros | Cons | Recommendation |
|---------|------------|------|------|----------------|
| Dots | 8-10px each | Clean, minimal | Hard to tap, unclear progress | ❌ Avoid on mobile |
| Numbers | 24-32px | Clear position | Takes space | ⚠️ Use sparingly |
| Linear Bar | 4px height | Shows progress %, space-efficient | Less detail | ✅ Best for mobile |
| Step Labels | Variable | Very clear | Takes lots of space | ⚠️ Only if 3-4 steps |
| Hybrid (Bar + Text) | 24px total | Clear and space-efficient | More complex | ✅ Recommended |

**Recommended Mobile Progress Pattern:**

| Element | Specification | Example |
|---------|--------------|---------|
| Progress Bar | 4px height, rounded, full width | 50% filled (teal) + 50% gray |
| Progress Text | 14px, centered below bar | "Step 2 of 4" |
| Total Height | 24px (4px bar + 8px gap + 12px text) | Compact, clear |

**Where to Place:**

| Location | Visibility | Use Case |
|----------|-----------|----------|
| Fixed Top (Below Header) | Always visible | Long forms, scrolling content |
| Sticky Top | Visible while scrolling | Multi-screen steps |
| Relative Top | Scrolls away | Short, above-fold steps |

### 3.3 Smart Question Grouping

**Grouping Principles:**

| Principle | Description | Example |
|-----------|-------------|---------|
| Related Fields | Group conceptually related questions | Name + Email + Password = Account Details |
| Sequential Logic | Order questions logically | Destination → Dates → Travelers → Budget |
| Progressive Disclosure | Start simple, add complexity | Basic info first, advanced options later |
| Context Switching | Don't alternate between contexts | All trip info, then all preference info |

**Mobile-Specific Grouping:**

| Pattern | Mobile Approach | Benefit |
|---------|----------------|---------|
| Multiple Related Fields | Keep in one step if < 3 fields | Reduces steps |
| Optional Fields | Separate step OR skip option | User choice |
| Complex Inputs | Dedicated step | Focus required |
| Review Step | Always separate, always last | Final check |

**Example: Create Trip Wizard Optimized**

| Step | Questions | Input Types | Why Grouped |
|------|-----------|-------------|-------------|
| 1. Destination | Where are you going? | Search + autocomplete | Single focus, most important |
| 2. Dates | When? | Date range picker | Related, requires thought |
| 3. Details | Travelers + Budget | Number stepper + Slider | Related, quick inputs |
| 4. Review | Summary + Optional notes | Read-only + Textarea | Final confirmation |

### 3.4 One-Action-Per-Screen Principle

**Core Principle:**

Each wizard step should have ONE primary action (typically "Next" or "Continue").

**Mobile Implementation:**

| Element | Specification | Rationale |
|---------|--------------|-----------|
| Primary Button | Full-width, 48px height, prominent color | Thumb-friendly, clear |
| Secondary Button | Text-only OR outlined, less prominent | De-emphasized |
| Button Position | Fixed bottom (56px from bottom) | Always accessible |
| Button State | Disabled until valid input | Prevent errors |

**Action Hierarchy:**

| Priority | Action | Style | Position |
|----------|--------|-------|----------|
| Primary | Next / Continue / Submit | Solid, full-width | Bottom, above secondary |
| Secondary | Back / Skip | Text or outline, 1/2 width | Bottom, left side |
| Tertiary | Help / Info | Icon button | Top-right corner |
| Destructive | Cancel / Exit | Text link | Top-left corner |

**Button Spacing on Mobile:**

| Scenario | Layout | Spacing |
|----------|--------|---------|
| Single Button | Full-width | 16px from edges |
| Two Buttons | Split 1/2 + 1/2 | 8px gap between |
| Three Buttons | Stack vertically | 12px gap between |

**Keyboard Behavior:**

| Input Active | Button Position | Behavior |
|--------------|----------------|----------|
| No | Fixed bottom | Visible, tappable |
| Yes | Above keyboard | Moves up, stays visible |
| Scrollable Content | Sticky after scroll | Appears when scrolled down |

---

## SECTION 4: DASHBOARD BEST PRACTICES

### 4.1 Glanceable vs Drill-Down

**Information Hierarchy for Mobile:**

| Information Type | Mobile Treatment | Desktop Treatment | Rationale |
|-----------------|------------------|-------------------|-----------|
| Critical Metrics | Glanceable (visible without scroll) | Hero section | Immediate value |
| Primary Actions | Prominent buttons above fold | Hero section | Quick access |
| Summary Stats | 2-4 key numbers, large text | Card grid | Scannable |
| Detailed Data | Progressive disclosure (tap to expand) | Visible | Reduce clutter |
| Historical Trends | Charts (tap to full-screen) | Inline graphs | Space-efficient |
| Secondary Info | Collapsed sections | Sidebar | On-demand |
| Tertiary Info | Separate pages or modals | Tooltips | Reduce noise |

**Mobile Dashboard Layers:**

| Layer | Content | Scroll Behavior | Visibility |
|-------|---------|----------------|------------|
| 1. Header | Title, primary action | Fixed or sticky | Always visible |
| 2. Hero Metrics | 2-4 key stats | Scrolls | Above fold |
| 3. Quick Actions | 3-5 icon buttons | Scrolls | Above fold |
| 4. Primary Content | Main data cards/list | Scrolls | Main area |
| 5. Filters/Sort | Chips or dropdowns | Sticky when scrolling | Conditional |
| 6. Secondary Content | Additional sections | Scrolls | Below fold OK |

**Example: Trips Hub Dashboard**

| Priority | Information | Mobile Display | Interaction |
|----------|------------|---------------|-------------|
| Critical | "3 Active Trips" | Large number, top | Glance |
| Primary | "Create New Trip" button | Prominent, blue | Tap to create |
| Summary | Trip cards (upcoming trips) | Large cards, scrollable | Swipe to browse |
| Detailed | Trip stats (budget, days, items) | Inside cards | Visible in card |
| Secondary | Past trips | Separate tab | Tap tab to view |
| Tertiary | Trip settings | Card menu (3 dots) | Tap → bottom sheet |

### 4.2 Card vs List Usage

**When to Use Cards:**

| Use Case | Card Type | Mobile Size | Content |
|----------|-----------|-------------|---------|
| Visual-First Content | Large vertical card | Full-width x 280px | Image + Title + Details + CTA |
| Featured Items | Hero card | Full-width x 320px | Large image, minimal text |
| Multiple Sections | Section card | Full-width x variable | Header + list of items |
| Actions/CTAs | Action card | Full-width x 120px | Icon + Title + Button |

**When to Use Lists:**

| Use Case | List Type | Mobile Size | Content |
|----------|-----------|-------------|---------|
| Information Dense | Horizontal list item | Full-width x 72px | Thumbnail + 2-3 lines text + icon |
| Scannable Data | Simple list item | Full-width x 56px | Icon + Title + Metadata |
| Settings/Options | Menu list item | Full-width x 56px | Title + Toggle/Chevron |
| Search Results | Result list item | Full-width x 80px | Thumbnail + Title + snippet |

**Decision Matrix:**

| Question | Answer | Use |
|----------|--------|-----|
| Is imagery important? | Yes | Cards |
| Is imagery important? | No | List |
| More than 3 actions per item? | Yes | Cards |
| More than 3 actions per item? | No | List |
| Need to show 10+ items? | Yes | List (space-efficient) |
| Need to show 10+ items? | No | Cards (more visual) |
| User scans quickly? | Yes | List |
| User browses leisurely? | Yes | Cards |

**Mobile-Specific Guidelines:**

| Pattern | Recommendation | Reasoning |
|---------|---------------|-----------|
| Grid of Cards | Max 1 column on mobile | Readability |
| Horizontal Card Scroll | Use for featured content | Browsing behavior |
| List with Thumbnails | Full-width, 72-88px height | Balanced info/visual |
| Infinite Scroll | Use for lists | Native mobile pattern |
| Load More Button | Use for cards | Intentional browsing |

**Example Implementations:**

**Trips Hub:** Large vertical cards (visual browsing)  
**Restaurant List:** Horizontal list items (information scanning)  
**Event Discovery:** Cards with large images (inspiration browsing)  
**Itinerary Items:** List with time + icons (quick scanning)  
**Search Results:** List with thumbnails (information density)

### 4.3 Primary vs Secondary Actions

**Action Hierarchy Rules:**

| Action Priority | Visual Weight | Position (Mobile) | Interaction |
|----------------|---------------|-------------------|-------------|
| Primary | Solid button, brand color | Bottom-right or full-width bottom | Tap |
| Secondary | Outlined button or text | Bottom-left or below primary | Tap |
| Tertiary | Icon only | Top-right or overflow menu | Tap |
| Destructive | Red text or outlined red | Overflow menu or confirmation | Tap + confirm |
| Contextual | Revealed by swipe/long-press | Hidden until interaction | Gesture |

**Mobile Action Patterns:**

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Single Prominent Button** | One clear action | "Add to Trip" on restaurant detail |
| **Split Actions** | Primary + Secondary equal | "Book Now" + "Save for Later" |
| **Overflow Menu** | 3+ actions | Trip card: Edit, Share, Duplicate, Delete |
| **Swipe Actions** | Common actions on list items | Swipe left to delete, right to edit |
| **Long Press Menu** | Contextual actions | Long press trip card for quick actions |
| **Bottom Sheet** | Multiple related actions | Share: Copy Link, Email, Message, etc. |

**Examples by Screen Type:**

**Dashboard (Trips Hub):**

| Action | Priority | Mobile Pattern |
|--------|----------|----------------|
| Create Trip | Primary | Floating Action Button (bottom-right) |
| Search Trips | Secondary | Icon in header |
| Filter Trips | Secondary | Chips below search |
| Edit Trip | Tertiary | Swipe right on card |
| Delete Trip | Destructive | Swipe left on card |

**Detail Page (Restaurant):**

| Action | Priority | Mobile Pattern |
|--------|----------|----------------|
| Reserve Table | Primary | Sticky bottom button |
| Save to Favorites | Secondary | Heart icon (top-right) |
| Share Restaurant | Tertiary | Share icon (top-right) |
| Report Issue | Destructive | Overflow menu (3 dots) |

**Wizard (Create Trip):**

| Action | Priority | Mobile Pattern |
|--------|----------|----------------|
| Next Step | Primary | Full-width bottom button |
| Back | Secondary | Text link (top-left) or back button |
| Skip Step | Tertiary | Text link (bottom-left) |
| Exit Wizard | Destructive | X icon (top-right) + confirmation |

### 4.4 Mobile Dashboard Templates

**Template A: Metric-Focused Dashboard**

Use for: Trips Hub, My Events, My Bookings

| Section | Height | Content |
|---------|--------|---------|
| Header | 56px | Title + primary action icon |
| Hero Metrics | 120px | 2-4 key stats in horizontal scroll |
| Quick Actions | 80px | 4-5 icon buttons |
| Search | 48px | Expandable search bar |
| Filters | 48px | Horizontal chip scroll |
| Content List | Variable | Cards or list items |
| Bottom Nav | 64px | Main navigation |

**Template B: Discovery Dashboard**

Use for: Explore, Restaurants, Events, Rentals

| Section | Height | Content |
|---------|--------|---------|
| Header | 56px | Title + search icon |
| Search (Expanded) | 88px | Search bar + location chip |
| Filters | 48px | Horizontal scroll chips |
| View Toggle | 44px | Grid/List + Sort dropdown |
| Featured | 200px | Horizontal carousel (optional) |
| Content Grid | Variable | 1-column cards or list |
| Bottom Nav | 64px | Main navigation |

**Template C: Detail-Focused Dashboard**

Use for: Trip Command Center, Event Detail

| Section | Height | Content |
|---------|--------|---------|
| Hero Image | 240px | Full-width photo |
| Title & Meta | 80px | Name, subtitle, key info |
| Primary CTA | 56px | Sticky bottom button |
| Tab Navigation | 48px | Horizontal tabs |
| Tab Content | Variable | Scrollable sections |
| Bottom Nav | 64px | Main navigation (if global) |

---

## SECTION 5: CHATBOT UX GUIDANCE

### 5.1 Placement Strategy

**Chatbot Positioning Options:**

| Pattern | Pros | Cons | Use Case |
|---------|------|------|----------|
| **Floating Button** | Non-intrusive, always available | Easy to ignore, small | Desktop, secondary feature |
| **Docked Bottom Sheet** | Visible, contextual, resizable | Takes screen space | Mobile, primary feature |
| **Full Page** | Focus mode, lots of space | Loses context | Complex conversations |
| **Inline Widget** | Contextual, integrated | Not available everywhere | Page-specific help |
| **Modal Overlay** | Gets attention, focused | Blocks everything | Critical announcements |

**Recommended Mobile Pattern: Docked Bottom Sheet**

| State | Screen Coverage | Trigger | Use Case |
|-------|----------------|---------|----------|
| Hidden | 0% (button only) | User dismisses | Not needed |
| Collapsed | 56px bar | Default state | Available but not intrusive |
| Medium | 50% screen | Tap to expand | Active conversation |
| Full | 85% screen | Drag up or complex query | Focus mode |

**Decision Tree:**

**Is chatbot core to experience?**
- Yes → Docked bottom sheet
- No → Floating button

**Does user need context while chatting?**
- Yes → Docked sheet (50% screen)
- No → Full-screen modal

**Is it page-specific help?**
- Yes → Inline widget
- No → Global chatbot

### 5.2 Trigger Points - When to Appear

**Proactive vs. Reactive:**

| Trigger Type | When | How | Example |
|--------------|------|-----|---------|
| **User-Initiated** | User taps button/icon | Immediate response | Click "AI Help" button |
| **Contextual Prompt** | User stuck or idle | Gentle suggestion | "Need help planning Day 3?" |
| **Onboarding** | First-time user | Auto-opens (once) | "Welcome! I can help you plan" |
| **Error Recovery** | Error occurs | Offers assistance | "Something went wrong. Let me help." |
| **Feature Discovery** | New feature available | Soft notification | "New: I can now optimize routes!" |
| **Time-Based** | Specific moments | Schedule-based | "Your trip is in 1 week. Ready?" |

**Mobile-Specific Triggers:**

| Scenario | Trigger Mechanism | Chatbot Behavior |
|----------|------------------|------------------|
| Empty itinerary day | Tap "Add Item" shows AI option | Bottom sheet suggests AI planning |
| Long wait time | User idle for 30s on wizard | Collapsed bar pulses, offers help |
| Multiple edits | User edits item 3 times | Suggests optimization agent |
| Budget exceeded | Real-time budget check | Toast + chat suggestion |
| Search with no results | Empty search results | "Can't find it? Let AI help" |

**Timing Guidelines:**

| Trigger | Delay | Frequency | Dismissible |
|---------|-------|-----------|-------------|
| Onboarding | Immediate on first launch | Once ever | Yes |
| Contextual | 5-10s after context appears | Once per session | Yes |
| Error | Immediate | Every error (if helpful) | Yes |
| Idle | 30s of inactivity | Once per page | Yes |
| Scheduled | Exact time | As scheduled | Yes |

### 5.3 Supporting Without Interrupting

**Core Principle:** Chatbot should enhance, not interrupt, the user's flow.

**Non-Intrusive Patterns:**

| Pattern | Description | Mobile Implementation |
|---------|-------------|----------------------|
| **Ambient Presence** | Always available, never forces attention | Collapsed bar at bottom, no alerts |
| **Contextual Hints** | Suggests actions based on context | Small chip/badge, not full message |
| **Pull, Don't Push** | User initiates, bot responds | Button turns green when suggestions ready |
| **Quick Dismiss** | Easy to close and ignore | Swipe down gesture, X button |
| **Remember Context** | Picks up where user left off | Conversation persists across sessions |

**Interrupt Hierarchy (Least to Most Intrusive):**

| Level | Method | When to Use | Example |
|-------|--------|-------------|---------|
| 1. Silent | Visual indicator only | Helpful but not urgent | Green dot on AI button |
| 2. Passive | Badge or chip | Useful suggestion | "3 AI suggestions" badge |
| 3. Gentle | Collapsed bar bounces | Potentially important | Bar pulses once |
| 4. Moderate | Toast notification | Important but not critical | "AI found better route" |
| 5. Assertive | Bottom sheet auto-opens (collapsed) | Needs attention | "Flight delayed" alert |
| 6. Intrusive | Modal overlay | Critical only | "Payment failed" error |

**Mobile-Specific Guidelines:**

| Scenario | What NOT to Do | What TO Do |
|----------|---------------|-----------|
| AI has suggestions | Auto-open full chat | Show badge on collapsed bar |
| User adding item | Interrupt with suggestions | Offer AI option in add sheet |
| User browsing | Pop-up overlay | Floating button pulses once |
| User typing | Take over keyboard | Wait for user to finish |
| User in wizard | Redirect to chat | Inline help button |

**Integration with User Flows:**

| User Flow | Chatbot Role | Integration Pattern |
|-----------|--------------|-------------------|
| Creating Trip (Wizard) | Optional helper | "Need help?" link in each step |
| Building Itinerary | Active assistant | Docked bar, expanded when used |
| Browsing Restaurants | Passive suggester | Badge when relevant suggestions ready |
| Viewing Details | On-demand info | Help icon in header |
| Booking/Confirming | Error recovery | Only appears if error occurs |

### 5.4 Mobile Chatbot UI Specifications

**Docked Bottom Sheet - Detailed Spec:**

**Collapsed State:**

| Element | Dimensions | Styling | Interaction |
|---------|-----------|---------|-------------|
| Container | Full-width x 56px | White bg, shadow top | Tap to expand |
| Avatar | 32x32px | AI icon, left | None |
| Text | "AI Assistant" | 14px, truncated | None |
| Badge | 20x20px circle | Red, shows unseen count | None |
| Expand Icon | 24x24px | Chevron up | Tap to expand |

**Expanded State (Medium):**

| Element | Dimensions | Position | Behavior |
|---------|-----------|----------|----------|
| Container | Full-width x 50% screen | Bottom-aligned | Resizable by dragging |
| Handle | 32px wide x 4px tall | Top-center | Drag to resize or dismiss |
| Header | Full-width x 56px | Top | Agent tabs, close button |
| Messages | Remaining height | Scrollable | Chat bubbles |
| Input Bar | Full-width x 56px | Bottom | Text field, send button |

**Message Bubble Specs:**

| Type | Max Width | Alignment | Color |
|------|-----------|-----------|-------|
| User | 85% | Right | Blue (#3B82F6) |
| AI | 85% | Left | Gray (#F3F4F6) |
| System | 100% | Center | Yellow (#FEF3C7) |
| Error | 90% | Center | Red (#FEE2E2) |

**Input Bar:**

| Element | Size | Behavior |
|---------|------|----------|
| Text Input | Flexible width | Expands with text, max 3 lines |
| Send Button | 44x44px | Disabled when empty, blue when ready |
| Attachment Icon | 32x32px (optional) | For photos, location |
| Voice Icon | 32x32px (optional) | Speech-to-text |

**Suggestion Chips:**

| Element | Size | Content |
|---------|------|---------|
| Chip | Auto-width x 36px | Text suggestion |
| Max Width | 80% screen | Wraps to multiple lines |
| Layout | Horizontal scroll | Swipe to see more |

### 5.5 Chatbot States & Feedback

**Loading States:**

| State | Visual | Duration |
|-------|--------|----------|
| Thinking | Three animated dots | 0.5-3 seconds |
| Searching | "Searching..." with spinner | 1-5 seconds |
| Processing | Progress bar | Variable |
| Error | Error icon + message | Until dismissed |

**Empty States:**

| Scenario | Message | Suggestions |
|----------|---------|-------------|
| First Open | "Hi! I'm your AI travel assistant. How can I help?" | "Plan a day", "Find restaurants", "Optimize my trip" |
| After Clear | "Chat cleared. What would you like to do next?" | Recent topics |
| No Context | "I'm here to help with your trip planning." | Browse features |

**Error States:**

| Error Type | Message | Recovery Action |
|------------|---------|----------------|
| Network | "Connection lost. Retrying..." | Auto-retry, then manual retry |
| API Error | "Something went wrong. Please try again." | Retry button |
| No Results | "I couldn't find anything matching that." | Refine search suggestion |
| Invalid Input | "I didn't understand. Could you rephrase?" | Examples of valid input |

---

## SECTION 6: IMPLEMENTATION PRIORITIES

### 6.1 Quick Wins (Week 1-2)

**High Impact, Low Effort:**

| Task | Impact | Effort | Screen | Change |
|------|--------|--------|--------|--------|
| 1. Fix tap targets | HIGH | LOW | All | Increase button sizes to 44px minimum |
| 2. Single column cards | HIGH | LOW | Dashboards | Change grid from 2-col to 1-col |
| 3. Sticky CTAs | HIGH | MEDIUM | Detail pages | Make primary buttons sticky bottom |
| 4. Progress bars | MEDIUM | LOW | Wizards | Replace dots with linear bars |
| 5. Bottom sheet filters | MEDIUM | MEDIUM | Dashboards | Move filters to bottom sheet |

### 6.2 Major Refactors (Week 3-6)

**High Impact, High Effort:**

| Task | Impact | Effort | Screen | Change |
|------|--------|--------|--------|--------|
| 1. Wizard reduction | HIGH | HIGH | Create Trip | 5 steps → 4 steps |
| 2. Command center redesign | HIGH | HIGH | Trip Dashboard | Restack sections, add progressive disclosure |
| 3. Chatbot docking | MEDIUM | HIGH | AI Concierge | Full-screen → Docked bottom sheet |
| 4. Tab navigation | MEDIUM | MEDIUM | Detail pages | Add tabbed content sections |
| 5. Horizontal cards | MEDIUM | MEDIUM | Trips Hub | Vertical cards → Horizontal cards |

### 6.3 Future Enhancements (Month 2-3)

**Nice-to-Have, Lower Priority:**

| Task | Impact | Effort | Screen | Change |
|------|--------|--------|--------|--------|
| 1. Gesture shortcuts | MEDIUM | MEDIUM | All | Add swipe-back, pinch-zoom |
| 2. Haptic feedback | LOW | LOW | Interactive | Add vibration on actions |
| 3. Voice input | MEDIUM | HIGH | Chatbot | Add speech-to-text |
| 4. Offline mode | HIGH | VERY HIGH | All | Local storage, sync |
| 5. Dark mode | MEDIUM | MEDIUM | All | Theme switcher |

---

## SECTION 7: SUCCESS METRICS

### 7.1 Key Performance Indicators

**User Engagement:**

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Wizard Completion Rate | 65% | 85% | % who finish Create Trip |
| Time to Create Trip | 8 minutes | 4 minutes | Avg time in wizard |
| Itinerary Items Added | 6 per trip | 12 per trip | Avg items created |
| AI Suggestions Accepted | 15% | 40% | % of AI suggestions accepted |
| Daily Active Users (Mobile) | 40% | 65% | % of total DAU |

**Usability:**

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Tap Accuracy | 88% | 95% | Successful taps / total attempts |
| Error Rate | 12% | 5% | Failed actions / total actions |
| Session Duration | 3 min | 6 min | Avg time in app |
| Screens per Session | 4 screens | 8 screens | Avg depth |
| Bounce Rate | 35% | 20% | Single-screen sessions |

**Performance:**

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Page Load Time | 2.5s | 1.5s | Time to interactive |
| Scroll FPS | 45 FPS | 60 FPS | Scrolling smoothness |
| Touch Response | 150ms | 100ms | Tap to visual feedback |

### 7.2 Testing Checklist

**Before Launch:**

**Usability Testing:**
- Test all tap targets with thumb (44px minimum)
- Verify one-handed operation (bottom 60% of screen)
- Test with actual users on 3 device sizes
- Conduct A/B test: old vs new wizard flow

**Technical Testing:**
- Test on iOS Safari + Chrome
- Test on Android Chrome
- Test keyboard behavior (all inputs)
- Test landscape orientation
- Test slow network (3G simulation)

**Accessibility Testing:**
- VoiceOver / TalkBack compatibility
- Color contrast (WCAG AA minimum)
- Focus order logical
- Font scaling (up to 200%)

---

## APPENDIX: MOBILE DESIGN TOKENS

### Typography Scale (Mobile)

| Token | Size | Line Height | Use Case |
|-------|------|-------------|----------|
| display | 32px | 40px | Hero headlines |
| h1 | 24px | 32px | Page titles |
| h2 | 20px | 28px | Section headers |
| h3 | 18px | 24px | Card titles |
| body | 16px | 24px | Body text |
| small | 14px | 20px | Metadata, captions |
| tiny | 12px | 16px | Labels, badges |

### Color Tokens

| Token | Hex | Use Case |
|-------|-----|----------|
| Primary | #3B82F6 | Buttons, links, highlights |
| Success | #10B981 | Confirmations, success states |
| Warning | #F59E0B | Alerts, warnings |
| Error | #EF4444 | Errors, destructive actions |
| Neutral-900 | #111827 | Headings |
| Neutral-600 | #4B5563 | Body text |
| Neutral-400 | #9CA3AF | Disabled, placeholder |
| Neutral-100 | #F3F4F6 | Backgrounds, cards |

### Shadow Tokens

| Token | Value | Use Case |
|-------|-------|----------|
| shadow-sm | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| shadow-md | 0 4px 6px rgba(0,0,0,0.07) | Cards, buttons |
| shadow-lg | 0 10px 15px rgba(0,0,0,0.1) | Modals, sheets |
| shadow-xl | 0 20px 25px rgba(0,0,0,0.15) | Overlays |

---

## SUMMARY

**Total Screens Analyzed:** 32  
**High-Priority Improvements:** 12  
**Medium-Priority Improvements:** 15  
**Low-Priority Improvements:** 8  

**Biggest Mobile Issues:**
1. Wizard flows too long (5+ steps)
2. Information density too high on dashboards
3. Tap targets below 44px in multiple areas
4. Grid layouts not mobile-optimized
5. Chatbot full-screen overlay too intrusive

**Top 5 Quick Wins:**
1. Fix all tap targets to 44px minimum
2. Convert dashboard grids to single column
3. Add sticky bottom CTAs to detail pages
4. Replace dot progress with linear bars
5. Move filters to bottom sheets

**Top 5 Major Refactors:**
1. Reduce Create Trip wizard from 5 to 4 steps
2. Redesign Trip Command Center for mobile
3. Convert AI chatbot to docked bottom sheet
4. Add tab navigation to detail pages
5. Convert trip cards to horizontal layout

**Estimated Timeline:**
- Quick wins: 1-2 weeks
- Major refactors: 4-6 weeks
- Future enhancements: 2-3 months

**Success Definition:**
- 85% wizard completion rate (up from 65%)
- 4-minute average trip creation (down from 8)
- 95% tap accuracy (up from 88%)
- 60 FPS scrolling throughout
- 40% AI suggestion acceptance (up from 15%)

---

**Next Step:** Proceed to `/docs/mobile/02-prompts.md` for detailed implementation prompts and wireframe specifications.
