# MAP ↔ LIST SYNCHRONIZATION SPECIFICATION

**Status:** 🔴 Critical - Not Started  
**Owner:** Design + Engineering  
**Priority:** P0 - Blocker  
**Created:** December 24, 2024

---

## 🎯 Executive Summary

**Problem:** Map pins and list cards can fall out of sync, breaking user trust and creating confusion.

**Solution:** Define deterministic interaction rules ensuring map and list are always synchronized via single source of truth.

**Impact:** Removes largest P0 blocker, enables production-ready map experience.

---

## 1️⃣ SELECTION RULES

### Core Principle: Single Selection State

**ONE selection, TWO visual representations**

```typescript
// ✅ CORRECT: Single source of truth
interface SelectionState {
  itemId: string | null;
  itemType: 'restaurant' | 'event' | 'rental' | null;
  source: 'map' | 'list' | null;  // Where selection originated
}

const [selection, setSelection] = useState<SelectionState>({
  itemId: null,
  itemType: null,
  source: null,
});

// ❌ WRONG: Separate states
const [selectedCard, setSelectedCard] = useState(null);  // NO!
const [selectedPin, setSelectedPin] = useState(null);    // NO!
```

### Selection Behavior Rules

#### Rule 1.1: Card Selection

**When user clicks a card:**

```typescript
function handleCardClick(item: Restaurant | Event | Rental) {
  // 1. Update selection state
  setSelection({
    itemId: item.id,
    itemType: item.type,
    source: 'list',
  });
  
  // 2. Map automatically highlights corresponding pin
  // 3. Map pans to center pin (smooth animation)
  // 4. If pin is in cluster, expand cluster first
}
```

**Visual feedback:**
- ✅ Card gets highlighted border + shadow
- ✅ Corresponding map pin changes color + size
- ✅ Map pans to show pin (with padding for card visibility)
- ✅ Other cards dimmed slightly (optional)

#### Rule 1.2: Pin Selection

**When user clicks a map pin:**

```typescript
function handlePinClick(pin: MapPin) {
  // 1. Update selection state
  setSelection({
    itemId: pin.itemId,
    itemType: pin.type,
    source: 'map',
  });
  
  // 2. List scrolls to corresponding card
  // 3. Card highlights
  // 4. On mobile: bottom sheet shows card preview
}
```

**Visual feedback:**
- ✅ Pin changes to "selected" style
- ✅ List auto-scrolls to card (smooth scroll)
- ✅ Card highlights immediately
- ✅ Pin shows info popup (optional, desktop only)

#### Rule 1.3: Deselection

**How to deselect:**

| Action | Behavior | Platform |
|--------|----------|----------|
| Click map background | Clear selection | All |
| Press Escape key | Clear selection | Desktop |
| Click selected card again | Clear selection | All |
| Click selected pin again | Clear selection | All |
| Swipe down bottom sheet | Clear selection | Mobile |
| Click close button | Clear selection | All |

```typescript
function handleDeselect() {
  setSelection({
    itemId: null,
    itemType: null,
    source: null,
  });
  
  // Both map and list return to default state
}
```

#### Rule 1.4: Multiple Selection

**FORBIDDEN:**

```typescript
// ❌ Multiple selection is NOT allowed
const [selectedItems, setSelectedItems] = useState<string[]>([]);  // NO!
```

**Why:** 
- Complicates map visualization
- Unclear UX for "Add all to trip"
- Preview system expects single items

**Exception:**
- Batch actions use checkboxes (separate UI pattern)
- These are "staged" not "selected"

---

## 2️⃣ HOVER / FOCUS RULES

### Desktop Behavior

#### Rule 2.1: Card Hover

```typescript
function handleCardHover(item: Restaurant | Event | Rental) {
  // Lightweight, non-committal preview
  
  // ✅ DO:
  setHoverState({
    itemId: item.id,
    itemType: item.type,
  });
  
  // Map pin shows subtle highlight (NOT same as selection)
  // No map panning
  // No list scrolling
}
```

**Visual feedback:**
- Card: Subtle shadow increase
- Pin: Subtle pulse or color shift (lighter than selection)
- **No animation triggers**

#### Rule 2.2: Pin Hover

```typescript
function handlePinHover(pin: MapPin) {
  // Show which card this pin represents
  
  // ✅ DO:
  setHoverState({
    itemId: pin.itemId,
    itemType: pin.type,
  });
  
  // Corresponding card shows subtle highlight
  // No scrolling
  // Tooltip shows item name/price
}
```

**Visual feedback:**
- Pin: Tooltip appears above
- Card: Subtle glow or border
- **No scrolling behavior**

### Hover vs Selection Visual Differentiation

| State | Card | Pin | Map Behavior | List Behavior |
|-------|------|-----|--------------|---------------|
| **Default** | No highlight | Default color | - | - |
| **Hover** | Subtle shadow | Pulse | No pan | No scroll |
| **Selected** | Bold border + shadow | Large + accent color | Pan to center | Scroll to card |

### Mobile Behavior

#### Rule 2.3: No Hover on Mobile

```typescript
// Mobile devices have no hover state
// All interactions are tap-based

// ❌ DON'T: Rely on hover for information
<Pin onHover={showTooltip} />  // Won't work on mobile!

// ✅ DO: Use tap for all interactions
<Pin onClick={handlePinClick} />
```

**Mobile-specific rules:**
- No hover states exist
- Tap = Select (shows bottom sheet)
- Long press = Alternative action (optional, TBD)

---

## 3️⃣ CLUSTERING RULES

### When to Cluster

```typescript
// Cluster pins when:
const shouldCluster = (pins: MapPin[], zoom: number) => {
  // 1. More than 10 pins in viewport
  if (pins.length > 10 && zoom < 15) return true;
  
  // 2. Pins overlap at current zoom
  if (hasOverlappingPins(pins, zoom)) return true;
  
  return false;
};
```

### Cluster Expansion Behavior

#### Rule 3.1: Click Cluster

**Option A: Zoom In (Recommended)**

```typescript
function handleClusterClick(cluster: MapCluster) {
  // 1. Zoom map to show all pins in cluster
  map.fitBounds(cluster.bounds, {
    padding: 50,
    duration: 500,
  });
  
  // 2. Cluster automatically dissolves
  // 3. Individual pins now visible
  // 4. List filters to show only items in cluster (optional)
}
```

**Option B: Expand in Place**

```typescript
function handleClusterClick(cluster: MapCluster) {
  // 1. Cluster expands into spider/grid pattern
  // 2. Individual pins arranged around cluster center
  // 3. Click pin → normal selection behavior
  // 4. Click outside → collapse back to cluster
}
```

**Recommendation:** Use Option A (zoom) - simpler, more predictable

### Cluster ↔ List Relationship

#### Rule 3.2: Cluster Reflects List

```typescript
// Clusters are derived from visible list items

const visiblePins = useMemo(() => {
  // Start with all results from context
  let items = context.results[context.intent.type] || [];
  
  // Apply active filters
  items = applyFilters(items, activeFilters);
  
  // Convert to pins
  return items.map(item => ({
    id: `pin-${item.id}`,
    lat: item.lat,
    lng: item.lng,
    type: item.type,
    itemId: item.id,
  }));
}, [context, activeFilters]);

// Clusters computed from visible pins
const clusters = useMapClusters(visiblePins, mapZoom);
```

**Key Rule:**  
🔒 **Cluster count === List item count** (after filters)

### Cluster Visual Design

```typescript
interface ClusterStyle {
  // Size based on count
  size: number;  // 32px (2-9), 40px (10-49), 48px (50+)
  
  // Color matches primary intent type
  color: string;  // restaurant-primary, event-primary, etc.
  
  // Count badge
  count: number;
  
  // Hover state
  hovered: boolean;  // Slightly larger, subtle pulse
}
```

---

## 4️⃣ FILTERING RULES

### Core Principle: Shared Filter State

**ONE filter state → TWO synchronized views**

```typescript
interface FilterState {
  priceRange?: [number, number];
  rating?: number;
  tags?: string[];
  dateRange?: [Date, Date];
  openNow?: boolean;
}

// ✅ CORRECT: Single filter state
const [filters, setFilters] = useState<FilterState>({});

// Map and List both consume same state
<MapView items={applyFilters(allItems, filters)} />
<ListView items={applyFilters(allItems, filters)} />
```

### Filter Application

#### Rule 4.1: Explicit Application

```typescript
// ❌ DON'T: Apply on every change
<PriceRangeSlider onChange={(range) => setFilters({ priceRange: range })} />

// ✅ DO: Apply on explicit user action
<FilterPanel>
  <PriceRangeSlider 
    value={tempFilters.priceRange}
    onChange={(range) => setTempFilters({ priceRange: range })}
  />
  <Button onClick={() => setFilters(tempFilters)}>
    Apply Filters
  </Button>
</FilterPanel>
```

**Why:** Prevents jarring re-renders, gives user control

**Exception:** Live search (but debounced)

```typescript
// Search is exception: live but debounced
const debouncedSearch = useDebounce(searchQuery, 300);

useEffect(() => {
  setFilters({ search: debouncedSearch });
}, [debouncedSearch]);
```

#### Rule 4.2: Filter Synchronization

**When filters change:**

1. Update filter state
2. Recompute visible items
3. Update map pins (remove filtered pins)
4. Update list (remove filtered cards)
5. Update cluster counts
6. Clear selection if selected item now filtered

```typescript
useEffect(() => {
  // If selected item is now filtered out, clear selection
  if (selection && !filteredItems.find(item => item.id === selection.itemId)) {
    setSelection(null);
  }
}, [filteredItems, selection]);
```

#### Rule 4.3: Filter Count Badge

```typescript
// Show count of active filters
const activeFilterCount = useMemo(() => {
  let count = 0;
  if (filters.priceRange) count++;
  if (filters.rating) count++;
  if (filters.tags && filters.tags.length > 0) count++;
  if (filters.dateRange) count++;
  if (filters.openNow) count++;
  return count;
}, [filters]);

// UI indicator
{activeFilterCount > 0 && (
  <FilterBadge>
    {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
  </FilterBadge>
)}
```

### Map Drag Behavior

#### Rule 4.4: Map Drag Does NOT Re-Query

**IMPORTANT DECISION:**

```typescript
// ❌ DON'T: Re-query on every map drag
function handleMapDrag(newBounds) {
  fetchItemsInBounds(newBounds);  // NO! Too expensive
}

// ✅ DO: Show existing items, offer to search new area
function handleMapDrag(newBounds) {
  const itemsInView = filterItemsByBounds(existingItems, newBounds);
  
  if (itemsInView.length === 0) {
    // Show "Search this area" button
    setShowSearchAreaButton(true);
  }
}
```

**Why:**
- Prevents expensive API calls
- User controls when to search
- Maintains context stability

**Exception:** User clicks "Search this area" button

```typescript
<Button onClick={() => {
  const newContext = createContextFromMapBounds(map.getBounds());
  setContext(newContext);
}}>
  Search this area
</Button>
```

---

## 5️⃣ VISUAL CUES

### Color System

#### Primary Intent Colors

```css
/* Restaurant pins */
.pin-restaurant-default { background: #8B7355; }
.pin-restaurant-hover { background: #A0846A; }
.pin-restaurant-selected { background: #6B5845; border: 2px solid #FFF; }

/* Event pins */
.pin-event-default { background: #6B8E7F; }
.pin-event-hover { background: #7FA594; }
.pin-event-selected { background: #5A7A6D; border: 2px solid #FFF; }

/* Rental pins */
.pin-rental-default { background: #8B7BA8; }
.pin-rental-hover { background: #A090BD; }
.pin-rental-selected { background: #7568; border: 2px solid #FFF; }

/* Cluster */
.cluster { 
  background: linear-gradient(135deg, #8B7355 0%, #6B8E7F 100%);
  border: 2px solid #FFF;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

### Card Highlight States

```css
/* Default card */
.card {
  border: 1px solid #E5E5E5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.2s ease;
}

/* Hover state */
.card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

/* Selected state */
.card-selected {
  border: 2px solid #8B7355;
  box-shadow: 0 8px 24px rgba(139, 115, 85, 0.25);
  background: linear-gradient(to right, #FFFBF7 0%, #FFFFFF 100%);
}
```

### Pin Styles

```typescript
// Pin component with states
interface PinProps {
  state: 'default' | 'hover' | 'selected';
  type: 'restaurant' | 'event' | 'rental';
  priority: 'primary' | 'secondary';
}

function MapPin({ state, type, priority }: PinProps) {
  const size = state === 'selected' ? 40 : state === 'hover' ? 32 : 28;
  const opacity = priority === 'primary' ? 1 : 0.7;
  
  return (
    <div 
      className={`pin pin-${type}-${state}`}
      style={{
        width: size,
        height: size,
        opacity: opacity,
      }}
    >
      {state === 'selected' && <Checkmark />}
    </div>
  );
}
```

### Disabled States

```css
/* Filtered out card (still visible but dimmed) */
.card-filtered {
  opacity: 0.4;
  pointer-events: none;
  filter: grayscale(50%);
}

/* Hidden pin (not rendered when filtered) */
.pin-filtered {
  display: none;
}
```

### Cluster Count Badge

```typescript
function ClusterBadge({ count }: { count: number }) {
  return (
    <div className="cluster-badge">
      <div className="cluster-circle">
        <span className="cluster-count">{count}</span>
      </div>
    </div>
  );
}

// CSS
.cluster-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B7355 0%, #6B8E7F 100%);
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cluster-count {
  color: white;
  font-weight: 700;
  font-size: 14px;
}
```

### Loading States

```typescript
// Skeleton pins while loading
function SkeletonPin() {
  return (
    <div className="pin-skeleton">
      <div className="skeleton-pulse" />
    </div>
  );
}

// Skeleton cards
function SkeletonCard() {
  return (
    <div className="card-skeleton">
      <div className="skeleton-image" />
      <div className="skeleton-text" />
      <div className="skeleton-text short" />
    </div>
  );
}
```

---

## 6️⃣ INTERACTION FLOW DIAGRAMS

### Desktop: Card Click Flow

```
User clicks card
       ↓
┌──────────────────────────┐
│  handleCardClick(item)   │
└──────────────────────────┘
       ↓
┌──────────────────────────┐
│  setSelection({          │
│    itemId: item.id,      │
│    source: 'list'        │
│  })                      │
└──────────────────────────┘
       ↓
    ┌──────┴──────┐
    ↓             ↓
[CARD]        [MAP]
Highlight    Find pin
Border       Change color
Shadow       Increase size
             Pan to center
```

### Desktop: Pin Click Flow

```
User clicks pin
       ↓
┌──────────────────────────┐
│  handlePinClick(pin)     │
└──────────────────────────┘
       ↓
┌──────────────────────────┐
│  setSelection({          │
│    itemId: pin.itemId,   │
│    source: 'map'         │
│  })                      │
└──────────────────────────┘
       ↓
    ┌──────┴──────┐
    ↓             ↓
[PIN]         [LIST]
Enlarge      Find card
Accent       Scroll to view
Checkmark    Highlight
```

### Mobile: Pin Click Flow

```
User taps pin
       ↓
┌──────────────────────────┐
│  handlePinClick(pin)     │
└──────────────────────────┘
       ↓
┌──────────────────────────┐
│  setSelection({          │
│    itemId: pin.itemId,   │
│    source: 'map'         │
│  })                      │
└──────────────────────────┘
       ↓
┌──────────────────────────┐
│  openBottomSheet({       │
│    content: CardPreview  │
│  })                      │
└──────────────────────────┘
       ↓
    ┌──────┴──────┐
    ↓             ↓
[PIN]      [BOTTOM SHEET]
Enlarge    Slide up
Accent     Show card
           CTA buttons
```

### Filter Application Flow

```
User adjusts filters
       ↓
┌──────────────────────────┐
│  setTempFilters({...})   │
│  (not applied yet)       │
└──────────────────────────┘
       ↓
User clicks "Apply"
       ↓
┌──────────────────────────┐
│  setFilters(tempFilters) │
└──────────────────────────┘
       ↓
┌──────────────────────────┐
│  filteredItems =         │
│    applyFilters(...)     │
└──────────────────────────┘
       ↓
    ┌──────┴──────┐
    ↓             ↓
[MAP]         [LIST]
Update pins  Update cards
Remove       Remove
filtered     filtered
Recalculate  Update count
clusters     badge
```

---

## 7️⃣ EDGE CASES & ERROR HANDLING

### Edge Case 1: Selected Item Filtered Out

**Scenario:** User selects restaurant, then applies filter that hides it

**Behavior:**
```typescript
useEffect(() => {
  if (selection && !filteredItems.some(item => item.id === selection.itemId)) {
    // Clear selection
    setSelection(null);
    
    // Show toast (optional)
    toast.info('Selected item hidden by filters');
  }
}, [filteredItems, selection]);
```

### Edge Case 2: Cluster Contains Selected Pin

**Scenario:** User selects pin, then zooms out causing cluster to form

**Behavior:**
```typescript
// Selected pin should NEVER cluster
function computeClusters(pins: MapPin[], selection: Selection | null) {
  // Remove selected pin from clustering
  const pinsToCluster = pins.filter(pin => 
    pin.itemId !== selection?.itemId
  );
  
  const clusters = createClusters(pinsToCluster);
  
  // Selected pin always rendered individually
  return {
    clusters,
    individualPins: pins.filter(pin => pin.itemId === selection?.itemId),
  };
}
```

### Edge Case 3: No Items in Map Bounds

**Scenario:** User drags map to area with no results

**Behavior:**
```tsx
const itemsInBounds = useMemo(() => {
  return filteredItems.filter(item => 
    isInBounds(item, mapBounds)
  );
}, [filteredItems, mapBounds]);

{itemsInBounds.length === 0 && (
  <MapOverlay>
    <EmptyMapState>
      <Icon name="map-pin" />
      <h4>No results in this area</h4>
      <p>Drag the map or adjust filters to see results</p>
      <Button onClick={() => fitMapToResults()}>
        Show all results
      </Button>
    </EmptyMapState>
  </MapOverlay>
)}
```

### Edge Case 4: Rapid Clicks

**Scenario:** User rapidly clicks different pins/cards

**Behavior:**
```typescript
// Debounce rapid selections
const debouncedSelection = useDebounce(selection, 100);

// Use debounced value for expensive operations
useEffect(() => {
  if (debouncedSelection?.source === 'map') {
    scrollListToCard(debouncedSelection.itemId);
  }
}, [debouncedSelection]);
```

### Edge Case 5: Map Loading

**Scenario:** Map tiles loading slowly

**Behavior:**
```tsx
const [mapLoaded, setMapLoaded] = useState(false);

<MapContainer onLoad={() => setMapLoaded(true)}>
  {!mapLoaded && (
    <MapSkeleton>
      <Spinner />
      <p>Loading map...</p>
    </MapSkeleton>
  )}
  
  {mapLoaded && <MapPins pins={visiblePins} />}
</MapContainer>
```

---

## 8️⃣ IMPLEMENTATION CHECKLIST

### Phase 1: Foundation (Week 1)

- [ ] Create `SelectionState` interface
- [ ] Implement `useMapListSync` hook
- [ ] Build shared selection state management
- [ ] Add selection change handlers

### Phase 2: Map Integration (Week 1)

- [ ] Implement pin click → card highlight
- [ ] Implement card click → pin highlight
- [ ] Add map pan on selection
- [ ] Build cluster system

### Phase 3: Interaction Polish (Week 2)

- [ ] Add hover states (desktop)
- [ ] Implement smooth scrolling
- [ ] Build deselection handlers
- [ ] Add keyboard navigation (Escape to deselect)

### Phase 4: Filtering (Week 2)

- [ ] Connect filters to map/list
- [ ] Build filter application UX
- [ ] Add filter count badge
- [ ] Handle selected item filtered out

### Phase 5: Visual Polish (Week 3)

- [ ] Implement color system
- [ ] Build pin size/state animations
- [ ] Add card highlight transitions
- [ ] Create cluster visual design

### Phase 6: Mobile Adaptation (Week 3)

- [ ] Remove hover states on mobile
- [ ] Implement bottom sheet for selections
- [ ] Add tap target size verification
- [ ] Test touch interactions

### Phase 7: Edge Cases (Week 4)

- [ ] Test rapid selection changes
- [ ] Handle empty map bounds
- [ ] Test cluster + selection interaction
- [ ] Add loading states

---

## 9️⃣ SUCCESS CRITERIA

### Functional Requirements

✅ **Perfect Sync**
- Map pin selection === List card selection (always)
- Filter changes update both map and list
- No divergent state possible

✅ **Smooth Interactions**
- Hover shows preview (desktop)
- Click shows full selection
- Deselect works from any source

✅ **Clustering Works**
- Clusters expand correctly
- Selected pins never cluster
- Count badges accurate

✅ **Filter Integration**
- One filter state
- Explicit application
- Clear visual feedback

### Performance Requirements

- Map render < 100ms (50 pins)
- Selection change < 50ms
- Scroll to card < 300ms (smooth)
- Cluster computation < 200ms

### User Experience Goals

- **Predictability:** Selection behavior is obvious
- **Responsiveness:** Immediate visual feedback
- **Clarity:** Always clear what's selected
- **Control:** User in control of all interactions

---

## 🔗 RELATED DOCUMENTATION

- [Context State Contract](/docs/01-ai-features/02-context-state-contract.md)
- [Mobile Bottom Sheet Pattern](/docs/01-ai-features/04-mobile-bottom-sheet.md)
- [Preview System Guide](/docs/preview-system-guide.md)

---

**Document Status:** 🟡 Draft - Pending Review  
**Next Review:** December 27, 2024  
**Approvers:** Design Lead, Engineering Lead
