import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MainLayoutProps {
  children: React.ReactNode;
  variant?: 'light' | 'dark';
  showFooter?: boolean;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
