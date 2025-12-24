/**
 * CUSTOM HOOKS - Trip State Management
 * 
 * Convenient hooks for accessing and managing trip state
 */

import { useMemo, useCallback } from 'react';
import { useTripContext } from '../TripContext';
import {
  TripEntity,
  Restaurant,
  Event,
  Rental,
  Destination,
  TripDay,
  Budget
} from '../types/TripTypes';

/**
 * Hook for current trip
 */
export function useCurrentTrip() {
  const { currentTrip, setCurrentTrip, updateTrip, refreshTrip } = useTripContext();

  return {
    trip: currentTrip,
    setTrip: setCurrentTrip,
    updateTrip: useCallback(
      (updates: Partial<typeof currentTrip>) => {
        if (currentTrip) {
          updateTrip(currentTrip.id, updates);
        }
      },
      [currentTrip, updateTrip]
    ),
    refreshTrip
  };
}

/**
 * Hook for trip day
 */
export function useTripDay(date?: string) {
  const { currentTrip, getDay, addEntity, removeEntity } = useTripContext();
  
  const day = useMemo(() => {
    if (!date) return null;
    return getDay(date);
  }, [date, getDay, currentTrip]);

  return {
    day,
    addToDay: useCallback(
      (entity: TripEntity, options?: any) => {
        if (date) {
          return addEntity(entity, date, options);
        }
        return { success: false, message: 'No date specified' };
      },
      [date, addEntity]
    ),
    removeFromDay: useCallback(
      (entityId: string) => {
        if (date) {
          removeEntity(entityId, date);
        }
      },
      [date, removeEntity]
    )
  };
}

/**
 * Hook for restaurants
 */
export function useRestaurants() {
  const {
    availableRestaurants,
    savedItems,
    setAvailableRestaurants,
    saveEntity,
    unsaveEntity,
    addEntity,
    currentTrip
  } = useTripContext();

  return {
    available: availableRestaurants,
    saved: savedItems.restaurants,
    setAvailable: setAvailableRestaurants,
    save: useCallback(
      (restaurant: Restaurant) => saveEntity({ ...restaurant, type: 'restaurant' }),
      [saveEntity]
    ),
    unsave: useCallback(
      (restaurantId: string) => unsaveEntity(restaurantId, 'restaurant'),
      [unsaveEntity]
    ),
    addToTrip: useCallback(
      (restaurant: Restaurant, date: string, reservationTime?: Date) => {
        const entity: Restaurant = {
          ...restaurant,
          addedToTrip: true,
          tripDate: date,
          reservationTime
        };
        return addEntity(entity, date);
      },
      [addEntity]
    ),
    inTrip: useMemo(() => {
      if (!currentTrip) return [];
      const restaurants: Restaurant[] = [];
      currentTrip.days.forEach(day => {
        day.items.forEach(item => {
          if (item.type === 'restaurant') {
            restaurants.push(item as Restaurant);
          }
        });
      });
      return restaurants;
    }, [currentTrip])
  };
}

/**
 * Hook for events
 */
export function useEvents() {
  const {
    availableEvents,
    savedItems,
    setAvailableEvents,
    saveEntity,
    unsaveEntity,
    addEntity,
    currentTrip
  } = useTripContext();

  return {
    available: availableEvents,
    saved: savedItems.events,
    setAvailable: setAvailableEvents,
    save: useCallback(
      (event: Event) => saveEntity({ ...event, type: 'event' }),
      [saveEntity]
    ),
    unsave: useCallback(
      (eventId: string) => unsaveEntity(eventId, 'event'),
      [unsaveEntity]
    ),
    addToTrip: useCallback(
      (event: Event, date: string) => {
        const entity: Event = {
          ...event,
          addedToTrip: true,
          tripDate: date
        };
        return addEntity(entity, date);
      },
      [addEntity]
    ),
    inTrip: useMemo(() => {
      if (!currentTrip) return [];
      const events: Event[] = [];
      currentTrip.days.forEach(day => {
        day.items.forEach(item => {
          if (item.type === 'event') {
            events.push(item as Event);
          }
        });
      });
      return events;
    }, [currentTrip])
  };
}

/**
 * Hook for rentals
 */
export function useRentals() {
  const {
    availableRentals,
    savedItems,
    setAvailableRentals,
    saveEntity,
    unsaveEntity,
    addEntity,
    currentTrip
  } = useTripContext();

  return {
    available: availableRentals,
    saved: savedItems.rentals,
    setAvailable: setAvailableRentals,
    save: useCallback(
      (rental: Rental) => saveEntity({ ...rental, type: 'rental' }),
      [saveEntity]
    ),
    unsave: useCallback(
      (rentalId: string) => unsaveEntity(rentalId, 'rental'),
      [unsaveEntity]
    ),
    addToTrip: useCallback(
      (rental: Rental, checkIn?: Date, checkOut?: Date) => {
        const entity: Rental = {
          ...rental,
          addedToTrip: true,
          checkIn,
          checkOut
        };
        // Add to first day of trip
        if (currentTrip && currentTrip.days.length > 0) {
          return addEntity(entity, currentTrip.days[0].date);
        }
        return { success: false, message: 'No trip days available' };
      },
      [addEntity, currentTrip]
    ),
    inTrip: useMemo(() => {
      if (!currentTrip) return [];
      const rentals: Rental[] = [];
      currentTrip.days.forEach(day => {
        day.items.forEach(item => {
          if (item.type === 'rental') {
            rentals.push(item as Rental);
          }
        });
      });
      return rentals;
    }, [currentTrip])
  };
}

/**
 * Hook for destinations
 */
export function useDestinations() {
  const {
    availableDestinations,
    savedItems,
    setAvailableDestinations,
    saveEntity,
    unsaveEntity,
    addEntity,
    currentTrip
  } = useTripContext();

  return {
    available: availableDestinations,
    saved: savedItems.destinations,
    setAvailable: setAvailableDestinations,
    save: useCallback(
      (destination: Destination) => saveEntity({ ...destination, type: 'destination' }),
      [saveEntity]
    ),
    unsave: useCallback(
      (destinationId: string) => unsaveEntity(destinationId, 'destination'),
      [unsaveEntity]
    ),
    addToTrip: useCallback(
      (destination: Destination, date: string, visitTime?: Date) => {
        const entity: Destination = {
          ...destination,
          addedToTrip: true,
          tripDate: date,
          visitTime
        };
        return addEntity(entity, date);
      },
      [addEntity]
    ),
    inTrip: useMemo(() => {
      if (!currentTrip) return [];
      const destinations: Destination[] = [];
      currentTrip.days.forEach(day => {
        day.items.forEach(item => {
          if (item.type === 'destination') {
            destinations.push(item as Destination);
          }
        });
      });
      return destinations;
    }, [currentTrip])
  };
}

/**
 * Hook for budget
 */
export function useBudget() {
  const { getBudget, checkBudgetImpact, currentTrip } = useTripContext();

  const budget = getBudget();

  return {
    budget,
    checkImpact: checkBudgetImpact,
    percentSpent: useMemo(() => {
      if (!budget) return 0;
      return (budget.spent / budget.total) * 100;
    }, [budget]),
    isOverBudget: useMemo(() => {
      if (!budget) return false;
      return budget.remaining < 0;
    }, [budget]),
    breakdown: budget?.breakdown,
    alerts: budget?.alerts || []
  };
}

/**
 * Hook for schedule conflicts
 */
export function useConflicts(entity?: TripEntity, date?: string) {
  const { checkConflicts } = useTripContext();

  const conflicts = useMemo(() => {
    if (!entity || !date) return [];
    return checkConflicts(entity, date);
  }, [entity, date, checkConflicts]);

  return {
    conflicts,
    hasConflicts: conflicts.length > 0,
    hasBlocking: conflicts.some(c => c.severity === 'blocking'),
    hasMajor: conflicts.some(c => c.severity === 'major')
  };
}

/**
 * Hook for user preferences
 */
export function usePreferences() {
  const { userPreferences, updatePreferences } = useTripContext();

  return {
    preferences: userPreferences,
    update: updatePreferences
  };
}
