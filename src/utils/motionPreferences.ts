/**
 * Motion Preferences Utility
 * Detects user's reduced motion preference and provides fallback behavior
 */

export function getPrefersReducedMotion(): boolean {
  // Check if window is defined (SSR safety)
  if (typeof window === 'undefined') {
    return false;
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

export function useReducedMotion(): boolean {
  // In a React component, you'd use useState and useEffect
  // For now, we'll just return the static value
  return getPrefersReducedMotion();
}

/**
 * Get motion-safe transition duration
 * Returns 0ms if user prefers reduced motion, otherwise returns specified duration
 */
export function getMotionDuration(duration: number): number {
  return getPrefersReducedMotion() ? 0 : duration;
}

/**
 * Get motion-safe animation variants for Motion/Framer Motion
 */
export function getMotionVariants(prefersReducedMotion: boolean) {
  return {
    // Crossfade variant
    crossfade: {
      initial: { opacity: prefersReducedMotion ? 1 : 0 },
      animate: { opacity: 1 },
      exit: { opacity: prefersReducedMotion ? 1 : 0 },
      transition: { duration: prefersReducedMotion ? 0 : 0.4 }
    },
    
    // Fade up variant
    fadeUp: {
      initial: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: prefersReducedMotion ? 0 : 0.6 }
    },
    
    // Scale variant
    scale: {
      initial: { scale: 1 },
      animate: (isActive: boolean) => ({
        scale: prefersReducedMotion ? 1 : (isActive ? 1 : 0.95)
      }),
      transition: { duration: prefersReducedMotion ? 0 : 0.4 }
    }
  };
}
