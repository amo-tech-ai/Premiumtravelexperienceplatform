/**
 * BOTTOM SHEET COMPONENT
 * 
 * Mobile-first drawer with 3 snap points and gesture controls
 * 
 * FEATURES:
 * - 3 snap points: peek (20%), half (50%), full (90%)
 * - Swipe gestures with spring physics
 * - Backdrop blur
 * - Keyboard detection and repositioning
 * - Accessible and performant
 * 
 * @see /docs/01-ai-features/04-mobile-bottom-sheet-spec.md
 * @see /docs/01-ai-features/PROMPT-3-WEEK-1-COMPLETE.md
 */

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { X, Minus } from 'lucide-react';
import { cn } from '../ui/utils';

// ============================================================================
// TYPES
// ============================================================================

export type SnapPoint = 'peek' | 'half' | 'full' | 'closed';

export interface BottomSheetProps {
  /** Is sheet open */
  isOpen: boolean;

  /** Close handler */
  onClose: () => void;

  /** Initial snap point */
  initialSnap?: SnapPoint;

  /** Sheet content */
  children: ReactNode;

  /** Optional header content */
  header?: ReactNode;

  /** Optional footer content */
  footer?: ReactNode;

  /** Enable backdrop */
  showBackdrop?: boolean;

  /** Enable close on backdrop click */
  closeOnBackdropClick?: boolean;

  /** Custom snap points (vh units) */
  snapPoints?: {
    peek: number;
    half: number;
    full: number;
  };

  /** Enable gesture controls */
  enableGestures?: boolean;

  /** Show drag handle */
  showHandle?: boolean;

  /** Custom className */
  className?: string;

  /** Callback when snap point changes */
  onSnapChange?: (snap: SnapPoint) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_SNAP_POINTS = {
  peek: 20,
  half: 50,
  full: 90,
};

const SWIPE_THRESHOLD = 50; // pixels
const VELOCITY_THRESHOLD = 500; // pixels per second

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * BottomSheet Component
 * 
 * Mobile bottom sheet with gesture controls
 * 
 * @example
 * ```tsx
 * <BottomSheet
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   initialSnap="half"
 *   header={<h2>Title</h2>}
 *   footer={<Button>Action</Button>}
 * >
 *   <div>Content</div>
 * </BottomSheet>
 * ```
 */
export function BottomSheet({
  isOpen,
  onClose,
  initialSnap = 'half',
  children,
  header,
  footer,
  showBackdrop = true,
  closeOnBackdropClick = true,
  snapPoints = DEFAULT_SNAP_POINTS,
  enableGestures = true,
  showHandle = true,
  className,
  onSnapChange,
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState<SnapPoint>(initialSnap);
  const y = useMotionValue(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Keyboard detection
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useKeyboardDetection((height) => setKeyboardHeight(height));

  // ============================================================================
  // SNAP CALCULATIONS
  // ============================================================================

  const getSnapY = (snap: SnapPoint): number => {
    const windowHeight = window.innerHeight;
    
    switch (snap) {
      case 'peek':
        return windowHeight * (1 - snapPoints.peek / 100);
      case 'half':
        return windowHeight * (1 - snapPoints.half / 100);
      case 'full':
        return windowHeight * (1 - snapPoints.full / 100);
      case 'closed':
        return windowHeight;
      default:
        return windowHeight * (1 - snapPoints.half / 100);
    }
  };

  const getNearestSnap = (currentY: number, velocityY: number): SnapPoint => {
    const windowHeight = window.innerHeight;
    const peekY = getSnapY('peek');
    const halfY = getSnapY('half');
    const fullY = getSnapY('full');

    // Velocity-based snapping
    if (Math.abs(velocityY) > VELOCITY_THRESHOLD) {
      if (velocityY > 0) {
        // Swiping down
        if (currentSnap === 'full') return 'half';
        if (currentSnap === 'half') return 'peek';
        return 'closed';
      } else {
        // Swiping up
        if (currentSnap === 'peek') return 'half';
        if (currentSnap === 'half') return 'full';
        return 'full';
      }
    }

    // Position-based snapping
    const distancesToSnaps = [
      { snap: 'full' as SnapPoint, distance: Math.abs(currentY - fullY) },
      { snap: 'half' as SnapPoint, distance: Math.abs(currentY - halfY) },
      { snap: 'peek' as SnapPoint, distance: Math.abs(currentY - peekY) },
    ];

    distancesToSnaps.sort((a, b) => a.distance - b.distance);
    return distancesToSnaps[0].snap;
  };

  // ============================================================================
  // GESTURE HANDLERS
  // ============================================================================

  const handleDragEnd = (event: any, info: PanInfo) => {
    const currentY = y.get();
    const velocityY = info.velocity.y;
    
    const newSnap = getNearestSnap(currentY, velocityY);
    
    if (newSnap === 'closed') {
      onClose();
    } else {
      setCurrentSnap(newSnap);
      onSnapChange?.(newSnap);
    }
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Sync snap point to motion value
  useEffect(() => {
    if (isOpen) {
      const targetY = getSnapY(currentSnap);
      y.set(targetY);
    } else {
      y.set(window.innerHeight);
    }
  }, [isOpen, currentSnap, y]);

  // Adjust for keyboard
  useEffect(() => {
    if (keyboardHeight > 0 && currentSnap !== 'full') {
      // Move sheet up when keyboard opens
      setCurrentSnap('full');
    }
  }, [keyboardHeight]);

  // ============================================================================
  // BACKDROP
  // ============================================================================

  const backdropOpacity = useTransform(
    y,
    [getSnapY('full'), getSnapY('closed')],
    [0.6, 0]
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      {showBackdrop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: backdropOpacity }}
          exit={{ opacity: 0 }}
          onClick={closeOnBackdropClick ? onClose : undefined}
          className="fixed inset-0 bg-black z-40"
          style={{ opacity: backdropOpacity }}
        />
      )}

      {/* Sheet */}
      <motion.div
        ref={sheetRef}
        drag={enableGestures ? 'y' : false}
        dragConstraints={{ top: getSnapY('full'), bottom: getSnapY('closed') }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{
          y,
          bottom: keyboardHeight > 0 ? keyboardHeight : 0,
        }}
        initial={{ y: window.innerHeight }}
        animate={{ y: getSnapY(currentSnap) }}
        exit={{ y: window.innerHeight }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 300,
        }}
        className={cn(
          'fixed left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50',
          'flex flex-col overflow-hidden',
          className
        )}
        style={{
          maxHeight: `${snapPoints.full}vh`,
          touchAction: 'none',
        }}
      >
        {/* Drag Handle */}
        {showHandle && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
          </div>
        )}

        {/* Header */}
        {header && (
          <div className="px-6 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center justify-between">
              {header}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div 
            className="px-6 py-4 border-t border-slate-100 shrink-0 bg-white"
            style={{
              paddingBottom: keyboardHeight > 0 ? 'env(safe-area-inset-bottom)' : '1rem',
            }}
          >
            {footer}
          </div>
        )}
      </motion.div>
    </>
  );
}

// ============================================================================
// KEYBOARD DETECTION HOOK
// ============================================================================

/**
 * useKeyboardDetection Hook
 * 
 * Detects iOS keyboard and returns height
 * 
 * @param onHeightChange - Callback when keyboard height changes
 */
function useKeyboardDetection(onHeightChange: (height: number) => void) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let initialHeight = window.visualViewport?.height || window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const keyboardHeight = Math.max(0, initialHeight - currentHeight);
      onHeightChange(keyboardHeight);
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, [onHeightChange]);
}

// ============================================================================
// PRESET VARIANTS
// ============================================================================

/**
 * Map Bottom Sheet
 * Preset for map view with place card
 */
export function MapBottomSheet({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      initialSnap="peek"
      snapPoints={{
        peek: 25,
        half: 60,
        full: 90,
      }}
      showBackdrop={false}
      closeOnBackdropClick={false}
    >
      {children}
    </BottomSheet>
  );
}

/**
 * Filter Bottom Sheet
 * Preset for filter controls
 */
export function FilterBottomSheet({
  isOpen,
  onClose,
  onApply,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  children: ReactNode;
}) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      initialSnap="half"
      header={<h2 className="text-lg font-serif font-bold">Filters</h2>}
      footer={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onApply}
            className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700"
          >
            Apply Filters
          </button>
        </div>
      }
    >
      {children}
    </BottomSheet>
  );
}
