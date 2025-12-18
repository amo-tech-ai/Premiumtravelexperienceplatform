import React from 'react';
import { motion } from 'motion/react';
import { MapPin, BedDouble, Bath, Maximize, Heart, Sparkles, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { cn } from '../ui/utils';
import { useAI } from '../../context/AIContext';
import { toast } from 'sonner@2.0.3';

export interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  currency?: string;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  aiInsight?: string;
  tags?: string[];
  isFeatured?: boolean;
  status?: 'active' | 'pending' | 'sold'; // Added status
}

export const PropertyCard = ({
  id,
  title,
  location,
  price,
  currency = 'USD',
  beds,
  baths,
  sqft,
  imageUrl,
  aiInsight,
  tags = [],
  isFeatured = false,
  status = 'active' // Default
}: PropertyCardProps) => {
  const { saveItem, removeItem, savedItems } = useAI();
  const isSaved = savedItems.some(i => i.id === id);

  const formattedPrice = price 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(price)
    : 'Price on Request';

  const isUnavailable = status !== 'active';

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSaved) {
      removeItem(id);
      toast.success("Removed from collection");
    } else {
      saveItem({
        id,
        type: 'property',
        title,
        location,
        price: formattedPrice,
        image: imageUrl,
        notes: `${beds} Beds • ${baths} Baths • ${sqft.toLocaleString()} ft²`
      });
      toast.success("Saved to collection");
    }
  };

  return (
    <motion.div 
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 border border-slate-100 flex flex-col h-full",
        !isUnavailable && "hover:shadow-xl hover:-translate-y-1 cursor-pointer", // Consistent hover
        isUnavailable && "opacity-80 grayscale pointer-events-none bg-slate-50"
      )}
      initial={false} // Prevent re-animation on status change
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={isUnavailable ? '#' : `/real-estate/listing/${id}`}>
            <ImageWithFallback 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
        </Link>
        
        {/* Unavailable Overlay */}
        {isUnavailable && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-sm shadow-sm">
              {status === 'sold' ? 'Sold' : 'Pending'}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {isFeatured && (
                <span className="bg-emerald-900/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Featured Collection
                </span>
            )}
            {aiInsight && (
                <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border border-white/20">
                    <Sparkles className="w-3 h-3" />
                    {aiInsight}
                </div>
            )}
        </div>

        {/* Favorite Button */}
        <button 
            onClick={handleSave}
            className={cn(
                "absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-10",
                isSaved 
                  ? "bg-white text-rose-500 shadow-md scale-110" 
                  : "bg-white/10 hover:bg-white text-white hover:text-rose-500"
            )}
        >
            <Heart className={cn("w-5 h-5", isSaved && "fill-current")} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-xl font-serif font-medium text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-1">
                        <Link to={`/real-estate/listing/${id}`}>
                            {title}
                        </Link>
                    </h3>
                    <div className="flex items-center text-slate-500 text-sm mt-1">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {location}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900">{formattedPrice}</p>
                </div>
            </div>
            
            {/* Tags */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wide">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center text-slate-600 text-sm">
                <div className="flex items-center gap-1.5">
                    <BedDouble className="w-4 h-4 text-emerald-700/70" />
                    <span>{beds} <span className="text-slate-400">Beds</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-emerald-700/70" />
                    <span>{baths} <span className="text-slate-400">Baths</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Maximize className="w-4 h-4 text-emerald-700/70" />
                    <span>{sqft.toLocaleString()} <span className="text-slate-400">ft²</span></span>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};
