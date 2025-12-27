/**
 * PULL TO REFRESH
 * 
 * Mobile pull-to-refresh component
 */

import { useState, useRef, ReactNode } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  disabled?: boolean;
}

export function PullToRefresh({ onRefresh, children, disabled }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startYRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const PULL_THRESHOLD = 80; // pixels to trigger refresh
  const MAX_PULL = 120; // maximum pull distance
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    // Only start if at top of scroll
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || disabled || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;
    
    // Only allow pulling down
    if (diff > 0) {
      // Prevent default scrolling when pulling
      e.preventDefault();
      
      // Apply resistance to pull
      const resistance = 0.5;
      const distance = Math.min(diff * resistance, MAX_PULL);
      setPullDistance(distance);
    }
  };
  
  const handleTouchEnd = async () => {
    if (!isPulling) return;
    
    setIsPulling(false);
    
    // Trigger refresh if threshold was reached
    if (pullDistance >= PULL_THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD);
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      // Reset if threshold not reached
      setPullDistance(0);
    }
  };
  
  const getIcon = () => {
    if (isRefreshing) {
      return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
    }
    
    const rotation = (pullDistance / PULL_THRESHOLD) * 180;
    return (
      <RefreshCw
        className={`w-5 h-5 transition-colors ${
          pullDistance >= PULL_THRESHOLD ? 'text-blue-600' : 'text-neutral-400'
        }`}
        style={{ transform: `rotate(${rotation}deg)` }}
      />
    );
  };
  
  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <motion.div
        className="flex items-center justify-center"
        style={{
          height: pullDistance || (isRefreshing ? PULL_THRESHOLD : 0),
          opacity: pullDistance > 0 || isRefreshing ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col items-center gap-2">
          {getIcon()}
          <span className="text-xs text-neutral-600">
            {isRefreshing
              ? 'Refreshing...'
              : pullDistance >= PULL_THRESHOLD
              ? 'Release to refresh'
              : 'Pull to refresh'}
          </span>
        </div>
      </motion.div>
      
      {/* Content */}
      <div
        style={{
          transform: isRefreshing ? 'none' : `translateY(${pullDistance}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
