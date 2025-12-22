/**
 * EmptyState Component
 * 
 * Displays when no data is available with optional call-to-action
 */

import { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description,
  actionLabel,
  onAction 
}: EmptyStateProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {Icon && (
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-slate-400" />
          </div>
        )}
        <h2 className="text-2xl font-serif text-slate-900 mb-2">{title}</h2>
        {description && (
          <p className="text-slate-600 mb-6">{description}</p>
        )}
        {actionLabel && onAction && (
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
