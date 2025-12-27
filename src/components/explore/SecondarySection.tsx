/**
 * SECONDARY SECTION COMPONENT
 * 
 * Shows secondary results (events, attractions, rentals)
 * 
 * RULES:
 * - Collapsed by default
 * - Shows count badge
 * - "See more" expands inline
 * - Never competes visually with primary
 * 
 * @see /docs/FIGMA-MAKE-PROMPTS.md (PROMPT 2)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Calendar, Home, Compass, MapPin } from 'lucide-react';
import { cn } from '../ui/utils';
import { ExplorationResult } from '../../context/types/ExplorationTypes';

// ============================================================================
// TYPES
// ============================================================================

export interface SecondarySectionProps {
  /** Section title */
  title: string;

  /** Section type */
  type: 'events' | 'attractions' | 'rentals';

  /** Results to display */
  results: ExplorationResult[];

  /** Is expanded */
  defaultExpanded?: boolean;

  /** On result click */
  onResultClick?: (result: ExplorationResult) => void;

  /** Empty state message */
  emptyMessage?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * SecondarySection Component
 * 
 * Collapsible section for secondary results
 * 
 * @example
 * ```tsx
 * <SecondarySection
 *   title="Events near these restaurants"
 *   type="events"
 *   results={eventResults}
 *   emptyMessage="No events tonight near these spots"
 * />
 * ```
 */
export function SecondarySection({
  title,
  type,
  results,
  defaultExpanded = false,
  onResultClick,
  emptyMessage,
}: SecondarySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const icon = {
    events: Calendar,
    attractions: Compass,
    rentals: Home,
  }[type];

  const Icon = icon;

  // Don't show if empty and no custom message
  if (results.length === 0 && !emptyMessage) {
    return null;
  }

  return (
    <div className="border-t border-slate-100">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between',
          'hover:bg-slate-50 transition-colors'
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-slate-400" />
          <span className="font-medium text-slate-700">{title}</span>
          
          {/* Count Badge */}
          {results.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
              {results.length}
            </span>
          )}
        </div>

        <ChevronDown
          className={cn(
            'w-5 h-5 text-slate-400 transition-transform',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {results.length > 0 ? (
              <div className="px-4 sm:px-6 lg:px-8 pb-6 space-y-3">
                {results.map((result) => (
                  <SecondaryResultCard
                    key={result.id}
                    result={result}
                    onClick={() => onResultClick?.(result)}
                  />
                ))}
              </div>
            ) : (
              <div className="px-4 sm:px-6 lg:px-8 pb-6">
                <p className="text-sm text-slate-500 leading-relaxed">
                  {emptyMessage || `No ${type} available`}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// SECONDARY RESULT CARD
// ============================================================================

function SecondaryResultCard({
  result,
  onClick,
}: {
  result: ExplorationResult;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-3 rounded-lg border border-slate-200',
        'hover:border-slate-300 hover:bg-slate-50',
        'transition-colors text-left'
      )}
    >
      <div className="flex gap-3">
        {/* Image (if available) */}
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
          <h4 className="font-medium text-slate-900 text-sm truncate">
            {result.name}
          </h4>

          {result.description && (
            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
              {result.description}
            </p>
          )}

          {/* Distance */}
          {result.distance && (
            <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
              <MapPin className="w-3 h-3" />
              <span>{formatDistance(result.distance)} from main area</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function formatDistance(meters: number): string {
  const miles = meters * 0.000621371;
  
  if (miles < 0.1) {
    return 'Walking distance';
  } else if (miles < 0.5) {
    return `${(miles * 5280).toFixed(0)} ft`;
  } else {
    return `${miles.toFixed(1)} mi`;
  }
}
