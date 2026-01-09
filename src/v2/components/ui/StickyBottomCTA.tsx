import React, { useState, useEffect } from 'react';

interface StickyBottomCTAProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  showOnScroll?: boolean; // If true, only shows after scrolling down
  scrollThreshold?: number; // Pixels to scroll before showing
  className?: string;
}

/**
 * StickyBottomCTA - Always-accessible primary action button
 * 
 * Sticks to the bottom of viewport on mobile, ensuring the primary
 * action is always accessible without scrolling back to top.
 * 
 * Features:
 * - Fixed to bottom with safe area padding
 * - Smooth show/hide based on scroll
 * - Loading and disabled states
 * - Multiple variants
 * - Backdrop shadow for depth
 */
export function StickyBottomCTA({
  label,
  onClick,
  disabled = false,
  loading = false,
  icon,
  variant = 'primary',
  showOnScroll = false,
  scrollThreshold = 200,
  className = '',
}: StickyBottomCTAProps) {
  const [isVisible, setIsVisible] = useState(!showOnScroll);

  useEffect(() => {
    if (!showOnScroll) return;

    const handleScroll = () => {
      const scrolled = window.scrollY > scrollThreshold;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showOnScroll, scrollThreshold]);

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  };

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-40
        transition-all duration-200 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}
    >
      {/* Backdrop - white with shadow */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4 py-2 pb-safe">
          <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`
              w-full h-12 rounded-lg font-semibold text-base
              flex items-center justify-center gap-2
              transition-all duration-200
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              ${variantClasses[variant]}
              ${className}
            `}
            aria-label={label}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                {icon && <span className="flex-shrink-0">{icon}</span>}
                <span>{label}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * StickyBottomActions - Multiple actions in sticky bar
 */
interface StickyBottomActionsProps {
  primaryAction: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function StickyBottomActions({
  primaryAction,
  secondaryAction,
  className = '',
}: StickyBottomActionsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 py-2 pb-safe">
        <div className={`flex gap-3 ${className}`}>
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="flex-1 h-12 rounded-lg font-medium text-base text-gray-700 border-2 border-gray-300 hover:bg-gray-50 active:scale-95 transition-all"
            >
              {secondaryAction.label}
            </button>
          )}
          <button
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled || primaryAction.loading}
            className={`
              ${secondaryAction ? 'flex-1' : 'w-full'}
              h-12 rounded-lg font-semibold text-base
              bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-95 transition-all
            `}
          >
            {primaryAction.loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              primaryAction.label
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * StickyBottomPrice - Price display with CTA
 * Common in e-commerce and booking flows
 */
interface StickyBottomPriceProps {
  price: string;
  priceLabel?: string;
  ctaLabel: string;
  onCtaClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function StickyBottomPrice({
  price,
  priceLabel = 'Total',
  ctaLabel,
  onCtaClick,
  disabled = false,
  className = '',
}: StickyBottomPriceProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 py-3 pb-safe">
        <div className={`flex items-center justify-between gap-4 ${className}`}>
          {/* Price Display */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">{priceLabel}</span>
            <span className="text-2xl font-bold text-gray-900">{price}</span>
          </div>

          {/* CTA Button */}
          <button
            onClick={onCtaClick}
            disabled={disabled}
            className="flex-shrink-0 px-8 h-12 rounded-lg font-semibold text-base bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * ContentPaddingBottom - Add padding to page content to prevent overlap with sticky CTA
 * Use this at the bottom of your page content
 */
export function ContentPaddingBottom({ height = 80 }: { height?: number }) {
  return <div style={{ height: `${height}px` }} aria-hidden="true" />;
}
