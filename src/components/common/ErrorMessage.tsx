/**
 * ErrorMessage Component
 * 
 * Displays user-friendly error messages with retry functionality
 */

import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface ErrorMessageProps {
  error: Error;
  onRetry?: () => void;
  title?: string;
}

export function ErrorMessage({ 
  error, 
  onRetry,
  title = 'Something went wrong' 
}: ErrorMessageProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md w-full text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-xl font-serif text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-600 mb-6">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry}>
              Try Again
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
}
