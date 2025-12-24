import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { UnifiedPreviewCard, InlinePreview } from './UnifiedPreviewCard';
import {
  PreviewBatch,
  PreviewState,
  PreviewHandlers,
  PreviewOptions,
  ConflictResolution
} from './PreviewTypes';

interface PreviewManagerProps {
  initialBatches?: PreviewBatch[];
  options?: PreviewOptions;
  onBatchApplied?: (batchId: string, actions?: string[]) => void;
  onBatchDismissed?: (batchId: string) => void;
  onBatchUndone?: (batchId: string) => void;
  className?: string;
}

/**
 * PreviewManager - Centralized preview system manager
 * 
 * Manages all preview batches, conflicts, and user interactions.
 * Provides undo/redo functionality and conflict resolution.
 */
export function PreviewManager({
  initialBatches = [],
  options = {},
  onBatchApplied,
  onBatchDismissed,
  onBatchUndone,
  className
}: PreviewManagerProps) {
  // State management
  const [state, setState] = useState<PreviewState>({
    activeBatches: initialBatches.filter(b => b.status === 'pending'),
    history: [],
    undoStack: [],
    redoStack: [],
    selectedBatchId: undefined
  });

  // Add a new batch
  const addBatch = useCallback((batch: PreviewBatch) => {
    setState(prev => ({
      ...prev,
      activeBatches: [...prev.activeBatches, batch]
    }));
  }, []);

  // Remove a batch
  const removeBatch = useCallback((batchId: string) => {
    setState(prev => ({
      ...prev,
      activeBatches: prev.activeBatches.filter(b => b.id !== batchId)
    }));
  }, []);

  // Apply batch handler
  const handleApply = useCallback((batchId: string, selectedActions?: string[]) => {
    setState(prev => {
      const batch = prev.activeBatches.find(b => b.id === batchId);
      if (!batch) return prev;

      const appliedBatch: PreviewBatch = {
        ...batch,
        status: 'applied',
        appliedAt: new Date()
      };

      // Call external handler
      onBatchApplied?.(batchId, selectedActions);

      return {
        ...prev,
        activeBatches: prev.activeBatches.filter(b => b.id !== batchId),
        history: [...prev.history, appliedBatch],
        undoStack: [...prev.undoStack, appliedBatch],
        redoStack: [] // Clear redo stack on new action
      };
    });
  }, [onBatchApplied]);

  // Dismiss batch handler
  const handleDismiss = useCallback((batchId: string) => {
    setState(prev => {
      const batch = prev.activeBatches.find(b => b.id === batchId);
      if (!batch) return prev;

      const dismissedBatch: PreviewBatch = {
        ...batch,
        status: 'dismissed',
        dismissedAt: new Date()
      };

      // Call external handler
      onBatchDismissed?.(batchId);

      return {
        ...prev,
        activeBatches: prev.activeBatches.filter(b => b.id !== batchId),
        history: [...prev.history, dismissedBatch]
      };
    });
  }, [onBatchDismissed]);

  // Undo handler
  const handleUndo = useCallback((batchId: string) => {
    setState(prev => {
      const batchIndex = prev.undoStack.findIndex(b => b.id === batchId);
      if (batchIndex === -1) return prev;

      const batch = prev.undoStack[batchIndex];
      const undoneBatch: PreviewBatch = {
        ...batch,
        status: 'undone'
      };

      // Call external handler
      onBatchUndone?.(batchId);

      return {
        ...prev,
        undoStack: prev.undoStack.filter(b => b.id !== batchId),
        redoStack: [...prev.redoStack, undoneBatch],
        activeBatches: [...prev.activeBatches, {
          ...batch,
          status: 'pending'
        }]
      };
    });
  }, [onBatchUndone]);

  // Redo handler
  const handleRedo = useCallback((batchId: string) => {
    setState(prev => {
      const batch = prev.redoStack.find(b => b.id === batchId);
      if (!batch) return prev;

      return {
        ...prev,
        redoStack: prev.redoStack.filter(b => b.id !== batchId),
        undoStack: [...prev.undoStack, batch],
        activeBatches: prev.activeBatches.filter(b => b.id !== batchId)
      };
    });
  }, []);

  // Conflict resolution handler
  const handleResolveConflict = useCallback((
    conflictId: string,
    resolution: ConflictResolution
  ) => {
    setState(prev => ({
      ...prev,
      activeBatches: prev.activeBatches.map(batch => ({
        ...batch,
        conflicts: batch.conflicts.filter(c => c.id !== conflictId)
      }))
    }));

    console.log('Conflict resolved:', conflictId, resolution);
  }, []);

  // Action selection handler
  const handleSelectAction = useCallback((actionId: string, selected: boolean) => {
    console.log('Action selection changed:', actionId, selected);
  }, []);

  // Batch selection handler (for multi-option previews)
  const handleSelectBatch = useCallback((batchId: string) => {
    setState(prev => ({
      ...prev,
      selectedBatchId: batchId
    }));
  }, []);

  // Create handlers object
  const handlers: PreviewHandlers = {
    onApply: handleApply,
    onDismiss: handleDismiss,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onResolveConflict: handleResolveConflict,
    onSelectAction: handleSelectAction,
    onSelectBatch: handleSelectBatch
  };

  // Expose API for external use
  React.useEffect(() => {
    // Make manager API available globally for debugging
    (window as any).__previewManager = {
      addBatch,
      removeBatch,
      state,
      handlers
    };

    return () => {
      delete (window as any).__previewManager;
    };
  }, [addBatch, removeBatch, state, handlers]);

  return (
    <div className={className}>
      <AnimatePresence mode="popLayout">
        {state.activeBatches.map((batch) => (
          <UnifiedPreviewCard
            key={batch.id}
            batch={batch}
            handlers={handlers}
            options={options}
            className="mb-3"
          />
        ))}
      </AnimatePresence>

      {/* Show recently applied batches with undo option */}
      <AnimatePresence mode="popLayout">
        {state.undoStack.slice(-2).map((batch) => (
          <UnifiedPreviewCard
            key={batch.id}
            batch={batch}
            handlers={handlers}
            options={options}
            className="mb-3"
          />
        ))}
      </AnimatePresence>

      {/* Empty state */}
      {state.activeBatches.length === 0 && state.undoStack.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-sm">
          No preview actions available
        </div>
      )}
    </div>
  );
}

/**
 * Hook for using PreviewManager in components
 */
export function usePreviewManager(initialBatches?: PreviewBatch[]) {
  const [batches, setBatches] = useState<PreviewBatch[]>(initialBatches || []);

  const addBatch = useCallback((batch: PreviewBatch) => {
    setBatches(prev => [...prev, batch]);
  }, []);

  const removeBatch = useCallback((batchId: string) => {
    setBatches(prev => prev.filter(b => b.id !== batchId));
  }, []);

  const updateBatch = useCallback((batchId: string, updates: Partial<PreviewBatch>) => {
    setBatches(prev => prev.map(b => 
      b.id === batchId ? { ...b, ...updates } : b
    ));
  }, []);

  return {
    batches,
    addBatch,
    removeBatch,
    updateBatch
  };
}
