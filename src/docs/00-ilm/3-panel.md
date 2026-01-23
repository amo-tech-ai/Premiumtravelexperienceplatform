# 3-Panel System Architecture

## Overview

The "I Love Medellín" platform uses a **3-panel layout system** for browsing and discovering content. This master-detail pattern provides an intuitive, spatial way to explore restaurants, stays, events, and experiences.

---

## Panel Structure

### **Left Panel** - Navigation & Filters
- **Purpose:** Primary navigation and filtering
- **Width:** ~280px (fixed or collapsible)
- **Content:**
  - Main navigation menu
  - Category filters (Restaurants, Stays, Events, Experiences)
  - Search input
  - Advanced filters (price, rating, distance, cuisine type, etc.)
  - Saved items / favorites
  - User profile access

**State:**
- Always visible on desktop
- Collapsible on tablet/mobile (hamburger menu)

---

### **Center Panel** - Browse & Search Results
- **Purpose:** Main content area for browsing items
- **Width:** Flexible (takes remaining space when right panel is closed)
- **Content:**
  - Search results grid/list
  - Map view toggle
  - Sort controls (relevance, rating, distance, price)
  - Pagination or infinite scroll
  - Item cards showing:
    - Hero image
    - Title/name
    - Rating & review count
    - Price indicator
    - Distance from user
    - Quick action buttons (save, share)

**Interaction:**
- Clicking any item card **opens the right panel** with full details
- Supports both grid and list view layouts
- Map markers sync with list items

---

### **Right Panel** - Detail View (Slide-In)
- **Purpose:** Show full details of selected item without leaving browse context
- **Width:** ~450-550px (fixed)
- **Behavior:** Slides in from right when item is clicked
- **Content Structure:**

#### **Header Section**
- **Hero Image** - Full-width hero with overlaid content
- **Category badge** - Small label (e.g., "Restaurants")
- **Title** - Large, prominent name (e.g., "El Cielo Restaurant")
- **Rating & Price** - Stars, review count, price level ($$$)
- **Close button (×)** - Top-right corner

#### **Action Bar**
- **Primary CTA:** "Add to Trip" button (prominent, full-width or centered)
- **Secondary actions:** Save, Share icons

#### **Why You'll Love It** (AI Summary)
- Highlighted box with sparkle icon (✨)
- 1-2 sentence personalized pitch
- Example: *"Must-visit for molecular gastronomy lovers. This spot perfectly matches your preference for fine dining."*

#### **Quick Info Cards**
- **Open Now** - Current status + hours
- **Distance** - Distance from user location
- Icons + compact layout

#### **About Section**
- Full description (2-3 paragraphs)
- Key highlights or amenities
- Cuisine type, price range, etc.

#### **Location Section**
- Embedded map (Google Maps)
- "View on Google Maps" link
- Address and neighborhood info

#### **Photos Gallery**
- 2-3 photos in horizontal scroll or grid
- Click to expand full gallery

#### **Reviews Section** (Optional)
- AI-summarized reviews (pros/cons)
- Top reviews with ratings
- "Read all reviews" link

#### **Similar Places** (Optional)
- 2-3 recommendation cards
- "Because you viewed..." logic

---

## User Flow

### **Opening the Right Panel**
1. User browses items in **center panel**
2. User clicks on a restaurant card
3. **Right panel slides in from right** (300ms animation)
4. Center panel width adjusts to accommodate
5. Selected item is highlighted in center panel

### **Interacting with Detail View**
- User can scroll within right panel independently
- "Add to Trip" button is sticky at top
- User can click "View on Google Maps" to open external map
- User can click photos to open full gallery

### **Closing the Right Panel**
Three ways to close:
1. Click **× close button** (top-right)
2. Click **outside the panel** (on center panel backdrop)
3. Press **ESC key**

**Behavior:**
- Right panel slides out to right (300ms animation)
- Center panel expands back to full width
- Selected item highlight is removed
- URL updates (remove item ID from hash/query)

---

## Responsive Behavior

### **Desktop (≥1024px)**
- All 3 panels can be visible simultaneously
- Left panel: Fixed 280px
- Center panel: Flexible width
- Right panel: Fixed 500px (when open)

### **Tablet (768px - 1023px)**
- Left panel collapses to hamburger menu
- Center panel takes full width
- Right panel overlays center panel (not side-by-side)
- Backdrop overlay when right panel is open

### **Mobile (<768px)**
- Left panel is hamburger menu only
- Center panel is full-width
- Right panel is **full-screen modal** (not slide-in)
- Right panel has its own header with back button

---

## State Management

### **URL Synchronization**
The right panel state should be reflected in the URL:

```
# No item selected
/discover/restaurants

# Item selected (right panel open)
/discover/restaurants?detail=el-cielo-restaurant
```

**Benefits:**
- Shareable URLs point directly to item details
- Browser back/forward buttons work intuitively
- Deep linking support

### **Scroll Position**
- Center panel scroll position is **preserved** when right panel opens/closes
- Right panel scroll resets to top when new item is selected

### **Keyboard Navigation**
- **ESC** - Close right panel
- **Arrow keys** - Navigate between items (opens next/previous in right panel)
- **Tab** - Focus management within right panel

---

## Animation & Transitions

### **Slide-In Animation**
```css
/* Right panel enters */
transform: translateX(100%) → translateX(0)
duration: 300ms
easing: cubic-bezier(0.4, 0, 0.2, 1)
```

### **Backdrop Fade**
```css
/* Backdrop appears behind right panel (mobile/tablet) */
opacity: 0 → 0.5
duration: 200ms
```

### **Width Adjustment**
```css
/* Center panel width adjusts */
width: 100% → calc(100% - 500px)
duration: 300ms
easing: cubic-bezier(0.4, 0, 0.2, 1)
```

---

## Technical Implementation

### **Component Structure**
```
<ThreePanelLayout>
  <LeftPanel /> {/* Navigation & Filters */}
  <CenterPanel> {/* Browse Results */}
    <ItemCard onClick={openDetailPanel} />
    <ItemCard onClick={openDetailPanel} />
    ...
  </CenterPanel>
  <RightPanel isOpen={selectedItem !== null}> {/* Detail View */}
    <DetailHeader />
    <ActionBar />
    <DetailContent />
  </RightPanel>
</ThreePanelLayout>
```

### **State Example**
```typescript
const [selectedItem, setSelectedItem] = useState<Item | null>(null);
const [rightPanelOpen, setRightPanelOpen] = useState(false);

const openDetailPanel = (item: Item) => {
  setSelectedItem(item);
  setRightPanelOpen(true);
  // Update URL
  history.push(`/discover/${category}?detail=${item.id}`);
};

const closeDetailPanel = () => {
  setRightPanelOpen(false);
  setSelectedItem(null);
  // Update URL
  history.push(`/discover/${category}`);
};
```

---

## Design Principles

### **Spatial Consistency**
- Users build a mental model: left = navigate, center = browse, right = details
- Consistent panel positions across all content types

### **Context Preservation**
- Right panel **doesn't replace** center panel - user maintains context
- Can easily switch between items without losing browse state

### **Progressive Disclosure**
- Center panel shows essential info (image, title, rating)
- Right panel reveals full details only when needed
- Reduces cognitive load

### **Smooth Transitions**
- Animations feel natural and purposeful
- No jarring layout shifts
- Respects user's scroll position

---

## Examples in the Wild

Similar patterns used by:
- **Airbnb** - Property search with slide-in details
- **Google Maps** - Location search with detail panel
- **Apple Music** - Album browse with detail view
- **Linear** - Issue list with side panel
- **Notion** - Page list with preview pane

---

## Accessibility

### **Focus Management**
- When right panel opens, focus moves to panel header
- Focus trap within right panel while open
- When closed, focus returns to clicked item in center panel

### **Screen Readers**
- Announce panel state changes ("Detail panel opened")
- Proper ARIA labels on close button
- Semantic HTML structure

### **Keyboard Support**
- All actions accessible via keyboard
- Visible focus indicators
- Logical tab order

---

## Future Enhancements

### **Multi-Select Mode**
- Allow selecting multiple items from center panel
- Bulk actions (add to trip, compare, etc.)

### **Comparison View**
- Open 2 right panels side-by-side for comparison
- Desktop only (requires ≥1440px width)

### **Persistent Filters**
- Keep filters applied when right panel opens/closes
- Filter chips visible in center panel header

### **Quick Preview**
- Hover over item in center panel for mini-preview tooltip
- No need to open full right panel for quick info

---

## Summary

The 3-panel system provides:
✅ **Efficient browsing** - Don't lose your place when viewing details  
✅ **Clear hierarchy** - Navigate → Browse → Deep dive  
✅ **Responsive** - Adapts gracefully from mobile to desktop  
✅ **Fast interaction** - Slide-in is faster than full page navigation  
✅ **Shareable** - URLs reflect current state  

This pattern is central to the "I Love Medellín" discovery experience and should be applied consistently across Restaurants, Stays, Events, and Experiences.
