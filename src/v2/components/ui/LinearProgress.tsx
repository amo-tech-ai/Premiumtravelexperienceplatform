import React from 'react';

interface LinearProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

/**
 * LinearProgress - Mobile-optimized progress indicator for wizards
 * 
 * Replaces dot-based progress indicators with a cleaner linear bar
 * that shows clear percentage progress and is more space-efficient.
 * 
 * Total height: 28px (4px bar + 8px gap + 16px text)
 */
export function LinearProgress({ 
  currentStep, 
  totalSteps,
  className = '' 
}: LinearProgressProps) {
  // Calculate percentage (0-100)
  const percentage = totalSteps > 1 
    ? Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)
    : 0;

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar - 4px height */}
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Step ${currentStep} of ${totalSteps}`}
        />
      </div>
      
      {/* Step Text - 8px gap above */}
      <p className="mt-2 text-center text-sm text-gray-600">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
}

/**
 * LinearProgressWithLabels - Progress bar with step labels
 * Useful for wizards with named steps
 */
interface LinearProgressWithLabelsProps {
  currentStep: number;
  steps: string[];
  className?: string;
}

export function LinearProgressWithLabels({ 
  currentStep, 
  steps,
  className = '' 
}: LinearProgressWithLabelsProps) {
  const totalSteps = steps.length;
  const percentage = totalSteps > 1 
    ? Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)
    : 0;

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
        />
      </div>
      
      {/* Step Text with Current Step Label */}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </p>
        <p className="text-sm font-medium text-blue-600">
          {steps[currentStep - 1]}
        </p>
      </div>
    </div>
  );
}

/**
 * CircularProgress - Loading spinner for async operations
 */
interface CircularProgressProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CircularProgress({ 
  size = 'md',
  className = '' 
}: CircularProgressProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-gray-200 border-t-blue-600 rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * ProgressDots - Simple dot indicator for carousels/slides
 */
interface ProgressDotsProps {
  total: number;
  current: number;
  onDotClick?: (index: number) => void;
  className?: string;
}

export function ProgressDots({ 
  total, 
  current,
  onDotClick,
  className = '' 
}: ProgressDotsProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick?.(index)}
          className={`
            transition-all duration-200
            ${index === current 
              ? 'w-8 h-2 bg-blue-600' 
              : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
            }
            rounded-full
          `}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === current}
        />
      ))}
    </div>
  );
}
