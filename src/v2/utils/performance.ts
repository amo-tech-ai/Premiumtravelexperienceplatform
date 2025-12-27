/**
 * PERFORMANCE UTILITIES
 * 
 * Performance optimization utilities and hooks
 */

import { useEffect, useMemo, useCallback, useRef } from 'react';

/**
 * Debounce hook
 * Delays execution until after delay period
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Throttle hook
 * Limits execution to once per interval
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const lastRan = useRef(Date.now());
  
  return useCallback(
    ((...args) => {
      const now = Date.now();
      if (now - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = now;
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Intersection Observer hook
 * Lazy loading and visibility detection
 */
export function useIntersectionObserver(
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit
) {
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        callback(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options,
      }
    );
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [callback, options]);
  
  return ref;
}

/**
 * Measure render performance
 */
export function useMeasureRender(componentName: string, enabled: boolean = true) {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());
  
  useEffect(() => {
    if (!enabled) return;
    
    renderCount.current += 1;
    const endTime = Date.now();
    const duration = endTime - startTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[Performance] ${componentName} - Render #${renderCount.current} - ${duration}ms`
      );
    }
    
    startTime.current = Date.now();
  });
}

/**
 * Memoize expensive calculations
 */
export function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps);
}

/**
 * Preload data
 */
export function usePreload<T>(
  loader: () => Promise<T>,
  shouldLoad: boolean = true
) {
  const dataRef = useRef<T | null>(null);
  const isLoadingRef = useRef(false);
  
  useEffect(() => {
    if (!shouldLoad || isLoadingRef.current || dataRef.current) return;
    
    isLoadingRef.current = true;
    loader()
      .then((data) => {
        dataRef.current = data;
      })
      .catch((error) => {
        console.error('Preload error:', error);
      })
      .finally(() => {
        isLoadingRef.current = false;
      });
  }, [shouldLoad, loader]);
  
  return dataRef.current;
}

/**
 * Virtual scrolling hook
 * For large lists
 */
export function useVirtualScroll(
  itemCount: number,
  itemHeight: number,
  containerHeight: number,
  overscan: number = 3
) {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - overscan
  );
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      index: i,
      offsetTop: i * itemHeight,
    });
  }
  
  return {
    visibleItems,
    totalHeight: itemCount * itemHeight,
    onScroll: (e: React.UIEvent<HTMLElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    },
  };
}

/**
 * Performance mark
 */
export function mark(name: string) {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Performance measure
 */
export function measure(name: string, startMark: string, endMark: string) {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      performance.measure(name, startMark, endMark);
      const measures = performance.getEntriesByName(name);
      if (measures.length > 0) {
        const duration = measures[0].duration;
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
        }
        return duration;
      }
    } catch (error) {
      // Silent fail
    }
  }
  return 0;
}

// Re-export React for useDebounce
import React from 'react';
