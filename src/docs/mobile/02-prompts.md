# MOBILE OPTIMIZATION — IMPLEMENTATION PROMPTS

**Project:** Local Scout Mobile-First Refactor  
**Version:** 2.0.0  
**Date:** December 27, 2024  
**Purpose:** Step-by-step prompts for implementing mobile optimizations  
**Format:** No code blocks - Descriptive wireframes and instructions

---

## HOW TO USE THESE PROMPTS

**Structure:**
Each prompt is designed to be copy-pasted to an AI assistant for implementation.

**Order:**
Follow the sequence for best results:
1. Quick Wins (Weeks 1-2)
2. Major Refactors (Weeks 3-6)
3. Future Enhancements (Months 2-3)

**Format:**
- Each prompt includes context, requirements, and wireframe descriptions
- No code is provided - implementations should follow modern React + TypeScript patterns
- Wireframes use ASCII art and detailed descriptions

---

## PHASE 1: QUICK WINS (WEEKS 1-2)

### PROMPT 1.1: FIX TAP TARGETS GLOBALLY

**Copy this prompt:**

I need to audit and fix all tap targets across the application to meet mobile accessibility standards. The minimum touch target size should be 44x44 pixels according to Apple HIG and Material Design guidelines.

**Requirements:**

Create a comprehensive touch target audit system:

**Audit Scope:**
- All buttons (primary, secondary, icon buttons)
- All form inputs (text fields, checkboxes, radio buttons)
- All links and clickable text
- All list items and cards
- All navigation elements
- All interactive icons

**Target Sizes:**
- Primary buttons: 48x48px (recommended) with 44px minimum
- Secondary buttons: 44x44px minimum
- Icon buttons: 48x48px (recommended)
- List items: Full width by 64px height minimum
- Form inputs: 48px height minimum
- Links in text: 44px touch area height

**Implementation Steps:**

Step 1: Create a TouchTarget wrapper component that ensures minimum size
- Accepts children and applies minimum dimensions
- Adds invisible padding if content is smaller
- Ensures 8px minimum spacing between targets

Step 2: Audit all existing components
- Identify buttons below 44x44px
- Identify icons without proper touch areas
- Identify text links that are too small
- List all violations in a spreadsheet format

Step 3: Fix violations systematically
- Update button components to use minimum sizes
- Add touch padding to icons
- Increase link touch areas with padding
- Update list item heights

Step 4: Add design tokens
- Create spacing tokens for touch targets
- Create size tokens for minimum dimensions
- Document in design system

**Success Criteria:**
- Zero touch targets below 44x44px
- Minimum 8px spacing between interactive elements
- All interactive elements easily tappable with thumb
- No accidental taps on adjacent elements

**Testing:**
- Manual thumb test on actual mobile devices
- Automated accessibility audit
- User testing with various hand sizes

---

### PROMPT 1.2: CONVERT DASHBOARDS TO SINGLE COLUMN

**Copy this prompt:**

I need to optimize all dashboard grid layouts for mobile by converting multi-column card grids to single-column layouts. This applies to Trips Hub, Events Dashboard, Restaurants Dashboard, Rentals Dashboard, and Explore Dashboard.

**Current Problem:**
Desktop uses 3-4 column grids which become cramped 2-column grids on mobile. Cards are too small, images barely visible, text is cramped, and tap targets overlap.

**Solution:**
Convert all dashboard grids to single-column vertical scrolling lists on mobile while maintaining grid layout on desktop and tablet.

**Implementation Requirements:**

**Responsive Breakpoints:**
- Mobile (0-767px): 1 column
- Tablet (768-1023px): 2 columns
- Desktop (1024px+): 3-4 columns

**Card Layout Changes:**

For Mobile (Single Column):
- Width: 100% minus 32px margins (16px each side)
- Height: Variable based on content
- Layout: Horizontal card style (image left, content right) OR vertical (image top, content below)
- Spacing: 16px between cards
- Image size: 100x100px (horizontal) OR full-width x 160px (vertical)

**Screens to Update:**
1. Trips Hub - Use horizontal cards (image left, content right)
2. Events Dashboard - Use vertical cards (image top, content below)
3. Restaurants Dashboard - Use horizontal cards with larger thumbnails
4. Rentals Dashboard - Use vertical cards with emphasis on photos
5. Explore Dashboard - Use vertical cards for visual browsing

**Wireframe - Horizontal Card (Trips Hub):**

```
┌─────────────────────────────────────────┐
│ ┌──────┐ Trip Title                  ⋮  │ <- Card container
│ │      │ Paris, France                  │    Full width x 120px
│ │ IMG  │ Mar 15-22, 2025                │
│ │ 100x │ 7 days • 12 items • $2,400     │
│ │ 100  │                                │
│ └──────┘                                │
└─────────────────────────────────────────┘
    ^         ^                          ^
   Image    Content                   Menu
  (left)   (center)                 (right)
```

**Wireframe - Vertical Card (Events Dashboard):**

```
┌─────────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │ <- Card container
│ │                                     │ │    Full width x 280px
│ │         Event Image                 │ │
│ │         Full Width x 160px          │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Concert: Taylor Swift                   │
│ Madison Square Garden                   │
│ Jun 25, 2025 • 7:30 PM                 │
│ $150-$500                               │
│ ┌─────────────────┐                    │
│ │  Get Tickets    │                    │
│ └─────────────────┘                    │
└─────────────────────────────────────────┘
```

**CSS Strategy:**
Use CSS Grid with auto-fit and minmax for responsive columns:
- Mobile: grid-template-columns: 1fr (single column)
- Tablet: grid-template-columns: repeat(2, 1fr)
- Desktop: grid-template-columns: repeat(3, 1fr) or repeat(4, 1fr)

**Performance:**
- Implement virtual scrolling for lists with 50+ items
- Lazy load images as user scrolls
- Use skeleton loaders while content loads

---

### PROMPT 1.3: ADD STICKY BOTTOM CTAs TO DETAIL PAGES

**Copy this prompt:**

I need to add sticky bottom call-to-action buttons to all detail pages (Event Detail, Restaurant Detail, Rental Detail, Destination Detail) to ensure the primary action is always accessible without scrolling.

**Problem:**
On mobile, detail pages require 5-10 screens of scrolling. The primary action button (Reserve, Book, Add to Trip) is at the top or bottom of content and scrolls out of view. Users must scroll back to take action.

**Solution:**
Implement sticky bottom CTAs that remain visible while scrolling, allowing users to take action at any point.

**Requirements:**

**Sticky CTA Specifications:**
- Position: Fixed to bottom of viewport
- Height: 64px (56px button + 8px padding)
- Background: White with top shadow for depth
- Z-index: 50 (below modals, above content)
- Safe area: Padding-bottom for iPhone X+ home indicator

**Button Specifications:**
- Width: Full width minus 32px (16px margins each side)
- Height: 48px
- Border radius: 8px
- Font size: 16px
- Font weight: 600 (semibold)
- Color: White text on primary blue background

**Scroll Behavior:**

Show/Hide Logic:
- Hidden when page first loads (user sees header)
- Appears when user scrolls down 200px
- Remains visible while scrolling
- Hides when user scrolls back to top

Smooth Transition:
- Fade in/out with 200ms ease
- Slide up/down with 200ms ease
- No jarring appearance

**Interaction:**

Button States:
- Default: Blue background, white text
- Hover/Focus: Darker blue background
- Active: Pressed state with slight scale down
- Loading: Spinner replaces text
- Disabled: Gray background, gray text, no interaction

**Wireframe - Sticky CTA:**

```
                Mobile Screen
┌───────────────────────────────────────┐
│ [Header - Event Title]                │ <- Scrolls normally
│                                       │
│ Image Gallery                         │
│                                       │
│ Description...                        │
│ ...scrollable content...              │
│ ...more content...                    │
│ ...reviews...                         │
│ ...more scrolling...                  │
│                                       │
│ ┌─────────────────────────────────┐  │ <- Sticky container
│ │ ┌─────────────────────────────┐ │  │    Fixed to bottom
│ │ │     GET TICKETS - $150      │ │  │
│ │ └─────────────────────────────┘ │  │
│ └─────────────────────────────────┘  │
└───────────────────────────────────────┘
        ^
    Sticky CTA bar
    64px height
    White bg, shadow
```

**Accessibility:**

ARIA Labels:
- Button has descriptive aria-label
- Example: "Reserve table at Le Bernardin for 2 people on June 15th"

Keyboard:
- Button is focusable via tab
- Activates with Enter or Space
- Focus outline visible

Screen Reader:
- Announces button when it appears
- Provides context about action

**Pages to Update:**

List of detail pages:
1. Event Detail - "Get Tickets" or "RSVP"
2. Restaurant Detail - "Reserve Table" or "Call Restaurant"
3. Rental Detail - "Book Now" or "Check Availability"
4. Destination Detail - "Plan Trip to [Destination]"
5. Activity Detail - "Add to Itinerary"

**Implementation Notes:**

Use React hook for scroll detection:
- Track scroll position
- Show/hide CTA based on scroll threshold
- Debounce scroll events for performance

Handle keyboard visibility:
- Detect when mobile keyboard opens
- Adjust CTA position above keyboard
- Return to bottom when keyboard closes

Consider content padding:
- Add 80px padding-bottom to page content
- Prevents content being hidden under sticky CTA
- Ensures last content is scrollable into view

---

### PROMPT 1.4: REPLACE DOT PROGRESS WITH LINEAR BARS IN WIZARDS

**Copy this prompt:**

I need to replace the current dot-based progress indicators in all wizard flows with linear progress bars. This applies to Create Trip Wizard, Create Event Wizard, Create Restaurant Wizard, and Create Rental Wizard.

**Problem:**
Current progress indicators use small dots (8-10px each) which are:
- Too small to see clearly on mobile
- Hard to tap if made interactive
- Don't show percentage progress
- Take up more vertical space than needed

**Solution:**
Replace with linear progress bars that show clear visual progress and are more space-efficient.

**Requirements:**

**Progress Bar Specifications:**
- Height: 4px (thin line)
- Width: 100% of container
- Border radius: 2px (rounded ends)
- Position: Fixed at top of wizard screen, below header
- Colors: Primary blue for completed, light gray for remaining

**Progress Text:**
- Position: Centered below progress bar
- Text: "Step 2 of 4"
- Font size: 14px
- Color: Neutral-600
- Margin: 8px below progress bar

**Total Component Height:**
- Progress bar: 4px
- Spacing: 8px
- Text: 16px
- Total: 28px (very compact)

**Wireframe - Linear Progress Bar:**

```
┌───────────────────────────────────────┐
│ [Header: Create Trip] [X Close]       │
│                                       │
│ ━━━━━━━━━━━━━━━━━━━━┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │ <- Progress bar 4px
│       Step 2 of 4                     │ <- Step text
│                                       │
│        Where are you going?           │ <- Question
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ Search destinations...          │ │ <- Input
│  └─────────────────────────────────┘ │
│                                       │
│  Recent destinations:                 │
│  • Paris, France                      │
│  • Tokyo, Japan                       │
│                                       │
│                                       │
│ ┌───────────┐ ┌──────────────────┐  │
│ │   Back    │ │      Next        │  │ <- Navigation
│ └───────────┘ └──────────────────┘  │
└───────────────────────────────────────┘

━━━ = Completed (blue)
┄┄┄ = Remaining (light gray)
```

**Progress Calculation:**
- Formula: (current step - 1) divided by (total steps - 1) times 100%
- Example: Step 2 of 4 = (2-1) / (4-1) = 1/3 = 33%
- Round to nearest percent

**Animation:**
- When advancing step: Progress bar grows from left to right
- Duration: 300ms
- Easing: ease-out
- Step text fades to new number (200ms)

**Responsive Behavior:**

Mobile (320-767px):
- Full width progress bar
- Text centered below
- Compact 28px total height

Tablet (768-1023px):
- Same as mobile
- Slightly larger text (15px)

Desktop (1024px+):
- Progress bar can be wider (max 600px, centered)
- Or keep same pattern for consistency

**Accessibility:**

ARIA Attributes:
- role="progressbar"
- aria-valuenow="2" (current step)
- aria-valuemin="1"
- aria-valuemax="4" (total steps)
- aria-label="Step 2 of 4: Destination selection"

Screen Reader:
- Announces progress when step changes
- "Step 2 of 4: Destination selection"

**Wizards to Update:**

List of wizard flows:
1. Create Trip Wizard (currently 5 steps, will be 4)
2. Create Event Wizard (currently 7 steps)
3. Create Restaurant Wizard (currently 6 steps)
4. Create Rental Wizard (currently 8 steps)

**Additional Features:**

Step Labels (Optional):
- Show step names below progress bar on desktop
- Example: "Destination | Dates | Details | Review"
- Hide on mobile to save space

Back Navigation:
- Allow clicking earlier parts of progress bar to go back
- Only if previous steps are complete
- Desktop only (too small on mobile)

---

### PROMPT 1.5: CONVERT FILTERS TO BOTTOM SHEETS

**Copy this prompt:**

I need to move all filter controls from sidebar or inline positions to mobile-optimized bottom sheets. This provides better thumb accessibility and doesn't take up screen real estate when not in use.

**Problem:**
Current filter implementations vary:
- Some use sidebar (takes permanent space on desktop, awkward on mobile)
- Some use inline horizontal chips (limited options, clutters UI)
- Some use dropdowns (multiple taps to select multiple filters)

**Solution:**
Standardize on bottom sheet pattern for all filter UIs on mobile, while keeping sidebar/inline for desktop.

**Requirements:**

**Filter Button (Trigger):**
- Position: Top right of screen, next to sort button
- Label: "Filters" with filter icon
- Badge: Shows count of active filters (e.g., "3 active")
- Size: 44px height minimum for tap target

**Bottom Sheet Specifications:**

Sheet Dimensions:
- Width: 100% of screen
- Height: 60% of screen (medium sheet)
- Position: Slides up from bottom
- Background: White
- Corners: Rounded top (16px radius)

Sheet Structure:
- Handle: 32px wide, 4px tall, centered at top
- Header: "Filters" title, "Clear all" link, close X
- Content: Scrollable filter groups
- Footer: "Apply Filters" button (sticky)

**Wireframe - Bottom Sheet:**

```
       Before tap                    After tap
┌──────────────────────┐    ┌──────────────────────┐
│ [Search] [Sort][Filters]│    │ [Content dimmed]     │
│                      │    │                      │
│ Content              │    │                      │
│ ...                  │    ├──────────────────────┤
│ ...                  │    │  ─── Handle          │ <- Sheet top
│ ...                  │    │ Filters    Clear X   │
│                      │    ├──────────────────────┤
│                      │    │ ▼ Price Range        │ <- Collapsible
│                      │    │   $$ - $$$           │    sections
│                      │    │                      │
│                      │    │ ▼ Cuisine            │
└──────────────────────┘    │   □ Italian          │
                            │   ☑ French           │
                            │   ☑ Japanese         │
                            │                      │
                            │ ▼ Rating             │
                            │   ○ 4+ stars         │
                            │   ● 4.5+ stars       │
                            │                      │
                            ├──────────────────────┤
                            │ ┌──────────────────┐ │ <- Sticky
                            │ │  Apply Filters   │ │    footer
                            │ └──────────────────┘ │
                            └──────────────────────┘
```

**Filter Group Patterns:**

**Checkboxes (Multiple selection):**
- Use for: Cuisine types, amenities, features
- Layout: Vertical list, checkmarks on left
- Tap area: Full width item (64px height)

**Radio Buttons (Single selection):**
- Use for: Rating, distance, sort order
- Layout: Vertical list, radio circle on left
- Tap area: Full width item (64px height)

**Range Slider:**
- Use for: Price, budget, distance
- Layout: Horizontal slider with min/max labels
- Handles: 44x44px for easy dragging

**Segmented Control:**
- Use for: 2-3 options (e.g., Grid/List view)
- Layout: Horizontal, equal width segments
- Height: 40px each segment

**Date Picker:**
- Use for: Date ranges, specific dates
- Trigger: Tappable date input
- Opens: Native date picker or custom calendar

**Filter Group Accordion:**
- Each group can collapse/expand
- Chevron indicates state (up/down)
- Tap header to toggle
- Smooth animation (200ms)

**Interaction Behavior:**

Opening Sheet:
- Tap "Filters" button
- Sheet slides up from bottom (300ms ease-out)
- Backdrop appears behind (dark overlay 40% opacity)
- Main content dims slightly
- Scrolling disabled on main content

Closing Sheet:
- Tap "X" close button
- Tap backdrop (outside sheet)
- Swipe down on handle
- Sheet slides down (250ms ease-in)
- Backdrop fades out
- Main content scrolling re-enabled

Applying Filters:
- Tap "Apply Filters" button
- Sheet closes
- Filter count badge updates
- Results refresh with animation
- Toast notification: "X filters applied"

Clearing Filters:
- Tap "Clear all" link
- All selections reset
- "Apply" button updates label to "Show all results"
- No need to tap Apply if auto-applying

**Dashboard Filter Patterns:**

**Trips Hub:**
- Status: Planning, Upcoming, Active, Completed
- Date Range: Custom date picker
- Budget: Range slider
- Destination: Checkbox list

**Events:**
- Category: Music, Sports, Food, etc.
- Date: This weekend, This month, Custom
- Price: Free, Under $50, $50-100, $100+
- Distance: Within 5mi, 10mi, 25mi

**Restaurants:**
- Cuisine: Checkboxes (Italian, French, etc.)
- Price: $, $$, $$$, $$$$
- Rating: 4+, 4.5+, 5 stars only
- Open Now: Toggle switch
- Dietary: Vegetarian, Vegan, Gluten-free

**Rentals:**
- Property Type: Entire home, Private room, Hotel
- Guests: Number input
- Bedrooms: 1, 2, 3, 4+
- Amenities: WiFi, Kitchen, Pool, etc.
- Price Range: Slider

**Badge Behavior:**

Filter Count Badge:
- Shows number of active filters
- Example: "Filters (3)" or badge with "3"
- Updates in real-time as filters change
- Clears when all filters removed

**Performance:**

Lazy Loading:
- Only load filter options when sheet opens
- Cache filter data to avoid refetching
- Debounce range slider updates

Animation Performance:
- Use CSS transforms (translateY) for sheet movement
- GPU-accelerated animations
- 60fps minimum

---

## PHASE 2: MAJOR REFACTORS (WEEKS 3-6)

### PROMPT 2.1: REDUCE CREATE TRIP WIZARD FROM 5 TO 4 STEPS

**Copy this prompt:**

I need to optimize the Create Trip Wizard by reducing it from 5 steps to 4 steps. User research shows that 5 steps on mobile feels too long and causes drop-off. The goal is to streamline the flow while maintaining all necessary information collection.

**Current Flow (5 Steps):**
1. Destination - Where are you going?
2. Dates - When are you traveling?
3. Travelers - How many people?
4. Budget - What's your budget?
5. Review - Confirm details and create

**Optimized Flow (4 Steps):**
1. Destination - Where are you going?
2. Dates - When are you traveling?
3. Details - Travelers and Budget combined
4. Review - Confirm and create

**Rationale:**
Steps 3 and 4 (Travelers and Budget) are simple inputs that can be combined into one screen without overwhelming the user. This reduces total steps while maintaining clarity.

**Requirements:**

**Step 3 Redesign - Combined Details:**

Layout for Mobile:
- Title: "Trip Details"
- Question: "Who's traveling and what's your budget?"
- Section 1: Travelers (top half)
- Section 2: Budget (bottom half)
- Clear visual separation between sections

**Wireframe - Combined Step 3:**

```
┌────────────────────────────────────────┐
│ ━━━━━━━━━━━━━┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │ Progress: 50%
│ Step 3 of 4                            │
│                                        │
│ Trip Details                           │ <- Title
│ Who's traveling and what's your budget?│ <- Subtitle
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ TRAVELERS                          │ │ <- Section 1
│ ├────────────────────────────────────┤ │
│ │                                    │ │
│ │ Adults (18+)                       │ │
│ │         ┌──┐  2  ┌──┐             │ │
│ │         │ -│     │+ │             │ │
│ │         └──┘     └──┘             │ │
│ │                                    │ │
│ │ Children (0-17)                    │ │
│ │         ┌──┐  0  ┌──┐             │ │
│ │         │ -│     │+ │             │ │
│ │         └──┘     └──┘             │ │
│ │                                    │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ BUDGET                             │ │ <- Section 2
│ ├────────────────────────────────────┤ │
│ │                                    │ │
│ │ Total budget for this trip         │ │
│ │                                    │ │
│ │ Quick Select:                      │ │
│ │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │ │
│ │ │$500 │ │$1K  │ │$2.5K│ │$5K  │  │ │
│ │ └─────┘ └─────┘ └─────┘ └─────┘  │ │
│ │                                    │ │
│ │ Or enter amount:                   │ │
│ │ ┌──────────────────────┐           │ │
│ │ │  $ 2,500             │           │ │
│ │ └──────────────────────┘           │ │
│ │                                    │ │
│ │ Per person: ~$1,250                │ │
│ │                                    │ │
│ └────────────────────────────────────┘ │
│                                        │
│                                        │
│ ┌───────────┐ ┌──────────────────┐   │
│ │   Back    │ │      Next        │   │
│ └───────────┘ └──────────────────┘   │
└────────────────────────────────────────┘
```

**Component Specifications:**

**Travelers Section:**
- Adults counter with minus/plus steppers
- Children counter with minus/plus steppers
- Minimum 1 adult required
- Maximum 10 total travelers
- Stepper buttons: 44x44px each
- Number display: 48px wide, centered

**Budget Section:**
- Quick select chips for common amounts
- Custom input field for specific amount
- Currency symbol prefix
- Per-person calculation shown
- Auto-calculates when travelers change

**Visual Separation:**
- Travelers section: Light gray background
- Budget section: White background
- 16px spacing between sections
- Border or shadow to separate

**Input Validation:**

Travelers:
- Minimum 1 adult required
- Show error if attempting to go below 1
- Disable minus button at minimum
- Disable plus button at maximum (10 total)

Budget:
- Minimum $100 required (or equivalent)
- Maximum $1,000,000 (prevents typing errors)
- Only accept numbers and decimal point
- Format with comma separators (e.g., $2,500)
- Clear validation message if invalid

**Smart Defaults:**
- Adults: 2 (common couple or friends trip)
- Children: 0
- Budget: Blank (user must input) OR $1,000 (common starting point)

**Behavior:**

When Travelers Changes:
- Recalculate per-person budget
- Update "Per person" text
- Example: $2,500 total, 2 adults = $1,250 per person

When Budget Changes:
- Update per-person calculation
- Validate amount is reasonable
- Show warning if budget seems too low for destination/duration

Quick Select Chips:
- Tap to select that amount
- Highlight selected chip
- Populate custom input with that value
- User can still modify in input field

**Accessibility:**

ARIA Labels:
- "Number of adult travelers"
- "Number of child travelers"
- "Total trip budget in dollars"
- "Budget per person"

Screen Reader:
- Announces current count when stepper tapped
- Announces budget amount when changed
- Provides context about per-person calculation

**Progressive Disclosure:**

Optional: Advanced Traveler Details:
- "Add traveler details" link (collapsed by default)
- Expands to show names, ages, relationships
- Only if needed for specific booking requirements
- Keeps step simple for most users

**Next Button Behavior:**
- Disabled until minimum 1 adult AND budget entered
- Enable with blue background when valid
- Clear helper text: "Next: Review your trip"

**Success Metrics:**
- Wizard completion rate increases from 65% to 85%
- Time to complete decreases from 8min to 4min
- User satisfaction rating improves
- No increase in errors or corrections

---

### PROMPT 2.2: REDESIGN TRIP COMMAND CENTER FOR MOBILE

**Copy this prompt:**

I need to completely redesign the Trip Command Center page to be mobile-first. The current desktop-focused layout is too dense for mobile, with information buried below the fold and unclear hierarchy.

**Current Problems:**
- Stats shown in cramped 2-column grid
- Primary action "View Itinerary" is below fold
- Too much scrolling required (8-10 screens)
- No clear visual hierarchy
- Quick actions take up too much space
- Weather and other widgets scattered

**Mobile-First Redesign Goals:**
- Primary action above the fold
- Clear content hierarchy
- Reduce scrolling with progressive disclosure
- Glanceable stats at top
- Quick actions accessible but not prominent
- One-handed thumb-friendly operation

**Requirements:**

**New Mobile Layout Structure:**

Layer 1 - Header (Fixed, 80px):
- Trip title
- Destination subtitle
- Date range
- Back button (top-left)
- More menu (top-right)

Layer 2 - Primary CTA (56px):
- Full-width "View Itinerary" button
- Most important action, immediately visible
- No scrolling required

Layer 3 - Weather Chip (40px):
- Compact one-liner: "Sunny, 75°F" with icon
- Tap to expand for forecast
- Helps users pack/plan

Layer 4 - Stats Summary (Vertical, ~180px):
- Duration: "7 days"
- Budget: "$2,400 of $3,000"
- Activities: "12 planned"
- Stacked vertically (not grid)
- Large, readable text

Layer 5 - Quick Actions (56px):
- Single "More Actions" button
- Opens bottom sheet with all actions
- Saves screen space

Layer 6 - Overview Sections (Accordion, Variable):
- Trip Details (collapsed by default)
- Travelers (collapsed)
- Transportation (collapsed)
- Accommodation (collapsed)
- Notes (collapsed)
- Tap header to expand
- Progressive disclosure

**Wireframe - Mobile Command Center:**

```
┌────────────────────────────────────────┐
│ ← Trip to Paris                    ⋮   │ <- Header (80px)
│   Paris, France                         │    Fixed top
│   Mar 15-22, 2025                       │
├────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ │
│ │       View Itinerary               │ │ <- Primary CTA (56px)
│ └────────────────────────────────────┘ │    Blue, prominent
├────────────────────────────────────────┤
│ ☀️ Sunny, 75°F • Good trip weather     │ <- Weather (40px)
├────────────────────────────────────────┤
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ 📅 Duration                        │ │ <- Stats (180px)
│ │    7 days                          │ │    Vertical stack
│ ├────────────────────────────────────┤ │
│ │ 💰 Budget                          │ │
│ │    $2,400 of $3,000                │ │
│ │    ▓▓▓▓▓▓▓▓░░ 80%                 │ │
│ ├────────────────────────────────────┤ │
│ │ 📍 Activities                      │ │
│ │    12 activities planned           │ │
│ └────────────────────────────────────┘ │
│                                        │
├────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ │
│ │       More Actions                 │ │ <- Actions button
│ └────────────────────────────────────┘ │    Opens sheet
├────────────────────────────────────────┤
│                                        │ <- Accordion sections
│ ▸ Trip Details                        │    (collapsed)
│ ▾ Travelers (Expanded)                │
│   👤 You                              │
│   👤 Sarah Johnson                    │
│ ▸ Transportation                      │
│ ▸ Accommodation                       │
│ ▸ Notes                               │
│                                        │
└────────────────────────────────────────┘
```

**More Actions Bottom Sheet:**

When user taps "More Actions" button:

```
┌────────────────────────────────────────┐
│            ─── handle                   │
│  Trip Actions                   Close X │
├────────────────────────────────────────┤
│                                        │
│ ✏️  Edit Trip Details                  │ <- 64px each
│                                        │
│ 🔗  Share Trip with Others             │
│                                        │
│ 📋  Duplicate Trip                     │
│                                        │
│ 📥  Export to PDF                      │
│                                        │
│ ➕  Add to Calendar                    │
│                                        │
│ 🗑️  Delete Trip                        │
│                                        │
└────────────────────────────────────────┘
```

**Detailed Specifications:**

**Header Section:**
- Height: 80px
- Background: White with bottom border
- Position: Fixed (stays visible when scrolling)
- Back button: 44x44px, top-left
- More menu: 44x44px, top-right (3 dots)
- Title: 20px font, truncate if too long
- Subtitle: 14px font, gray text
- Dates: 14px font, gray text

**Primary CTA:**
- Height: 56px (48px button + 8px margin)
- Width: Full width minus 32px (16px margins)
- Background: Primary blue
- Text: White, 16px, semibold
- Icon: Optional calendar or list icon
- Position: First thing below header
- Sticky: Becomes fixed when scrolling past

**Weather Chip:**
- Height: 40px
- Background: Light blue (for sunny) or gray (for clouds)
- Icon: Weather icon (sun, clouds, rain)
- Text: "Condition, Temperature"
- Tap: Expands to show 7-day forecast in bottom sheet
- Only show if trip is upcoming (not past)

**Stats Cards:**
- Layout: Vertical stack (not grid)
- Card height: 60px each
- Background: Light gray
- Border radius: 8px
- Spacing: 8px between cards
- Icon: Left side, 24px
- Label: Top, 12px font, gray
- Value: Bottom, 18px font, bold

Duration Stat:
- Shows total days
- Example: "7 days" or "2 weeks"

Budget Stat:
- Shows spent vs total
- Progress bar visual
- Color: Green if under, yellow if close, red if over
- Example: "$2,400 of $3,000"

Activities Stat:
- Shows number of planned items
- Breaks down: "8 activities, 4 restaurants"
- Tap to jump to itinerary

**Quick Actions Button:**
- Outlined button (not solid)
- Opens bottom sheet with all actions
- Sheet shows 6-8 common actions
- Each action: Icon + Label + Chevron
- Sheet is dismissible

**Accordion Sections:**
- Collapsed by default
- Chevron indicates state (right = collapsed, down = expanded)
- Tap header to toggle
- Smooth expand/collapse (300ms)
- Content appears below header
- Can have multiple expanded at once

**Content by Accordion:**

Trip Details:
- Destination
- Travel style (adventure, relaxation, etc.)
- Created date
- Last modified date

Travelers:
- List of people going
- Avatar + name
- Tap to view profile or send message

Transportation:
- Flights (if added)
- Trains, buses
- Car rentals
- Tap item to view details

Accommodation:
- Hotels, Airbnbs
- Check-in/check-out dates
- Confirmation numbers
- Tap to view booking

Notes:
- Free-form text area
- Packing list
- Important reminders
- Edit inline

**Responsive Behavior:**

Mobile (320-767px):
- Use full mobile layout as described
- Single column
- Accordion sections

Tablet (768-1023px):
- Similar to mobile but with more spacing
- Stats can be 2-column grid
- Accordion remains

Desktop (1024px+):
- Traditional dashboard layout
- Stats in grid
- Sidebar for details
- Actions visible (not bottom sheet)

**Performance:**

Lazy Load:
- Only load accordion content when expanded
- Don't fetch all details upfront
- Improves initial page load

Optimize Images:
- Compress trip header image
- Use responsive image sizes
- Lazy load images below fold

**Accessibility:**

Heading Hierarchy:
- H1: Trip title
- H2: Section headers (Stats, Actions, etc.)
- H3: Accordion titles

Screen Reader:
- Announces "Collapsed" or "Expanded" state
- Provides context for each stat
- Describes actions in bottom sheet

---

### PROMPT 2.3: CONVERT AI CHATBOT TO DOCKED BOTTOM SHEET

**Copy this prompt:**

I need to convert the AI Concierge chatbot from a full-screen overlay to a docked bottom sheet. The current full-screen implementation is too intrusive on mobile, blocking all content and making users lose context.

**Current Problems:**
- Full-screen overlay takes over entire app
- User loses context of what they were doing
- Can't reference itinerary while chatting
- Feels like leaving the app
- No quick way to minimize/peek

**Solution:**
Implement a docked bottom sheet that allows users to chat while maintaining context. Should have three states: collapsed (always visible), medium (active chat), and full (focus mode).

**Requirements:**

**Three Sheet States:**

**State 1: Collapsed (56px height)**
- Always visible at bottom of screen
- Shows "AI Assistant" with avatar
- Badge shows unread message count
- Tap anywhere to expand to medium
- Minimal, non-intrusive

**State 2: Medium (50% screen height)**
- Active chat mode
- Can see content behind (context maintained)
- Resize handle at top
- Chat history visible
- Input bar at bottom
- Drag handle to resize or close

**State 3: Full (85% screen height)**
- Focus mode for complex conversations
- More messages visible
- Full keyboard space
- Drag down to return to medium
- Close button returns to collapsed

**Wireframe - Three States:**

```
Collapsed State (56px):
┌────────────────────────────────────────┐
│                                        │
│   [Main app content visible here]     │
│                                        │
│                                        │
├────────────────────────────────────────┤
│ 🤖 AI Assistant          ▲     Badge 2│ <- Collapsed bar
└────────────────────────────────────────┘

Medium State (50% screen):
┌────────────────────────────────────────┐
│   [Content dimmed, partially visible]  │
│                                        │
├────────────────────────────────────────┤
│              ─── handle                 │ <- Drag handle
│ Discovery ⎪ Planning ⎪ Optimization   │ <- Agent tabs
├────────────────────────────────────────┤
│ 🤖 Hi! How can I help plan your trip? │ <- Chat history
│                                        │
│ 👤 Find restaurants in Paris           │
│                                        │
│ 🤖 Here are 3 great options:           │
│    [Suggestion card]                   │
│    [Suggestion card]                   │
│    [Suggestion card]                   │
│                                        │
├────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ │
│ │ Type a message...            [Send]│ │ <- Input bar
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘

Full State (85% screen):
┌────────────────────────────────────────┐
│              ─── handle         ✕ Close│
│ Discovery ⎪ Planning ⎪ Optimization   │
├────────────────────────────────────────┤
│                                        │
│   [Lots of chat history visible]      │
│   [Multiple conversation turns]       │
│   [Scrollable content]                │
│   [More space for complex queries]    │
│                                        │
├────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ │
│ │ Type a message...            [Send]│ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

**Component Specifications:**

**Collapsed Bar (56px):**
- Full width
- White background
- Top border shadow
- Fixed position at bottom
- Above bottom navigation (if present)
- Z-index: 40

Elements:
- Avatar: 32x32px, left (16px margin)
- Text: "AI Assistant", 14px
- Badge: Red circle, number of unseen messages
- Expand icon: Chevron up, 24px, right
- Tap area: Full 56px height

**Medium Sheet (50% screen):**
- Width: 100%
- Height: 50% of viewport height
- Rounded top corners: 16px
- White background
- Drop shadow above

Header (56px):
- Drag handle: 32px wide, 4px tall, gray, centered
- Agent tabs: Below handle, horizontal scrollable
- Close button: X icon, top-right

Agent Tabs:
- Three tabs: Discovery, Planning, Optimization
- Active tab: Bold text, blue underline
- Inactive: Gray text
- Swipeable between tabs

Chat Area:
- Scrollable message list
- Messages stack bottom-to-top (like iMessage)
- Auto-scroll to newest message
- Pull down to load older messages

Input Bar (56px):
- Fixed at bottom of sheet
- Text input: Flexible width
- Send button: 44x44px, right
- Microphone icon: Optional, for voice input

**Full Sheet (85% screen):**
- Same as medium but taller
- More chat history visible
- Close button in top-right
- Keyboard pushes sheet up (not overlay)

**Interaction Gestures:**

Open Medium from Collapsed:
- Tap anywhere on collapsed bar
- Sheet slides up (300ms ease-out)
- Background dims (backdrop appears)

Close to Collapsed:
- Drag handle down past threshold
- Tap backdrop (outside sheet)
- Sheet slides down (250ms ease-in)
- Backdrop fades

Resize Between Medium and Full:
- Drag handle up: Expands to full
- Drag handle down: Shrinks to medium
- Threshold: 50% of drag distance
- Smooth animation follows finger
- Spring-back if released before threshold

Quick Actions:
- Swipe down quickly: Collapse to bar
- Swipe up quickly: Expand to full
- Velocity-based detection

**Message Bubble Specs:**

User Messages:
- Max width: 85% of sheet width
- Aligned right
- Background: Blue (#3B82F6)
- Text: White
- Border radius: 16px (but squared right-bottom)
- Padding: 12px vertical, 16px horizontal

AI Messages:
- Max width: 85% of sheet width
- Aligned left
- Background: Light gray (#F3F4F6)
- Text: Dark gray (#1F2937)
- Border radius: 16px (but squared left-bottom)
- Avatar: 24px circle, left of message

System Messages:
- Max width: 90%
- Centered
- Background: Yellow tint (#FEF3C7)
- Text: Dark
- Border radius: 8px
- Small font: 12px

**Suggestion Cards (AI Responses):**

Card in Chat:
- Width: 90% of sheet width
- Background: White
- Border: 1px light gray
- Border radius: 12px
- Shadow: Small
- Padding: 16px

Card Content:
- Image: Top, 16:9 aspect ratio (if applicable)
- Title: Bold, 16px
- Details: 2-3 lines, 14px
- Price/Rating: Icons + text
- Action: "Add to Trip" button, full-width

Tappable Area:
- Entire card is tappable
- Opens detail view OR adds to itinerary
- Visual feedback on tap (scale down slightly)

**Agent Switching:**

Tab Behavior:
- Tap to switch agent
- Smooth transition (200ms)
- Chat history preserved per agent
- Agent avatar changes
- Placeholder changes: "Ask about restaurants..." vs "Plan my day..." vs "Optimize schedule..."

Agent Indicators:
- Discovery: 🔍 Search icon, blue
- Planning: 📅 Calendar icon, green
- Optimization: ⚡ Lightning icon, orange

**Keyboard Handling:**

When Keyboard Opens:
- Sheet doesn't resize height
- Input bar stays visible above keyboard
- Chat area shrinks to fit
- Auto-scroll to keep context visible

When Keyboard Closes:
- Sheet returns to original height
- Smooth animation (250ms)
- Input stays focused (unless user taps outside)

**Backdrop Behavior:**

Medium Sheet:
- Backdrop appears (dark overlay 40% opacity)
- Main content behind is dimmed but visible
- Tap backdrop: Dismisses sheet to collapsed
- Scroll blocked on main content

Full Sheet:
- Darker backdrop (50% opacity)
- Less of main content visible
- Same dismiss behavior

**Accessibility:**

ARIA Labels:
- Sheet: "AI Assistant chat panel"
- Collapsed bar: "Open AI Assistant, 2 unread messages"
- Handle: "Resize or close chat"
- Agent tabs: "Discovery agent", "Planning agent", etc.

Screen Reader:
- Announces sheet state: "Chat expanded" / "Chat collapsed"
- Announces new messages from AI
- Provides context about agent being used

Keyboard Navigation:
- Tab through messages (if needed)
- Focus input with keyboard shortcut
- Escape key: Close sheet
- Up/Down arrows: Navigate messages (optional)

**Persistence:**

Chat History:
- Saves to localStorage or state management
- Restores when reopening sheet
- Persists across sessions
- Option to clear history

Sheet State:
- Remembers last state (collapsed/medium/full)
- Reopens at last used state
- Or resets to collapsed on page change

**Badge Behavior:**

Unread Count:
- Shows number of unseen AI messages
- Red circle badge on collapsed bar
- Clears when sheet is opened and viewed
- Updates in real-time

**Performance:**

Virtualized Messages:
- Don't render all messages at once if conversation is long
- Virtual scrolling for 100+ messages
- Lazy load older messages on scroll up

Smooth Animations:
- Use CSS transforms for sheet movement
- GPU-accelerated (translateY)
- 60fps minimum
- No jank during drag

Debounced Input:
- Don't send API request on every keystroke
- Wait 500ms after user stops typing
- Or require Send button tap

**Integration with Flows:**

From Itinerary Builder:
- AI button in header opens sheet to medium
- Pre-fills context: "Help me plan Day 3"
- Agent: Planning Agent pre-selected

From Restaurant Search:
- Tap "Ask AI" in filter sheet
- Opens AI sheet with Discovery Agent
- Pre-fills: "Find [cuisine] in [location]"

From Empty State:
- "Get AI Help" button on empty itinerary
- Opens sheet with suggestions
- Walkthrough for first-time users

---

### PROMPT 2.4: ADD TAB NAVIGATION TO DETAIL PAGES

**Copy this prompt:**

I need to add tab-based navigation to all detail pages (Event, Restaurant, Rental, Destination) to reduce excessive scrolling and help users find information faster. Currently these pages require 5-10 screens of vertical scrolling on mobile.

**Problem:**
Detail pages have too much content in a single scroll:
- Users must scroll extensively to find specific info
- Important sections (Reviews, Menu, Location) are buried
- No quick way to jump to a section
- Users give up before seeing all content

**Solution:**
Implement sticky tab navigation that divides content into logical sections. Users can tap tabs to switch between Overview, Menu/Amenities, Reviews, and Location.

**Requirements:**

**Tab Structure:**

Common Tab Pattern for All Detail Pages:
1. Overview - Key info, description, highlights
2. Details - Menu (restaurant), Amenities (rental), Schedule (event)
3. Reviews - User ratings and reviews
4. Location - Map, directions, nearby info

**Wireframe - Detail Page with Tabs:**

```
┌────────────────────────────────────────┐
│ ┌────────────────────────────────────┐ │
│ │                                    │ │ <- Hero Image
│ │         Hero Image                 │ │    Carousel
│ │         240px height               │ │    Full-width
│ │                                    │ │
│ └────────────────────────────────────┘ │
│                                        │
│ Restaurant Name                    4.8│ <- Title & Rating
│ French • $$$$ • Midtown               │    Subtitle
│                                        │
├────────────────────────────────────────┤
│ Overview│ Menu │ Reviews│ Location   │ <- Tabs (sticky)
├────────────────────────────────────────┤ <- Active underline
│                                        │
│   [Tab content scrolls here]          │ <- Content Area
│   [Currently showing "Overview"]      │    Scrollable
│   [Description, hours, highlights]    │    Changes per tab
│   ...                                 │
│   ...                                 │
│                                        │
├────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ │
│ │         Reserve Table              │ │ <- Sticky CTA
│ └────────────────────────────────────┘ │    Fixed bottom
└────────────────────────────────────────┘
```

**Tab Navigation Specifications:**

Tab Bar:
- Height: 48px
- Position: Sticky (scrolls with page, then sticks)
- Background: White
- Border bottom: 1px light gray
- Z-index: 10 (above content, below header)

Individual Tab:
- Width: Auto (equal distribution)
- Height: 48px
- Text: 14px, medium weight
- Active tab: Primary blue color, bold
- Inactive tab: Gray color, normal weight
- Active indicator: 3px blue line below tab
- Tap area: Full height and width

Overflow Behavior:
- If 5+ tabs: Horizontal scroll
- Left/right fade indicators
- Swipe to see more tabs

**Content Organization by Page Type:**

**Restaurant Detail:**

Tab 1 - Overview:
- Description (2-3 paragraphs)
- Cuisine type, price range
- Hours of operation
- Phone number
- Special features (outdoor seating, reservations required)
- Top dishes (if available)

Tab 2 - Menu:
- Full menu by section (Appetizers, Mains, Desserts)
- Prices
- Dietary icons (vegetarian, gluten-free, etc.)
- Special menus (lunch, dinner, weekend brunch)
- Downloadable PDF option

Tab 3 - Reviews:
- Overall rating (stars)
- Rating breakdown (5★, 4★, etc.)
- Filters (Most recent, Highest rated, Photos only)
- Individual reviews (avatar, name, rating, text, photos)
- Pagination or infinite scroll

Tab 4 - Location:
- Interactive map (tap to full-screen)
- Address
- Directions button (opens Maps app)
- Nearby transit (subway, bus stops)
- Parking information
- Nearby attractions

**Event Detail:**

Tab 1 - Overview:
- Event description
- Date, time, duration
- Organizer information
- Event type/category
- Age restrictions
- What to bring

Tab 2 - Schedule:
- Lineup or agenda
- Performance times
- Speaker schedule
- Activity breakdown by time
- Special guests

Tab 3 - Reviews:
- Past attendee reviews (if recurring event)
- Ratings and comments
- Photos from past events
- Recommendations

Tab 4 - Location:
- Venue name and map
- Address and directions
- Parking and transit
- Accessibility information
- Nearby hotels (if multi-day event)

**Rental Detail:**

Tab 1 - Overview:
- Property description
- Property type and size
- Number of beds, baths, guests
- Quick highlights
- Host information
- Instant book badge

Tab 2 - Amenities:
- Full amenities list with icons
- Grouped by category (Essentials, Kitchen, Entertainment, Outdoor)
- Checkmarks for available
- Cross or gray for not available

Tab 3 - Reviews:
- Overall rating
- Cleanliness, accuracy, check-in, communication, location scores
- Individual guest reviews
- Host responses
- Photo reviews

Tab 4 - Location:
- Property on map
- Neighborhood information
- Nearby attractions (restaurants, shops, transit)
- Walkability score
- Safety information

**Interaction Behaviors:**

Switching Tabs:
- Tap tab to switch
- Content fades out (150ms)
- New content fades in (150ms)
- Scroll position resets to top
- URL updates (e.g., /restaurants/123?tab=menu)
- Active indicator slides to new tab (200ms)

Swipe Between Tabs:
- Swipe left: Next tab
- Swipe right: Previous tab
- Visual feedback: Content slides
- Animation: 250ms ease-out
- Wraparound: Last tab → First tab

Deep Linking:
- URL supports tab parameter
- Example: /restaurants/le-bernardin?tab=reviews
- Opens directly to that tab
- Useful for sharing specific sections

Scroll Behavior:
- Tabs start in flow (scroll with page)
- When scrolling down: Tabs stick to top
- When scrolling up: Tabs remain sticky
- Scroll to top: Tabs return to flow position

**Tab Content Loading:**

Lazy Loading:
- Only load active tab content initially
- Load other tabs when switched to
- Cache loaded content (don't reload)
- Show skeleton loader while fetching

Skeleton Loaders:
- Match content structure
- Overview: Text lines
- Menu: List items
- Reviews: Review cards
- Location: Map placeholder

**Accessibility:**

ARIA Roles:
- Tab bar: role="tablist"
- Individual tab: role="tab"
- Content area: role="tabpanel"

ARIA States:
- Active tab: aria-selected="true"
- Inactive tabs: aria-selected="false"
- Tab panel: aria-labelledby="[tab-id]"

Keyboard Navigation:
- Left/Right arrows: Navigate between tabs
- Enter/Space: Activate focused tab
- Tab key: Focus next tab
- Shift+Tab: Focus previous tab

Screen Reader:
- Announces tab name when focused
- Announces "selected" for active tab
- Announces tab X of Y
- Reads tab panel content

**Mobile-Specific Considerations:**

Touch Targets:
- Each tab minimum 48px height
- Minimum 64px width if possible
- 8px spacing between tab labels

Responsive Text:
- Mobile: Shorter labels ("Info" not "Information")
- Tablet/Desktop: Full labels
- Icons + text on larger screens

Tab Overflow:
- Mobile: 4 tabs maximum visible
- Use horizontal scroll for more
- Fade indicators on edges

**Performance:**

Tab Switching Speed:
- Instant feel (< 200ms)
- Content pre-loaded in background
- Smooth animations (60fps)

Content Optimization:
- Lazy load images in inactive tabs
- Virtualize long lists (reviews)
- Infinite scroll for reviews

**Visual Design:**

Active Tab Indicator:
- 3px thick blue line
- Positioned bottom of tab
- Animated slide between tabs
- Smooth easing

Tab Colors:
- Active: Primary blue (#3B82F6)
- Inactive: Gray (#6B7280)
- Background: White
- Divider: Light gray (#E5E7EB)

**Sticky Behavior:**

Initial State:
- Tabs flow with content (not sticky)
- Hero image and title above tabs

Scrolling Down:
- Tabs become sticky when reaching top of viewport
- Smooth transition (no jump)
- Tabs stay visible while scrolling

Scrolling Up:
- Tabs remain sticky
- Until scrolling back to original position
- Then return to flow

**Error States:**

Tab Content Error:
- Show error message in tab panel
- "Unable to load [Tab Name]"
- Retry button
- Don't break other tabs

Empty State:
- Show friendly message
- "No reviews yet. Be the first!"
- Relevant illustration or icon
- Call-to-action if applicable

**Success Metrics:**
- Reduce time to find information by 50%
- Increase engagement with reviews by 30%
- Reduce bounce rate on detail pages by 20%
- Improve user satisfaction scores

---

### PROMPT 2.5: CONVERT TRIP CARDS TO HORIZONTAL LAYOUT

**Copy this prompt:**

I need to redesign the trip cards in the Trips Hub from vertical cards to horizontal cards for better mobile optimization. The current vertical cards in a 2-column grid are too cramped on mobile.

**Current Problem:**
- 2-column grid on mobile makes cards small
- Image barely visible (80x80px or smaller)
- Text is cramped and hard to read
- Multiple lines of text truncated
- Action buttons are tiny
- Hard to distinguish between trips at a glance

**Solution:**
Convert to horizontal card layout in single-column list. Each card uses full width with image on left, content on right, creating better information hierarchy and readability.

**Requirements:**

**Card Dimensions:**
- Width: 100% minus 32px margins (16px each side)
- Height: 120px fixed (consistent list rhythm)
- Layout: Horizontal (left-to-right)
- Spacing: 12px between cards

**Card Structure - Left to Right:**

Section 1 - Image (Left):
- Width: 100px
- Height: 100px (inset 10px from top/bottom)
- Border radius: 8px
- Object fit: Cover
- Shows destination photo

Section 2 - Content (Center):
- Width: Remaining space minus 48px (for actions)
- Height: 100px
- Padding: 12px
- Vertical stack of info

Section 3 - Actions (Right):
- Width: 48px
- Height: 100px
- Contains: Menu button (3 dots)
- Tap: Opens bottom sheet with actions

**Wireframe - Horizontal Card:**

```
┌───────────────────────────────────────────────┐
│ ┌─────────┐                                   │
│ │         │  Trip to Paris                  ⋮ │  <- Card (120px height)
│ │  PARIS  │  Paris, France                    │     Full width
│ │  IMAGE  │  Mar 15-22, 2025                  │
│ │  100x   │  7 days • 12 items • $2,400      │
│ │  100px  │  ●●●●○ 80% planned               │
│ │         │                                   │
│ └─────────┘                                   │
└───────────────────────────────────────────────┘
    ^           ^                              ^
   Image     Content                        Actions
  (100px)   (flexible)                      (48px)
```

**Content Section Breakdown:**

Line 1 - Title (Truncate if needed):
- Font size: 16px
- Font weight: 600 (semibold)
- Color: Dark (#111827)
- Max lines: 1
- Text: "Trip to Paris" or custom name

Line 2 - Destination:
- Font size: 14px
- Font weight: 400 (normal)
- Color: Gray (#6B7280)
- Max lines: 1
- Text: "Paris, France"

Line 3 - Dates:
- Font size: 14px
- Font weight: 400
- Color: Gray (#6B7280)
- Max lines: 1
- Text: "Mar 15-22, 2025"

Line 4 - Quick Stats:
- Font size: 12px
- Font weight: 400
- Color: Gray (#6B7280)
- Max lines: 1
- Text: "7 days • 12 items • $2,400"
- Separated by bullets (•)

Line 5 - Progress Indicator:
- Shows planning completeness
- Visual: 5 dots (filled = planned, empty = not)
- Text: "80% planned"
- Color: Blue if > 50%, gray if < 50%

**Status Badge:**
- Position: Top-left of image
- Size: Auto-width x 24px height
- Background: Solid color
- Text: 10px, white, uppercase
- Options:
  - Planning (Gray)
  - Upcoming (Blue)
  - Active (Green)
  - Completed (Purple)

**Image Handling:**

No Image Available:
- Show gradient background
- Large destination initial (P for Paris)
- Or placeholder illustration
- Maintain consistent card size

Image Loading:
- Show gray skeleton while loading
- Fade in when loaded (200ms)
- Cache images for performance

**Interaction States:**

Default:
- White background
- Light border (1px #E5E7EB)
- Small shadow (0 1px 3px rgba)

Hover (Desktop):
- Border color changes to blue
- Shadow increases
- Slight scale up (1.02)

Active (Tap):
- Scale down slightly (0.98)
- Shadow decreases
- Quick animation (100ms)

**Swipe Actions (Mobile):**

Swipe Left (Delete):
- Card slides left revealing red background
- Trash icon appears
- Threshold: 80px
- Full swipe: Deletes (with confirmation)
- Partial swipe: Springs back

Swipe Right (Edit):
- Card slides right revealing blue background
- Edit icon appears
- Threshold: 80px
- Full swipe: Opens edit sheet
- Partial swipe: Springs back

**Wireframe - Swipe States:**

```
Swipe Left to Delete:
┌─────────────────────────────────────────────┐
│ ← [Card sliding left]          🗑️ Delete   │ Red bg
└─────────────────────────────────────────────┘

Swipe Right to Edit:
┌─────────────────────────────────────────────┐
│ ✏️ Edit           [Card sliding right] →    │ Blue bg
└─────────────────────────────────────────────┘
```

**Menu Actions (3 Dots):**

Bottom Sheet Contents:
- View Trip Details
- View Itinerary
- Edit Trip
- Share Trip
- Duplicate Trip
- Delete Trip

Each action:
- Height: 56px
- Icon on left
- Label in center
- Tap full width to activate

**Empty State:**

When No Trips:
- Show illustration (travel-themed)
- Heading: "No trips yet"
- Subtext: "Create your first trip to get started"
- Primary button: "Create Your First Trip"
- Secondary button: "Browse Destinations"

**Loading State:**

Skeleton Cards:
- Same dimensions as real cards
- Animated pulse effect
- Gray rectangles for content
- 3-5 skeleton cards shown
- Replaced with real cards when loaded

**Responsive Behavior:**

Mobile (320-767px):
- Single column
- Horizontal cards as described
- Swipe gestures enabled

Tablet (768-1023px):
- Still single column OR 2 columns if width allows
- Horizontal cards remain
- Larger images (120px instead of 100px)

Desktop (1024px+):
- Consider keeping vertical cards in grid
- Or use larger horizontal cards
- More space for content

**Accessibility:**

Card Structure:
- Card is single tappable element
- Tap anywhere on card: Opens trip
- Tap menu button: Opens actions
- Clear focus indicator

ARIA Labels:
- Card: "Trip to Paris, 7 days, starting March 15th, 80% planned"
- Menu: "More actions for Paris trip"
- Swipe hint: "Swipe left to delete, swipe right to edit"

Screen Reader:
- Reads all card info when focused
- Announces swipe actions available
- Announces menu options

Keyboard Navigation (Desktop):
- Tab focuses each card
- Enter opens trip
- Space shows menu
- Arrow keys navigate list

**Performance:**

Virtual Scrolling:
- If 50+ trips: Use virtual list
- Only render visible cards + buffer
- Smooth 60fps scrolling

Image Optimization:
- Compress images (max 100px width needed)
- Use WebP with JPEG fallback
- Lazy load images below fold

List Optimization:
- Memoize card components
- Avoid re-renders on scroll
- Debounce scroll events

**Success Metrics:**
- Increase card readability by 40% (user testing)
- Reduce tap errors by 30%
- Increase engagement with trips by 25%
- Improve overall user satisfaction

---

## PHASE 3: FUTURE ENHANCEMENTS (MONTHS 2-3)

### PROMPT 3.1: ADD ADVANCED GESTURE SHORTCUTS

(Copy this prompt when ready for Phase 3)

I need to add advanced gesture shortcuts throughout the app to make common actions faster for power users. This includes swipe-back navigation, pinch-to-zoom on images, pull-down-to-refresh globally, and long-press shortcuts.

(Details would continue...)

### PROMPT 3.2: IMPLEMENT CONSISTENT HAPTIC FEEDBACK

(Copy this prompt when ready for Phase 3)

I need to add haptic feedback throughout the app to provide tactile confirmation of user actions. This should feel native and responsive like iOS/Android system apps.

(Details would continue...)

### PROMPT 3.3: ADD VOICE INPUT TO CHATBOT

(Copy this prompt when ready for Phase 3)

I need to add voice input capability to the AI chatbot, allowing users to speak their questions instead of typing. This is especially useful when planning trips on-the-go.

(Details would continue...)

### PROMPT 3.4: IMPLEMENT OFFLINE MODE

(Copy this prompt when ready for Phase 3)

I need to implement offline mode with local storage and sync capabilities, allowing users to view and edit trips without internet connection.

(Details would continue...)

### PROMPT 3.5: ADD DARK MODE THEME

(Copy this prompt when ready for Phase 3)

I need to implement a complete dark mode theme that can be toggled by users or automatically activated based on system preferences.

(Details would continue...)

---

## WIREFRAME LIBRARY

### Standard Component Wireframes

**Button (Primary):**
```
┌────────────────────────┐
│     Button Label       │  48px height
└────────────────────────┘  Full width or auto
```

**Button (Secondary):**
```
╔════════════════════════╗
║     Button Label       ║  44px height
╚════════════════════════╝  Outlined
```

**Input Field:**
```
┌────────────────────────┐
│ Label                  │
│ ┌────────────────────┐ │
│ │ Placeholder text   │ │  48px height
│ └────────────────────┘ │
└────────────────────────┘
```

**Card (Vertical):**
```
┌────────────────────────┐
│ ╔════════════════════╗ │
│ ║                    ║ │
│ ║  Image 16:9        ║ │  160px
│ ║                    ║ │
│ ╚════════════════════╝ │
│                        │
│ Card Title             │  Title
│ Subtitle text here     │  Subtitle
│ Metadata info          │  Meta
│                        │
│ ┌──────────────────┐  │
│ │  Action Button   │  │  CTA
│ └──────────────────┘  │
└────────────────────────┘
```

**Card (Horizontal):**
```
┌─────────────────────────────────┐
│ ┌────┐ Card Title          $99 │  100-120px
│ │IMG │ Subtitle text here      │  height
│ │100 │ Meta • More Meta        │
│ └────┘                        ⋮ │
└─────────────────────────────────┘
```

**Bottom Sheet:**
```
┌─────────────────────────────────┐
│ [Main content dimmed]           │
│                                 │
├─────────────────────────────────┤
│         ─── Handle              │  32px
│ Sheet Title           Close  ✕  │  56px
├─────────────────────────────────┤
│                                 │
│  [Scrollable content]           │  Variable
│  ...                            │
│                                 │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │     Primary Action          │ │  64px
│ └─────────────────────────────┘ │  sticky
└─────────────────────────────────┘
```

**Tab Navigation:**
```
┌─────────────────────────────────┐
│ Tab 1  │ Tab 2 │ Tab 3  │ Tab 4 │  48px
├─────────────────────────────────┤  height
│━━━━━━━━━                        │  Active
│                                 │  indicator
│ [Tab content scrollable]        │  Variable
│ ...                             │  content
│                                 │
└─────────────────────────────────┘
```

---

## IMPLEMENTATION CHECKLIST

Use this checklist when implementing each prompt:

**Before Starting:**
- [ ] Read entire prompt thoroughly
- [ ] Understand wireframes and specifications
- [ ] Review related components
- [ ] Check design tokens and variables
- [ ] Plan component structure

**During Implementation:**
- [ ] Follow mobile-first approach
- [ ] Use provided dimensions exactly
- [ ] Implement all interaction states
- [ ] Add accessibility features
- [ ] Test touch targets (44px minimum)
- [ ] Optimize performance
- [ ] Add loading states
- [ ] Add error states

**Testing:**
- [ ] Test on actual mobile device
- [ ] Test on iOS and Android
- [ ] Test portrait and landscape
- [ ] Test with different content lengths
- [ ] Test keyboard interactions
- [ ] Test with screen reader
- [ ] Test performance (60fps)
- [ ] Test edge cases

**Before Completion:**
- [ ] Code review
- [ ] Documentation updated
- [ ] Design tokens used consistently
- [ ] Accessibility audit passed
- [ ] Performance benchmarks met
- [ ] User testing conducted
- [ ] Stakeholder approval received

---

## SUCCESS CRITERIA

**Quantitative Metrics:**
- 95%+ tap accuracy (up from 88%)
- 85%+ wizard completion (up from 65%)
- 60 FPS scrolling throughout
- < 100ms touch response time
- < 1.5s page load time

**Qualitative Metrics:**
- Feels native (like iOS/Android apps)
- One-handed operation easy
- Clear information hierarchy
- Minimal scrolling required
- Delightful interactions

**User Feedback:**
- "Easier to use than before"
- "Feels like a real app"
- "Fast and responsive"
- "Easy to find what I need"
- "Love the new design"

---

**NEXT STEPS:**
1. Review all prompts with team
2. Prioritize implementation order
3. Assign prompts to developers
4. Set sprint goals (Quick Wins first)
5. Begin implementation
6. Test and iterate
7. Launch mobile-optimized experience

---

**Document Status:** Complete Implementation Guide ✅  
**Total Prompts:** 10 detailed prompts  
**Wireframes:** 15+ component wireframes  
**Ready for:** Immediate development start
