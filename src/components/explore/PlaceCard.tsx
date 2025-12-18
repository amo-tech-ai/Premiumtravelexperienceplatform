import React, { useState } from 'react';
import { Heart, PlusSquare, Star, MapPin, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../ui/utils';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';

interface PlaceCardProps {
  id: string;
  title: string;
  image: string;
  images?: string[]; // New prop for carousel
  rating: number;
  reviews?: number;
  category: string;
  price?: string;
  distance?: string;
  tags?: string[];
  aiHint?: string;
  layout?: 'horizontal' | 'vertical';
  isSaved?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
  onClick?: () => void;
  onToggleSave?: (e: React.MouseEvent) => void;
  onAdd?: (e: React.MouseEvent) => void;
}

export function PlaceCard({
  title,
  image,
  images = [],
  rating,
  reviews,
  category,
  price,
  distance,
  tags = [],
  aiHint,
  layout = 'vertical',
  isSaved = false,
  onHover,
  onLeave,
  onClick,
  onToggleSave,
  onAdd
}: PlaceCardProps) {
  
  // Use passed images or fallback to single image
  const displayImages = images.length > 0 ? images : [image];
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % displayImages.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div 
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer",
        layout === 'horizontal' ? "flex h-32 md:h-40" : "flex flex-col h-full"
      )}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className={cn(
        "relative overflow-hidden bg-slate-100 group/slider", 
        layout === 'horizontal' ? "w-1/3 min-w-[120px] md:w-48" : "w-full aspect-[4/3]"
      )}>
        {/* Custom Motion Slider or Single Image */}
        {layout === 'vertical' && displayImages.length > 1 ? (
           <div className="relative w-full h-full">
             <AnimatePresence initial={false} mode='popLayout'>
               <motion.div
                 key={currentSlide}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.3 }}
                 className="absolute inset-0 w-full h-full"
               >
                 <ImageWithFallback
                   src={displayImages[currentSlide]}
                   alt={`${title} - ${currentSlide + 1}`}
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
               </motion.div>
             </AnimatePresence>

             {/* Arrows */}
             <div 
               className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white/80 backdrop-blur rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-white opacity-0 group-hover/slider:opacity-100 transition-opacity"
               onClick={prevSlide}
             >
               <ChevronLeft className="w-4 h-4 text-slate-900" />
             </div>
             <div 
               className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white/80 backdrop-blur rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-white opacity-0 group-hover/slider:opacity-100 transition-opacity"
               onClick={nextSlide}
             >
               <ChevronRight className="w-4 h-4 text-slate-900" />
             </div>

             {/* Dots */}
             <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
               {displayImages.map((_, idx) => (
                 <div 
                   key={idx}
                   className={cn(
                     "w-1.5 h-1.5 rounded-full transition-colors duration-300",
                     idx === currentSlide ? "bg-white" : "bg-white/40"
                   )}
                 />
               ))}
             </div>
           </div>
        ) : (
           <div className="w-full h-full relative">
              <ImageWithFallback
                src={displayImages[0]}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           </div>
        )}
        
        {/* Top Actions (Absolute over everything) */}
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleSave && onToggleSave(e); }}
            className={cn(
              "p-2 backdrop-blur-md rounded-full transition-all shadow-sm hover:scale-110 active:scale-95",
              isSaved ? "bg-white text-rose-500" : "bg-white/90 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
            )}
          >
            <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onAdd && onAdd(e); }}
            className="p-2 bg-white/90 backdrop-blur-md rounded-full text-slate-400 hover:text-emerald-600 shadow-sm hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 delay-75"
          >
            <PlusSquare className="w-4 h-4" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
             <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm">
                 {category}
             </span>
        </div>
      </div>

      {/* Content Section */}
      <div className={cn(
        "flex flex-col justify-between",
        layout === 'horizontal' ? "p-4 w-2/3" : "p-4"
      )}>
        <div>
            <div className="flex justify-between items-start mb-1">
                <h3 className={cn(
                    "font-medium text-slate-900 line-clamp-1",
                    layout === 'horizontal' ? "text-lg" : "text-base"
                )}>
                    {title}
                </h3>
                <div className="flex items-center gap-1 shrink-0 text-slate-900 font-medium text-sm">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                    <span>{rating}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                <span>{price}</span>
                <span>•</span>
                <span>{distance}</span>
            </div>

            {/* AI Hint or Tags */}
            {aiHint ? (
                <div className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded-lg line-clamp-2 leading-relaxed">
                    <span className="mr-1">✨</span>
                    {aiHint}
                </div>
            ) : (
                <div className="flex flex-wrap gap-1">
                    {tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
