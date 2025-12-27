/**
 * DAY ACCORDION
 * 
 * Expandable day section with timeline/list view
 */

import { useState } from 'react';
import { DayV2 } from '../../../types';
import { ChevronDown, ChevronUp, Plus, Clock, DollarSign } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { TimelineView } from './TimelineView';
import { ListView } from './ListView';

interface DayAccordionProps {
  day: DayV2;
  viewMode: 'timeline' | 'list';
  onAddItem: () => void;
  collapsed?: boolean;
}

export function DayAccordion({ 
  day, 
  viewMode, 
  onAddItem,
  collapsed: initialCollapsed = false,
}: DayAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(!initialCollapsed);
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };
  
  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3">
            <h3 className="font-medium">
              Day {day.dayNumber}
              {day.title && ` — ${day.title}`}
            </h3>
            {day.items.length > 0 && (
              <span className="text-sm text-neutral-600">
                ({day.items.length} {day.items.length === 1 ? 'activity' : 'activities'})
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-600 mt-1">
            {formatDate(day.date)}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          {day.items.length > 0 && (
            <>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(day.totalDuration)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <DollarSign className="w-4 h-4" />
                <span>${day.totalCost.toLocaleString()}</span>
              </div>
            </>
          )}
          
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-neutral-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          )}
        </div>
      </button>
      
      {/* Content */}
      {isExpanded && (
        <div className="px-6 py-4 border-t border-neutral-200">
          {day.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-neutral-600 mb-4">No activities planned for this day</p>
              <Button onClick={onAddItem} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add First Activity
              </Button>
            </div>
          ) : (
            <>
              {viewMode === 'timeline' ? (
                <TimelineView day={day} />
              ) : (
                <ListView day={day} />
              )}
              
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <Button onClick={onAddItem} variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Activity
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Calendar({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}
