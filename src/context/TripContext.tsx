/**
 * TRIP CONTEXT - Main Context Provider
 * 
 * Central state management for the entire Trip Operating System.
 * Manages: trips, events, restaurants, rentals, destinations, budget, conflicts
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useReducer } from 'react';
import {
  TripState,
  Trip,
  TripEntity,
  TripDay,
  Restaurant,
  Event,
  Rental,
  Destination,
  Budget,
  UserPreferences,
  Location,
  ScheduleConflict
} from './types/TripTypes';
import { eventBus, EventType, EntityEventPayload } from './EventBus';
import { conflictDetector, ConflictDetectionOptions } from './ConflictDetector';
import { budgetTracker } from './BudgetTracker';

// ============================================================================
// CONTEXT DEFINITION
// ============================================================================

interface TripContextValue extends TripState {
  // Trip Management
  createTrip: (trip: Partial<Trip>) => Trip;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;
  setCurrentTrip: (tripId: string | null) => void;
  
  // Entity Management
  addEntity: (entity: TripEntity, date: string, options?: AddEntityOptions) => AddEntityResult;
  removeEntity: (entityId: string, date: string) => void;
  updateEntity: (entityId: string, updates: Partial<TripEntity>) => void;
  
  // Save/Bookmark
  saveEntity: (entity: TripEntity) => void;
  unsaveEntity: (entityId: string, entityType: TripEntity['type']) => void;
  
  // Available Items (not yet in trip)
  setAvailableRestaurants: (restaurants: Restaurant[]) => void;
  setAvailableEvents: (events: Event[]) => void;
  setAvailableRentals: (rentals: Rental[]) => void;
  setAvailableDestinations: (destinations: Destination[]) => void;
  
  // Conflict Management
  checkConflicts: (entity: TripEntity, date: string) => ScheduleConflict[];
  resolveConflict: (conflictId: string) => void;
  
  // Budget
  getBudget: () => Budget | null;
  checkBudgetImpact: (entity: TripEntity) => {
    canAfford: boolean;
    newTotal: number;
    remaining: number;
    alerts: any[];
  };
  
  // Preferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Utility
  getDay: (date: string) => TripDay | null;
  refreshTrip: () => void;
}

const TripContext = createContext<TripContextValue | null>(null);

// ============================================================================
// INITIAL STATE
// ============================================================================

const defaultPreferences: UserPreferences = {
  cuisines: [],
  dietaryRestrictions: [],
  priceRange: { min: 0, max: 1000 },
  interests: [],
  activityLevel: 'moderate',
  preferredTransport: ['walk', 'taxi'],
  maxWalkingDistance: 1500,
  pacing: 'moderate',
  morningStart: '09:00',
  eveningEnd: '22:00',
  accommodationType: ['apartment', 'hotel'],
  amenitiesRequired: [],
  language: 'en',
  currency: 'USD',
  timezone: 'America/New_York'
};

const initialState: TripState = {
  currentTrip: null,
  trips: [],
  availableRestaurants: [],
  availableEvents: [],
  availableRentals: [],
  availableDestinations: [],
  savedItems: {
    restaurants: [],
    events: [],
    rentals: [],
    destinations: []
  },
  userPreferences: defaultPreferences,
  isLoading: false
};

// ============================================================================
// TYPES
// ============================================================================

interface AddEntityOptions {
  skipConflictCheck?: boolean;
  autoResolveConflicts?: boolean;
}

interface AddEntityResult {
  success: boolean;
  conflicts?: ScheduleConflict[];
  message?: string;
  updatedEntity?: TripEntity;
}

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TripState>(initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tripState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Restore dates
        if (parsed.currentTrip) {
          parsed.currentTrip = deserializeTrip(parsed.currentTrip);
        }
        parsed.trips = parsed.trips.map(deserializeTrip);
        setState({ ...initialState, ...parsed });
      } catch (error) {
        console.error('Failed to load trip state:', error);
      }
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('tripState', JSON.stringify(state));
    }, 500); // Debounce saves

    return () => clearTimeout(timer);
  }, [state]);

  // ============================================================================
  // TRIP MANAGEMENT
  // ============================================================================

  const createTrip = useCallback((tripData: Partial<Trip>): Trip => {
    const trip: Trip = {
      id: `trip-${Date.now()}`,
      name: tripData.name || 'New Trip',
      destination: tripData.destination || 'Unknown',
      startDate: tripData.startDate || new Date().toISOString().split('T')[0],
      endDate: tripData.endDate || new Date().toISOString().split('T')[0],
      duration: tripData.duration || 1,
      days: tripData.days || [],
      budget: tripData.budget || {
        total: 1000,
        currency: 'USD',
        breakdown: {
          restaurants: 0,
          events: 0,
          rentals: 0,
          activities: 0,
          travel: 0,
          other: 0
        },
        spent: 0,
        remaining: 1000,
        alerts: []
      },
      preferences: tripData.preferences || state.userPreferences,
      status: 'planning',
      lastModified: new Date(),
      createdAt: new Date()
    };

    setState(prev => ({
      ...prev,
      trips: [...prev.trips, trip],
      currentTrip: trip
    }));

    eventBus.publish('trip.created', {
      timestamp: new Date(),
      source: 'TripContext',
      tripId: trip.id,
      trip
    } as any);

    return trip;
  }, [state.userPreferences]);

  const updateTrip = useCallback((tripId: string, updates: Partial<Trip>) => {
    setState(prev => {
      const trips = prev.trips.map(trip =>
        trip.id === tripId
          ? { ...trip, ...updates, lastModified: new Date() }
          : trip
      );

      const currentTrip = prev.currentTrip?.id === tripId
        ? { ...prev.currentTrip, ...updates, lastModified: new Date() }
        : prev.currentTrip;

      return { ...prev, trips, currentTrip };
    });

    eventBus.publish('trip.updated', {
      timestamp: new Date(),
      source: 'TripContext',
      tripId,
      updates
    } as any);
  }, []);

  const deleteTrip = useCallback((tripId: string) => {
    setState(prev => ({
      ...prev,
      trips: prev.trips.filter(t => t.id !== tripId),
      currentTrip: prev.currentTrip?.id === tripId ? null : prev.currentTrip
    }));

    eventBus.publish('trip.deleted', {
      timestamp: new Date(),
      source: 'TripContext',
      tripId
    } as any);
  }, []);

  const setCurrentTrip = useCallback((tripId: string | null) => {
    setState(prev => ({
      ...prev,
      currentTrip: tripId ? prev.trips.find(t => t.id === tripId) || null : null
    }));
  }, []);

  // ============================================================================
  // ENTITY MANAGEMENT
  // ============================================================================

  const addEntity = useCallback((
    entity: TripEntity,
    date: string,
    options: AddEntityOptions = {}
  ): AddEntityResult => {
    if (!state.currentTrip) {
      return { success: false, message: 'No active trip' };
    }

    // Find or create day
    let day = state.currentTrip.days.find(d => d.date === date);
    if (!day) {
      day = createDay(date, state.currentTrip);
      state.currentTrip.days.push(day);
    }

    // Check conflicts
    if (!options.skipConflictCheck) {
      const conflicts = conflictDetector.detectConflicts(entity, day);
      
      if (conflicts.length > 0) {
        // Check if blocking
        const hasBlocking = conflicts.some(c => c.severity === 'blocking');
        
        if (hasBlocking) {
          return {
            success: false,
            conflicts,
            message: 'Blocking conflicts detected. Please resolve before adding.'
          };
        }

        // Auto-resolve if requested
        if (options.autoResolveConflicts) {
          const result = conflictDetector.autoResolveConflicts(conflicts, entity, day);
          if (result.resolved && result.updatedEntity) {
            entity = result.updatedEntity;
          } else {
            return {
              success: false,
              conflicts,
              message: 'Cannot auto-resolve conflicts.'
            };
          }
        } else {
          // Return conflicts for user to resolve
          return {
            success: false,
            conflicts,
            message: 'Conflicts detected. Review before adding.'
          };
        }
      }
    }

    // Add entity to day
    day.items.push(entity);

    // Update trip state
    setState(prev => {
      const updatedTrip = { ...prev.currentTrip! };
      const dayIndex = updatedTrip.days.findIndex(d => d.date === date);
      if (dayIndex >= 0) {
        updatedTrip.days[dayIndex] = recalculateDayStats(day!);
      }

      // Recalculate budget
      updatedTrip.budget = budgetTracker.calculateBudget(updatedTrip);

      return {
        ...prev,
        currentTrip: updatedTrip,
        trips: prev.trips.map(t => t.id === updatedTrip.id ? updatedTrip : t)
      };
    });

    // Publish event
    eventBus.publish('entity.added', {
      timestamp: new Date(),
      source: 'TripContext',
      tripId: state.currentTrip.id,
      entityType: entity.type,
      entityId: entity.id,
      entity
    } as EntityEventPayload);

    return { success: true, message: 'Entity added successfully' };
  }, [state.currentTrip]);

  const removeEntity = useCallback((entityId: string, date: string) => {
    if (!state.currentTrip) return;

    setState(prev => {
      const updatedTrip = { ...prev.currentTrip! };
      const day = updatedTrip.days.find(d => d.date === date);
      
      if (day) {
        const entity = day.items.find(i => i.id === entityId);
        day.items = day.items.filter(i => i.id !== entityId);
        recalculateDayStats(day);

        // Recalculate budget
        updatedTrip.budget = budgetTracker.calculateBudget(updatedTrip);

        // Publish event
        if (entity) {
          eventBus.publish('entity.removed', {
            timestamp: new Date(),
            source: 'TripContext',
            tripId: updatedTrip.id,
            entityType: entity.type,
            entityId: entity.id,
            entity
          } as EntityEventPayload);
        }
      }

      return {
        ...prev,
        currentTrip: updatedTrip,
        trips: prev.trips.map(t => t.id === updatedTrip.id ? updatedTrip : t)
      };
    });
  }, [state.currentTrip]);

  const updateEntity = useCallback((entityId: string, updates: Partial<TripEntity>) => {
    if (!state.currentTrip) return;

    setState(prev => {
      const updatedTrip = { ...prev.currentTrip! };
      
      updatedTrip.days.forEach(day => {
        const index = day.items.findIndex(i => i.id === entityId);
        if (index >= 0) {
          const previous = day.items[index];
          day.items[index] = { ...day.items[index], ...updates };
          
          // Publish event
          eventBus.publish('entity.updated', {
            timestamp: new Date(),
            source: 'TripContext',
            tripId: updatedTrip.id,
            entityType: day.items[index].type,
            entityId,
            entity: day.items[index],
            previousEntity: previous,
            changes: updates
          } as EntityEventPayload);
        }
      });

      return {
        ...prev,
        currentTrip: updatedTrip,
        trips: prev.trips.map(t => t.id === updatedTrip.id ? updatedTrip : t)
      };
    });
  }, [state.currentTrip]);

  // ============================================================================
  // SAVE/BOOKMARK
  // ============================================================================

  const saveEntity = useCallback((entity: TripEntity) => {
    setState(prev => {
      const savedItems = { ...prev.savedItems };
      
      switch (entity.type) {
        case 'restaurant':
          if (!savedItems.restaurants.find(r => r.id === entity.id)) {
            savedItems.restaurants.push({ ...entity, saved: true } as Restaurant);
          }
          break;
        case 'event':
          if (!savedItems.events.find(e => e.id === entity.id)) {
            savedItems.events.push({ ...entity, saved: true } as Event);
          }
          break;
        case 'rental':
          if (!savedItems.rentals.find(r => r.id === entity.id)) {
            savedItems.rentals.push({ ...entity, saved: true } as Rental);
          }
          break;
        case 'destination':
          if (!savedItems.destinations.find(d => d.id === entity.id)) {
            savedItems.destinations.push({ ...entity, saved: true } as Destination);
          }
          break;
      }

      return { ...prev, savedItems };
    });

    eventBus.publish('entity.saved', {
      timestamp: new Date(),
      source: 'TripContext',
      entityType: entity.type,
      entityId: entity.id,
      entity
    } as EntityEventPayload);
  }, []);

  const unsaveEntity = useCallback((entityId: string, entityType: TripEntity['type']) => {
    setState(prev => {
      const savedItems = { ...prev.savedItems };
      
      switch (entityType) {
        case 'restaurant':
          savedItems.restaurants = savedItems.restaurants.filter(r => r.id !== entityId);
          break;
        case 'event':
          savedItems.events = savedItems.events.filter(e => e.id !== entityId);
          break;
        case 'rental':
          savedItems.rentals = savedItems.rentals.filter(r => r.id !== entityId);
          break;
        case 'destination':
          savedItems.destinations = savedItems.destinations.filter(d => d.id !== entityId);
          break;
      }

      return { ...prev, savedItems };
    });

    eventBus.publish('entity.unsaved', {
      timestamp: new Date(),
      source: 'TripContext',
      entityType,
      entityId,
      entity: {} as any
    } as EntityEventPayload);
  }, []);

  // ============================================================================
  // AVAILABLE ITEMS
  // ============================================================================

  const setAvailableRestaurants = useCallback((restaurants: Restaurant[]) => {
    setState(prev => ({ ...prev, availableRestaurants: restaurants }));
  }, []);

  const setAvailableEvents = useCallback((events: Event[]) => {
    setState(prev => ({ ...prev, availableEvents: events }));
  }, []);

  const setAvailableRentals = useCallback((rentals: Rental[]) => {
    setState(prev => ({ ...prev, availableRentals: rentals }));
  }, []);

  const setAvailableDestinations = useCallback((destinations: Destination[]) => {
    setState(prev => ({ ...prev, availableDestinations: destinations }));
  }, []);

  // ============================================================================
  // CONFLICT MANAGEMENT
  // ============================================================================

  const checkConflicts = useCallback((entity: TripEntity, date: string): ScheduleConflict[] => {
    if (!state.currentTrip) return [];

    const day = state.currentTrip.days.find(d => d.date === date);
    if (!day) return [];

    return conflictDetector.detectConflicts(entity, day);
  }, [state.currentTrip]);

  const resolveConflict = useCallback((conflictId: string) => {
    // Implementation depends on conflict resolution UI
    console.log('Resolving conflict:', conflictId);
  }, []);

  // ============================================================================
  // BUDGET
  // ============================================================================

  const getBudget = useCallback((): Budget | null => {
    return state.currentTrip?.budget || null;
  }, [state.currentTrip]);

  const checkBudgetImpact = useCallback((entity: TripEntity) => {
    if (!state.currentTrip) {
      return { canAfford: true, newTotal: 0, remaining: 0, alerts: [] };
    }

    return budgetTracker.checkBudgetImpact(entity, state.currentTrip.budget);
  }, [state.currentTrip]);

  // ============================================================================
  // PREFERENCES
  // ============================================================================

  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    setState(prev => ({
      ...prev,
      userPreferences: { ...prev.userPreferences, ...preferences }
    }));

    eventBus.publish('user.preferences.updated', {
      timestamp: new Date(),
      source: 'TripContext',
      preferences
    } as any);
  }, []);

  // ============================================================================
  // UTILITY
  // ============================================================================

  const getDay = useCallback((date: string): TripDay | null => {
    return state.currentTrip?.days.find(d => d.date === date) || null;
  }, [state.currentTrip]);

  const refreshTrip = useCallback(() => {
    if (!state.currentTrip) return;

    setState(prev => {
      const updatedTrip = { ...prev.currentTrip! };
      updatedTrip.budget = budgetTracker.calculateBudget(updatedTrip);
      
      return {
        ...prev,
        currentTrip: updatedTrip,
        trips: prev.trips.map(t => t.id === updatedTrip.id ? updatedTrip : t)
      };
    });
  }, [state.currentTrip]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: TripContextValue = {
    ...state,
    createTrip,
    updateTrip,
    deleteTrip,
    setCurrentTrip,
    addEntity,
    removeEntity,
    updateEntity,
    saveEntity,
    unsaveEntity,
    setAvailableRestaurants,
    setAvailableEvents,
    setAvailableRentals,
    setAvailableDestinations,
    checkConflicts,
    resolveConflict,
    getBudget,
    checkBudgetImpact,
    updatePreferences,
    getDay,
    refreshTrip
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useTripContext() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within TripProvider');
  }
  return context;
}

// Alias for backwards compatibility
export const useTrip = useTripContext;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createDay(date: string, trip: Trip): TripDay {
  const dayNumber = calculateDayNumber(date, trip.startDate);
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

  return {
    date,
    dayOfWeek,
    dayNumber,
    items: [],
    schedule: {
      date,
      slots: [],
      conflicts: []
    },
    stats: {
      totalCost: 0,
      totalDuration: 0,
      activitiesCount: 0,
      travelTime: 0,
      freeTime: 0
    }
  };
}

function calculateDayNumber(date: string, startDate: string): number {
  const start = new Date(startDate);
  const current = new Date(date);
  const diff = current.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function recalculateDayStats(day: TripDay): TripDay {
  const stats = {
    totalCost: 0,
    totalDuration: 0,
    activitiesCount: day.items.length,
    travelTime: 0,
    freeTime: 0
  };

  day.items.forEach(item => {
    // Cost
    if ('estimatedCost' in item) stats.totalCost += item.estimatedCost || 0;
    if ('price' in item && typeof item.price === 'number') stats.totalCost += item.price;
    
    // Duration
    if ('duration' in item) stats.totalDuration += item.duration || 0;
    if ('estimatedDuration' in item) stats.totalDuration += item.estimatedDuration || 0;
    
    // Travel time
    if (item.type === 'travel' && 'duration' in item) {
      stats.travelTime += item.duration || 0;
    }
  });

  day.stats = stats;
  return day;
}

function deserializeTrip(trip: any): Trip {
  return {
    ...trip,
    createdAt: new Date(trip.createdAt),
    lastModified: new Date(trip.lastModified),
    days: trip.days.map((day: any) => ({
      ...day,
      items: day.items.map((item: any) => deserializeEntity(item))
    }))
  };
}

function deserializeEntity(entity: any): TripEntity {
  const deserialized = { ...entity };
  
  // Restore dates
  if (entity.startTime) deserialized.startTime = new Date(entity.startTime);
  if (entity.endTime) deserialized.endTime = new Date(entity.endTime);
  if (entity.reservationTime) deserialized.reservationTime = new Date(entity.reservationTime);
  if (entity.visitTime) deserialized.visitTime = new Date(entity.visitTime);
  if (entity.departureTime) deserialized.departureTime = new Date(entity.departureTime);
  if (entity.arrivalTime) deserialized.arrivalTime = new Date(entity.arrivalTime);
  
  return deserialized;
}