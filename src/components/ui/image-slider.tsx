import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils/utils';

interface ImageSlide {
  id: string;
  src: string;
  alt: string;
  fallback?: string;
}

interface ImageSliderProps {
  slides: ImageSlide[];
  autoAdvance?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  aspectRatio?: '3/4' | '16/9' | '1/1' | '4/3';
  slidesPerView?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
  onSlideChange?: (index: number) => void;
}

export function ImageSlider({
  slides,
  autoAdvance = false,
  interval = 5000,
  showArrows = true,
  showDots = true,
  className,
  aspectRatio = '3/4',
  slidesPerView = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 20,
  onSlideChange,
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0, 1, 2]));
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  // Get current slides per view based on screen size
  const getCurrentSlidesPerView = useCallback(() => {
    if (typeof window === 'undefined') return slidesPerView.desktop || 3;
    
    const width = window.innerWidth;
    if (width < 768) return slidesPerView.mobile || 1;
    if (width < 1024) return slidesPerView.tablet || 2;
    return slidesPerView.desktop || 3;
  }, [slidesPerView]);

  const [currentSlidesPerView, setCurrentSlidesPerView] = useState(getCurrentSlidesPerView());

  // Update slides per view on resize
  useEffect(() => {
    const handleResize = () => {
      setCurrentSlidesPerView(getCurrentSlidesPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getCurrentSlidesPerView]);

  // Maximum index based on slides per view
  const maxIndex = Math.max(0, slides.length - currentSlidesPerView);

  // Navigate to specific slide
  const goToSlide = useCallback((index: number) => {
    const newIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);

    // Lazy load nearby slides
    const toLoad = new Set(loadedImages);
    for (let i = Math.max(0, newIndex - 1); i <= Math.min(slides.length - 1, newIndex + currentSlidesPerView + 1); i++) {
      toLoad.add(i);
    }
    setLoadedImages(toLoad);
  }, [maxIndex, onSlideChange, loadedImages, slides.length, currentSlidesPerView]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  // Auto-advance functionality
  useEffect(() => {
    if (autoAdvance && !isHovered && !isDragging) {
      autoAdvanceRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          if (next > maxIndex) return 0; // Loop back to start
          return next;
        });
      }, interval);
    }

    return () => {
      if (autoAdvanceRef.current) {
        clearInterval(autoAdvanceRef.current);
      }
    };
  }, [autoAdvance, isHovered, isDragging, interval, maxIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  // Mouse drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch gestures
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const threshold = 50;

    if (distance > threshold) {
      goToNext();
    } else if (distance < -threshold) {
      goToPrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Calculate slide width percentage
  const slideWidthPercent = 100 / currentSlidesPerView;
  const translateX = -(currentIndex * slideWidthPercent);

  return (
    <div
      className={cn('relative group', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Image slider"
      aria-live="polite"
    >
      {/* Slider Container */}
      <div className="relative overflow-hidden rounded-2xl">
        <div
          ref={sliderRef}
          className="flex transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing"
          style={{
            transform: `translateX(${translateX}%)`,
            gap: `${gap}px`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="flex-shrink-0 select-none"
              style={{
                width: `calc(${slideWidthPercent}% - ${gap * (currentSlidesPerView - 1) / currentSlidesPerView}px)`,
                aspectRatio: aspectRatio,
              }}
            >
              <SlideImage
                slide={slide}
                isLoaded={loadedImages.has(index)}
                index={index}
                total={slides.length}
              />
            </div>
          ))}
        </div>

        {/* Arrow Navigation */}
        {showArrows && currentSlidesPerView < slides.length && (
          <>
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2 z-10',
                'w-12 h-12 rounded-full bg-white/80 hover:bg-white',
                'flex items-center justify-center',
                'shadow-lg hover:shadow-xl',
                'transition-all duration-200',
                'disabled:opacity-30 disabled:cursor-not-allowed',
                'opacity-0 group-hover:opacity-100 md:opacity-100',
                'hover:scale-110 active:scale-95',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2'
              )}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-slate-900" />
            </button>

            <button
              onClick={goToNext}
              disabled={currentIndex >= maxIndex}
              className={cn(
                'absolute right-4 top-1/2 -translate-y-1/2 z-10',
                'w-12 h-12 rounded-full bg-white/80 hover:bg-white',
                'flex items-center justify-center',
                'shadow-lg hover:shadow-xl',
                'transition-all duration-200',
                'disabled:opacity-30 disabled:cursor-not-allowed',
                'opacity-0 group-hover:opacity-100 md:opacity-100',
                'hover:scale-110 active:scale-95',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2'
              )}
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-slate-900" />
            </button>
          </>
        )}
      </div>

      {/* Dot Indicators */}
      {showDots && slides.length > currentSlidesPerView && (
        <div className="flex justify-center gap-3 mt-6" role="tablist" aria-label="Slide navigation">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'transition-all duration-200 rounded-full',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2',
                index === currentIndex
                  ? 'w-6 h-2 bg-[#D4AF37]'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400 hover:scale-110'
              )}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
              role="tab"
            />
          ))}
        </div>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {maxIndex + 1}
      </div>
    </div>
  );
}

// Individual slide image component
function SlideImage({
  slide,
  isLoaded,
  index,
  total,
}: {
  slide: ImageSlide;
  isLoaded: boolean;
  index: number;
  total: number;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-100">
      {/* Loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
      )}

      {/* Image */}
      {isLoaded && !imageError && (
        <img
          src={slide.src}
          alt={slide.alt}
          loading={index < 3 ? 'eager' : 'lazy'}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            if (slide.fallback) {
              setImageError(false);
            }
          }}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}

      {/* Error fallback */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <div className="text-center text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}

      {/* Slide number for screen readers */}
      <span className="sr-only">
        Image {index + 1} of {total}: {slide.alt}
      </span>
    </div>
  );
}

// Preset configurations
export const sliderPresets = {
  product: {
    aspectRatio: '3/4' as const,
    slidesPerView: { mobile: 1, tablet: 2, desktop: 4 },
    gap: 20,
    showArrows: true,
    showDots: true,
  },
  hero: {
    aspectRatio: '16/9' as const,
    slidesPerView: { mobile: 1, tablet: 1, desktop: 1 },
    gap: 0,
    showArrows: true,
    showDots: true,
    autoAdvance: true,
    interval: 5000,
  },
  gallery: {
    aspectRatio: '1/1' as const,
    slidesPerView: { mobile: 2, tablet: 3, desktop: 5 },
    gap: 12,
    showArrows: false,
    showDots: false,
  },
  testimonials: {
    aspectRatio: '4/3' as const,
    slidesPerView: { mobile: 1, tablet: 2, desktop: 3 },
    gap: 24,
    showArrows: true,
    showDots: true,
    autoAdvance: true,
    interval: 7000,
  },
};
