# CONTEXT & STATE CONTRACT — CHAT → EXPLORE → MAP

**Status:** 🔴 Critical - In Definition  
**Owner:** Product + Design + Engineering  
**Priority:** P0 - Blocker  
**Created:** December 24, 2024

---

## 🎯 Executive Summary

**Problem:** Context loss between Chat → Explore creates confusion and breaks user trust.

**Solution:** Define a canonical state contract that governs all exploration contexts across Chat, Explore, Map, and Preview systems.

**Impact:** Eliminates the #1 critical blocker preventing production launch.

---

## 1️⃣ CANONICAL MENTAL MODEL

### The Core Principle

**ONE user prompt → ONE exploration context → MULTIPLE lenses**

```
User: "Show me romantic restaurants in El Poblado"
       ↓
   [Context Created]
       ↓
   ┌───────────────────────────────────┐
   │   ExplorationContext Object       │
   │   - intent: "restaurants"         │
   │   - area: "El Poblado"            │
   │   - vibe: "romantic"              │
   │   - results: [...restaurants]     │
   └───────────────────────────────────┘
       ↓
   ┌─────────┬──────────┬──────────┬──────────┐
   │  Chat   │ Explore  │   Map    │ Preview  │
   │ (Advisor)│(Workspace)│(Spatial) │ (Gate)   │
   └─────────┴──────────┴──────────┴──────────┘
```

### Role Definitions

| System | Role | Responsibility |
|--------|------|----------------|
| **Chat** | Advisor | Surfaces top suggestions, explains intent |
| **Explore** | Workspace | Renders full result set with filters |
| **Map** | Spatial Lens | Shows geographic distribution |
| **Preview** | Approval Gate | Allows user to review before applying |

**Rules:**
- ✅ One context object shared by all systems
- ✅ Systems are lenses, not separate states
- ✅ User controls which lens to view
- ❌ Systems NEVER create conflicting contexts

---

## 2️⃣ CONTEXT OBJECT (SINGLE SOURCE OF TRUTH)

### TypeScript Schema

```typescript
/**
 * ExplorationContext - Canonical state for all exploration flows
 * Created by Chat AI or manual Explore interactions
 */
interface ExplorationContext {
  // Core Identity
  id: string;                    // Unique context ID for tracking
  source: 'ai' | 'manual';       // How this context was created
  createdAt: Date;               // Timestamp
  expiresAt: Date;               // Context lifetime (30 min default)
  
  // Primary Intent
  intent: {
    type: 'restaurants' | 'events' | 'rentals' | 'destinations' | 'mixed';
    query: string;               // Original user query
    vibe?: string;               // "romantic", "adventurous", "family-friendly"
    filters?: {
      priceRange?: [number, number];
      rating?: number;
      tags?: string[];
      date?: Date;
      time?: 'breakfast' | 'lunch' | 'dinner' | 'late-night';
    };
  };
  
  // Geographic Scope
  location: {
    area: string;                // "El Poblado", "Laureles", etc.
    city: string;                // "Medellín"
    center: [number, number];    // [lat, lng]
    radius?: number;             // meters (default: 2000)
    bounds?: {                   // Bounding box for map
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
  
  // Time Relevance
  temporal?: {
    date?: Date;                 // Specific date
    dateRange?: [Date, Date];    // Date range
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    duration?: number;           // minutes
  };
  
  // Results (Primary)
  results: {
    restaurants?: Restaurant[];
    events?: Event[];
    rentals?: Rental[];
    destinations?: Destination[];
  };
  
  // Results Metadata
  resultsMeta: {
    totalCount: number;
    displayedCount: number;
    hasMore: boolean;
    primaryType: 'restaurants' | 'events' | 'rentals' | 'destinations';
    secondaryTypes?: string[];   // Related content types
  };
  
  // AI Reasoning (if source === 'ai')
  aiContext?: {
    reasoning: string;           // "Based on your preference for outdoor activities..."
    confidence: number;          // 0-1
    alternatives?: {
      query: string;
      reasoning: string;
    }[];
  };
  
  // Map Visualization
  mapState: {
    pins: MapPin[];
    clusters?: MapCluster[];
    selectedPinId?: string;
    zoom: number;                // 12-18 typical
  };
  
  // Active Selections
  selection?: {
    itemId: string;
    itemType: 'restaurant' | 'event' | 'rental' | 'destination';
  };
}
```

### Supporting Types

```typescript
interface MapPin {
  id: string;
  lat: number;
  lng: number;
  type: 'restaurant' | 'event' | 'rental' | 'destination';
  itemId: string;              // References actual item
  priority: 'primary' | 'secondary';
}

interface MapCluster {
  id: string;
  lat: number;
  lng: number;
  count: number;
  pinIds: string[];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}
```

### Default Values

```typescript
const DEFAULT_EXPLORATION_CONTEXT: Partial<ExplorationContext> = {
  source: 'manual',
  location: {
    radius: 2000,              // 2km default
    city: 'Medellín',
  },
  mapState: {
    zoom: 14,
  },
  expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
};
```

---

## 3️⃣ ROUTE CONTRACT

### URL Structure

```
/explore?source={source}&intent={type}&area={area}&ctx={contextId}
```

### Query Parameters

| Parameter | Required | Type | Description | Example |
|-----------|----------|------|-------------|---------|
| `source` | ✅ Yes | `ai` \| `manual` | How context was created | `ai` |
| `intent` | ✅ Yes | `restaurants` \| `events` \| `rentals` \| `destinations` | Primary content type | `restaurants` |
| `area` | ✅ Yes | string | Geographic area name | `el-poblado` |
| `ctx` | ⚠️ Optional | string (uuid) | Context ID for persistence | `550e8400-e29b...` |
| `vibe` | ⚠️ Optional | string | Mood/atmosphere filter | `romantic` |
| `lat` | ⚠️ Optional | number | Center latitude | `6.2476` |
| `lng` | ⚠️ Optional | number | Center longitude | `-75.5658` |
| `zoom` | ⚠️ Optional | number | Map zoom level | `14` |

### Route Examples

**AI-Generated Context:**
```
/explore?source=ai&intent=restaurants&area=el-poblado&vibe=romantic&ctx=550e8400-e29b-41d4-a716-446655440000
```

**Manual Browse:**
```
/explore?source=manual&intent=events&area=laureles
```

**Direct Link with Location:**
```
/explore?source=manual&intent=rentals&area=envigado&lat=6.1719&lng=-75.5936&zoom=15
```

### Missing Parameter Handling

| Scenario | Behavior | Fallback |
|----------|----------|----------|
| Missing `source` | Default to `manual` | Show browse UI, not AI suggestions |
| Missing `intent` | Redirect to `/explore` with tab selector | Default to `restaurants` |
| Missing `area` | Use map center or user location | Default to `el-poblado` |
| Missing `ctx` | Create new ephemeral context | Auto-generate context ID |
| Invalid `ctx` | Check if expired or invalid | Create new context, show warning |

### Context Persistence Rules

**On Navigation:**
```typescript
// User clicks Chat suggestion
Chat → Creates context → Navigates to /explore with ctx ID

// Context stored in:
1. URL query params (ctx=...)
2. SessionStorage (30 min TTL)
3. TripContext state (via useExploration hook)
```

**On Refresh:**
```typescript
// Page refreshes with ctx in URL
1. Check SessionStorage for context
2. If found + not expired → restore state
3. If expired → show "Context expired" banner
4. If not found → create new manual context
```

**On Back/Forward:**
```typescript
// Browser navigation
1. URL params preserved by browser
2. SessionStorage restoration
3. Map state restored from context
4. Scroll position NOT restored (performance)
```

### State Management

```typescript
// Custom hook for Explore page
function useExplorationContext(urlParams: URLSearchParams) {
  const ctxId = urlParams.get('ctx');
  
  // Try to restore from session
  const savedContext = useMemo(() => {
    if (ctxId) {
      const stored = sessionStorage.getItem(`exploration:${ctxId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check expiration
        if (new Date(parsed.expiresAt) > new Date()) {
          return parsed;
        }
      }
    }
    return null;
  }, [ctxId]);
  
  // Create new if needed
  const [context, setContext] = useState<ExplorationContext>(
    savedContext || createContextFromParams(urlParams)
  );
  
  // Persist on changes
  useEffect(() => {
    sessionStorage.setItem(
      `exploration:${context.id}`,
      JSON.stringify(context)
    );
  }, [context]);
  
  return { context, setContext };
}
```

---

## 4️⃣ RENDERING RULES (MANDATORY)

### Primary Intent Rendering

**Rule 1: Above the Fold Priority**
```
✅ DO: Primary intent results appear first, always visible
❌ DON'T: Bury primary results below secondary content
```

**Implementation:**
```typescript
// Explore page layout
<ExplorePage>
  {/* Primary Intent - Always First */}
  <PrimaryResults 
    type={context.intent.type}
    results={context.results[context.intent.type]}
    source={context.source}
  />
  
  {/* Secondary Content - Collapsed by Default */}
  {context.resultsMeta.secondaryTypes?.map(type => (
    <SecondaryResults 
      key={type}
      type={type}
      collapsed={true}
      results={context.results[type]}
    />
  ))}
</ExplorePage>
```

### Secondary Content Behavior

**Rule 2: Collapsed by Default**
```
✅ DO: Show "Also consider: 5 events nearby" (collapsed)
❌ DON'T: Auto-expand secondary sections
```

**Visual Treatment:**
- Header with count badge
- "Expand" affordance
- Subtle visual separation (not prominent)

### Map Synchronization

**Rule 3: Map Always Reflects Dataset**
```
✅ DO: Map pins === List items (1:1 correspondence)
❌ DON'T: Show pins for items not in list
❌ DON'T: Show list items without pins
```

**Sync Rules:**
```typescript
// Map pins derived from results
const mapPins = useMemo(() => {
  const allResults = [
    ...(context.results.restaurants || []),
    ...(context.results.events || []),
  ];
  
  return allResults.map(item => ({
    id: `pin-${item.id}`,
    lat: item.lat,
    lng: item.lng,
    type: item.type,
    itemId: item.id,
    priority: item.type === context.intent.type ? 'primary' : 'secondary',
  }));
}, [context.results, context.intent.type]);
```

### Mutation Prevention

**Rule 4: No Auto-Mutations**
```
✅ DO: Preview system for all mutations
❌ DON'T: Auto-add to trip without preview
❌ DON'T: Auto-apply filters without user action
❌ DON'T: Auto-remove items from view
```

**Mutation Flow:**
```
User Action → Preview Generated → User Approves → Mutation Applied
```

### Filter Application

**Rule 5: Explicit Filter Actions**
```
✅ DO: "Apply Filters" button
✅ DO: Show filter count badge when active
❌ DON'T: Apply filters on every keystroke
❌ DON'T: Apply filters automatically
```

### Loading States

**Rule 6: Progressive Enhancement**
```
✅ DO: Show skeleton screens for async content
✅ DO: Render map immediately with loading pins
❌ DON'T: Block entire page on data fetch
❌ DON'T: Show spinners without context
```

---

## 5️⃣ FAILURE MODES (EXPLICIT PREVENTION)

### Forbidden Behaviors

#### 🚫 Blank Explore State

**NEVER:**
```typescript
// DON'T: Render empty explore page
<ExplorePage>
  <EmptyState />
</ExplorePage>
```

**ALWAYS:**
```typescript
// DO: Provide fallback content
<ExplorePage>
  {results.length === 0 ? (
    <EmptyStateWithSuggestions
      message="No restaurants found in El Poblado"
      suggestions={[
        { area: "Laureles", count: 12 },
        { area: "Envigado", count: 8 },
      ]}
      cta="Browse all areas"
    />
  ) : (
    <Results items={results} />
  )}
</ExplorePage>
```

#### 🚫 Mixed Unrelated Content

**NEVER:**
```typescript
// DON'T: Show restaurants when user asked for events
intent.type === 'events'
// But rendering:
<RestaurantGrid restaurants={...} />
```

**ALWAYS:**
```typescript
// DO: Strict type matching
{context.intent.type === 'restaurants' && (
  <RestaurantGrid restaurants={context.results.restaurants} />
)}

{context.intent.type === 'events' && (
  <EventGrid events={context.results.events} />
)}
```

#### 🚫 Auto-Add to Trips

**NEVER:**
```typescript
// DON'T: Mutations without preview
function handleCardClick(item) {
  dispatch({ type: 'ADD_TO_TRIP', item }); // ❌ FORBIDDEN
}
```

**ALWAYS:**
```typescript
// DO: Always use preview system
function handleAddToTrip(item) {
  const preview = createAdditionPreview(item);
  dispatch({ type: 'SHOW_PREVIEW', preview });
}
```

#### 🚫 Conflicting Map/List Selections

**NEVER:**
```typescript
// DON'T: Separate state for map and list
const [selectedCard, setSelectedCard] = useState(null);
const [selectedPin, setSelectedPin] = useState(null);
// These can diverge! ❌
```

**ALWAYS:**
```typescript
// DO: Single source of truth
const [selection, setSelection] = useState<Selection | null>(null);

// Map and list both read from same state
<MapComponent selectedId={selection?.itemId} />
<ListComponent selectedId={selection?.itemId} />
```

### Error Recovery

#### Context Expired
```typescript
if (isContextExpired(context)) {
  return (
    <Banner variant="warning">
      This search has expired. 
      <Button onClick={recreateContext}>Search again</Button>
    </Banner>
  );
}
```

#### Invalid Context ID
```typescript
if (ctxId && !isValidContext(ctxId)) {
  // Redirect to clean URL
  router.replace('/explore?source=manual&intent=restaurants&area=el-poblado');
}
```

#### Network Failure
```typescript
if (error) {
  return (
    <ErrorState
      title="Couldn't load results"
      message="Check your connection and try again"
      actions={[
        { label: 'Retry', onClick: refetch },
        { label: 'Browse offline', onClick: showCachedResults },
      ]}
    />
  );
}
```

---

## 6️⃣ IMPLEMENTATION CHECKLIST

### Phase 1: Foundation (Week 1)

- [ ] Define `ExplorationContext` TypeScript interface
- [ ] Create `useExplorationContext` hook
- [ ] Implement SessionStorage persistence
- [ ] Add URL param parsing/serialization
- [ ] Create context factory functions

### Phase 2: Chat Integration (Week 1)

- [ ] Update Chat to generate `ExplorationContext`
- [ ] Add "View on Map" CTA with context ID
- [ ] Implement context handoff to Explore
- [ ] Test context restoration on back navigation

### Phase 3: Explore Page (Week 2)

- [ ] Refactor Explore to consume context
- [ ] Implement primary/secondary rendering
- [ ] Add "AI suggested" badges
- [ ] Build context expired handling
- [ ] Add missing parameter fallbacks

### Phase 4: Map Synchronization (Week 2)

- [ ] Derive map pins from context results
- [ ] Implement shared selection state
- [ ] Build cluster → list expansion
- [ ] Add map bounds → filter sync

### Phase 5: Testing & Validation (Week 3)

- [ ] Test all failure modes
- [ ] Verify context persistence across refresh
- [ ] Test expired context handling
- [ ] Validate map/list sync in all states
- [ ] Load test with large result sets

---

## 7️⃣ SUCCESS CRITERIA

### Functional Requirements

✅ **Context Persistence**
- User refreshes → state restored
- User navigates back → context preserved
- Context expires → clear error message

✅ **No Blank States**
- Invalid params → sensible defaults
- No results → helpful suggestions
- Network error → retry options

✅ **Mutation Safety**
- All changes go through preview
- No auto-add to trip
- No filter auto-application

✅ **Map/List Sync**
- Selection always synchronized
- Pin count === List count
- Filters applied consistently

### User Experience Goals

- **Clarity:** User always knows what they're viewing and why
- **Control:** User always in control of mutations
- **Continuity:** Context preserved across navigation
- **Trust:** No unexpected behavior or data loss

---

## 8️⃣ EXAMPLES & FLOWS

### Example 1: AI Chat → Explore

**User Action:**
```
User: "Show me rooftop bars in Poblado"
```

**System Response:**

1. **Chat Agent Creates Context:**
```typescript
const context: ExplorationContext = {
  id: uuid(),
  source: 'ai',
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 30 * 60 * 1000),
  intent: {
    type: 'restaurants',
    query: 'rooftop bars in Poblado',
    vibe: 'upscale',
    filters: {
      tags: ['rooftop', 'bar'],
    },
  },
  location: {
    area: 'El Poblado',
    city: 'Medellín',
    center: [6.2476, -75.5658],
    radius: 2000,
  },
  results: {
    restaurants: [...aiResults],
  },
  resultsMeta: {
    totalCount: 12,
    displayedCount: 3,
    hasMore: true,
    primaryType: 'restaurants',
  },
  aiContext: {
    reasoning: 'Based on your preference for nightlife and views',
    confidence: 0.85,
  },
  mapState: {
    pins: [...],
    zoom: 14,
  },
};
```

2. **Chat Displays Top 3:**
```tsx
<ChatMessage role="assistant">
  <p>I found 12 rooftop bars in El Poblado. Here are the top 3:</p>
  <ResultCards items={context.results.restaurants.slice(0, 3)} />
  <Button onClick={() => navigateToExplore(context.id)}>
    View all 12 on map →
  </Button>
</ChatMessage>
```

3. **User Clicks "View all":**
```typescript
// Navigation with context ID
router.push(`/explore?source=ai&intent=restaurants&area=el-poblado&ctx=${context.id}`);

// Context saved to SessionStorage
sessionStorage.setItem(`exploration:${context.id}`, JSON.stringify(context));
```

4. **Explore Page Loads:**
```tsx
function ExplorePage() {
  const params = useSearchParams();
  const { context } = useExplorationContext(params);
  
  return (
    <>
      {/* AI Context Banner */}
      {context.source === 'ai' && (
        <AIContextBanner>
          🤖 Showing rooftop bars in El Poblado
          <span>{context.aiContext.reasoning}</span>
        </AIContextBanner>
      )}
      
      {/* Primary Results */}
      <RestaurantGrid 
        restaurants={context.results.restaurants}
        primaryTags={context.intent.filters?.tags}
      />
      
      {/* Map */}
      <MapView
        pins={context.mapState.pins}
        center={context.location.center}
        zoom={context.mapState.zoom}
      />
    </>
  );
}
```

### Example 2: Manual Explore → Filter → Refresh

**User Flow:**

1. User navigates to `/explore`
2. Selects "Restaurants" tab
3. Picks "Laureles" area
4. Applies filters: "$$$", "Italian"
5. Refreshes page

**Expected Behavior:**
```typescript
// URL after filters applied
/explore?source=manual&intent=restaurants&area=laureles&price=3&cuisine=italian&ctx=abc123

// On refresh:
1. Parse URL params
2. Check SessionStorage for ctx=abc123
3. Restore filters: { priceRange: [3, 3], tags: ['italian'] }
4. Re-render with same results
```

### Example 3: Context Expiration

**Scenario:** User leaves tab open for 35 minutes

**Expected Behavior:**
```tsx
// Context expires after 30 minutes
if (new Date() > new Date(context.expiresAt)) {
  return (
    <ExpiredContextBanner>
      <Icon name="clock" />
      <div>
        <h4>Search expired</h4>
        <p>Results may have changed. Search again to see updates.</p>
      </div>
      <Button onClick={refreshContext}>
        Refresh results
      </Button>
    </ExpiredContextBanner>
  );
}
```

---

## 9️⃣ REFERENCES

### Related Documentation
- [Preview System Guide](/docs/preview-system-guide.md)
- [Context Provider API](/docs/context-provider-api.md)
- [Event Bus Specification](/docs/event-bus-spec.md)

### Code Files
- `/src/contexts/TripContext.tsx` - Global state management
- `/src/hooks/useExplorationContext.ts` - Context hook (to be created)
- `/src/utils/context-factory.ts` - Context creation utilities (to be created)

---

**Document Status:** 🟡 Draft - Pending Review  
**Next Review:** December 27, 2024  
**Approvers:** Product, Design, Engineering Leads
