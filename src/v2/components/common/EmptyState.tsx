/**
 * EMPTY STATE
 * 
 * Reusable empty state component with optional action
 */

import { ReactNode } from 'react';
import { Button } from '../../../components/ui/button';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'page' | 'card';
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'page',
}: EmptyStateProps) {
  const sizes = {
    page: {
      container: 'flex flex-col items-center justify-center min-h-[400px] p-8 text-center',
      iconSize: 'w-20 h-20',
      titleSize: 'text-xl',
      descSize: 'text-base',
    },
    card: {
      container: 'flex flex-col items-center justify-center p-6 text-center',
      iconSize: 'w-16 h-16',
      titleSize: 'text-base',
      descSize: 'text-sm',
    },
  };
  
  const size = sizes[variant];
  
  return (
    <div className={size.container}>
      <div className={`${size.iconSize} rounded-full bg-neutral-100 flex items-center justify-center mb-4`}>
        {icon}
      </div>
      
      <h3 className={`font-medium text-neutral-900 mb-2 ${size.titleSize}`}>
        {title}
      </h3>
      
      <p className={`text-neutral-600 max-w-md mb-6 ${size.descSize}`}>
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} size={variant === 'card' ? 'sm' : 'default'}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
