# 🏗️ FILE REFACTORING & MODULARIZATION GUIDE

**Date:** December 22, 2024  
**Purpose:** Break down large files into clean, modular, maintainable code  
**Target:** All files < 500 lines, single responsibility principle

---

## 📊 FILES REQUIRING REFACTORING

### 🔴 CRITICAL (10,000+ lines)

| File | Current Lines | Target Files | Priority | Status |
|------|--------------|--------------|----------|--------|
| `/components/trip-details/ItineraryFeed.tsx` | ~13,000 | 6 files | P1 | 🔴 Pending |
| `/components/itinerary/TripPlannerLayout.tsx` | ~17,000 | 7 files | P1 | 🔴 Pending |
| `/components/ai/AdvancedAIDemo.tsx` | ~20,000 | 8 files | P1 | 🔴 Pending |

### 🟡 HIGH (5,000+ lines)

| File | Current Lines | Target Files | Priority | Status |
|------|--------------|--------------|----------|--------|
| `/pages/HomeV2.tsx` | ~6,000 | 4 files | P2 | 🔴 Pending |
| `/components/wizard/VenueDetail.tsx` | ~5,500 | 3 files | P2 | 🔴 Pending |

---

## 🎯 REFACTORING STRATEGY

### 1. ITINERARYFE ED.TSX → 6 FILES

**Current Structure:**
```
ItineraryFeed.tsx (13,000 lines)
├─ Imports & Types (100)
├─ Mock Data (200)
├─ DraggableTripItem Component (500)
├─ DroppableDay Component (300)
├─ Main ItineraryFeed Component (12,000)
└─ Export (10)
```

**Target Structure:**
```
/components/trip-details/itinerary/
├─ ItineraryFeed.tsx (300 lines) ⭐ Main orchestrator
├─ ItineraryHeader.tsx (200 lines) ⭐ Trip header component
├─ DraggableItem.tsx (250 lines) ⭐ Draggable activity card
├─ DroppableDay.tsx (200 lines) ⭐ Day container
├─ EmptyDayState.tsx (150 lines) ⭐ Empty state UI
├─ ItineraryStats.tsx (200 lines) ⭐ Statistics sheet
├─ types.ts (100 lines) ⭐ TypeScript types
├─ hooks.ts (200 lines) ⭐ Custom hooks
└─ index.ts (50 lines) ⭐ Public API
```

**Implementation:**

```typescript
// ===== 1. ItineraryHeader.tsx =====
export interface ItineraryHeaderProps {
  trip: TripDetails;
  currentSpend: number;
  isBooked: boolean;
  onShare: () => void;
  onAutoGenerate: () => void;
  onBook: () => void;
}

export function ItineraryHeader({
  trip,
  currentSpend,
  isBooked,
  onShare,
  onAutoGenerate,
  onBook
}: ItineraryHeaderProps) {
  return (
    <div className="relative h-64 w-full">
      {/* Image background */}
      {/* Trip metadata */}
      {/* Action buttons */}
    </div>
  );
}

// ===== 2. DraggableItem.tsx =====
export interface DraggableItemProps {
  item: TripItem;
  dayIndex: number;
  onEdit: (item: TripItem) => void;
}

export const DraggableItem = React.forwardRef<HTMLDivElement, DraggableItemProps>(
  ({ item, dayIndex, onEdit }, ref) => {
    const [{ isDragging }, drag] = useDrag(/* ... */);
    
    return (
      <motion.div ref={drag} /* ... */>
        {/* Item content */}
      </motion.div>
    );
  }
);

// ===== 3. DroppableDay.tsx =====
export interface DroppableDayProps {
  day: Day;
  dayIndex: number;
  children: React.ReactNode;
  onDrop: (index: number, item: any) => void;
}

export function DroppableDay({
  day,
  dayIndex,
  children,
  onDrop
}: DroppableDayProps) {
  const [{ isOver, canDrop }, drop] = useDrop(/* ... */);
  
  return (
    <div ref={drop} /* ... */>
      {children}
    </div>
  );
}

// ===== 4. EmptyDayState.tsx =====
export interface EmptyDayStateProps {
  dayNumber: number;
  onAddActivity: () => void;
}

export function EmptyDayState({ dayNumber, onAddActivity }: EmptyDayStateProps) {
  return (
    <motion.div /* ... */>
      {/* Empty state UI */}
    </motion.div>
  );
}

// ===== 5. hooks.ts =====
export function useItineraryActions() {
  const { days, addItemToDay, moveItem } = useTripDetails();
  
  const handleDrop = useCallback((dayIndex: number, item: any) => {
    /* Drop logic */
  }, [days]);
  
  const handleAutoGenerate = useCallback(() => {
    /* Auto-generate logic */
  }, []);
  
  return { handleDrop, handleAutoGenerate };
}

// ===== 6. types.ts =====
export interface TripItem {
  id: string;
  title: string;
  type: 'food' | 'activity' | 'stay' | 'logistics';
  time: string;
  duration: string;
  cost?: number;
  image?: string;
  notes?: string;
  status?: 'pending' | 'confirmed';
}

export interface Day {
  day: number;
  date: string;
  items: TripItem[];
}

// ===== 7. ItineraryFeed.tsx (Main) =====
import { ItineraryHeader } from './ItineraryHeader';
import { DraggableItem } from './DraggableItem';
import { DroppableDay } from './DroppableDay';
import { EmptyDayState } from './EmptyDayState';
import { useItineraryActions } from './hooks';

export function ItineraryFeed() {
  const { days } = useTripDetails();
  const { handleDrop, handleAutoGenerate } = useItineraryActions();
  
  return (
    <div className="flex flex-col min-h-full">
      <ItineraryHeader /* ... */ />
      
      <div className="max-w-3xl mx-auto w-full px-6 py-8 space-y-12">
        {days.map((day, dayIndex) => (
          <DroppableDay
            key={day.day}
            day={day}
            dayIndex={dayIndex}
            onDrop={handleDrop}
          >
            {day.items.length > 0 ? (
              day.items.map((item) => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  dayIndex={dayIndex}
                  onEdit={/* ... */}
                />
              ))
            ) : (
              <EmptyDayState
                dayNumber={day.day}
                onAddActivity={/* ... */}
              />
            )}
          </DroppableDay>
        ))}
      </div>
    </div>
  );
}
```

---

### 2. TRIPPLANNERLAYOUT.TSX → 7 FILES

**Target Structure:**
```
/components/itinerary/planner/
├─ TripPlannerLayout.tsx (400 lines) ⭐ Main layout
├─ PlannerHeader.tsx (200 lines) ⭐ Header with actions
├─ ActivitySidebar.tsx (300 lines) ⭐ Ideas sidebar
├─ DragDropContext.tsx (250 lines) ⭐ DnD wrapper
├─ TripControls.tsx (200 lines) ⭐ Control buttons
├─ SavedIdeas.tsx (200 lines) ⭐ Saved items list
├─ types.ts (100 lines) ⭐ Types
└─ index.ts (50 lines) ⭐ Exports
```

---

### 3. ADVANCEDAIDEMO.TSX → 8 FILES

**Target Structure:**
```
/components/ai/demo/
├─ AdvancedAIDemo.tsx (400 lines) ⭐ Main demo
├─ AITabs.tsx (200 lines) ⭐ Tab navigation
├─ AgentCard.tsx (250 lines) ⭐ Agent showcase
├─ ProactivePanel.tsx (300 lines) ⭐ Proactive UI
├─ CollaborationView.tsx (300 lines) ⭐ Multi-agent view
├─ EventBusVisualizer.tsx (250 lines) ⭐ Event bus viz
├─ ContextViewer.tsx (200 lines) ⭐ Context display
├─ types.ts (100 lines) ⭐ Types
└─ index.ts (50 lines) ⭐ Exports
```

---

## 🛠️ SERVICE LAYER STRUCTURE

### Create Services Directory

```
/lib/services/
├─ /trip/
│  ├─ TripService.ts          ⭐ CRUD operations
│  ├─ ItineraryService.ts     ⭐ Itinerary logic
│  ├─ ActivityService.ts      ⭐ Activity management
│  └─ OptimizationService.ts  ⭐ Route optimization
│
├─ /ai/
│  ├─ GeminiService.ts        ⭐ Gemini API wrapper
│  ├─ AgentService.ts         ⭐ Agent orchestration
│  ├─ ContextService.ts       ⭐ Context management
│  └─ PromptService.ts        ⭐ Prompt building
│
├─ /booking/
│  ├─ BookingService.ts       ⭐ Booking logic
│  ├─ PaymentService.ts       ⭐ Payment processing
│  └─ ConfirmationService.ts  ⭐ Confirmations
│
├─ /user/
│  ├─ PreferencesService.ts   ⭐ User prefs
│  ├─ ProfileService.ts       ⭐ Profile management
│  └─ SettingsService.ts      ⭐ Settings
│
└─ /analytics/
   ├─ TrackingService.ts      ⭐ Event tracking
   ├─ MetricsService.ts       ⭐ Metrics
   └─ ReportingService.ts     ⭐ Reports
```

---

## 📝 SERVICE IMPLEMENTATION TEMPLATE

```typescript
// ===== TripService.ts =====
import { supabase } from '../supabase/client';
import type { Trip, CreateTripInput, UpdateTripInput } from './types';

export class TripService {
  /**
   * Get all trips for a user
   */
  async getTrips(userId: string): Promise<Trip[]> {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  /**
   * Get a single trip by ID
   */
  async getTrip(tripId: string): Promise<Trip> {
    const { data, error } = await supabase
      .from('trips')
      .select('*, activities(*), days(*)')
      .eq('id', tripId)
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Create a new trip
   */
  async createTrip(input: CreateTripInput): Promise<Trip> {
    const { data, error } = await supabase
      .from('trips')
      .insert(input)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Update a trip
   */
  async updateTrip(tripId: string, input: UpdateTripInput): Promise<Trip> {
    const { data, error } = await supabase
      .from('trips')
      .update(input)
      .eq('id', tripId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  /**
   * Delete a trip
   */
  async deleteTrip(tripId: string): Promise<void> {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId);
    
    if (error) throw error;
  }
}

// Export singleton instance
export const tripService = new TripService();
```

---

## 🎯 HOOKS EXTRACTION PATTERN

```typescript
// ===== useTrip.ts =====
import { useState, useEffect } from 'react';
import { tripService } from '../services/trip/TripService';
import type { Trip } from '../services/trip/types';

export function useTrip(tripId: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadTrip();
  }, [tripId]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      const data = await tripService.getTrip(tripId);
      setTrip(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = async (updates: Partial<Trip>) => {
    try {
      const updated = await tripService.updateTrip(tripId, updates);
      setTrip(updated);
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    trip,
    loading,
    error,
    updateTrip,
    reload: loadTrip
  };
}
```

---

## ✅ REFACTORING CHECKLIST

### Before Starting
- [ ] Read entire file to understand structure
- [ ] Identify logical components
- [ ] Map dependencies
- [ ] Plan extraction order
- [ ] Create types file first

### During Refactoring
- [ ] Extract one component at a time
- [ ] Create types/interfaces
- [ ] Extract hooks
- [ ] Update imports
- [ ] Test each extraction
- [ ] Verify no regressions

### After Refactoring
- [ ] Run TypeScript check
- [ ] Run build
- [ ] Test all features
- [ ] Update documentation
- [ ] Commit changes

---

## 📊 SUCCESS METRICS

### File Size
- **Before:** 10,000-20,000 lines
- **After:** <500 lines per file
- **Target:** 100% compliance

### Maintainability
- **Before:** Single responsibility violated
- **After:** Clear separation of concerns
- **Target:** Each file = one purpose

### Reusability
- **Before:** Duplicated logic
- **After:** Extracted hooks and utils
- **Target:** 80% code reuse

---

## 🚀 EXECUTION PLAN

### Week 1 (40h)
**Days 1-2:** ItineraryFeed refactoring (8h)
**Days 3-4:** TripPlannerLayout refactoring (8h)
**Day 5:** AdvancedAIDemo refactoring (8h)
**Weekend:** Service layer creation (16h)

### Week 2 (40h)
**Days 1-2:** Hooks extraction (16h)
**Days 3-4:** Testing & verification (16h)
**Day 5:** Documentation & polish (8h)

---

**Status:** 🔴 Ready to Execute  
**Next Step:** Start ItineraryFeed refactoring  
**ETA:** 2 weeks (80 hours)

---

**Created:** December 22, 2024  
**Last Updated:** December 22, 2024
