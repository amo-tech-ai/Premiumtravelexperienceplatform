# 3-Panel System Implementation Guide
## Multi-Step Prompts for /explore Page

---

## Overview

This document provides step-by-step prompts to recreate the 3-panel discovery system for the "I Love Medellín" platform. The system consists of:
- **Left Panel:** Navigation sidebar
- **Center Panel:** Browse & search results
- **Right Panel:** Detail view (slides in when item is clicked)

Reference images show the target design and interaction patterns.

---

## Phase 1: Base Layout Structure

### Prompt 1.1 - Create 3-Panel Container Component

```
Create a new component /components/explore/ThreePanelLayout.tsx that implements the base 3-panel structure:

Requirements:
- Use CSS Grid or Flexbox for layout
- Left panel: Fixed width 280px (collapsible on mobile)
- Center panel: Flexible width, takes remaining space
- Right panel: Fixed width 500px, hidden by default, slides in from right when open
- Add state management for rightPanelOpen and selectedItem
- Smooth transitions when panels open/close (300ms cubic-bezier)
- Z-index layering: left (10), center (5), right (20)
- Backdrop overlay when right panel is open on mobile/tablet

Export: ThreePanelLayout, useThreePanelContext
```

### Prompt 1.2 - Create Context Provider

```
Create /context/ThreePanelContext.tsx to manage shared state:

State to track:
- selectedItem: Item | null
- rightPanelOpen: boolean
- leftPanelCollapsed: boolean (for mobile)
- filters: FilterState
- searchQuery: string
- viewMode: 'grid' | 'list' | 'map'

Methods:
- openDetailPanel(item: Item)
- closeDetailPanel()
- toggleLeftPanel()
- setFilters(filters: FilterState)
- setSearchQuery(query: string)
- setViewMode(mode: ViewMode)

Include URL synchronization (update query params when item is selected)
```

---

## Phase 2: Left Panel - Navigation

### Prompt 2.1 - Navigation Sidebar

```
Create /components/explore/LeftPanel.tsx:

Structure:
1. Header with logo and location selector
   - "I Love Medellín" or "Concierge" branding
   - Location dropdown showing "El Poblado" with green status dot
   - Filters/settings icon (top-right)

2. Main navigation menu:
   - Home (house icon)
   - Chats (message icon, show badge "2" if unread)
   - Trips (calendar icon)
   - Explore (compass icon, ACTIVE state)
   - Events (ticket icon)
   - Saved (heart icon)
   - Concierge (sparkles icon)

3. Footer section:
   - "Create" button with plus icon
   - User profile (avatar, name, "Premium Member" badge)
   - Logout icon

Styling:
- Background: white or light gray
- Active item: emerald-500 accent with subtle background
- Icons from lucide-react
- Smooth hover states
- Border-right: 1px solid slate-200

Responsive:
- Desktop: Always visible (280px)
- Mobile: Slide in from left, overlay with backdrop
```

### Prompt 2.2 - Location Selector Component

```
Create /components/explore/LocationSelector.tsx:

Features:
- Dropdown showing current location "El Poblado"
- Green status dot indicating "available" or "active"
- Click to open modal/dropdown with:
  - Search for neighborhoods
  - Popular locations list
  - Current location detection
  - Recent searches

Use shadcn/ui DropdownMenu or custom modal
Icon: MapPin from lucide-react
```

---

## Phase 3: Center Panel - Browse & Search

### Prompt 3.1 - Center Panel Container

```
Create /components/explore/CenterPanel.tsx:

Layout structure:
1. Search header (sticky)
   - Search input: "Search places, vibes, or cravings..."
   - Search icon (left), Clear icon (right when typing)
   
2. Category filter tabs (sticky below search)
   - Horizontal scroll on mobile
   - Tabs: All, Restaurants, Things to Do, Stays, Coffee, Nightlife
   - Active tab: emerald-500 underline
   - Pill-style badges

3. Context card (optional, AI-generated)
   - Weather/time-based suggestions
   - Example: "Thursday Afternoon in Poblado - It's currently 24°C. Perfect for a walking tour or a rooftop coffee."
   - Sparkles icon, light emerald background
   - Dismissible

4. Content sections
   - Section headers: "Restaurants", "Things to Do", etc.
   - "See more" link (right-aligned)
   - Grid of item cards (2 columns on mobile, 3-4 on desktop)

5. Scroll container
   - Smooth scroll behavior
   - Infinite scroll or pagination
   - Loading states

Styling:
- Background: light gray (slate-50)
- Padding: 24px
- Sticky header with backdrop blur
```

### Prompt 3.2 - Search Bar Component

```
Create /components/explore/SearchBar.tsx:

Features:
- Debounced search (300ms delay)
- Search icon (left side)
- Clear button (right side, appears when typing)
- Placeholder: "Search places, vibes, or cravings..."
- Auto-focus on "/" keyboard shortcut
- Recent searches dropdown (appears when focused)
- Loading spinner when searching

Styling:
- Rounded-full border
- Background: white
- Border: slate-200
- Focus: emerald-500 ring
- Height: 48px
- Shadow: subtle on focus

Props:
- value: string
- onChange: (value: string) => void
- onSearch: (query: string) => void
```

### Prompt 3.3 - Category Filter Tabs

```
Create /components/explore/CategoryTabs.tsx:

Categories:
- All (default)
- Restaurants (Utensils icon)
- Things to Do (Map icon)
- Stays (Bed icon)
- Coffee (Coffee icon)
- Nightlife (Music icon)

Features:
- Horizontal scrollable on mobile
- Active state: emerald-500 background, white text
- Inactive state: transparent background, slate-600 text
- Smooth transitions
- Badge count (optional) showing number of items

Styling:
- Pill-shaped buttons
- Padding: 8px 16px
- Gap: 8px between tabs
- Sticky below search bar
- Background: white with subtle shadow

Props:
- activeCategory: string
- onCategoryChange: (category: string) => void
- categories: Category[]
```

### Prompt 3.4 - Browse Item Card

```
Create /components/explore/BrowseItemCard.tsx:

Card structure:
1. Hero image
   - Aspect ratio: 4:3
   - Rounded corners (top)
   - Lazy loading
   - Hover: slight zoom (scale 1.05)
   - Category badge overlay (top-left): "RESTAURANTS"

2. Content section
   - Title: Restaurant/place name (font-bold, text-lg)
   - Rating: Star icon + number (4.9) + review count "(1540)"
   - Price level: $$$$ (slate-400)
   - Distance: 0.2 mi (slate-500, small)
   - AI Summary: Sparkle icon + "Must-visit for molecular gastronomy lovers."
     - Light emerald background, emerald-700 text
     - Truncate to 1 line with ellipsis

3. Footer (optional)
   - Quick actions: Save (heart), Share, Add to trip

Interaction:
- Click anywhere on card → opens right panel with details
- Hover: subtle shadow elevation
- Save button: toggle saved state (filled heart)

Styling:
- Background: white
- Border: 1px slate-200
- Rounded: 16px
- Padding: 0 (image full-width), 16px (content)
- Shadow: sm default, md on hover
- Transition: all 300ms

Props:
- item: BrowseItem
- onClick: () => void
- onSave: () => void
```

### Prompt 3.5 - Context Card (AI Suggestion)

```
Create /components/explore/ContextCard.tsx:

Features:
- AI-generated contextual suggestion based on:
  - Time of day
  - Weather
  - User preferences
  - Location

Example content:
- Icon: Sparkles or weather icon
- Title: "Thursday Afternoon in Poblado"
- Message: "It's currently 24°C. Perfect for a walking tour or a rooftop coffee. Here are some spots near you."

Styling:
- Background: emerald-50
- Border: emerald-200
- Rounded: 12px
- Padding: 16px
- Icon: emerald-600
- Text: emerald-900
- Dismissible with X button (top-right)

Props:
- title: string
- message: string
- icon?: ReactNode
- onDismiss?: () => void
```

---

## Phase 4: Right Panel - Detail View

### Prompt 4.1 - Right Panel Container

```
Create /components/explore/RightPanel.tsx:

Layout:
- Fixed position: right side of screen
- Width: 500px (desktop), 100vw (mobile)
- Height: 100vh
- Transform: translateX(100%) when closed, translateX(0) when open
- Transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1)
- Background: white
- Shadow: -4px 0 24px rgba(0,0,0,0.1)
- Z-index: 20

Mobile behavior:
- Full-screen overlay
- Backdrop blur
- Close on backdrop click or ESC key

Scroll:
- Overflow-y: auto
- Scroll behavior: smooth
- Preserve scroll position when switching items

Props:
- isOpen: boolean
- onClose: () => void
- children: ReactNode
```

### Prompt 4.2 - Detail Hero Section

```
Create /components/explore/DetailHero.tsx:

Structure:
1. Hero image
   - Full-width, height: 250px
   - Object-fit: cover
   - Overlay gradient (bottom): black to transparent
   
2. Overlaid content (bottom-left of image):
   - Category badge: "Restaurants" (emerald background, white text)
   - Title: "El Cielo Restaurant" (white, text-3xl, font-bold)
   - Rating: ⭐ 4.9 (1540) (white)
   - Price: $$$$ (amber-400)

3. Header actions (top-right, above image):
   - Close button (X icon, white, hover: bg-black/20)
   - Positioned absolute

Styling:
- No border-radius (sits at top of panel)
- Text shadow for readability on image
- Smooth fade-in animation

Props:
- imageUrl: string
- category: string
- title: string
- rating: number
- reviewCount: number
- priceLevel: number
- onClose: () => void
```

### Prompt 4.3 - Action Bar

```
Create /components/explore/DetailActionBar.tsx:

Buttons:
1. Primary CTA: "Add to Trip"
   - Full-width button
   - Background: slate-900
   - Text: white
   - Icon: Plus
   - Hover: slate-800
   - Click: Open trip selector modal

2. Secondary actions (horizontal row):
   - Save to collection (heart icon)
   - Share (share icon)
   - View on map (map pin icon)

Layout:
- Sticky at top of scrollable content (below hero)
- Background: white
- Padding: 16px
- Border-bottom: 1px slate-200
- Shadow: subtle when scrolled

State:
- "Add to Trip" changes to "Added ✓" when clicked
- Save button toggles between outline and filled heart

Props:
- onAddToTrip: () => void
- onSave: () => void
- onShare: () => void
- isSaved: boolean
```

### Prompt 4.4 - "Why You'll Love It" Section

```
Create /components/explore/WhyYoullLoveIt.tsx:

Features:
- AI-generated personalized pitch (1-2 sentences)
- Highlighted box with sparkle icon
- Example: "Must-visit for molecular gastronomy lovers. This spot perfectly matches your preference for fine dining."

Styling:
- Background: emerald-50
- Border: emerald-200 (1px)
- Border-left: 4px solid emerald-500
- Padding: 16px
- Rounded: 8px
- Icon: Sparkles (emerald-600)
- Text: emerald-900

Layout:
- Icon left, text right
- Gap: 12px
- Margin: 16px (horizontal), 8px (top)

Props:
- message: string
- reasoning?: string (tooltip on hover)
```

### Prompt 4.5 - Quick Info Cards

```
Create /components/explore/QuickInfoCards.tsx:

Display 2-3 info cards in a grid:

1. Open Hours
   - Icon: Clock
   - Label: "OPEN NOW" (emerald-600) or "CLOSED" (red-600)
   - Details: "Until 11:00 PM"

2. Distance
   - Icon: MapPin
   - Label: "DISTANCE"
   - Details: "0.2 mi away"

3. Price (optional)
   - Icon: DollarSign
   - Label: "PRICE LEVEL"
   - Details: "$$$$" (Upscale)

Styling:
- Grid: 2 columns on mobile, 3 on desktop
- Background: slate-50
- Border: slate-200
- Rounded: 8px
- Padding: 12px
- Icon: slate-500
- Label: text-xs, uppercase, slate-500
- Details: text-sm, font-medium, slate-900

Props:
- hours: { status: string; until: string }
- distance: string
- priceLevel?: number
```

### Prompt 4.6 - About Section

```
Create /components/explore/AboutSection.tsx:

Content:
- Section title: "About" (text-lg, font-bold)
- Description: 2-3 paragraphs of text
- Key highlights as bullet points (optional)
- Cuisine type, amenities, etc.

Features:
- Expandable: Show 3 lines initially, "Read more" to expand
- Collapse: "Show less" when expanded

Styling:
- Padding: 16px
- Line-height: relaxed
- Text: slate-700

Props:
- title?: string
- description: string
- highlights?: string[]
```

### Prompt 4.7 - Location Section

```
Create /components/explore/LocationSection.tsx:

Components:
1. Section title: "Location"
2. Address text: Full address
3. Neighborhood badge: "El Poblado"
4. Embedded map (Google Maps iframe or Mapbox)
   - Width: 100%
   - Height: 200px
   - Rounded: 8px
   - Show pin at location
5. "View on Google Maps" link button

Styling:
- Padding: 16px
- Map: border slate-200, rounded-lg
- Link: emerald-600, underline on hover

Props:
- address: string
- neighborhood: string
- coordinates: { lat: number; lng: number }
```

### Prompt 4.8 - Photos Gallery

```
Create /components/explore/PhotosGallery.tsx:

Layout:
- Horizontal scroll of 2-3 photos
- Each photo: aspect ratio 16:9, rounded corners
- Click to open full-screen lightbox

Features:
- Smooth scroll snap
- Lazy loading
- Loading skeleton
- Photo count indicator: "1 / 5"

Styling:
- Gap: 8px
- Padding: 16px
- Scroll-behavior: smooth
- Overflow-x: auto, hide scrollbar

Props:
- photos: string[]
- onPhotoClick: (index: number) => void
```

### Prompt 4.9 - Reviews Section (Optional)

```
Create /components/explore/ReviewsSection.tsx:

Content:
- AI-summarized reviews (pros/cons)
- Top 2-3 reviews with:
  - User avatar
  - User name
  - Rating (stars)
  - Review text (truncated)
  - Date

Features:
- "Read all reviews" link at bottom
- Expandable review text

Styling:
- Padding: 16px
- Review cards: slate-50 background
- Avatar: 40px circle
- Rating: amber-400 stars

Props:
- summary?: { pros: string[]; cons: string[] }
- topReviews: Review[]
- totalReviews: number
```

---

## Phase 5: Interactions & Animations

### Prompt 5.1 - Slide-In Animation

```
Implement slide-in animation for right panel using motion/react:

Animation specs:
- Initial: { x: '100%', opacity: 0 }
- Animate: { x: 0, opacity: 1 }
- Exit: { x: '100%', opacity: 0 }
- Transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }

Also animate:
- Center panel width adjustment (when right panel opens)
- Backdrop fade-in (mobile/tablet only)
- Content stagger (each section fades in sequentially)

Add AnimatePresence wrapper for exit animations
```

### Prompt 5.2 - Keyboard Navigation

```
Implement keyboard shortcuts and navigation:

Shortcuts:
- ESC: Close right panel
- Arrow Left/Right: Navigate to previous/next item (when panel is open)
- /: Focus search bar
- Tab: Proper focus management within right panel

Focus trap:
- When right panel opens, trap focus within panel
- First focus: Close button or "Add to Trip" button
- When panel closes, return focus to clicked item in center panel

Accessibility:
- ARIA labels on all buttons
- Announce panel state changes to screen readers
- Visible focus indicators
```

### Prompt 5.3 - URL Synchronization

```
Implement URL state management:

URL patterns:
- No item selected: /explore
- Category filter: /explore?category=restaurants
- Item selected: /explore?category=restaurants&detail=el-cielo-restaurant
- Search: /explore?q=rooftop

Features:
- Update URL when:
  - Item is selected (add detail param)
  - Panel is closed (remove detail param)
  - Category changes
  - Search query changes

- Browser back/forward:
  - Back button closes panel
  - Forward button re-opens panel
  - Preserve scroll position

Use useSearchParams from react-router
```

### Prompt 5.4 - Loading States

```
Add loading states throughout the UI:

Components to add loading:
1. Center panel items
   - Skeleton cards (shimmer effect)
   - 6-8 skeleton cards while loading
   
2. Right panel content
   - Hero image: blur placeholder
   - Content sections: skeleton lines
   
3. Search results
   - Inline spinner in search bar
   - "Loading..." text below search

4. Infinite scroll
   - Spinner at bottom of center panel
   - "Load more" button as fallback

Use:
- Skeleton components from shadcn/ui
- Suspense boundaries where appropriate
- Loading spinner from lucide-react
```

### Prompt 5.5 - Error States

```
Add error handling and states:

Error scenarios:
1. Failed to load items
   - Show error message in center panel
   - "Something went wrong" illustration
   - "Try again" button

2. Failed to load item details
   - Show error in right panel
   - Auto-close panel after 3s
   - Toast notification

3. Network offline
   - Show offline banner at top
   - Disable search/filters
   - Show cached results if available

4. Empty states
   - No results for search: "No places found for 'query'"
   - No items in category: "No restaurants available"
   - Saved is empty: "No saved places yet"

Use AlertCircle icon from lucide-react
```

---

## Phase 6: Responsive Behavior

### Prompt 6.1 - Mobile Layout

```
Implement mobile-specific behavior for screens < 768px:

Changes:
1. Left panel
   - Hidden by default
   - Hamburger menu button (top-left)
   - Slide in from left as overlay
   - Backdrop blur when open

2. Center panel
   - Full-width
   - Larger touch targets (min 44px)
   - Single column grid
   - Sticky search + filters at top

3. Right panel
   - Full-screen modal (not side-by-side)
   - Slide up from bottom (not from right)
   - Own header with back button
   - Close with swipe-down gesture

4. Search
   - Full-width, larger height (56px)
   - Focus opens search overlay

Gestures:
- Swipe right: Open left panel
- Swipe left: Close left panel
- Swipe down on right panel: Close detail view
```

### Prompt 6.2 - Tablet Layout

```
Implement tablet-specific behavior for screens 768px - 1023px:

Changes:
1. Left panel
   - Collapsible, icon-only mode (60px width)
   - Expand on hover
   - Toggle button in header

2. Center panel
   - 2-column grid
   - Flexible width

3. Right panel
   - Overlay center panel (not side-by-side)
   - Width: 400px
   - Backdrop with blur
   - Click backdrop to close

Keep:
- Same component structure
- Slide-in animations
- All functionality
```

### Prompt 6.3 - Desktop Layout

```
Implement desktop-specific behavior for screens >= 1024px:

Layout:
1. Left panel: Fixed 280px, always visible
2. Center panel: Flexible width (calc(100% - 780px) when right panel open)
3. Right panel: Fixed 500px, slides in from right

Optimizations:
- Hover preview: Show mini-preview tooltip on card hover (optional)
- Keyboard shortcuts: Display shortcut hints
- Multi-column grid: 3-4 columns for items
- Larger images and text
- More content visible per screen

Advanced features:
- Compare mode: Open 2 items side-by-side (optional)
- Quick add: Drag item to "Add to trip" in sidebar
```

---

## Phase 7: Data & Integration

### Prompt 7.1 - Mock Data Structure

```
Create /data/exploreMockData.ts with sample data:

Types:
- BrowseItem (restaurant, attraction, stay, etc.)
- Category
- Filter options
- Review
- Photo

Sample items:
- El Cielo Restaurant (molecular gastronomy)
- Carmen (cocktail bar)
- Parque Lleras (nightlife area)
- Poblado Plaza (shopping)
- Coffee shops, hotels, etc.

Include at least 20-30 items across all categories

Add helper functions:
- filterItems(items, filters)
- searchItems(items, query)
- sortItems(items, sortBy)
- getItemById(id)
```

### Prompt 7.2 - Filters Implementation

```
Create /components/explore/FilterPanel.tsx:

Filter categories:
1. Price level ($, $$, $$$, $$$$)
2. Rating (4+, 4.5+, etc.)
3. Distance (< 0.5 mi, < 1 mi, < 2 mi)
4. Open now (toggle)
5. Cuisine type (for restaurants)
6. Amenities (WiFi, Parking, Outdoor seating)

UI:
- Slide-in drawer (mobile) or popover (desktop)
- Checkboxes for multi-select
- Radio buttons for single-select
- Range slider for distance
- "Apply filters" button
- "Clear all" link
- Show active filter count badge

Props:
- filters: FilterState
- onFiltersChange: (filters: FilterState) => void
- categories: FilterCategory[]
```

### Prompt 7.3 - Search Implementation

```
Implement search functionality:

Features:
- Fuzzy search across:
  - Name
  - Description
  - Tags/categories
  - Neighborhood
  - Cuisine type
  
- Recent searches (localStorage)
- Popular searches
- Search suggestions (autocomplete)
- AI-powered "vibe" search
  - Example: "romantic dinner" → shows fine dining
  - Example: "chill coffee spot" → shows casual cafes

Display:
- Dropdown with sections:
  - Recent searches
  - Suggestions (as you type)
  - Popular searches

Libraries:
- Fuse.js for fuzzy search (or custom implementation)
- Debounce hook for performance
```

---

## Phase 8: Polish & Accessibility

### Prompt 8.1 - Accessibility Audit

```
Ensure WCAG 2.1 AA compliance:

Checklist:
□ All interactive elements keyboard accessible
□ Focus visible on all elements
□ Color contrast meets 4.5:1 minimum
□ ARIA labels on icon buttons
□ Semantic HTML (nav, main, aside, article)
□ Screen reader announcements for state changes
□ Skip links for keyboard users
□ Focus trap in modals/panels
□ Alt text on all images
□ Form inputs have labels
□ Error messages announced to SR

Test with:
- Keyboard only (no mouse)
- VoiceOver (Mac) or NVDA (Windows)
- axe DevTools
```

### Prompt 8.2 - Performance Optimization

```
Optimize performance:

Techniques:
1. Lazy load images
   - Use intersection observer
   - Blur placeholder while loading
   - Responsive images (srcset)

2. Virtual scrolling
   - For long lists (100+ items)
   - Use react-window or custom implementation

3. Debounce/throttle
   - Search input: 300ms debounce
   - Scroll events: throttle
   - Window resize: debounce

4. Code splitting
   - Lazy load right panel content
   - Lazy load map component
   - Lazy load image lightbox

5. Memoization
   - useMemo for filtered/sorted lists
   - React.memo for cards
   - useCallback for event handlers

6. Preload
   - Preload next/previous items
   - Prefetch on hover (optional)

Target:
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Smooth 60fps animations
```

### Prompt 8.3 - Final Polish

```
Add final polish details:

Micro-interactions:
- Card hover: slight lift + shadow
- Button hover: subtle scale (0.98)
- Loading: smooth skeleton shimmer
- Success: checkmark animation
- Error: shake animation

Visual details:
- Consistent spacing scale (4px, 8px, 12px, 16px, 24px, 32px)
- Consistent border-radius (4px, 8px, 12px, 16px)
- Consistent shadow scale (sm, md, lg, xl)
- Smooth color transitions

Empty states:
- Beautiful illustrations (use unsplash or custom SVG)
- Helpful empty state messages
- Clear call-to-action

Tooltips:
- Add tooltips on icon buttons
- Keyboard shortcut hints
- Feature explanations

Toast notifications:
- "Saved to favorites"
- "Added to trip"
- "Link copied"
- Use sonner library
```

---

## Phase 9: Testing & Verification

### Prompt 9.1 - Manual Testing Checklist

```
Test all user flows:

□ Open /explore page
□ Browse items in center panel
□ Click item → right panel opens
□ Verify URL updates with item ID
□ Close panel with X button
□ Close panel with ESC key
□ Close panel with backdrop click (mobile)
□ Navigate with arrow keys between items
□ Add item to trip
□ Save item to favorites
□ Share item
□ Search for "rooftop" → see filtered results
□ Change category filter → see filtered results
□ Apply multiple filters → see combined results
□ Clear filters → see all results
□ Toggle left panel (mobile)
□ Test on mobile (< 768px)
□ Test on tablet (768-1023px)
□ Test on desktop (> 1024px)
□ Test keyboard navigation
□ Test with screen reader
□ Test loading states
□ Test error states
□ Test empty states
```

### Prompt 9.2 - Edge Cases

```
Test edge cases and scenarios:

□ No items in category
□ Network failure during load
□ Slow 3G connection
□ Item has no images
□ Item has no reviews
□ Very long item name (truncation)
□ Very long description (read more)
□ 1000+ items (performance)
□ Deep link to item (URL with detail ID)
□ Browser back/forward
□ Refresh page with panel open
□ Multiple rapid clicks on items
□ Resize window while panel open
□ Offline mode
□ Item deleted while panel open
```

---

## Summary

This multi-step guide will create a production-ready 3-panel discovery system for "I Love Medellín". Follow the prompts in sequence, testing each phase before moving to the next.

**Estimated timeline:**
- Phase 1-2: 4-6 hours (base structure + left panel)
- Phase 3: 6-8 hours (center panel + browse cards)
- Phase 4: 6-8 hours (right panel detail view)
- Phase 5: 4-6 hours (interactions + animations)
- Phase 6: 4-6 hours (responsive behavior)
- Phase 7: 3-4 hours (data + integration)
- Phase 8: 3-4 hours (polish + accessibility)
- Phase 9: 2-3 hours (testing)

**Total: ~35-45 hours** for complete implementation

---

## Quick Start (Condensed Version)

If you want to implement this in fewer steps, use this condensed prompt:

```
Recreate the 3-panel discovery system for /explore page based on the reference images:

LEFT PANEL (280px fixed):
- Navigation sidebar with logo, location selector, menu items (Home, Chats, Trips, Explore, Events, Saved, Concierge), Create button, user profile
- Collapsible on mobile (hamburger menu)

CENTER PANEL (flexible width):
- Search bar: "Search places, vibes, or cravings..."
- Category tabs: All, Restaurants, Things to Do, Stays, Coffee, Nightlife
- Context card with AI suggestion based on time/weather
- Grid of browse cards (2-4 columns responsive)
- Each card: image, category badge, title, rating, price, distance, AI summary
- Click card → open right panel

RIGHT PANEL (500px, slides in from right):
- Hero image with overlaid title, rating, category badge, close button
- Action bar: "Add to Trip" button, Save, Share icons
- "Why You'll Love It" AI summary (emerald highlight box)
- Quick info cards: Open hours, Distance
- About section
- Location with embedded map
- Photos gallery
- Reviews (optional)

INTERACTIONS:
- Click item → right panel slides in (300ms animation), URL updates
- Close with X, ESC, or backdrop click
- Arrow keys navigate between items
- Mobile: right panel is full-screen modal
- Tablet: right panel overlays center with backdrop
- Desktop: all 3 panels visible side-by-side

Use existing ILM design system: emerald accents, slate base, luxury aesthetic, smooth animations.
```

---

## Reference Files

Use these existing components/patterns:
- `/components/ui/LuxuryCard.tsx` - for browse cards
- `/components/layout/AppShell.tsx` - for layout structure
- `/styles/globals.css` - for design tokens
- `/pages/restaurants/RestaurantDetailPage.tsx` - for detail view reference
- `/components/explore/` - create this new directory

Design system colors:
- Primary accent: emerald-500
- Secondary accent: amber-400
- Base: slate-50, slate-900
- Success: emerald
- Warning: amber
- Info: sky
- Error: red

---

**Ready to build!** Start with Phase 1 and work through each prompt systematically. 🚀
