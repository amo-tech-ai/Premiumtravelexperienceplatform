/**
 * CHAT RECOMMENDATION CARD
 * 
 * Shows top 3 AI recommendations in Chat
 * 
 * RULES:
 * - Show ONLY top 3
 * - Brief explanation of why selected
 * - No "Add to trip" buttons in Chat
 * - Single CTA: "View all on the map"
 * 
 * @see /docs/FIGMA-MAKE-PROMPTS.md (PROMPT 1)
 */

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Star, DollarSign, Navigation } from 'lucide-react';
import { cn } from '../ui/utils';
import { ExplorationResult } from '../../context/types/ExplorationTypes';

// ============================================================================
// TYPES
// ============================================================================

export interface ChatRecommendationProps {
  /** Top 3 results */
  results: ExplorationResult[];

  /** Why these were selected */
  reasoning?: string;

  /** Total count of all results */
  totalCount: number;

  /** Intent label (e.g., "restaurants") */
  intentLabel: string;

  /** Area name (e.g., "El Poblado") */
  areaName: string;

  /** View all CTA action */
  onViewAll: () => void;
}

// ============================================================================
// MINI RESULT CARD
// ============================================================================

function MiniResultCard({ result }: { result: ExplorationResult }) {
  return (
    <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-colors">
      <div className="flex gap-3">
        {/* Image */}
        {result.imageUrl && (
          <div className="w-16 h-16 rounded-lg bg-slate-100 shrink-0 overflow-hidden">
            <img
              src={result.imageUrl}
              alt={result.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-900 truncate">
            {result.name}
          </h4>

          {/* Rating & Price */}
          <div className="flex items-center gap-2 mt-1">
            {result.rating && (
              <div className="flex items-center gap-1 text-xs text-amber-600">
                <Star className="w-3 h-3 fill-current" />
                <span className="font-medium">{result.rating.toFixed(1)}</span>
              </div>
            )}

            {result.priceLevel && (
              <div className="flex items-center text-xs text-slate-500">
                {'$'.repeat(result.priceLevel)}
              </div>
            )}
          </div>

          {/* Distance */}
          {result.distance && (
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <Navigation className="w-3 h-3" />
              <span>{formatDistance(result.distance)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * ChatRecommendationCard
 * 
 * Shows AI recommendations in Chat with explanation
 * 
 * @example
 * ```tsx
 * <ChatRecommendationCard
 *   results={topThree}
 *   reasoning="Selected for romantic ambiance and high ratings"
 *   totalCount={12}
 *   intentLabel="restaurants"
 *   areaName="El Poblado"
 *   onViewAll={() => navigateToExplore(contextId)}
 * />
 * ```
 */
export function ChatRecommendationCard({
  results,
  reasoning,
  totalCount,
  intentLabel,
  areaName,
  onViewAll,
}: ChatRecommendationProps) {
  // Limit to top 3
  const topThree = results.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Header with reasoning */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-slate-700 leading-relaxed">
              <span className="font-medium text-slate-900">
                Here are my top 3 {intentLabel}
              </span>
              {areaName && (
                <span className="text-slate-600"> in {areaName}</span>
              )}
            </p>
            {reasoning && (
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {reasoning}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Top 3 Results */}
      <div className="space-y-2">
        {topThree.map((result, index) => (
          <div key={result.id} className="relative">
            {/* Rank Badge */}
            <div className="absolute -left-2 -top-2 z-10 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
              {index + 1}
            </div>
            <MiniResultCard result={result} />
          </div>
        ))}
      </div>

      {/* Single CTA */}
      <button
        onClick={onViewAll}
        className={cn(
          'w-full px-4 py-3 rounded-xl font-medium transition-all',
          'bg-emerald-600 text-white hover:bg-emerald-700',
          'flex items-center justify-center gap-2',
          'shadow-sm hover:shadow-md'
        )}
      >
        <MapPin className="w-4 h-4" />
        <span>View all {totalCount} {intentLabel} on the map</span>
      </button>

      {/* Subtle helper text */}
      <p className="text-xs text-center text-slate-400">
        See the full list with map, filters, and more details
      </p>
    </motion.div>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function formatDistance(meters: number): string {
  const miles = meters * 0.000621371;
  
  if (miles < 0.1) {
    return 'Nearby';
  } else if (miles < 1) {
    return `${(miles * 5280).toFixed(0)} ft`;
  } else {
    return `${miles.toFixed(1)} mi`;
  }
}

// ============================================================================
// CHAT MESSAGE FORMATTER
// ============================================================================

/**
 * Format AI response as Chat message
 * 
 * @example
 * ```tsx
 * const message = formatRecommendationMessage({
 *   results: topThree,
 *   totalCount: 12,
 *   intentLabel: 'restaurants',
 *   areaName: 'El Poblado',
 *   reasoning: 'Based on ratings and proximity',
 * });
 * ```
 */
export function formatRecommendationMessage({
  results,
  totalCount,
  intentLabel,
  areaName,
  reasoning,
}: {
  results: ExplorationResult[];
  totalCount: number;
  intentLabel: string;
  areaName: string;
  reasoning?: string;
}): string {
  const topThree = results.slice(0, 3);
  
  let message = `I found ${totalCount} great ${intentLabel}`;
  
  if (areaName) {
    message += ` in ${areaName}`;
  }
  
  message += `. Here are my top 3 recommendations:\n\n`;
  
  topThree.forEach((result, index) => {
    message += `${index + 1}. **${result.name}**`;
    
    if (result.rating) {
      message += ` (${result.rating.toFixed(1)}★)`;
    }
    
    if (result.description) {
      message += `\n   ${result.description}`;
    }
    
    message += '\n\n';
  });
  
  if (reasoning) {
    message += `\n_${reasoning}_\n\n`;
  }
  
  message += `Click "View all on the map" to see the complete list with filters and map view.`;
  
  return message;
}
