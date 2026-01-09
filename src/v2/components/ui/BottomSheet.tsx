import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'auto' | 'sm' | 'md' | 'lg' | 'full';
  showHandle?: boolean;
  showCloseButton?: boolean;
  dismissOnBackdrop?: boolean;
  className?: string;
}

/**
 * BottomSheet - Mobile-optimized modal that slides up from bottom
 * 
 * Better than center modals on mobile because:
 * - Thumb-friendly (bottom of screen)
 * - Native mobile pattern (iOS, Android)
 * - Can show context behind
 * - Easy to dismiss with swipe
 * 
 * Features:
 * - Swipe to dismiss
 * - Backdrop tap to close
 * - Multiple height options
 * - Smooth animations
 * - Accessible
 */
export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = 'md',
  showHandle = true,
  showCloseButton = true,
  dismissOnBackdrop = true,
  className = '',
}: BottomSheetProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  // Height classes
  const heightClasses = {
    auto: 'max-h-[90vh]',
    sm: 'h-[30vh]',
    md: 'h-[50vh]',
    lg: 'h-[70vh]',
    full: 'h-[90vh]',
  };

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = () => {
    if (dismissOnBackdrop) {
      onClose();
    }
  };

  // Touch handlers for swipe to dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0 && sheetRef.current) {
      // Only allow pulling down, not up
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    const diff = currentY.current - startY.current;
    const threshold = 100; // Pixels to swipe to dismiss

    if (diff > threshold) {
      onClose();
    }

    // Reset transform
    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
    }

    startY.current = 0;
    currentY.current = 0;
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-40' : 'opacity-0'
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`
          relative w-full bg-white rounded-t-2xl shadow-2xl
          transition-transform duration-300 ease-out
          ${heightClasses[height]}
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          ${className}
        `}
        onTransitionEnd={() => {
          if (!isOpen) setIsAnimating(false);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Bottom sheet'}
      >
        {/* Handle */}
        {showHandle && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-8 h-1 bg-gray-300 rounded-full" aria-hidden="true" />
          </div>
        )}

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`overflow-y-auto ${height === 'auto' ? 'max-h-[80vh]' : 'flex-1'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * BottomSheetList - Pre-styled list for bottom sheets
 * Common pattern for action menus
 */
interface BottomSheetListItem {
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface BottomSheetListProps {
  items: BottomSheetListItem[];
  onItemClick?: () => void; // Called after any item is clicked
}

export function BottomSheetList({ items, onItemClick }: BottomSheetListProps) {
  return (
    <div className="py-2">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            if (!item.disabled) {
              item.onClick();
              onItemClick?.();
            }
          }}
          disabled={item.disabled}
          className={`
            w-full flex items-center gap-3 px-4 py-4 min-h-[56px]
            text-left transition-colors
            ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 active:bg-gray-100'}
            ${item.destructive ? 'text-red-600' : 'text-gray-900'}
          `}
        >
          {item.icon && (
            <span className={`flex-shrink-0 ${item.destructive ? 'text-red-600' : 'text-gray-600'}`}>
              {item.icon}
            </span>
          )}
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * BottomSheetActions - Footer with action buttons
 */
interface BottomSheetActionsProps {
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function BottomSheetActions({ primaryAction, secondaryAction }: BottomSheetActionsProps) {
  return (
    <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200">
      <div className="flex gap-3">
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="flex-1 h-12 rounded-lg font-medium text-gray-700 border-2 border-gray-300 hover:bg-gray-50 active:scale-95 transition-all"
          >
            {secondaryAction.label}
          </button>
        )}
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled}
            className={`
              ${secondaryAction ? 'flex-1' : 'w-full'}
              h-12 rounded-lg font-semibold
              bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-95 transition-all
            `}
          >
            {primaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * FilterBottomSheet - Pre-configured for filter use case
 */
interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  children: React.ReactNode;
  activeFilterCount?: number;
}

export function FilterBottomSheet({
  isOpen,
  onClose,
  onApply,
  onClear,
  children,
  activeFilterCount = 0,
}: FilterBottomSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      height="lg"
      showHandle={true}
      showCloseButton={false}
    >
      {/* Custom Header */}
      <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          onClick={onClear}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Clear all
        </button>
      </div>

      {/* Filter Content */}
      <div className="p-4">
        {children}
      </div>

      {/* Footer with Apply Button */}
      <BottomSheetActions
        primaryAction={{
          label: `Apply Filters${activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}`,
          onClick: () => {
            onApply();
            onClose();
          },
        }}
      />
    </BottomSheet>
  );
}
