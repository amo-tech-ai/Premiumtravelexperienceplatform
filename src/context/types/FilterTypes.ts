/**
 * FILTER STATE TYPES
 * 
 * Shared filter state for map and list synchronization
 * 
 * CORE PRINCIPLE:
 * - Single filter object for both map and list
 * - Explicit "Apply" action required
 * - No auto-filtering on map drag/zoom
 * 
 * @see /docs/01-ai-features/03-map-list-sync-spec.md
 * @see /docs/01-ai-features/PROMPT-2-WEEK-2-COMPLETE.md
 */

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Price levels
 */
export type PriceLevel = 1 | 2 | 3 | 4;

/**
 * Distance options
 */
export type DistanceOption = 'walking' | 'short_drive' | 'long_drive' | 'any';

/**
 * Sort options
 */
export type SortOption = 'relevance' | 'distance' | 'rating' | 'price_low' | 'price_high';

/**
 * Time filter
 */
export interface TimeFilter {
  type: 'now' | 'today' | 'this_week' | 'anytime';
  customStart?: Date;
  customEnd?: Date;
}

/**
 * Shared Filter State
 * 
 * Single source of truth for filtering
 * Applied to BOTH map and list simultaneously
 */
export interface FilterState {
  /** Search query */
  query: string;

  /** Selected categories (empty = all) */
  categories: string[];

  /** Price range */
  priceRange: {
    min: PriceLevel;
    max: PriceLevel;
  };

  /** Distance filter */
  distance: DistanceOption;

  /** Rating filter (minimum) */
  minRating: number;

  /** Time/availability filter */
  time: TimeFilter;

  /** Only show open now */
  openNow: boolean;

  /** Sort order */
  sort: SortOption;

  /** Applied state (used to detect pending changes) */
  isApplied: boolean;

  /** Last applied timestamp */
  appliedAt: Date | null;
}

/**
 * Filter Actions
 */
export interface FilterActions {
  /** Update query */
  setQuery: (query: string) => void;

  /** Toggle category */
  toggleCategory: (category: string) => void;

  /** Set price range */
  setPriceRange: (min: PriceLevel, max: PriceLevel) => void;

  /** Set distance */
  setDistance: (distance: DistanceOption) => void;

  /** Set minimum rating */
  setMinRating: (rating: number) => void;

  /** Set time filter */
  setTimeFilter: (time: TimeFilter) => void;

  /** Toggle open now */
  toggleOpenNow: () => void;

  /** Set sort order */
  setSort: (sort: SortOption) => void;

  /** Apply filters (mark as applied) */
  applyFilters: () => void;

  /** Reset all filters */
  resetFilters: () => void;

  /** Check if filters have pending changes */
  hasPendingChanges: () => boolean;
}

/**
 * Map Bounds
 * Used for geographic filtering
 */
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

/**
 * Cluster Configuration
 */
export interface ClusterConfig {
  /** Minimum distance between items to cluster (pixels) */
  clusterRadius: number;

  /** Minimum zoom level to show clusters */
  minZoom: number;

  /** Maximum zoom level to show clusters */
  maxZoom: number;

  /** Show count on cluster badge */
  showCount: boolean;

  /** Enable cluster expansion on click */
  expandOnClick: boolean;

  /** Zoom level when expanding cluster */
  expandZoom: number;
}

/**
 * Map Cluster
 * Group of nearby items
 */
export interface MapCluster {
  id: string;
  center: {
    lat: number;
    lng: number;
  };
  count: number;
  itemIds: string[];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

// ============================================================================
// DEFAULTS
// ============================================================================

export const DEFAULT_FILTER_STATE: FilterState = {
  query: '',
  categories: [],
  priceRange: {
    min: 1,
    max: 4,
  },
  distance: 'any',
  minRating: 0,
  time: {
    type: 'anytime',
  },
  openNow: false,
  sort: 'relevance',
  isApplied: true,
  appliedAt: new Date(),
};

export const DEFAULT_CLUSTER_CONFIG: ClusterConfig = {
  clusterRadius: 50,
  minZoom: 0,
  maxZoom: 14,
  showCount: true,
  expandOnClick: true,
  expandZoom: 16,
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Check if item matches filters
 */
export function matchesFilters(
  item: {
    title?: string;
    name?: string;
    category?: string;
    type?: string;
    priceLevel?: number;
    rating?: number;
    isOpen?: boolean;
    distance?: number;
  },
  filters: FilterState
): boolean {
  // Query match
  if (filters.query) {
    const name = item.title || item.name || '';
    if (!name.toLowerCase().includes(filters.query.toLowerCase())) {
      return false;
    }
  }

  // Category match
  if (filters.categories.length > 0) {
    const category = item.category || item.type || '';
    if (!filters.categories.includes(category)) {
      return false;
    }
  }

  // Price match
  if (item.priceLevel !== undefined) {
    if (
      item.priceLevel < filters.priceRange.min ||
      item.priceLevel > filters.priceRange.max
    ) {
      return false;
    }
  }

  // Rating match
  if (item.rating !== undefined) {
    if (item.rating < filters.minRating) {
      return false;
    }
  }

  // Open now match
  if (filters.openNow && item.isOpen !== undefined) {
    if (!item.isOpen) {
      return false;
    }
  }

  // Distance match (convert to meters)
  if (filters.distance !== 'any' && item.distance !== undefined) {
    const maxDistance = {
      walking: 1609, // 1 mile
      short_drive: 8047, // 5 miles
      long_drive: 32187, // 20 miles
    }[filters.distance];

    if (item.distance > maxDistance) {
      return false;
    }
  }

  return true;
}

/**
 * Sort items by sort option
 */
export function sortItems<T extends {
  rating?: number;
  distance?: number;
  priceLevel?: number;
}>(items: T[], sort: SortOption): T[] {
  const sorted = [...items];

  switch (sort) {
    case 'rating':
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'distance':
      sorted.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      break;
    case 'price_low':
      sorted.sort((a, b) => (a.priceLevel || 0) - (b.priceLevel || 0));
      break;
    case 'price_high':
      sorted.sort((a, b) => (b.priceLevel || 0) - (a.priceLevel || 0));
      break;
    case 'relevance':
    default:
      // Keep original order (AI relevance)
      break;
  }

  return sorted;
}

/**
 * Calculate distance between two points (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Check if filters are empty (default state)
 */
export function areFiltersEmpty(filters: FilterState): boolean {
  return (
    filters.query === '' &&
    filters.categories.length === 0 &&
    filters.priceRange.min === 1 &&
    filters.priceRange.max === 4 &&
    filters.distance === 'any' &&
    filters.minRating === 0 &&
    filters.time.type === 'anytime' &&
    !filters.openNow
  );
}

/**
 * Get filter count (number of active filters)
 */
export function getActiveFilterCount(filters: FilterState): number {
  let count = 0;

  if (filters.query) count++;
  if (filters.categories.length > 0) count++;
  if (filters.priceRange.min > 1 || filters.priceRange.max < 4) count++;
  if (filters.distance !== 'any') count++;
  if (filters.minRating > 0) count++;
  if (filters.time.type !== 'anytime') count++;
  if (filters.openNow) count++;

  return count;
}
