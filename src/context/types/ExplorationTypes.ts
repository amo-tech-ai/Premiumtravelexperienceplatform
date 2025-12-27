/**
 * EXPLORATION CONTEXT TYPES
 * 
 * Defines the canonical state model for Chat → Explore → Map flow.
 * This is the single source of truth for exploration contexts.
 * 
 * @see /docs/01-ai-features/02-context-state-contract.md
 */

/**
 * Source of the exploration request
 */
export type ExplorationSource = 'ai' | 'manual';

/**
 * User's primary intent
 */
export type ExplorationIntent = 
  | 'restaurants' 
  | 'events' 
  | 'rentals' 
  | 'destinations' 
  | 'activities'
  | 'mixed'; // For complex queries with multiple intents

/**
 * Search radius for location-based queries
 */
export type SearchRadius = 
  | 'walkable'      // ~0.5 miles / 800m
  | 'short_drive'   // ~5 miles / 8km
  | 'city'          // ~15 miles / 24km
  | 'region';       // ~50 miles / 80km

/**
 * Time relevance for the exploration
 */
export interface TimeRelevance {
  type: 'now' | 'today' | 'tomorrow' | 'this_week' | 'this_weekend' | 'specific' | 'flexible';
  specificDate?: Date;
  dateRange?: {
    start: Date;
    end: Date;
  };
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
}

/**
 * Geographic location anchor
 */
export interface LocationAnchor {
  name: string;           // Human-readable name (e.g., "El Poblado, Medellín")
  lat: number;
  lng: number;
  placeId?: string;       // Google Places ID if available
  bounds?: {              // Bounding box for the area
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

/**
 * Ranking metadata for results
 */
export interface RankingMetadata {
  algorithm: string;      // e.g., "gemini-recommendations", "user-preferences", "popularity"
  confidence: 'high' | 'medium' | 'low';
  factors: string[];      // e.g., ["cuisine-match", "price-range", "distance"]
  reasoning?: string;     // Human-readable explanation
}

/**
 * Map pin for visualization
 */
export interface MapPin {
  id: string;
  entityId: string;       // References the entity (restaurant, event, etc.)
  entityType: ExplorationIntent;
  lat: number;
  lng: number;
  title: string;
  isHighlighted?: boolean;
  isPrimary?: boolean;    // Primary intent results
  clusterId?: string;     // If part of a cluster
}

/**
 * Map cluster for grouped pins
 */
export interface MapCluster {
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

/**
 * Individual exploration result
 */
export interface ExplorationResult {
  id: string;
  type: ExplorationIntent;
  name: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  priceLevel?: number;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  distance?: number;      // Distance from anchor in meters
  isPrimary: boolean;     // True if matches primary intent
  rank: number;           // Position in ranked list (1-based)
  metadata?: Record<string, any>; // Type-specific data
}

/**
 * Complete exploration context
 * This is passed from Chat → Explore and persisted in SessionStorage
 */
export interface ExplorationContext {
  // Identity
  id: string;                           // Unique context ID
  createdAt: Date;
  expiresAt: Date;                      // 2 hours from creation
  
  // Source & Intent
  source: ExplorationSource;            // ai | manual
  intent: ExplorationIntent;            // Primary user intent
  secondaryIntents?: ExplorationIntent[]; // Additional relevant intents
  
  // Location
  area: LocationAnchor;                 // Geographic anchor
  radius: SearchRadius;                 // Search radius
  
  // Time
  timeRelevance: TimeRelevance;         // When the user wants to go
  
  // Results
  primaryResults: ExplorationResult[];  // Main intent results (ranked)
  secondaryResults?: {                  // Contextual suggestions
    [key in ExplorationIntent]?: ExplorationResult[];
  };
  
  // Map Data
  pins: MapPin[];                       // All pins for the map
  clusters?: MapCluster[];              // Clustered pins
  mapCenter?: {                         // Initial map center
    lat: number;
    lng: number;
    zoom: number;
  };
  
  // Ranking
  ranking: RankingMetadata;             // How results were ranked
  
  // User Query (optional, for context)
  originalQuery?: string;               // Original user message
  
  // Filters Applied (if any)
  filters?: {
    priceRange?: [number, number];
    rating?: number;
    cuisine?: string[];
    tags?: string[];
    openNow?: boolean;
    hasAvailability?: boolean;
  };
}

/**
 * Route parameters for /explore page
 */
export interface ExploreRouteParams {
  source?: ExplorationSource;
  intent?: ExplorationIntent;
  area?: string;                        // URL-encoded location name
  contextId?: string;                   // Reference to stored context
  lat?: string;
  lng?: string;
  radius?: SearchRadius;
}

/**
 * Context storage interface
 */
export interface ExplorationContextStorage {
  set(context: ExplorationContext): void;
  get(id: string): ExplorationContext | null;
  getLatest(): ExplorationContext | null;
  delete(id: string): void;
  clear(): void;
  cleanup(): void;                      // Remove expired contexts
}

/**
 * Hook return type for useExplorationContext
 */
export interface UseExplorationContextReturn {
  // Current context
  context: ExplorationContext | null;
  isLoading: boolean;
  error: Error | null;
  
  // Context management
  createContext(params: Partial<ExplorationContext>): ExplorationContext;
  loadContext(id: string): void;
  updateContext(updates: Partial<ExplorationContext>): void;
  clearContext(): void;
  refreshContext(): void;
  
  // Validation
  isExpired(context: ExplorationContext): boolean;
  isValid(context: ExplorationContext): boolean;
  
  // Results
  getPrimaryResults(): ExplorationResult[];
  getSecondaryResults(intent: ExplorationIntent): ExplorationResult[];
  getAllResults(): ExplorationResult[];
  
  // Map data
  getPins(): MapPin[];
  getClusters(): MapCluster[];
  getMapCenter(): { lat: number; lng: number; zoom: number } | null;
}

/**
 * Validation result
 */
export interface ContextValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Default values
 */
export const EXPLORATION_DEFAULTS = {
  EXPIRATION_HOURS: 2,
  MAX_PRIMARY_RESULTS: 50,
  MAX_SECONDARY_RESULTS_PER_TYPE: 10,
  DEFAULT_RADIUS: 'short_drive' as SearchRadius,
  DEFAULT_MAP_ZOOM: 13,
  STORAGE_KEY_PREFIX: 'exploration_context_',
  LATEST_CONTEXT_KEY: 'exploration_latest',
} as const;

/**
 * Forbidden behaviors (must never happen)
 */
export const FORBIDDEN_BEHAVIORS = {
  SHOW_BLANK_EXPLORE: 'Never show blank Explore page',
  MIX_UNRELATED: 'Never mix unrelated content from different contexts',
  AUTO_ADD_TO_TRIP: 'Never automatically add items to trips',
  DESYNC_MAP_LIST: 'Never allow map and list to show different data',
} as const;

/**
 * Type guards
 */
export function isExplorationContext(obj: any): obj is ExplorationContext {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.source === 'string' &&
    typeof obj.intent === 'string' &&
    obj.area &&
    obj.primaryResults &&
    Array.isArray(obj.primaryResults)
  );
}

export function isValidIntent(intent: string): intent is ExplorationIntent {
  return ['restaurants', 'events', 'rentals', 'destinations', 'activities', 'mixed'].includes(intent);
}

export function isValidSource(source: string): source is ExplorationSource {
  return ['ai', 'manual'].includes(source);
}

/**
 * Context factory helpers
 */
export function createContextId(): string {
  return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createExpirationDate(hoursFromNow: number = EXPLORATION_DEFAULTS.EXPIRATION_HOURS): Date {
  const date = new Date();
  date.setHours(date.getHours() + hoursFromNow);
  return date;
}

export function isContextExpired(context: ExplorationContext): boolean {
  return new Date() > new Date(context.expiresAt);
}

/**
 * Validation helpers
 */
export function validateContext(context: Partial<ExplorationContext>): ContextValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!context.source) errors.push('Source is required');
  if (!context.intent) errors.push('Intent is required');
  if (!context.area) errors.push('Area is required');
  if (!context.primaryResults) errors.push('Primary results are required');

  // Validate source
  if (context.source && !isValidSource(context.source)) {
    errors.push(`Invalid source: ${context.source}`);
  }

  // Validate intent
  if (context.intent && !isValidIntent(context.intent)) {
    errors.push(`Invalid intent: ${context.intent}`);
  }

  // Validate expiration
  if (context.expiresAt && isContextExpired(context as ExplorationContext)) {
    warnings.push('Context has expired');
  }

  // Validate results
  if (context.primaryResults && context.primaryResults.length === 0) {
    warnings.push('No primary results found');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
