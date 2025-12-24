import React, { useState } from 'react';
import {
  AlertTriangle,
  XCircle,
  AlertCircle,
  Info,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  SkipForward,
  Calendar,
  Sliders
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { cn } from '../../ui/utils';
import { motion, AnimatePresence } from 'motion/react';
import { PreviewConflict, ConflictResolution, getConflictColor } from './PreviewTypes';

interface ConflictWarningProps {
  conflicts: PreviewConflict[];
  onResolve: (conflictId: string, resolution: ConflictResolution) => void;
  className?: string;
}

export function ConflictWarning({
  conflicts,
  onResolve,
  className
}: ConflictWarningProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  if (conflicts.length === 0) return null;

  // Categorize conflicts
  const blockingConflicts = conflicts.filter(c => c.severity === 'blocking');
  const majorConflicts = conflicts.filter(c => c.severity === 'major');
  const minorConflicts = conflicts.filter(c => c.severity === 'minor');

  const hasBlocking = blockingConflicts.length > 0;
  const hasMajor = majorConflicts.length > 0;
  const totalConflicts = conflicts.length;

  // Get severity icon and color
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'blocking':
        return <XCircle className="w-4 h-4" />;
      case 'major':
        return <AlertTriangle className="w-4 h-4" />;
      case 'minor':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  // Get conflict type label
  const getConflictTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      time_overlap: 'Time Conflict',
      location_distance: 'Distance Issue',
      budget_exceeded: 'Budget Alert',
      availability: 'Availability Issue',
      capacity: 'Capacity Limit'
    };
    return labels[type] || 'Conflict';
  };

  // Handle resolution
  const handleResolve = (conflictId: string, strategy: ConflictResolution['strategy']) => {
    setResolvingId(conflictId);
    
    const resolution: ConflictResolution = {
      conflictId,
      strategy,
      userConfirmed: true
    };
    
    onResolve(conflictId, resolution);
    
    setTimeout(() => {
      setResolvingId(null);
    }, 500);
  };

  // Header color based on severity
  const headerColor = hasBlocking 
    ? 'bg-red-50 border-red-200 text-red-900'
    : hasMajor
    ? 'bg-orange-50 border-orange-200 text-orange-900'
    : 'bg-amber-50 border-amber-200 text-amber-900';

  const iconColor = hasBlocking
    ? 'text-red-600'
    : hasMajor
    ? 'text-orange-600'
    : 'text-amber-600';

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className={cn("border-b", className)}
    >
      {/* Header */}
      <div className={cn("p-3 border-b", headerColor)}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-start gap-3"
        >
          {/* Icon */}
          <div className={cn("flex-shrink-0", iconColor)}>
            {hasBlocking ? (
              <XCircle className="w-5 h-5" />
            ) : hasMajor ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between gap-2">
              <h5 className="font-semibold text-sm">
                {hasBlocking 
                  ? '🚫 Blocking Conflicts Detected'
                  : hasMajor
                  ? '⚠️ Important Conflicts Found'
                  : '⚡ Minor Conflicts Detected'}
              </h5>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs mt-0.5">
              {totalConflicts} {totalConflicts === 1 ? 'conflict' : 'conflicts'} require attention
              {hasBlocking && ' - Cannot proceed until resolved'}
            </p>
          </div>
        </button>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 bg-white space-y-3"
          >
            {/* Blocking Conflicts */}
            {blockingConflicts.map((conflict) => (
              <ConflictItem
                key={conflict.id}
                conflict={conflict}
                onResolve={handleResolve}
                isResolving={resolvingId === conflict.id}
              />
            ))}

            {/* Major Conflicts */}
            {majorConflicts.map((conflict) => (
              <ConflictItem
                key={conflict.id}
                conflict={conflict}
                onResolve={handleResolve}
                isResolving={resolvingId === conflict.id}
              />
            ))}

            {/* Minor Conflicts */}
            {minorConflicts.map((conflict) => (
              <ConflictItem
                key={conflict.id}
                conflict={conflict}
                onResolve={handleResolve}
                isResolving={resolvingId === conflict.id}
              />
            ))}

            {/* Auto-resolve suggestion */}
            {conflicts.some(c => c.autoResolvable) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-blue-900 font-medium mb-1">
                    Smart Resolution Available
                  </p>
                  <p className="text-[10px] text-blue-700 leading-relaxed mb-2">
                    Some conflicts can be automatically resolved. Review suggestions below.
                  </p>
                  <Button
                    size="sm"
                    className="h-6 px-2 text-[10px] bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      conflicts
                        .filter(c => c.autoResolvable)
                        .forEach(c => handleResolve(c.id, 'adjust'));
                    }}
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Auto-resolve {conflicts.filter(c => c.autoResolvable).length} conflicts
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Individual Conflict Item
 */
function ConflictItem({
  conflict,
  onResolve,
  isResolving
}: {
  conflict: PreviewConflict;
  onResolve: (id: string, strategy: ConflictResolution['strategy']) => void;
  isResolving: boolean;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getSeverityIcon = () => {
    switch (conflict.severity) {
      case 'blocking':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'major':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'minor':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getConflictTypeBadge = () => {
    const typeLabels: Record<string, string> = {
      time_overlap: 'Time Overlap',
      location_distance: 'Distance',
      budget_exceeded: 'Budget',
      availability: 'Availability',
      capacity: 'Capacity'
    };

    const typeColors: Record<string, string> = {
      time_overlap: 'bg-red-100 text-red-700 border-red-200',
      location_distance: 'bg-blue-100 text-blue-700 border-blue-200',
      budget_exceeded: 'bg-amber-100 text-amber-700 border-amber-200',
      availability: 'bg-orange-100 text-orange-700 border-orange-200',
      capacity: 'bg-purple-100 text-purple-700 border-purple-200'
    };

    return (
      <Badge className={cn("text-[10px]", typeColors[conflict.type] || 'bg-slate-100 text-slate-700')}>
        {typeLabels[conflict.type] || conflict.type}
      </Badge>
    );
  };

  return (
    <div className={cn(
      "border rounded-lg p-3",
      getConflictColor(conflict.severity)
    )}>
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        {getSeverityIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h6 className="text-xs font-semibold text-slate-900">
              {conflict.conflictingItem.name}
            </h6>
            {getConflictTypeBadge()}
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {conflict.message}
          </p>

          {/* Conflicting item details */}
          {(conflict.conflictingItem.time || conflict.conflictingItem.location) && (
            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
              {conflict.conflictingItem.time && (
                <span>🕐 {conflict.conflictingItem.time}</span>
              )}
              {conflict.conflictingItem.location && (
                <span>📍 {conflict.conflictingItem.location}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Suggestions */}
      {conflict.suggestions && conflict.suggestions.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-[10px] text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
          >
            <Lightbulb className="w-3 h-3" />
            {showSuggestions ? 'Hide' : 'View'} suggestions ({conflict.suggestions.length})
            {showSuggestions ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>

          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-1"
              >
                {conflict.suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="bg-white/50 rounded p-2 text-[10px] text-slate-600 leading-relaxed flex items-start gap-1.5"
                  >
                    <span className="text-purple-600 font-bold flex-shrink-0">{idx + 1}.</span>
                    <span>{suggestion}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Resolution Actions */}
      <div className="flex gap-1.5 mt-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onResolve(conflict.id, 'skip')}
          disabled={isResolving}
          className="h-6 px-2 text-[10px]"
        >
          <SkipForward className="w-3 h-3 mr-1" />
          Skip
        </Button>

        {conflict.type === 'time_overlap' && (
          <Button
            size="sm"
            onClick={() => onResolve(conflict.id, 'reschedule')}
            disabled={isResolving}
            className="h-6 px-2 text-[10px] bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Calendar className="w-3 h-3 mr-1" />
            Reschedule
          </Button>
        )}

        {conflict.autoResolvable && (
          <Button
            size="sm"
            onClick={() => onResolve(conflict.id, 'adjust')}
            disabled={isResolving}
            className="h-6 px-2 text-[10px] bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Sliders className="w-3 h-3 mr-1" />
            Auto-fix
          </Button>
        )}

        {conflict.severity !== 'blocking' && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onResolve(conflict.id, 'force')}
            disabled={isResolving}
            className="h-6 px-2 text-[10px] text-slate-600"
          >
            Force Apply
          </Button>
        )}
      </div>
    </div>
  );
}
