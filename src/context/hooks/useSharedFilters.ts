/**
 * USE SHARED FILTERS HOOK
 * 
 * Single source of truth for filtering across map and list
 * 
 * WORKFLOW:
 * 1. User changes filter → state updated (pending)
 * 2. User clicks "Apply Filters" → isApplied = true
 * 3. Both map and list react to applied filters
 * 
 * PREVENTS:
 * - Auto-filtering while map dragging
 * - Desynced filter states
 * - Confusing UX
 * 
 * @see /docs/01-ai-features/03-map-list-sync-spec.md
 * @see /docs/01-ai-features/PROMPT-2-WEEK-2-COMPLETE.md
 */

import { useState, useCallback, useMemo } from 'react';
import {
  FilterState,
  FilterActions,
  TimeFilter,
  PriceLevel,
  DistanceOption,
  SortOption,
  DEFAULT_FILTER_STATE,
  matchesFilters,
  sortItems,
  areFiltersEmpty,
  getActiveFilterCount,
} from '../types/FilterTypes';

/**
 * useSharedFilters Hook
 * 
 * Manages shared filter state for map and list
 * 
 * @returns Filter state and actions
 * 
 * @example
 * ```tsx
 * const { filters, actions, filterItems, activeCount } = useSharedFilters();
 * 
 * // Update filter
 * <input onChange={e => actions.setQuery(e.target.value)} />
 * 
 * // Apply filters
 * <button onClick={actions.applyFilters}>
 *   Apply Filters {hasPendingChanges() && '(pending)'}
 * </button>
 * 
 * // Filter items
 * const filtered = filterItems(allItems);
 * ```
 */
export function useSharedFilters() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [pendingFilters, setPendingFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const setQuery = useCallback((query: string) => {
    setPendingFilters((prev) => ({
      ...prev,
      query,
      isApplied: false,
    }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setPendingFilters((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];

      return {
        ...prev,
        categories,
        isApplied: false,
      };
    });
  }, []);

  const setPriceRange = useCallback((min: PriceLevel, max: PriceLevel) => {
    setPendingFilters((prev) => ({
      ...prev,
      priceRange: { min, max },
      isApplied: false,
    }));
  }, []);

  const setDistance = useCallback((distance: DistanceOption) => {
    setPendingFilters((prev) => ({
      ...prev,
      distance,
      isApplied: false,
    }));
  }, []);

  const setMinRating = useCallback((minRating: number) => {
    setPendingFilters((prev) => ({
      ...prev,
      minRating,
      isApplied: false,
    }));
  }, []);

  const setTimeFilter = useCallback((time: TimeFilter) => {
    setPendingFilters((prev) => ({
      ...prev,
      time,
      isApplied: false,
    }));
  }, []);

  const toggleOpenNow = useCallback(() => {
    setPendingFilters((prev) => ({
      ...prev,
      openNow: !prev.openNow,
      isApplied: false,
    }));
  }, []);

  const setSort = useCallback((sort: SortOption) => {
    setPendingFilters((prev) => ({
      ...prev,
      sort,
      isApplied: false,
    }));
  }, []);

  const applyFilters = useCallback(() => {
    setFilters({
      ...pendingFilters,
      isApplied: true,
      appliedAt: new Date(),
    });
    setPendingFilters((prev) => ({
      ...prev,
      isApplied: true,
      appliedAt: new Date(),
    }));
  }, [pendingFilters]);

  const resetFilters = useCallback(() => {
    const defaultState = {
      ...DEFAULT_FILTER_STATE,
      isApplied: true,
      appliedAt: new Date(),
    };
    setFilters(defaultState);
    setPendingFilters(defaultState);
  }, []);

  const hasPendingChanges = useCallback(() => {
    return !pendingFilters.isApplied;
  }, [pendingFilters.isApplied]);

  // ============================================================================
  // HELPERS
  // ============================================================================

  /**
   * Filter and sort items
   */
  const filterItems = useCallback(
    <T extends {
      title?: string;
      name?: string;
      category?: string;
      type?: string;
      priceLevel?: number;
      rating?: number;
      isOpen?: boolean;
      distance?: number;
    }>(
      items: T[]
    ): T[] => {
      // Only use applied filters
      const activeFilters = filters.isApplied ? filters : DEFAULT_FILTER_STATE;

      // Filter
      const filtered = items.filter((item) => matchesFilters(item, activeFilters));

      // Sort
      return sortItems(filtered, activeFilters.sort);
    },
    [filters]
  );

  /**
   * Get active filter count
   */
  const activeCount = useMemo(() => {
    return getActiveFilterCount(filters);
  }, [filters]);

  /**
   * Check if filters are empty
   */
  const isEmpty = useMemo(() => {
    return areFiltersEmpty(filters);
  }, [filters]);

  // ============================================================================
  // RETURN
  // ============================================================================

  const actions: FilterActions = {
    setQuery,
    toggleCategory,
    setPriceRange,
    setDistance,
    setMinRating,
    setTimeFilter,
    toggleOpenNow,
    setSort,
    applyFilters,
    resetFilters,
    hasPendingChanges,
  };

  return {
    filters,
    pendingFilters,
    actions,
    filterItems,
    activeCount,
    isEmpty,
    hasPendingChanges: hasPendingChanges(),
  };
}

/**
 * useFilterPersistence Hook
 * 
 * Persists filters to sessionStorage
 * Useful for maintaining filters across navigation
 * 
 * @example
 * ```tsx
 * const { filters, actions } = useSharedFilters();
 * useFilterPersistence('explore_filters', filters, actions);
 * ```
 */
export function useFilterPersistence(
  key: string,
  filters: FilterState,
  actions: FilterActions
) {
  // Load on mount
  useState(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Restore filters (implement restoration logic)
      }
    } catch (error) {
      console.warn('Failed to load filters from storage:', error);
    }
  });

  // Save on change
  useState(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(filters));
    } catch (error) {
      console.warn('Failed to save filters to storage:', error);
    }
  });
}
