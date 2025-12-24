/**
 * UNIFIED PREVIEW SYSTEM - TYPE DEFINITIONS
 * 
 * Central type system for all preview actions across the Trip Operating System.
 * Supports: Trips, Events, Rentals, Restaurants
 */

// Core Preview Action Types
export type PreviewActionType = 
  | 'add' 
  | 'remove' 
  | 'modify' 
  | 'replace' 
  | 'reorder'
  | 'reschedule'
  | 'compare'
  | 'reserve';

// Entity Types
export type PreviewEntityType = 
  | 'trip_activity'
  | 'event'
  | 'rental'
  | 'restaurant'
  | 'travel'
  | 'flex_time';

// Conflict Severity
export type ConflictSeverity = 'none' | 'minor' | 'major' | 'blocking';

// Preview Status
export type PreviewStatus = 'pending' | 'applied' | 'dismissed' | 'undone';

/**
 * Base Preview Item - Represents a single change
 */
export interface PreviewItem {
  id: string;
  name: string;
  details: string;
  time?: string;
  duration?: string;
  location?: string;
  cost?: string;
  notes?: string;
  icon?: React.ReactNode;
  metadata?: Record<string, any>;
}

/**
 * Preview Action - A single action to be performed
 */
export interface PreviewAction {
  id: string;
  type: PreviewActionType;
  entityType: PreviewEntityType;
  item: PreviewItem;
  
  // For modify/replace actions
  previousItem?: PreviewItem;
  
  // For reorder actions
  fromIndex?: number;
  toIndex?: number;
  
  // Conflict detection
  conflicts?: PreviewConflict[];
  
  // Metadata
  timestamp: Date;
  agentName?: string;
  reason?: string;
}

/**
 * Preview Conflict - Detected conflict with existing items
 */
export interface PreviewConflict {
  id: string;
  severity: ConflictSeverity;
  type: 'time_overlap' | 'location_distance' | 'budget_exceeded' | 'availability' | 'capacity';
  message: string;
  conflictingItem: {
    id: string;
    name: string;
    time?: string;
    location?: string;
  };
  suggestions?: string[];
  autoResolvable: boolean;
}

/**
 * Preview Batch - Multiple actions grouped together
 */
export interface PreviewBatch {
  id: string;
  agentName: string;
  summary: string;
  explanation?: string;
  actions: PreviewAction[];
  
  // Aggregate metadata
  totalCost?: string;
  totalDuration?: string;
  affectedDate?: string;
  
  // Batch-level conflicts
  conflicts: PreviewConflict[];
  
  // Status
  status: PreviewStatus;
  createdAt: Date;
  appliedAt?: Date;
  dismissedAt?: Date;
  
  // Options
  allowPartialApply?: boolean;
  requiresUserChoice?: boolean;
  
  // For multi-option previews (e.g., 3 trip plans)
  alternatives?: PreviewBatch[];
}

/**
 * Preview State - Global state for all previews
 */
export interface PreviewState {
  activeBatches: PreviewBatch[];
  history: PreviewBatch[];
  
  // Undo/Redo stacks
  undoStack: PreviewBatch[];
  redoStack: PreviewBatch[];
  
  // Current selection (for multi-option previews)
  selectedBatchId?: string;
}

/**
 * Preview Handlers - Callbacks for preview actions
 */
export interface PreviewHandlers {
  onApply: (batchId: string, selectedActions?: string[]) => void;
  onDismiss: (batchId: string) => void;
  onUndo: (batchId: string) => void;
  onRedo: (batchId: string) => void;
  onResolveConflict: (conflictId: string, resolution: ConflictResolution) => void;
  onSelectAction: (actionId: string, selected: boolean) => void;
  onSelectBatch: (batchId: string) => void;
}

/**
 * Conflict Resolution - How to resolve a specific conflict
 */
export interface ConflictResolution {
  conflictId: string;
  strategy: 'skip' | 'replace' | 'reschedule' | 'adjust' | 'force';
  newValue?: any;
  userConfirmed: boolean;
}

/**
 * Preview Options - Configuration for preview display
 */
export interface PreviewOptions {
  showCost?: boolean;
  showDuration?: boolean;
  showConflicts?: boolean;
  allowPartialApply?: boolean;
  allowUndo?: boolean;
  expandByDefault?: boolean;
  compactMode?: boolean;
  maxActionsShown?: number;
}

/**
 * Helper type guards
 */
export const isAddAction = (action: PreviewAction): boolean => 
  action.type === 'add';

export const isRemoveAction = (action: PreviewAction): boolean => 
  action.type === 'remove';

export const isModifyAction = (action: PreviewAction): boolean => 
  action.type === 'modify' || action.type === 'replace' || action.type === 'reschedule';

export const hasBlockingConflicts = (batch: PreviewBatch): boolean => 
  batch.conflicts.some(c => c.severity === 'blocking');

export const hasMajorConflicts = (batch: PreviewBatch): boolean => 
  batch.conflicts.some(c => c.severity === 'major' || c.severity === 'blocking');

/**
 * Action type display helpers
 */
export const getActionLabel = (type: PreviewActionType): string => {
  const labels: Record<PreviewActionType, string> = {
    add: 'Add',
    remove: 'Remove',
    modify: 'Modify',
    replace: 'Replace',
    reorder: 'Reorder',
    reschedule: 'Reschedule',
    compare: 'Compare',
    reserve: 'Reserve'
  };
  return labels[type];
};

export const getActionColor = (type: PreviewActionType): string => {
  const colors: Record<PreviewActionType, string> = {
    add: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    remove: 'text-red-700 bg-red-50 border-red-200',
    modify: 'text-blue-700 bg-blue-50 border-blue-200',
    replace: 'text-purple-700 bg-purple-50 border-purple-200',
    reorder: 'text-amber-700 bg-amber-50 border-amber-200',
    reschedule: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    compare: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    reserve: 'text-pink-700 bg-pink-50 border-pink-200'
  };
  return colors[type];
};

export const getConflictColor = (severity: ConflictSeverity): string => {
  const colors: Record<ConflictSeverity, string> = {
    none: '',
    minor: 'text-amber-700 bg-amber-50 border-amber-200',
    major: 'text-orange-700 bg-orange-50 border-orange-200',
    blocking: 'text-red-700 bg-red-50 border-red-200'
  };
  return colors[severity];
};
