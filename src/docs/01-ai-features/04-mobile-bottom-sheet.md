# MOBILE MAP + BOTTOM SHEET DESIGN SYSTEM

**Status:** 🔴 Critical - Not Started  
**Owner:** Design + Engineering  
**Priority:** P0 - Production Blocker  
**Created:** December 24, 2024

---

## 🎯 Executive Summary

**Problem:** Current desktop-focused map overlay pattern breaks on mobile with keyboard obstruction and unreachable CTAs.

**Solution:** Implement iOS/Android-native bottom sheet pattern with gesture support and keyboard-aware positioning.

**Impact:** Makes mobile experience production-safe, prevents app store rejection, improves user satisfaction.

---

## 1️⃣ LAYOUT RULES

### Core Principle: Map First, Content Second

**Mobile viewport hierarchy:**

```
┌─────────────────────────┐
│                         │
│                         │
│                         │
│        MAP              │ ← Full viewport
│        (Primary)        │
│                         │
│                         │
├─────────────────────────┤ ← Draggable handle
│   Bottom Sheet          │
│   (Peek: 20% height)    │
└─────────────────────────┘
```

### Bottom Sheet States

#### State 1: Peek (Default)

```css
.bottom-sheet-peek {
  height: 20vh;  /* ~140px on iPhone 13 */
  max-height: 180px;
  border-radius: 24px 24px 0 0;
}
```

**Content visible in Peek:**
- Drag handle
- Result count badge ("12 restaurants found")
- Top 2 result cards (partial scroll preview)
- Quick filter chips (price, rating)

**Use case:** User browsing map, glancing at options

#### State 2: Half (Expanded)

```css
.bottom-sheet-half {
  height: 50vh;  /* ~400px on iPhone 13 */
  max-height: 500px;
  border-radius: 24px 24px 0 0;
}
```

**Content visible in Half:**
- Full result list (scrollable)
- All filter options
- Sort dropdown
- Map/List toggle
- "View Full Screen" button

**Use case:** User actively browsing results, comparing options

#### State 3: Full (Maximized)

```css
.bottom-sheet-full {
  height: 90vh;  /* Almost full screen */
  max-height: calc(100vh - 64px);  /* Leave space for status bar */
  border-radius: 24px 24px 0 0;
}
```

**Content visible in Full:**
- All result cards
- Detailed filters
- Sort options
- Search bar
- Back to map button (always visible)

**Use case:** User needs to see many results, detailed filtering

### Layout Measurements

| Device | Peek | Half | Full |
|--------|------|------|------|
| iPhone SE (667px) | 133px (20%) | 334px (50%) | 600px (90%) |
| iPhone 13 (844px) | 169px (20%) | 422px (50%) | 760px (90%) |
| iPhone 13 Pro Max (926px) | 185px (20%) | 463px (50%) | 833px (90%) |
| Android (720px) | 144px (20%) | 360px (50%) | 648px (90%) |

### Safe Zones

```typescript
interface SafeZones {
  top: number;        // Status bar height
  bottom: number;     // Home indicator height (iOS)
  left: number;       // Notch consideration
  right: number;      // Notch consideration
}

// iOS
const iosSafeZones: SafeZones = {
  top: 44,      // Status bar + notch
  bottom: 34,   // Home indicator
  left: 0,
  right: 0,
};

// Android
const androidSafeZones: SafeZones = {
  top: 24,      // Status bar
  bottom: 0,    // No home indicator
  left: 0,
  right: 0,
};
```

---

## 2️⃣ BOTTOM SHEET CONTENT

### Content Structure by State

#### Peek State Content

```tsx
<BottomSheetPeek>
  {/* Drag Handle */}
  <DragHandle />
  
  {/* Header */}
  <SheetHeader>
    <ResultBadge count={12} type="restaurants" />
    <QuickFilters>
      <FilterChip>$$$</FilterChip>
      <FilterChip>4.5+ ★</FilterChip>
      <FilterChip>Open Now</FilterChip>
    </QuickFilters>
  </SheetHeader>
  
  {/* Preview Cards (top 2 visible) */}
  <ResultPreview>
    <RestaurantCard item={results[0]} compact />
    <RestaurantCard item={results[1]} compact />
  </ResultPreview>
  
  {/* Scroll hint */}
  <ScrollHint>Swipe up for more</ScrollHint>
</BottomSheetPeek>
```

#### Half State Content

```tsx
<BottomSheetHalf>
  <DragHandle />
  
  {/* Sticky header */}
  <SheetHeader sticky>
    <ResultBadge count={12} type="restaurants" />
    <FilterButton onClick={openFilters}>
      Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
    </FilterButton>
  </SheetHeader>
  
  {/* Scrollable list */}
  <ScrollableList>
    {results.map(item => (
      <RestaurantCard 
        key={item.id}
        item={item}
        onClick={() => handleCardClick(item)}
      />
    ))}
  </ScrollableList>
  
  {/* View Full CTA (sticky bottom) */}
  <StickyFooter>
    <Button onClick={() => expandToFull()}>
      View all {totalCount} results
    </Button>
  </StickyFooter>
</BottomSheetHalf>
```

#### Full State Content

```tsx
<BottomSheetFull>
  {/* Top navigation */}
  <TopNav>
    <BackButton onClick={() => collapseToHalf()}>
      <ChevronDown />
    </BackButton>
    <Title>Restaurants in El Poblado</Title>
    <MapButton onClick={() => collapseToPeek()}>
      <MapIcon />
    </MapButton>
  </TopNav>
  
  {/* Search + Filters */}
  <SearchFilterBar>
    <SearchInput placeholder="Search restaurants..." />
    <FilterButton>Filters</FilterButton>
  </SearchFilterBar>
  
  {/* Full list with sections */}
  <FullResultList>
    <Section title="AI Recommended">
      {aiRecommended.map(item => <RestaurantCard {...item} />)}
    </Section>
    
    <Section title="All Restaurants">
      {allResults.map(item => <RestaurantCard {...item} />)}
    </Section>
  </FullResultList>
</BottomSheetFull>
```

### Preview Action Buttons

**Always accessible locations:**

```typescript
// In Peek state: Floating button over map
<FloatingCTA
  position="top-right"
  onClick={() => openFilters()}
>
  <FilterIcon />
</FloatingCTA>

// In Half/Full state: Sticky footer
<StickyFooter>
  <Button variant="primary" onClick={handleAddToTrip}>
    Add to Trip
  </Button>
  <Button variant="secondary" onClick={handleShare}>
    Share
  </Button>
</StickyFooter>
```

### Clear Close Affordance

```tsx
// Drag handle (all states)
function DragHandle() {
  return (
    <div className="drag-handle-container">
      <div className="drag-handle" />
    </div>
  );
}

// CSS
.drag-handle-container {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
}

.drag-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.3);
}

.drag-handle:active {
  cursor: grabbing;
}
```

---

## 3️⃣ GESTURE RULES

### Swipe Gestures

#### Swipe Up (Expand)

```typescript
function handleSwipeUp(velocity: number, distance: number) {
  const VELOCITY_THRESHOLD = 0.5;  // px/ms
  const DISTANCE_THRESHOLD = 50;   // px
  
  if (velocity > VELOCITY_THRESHOLD || distance > DISTANCE_THRESHOLD) {
    if (state === 'peek') {
      expandTo('half');
    } else if (state === 'half') {
      expandTo('full');
    }
  }
}
```

**Gesture detection:**
```typescript
const gesture = useGesture({
  onDrag: ({ movement: [, my], velocity: [, vy], direction: [, dy] }) => {
    // Swiping up (negative movement)
    if (dy === -1 && Math.abs(my) > 50) {
      handleSwipeUp(vy, Math.abs(my));
    }
    
    // Swiping down (positive movement)
    if (dy === 1 && Math.abs(my) > 50) {
      handleSwipeDown(vy, Math.abs(my));
    }
  },
});
```

#### Swipe Down (Collapse)

```typescript
function handleSwipeDown(velocity: number, distance: number) {
  const VELOCITY_THRESHOLD = 0.5;
  const DISTANCE_THRESHOLD = 50;
  
  if (velocity > VELOCITY_THRESHOLD || distance > DISTANCE_THRESHOLD) {
    if (state === 'full') {
      collapseTo('half');
    } else if (state === 'half') {
      collapseTo('peek');
    } else if (state === 'peek') {
      // Optional: Dismiss sheet entirely
      dismiss();
    }
  }
}
```

#### Swipe Resistance

```typescript
// When at top/bottom, add resistance
function applyResistance(translation: number, state: SheetState) {
  if (state === 'full' && translation < 0) {
    // Can't swipe up from full
    return translation * 0.2;  // Rubber band effect
  }
  
  if (state === 'peek' && translation > 0) {
    // Can't swipe down from peek (or minimal)
    return translation * 0.3;
  }
  
  return translation;
}
```

### Tap Behaviors

#### Tap Map → Collapse Sheet

```typescript
function handleMapTap(e: TouchEvent) {
  // Only if no pin was tapped
  if (!e.target.closest('.map-pin')) {
    if (state === 'half' || state === 'full') {
      collapseTo('peek');
    }
  }
}
```

#### Tap Card → Expand Sheet (if Peek)

```typescript
function handleCardTap(item: Restaurant) {
  if (state === 'peek') {
    // First expand to show full card
    expandTo('half');
  }
  
  // Then select the card
  setSelection({ itemId: item.id, source: 'list' });
}
```

#### Tap Pin → Expand + Highlight

```typescript
function handlePinTap(pin: MapPin) {
  // 1. Expand sheet to Half (if not already)
  if (state === 'peek') {
    expandTo('half');
  }
  
  // 2. Scroll to corresponding card
  scrollToCard(pin.itemId);
  
  // 3. Highlight card
  setSelection({ itemId: pin.itemId, source: 'map' });
}
```

### Scroll Behavior

#### Scroll Locking

```typescript
// In Peek state: Scroll is disabled (sheet is draggable)
{state === 'peek' && (
  <div style={{ overflow: 'hidden', touchAction: 'pan-y' }}>
    {content}
  </div>
)}

// In Half/Full state: Scroll enabled inside sheet
{(state === 'half' || state === 'full') && (
  <div style={{ overflow: 'auto', touchAction: 'pan-y' }}>
    {content}
  </div>
)}
```

#### Over-Scroll → Collapse

```typescript
function handleScroll(e: React.UIEvent<HTMLDivElement>) {
  const { scrollTop } = e.currentTarget;
  
  // If scrolled to top and user pulls down
  if (scrollTop === 0 && isScrollingDown) {
    // Start sheet collapse gesture
    startCollapseGesture();
  }
}
```

### Drag Handle Behavior

```typescript
// Drag handle is always draggable, regardless of state
<div
  className="drag-handle-container"
  {...bind()}  // Gesture handler
  style={{
    touchAction: 'none',  // Prevent scroll while dragging
    cursor: isDragging ? 'grabbing' : 'grab',
  }}
>
  <div className="drag-handle" />
</div>
```

---

## 4️⃣ KEYBOARD SAFETY

### Core Principle: CTAs Never Hidden

**Problem scenarios:**
1. User opens search input → keyboard appears → "Apply" button hidden
2. User fills filter form → keyboard covers "Save" button
3. User types in chat → send button unreachable

### Solution: Dynamic Positioning

#### Keyboard Detection

```typescript
function useKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  useEffect(() => {
    // Visual viewport API (iOS Safari 13+)
    const handleResize = () => {
      const visualViewport = window.visualViewport;
      if (visualViewport) {
        const keyboardHeight = 
          window.innerHeight - visualViewport.height;
        
        setKeyboardHeight(keyboardHeight);
        setKeyboardVisible(keyboardHeight > 100);  // Threshold
      }
    };
    
    window.visualViewport?.addEventListener('resize', handleResize);
    
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return { keyboardHeight, keyboardVisible };
}
```

#### CTA Repositioning

```typescript
function StickyFooter({ children }: { children: React.ReactNode }) {
  const { keyboardHeight, keyboardVisible } = useKeyboard();
  
  return (
    <div
      className="sticky-footer"
      style={{
        // Shift up when keyboard appears
        bottom: keyboardVisible ? keyboardHeight : 0,
        transition: 'bottom 0.3s ease',
      }}
    >
      {children}
    </div>
  );
}
```

#### Sheet Auto-Collapse on Keyboard

**Option A: Collapse to Peek**
```typescript
useEffect(() => {
  if (keyboardVisible && state === 'full') {
    // Auto-collapse to give more space
    collapseTo('half');
  }
}, [keyboardVisible]);
```

**Option B: Maintain State, Scroll Content**
```typescript
useEffect(() => {
  if (keyboardVisible) {
    // Scroll to focused input
    const activeElement = document.activeElement as HTMLElement;
    activeElement?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
    });
  }
}, [keyboardVisible]);
```

**Recommendation:** Use Option A for better UX

### Chat Input Behavior

```tsx
function ChatInputMobile() {
  const { keyboardVisible, keyboardHeight } = useKeyboard();
  const [inputFocused, setInputFocused] = useState(false);
  
  return (
    <div
      className="chat-input-container"
      style={{
        // Always above keyboard
        bottom: keyboardVisible ? keyboardHeight : 0,
        // Expand when focused
        height: inputFocused ? 120 : 56,
      }}
    >
      <TextArea
        placeholder="Ask me anything..."
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
      />
      
      {/* Send button always visible */}
      <SendButton
        style={{
          position: 'absolute',
          right: 8,
          bottom: keyboardVisible ? keyboardHeight + 8 : 8,
        }}
      />
    </div>
  );
}
```

### Filter Panel Keyboard Handling

```tsx
function FilterPanel() {
  const { keyboardVisible } = useKeyboard();
  
  return (
    <Sheet>
      <FilterForm>
        <Input label="Min Price" type="number" />
        <Input label="Max Price" type="number" />
        <Input label="Rating" type="number" />
      </FilterForm>
      
      {/* Apply button - sticky and keyboard-aware */}
      <ApplyButton
        keyboardVisible={keyboardVisible}
        onClick={applyFilters}
      />
    </Sheet>
  );
}
```

### Scroll Into View Strategy

```typescript
function handleInputFocus(e: React.FocusEvent<HTMLInputElement>) {
  // Wait for keyboard animation
  setTimeout(() => {
    e.target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',  // Center in viewport
      inline: 'nearest',
    });
  }, 300);
}
```

---

## 5️⃣ ACCESSIBILITY

### Minimum Tap Targets

**Apple HIG: 44x44pt minimum**  
**Android: 48x48dp minimum**

```css
/* All interactive elements */
.tap-target {
  min-width: 44px;
  min-height: 44px;
  /* Or for Android */
  min-width: 48px;
  min-height: 48px;
}

/* Buttons */
.button-mobile {
  min-height: 44px;
  padding: 0 16px;
  font-size: 16px;  /* Prevent zoom on iOS */
}

/* Drag handle */
.drag-handle-container {
  min-height: 44px;  /* Entire container is tappable */
  padding: 20px 0;
}

/* Map pins */
.map-pin {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Cards (entire card is tappable) */
.card {
  min-height: 88px;  /* 2x minimum */
  padding: 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0,0,0,0.1);
}
```

### One-Handed Reach Zones

**Thumb-friendly areas on iPhone 13 (844x390):**

```typescript
interface ReachZone {
  name: string;
  description: string;
  yRange: [number, number];  // Top to bottom
}

const reachZones: ReachZone[] = [
  {
    name: 'Easy',
    description: 'Bottom third - thumb rests here naturally',
    yRange: [560, 844],  // Bottom ~280px
  },
  {
    name: 'Stretch',
    description: 'Middle third - requires slight reach',
    yRange: [280, 560],
  },
  {
    name: 'Hard',
    description: 'Top third - requires hand adjustment',
    yRange: [0, 280],
  },
];
```

**Design implications:**

```tsx
// ✅ DO: Primary actions in bottom third
<BottomSheet>
  <Content />
  
  {/* Easy zone - primary actions */}
  <StickyFooter>
    <Button>Add to Trip</Button>
    <Button>Share</Button>
  </StickyFooter>
</BottomSheet>

// ✅ DO: Navigation at top (less frequently used)
<TopNav>
  <BackButton />
  <Title />
  <FilterButton />
</TopNav>

// ❌ DON'T: Put primary actions at top
<TopNav>
  <Button>Add to Trip</Button>  {/* Too far! */}
</TopNav>
```

### Screen Reader Support

```tsx
// Drag handle accessibility
<div
  className="drag-handle-container"
  role="button"
  aria-label="Drag to resize sheet"
  tabIndex={0}
  {...bind()}
>
  <div className="drag-handle" aria-hidden="true" />
</div>

// Sheet state announcement
<div
  role="region"
  aria-label={`Bottom sheet, ${state} state`}
  aria-live="polite"
>
  {content}
</div>

// Card selection
<div
  role="button"
  aria-label={`${item.name}, ${item.price}, ${item.rating} stars, ${item.distance}`}
  aria-pressed={isSelected}
  tabIndex={0}
  onClick={handleSelect}
>
  <RestaurantCard {...item} />
</div>
```

### Focus Management

```typescript
// When sheet expands, focus first interactive element
useEffect(() => {
  if (state === 'full') {
    const firstInput = sheetRef.current?.querySelector('input, button');
    (firstInput as HTMLElement)?.focus();
  }
}, [state]);

// Trap focus in Full state
function trapFocus(e: KeyboardEvent) {
  if (state !== 'full') return;
  
  const focusableElements = sheetRef.current?.querySelectorAll(
    'button, input, select, textarea, a[href]'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
}
```

### Reduced Motion

```typescript
// Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Disable spring animations
const springConfig = prefersReducedMotion
  ? { duration: 0 }
  : { tension: 300, friction: 30 };

<animated.div
  style={{
    ...bind(),
    transition: prefersReducedMotion 
      ? 'none' 
      : 'height 0.3s ease',
  }}
/>
```

---

## 6️⃣ IMPLEMENTATION EXAMPLE

### Complete Bottom Sheet Component

```typescript
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { useState, useEffect, useRef } from 'react';

type SheetState = 'peek' | 'half' | 'full';

interface BottomSheetProps {
  children: React.ReactNode;
  initialState?: SheetState;
  onStateChange?: (state: SheetState) => void;
}

export function BottomSheet({ 
  children, 
  initialState = 'peek',
  onStateChange,
}: BottomSheetProps) {
  const [state, setState] = useState<SheetState>(initialState);
  const sheetRef = useRef<HTMLDivElement>(null);
  
  // State heights
  const heights = {
    peek: window.innerHeight * 0.2,
    half: window.innerHeight * 0.5,
    full: window.innerHeight * 0.9,
  };
  
  // Spring animation
  const [{ y }, api] = useSpring(() => ({
    y: window.innerHeight - heights[state],
  }));
  
  // Update spring when state changes
  useEffect(() => {
    api.start({ y: window.innerHeight - heights[state] });
    onStateChange?.(state);
  }, [state]);
  
  // Drag gesture
  const bind = useDrag(
    ({ last, movement: [, my], velocity: [, vy], direction: [, dy] }) => {
      // While dragging, update position
      if (!last) {
        const newY = window.innerHeight - heights[state] + my;
        api.start({ y: newY, immediate: true });
      } else {
        // On release, snap to nearest state
        const threshold = 50;
        const velocityThreshold = 0.5;
        
        if (dy === -1 && (Math.abs(my) > threshold || vy > velocityThreshold)) {
          // Swipe up
          if (state === 'peek') setState('half');
          else if (state === 'half') setState('full');
        } else if (dy === 1 && (Math.abs(my) > threshold || vy > velocityThreshold)) {
          // Swipe down
          if (state === 'full') setState('half');
          else if (state === 'half') setState('peek');
        } else {
          // Snap back to current state
          api.start({ y: window.innerHeight - heights[state] });
        }
      }
    },
    {
      from: () => [0, y.get()],
      filterTaps: true,
      bounds: { 
        top: window.innerHeight - heights.full,
        bottom: window.innerHeight - heights.peek,
      },
      rubberband: true,
    }
  );
  
  return (
    <>
      {/* Backdrop (visible in half/full states) */}
      {(state === 'half' || state === 'full') && (
        <div
          className="sheet-backdrop"
          onClick={() => setState('peek')}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 999,
          }}
        />
      )}
      
      {/* Bottom Sheet */}
      <animated.div
        ref={sheetRef}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          height: '100vh',
          y,
          zIndex: 1000,
          touchAction: 'none',
        }}
        className="bottom-sheet"
      >
        <div
          style={{
            background: 'white',
            borderRadius: '24px 24px 0 0',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Drag Handle */}
          <div
            {...bind()}
            style={{
              padding: '8px 0',
              display: 'flex',
              justifyContent: 'center',
              cursor: 'grab',
              minHeight: 44,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                background: 'rgba(0,0,0,0.3)',
              }}
            />
          </div>
          
          {/* Content */}
          <div
            style={{
              flex: 1,
              overflow: state === 'peek' ? 'hidden' : 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {children}
          </div>
        </div>
      </animated.div>
    </>
  );
}
```

### Usage Example

```tsx
function ExploreMobile() {
  const [sheetState, setSheetState] = useState<SheetState>('peek');
  const [selectedItem, setSelectedItem] = useState<Restaurant | null>(null);
  
  return (
    <div className="explore-mobile">
      {/* Map (full viewport) */}
      <MapView
        pins={pins}
        onPinClick={(pin) => {
          setSelectedItem(findItem(pin.itemId));
          setSheetState('half');  // Expand to show selected card
        }}
      />
      
      {/* Bottom Sheet */}
      <BottomSheet
        initialState="peek"
        onStateChange={setSheetState}
      >
        {sheetState === 'peek' && (
          <PeekContent results={results} />
        )}
        
        {sheetState === 'half' && (
          <HalfContent 
            results={results}
            selectedItem={selectedItem}
          />
        )}
        
        {sheetState === 'full' && (
          <FullContent 
            results={results}
            filters={filters}
            onFilterChange={setFilters}
          />
        )}
      </BottomSheet>
    </div>
  );
}
```

---

## 7️⃣ SUCCESS CRITERIA

### Functional Requirements

✅ **Three States Work**
- Peek shows preview
- Half shows full list
- Full shows all features

✅ **Gestures Smooth**
- Swipe up/down transitions smoothly
- No jank or lag
- Spring animation feels natural

✅ **Keyboard Safe**
- CTAs never hidden
- Input always visible
- Sheet adjusts dynamically

✅ **Accessibility**
- 44px tap targets
- Screen reader support
- Focus management
- Reduced motion support

### Performance Requirements

- Sheet animation 60fps
- Gesture response < 16ms
- No layout shift during keyboard open
- Smooth scroll in Half/Full states

### User Experience Goals

- **Intuitive:** Gesture behavior matches iOS/Android patterns
- **Responsive:** Immediate visual feedback
- **Accessible:** Works for all users
- **Safe:** No hidden CTAs or obstructed content

---

## 🔗 RELATED DOCUMENTATION

- [Map ↔ List Sync Spec](/docs/01-ai-features/03-map-list-sync-spec.md)
- [Context State Contract](/docs/01-ai-features/02-context-state-contract.md)
- [Chat UX Signaling](/docs/01-ai-features/05-chat-explore-signaling.md)

---

**Document Status:** 🟡 Draft - Pending Review  
**Next Review:** December 27, 2024  
**Approvers:** Mobile Lead, Design Lead
