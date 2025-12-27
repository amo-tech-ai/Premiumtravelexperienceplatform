/**
 * SELECTION STATE TYPES
 * 
 * Single source of truth for map ↔ list synchronization
 * 
 * CORE PRINCIPLE:
 * - One selection state shared between map and list
 * - Source tracking prevents infinite loops
 * - Hover separate from selection
 * 
 * @see /docs/01-ai-features/03-map-list-sync-spec.md
 * @see /docs/01-ai-features/PROMPT-2-WEEK-1-COMPLETE.md
 */

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Selection source - tracks which component initiated selection
 * Prevents infinite update loops
 */
export type SelectionSource = 'map' | 'list' | null;

/**
 * Hover source - tracks which component initiated hover
 * Desktop only - mobile has no hover
 */
export type HoverSource = 'map' | 'list' | null;

/**
 * Selection State - Single source of truth
 * 
 * RULES:
 * - Only one item can be selected at a time
 * - Hover is separate from selection
 * - Source tracking prevents loops
 * - Timestamp enables debugging
 */
export interface SelectionState {
  /** Currently selected item ID (null if none) */
  selectedId: string | null;

  /** Currently hovered item ID (null if none) */
  hoveredId: string | null;

  /** Which component initiated the selection */
  selectionSource: SelectionSource;

  /** Which component initiated the hover */
  hoverSource: HoverSource;

  /** When the selection occurred */
  selectionTimestamp: Date | null;

  /** When the hover occurred */
  hoverTimestamp: Date | null;
}

/**
 * Selection Actions
 * 
 * Dispatched by components to update selection state
 */
export interface SelectionActions {
  /** Select an item from map or list */
  selectItem: (id: string | null, source: SelectionSource) => void;

  /** Hover an item from map or list (desktop only) */
  hoverItem: (id: string | null, source: HoverSource) => void;

  /** Clear selection entirely */
  clearSelection: () => void;

  /** Clear hover entirely */
  clearHover: () => void;

  /** Clear both selection and hover */
  clearAll: () => void;
}

/**
 * Map Pin State
 * Visual representation state for map pins
 */
export interface MapPinState {
  id: string;
  lat: number;
  lng: number;
  isSelected: boolean;
  isHovered: boolean;
  isPrimary: boolean; // Part of primary intent
  isSecondary: boolean; // Part of secondary intent
  clusterId?: string;
}

/**
 * List Card State
 * Visual representation state for list cards
 */
export interface ListCardState {
  id: string;
  isSelected: boolean;
  isHovered: boolean;
  isPrimary: boolean;
  isSecondary: boolean;
}

// ============================================================================
// HOOK TYPES
// ============================================================================

/**
 * useMapListSync Hook Return Type
 */
export interface UseMapListSyncReturn {
  /** Current selection state */
  state: SelectionState;

  /** Actions to update state */
  actions: SelectionActions;

  /** Check if item is selected */
  isSelected: (id: string) => boolean;

  /** Check if item is hovered */
  isHovered: (id: string) => boolean;

  /** Get map pin state */
  getMapPinState: (id: string, isPrimary: boolean) => MapPinState;

  /** Get list card state */
  getListCardState: (id: string, isPrimary: boolean) => ListCardState;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * Map List Sync Configuration
 */
export interface MapListSyncConfig {
  /** Enable hover interactions (desktop only) */
  enableHover?: boolean;

  /** Debounce hover events (ms) */
  hoverDebounceMs?: number;

  /** Enable scroll to selected item in list */
  scrollToSelected?: boolean;

  /** Enable zoom to selected item in map */
  zoomToSelected?: boolean;

  /** Zoom level when selecting item */
  selectedZoomLevel?: number;

  /** Enable debugging logs */
  debug?: boolean;
}

/**
 * Default configuration
 */
export const DEFAULT_MAP_LIST_SYNC_CONFIG: MapListSyncConfig = {
  enableHover: true,
  hoverDebounceMs: 100,
  scrollToSelected: true,
  zoomToSelected: true,
  selectedZoomLevel: 15,
  debug: false,
};

// ============================================================================
// EVENT TYPES
// ============================================================================

/**
 * Selection Changed Event
 * Emitted when selection changes
 */
export interface SelectionChangedEvent {
  type: 'selection_changed';
  previousId: string | null;
  currentId: string | null;
  source: SelectionSource;
  timestamp: Date;
}

/**
 * Hover Changed Event
 * Emitted when hover changes
 */
export interface HoverChangedEvent {
  type: 'hover_changed';
  previousId: string | null;
  currentId: string | null;
  source: HoverSource;
  timestamp: Date;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Create initial selection state
 */
export function createInitialSelectionState(): SelectionState {
  return {
    selectedId: null,
    hoveredId: null,
    selectionSource: null,
    hoverSource: null,
    selectionTimestamp: null,
    hoverTimestamp: null,
  };
}

/**
 * Check if selection state is empty
 */
export function isSelectionEmpty(state: SelectionState): boolean {
  return state.selectedId === null && state.hoveredId === null;
}

/**
 * Check if selection is valid
 */
export function isSelectionValid(state: SelectionState): boolean {
  // If there's a selection, there must be a source and timestamp
  if (state.selectedId !== null) {
    return state.selectionSource !== null && state.selectionTimestamp !== null;
  }
  return true;
}

/**
 * Debug print selection state
 */
export function debugPrintSelectionState(state: SelectionState): void {
  console.group('🎯 Selection State');
  console.log('Selected ID:', state.selectedId);
  console.log('Hovered ID:', state.hoveredId);
  console.log('Selection Source:', state.selectionSource);
  console.log('Hover Source:', state.hoverSource);
  console.log('Selection Timestamp:', state.selectionTimestamp?.toISOString());
  console.log('Hover Timestamp:', state.hoverTimestamp?.toISOString());
  console.groupEnd();
}
