/**
 * LONG PRESS MENU
 * 
 * Touch-optimized context menu triggered by long press
 */

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit, Trash2, Copy, Share2, X } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: typeof Edit;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

interface LongPressMenuProps {
  children: ReactNode;
  menuItems: MenuItem[];
  disabled?: boolean;
}

export function LongPressMenu({ children, menuItems, disabled }: LongPressMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const LONG_PRESS_DURATION = 500; // ms
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      // Trigger haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      setMenuPosition({
        x: touch.clientX,
        y: touch.clientY,
      });
      setIsMenuOpen(true);
    }, LONG_PRESS_DURATION);
  };
  
  const handleTouchEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
  
  const handleTouchMove = () => {
    // Cancel long press if user moves finger
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
  
  const handleMenuItemClick = (onClick: () => void) => {
    onClick();
    setIsMenuOpen(false);
  };
  
  return (
    <>
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        className="touch-manipulation"
      >
        {children}
      </div>
      
      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'fixed',
                top: menuPosition.y,
                left: menuPosition.x,
                transform: 'translate(-50%, -100%) translateY(-8px)',
              }}
              className="bg-white rounded-lg shadow-2xl overflow-hidden z-50 min-w-[200px]"
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200">
                <span className="text-sm font-medium">Actions</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-neutral-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Menu items */}
              <div className="py-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.onClick)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors ${
                        item.variant === 'destructive' ? 'text-red-600' : 'text-neutral-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
