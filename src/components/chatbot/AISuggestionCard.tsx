/**
 * AI SUGGESTION CARD
 * 
 * Compact AI suggestion cards that link to Explore page
 * Shows short suggestions with "View all" link
 */

import React from 'react';
import { Sparkles, ArrowRight, Eye, X, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { useNavigate } from 'react-router';

// ============================================================================
// TYPES
// ============================================================================

export interface AISuggestionItem {
  id: string;
  name: string;
  subtitle: string;
  time?: string;
  badge?: string;
}

export interface AISuggestion {
  id: string;
  agent: string;
  title: string;
  description: string;
  items: AISuggestionItem[];
  category: 'restaurants' | 'events' | 'rentals' | 'destinations' | 'activities';
  status?: 'pending' | 'applied' | 'dismissed';
  exploreLink?: string;
}

interface AISuggestionCardProps {
  suggestion: AISuggestion;
  onPreview?: () => void;
  onDismiss?: () => void;
  onApply?: () => void;
  compact?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function AISuggestionCard({
  suggestion,
  onPreview,
  onDismiss,
  onApply,
  compact = false
}: AISuggestionCardProps) {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (suggestion.exploreLink) {
      navigate(suggestion.exploreLink);
    } else {
      navigate('/explore');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'restaurants':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'events':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'rentals':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'destinations':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = () => {
    if (suggestion.status === 'applied') {
      return (
        <Badge className="bg-emerald-600 text-white text-xs">
          Applied
        </Badge>
      );
    }
    if (suggestion.status === 'dismissed') {
      return (
        <Badge variant="secondary" className="bg-slate-200 text-slate-600 text-xs">
          Dismissed
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
        Pending
      </Badge>
    );
  };

  return (
    <div
      className={cn(
        'rounded-lg border bg-white transition-all',
        suggestion.status === 'applied' && 'border-emerald-200 bg-emerald-50/30',
        suggestion.status === 'dismissed' && 'opacity-50 border-slate-200',
        suggestion.status === 'pending' && 'border-purple-200 bg-purple-50/20'
      )}
    >
      {/* Header */}
      <div className="p-3 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-slate-600">{suggestion.agent}</span>
                {getStatusBadge()}
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">
                {suggestion.title}
              </h4>
              {!compact && (
                <p className="text-xs text-slate-600 line-clamp-2">
                  {suggestion.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="p-3 space-y-2">
        {suggestion.items.slice(0, compact ? 2 : 3).map((item, index) => (
          <div
            key={item.id}
            className={cn(
              'flex items-center gap-2 p-2 rounded-md border transition-colors',
              suggestion.status === 'applied' 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            )}
          >
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0',
              getCategoryColor(suggestion.category)
            )}>
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {item.name}
              </p>
              <p className="text-xs text-slate-600 truncate">
                {item.subtitle}
              </p>
            </div>
            {item.time && (
              <div className="text-xs text-slate-500 flex-shrink-0">
                {item.time}
              </div>
            )}
            {item.badge && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 flex-shrink-0">
                {item.badge}
              </Badge>
            )}
          </div>
        ))}

        {/* View all link */}
        {suggestion.items.length > (compact ? 2 : 3) && (
          <button
            onClick={handleViewAll}
            className="w-full text-xs text-indigo-600 hover:text-indigo-700 font-medium py-1.5 flex items-center justify-center gap-1 transition-colors"
          >
            View {suggestion.items.length - (compact ? 2 : 3)} more on Explore
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Actions */}
      {suggestion.status === 'pending' && (
        <div className="p-3 border-t border-slate-100 flex gap-2">
          {onPreview && (
            <Button
              size="sm"
              variant="outline"
              onClick={onPreview}
              className="flex-1 text-xs h-8"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Preview
            </Button>
          )}
          {onDismiss && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="flex-1 text-xs h-8 hover:bg-slate-100"
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              Dismiss
            </Button>
          )}
          {onApply && (
            <Button
              size="sm"
              onClick={onApply}
              className="flex-1 text-xs h-8 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Check className="w-3.5 h-3.5 mr-1.5" />
              Apply
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMPACT VERSION
// ============================================================================

export function AISuggestionCompact({
  suggestion,
  onViewAll
}: {
  suggestion: AISuggestion;
  onViewAll?: () => void;
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onViewAll) {
      onViewAll();
    } else if (suggestion.exploreLink) {
      navigate(suggestion.exploreLink);
    } else {
      navigate('/explore');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left p-3 rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 hover:border-purple-300 transition-all group"
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-purple-700 mb-0.5">
            {suggestion.agent}
          </p>
          <p className="text-sm font-semibold text-slate-900 line-clamp-1">
            {suggestion.title}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-purple-600 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </div>
      <p className="text-xs text-slate-600 line-clamp-2 mb-2">
        {suggestion.description}
      </p>
      <div className="flex items-center gap-1.5">
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 bg-white/60">
          {suggestion.items.length} suggestions
        </Badge>
        <span className="text-xs text-purple-600 font-medium">
          View all →
        </span>
      </div>
    </button>
  );
}

// ============================================================================
// INLINE SUGGESTION (in chat)
// ============================================================================

export function AISuggestionInline({
  suggestion,
  onApply
}: {
  suggestion: AISuggestion;
  onApply?: () => void;
}) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-200">
      <div className="flex items-start gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 mb-1">
            {suggestion.title}
          </p>
          <p className="text-xs text-slate-600">
            {suggestion.description}
          </p>
        </div>
      </div>
      
      <div className="space-y-1.5 mb-2">
        {suggestion.items.slice(0, 2).map((item) => (
          <div key={item.id} className="text-xs text-slate-700">
            • <span className="font-medium">{item.name}</span> - {item.subtitle}
          </div>
        ))}
        {suggestion.items.length > 2 && (
          <div className="text-xs text-purple-600 font-medium">
            + {suggestion.items.length - 2} more
          </div>
        )}
      </div>

      {onApply && (
        <Button
          size="sm"
          onClick={onApply}
          className="w-full text-xs h-7 bg-purple-600 hover:bg-purple-700 text-white"
        >
          Add to {suggestion.category}
        </Button>
      )}
    </div>
  );
}