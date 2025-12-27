/**
 * USE MAP LIST SYNC HOOK
 * 
 * Single source of truth for map ↔ list synchronization
 * 
 * WORKFLOW:
 * 1. Pin clicked on map → selectItem('id', 'map')
 * 2. Hook updates state → selectedId = 'id', source = 'map'
 * 3. List component reacts → scrolls to and highlights card
 * 4. Map component reacts → highlights pin
 * 
 * PREVENTS LOOPS:
 * - Source tracking ensures each component only reacts once
 * - State updates are batched
 * - Debouncing prevents rapid changes
 * 
 * @see /docs/01-ai-features/03-map-list-sync-spec.md
 * @see /docs/01-ai-features/PROMPT-2-WEEK-1-COMPLETE.md
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  SelectionState,
  SelectionActions,
  SelectionSource,
  HoverSource,
  UseMapListSyncReturn,
  MapPinState,
  ListCardState,
  MapListSyncConfig,
  DEFAULT_MAP_LIST_SYNC_CONFIG,
  createInitialSelectionState,
  SelectionChangedEvent,
  HoverChangedEvent,
} from '../types/SelectionTypes';

/**
 * Detect if device supports hover
 */
function supportsHover(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover)').matches;
}

/**
 * useMapListSync Hook
 * 
 * Manages synchronized selection state between map and list
 * 
 * @param config - Configuration options
 * @returns Selection state and actions
 * 
 * @example
 * ```tsx
 * const { state, actions, isSelected, getMapPinState } = useMapListSync();
 * 
 * // In Map component
 * <Pin
 *   {...getMapPinState(pin.id, true)}
 *   onClick={() => actions.selectItem(pin.id, 'map')}
 * />
 * 
 * // In List component
 * <Card
 *   isSelected={isSelected(card.id)}
 *   onClick={() => actions.selectItem(card.id, 'list')}
 * />
 * ```
 */
export function useMapListSync(
  config: Partial<MapListSyncConfig> = {}
): UseMapListSyncReturn {
  const fullConfig = { ...DEFAULT_MAP_LIST_SYNC_CONFIG, ...config };
  const { enableHover, hoverDebounceMs, debug } = fullConfig;

  // ============================================================================
  // STATE
  // ============================================================================

  const [state, setState] = useState<SelectionState>(createInitialSelectionState());
  
  // Debounce timer for hover
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Device capabilities
  const canHover = useRef(supportsHover());

  // ============================================================================
  // LOGGING
  // ============================================================================

  const log = useCallback(
    (...args: any[]) => {
      if (debug) {
        console.log('[MapListSync]', ...args);
      }
    },
    [debug]
  );

  // ============================================================================
  // ACTIONS
  // ============================================================================

  /**
   * Select an item
   * Updates state and notifies listeners
   */
  const selectItem = useCallback(
    (id: string | null, source: SelectionSource) => {
      setState((prev) => {
        // Skip if already selected from same source
        if (prev.selectedId === id && prev.selectionSource === source) {
          log('Skipping duplicate selection:', id, source);
          return prev;
        }

        log('Selecting item:', id, 'from', source);

        return {
          ...prev,
          selectedId: id,
          selectionSource: source,
          selectionTimestamp: id !== null ? new Date() : null,
        };
      });
    },
    [log]
  );

  /**
   * Hover an item (desktop only, debounced)
   */
  const hoverItem = useCallback(
    (id: string | null, source: HoverSource) => {
      // Skip if hover not supported or disabled
      if (!canHover.current || !enableHover) {
        return;
      }

      // Clear existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      // Debounce hover changes
      hoverTimeoutRef.current = setTimeout(() => {
        setState((prev) => {
          // Skip if already hovered from same source
          if (prev.hoveredId === id && prev.hoverSource === source) {
            return prev;
          }

          log('Hovering item:', id, 'from', source);

          return {
            ...prev,
            hoveredId: id,
            hoverSource: source,
            hoverTimestamp: id !== null ? new Date() : null,
          };
        });
      }, hoverDebounceMs);
    },
    [enableHover, hoverDebounceMs, log]
  );

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    log('Clearing selection');
    setState((prev) => ({
      ...prev,
      selectedId: null,
      selectionSource: null,
      selectionTimestamp: null,
    }));
  }, [log]);

  /**
   * Clear hover
   */
  const clearHover = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    log('Clearing hover');
    setState((prev) => ({
      ...prev,
      hoveredId: null,
      hoverSource: null,
      hoverTimestamp: null,
    }));
  }, [log]);

  /**
   * Clear all (selection + hover)
   */
  const clearAll = useCallback(() => {
    log('Clearing all');
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setState(createInitialSelectionState());
  }, [log]);

  // ============================================================================
  // HELPERS
  // ============================================================================

  /**
   * Check if item is selected
   */
  const isSelected = useCallback(
    (id: string): boolean => {
      return state.selectedId === id;
    },
    [state.selectedId]
  );

  /**
   * Check if item is hovered
   */
  const isHovered = useCallback(
    (id: string): boolean => {
      return state.hoveredId === id;
    },
    [state.hoveredId]
  );

  /**
   * Get map pin state
   */
  const getMapPinState = useCallback(
    (id: string, isPrimary: boolean): MapPinState => {
      return {
        id,
        lat: 0, // Will be filled by caller
        lng: 0, // Will be filled by caller
        isSelected: state.selectedId === id,
        isHovered: state.hoveredId === id,
        isPrimary,
        isSecondary: !isPrimary,
      };
    },
    [state.selectedId, state.hoveredId]
  );

  /**
   * Get list card state
   */
  const getListCardState = useCallback(
    (id: string, isPrimary: boolean): ListCardState => {
      return {
        id,
        isSelected: state.selectedId === id,
        isHovered: state.hoveredId === id,
        isPrimary,
        isSecondary: !isPrimary,
      };
    },
    [state.selectedId, state.hoveredId]
  );

  // ============================================================================
  // CLEANUP
  // ============================================================================

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // ============================================================================
  // RETURN
  // ============================================================================

  const actions: SelectionActions = {
    selectItem,
    hoverItem,
    clearSelection,
    clearHover,
    clearAll,
  };

  return {
    state,
    actions,
    isSelected,
    isHovered,
    getMapPinState,
    getListCardState,
  };
}

/**
 * useScrollToSelected Hook
 * 
 * Scrolls list to selected item when selection changes
 * 
 * @param selectedId - Currently selected item ID
 * @param containerRef - Ref to scrollable container
 * 
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const { state } = useMapListSync();
 * 
 * useScrollToSelected(state.selectedId, containerRef);
 * 
 * <div ref={containerRef}>
 *   {items.map(item => <Card key={item.id} data-id={item.id} />)}
 * </div>
 * ```
 */
export function useScrollToSelected(
  selectedId: string | null,
  containerRef: React.RefObject<HTMLElement>
) {
  useEffect(() => {
    if (!selectedId || !containerRef.current) return;

    // Find element with data-id attribute
    const element = containerRef.current.querySelector(`[data-id="${selectedId}"]`);
    
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedId, containerRef]);
}

/**
 * useZoomToSelected Hook
 * 
 * Zooms map to selected item when selection changes
 * 
 * @param selectedId - Currently selected item ID
 * @param items - All items with coordinates
 * @param mapRef - Ref to map instance
 * @param zoomLevel - Target zoom level
 * 
 * @example
 * ```tsx
 * const mapRef = useRef<MapInstance>(null);
 * const { state } = useMapListSync();
 * 
 * useZoomToSelected(state.selectedId, places, mapRef, 15);
 * ```
 */
export function useZoomToSelected(
  selectedId: string | null,
  items: Array<{ id: string; lat: number; lng: number }>,
  mapRef: React.RefObject<any>,
  zoomLevel: number = 15
) {
  useEffect(() => {
    if (!selectedId || !mapRef.current) return;

    const item = items.find((i) => i.id === selectedId);
    if (!item) return;

    // Zoom to item (implementation depends on map library)
    // Example for Leaflet/Google Maps:
    if (typeof mapRef.current.setView === 'function') {
      mapRef.current.setView([item.lat, item.lng], zoomLevel, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [selectedId, items, mapRef, zoomLevel]);
}

/**
 * Debug hook - prints state changes to console
 */
export function useMapListSyncDebug(state: SelectionState) {
  useEffect(() => {
    console.group('🎯 MapListSync State Changed');
    console.log('Selected ID:', state.selectedId);
    console.log('Selected Source:', state.selectionSource);
    console.log('Hovered ID:', state.hoveredId);
    console.log('Hover Source:', state.hoverSource);
    console.groupEnd();
  }, [state]);
}
