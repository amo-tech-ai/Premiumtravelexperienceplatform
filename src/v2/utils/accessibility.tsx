/**
 * ACCESSIBILITY UTILITIES
 * 
 * Hooks and utilities for accessibility features
 */

import { useEffect, useRef } from 'react';

/**
 * Focus management hook
 * Automatically focuses element on mount
 */
export function useFocusOnMount() {
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);
  
  return ref;
}

/**
 * Focus trap hook
 * Keeps focus within a container (for modals, panels)
 */
export function useFocusTrap(isActive: boolean = true) {
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!isActive || !ref.current) return;
    
    const container = ref.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    
    // Focus first element on mount
    firstElement?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);
  
  return ref;
}

/**
 * Keyboard navigation hook
 * Handles arrow key navigation in lists
 */
export function useKeyboardNavigation(
  items: any[],
  onSelect: (index: number) => void,
  isActive: boolean = true
) {
  const containerRef = useRef<HTMLElement>(null);
  const currentIndexRef = useRef(0);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          currentIndexRef.current = Math.min(
            currentIndexRef.current + 1,
            items.length - 1
          );
          onSelect(currentIndexRef.current);
          break;
        
        case 'ArrowUp':
          e.preventDefault();
          currentIndexRef.current = Math.max(currentIndexRef.current - 1, 0);
          onSelect(currentIndexRef.current);
          break;
        
        case 'Home':
          e.preventDefault();
          currentIndexRef.current = 0;
          onSelect(currentIndexRef.current);
          break;
        
        case 'End':
          e.preventDefault();
          currentIndexRef.current = items.length - 1;
          onSelect(currentIndexRef.current);
          break;
        
        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect(currentIndexRef.current);
          break;
      }
    };
    
    const container = containerRef.current;
    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, items.length, onSelect]);
  
  return containerRef;
}

/**
 * Screen reader announcement
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Skip link component
 */
export function SkipLink({ targetId, label = 'Skip to main content' }: { targetId: string; label?: string }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
    >
      {label}
    </a>
  );
}
