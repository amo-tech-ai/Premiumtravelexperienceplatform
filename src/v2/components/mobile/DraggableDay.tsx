/**
 * DRAGGABLE DAY
 * 
 * Day container with sortable items and drag & drop support
 */

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { DayV2 } from '../../types';
import { useTripV2 } from '../../context/TripV2Context';
import { DraggableItemCard } from './DraggableItemCard';
import { ItineraryItemCard } from '../trips/itinerary/ItineraryItemCard';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface DraggableDayProps {
  day: DayV2;
  onAddItem: () => void;
}

export function DraggableDay({ day, onAddItem }: DraggableDayProps) {
  const { reorderItineraryItems } = useTripV2();
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Configure sensors for both mouse and touch
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms hold before drag starts (allows scrolling)
        tolerance: 5,
      },
    })
  );
  
  // Sort items by start time
  const sortedItems = [...day.items].sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );
  
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    
    if (!over || active.id === over.id) return;
    
    const oldIndex = sortedItems.findIndex(item => item.id === active.id);
    const newIndex = sortedItems.findIndex(item => item.id === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedItems = arrayMove(sortedItems, oldIndex, newIndex);
      reorderItineraryItems(day.dayNumber, reorderedItems);
    }
  };
  
  const activeItem = sortedItems.find(item => item.id === activeId);
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedItems.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {sortedItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600 mb-4">No activities planned</p>
              <Button onClick={onAddItem} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add First Activity
              </Button>
            </div>
          ) : (
            <>
              {sortedItems.map((item) => (
                <DraggableItemCard
                  key={item.id}
                  item={item}
                  dayNumber={day.dayNumber}
                />
              ))}
              
              <Button
                onClick={onAddItem}
                variant="outline"
                size="sm"
                className="w-full gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Activity
              </Button>
            </>
          )}
        </div>
      </SortableContext>
      
      {/* Drag Overlay */}
      <DragOverlay>
        {activeItem && (
          <div className="opacity-80">
            <ItineraryItemCard
              item={activeItem}
              dayNumber={day.dayNumber}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
