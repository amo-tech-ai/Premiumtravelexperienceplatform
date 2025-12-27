/**
 * CONTEXT BANNER
 * 
 * Shows exploration context at top of Explore page
 * 
 * FORMAT:
 * "Top restaurants in El Poblado — with nearby events and places"
 * 
 * @see /docs/FIGMA-MAKE-PROMPTS.md (PROMPT 2)
 */

import React from 'react';
import { Sparkles, MapPin, X } from 'lucide-react';
import { cn } from '../ui/utils';
import { ExplorationContext } from '../../context/types/ExplorationTypes';

// ============================================================================
// TYPES
// ============================================================================

export interface ContextBannerProps {
  context: ExplorationContext;
  onDismiss?: () => void;
  showSecondaryCount?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ContextBanner Component
 * 
 * Shows AI context with primary and secondary counts
 * 
 * @example
 * ```tsx
 * <ContextBanner
 *   context={explorationContext}
 *   onDismiss={() => navigate('/explore')}
 * />
 * ```
 */
export function ContextBanner({
  context,
  onDismiss,
  showSecondaryCount = true,
}: ContextBannerProps) {
  const intentLabel = getIntentLabel(context.intent);
  const primaryCount = context.primaryResults.length;
  const secondaryCount = context.secondaryResults?.length || 0;

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-start justify-between gap-4">
          {/* Content */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {context.source === 'ai' ? (
                <Sparkles className="w-5 h-5 text-emerald-600" />
              ) : (
                <MapPin className="w-5 h-5 text-emerald-600" />
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-900 leading-relaxed">
                <span className="font-medium">
                  Top {intentLabel} in {context.area.name}
                </span>
                {showSecondaryCount && secondaryCount > 0 && (
                  <span className="text-slate-600">
                    {' '}— with nearby events and places
                  </span>
                )}
              </p>

              {/* Counts */}
              <div className="flex items-center gap-4 mt-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="text-xs text-slate-600">
                    {primaryCount} {intentLabel}
                  </span>
                </div>

                {showSecondaryCount && secondaryCount > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="text-xs text-slate-600">
                      {secondaryCount} nearby places
                    </span>
                  </div>
                )}

                {context.source === 'ai' && (
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span className="text-xs font-medium text-amber-700">
                      AI Suggested
                    </span>
                  </div>
                )}
              </div>

              {/* Reasoning */}
              {context.ranking?.reasoning && (
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {context.ranking.reasoning}
                </p>
              )}
            </div>
          </div>

          {/* Dismiss */}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="shrink-0 p-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
              aria-label="Dismiss context"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function getIntentLabel(intent: string): string {
  const labels: Record<string, string> = {
    restaurants: 'restaurants',
    events: 'events',
    rentals: 'stays',
    activities: 'activities',
    destinations: 'destinations',
    mixed: 'recommendations',
  };

  return labels[intent] || 'places';
}
