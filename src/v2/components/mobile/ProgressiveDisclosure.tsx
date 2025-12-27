/**
 * PROGRESSIVE DISCLOSURE
 * 
 * Smart expandable/collapsible sections with smooth animations
 */

import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProgressiveDisclosureProps {
  title: string;
  preview?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
}

export function ProgressiveDisclosure({
  title,
  preview,
  children,
  defaultOpen = false,
  icon,
  badge,
}: ProgressiveDisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && (
            <div className="flex-shrink-0">
              {icon}
            </div>
          )}
          
          <div className="flex-1 min-w-0 text-left">
            <h3 className="font-medium truncate">{title}</h3>
            
            {/* Preview (shown when collapsed) */}
            {!isOpen && preview && (
              <div className="text-sm text-neutral-600 mt-1 truncate">
                {preview}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {badge && (
            <div className="ml-2">
              {badge}
            </div>
          )}
          
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-neutral-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-600" />
            )}
          </div>
        </div>
      </button>
      
      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 border-t border-neutral-200">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
