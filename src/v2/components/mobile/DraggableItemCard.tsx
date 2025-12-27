/**
 * DRAGGABLE ITEM CARD
 * 
 * Touch-optimized draggable wrapper for itinerary items
 * Supports reordering within day and between days
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ItineraryItemV2 } from '../../types';
import { GripVertical } from 'lucide-react';
import { ItineraryItemCard } from '../trips/itinerary/ItineraryItemCard';

interface DraggableItemCardProps {
  item: ItineraryItemV2;
  dayNumber: number;
  hasConflict?: boolean;
}

export function DraggableItemCard({ item, dayNumber, hasConflict }: DraggableItemCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: item.id,
    data: {
      item,
      dayNumber,
    },
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };
  
  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 touch-none cursor-grab active:cursor-grabbing"
      >
        <div className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors">
          <GripVertical className="w-4 h-4 text-neutral-500" />
        </div>
      </div>
      
      {/* Item Card with left padding for handle */}
      <div className="pl-12">
        <ItineraryItemCard
          item={item}
          dayNumber={dayNumber}
          hasConflict={hasConflict}
        />
      </div>
      
      {/* Drag overlay indicator */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-100 border-2 border-blue-500 rounded-lg flex items-center justify-center pointer-events-none">
          <span className="text-sm font-medium text-blue-700">Moving...</span>
        </div>
      )}
    </div>
  );
}
