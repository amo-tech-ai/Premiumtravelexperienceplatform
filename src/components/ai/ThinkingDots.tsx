import React from 'react';
import { motion } from 'motion/react';

export const ThinkingDots = () => {
  return (
    <div className="flex items-center gap-1.5 p-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-emerald-600/60"
          animate={{
            y: [-2, 2, -2],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};
