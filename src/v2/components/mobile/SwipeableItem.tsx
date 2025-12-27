/**
 * SWIPEABLE ITEM
 * 
 * Touch-optimized swipeable wrapper with actions
 * Swipe left: Delete | Swipe right: Edit
 */

import { useState, useRef, useEffect, ReactNode } from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface SwipeableItemProps {
  children: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export function SwipeableItem({ children, onEdit, onDelete, disabled }: SwipeableItemProps) {
  const [offset, setOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const SWIPE_THRESHOLD = 80; // pixels to trigger action
  const MAX_SWIPE = 120; // maximum swipe distance
  
  useEffect(() => {
    if (disabled) {
      setOffset(0);
      setIsSwiping(false);
    }
  }, [disabled]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping || disabled) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    // Clamp the offset
    const clampedOffset = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, diff));
    setOffset(clampedOffset);
  };
  
  const handleTouchEnd = () => {
    if (!isSwiping || disabled) return;
    
    setIsSwiping(false);
    
    // Check if threshold was reached
    if (offset < -SWIPE_THRESHOLD && onDelete) {
      // Swipe left - delete
      onDelete();
    } else if (offset > SWIPE_THRESHOLD && onEdit) {
      // Swipe right - edit
      onEdit();
    }
    
    // Reset position
    setOffset(0);
  };
  
  return (
    <div ref={containerRef} className="relative overflow-hidden touch-pan-y">
      {/* Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        {/* Edit action (right side, visible on right swipe) */}
        <div
          className={`flex items-center gap-2 transition-opacity ${
            offset > 20 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <Edit className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium text-blue-600">Edit</span>
        </div>
        
        {/* Delete action (left side, visible on left swipe) */}
        <div
          className={`flex items-center gap-2 transition-opacity ${
            offset < -20 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="text-sm font-medium text-red-600">Delete</span>
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      
      {/* Swipeable Content */}
      <div
        className="relative bg-white"
        style={{
          transform: `translateX(${offset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
