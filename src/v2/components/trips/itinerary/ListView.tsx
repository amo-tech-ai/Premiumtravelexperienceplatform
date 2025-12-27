/**
 * LIST VIEW
 * 
 * Simple list of activities for a day
 */

import { DayV2 } from '../../../types';
import { ItineraryItemCard } from './ItineraryItemCard';

interface ListViewProps {
  day: DayV2;
}

export function ListView({ day }: ListViewProps) {
  // Sort items by start time
  const sortedItems = [...day.items].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );
  
  // Detect conflicts
  const getConflicts = () => {
    const conflicts: Set<string> = new Set();
    for (let i = 0; i < sortedItems.length - 1; i++) {
      const current = sortedItems[i];
      const next = sortedItems[i + 1];
      if (current.endTime && current.endTime > next.startTime) {
        conflicts.add(current.id);
        conflicts.add(next.id);
      }
    }
    return conflicts;
  };
  
  const conflicts = getConflicts();
  
  return (
    <div className="space-y-3">
      {sortedItems.map((item) => (
        <ItineraryItemCard
          key={item.id}
          item={item}
          dayNumber={day.dayNumber}
          hasConflict={conflicts.has(item.id)}
        />
      ))}
      
      {/* Summary */}
      {sortedItems.length > 0 && (
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-neutral-600">Activities</div>
              <div className="font-medium text-lg">{sortedItems.length}</div>
            </div>
            <div>
              <div className="text-neutral-600">Duration</div>
              <div className="font-medium text-lg">
                {Math.floor(day.totalDuration / 60)}h {day.totalDuration % 60}m
              </div>
            </div>
            <div>
              <div className="text-neutral-600">Cost</div>
              <div className="font-medium text-lg">
                ${day.totalCost.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
