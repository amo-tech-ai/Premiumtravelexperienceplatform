import React, { useState } from 'react';
import { Sparkles, Check, X, Undo2, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { motion, AnimatePresence } from 'motion/react';
import { TripPlanCard } from './TripPlanCard';

// Types
interface TripActivity {
  id: string;
  name: string;
  type: 'restaurant' | 'event' | 'travel' | 'flex';
  startTime: string;
  endTime: string;
  duration: string;
  location: string;
  distance?: string;
  cost?: string;
  notes?: string;
}

interface TripPlan {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  totalDuration: string;
  totalCost: string;
  pacing: 'relaxed' | 'moderate' | 'packed';
  activities: TripActivity[];
  highlights: string[];
  tradeoffs: string;
}

interface TripPlanPreviewProps {
  plans: TripPlan[];
  agentName?: string;
  summary: string;
  onApply?: (planId: string) => void;
  onDismiss?: () => void;
}

export function TripPlanPreview({
  plans,
  agentName = 'Local Scout',
  summary,
  onApply,
  onDismiss
}: TripPlanPreviewProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(plans[0]?.id || null);
  const [appliedPlanId, setAppliedPlanId] = useState<string | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [undoTimer, setUndoTimer] = useState(5);

  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  const handleApply = () => {
    if (!selectedPlanId) return;
    
    setAppliedPlanId(selectedPlanId);
    setShowUndo(true);
    onApply?.(selectedPlanId);

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
    setAppliedPlanId(null);
    setShowUndo(false);
    setUndoTimer(5);
  };

  // Success state - after applying
  if (appliedPlanId && showUndo) {
    const appliedPlan = plans.find(p => p.id === appliedPlanId);
    
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
              <h3 className="font-semibold text-emerald-900">Plan Applied</h3>
              <p className="text-xs text-emerald-700">{appliedPlan?.title} is now active</p>
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
            Keep Plan
          </Button>
        </div>
      </motion.div>
    );
  }

  // Preview selection UI
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-white border-2 border-purple-200 rounded-xl p-4 shadow-lg">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">AI Suggests Trip Plans</h3>
              <p className="text-xs text-slate-600">{agentName}</p>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
            {plans.length} Options
          </Badge>
        </div>

        <p className="text-sm text-slate-900 mb-3">{summary}</p>

        {/* Plan Selector Tabs */}
        <div className="flex gap-2 mb-3">
          {plans.map((plan, idx) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={cn(
                "flex-1 px-3 py-2 rounded-lg border transition-all text-xs font-medium",
                selectedPlanId === plan.id
                  ? "bg-purple-100 border-purple-300 text-purple-700"
                  : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
              )}
            >
              <div className="flex items-center justify-center gap-1.5">
                <span>Plan {String.fromCharCode(65 + idx)}</span>
                {idx === 0 && (
                  <Sparkles className="w-3 h-3" />
                )}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {plan.pacing}
              </div>
            </button>
          ))}
        </div>

        {/* Quick Comparison */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <div className="grid grid-cols-3 gap-2 text-center">
            {plans.map((plan, idx) => (
              <div 
                key={plan.id}
                className={cn(
                  "text-[10px] p-1.5 rounded",
                  selectedPlanId === plan.id ? "bg-purple-100 text-purple-700" : "text-slate-600"
                )}
              >
                <div className="font-medium">{plan.totalCost}</div>
                <div className="text-[9px] opacity-75">{plan.totalDuration}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
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
            disabled={!selectedPlanId}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Check className="w-3.5 h-3.5 mr-1.5" />
            Apply Plan {selectedPlanId && String.fromCharCode(65 + plans.findIndex(p => p.id === selectedPlanId))}
          </Button>
        </div>
      </div>

      {/* Selected Plan Preview */}
      {selectedPlan && (
        <motion.div
          key={selectedPlan.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <TripPlanCard plan={selectedPlan} isRecommended />
        </motion.div>
      )}
    </div>
  );
}
