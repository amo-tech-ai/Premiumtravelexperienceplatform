import React from 'react';
import {
  Plus,
  Minus,
  Edit3,
  RefreshCw,
  ArrowRightLeft,
  MoveVertical,
  Clock,
  MapPin,
  DollarSign,
  AlertTriangle,
  Check
} from 'lucide-react';
import { Badge } from '../../ui/badge';
import { cn } from '../../ui/utils';
import { motion } from 'motion/react';
import { PreviewAction, getActionLabel, getActionColor } from './PreviewTypes';

interface PreviewActionItemProps {
  action: PreviewAction;
  index: number;
  isSelected: boolean;
  onToggle: () => void;
  allowSelection: boolean;
  compact?: boolean;
}

export function PreviewActionItem({
  action,
  index,
  isSelected,
  onToggle,
  allowSelection,
  compact = false
}: PreviewActionItemProps) {
  const hasConflicts = action.conflicts && action.conflicts.length > 0;
  const hasBlockingConflict = action.conflicts?.some(c => c.severity === 'blocking');

  // Get icon for action type
  const getActionIcon = () => {
    const iconClass = "w-3.5 h-3.5";
    
    switch (action.type) {
      case 'add':
        return <Plus className={iconClass} />;
      case 'remove':
        return <Minus className={iconClass} />;
      case 'modify':
      case 'replace':
        return <Edit3 className={iconClass} />;
      case 'reorder':
        return <MoveVertical className={iconClass} />;
      case 'reschedule':
        return <Clock className={iconClass} />;
      case 'compare':
        return <ArrowRightLeft className={iconClass} />;
      case 'reserve':
        return <Check className={iconClass} />;
      default:
        return <RefreshCw className={iconClass} />;
    }
  };

  // Render compact version
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg border transition-all",
          isSelected 
            ? "bg-white border-purple-200" 
            : "bg-slate-50 border-slate-200 opacity-60",
          allowSelection && "cursor-pointer hover:border-purple-300",
          hasBlockingConflict && "border-red-300 bg-red-50/50"
        )}
        onClick={allowSelection ? onToggle : undefined}
      >
        {/* Selection Checkbox */}
        {allowSelection && (
          <div className={cn(
            "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0",
            isSelected 
              ? "bg-purple-600 border-purple-600" 
              : "bg-white border-slate-300"
          )}>
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
        )}

        {/* Action Badge */}
        <Badge className={cn("text-[10px] px-1.5 py-0.5", getActionColor(action.type))}>
          {getActionIcon()}
          <span className="ml-1">{getActionLabel(action.type)}</span>
        </Badge>

        {/* Item Name */}
        <span className="text-xs font-medium text-slate-900 flex-1 truncate">
          {action.item.name}
        </span>

        {/* Conflict Indicator */}
        {hasConflicts && (
          <AlertTriangle className={cn(
            "w-3.5 h-3.5 flex-shrink-0",
            hasBlockingConflict ? "text-red-600" : "text-amber-600"
          )} />
        )}
      </motion.div>
    );
  }

  // Full version
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "rounded-lg border transition-all",
        isSelected 
          ? "bg-white border-purple-200 shadow-sm" 
          : "bg-slate-50 border-slate-200 opacity-60",
        allowSelection && "cursor-pointer hover:border-purple-300 hover:shadow-sm",
        hasBlockingConflict && "border-red-300 bg-red-50/30"
      )}
      onClick={allowSelection ? onToggle : undefined}
    >
      <div className="p-3">
        {/* Header Row */}
        <div className="flex items-start gap-2 mb-2">
          {/* Selection Checkbox */}
          {allowSelection && (
            <div className={cn(
              "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
              isSelected 
                ? "bg-purple-600 border-purple-600" 
                : "bg-white border-slate-300"
            )}>
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Action Type + Item Name */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge className={cn("text-[10px]", getActionColor(action.type))}>
                {getActionIcon()}
                <span className="ml-1">{getActionLabel(action.type)}</span>
              </Badge>
              <h5 className="text-sm font-semibold text-slate-900">
                {action.item.name}
              </h5>
            </div>

            {/* Item Details */}
            {action.item.details && (
              <p className="text-xs text-slate-600 mb-2">
                {action.item.details}
              </p>
            )}

            {/* Metadata Grid */}
            <div className="flex items-center gap-3 flex-wrap">
              {action.item.time && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{action.item.time}</span>
                </div>
              )}
              {action.item.location && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="w-3 h-3" />
                  <span>{action.item.location}</span>
                </div>
              )}
              {action.item.cost && (
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <DollarSign className="w-3 h-3" />
                  <span>{action.item.cost}</span>
                </div>
              )}
              {action.item.duration && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{action.item.duration}</span>
                </div>
              )}
            </div>

            {/* Before/After for Modify Actions */}
            {action.previousItem && action.type !== 'add' && (
              <div className="mt-2 p-2 bg-slate-100 rounded border border-slate-200">
                <div className="flex items-start gap-2 text-xs">
                  <div className="flex-1">
                    <p className="text-slate-500 mb-1">Previous:</p>
                    <p className="text-slate-700 font-medium">{action.previousItem.name}</p>
                    {action.previousItem.time && (
                      <p className="text-slate-600 mt-0.5">{action.previousItem.time}</p>
                    )}
                  </div>
                  <ArrowRightLeft className="w-3 h-3 text-slate-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-slate-500 mb-1">New:</p>
                    <p className="text-slate-900 font-medium">{action.item.name}</p>
                    {action.item.time && (
                      <p className="text-slate-700 mt-0.5">{action.item.time}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* AI Reason */}
            {action.reason && (
              <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-100">
                <p className="text-[10px] text-purple-900 leading-relaxed">
                  {action.reason}
                </p>
              </div>
            )}

            {/* Notes */}
            {action.item.notes && (
              <p className="mt-2 text-[10px] text-slate-500 italic">
                Note: {action.item.notes}
              </p>
            )}
          </div>
        </div>

        {/* Action-specific conflicts */}
        {hasConflicts && (
          <div className={cn(
            "mt-2 p-2 rounded border flex items-start gap-2",
            hasBlockingConflict 
              ? "bg-red-50 border-red-200" 
              : "bg-amber-50 border-amber-200"
          )}>
            <AlertTriangle className={cn(
              "w-3.5 h-3.5 flex-shrink-0 mt-0.5",
              hasBlockingConflict ? "text-red-600" : "text-amber-600"
            )} />
            <div className="flex-1">
              {action.conflicts?.map((conflict, idx) => (
                <p key={idx} className="text-[10px] text-slate-700 leading-relaxed">
                  {conflict.message}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
