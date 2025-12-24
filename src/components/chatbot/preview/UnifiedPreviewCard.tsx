import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertTriangle,
  Clock,
  DollarSign,
  Calendar,
  Undo2,
  Loader2,
  Info,
  Plus,
  Minus,
  Edit3,
  RefreshCw,
  ArrowRight,
  Eye
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { cn } from '../../ui/utils';
import { motion, AnimatePresence } from 'motion/react';
import {
  PreviewBatch,
  PreviewAction,
  PreviewHandlers,
  PreviewOptions,
  getActionLabel,
  getActionColor,
  hasBlockingConflicts,
  hasMajorConflicts
} from './PreviewTypes';
import { PreviewActionItem } from './PreviewActionItem';
import { ConflictWarning } from './ConflictWarning';

interface UnifiedPreviewCardProps {
  batch: PreviewBatch;
  handlers: PreviewHandlers;
  options?: PreviewOptions;
  className?: string;
}

export function UnifiedPreviewCard({
  batch,
  handlers,
  options = {},
  className
}: UnifiedPreviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(options.expandByDefault ?? false);
  const [selectedActions, setSelectedActions] = useState<Set<string>>(
    new Set(batch.actions.map(a => a.id))
  );
  const [isApplying, setIsApplying] = useState(false);

  const {
    showCost = true,
    showDuration = true,
    showConflicts = true,
    allowPartialApply = false,
    allowUndo = true,
    compactMode = false,
    maxActionsShown = 3
  } = options;

  // Calculate aggregate data
  const totalActions = batch.actions.length;
  const selectedCount = selectedActions.size;
  const hasConflicts = showConflicts && batch.conflicts.length > 0;
  const isBlocking = hasBlockingConflicts(batch);
  const isMajor = hasMajorConflicts(batch);
  const canApply = selectedCount > 0 && !isBlocking && batch.status === 'pending';

  // Status flags
  const isApplied = batch.status === 'applied';
  const isDismissed = batch.status === 'dismissed';
  const isUndone = batch.status === 'undone';

  // Toggle action selection
  const toggleActionSelection = (actionId: string) => {
    if (!allowPartialApply) return;
    
    const newSelection = new Set(selectedActions);
    if (newSelection.has(actionId)) {
      newSelection.delete(actionId);
    } else {
      newSelection.add(actionId);
    }
    setSelectedActions(newSelection);
    handlers.onSelectAction(actionId, newSelection.has(actionId));
  };

  // Apply handler
  const handleApply = async () => {
    setIsApplying(true);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const actionsToApply = allowPartialApply 
      ? Array.from(selectedActions)
      : undefined;
    
    handlers.onApply(batch.id, actionsToApply);
    setIsApplying(false);
  };

  // Get visible actions
  const visibleActions = isExpanded 
    ? batch.actions 
    : batch.actions.slice(0, maxActionsShown);
  const hasMore = !isExpanded && batch.actions.length > maxActionsShown;

  // Get header color based on status
  const getHeaderColor = () => {
    if (isApplied) return 'from-emerald-50 to-transparent border-emerald-200';
    if (isDismissed) return 'from-slate-50 to-transparent border-slate-200';
    if (isUndone) return 'from-amber-50 to-transparent border-amber-200';
    if (isBlocking) return 'from-red-50 to-transparent border-red-200';
    if (isMajor) return 'from-orange-50 to-transparent border-orange-200';
    return 'from-purple-50 to-transparent border-purple-200';
  };

  // Get status badge
  const getStatusBadge = () => {
    if (isApplied) {
      return (
        <Badge className="bg-emerald-600 text-white">
          <Check className="w-3 h-3 mr-1" />
          Applied
        </Badge>
      );
    }
    if (isDismissed) {
      return (
        <Badge className="bg-slate-400 text-white">
          <X className="w-3 h-3 mr-1" />
          Dismissed
        </Badge>
      );
    }
    if (isUndone) {
      return (
        <Badge className="bg-amber-500 text-white">
          <Undo2 className="w-3 h-3 mr-1" />
          Undone
        </Badge>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "bg-white rounded-xl border shadow-sm overflow-hidden",
        isApplied && "opacity-75",
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        "bg-gradient-to-r p-4 border-b",
        getHeaderColor()
      )}>
        <div className="flex items-start gap-3">
          {/* Agent Icon */}
          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-purple-600">
                  {batch.agentName}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">
                  {totalActions} {totalActions === 1 ? 'change' : 'changes'}
                </span>
                {getStatusBadge()}
              </div>
              
              {/* Expand/Collapse */}
              {totalActions > 1 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>

            {/* Summary */}
            <h4 className="font-semibold text-slate-900 mb-1">
              {batch.summary}
            </h4>

            {/* Explanation */}
            {batch.explanation && !compactMode && (
              <p className="text-xs text-slate-600 leading-relaxed">
                {batch.explanation}
              </p>
            )}

            {/* Metadata Row */}
            {!compactMode && (showCost || showDuration || batch.affectedDate) && (
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {batch.affectedDate && (
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{batch.affectedDate}</span>
                  </div>
                )}
                {showDuration && batch.totalDuration && (
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{batch.totalDuration}</span>
                  </div>
                )}
                {showCost && batch.totalCost && (
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <DollarSign className="w-3 h-3" />
                    <span>{batch.totalCost}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conflicts Warning */}
      {hasConflicts && showConflicts && (
        <ConflictWarning
          conflicts={batch.conflicts}
          onResolve={(conflictId, resolution) => 
            handlers.onResolveConflict(conflictId, resolution)
          }
        />
      )}

      {/* Actions List */}
      <div className="p-4 space-y-2">
        <AnimatePresence>
          {visibleActions.map((action, index) => (
            <PreviewActionItem
              key={action.id}
              action={action}
              index={index}
              isSelected={selectedActions.has(action.id)}
              onToggle={() => toggleActionSelection(action.id)}
              allowSelection={allowPartialApply}
              compact={compactMode}
            />
          ))}
        </AnimatePresence>

        {/* Show More */}
        {hasMore && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full py-2 text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center gap-1"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Show {batch.actions.length - maxActionsShown} more
          </button>
        )}

        {/* Partial Selection Info */}
        {allowPartialApply && selectedCount !== totalActions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900">
              {selectedCount} of {totalActions} changes selected. 
              {selectedCount === 0 ? ' Select at least one to apply.' : ' Unselected changes will be ignored.'}
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {batch.status === 'pending' && (
        <div className="border-t border-slate-200 p-3 bg-slate-50 flex gap-2">
          <Button
            onClick={handlers.onDismiss.bind(null, batch.id)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <X className="w-3.5 h-3.5 mr-1.5" />
            Dismiss
          </Button>
          
          {batch.requiresUserChoice ? (
            <Button
              onClick={handleApply}
              size="sm"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!canApply || isApplying}
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  Preview
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleApply}
              size="sm"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={!canApply || isApplying}
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  Apply {allowPartialApply && selectedCount !== totalActions ? `(${selectedCount})` : ''}
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Undo Option */}
      {batch.status === 'applied' && allowUndo && (
        <div className="border-t border-emerald-200 p-3 bg-emerald-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-900">
              Changes applied successfully
            </span>
          </div>
          <Button
            onClick={() => handlers.onUndo(batch.id)}
            variant="ghost"
            size="sm"
            className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100"
          >
            <Undo2 className="w-3.5 h-3.5 mr-1.5" />
            Undo
          </Button>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Compact Inline Preview - For single actions
 */
export function InlinePreview({
  action,
  onApply,
  onDismiss,
  className
}: {
  action: PreviewAction;
  onApply: () => void;
  onDismiss: () => void;
  className?: string;
}) {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onApply();
    setIsApplying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={cn(
        "bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center gap-3",
        className
      )}
    >
      <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-purple-900 mb-0.5">
          {getActionLabel(action.type)} {action.item.name}
        </p>
        {action.reason && (
          <p className="text-[10px] text-purple-700">{action.reason}</p>
        )}
      </div>

      <div className="flex gap-1.5 flex-shrink-0">
        <Button
          onClick={onDismiss}
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-purple-600 hover:text-purple-700"
        >
          <X className="w-3 h-3" />
        </Button>
        <Button
          onClick={handleApply}
          size="sm"
          className="h-7 px-3 bg-purple-600 hover:bg-purple-700 text-white"
          disabled={isApplying}
        >
          {isApplying ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Check className="w-3 h-3" />
          )}
        </Button>
      </div>
    </motion.div>
  );
}
