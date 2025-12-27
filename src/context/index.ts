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

// Exploration Context Hook (NEW)
export { useExplorationContext } from './hooks/useExplorationContext';
export type { UseExplorationContextReturn } from './hooks/useExplorationContext';

// Event Bus
export { eventBus, EventBus, createPublisher, createSubscriber, waitForEvent } from './EventBus';
export type { EventType, EventPayload, EntityEventPayload } from './EventBus';

// Conflict Detector
export { conflictDetector, ConflictDetector } from './ConflictDetector';
export type { ConflictDetectionOptions } from './ConflictDetector';

// Budget Tracker
export { budgetTracker, BudgetTracker } from './BudgetTracker';

// Exploration Storage (NEW)
export { explorationStorage, ExplorationStorageUtils } from './storage/ExplorationStorage';

// Exploration Route Utilities (NEW)
export {
  parseExploreParams,
  buildExploreParams,
  buildExploreUrl,
  navigateToExplore,
  getCurrentExploreParams,
  isExplorePage,
  validateExploreParams,
  applyDefaultParams,
  DEFAULT_EXPLORE_PARAMS,
} from './utils/explorationRouteUtils';

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

// Exploration Types (NEW)
export * from './types/ExplorationTypes';
export * from './types/SelectionTypes';
export * from './storage/ExplorationStorage';
export * from './hooks/useExplorationContext';
export * from './hooks/useMapListSync';
export * from './utils/explorationRouteUtils';