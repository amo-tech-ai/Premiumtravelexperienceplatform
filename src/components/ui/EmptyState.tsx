import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}: EmptyStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto"
    >
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-6">
          <Icon className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
        </div>
      )}
      
      <h3 className="text-xl font-serif text-slate-900 mb-2">
        {title}
      </h3>
      
      <p className="text-slate-500 mb-8 font-light leading-relaxed">
        {description}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {actionLabel && onAction && (
          <button 
            onClick={onAction}
            className="px-6 py-2.5 bg-emerald-900 text-white rounded-lg text-sm font-medium hover:bg-emerald-800 transition-colors shadow-sm"
          >
            {actionLabel}
          </button>
        )}
        
        {secondaryActionLabel && onSecondaryAction && (
          <button 
            onClick={onSecondaryAction}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
};
