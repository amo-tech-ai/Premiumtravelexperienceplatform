# MOBILE OPTIMIZATION — QUICK REFERENCE

**Last Updated:** December 28, 2024  
**Status:** ✅ Production-Ready  
**Total Files:** 16 production files

---

## 🚀 QUICK START

### Import Most-Used Components

```typescript
// Touch-friendly buttons
import { TouchTargetButton } from '@/v2/components/mobile/TouchTarget';

// Bottom sheets
import { BottomSheet, FilterBottomSheet } from '@/v2/components/ui/BottomSheet';

// Progress indicators
import { LinearProgress } from '@/v2/components/ui/LinearProgress';

// Sticky CTAs
import { StickyBottomCTA } from '@/v2/components/ui/StickyBottomCTA';

// Filters
import { DashboardFilters } from '@/v2/components/filters/DashboardFilters';
import { tripsHubFilters } from '@/v2/components/filters/filterConfigs';

// Tabs
import { TabNavigation } from '@/v2/components/ui/TabNavigation';

// AI Chatbot
import { DockedAIChatbot } from '@/v2/components/ai/DockedAIChatbot';
```

---

## 📋 COMMON PATTERNS

### 1. Touch-Friendly Button

```typescript
<TouchTargetButton
  variant="primary"    // primary | secondary | ghost | icon
  size="md"           // sm | md | lg
  onClick={handleClick}
>
  Click Me
</TouchTargetButton>
```

**Variants:**
- `primary` - Blue background, white text
- `secondary` - White background, blue border
- `ghost` - Transparent, gray text
- `icon` - Round icon button (48x48px)

**Sizes:**
- `sm` - 44px height (minimum)
- `md` - 48px height (recommended)
- `lg` - 56px height (emphasis)

---

### 2. Bottom Sheet

```typescript
const [isOpen, setIsOpen] = useState(false);

<BottomSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Sheet Title"
  height="md"         // sm | md | lg | full | auto
  showHandle={true}
  dismissOnBackdrop={true}
>
  <div className="p-4">
    {/* Content */}
  </div>
</BottomSheet>
```

**With List Actions:**
```typescript
<BottomSheet isOpen={isOpen} onClose={onClose}>
  <BottomSheetList 
    items={[
      { icon: <Edit />, label: 'Edit', onClick: handleEdit },
      { icon: <Share />, label: 'Share', onClick: handleShare },
      { icon: <Trash />, label: 'Delete', onClick: handleDelete, destructive: true },
    ]}
  />
</BottomSheet>
```

---

### 3. Filters

```typescript
import { DashboardFilters } from '@/v2/components/filters/DashboardFilters';
import { tripsHubFilters } from '@/v2/components/filters/filterConfigs';

const [activeFilters, setActiveFilters] = useState({});

<DashboardFilters
  filters={tripsHubFilters}
  activeFilters={activeFilters}
  onApplyFilters={setActiveFilters}
  onClearFilters={() => setActiveFilters({})}
/>
```

**Pre-configured Filter Sets:**
- `tripsHubFilters` - Trip status, budget, duration
- `eventsFilters` - Category, date, price
- `restaurantsFilters` - Cuisine, price, rating
- `rentalsFilters` - Type, price, bedrooms
- `exploreFilters` - Category, distance, time

---

### 4. Tab Navigation

```typescript
const tabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <Info />,
    content: <OverviewTab />
  },
  {
    id: 'details',
    label: 'Details',
    content: <DetailsTab />
  },
];

<TabNavigation 
  tabs={tabs} 
  defaultTab="overview"
  onChange={(tabId) => console.log('Tab changed:', tabId)}
/>
```

**With URL Deep Linking:**
```typescript
// Automatically reads from URL: /page?tab=details
<TabNavigation tabs={tabs} />

// User can share: /page?tab=menu
```

---

### 5. Sticky Bottom CTA

```typescript
<StickyBottomCTA
  label="Reserve Table"
  onClick={handleReserve}
  icon={<Calendar className="w-5 h-5" />}
  variant="primary"
  showOnScroll={true}        // Only show after scrolling
  scrollThreshold={200}      // Pixels to scroll before showing
/>
```

**With Price Display:**
```typescript
<StickyBottomPrice
  price="$149"
  priceLabel="Total"
  ctaLabel="Book Now"
  onCtaClick={handleBook}
/>
```

---

### 6. Linear Progress

```typescript
<LinearProgress 
  currentStep={2} 
  totalSteps={4} 
/>
```

**With Step Labels:**
```typescript
<LinearProgressWithLabels
  currentStep={2}
  steps={['Destination', 'Dates', 'Details', 'Preferences']}
/>
```

---

### 7. Docked AI Chatbot

```typescript
<DockedAIChatbot tripId={tripId} />
```

**States:**
- `collapsed` - 56px bar at bottom
- `medium` - 50% screen height
- `full` - 85% screen height

**Agent Tabs:**
- 🔍 Discovery - Find places
- 📅 Planning - Auto-plan days
- ⚡ Optimization - Improve itinerary

---

### 8. Horizontal Trip Card

```typescript
<HorizontalTripCard
  trip={tripData}
  onMenuClick={(trip) => setSelectedTrip(trip)}
/>
```

**Layout:**
```
┌─────────────────────────────────┐
│ [IMG] Trip Title           ⋮    │
│ 100x  Paris, France             │
│ 100   Mar 15-22                 │
│       7 days • $2,400           │
└─────────────────────────────────┘
```

---

## 🎨 DESIGN TOKENS

### Touch Targets

```css
--touch-target-min: 44px;      /* Minimum */
--touch-target-recommended: 48px;
--touch-target-large: 56px;
--touch-target-list: 64px;     /* List items */
```

### Spacing

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

### Z-Index Layers

```css
--z-sticky-header: 30;
--z-bottom-sheet: 40;
--z-docked-chatbot: 50;
--z-modal: 60;
```

### Animation Durations

```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
```

---

## 📱 RESPONSIVE BREAKPOINTS

```typescript
// Mobile-first approach
const breakpoints = {
  mobile: '0-767px',    // 1 column, horizontal cards
  tablet: '768-1023px', // 2 columns, some grids
  desktop: '1024px+',   // Original layouts
};
```

**Usage in Tailwind:**
```typescript
<div className="
  flex flex-col gap-3           // Mobile: vertical stack
  md:grid md:grid-cols-2 md:gap-6  // Tablet: 2 columns
  lg:grid-cols-3 lg:gap-8       // Desktop: 3 columns
">
```

---

## ✅ ACCESSIBILITY CHECKLIST

### Every Interactive Element Should Have:

```typescript
// 1. Minimum touch target
<button className="min-w-[44px] min-h-[44px]">

// 2. ARIA label
<button aria-label="Close dialog">

// 3. Disabled state
<button disabled={isLoading} className="disabled:opacity-50">

// 4. Loading state
<button disabled={isLoading}>
  {isLoading ? <Spinner /> : 'Submit'}
</button>

// 5. Keyboard support
<div
  role="button"
  tabIndex={0}
  onKeyPress={(e) => e.key === 'Enter' && handleClick()}
>
```

---

## 🔧 COMMON TASKS

### Add Filter to New Dashboard

**1. Create filter config:**
```typescript
// /v2/components/filters/filterConfigs.ts
export const myDashboardFilters: FilterGroup[] = [
  {
    id: 'category',
    label: 'Category',
    type: 'checkbox',
    options: [
      { id: 'cat1', label: 'Category 1', value: 'cat1', type: 'checkbox' },
      { id: 'cat2', label: 'Category 2', value: 'cat2', type: 'checkbox' },
    ],
  },
];
```

**2. Add to dashboard:**
```typescript
import { DashboardFilters } from '@/v2/components/filters/DashboardFilters';
import { myDashboardFilters } from '@/v2/components/filters/filterConfigs';

const [filters, setFilters] = useState({});

<DashboardFilters
  filters={myDashboardFilters}
  activeFilters={filters}
  onApplyFilters={setFilters}
  onClearFilters={() => setFilters({})}
/>
```

---

### Convert Page to Tabs

**1. Define tab structure:**
```typescript
const tabs = [
  { id: 'tab1', label: 'Tab 1', content: <Tab1Content /> },
  { id: 'tab2', label: 'Tab 2', content: <Tab2Content /> },
];
```

**2. Replace long scrolling page:**
```typescript
// Before: Long vertical page
<div>
  <Section1 />
  <Section2 />
  <Section3 />
</div>

// After: Tabbed sections
<TabNavigation tabs={tabs} defaultTab="tab1" />
```

---

### Add Sticky CTA to Detail Page

```typescript
// At bottom of component
return (
  <div className="pb-20">  {/* Add padding */}
    {/* Page content */}
    
    <StickyBottomCTA
      label="Primary Action"
      onClick={handleAction}
      showOnScroll={true}
    />
  </div>
);
```

---

### Create Custom Filter

```typescript
const customFilter: FilterGroup = {
  id: 'my-filter',
  label: 'My Custom Filter',
  type: 'checkbox',  // or 'radio' | 'range' | 'toggle'
  options: [
    { id: 'opt1', label: 'Option 1', value: 'opt1', type: 'checkbox' },
    { id: 'opt2', label: 'Option 2', value: 'opt2', type: 'checkbox' },
  ],
};

// Use it
<DashboardFilters filters={[customFilter]} ... />
```

---

## 🐛 TROUBLESHOOTING

### Bottom Sheet Not Showing

**Check:**
1. `isOpen` prop is true
2. Z-index conflicts (should be z-40+)
3. Parent overflow hidden

**Fix:**
```typescript
// Ensure parent allows overflow
<div className="relative">  {/* Not overflow-hidden */}
  <BottomSheet isOpen={isOpen} ... />
</div>
```

---

### Touch Targets Too Small

**Check:**
1. Using TouchTargetButton component
2. Minimum 44px height
3. Parent not constraining size

**Fix:**
```typescript
// Use TouchTargetButton, not regular button
<TouchTargetButton size="md">  {/* 48px minimum */}
  Click
</TouchTargetButton>
```

---

### Sticky CTA Hidden Behind Content

**Check:**
1. Page has bottom padding
2. Z-index is set (z-40)
3. Safe area padding included

**Fix:**
```typescript
// Add padding to page content
<div className="pb-24">  {/* 96px padding */}
  {content}
</div>

// Or use helper
<ContentPaddingBottom height={96} />
```

---

### Tabs Not Deep Linking

**Check:**
1. URL has ?tab=tabId parameter
2. Tab IDs match exactly
3. useEffect is reading URL

**Fix:**
```typescript
// TabNavigation automatically handles this
// Just ensure tab IDs match URL params
<TabNavigation tabs={tabs} />

// Navigate to: /page?tab=menu
```

---

## 📚 FULL DOCUMENTATION

**Complete Guides:**
- `/docs/mobile/01-plan.md` - Full optimization plan
- `/docs/mobile/02-prompts.md` - Implementation prompts
- `/docs/mobile/03-implementation-summary.md` - Phase 1 summary
- `/docs/mobile/04-phase2-summary.md` - Phase 2 summary
- `/docs/mobile/05-complete-implementation.md` - Complete summary
- `/MOBILE_OPTIMIZATION_FINAL.md` - Final status

**Component Docs:**
- Each component has JSDoc comments
- TypeScript types included
- Usage examples in docs

---

## 🎯 QUICK WINS REFERENCE

| Task | Component | Time |
|------|-----------|------|
| Add touch-friendly button | TouchTargetButton | 1 min |
| Add bottom sheet modal | BottomSheet | 5 min |
| Add filters to dashboard | DashboardFilters | 10 min |
| Add sticky CTA | StickyBottomCTA | 2 min |
| Add progress bar | LinearProgress | 2 min |
| Add tabs to page | TabNavigation | 15 min |
| Add AI chatbot | DockedAIChatbot | 5 min |

---

**Status:** ✅ Production-Ready  
**Support:** See full documentation in `/docs/mobile/`  
**Questions:** Check component JSDoc comments or full implementation guide
