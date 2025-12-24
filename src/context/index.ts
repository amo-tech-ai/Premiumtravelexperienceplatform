/**
 * TRIP CONTEXT - PUBLIC API
 * 
 * Central export for all context-related functionality
 */

// Main Context
export { TripProvider, useTripContext, useTrip } from './TripContext';

// Custom Hooks
export {
  useCurrentTrip,
  useTripDay,
  useRestaurants,
  useEvents,
  useRentals,
  useDestinations,
  useBudget,
  useConflicts,
  usePreferences
} from './hooks/useTripState';

export {
  useEventBus,
  useEventBusMultiple,
  useEventBusPublisher,
  useEntityEvents,
  useBudgetEvents,
  useEventHistory
} from './hooks/useEventBus';

// Event Bus
export { eventBus, EventBus, createPublisher, createSubscriber, waitForEvent } from './EventBus';
export type { EventType, EventPayload, EntityEventPayload } from './EventBus';

// Conflict Detector
export { conflictDetector, ConflictDetector } from './ConflictDetector';
export type { ConflictDetectionOptions } from './ConflictDetector';

// Budget Tracker
export { budgetTracker, BudgetTracker } from './BudgetTracker';

// Types
export type {
  // Core
  EntityType,
  EntityStatus,
  TimeSlotStatus,
  
  // Entities
  Restaurant,
  Event,
  Rental,
  Destination,
  Activity,
  Travel,
  TripEntity,
  
  // Trip
  Trip,
  TripDay,
  TripState,
  
  // Schedule
  TimeSlot,
  Schedule,
  ScheduleConflict,
  
  // Budget
  Budget,
  BudgetAlert,
  
  // Location
  Location,
  Distance,
  
  // User
  UserPreferences,
  
  // Other
  SearchFilters,
  AnalyticsData
} from './types/TripTypes';