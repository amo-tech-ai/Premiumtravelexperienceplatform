/**
 * AnimatedCursor Component
 * Custom cursor with smooth movement and click animations
 */

import React from 'react';
import { motion } from 'motion/react';
import { colors } from '../config/animationConfig';

interface AnimatedCursorProps {
  x: number;
  y: number;
  isClicking: boolean;
  isVisible: boolean;
}

export function AnimatedCursor({ x, y, isClicking, isVisible }: AnimatedCursorProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      animate={{
        x: x,
        y: y,
        scale: isClicking ? 0.95 : 1,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        x: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
        y: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
        scale: { duration: 0.1, ease: [0.4, 0, 1, 1] },
        opacity: { duration: 0.3 },
      }}
      style={{
        filter: `drop-shadow(${colors.cursorShadow})`,
      }}
    >
      {/* Cursor SVG */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cursor pointer shape */}
        <path
          d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
          fill={colors.cursorFill}
          stroke={colors.cursorOutline}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Click ripple effect */}
      {isClicking && (
        <motion.div
          className="absolute top-0 left-0 w-6 h-6 -ml-1 -mt-1 rounded-full border-2 border-emerald-500"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      )}
    </motion.div>
  );
}
