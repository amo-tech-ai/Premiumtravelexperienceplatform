/**
 * UNIFIED PREVIEW SYSTEM - Public API
 * 
 * Central export for the preview system components and utilities.
 */

// Core components
export { UnifiedPreviewCard, InlinePreview } from './UnifiedPreviewCard';
export { PreviewActionItem } from './PreviewActionItem';
export { ConflictWarning } from './ConflictWarning';
export { PreviewManager, usePreviewManager } from './PreviewManager';

// Factory functions
export {
  createPreviewBatch,
  createPreviewAction,
  createPreviewItem,
  createConflict,
  createRestaurantAddBatch,
  createRestaurantReserveBatch,
  createEventAddBatch,
  createTripModifyBatch,
  createRentalCompareBatch,
  createMultiOptionBatch
} from './PreviewFactory';

// Types
export type {
  PreviewBatch,
  PreviewAction,
  PreviewItem,
  PreviewConflict,
  PreviewState,
  PreviewHandlers,
  PreviewOptions,
  ConflictResolution,
  PreviewActionType,
  PreviewEntityType,
  ConflictSeverity,
  PreviewStatus
} from './PreviewTypes';

// Utilities
export {
  isAddAction,
  isRemoveAction,
  isModifyAction,
  hasBlockingConflicts,
  hasMajorConflicts,
  getActionLabel,
  getActionColor,
  getConflictColor
} from './PreviewTypes';
