import React, { useState } from 'react';
import { Sparkles, Plus, Minus, Eye, Check, X, Undo2, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { motion, AnimatePresence } from 'motion/react';

// Types
interface Change {
  id: string;
  type: 'add' | 'remove' | 'modify';
  item: {
    name: string;
    details: string;
    time?: string;
  };
}

interface AIPreviewCardProps {
  agentName?: string;
  summary: string;
  changes: Change[];
  explanation: string;
  onApply?: () => void;
  onDismiss?: () => void;
  onPreview?: () => void;
}

export function AIPreviewCard({
  agentName = 'Local Scout',
  summary,
  changes,
  explanation,
  onApply,
  onDismiss,
  onPreview
}: AIPreviewCardProps) {
  const [isApplied, setIsApplied] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [undoTimer, setUndoTimer] = useState(5);

  const handleApply = () => {
    setIsApplied(true);
    setShowUndo(true);
    onApply?.();

    // Start undo countdown
    let timer = 5;
    const interval = setInterval(() => {
      timer--;
      setUndoTimer(timer);
      if (timer <= 0) {
        clearInterval(interval);
        setShowUndo(false);
      }
    }, 1000);
  };

  const handleUndo = () => {
    setIsApplied(false);
    setShowUndo(false);
    setUndoTimer(5);
  };

  // If applied, show success state
  if (isApplied && showUndo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 shadow-sm"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900">Changes Applied</h3>
              <p className="text-xs text-emerald-700">Your itinerary has been updated</p>
            </div>
          </div>
          <Badge className="bg-emerald-600 text-white flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {undoTimer}s
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleUndo}
            variant="outline"
            className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
          >
            <Undo2 className="w-4 h-4 mr-2" />
            Undo Changes
          </Button>
          <Button
            onClick={() => setShowUndo(false)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Keep Changes
          </Button>
        </div>
      </motion.div>
    );
  }

  // Preview card UI
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border-2 border-purple-200 rounded-xl p-4 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">AI Suggests</h3>
            <p className="text-xs text-slate-600">{agentName}</p>
          </div>
        </div>
        <Badge className="bg-purple-100 text-purple-700 border-purple-200">
          Pending
        </Badge>
      </div>

      {/* Summary */}
      <div className="mb-3">
        <p className="text-sm font-medium text-slate-900">{summary}</p>
      </div>

      {/* Diff View */}
      <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
        {changes.map((change) => (
          <div
            key={change.id}
            className={cn(
              "flex items-start gap-2 p-2.5 rounded-lg border",
              change.type === 'add' && "bg-emerald-50 border-emerald-200",
              change.type === 'remove' && "bg-red-50 border-red-200",
              change.type === 'modify' && "bg-blue-50 border-blue-200"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
              change.type === 'add' && "bg-emerald-600",
              change.type === 'remove' && "bg-red-600",
              change.type === 'modify' && "bg-blue-600"
            )}>
              {change.type === 'add' && <Plus className="w-3 h-3 text-white" />}
              {change.type === 'remove' && <Minus className="w-3 h-3 text-white" />}
              {change.type === 'modify' && <Sparkles className="w-3 h-3 text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium",
                change.type === 'add' && "text-emerald-900",
                change.type === 'remove' && "text-red-900 line-through",
                change.type === 'modify' && "text-blue-900"
              )}>
                {change.item.name}
              </p>
              <p className="text-xs text-slate-600">{change.item.details}</p>
              {change.item.time && (
                <p className="text-[11px] text-slate-500 mt-0.5">{change.item.time}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-700 leading-relaxed">{explanation}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {onPreview && (
          <Button
            onClick={onPreview}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Preview
          </Button>
        )}
        <Button
          onClick={onDismiss}
          variant="outline"
          size="sm"
          className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100"
        >
          <X className="w-3.5 h-3.5 mr-1.5" />
          Dismiss
        </Button>
        <Button
          onClick={handleApply}
          size="sm"
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Check className="w-3.5 h-3.5 mr-1.5" />
          Apply
        </Button>
      </div>
    </motion.div>
  );
}

// Recent Changes Badge Component
export function RecentlyAddedBadge() {
  return (
    <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-[10px]">
      <Sparkles className="w-2.5 h-2.5 mr-1" />
      Recently added
    </Badge>
  );
}
