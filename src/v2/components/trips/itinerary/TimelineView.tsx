/**
 * TIMELINE VIEW
 * 
 * Visual timeline showing activities by time
 */

import { DayV2 } from '../../../types';
import { ItineraryItemCard } from './ItineraryItemCard';

interface TimelineViewProps {
  day: DayV2;
}

export function TimelineView({ day }: TimelineViewProps) {
  // Sort items by start time
  const sortedItems = [...day.items].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );
  
  // Generate time slots (6am to 11pm)
  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = i + 6;
    return `${hour.toString().padStart(2, '0')}:00`;
  });
  
  // Check if time is within an activity
  const getItemAtTime = (time: string) => {
    return sortedItems.find(item => {
      const itemStart = item.startTime;
      const itemEnd = item.endTime || itemStart;
      return time >= itemStart && time < itemEnd;
    });
  };
  
  return (
    <div className="space-y-2">
      {/* Timeline Grid */}
      <div className="relative">
        {/* Time labels */}
        <div className="flex">
          <div className="w-20 flex-shrink-0" />
          <div className="flex-1 relative h-4">
            {/* Hour markers */}
            <div className="absolute inset-0 flex">
              {[6, 9, 12, 15, 18, 21].map(hour => (
                <div key={hour} className="flex-1 text-xs text-neutral-500 text-center">
                  {hour}:00
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Activities as cards */}
        <div className="mt-4 space-y-3">
          {sortedItems.map((item, index) => {
            // Calculate position and width based on time
            const startHour = parseInt(item.startTime.split(':')[0]);
            const startMin = parseInt(item.startTime.split(':')[1]);
            const startOffset = ((startHour - 6) * 60 + startMin) / (18 * 60);
            
            let width = 0.2; // Default width
            if (item.endTime) {
              const endHour = parseInt(item.endTime.split(':')[0]);
              const endMin = parseInt(item.endTime.split(':')[1]);
              const endOffset = ((endHour - 6) * 60 + endMin) / (18 * 60);
              width = endOffset - startOffset;
            }
            
            // Check for overlap with previous item
            const prevItem = index > 0 ? sortedItems[index - 1] : null;
            const hasOverlap = prevItem && prevItem.endTime && prevItem.endTime > item.startTime;
            
            return (
              <div key={item.id} className="flex items-start gap-4">
                <div className="w-20 flex-shrink-0 text-sm text-neutral-600 pt-2">
                  {item.startTime}
                </div>
                <div className="flex-1">
                  <ItineraryItemCard
                    item={item}
                    dayNumber={day.dayNumber}
                    hasConflict={hasOverlap}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Summary */}
      {sortedItems.length > 0 && (
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-neutral-600">Total Activities:</span>
                <span className="font-medium ml-2">{sortedItems.length}</span>
              </div>
              <div>
                <span className="text-neutral-600">Total Time:</span>
                <span className="font-medium ml-2">
                  {Math.floor(day.totalDuration / 60)}h {day.totalDuration % 60}m
                </span>
              </div>
            </div>
            <div>
              <span className="text-neutral-600">Total Cost:</span>
              <span className="font-medium ml-2">${day.totalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
