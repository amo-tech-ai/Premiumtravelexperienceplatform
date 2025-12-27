/**
 * ERROR DISPLAY
 * 
 * Reusable error state component with retry action
 */

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  variant?: 'page' | 'inline' | 'card';
}

export function ErrorDisplay({
  title = 'Something went wrong',
  message = 'We encountered an error. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  variant = 'page',
}: ErrorDisplayProps) {
  const sizes = {
    page: {
      container: 'flex flex-col items-center justify-center min-h-[400px] p-8',
      icon: 'w-16 h-16',
      title: 'text-xl',
      message: 'text-base',
    },
    inline: {
      container: 'flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg',
      icon: 'w-5 h-5',
      title: 'text-sm',
      message: 'text-sm',
    },
    card: {
      container: 'flex flex-col items-center justify-center p-6 bg-white border border-neutral-200 rounded-lg',
      icon: 'w-12 h-12',
      title: 'text-base',
      message: 'text-sm',
    },
  };
  
  const size = sizes[variant];
  
  return (
    <div className={size.container}>
      <div className={`${variant === 'inline' ? '' : 'text-center'} flex-1`}>
        {variant !== 'inline' && (
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className={`${size.icon} text-red-600`} />
            </div>
          </div>
        )}
        
        {variant === 'inline' && (
          <AlertCircle className={`${size.icon} text-red-600 flex-shrink-0 mt-0.5`} />
        )}
        
        <div className={variant === 'inline' ? 'flex-1' : ''}>
          <h3 className={`font-medium text-neutral-900 mb-2 ${size.title}`}>
            {title}
          </h3>
          <p className={`text-neutral-600 mb-4 ${size.message}`}>
            {message}
          </p>
          
          {onRetry && (
            <Button
              onClick={onRetry}
              variant={variant === 'inline' ? 'outline' : 'default'}
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {retryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
