import React, { ReactNode } from 'react';

/**
 * TouchTarget - Ensures minimum touch target size for mobile accessibility
 * 
 * According to Apple HIG and Material Design:
 * - Minimum: 44x44px
 * - Recommended: 48x48px
 * 
 * This wrapper adds invisible padding to ensure proper touch area
 * even when visual content is smaller.
 */

interface TouchTargetProps {
  children: ReactNode;
  minSize?: number; // Minimum size in pixels (default: 44)
  className?: string;
}

export function TouchTarget({ 
  children, 
  minSize = 44,
  className = '' 
}: TouchTargetProps) {
  return (
    <div 
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        minWidth: `${minSize}px`,
        minHeight: `${minSize}px`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * TouchTargetButton - Button with proper touch target
 */
interface TouchTargetButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export function TouchTargetButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  ...props 
}: TouchTargetButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    icon: 'bg-transparent text-gray-700 hover:bg-gray-100 rounded-full',
  };
  
  const sizeClasses = {
    sm: 'min-h-[44px] px-4 text-sm rounded-lg',
    md: 'min-h-[48px] px-6 text-base rounded-lg',
    lg: 'min-h-[56px] px-8 text-lg rounded-xl',
  };
  
  // Icon buttons need special sizing
  const iconSizeClasses = variant === 'icon' ? {
    sm: 'min-w-[44px] min-h-[44px] p-2',
    md: 'min-w-[48px] min-h-[48px] p-3',
    lg: 'min-w-[56px] min-h-[56px] p-4',
  } : sizeClasses;
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${variant === 'icon' ? iconSizeClasses[size] : sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * TouchTargetLink - Link with proper touch target
 */
interface TouchTargetLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

export function TouchTargetLink({ 
  children, 
  className = '',
  ...props 
}: TouchTargetLinkProps) {
  return (
    <a
      className={`inline-flex items-center min-h-[44px] py-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * TouchTargetInput - Input field with proper height
 */
interface TouchTargetInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function TouchTargetInput({ 
  label,
  error,
  className = '',
  ...props 
}: TouchTargetInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`min-h-[48px] px-4 text-base border-2 rounded-lg transition-all
          ${error ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-500'}
          focus:outline-none focus:ring-4 focus:ring-blue-100
          ${className}`}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-600">{error}</span>
      )}
    </div>
  );
}

/**
 * TouchTargetCheckbox - Checkbox with proper touch area
 */
interface TouchTargetCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export function TouchTargetCheckbox({ 
  label,
  className = '',
  ...props 
}: TouchTargetCheckboxProps) {
  return (
    <label className="flex items-center gap-3 min-h-[44px] cursor-pointer">
      <div className="relative flex items-center justify-center min-w-[44px] min-h-[44px]">
        <input
          type="checkbox"
          className={`w-5 h-5 cursor-pointer accent-blue-600 ${className}`}
          {...props}
        />
      </div>
      <span className="text-base text-gray-700">{label}</span>
    </label>
  );
}

/**
 * TouchTargetListItem - List item with proper height
 */
interface TouchTargetListItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function TouchTargetListItem({ 
  children, 
  onClick,
  className = '' 
}: TouchTargetListItemProps) {
  return (
    <div
      className={`flex items-center min-h-[64px] px-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      {children}
    </div>
  );
}
