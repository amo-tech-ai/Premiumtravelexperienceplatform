import React from 'react';
import { motion } from 'motion/react';
import { Star, MapPin, Utensils, Heart } from 'lucide-react';
import { useAI } from '../../../context/AIContext';
import { toast } from 'sonner@2.0.3';
import { cn } from '../../ui/utils';

interface DiningCardProps {
  id: string;
  title: string;
  rating: number;
  reviewCount: number;
  image: string;
  cuisine: string;
  priceRange: string; // e.g. "$$$"
  location?: string;
  tags?: string[];
  onClick?: () => void;
}

export const DiningCard = ({ 
  id,
  title, 
  rating, 
  reviewCount, 
  image, 
  cuisine,
  priceRange,
  location = "El Poblado",
  tags = [],
  onClick
}: DiningCardProps) => {
  const { saveItem, removeItem, savedItems } = useAI();
  const isSaved = savedItems.some(i => i.id === id);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isSaved) {
      removeItem(id);
      toast.success("Removed from collection");
    } else {
      saveItem({
        id,
        type: 'experience', // Using experience type for dining for now
        title,
        location,
        image,
        notes: `${cuisine} • ${priceRange} • ${rating} Stars`
      });
      toast.success("Saved to collection");
    }
  };

  return (
    <motion.div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 cursor-pointer w-full border border-slate-100 flex flex-col h-full"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
            <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-900 uppercase tracking-widest shadow-sm">
            {cuisine}
            </div>
        </div>
        
        {/* Save Button */}
        <button 
          onClick={handleSave}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10",
            isSaved 
              ? "bg-white text-rose-500 shadow-md scale-110" 
              : "bg-black/20 hover:bg-white text-white hover:text-rose-500"
          )}
        >
          <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
        </button>

        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-white">
            {priceRange}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif text-lg font-medium text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors">
            {title}
            </h3>
            <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 text-xs font-bold">
                <Star className="w-3 h-3 fill-amber-700" />
                {rating}
            </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-light mb-3">
          <MapPin className="w-3 h-3 text-emerald-600/70" />
          <span>{location}</span>
          <span className="mx-1">•</span>
          <span>{reviewCount} reviews</span>
        </div>

        {tags.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1.5 pt-3 border-t border-slate-50">
                {tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>
        )}
      </div>
    </motion.div>
  );
};
