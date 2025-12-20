import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  TrendingUp,
  Clock,
  DollarSign,
  ThumbsUp,
  ThumbsDown,
  X,
  Calendar,
  MapPin,
  Check
} from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../ui/utils';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

interface Suggestion {
  id: string;
  type: 'optimize' | 'add' | 'swap' | 'warning';
  title: string;
  description: string;
  reason: string;
  impact?: {
    timeSaved?: string;
    moneySaved?: string;
    distanceSaved?: string;
  };
  action: string;
  preview?: {
    image?: string;
    name?: string;
    category?: string;
  };
}

const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: '1',
    type: 'optimize',
    title: 'Reorder Day 2 activities',
    description: 'Group Comuna 13 tour with nearby coffee shop to save travel time',
    reason: 'Both locations are in the same neighborhood',
    impact: {
      timeSaved: '45 min',
      distanceSaved: '8 km'
    },
    action: 'Apply'
  },
  {
    id: '2',
    type: 'add',
    title: 'Add sunset viewpoint',
    description: 'Pueblito Paisa offers golden hour views between your afternoon activities',
    reason: 'Perfect timing + highly rated by travelers like you',
    preview: {
      image: 'https://images.unsplash.com/photo-1611728783289-d5e7d31d5c58?q=80&w=300',
      name: 'Pueblito Paisa',
      category: 'Viewpoint'
    },
    action: 'Add to Day 2'
  },
  {
    id: '3',
    type: 'swap',
    title: 'Cheaper dinner option',
    description: 'Try Mondongos instead of El Cielo for authentic Colombian food',
    reason: 'Save $60 per person with similar ratings',
    impact: {
      moneySaved: '$120'
    },
    preview: {
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=300',
      name: 'Mondongos',
      category: 'Colombian'
    },
    action: 'Swap'
  },
  {
    id: '4',
    type: 'warning',
    title: 'Museum closes at 5 PM',
    description: 'Your current schedule arrives at 4:30 PM - not enough time',
    reason: 'Schedule conflict detected',
    action: 'Move earlier'
  }
];

interface AISuggestionsPanelProps {
  suggestions?: Suggestion[];
  onApply: (suggestionId: string) => void;
  onDismiss: (suggestionId: string) => void;
  onFeedback?: (suggestionId: string, helpful: boolean) => void;
}

export const AISuggestionsPanel = ({
  suggestions = MOCK_SUGGESTIONS,
  onApply,
  onDismiss,
  onFeedback
}: AISuggestionsPanelProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  const handleApply = (id: string) => {
    setAppliedIds(prev => new Set([...prev, id]));
    onApply(id);
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">AI Suggestions</h3>
            <p className="text-xs text-slate-500">
              {suggestions.length} way{suggestions.length !== 1 ? 's' : ''} to improve your trip
            </p>
          </div>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-2">
        <AnimatePresence>
          {suggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              isExpanded={expandedId === suggestion.id}
              isApplied={appliedIds.has(suggestion.id)}
              onToggle={() => setExpandedId(expandedId === suggestion.id ? null : suggestion.id)}
              onApply={() => handleApply(suggestion.id)}
              onDismiss={() => onDismiss(suggestion.id)}
              onFeedback={onFeedback}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface SuggestionCardProps {
  suggestion: Suggestion;
  isExpanded: boolean;
  isApplied: boolean;
  onToggle: () => void;
  onApply: () => void;
  onDismiss: () => void;
  onFeedback?: (suggestionId: string, helpful: boolean) => void;
}

const SuggestionCard = ({
  suggestion,
  isExpanded,
  isApplied,
  onToggle,
  onApply,
  onDismiss,
  onFeedback
}: SuggestionCardProps) => {
  const typeConfig = {
    optimize: {
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      accent: 'bg-emerald-500'
    },
    add: {
      icon: Sparkles,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      accent: 'bg-blue-500'
    },
    swap: {
      icon: DollarSign,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      accent: 'bg-purple-500'
    },
    warning: {
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      accent: 'bg-amber-500'
    }
  };

  const config = typeConfig[suggestion.type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "relative rounded-xl border overflow-hidden transition-all",
        isApplied 
          ? "bg-slate-50 border-slate-200 opacity-60" 
          : "bg-white hover:shadow-md",
        config.border
      )}
    >
      {/* Applied Overlay */}
      {isApplied && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[1px] z-10">
          <div className="flex items-center gap-2 text-emerald-600">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Applied</span>
          </div>
        </div>
      )}

      {/* Color Accent Bar */}
      <div className={cn("h-1", config.accent)} />

      <div className="p-4">
        {/* Header */}
        <button
          onClick={onToggle}
          className="w-full text-left"
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", config.bg)}>
              <Icon className={cn("w-5 h-5", config.color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 leading-snug mb-1">
                {suggestion.title}
              </h4>
              <p className="text-sm text-slate-600">
                {suggestion.description}
              </p>

              {/* Impact Pills */}
              {suggestion.impact && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestion.impact.timeSaved && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{suggestion.impact.timeSaved} saved</span>
                    </div>
                  )}
                  {suggestion.impact.moneySaved && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                      <DollarSign className="w-3 h-3" />
                      <span>{suggestion.impact.moneySaved} saved</span>
                    </div>
                  )}
                  {suggestion.impact.distanceSaved && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      <MapPin className="w-3 h-3" />
                      <span>{suggestion.impact.distanceSaved} saved</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dismiss Button */}
            {!isApplied && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
                className="flex-shrink-0 w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && !isApplied && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                {/* Reason */}
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">
                    Why we suggest this
                  </p>
                  <p className="text-sm text-slate-700">
                    {suggestion.reason}
                  </p>
                </div>

                {/* Preview */}
                {suggestion.preview && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase mb-2">
                      Preview
                    </p>
                    <div className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      {suggestion.preview.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={suggestion.preview.image}
                            alt={suggestion.preview.name || ''}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h5 className="font-semibold text-slate-900 text-sm">
                          {suggestion.preview.name}
                        </h5>
                        {suggestion.preview.category && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {suggestion.preview.category}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={onApply}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white"
                  >
                    {suggestion.action}
                  </Button>
                </div>

                {/* Feedback */}
                {onFeedback && (
                  <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500">Was this helpful?</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onFeedback(suggestion.id, true)}
                        className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-600" />
                      </button>
                      <button
                        onClick={() => onFeedback(suggestion.id, false)}
                        className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <ThumbsDown className="w-3.5 h-3.5 text-slate-400 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
