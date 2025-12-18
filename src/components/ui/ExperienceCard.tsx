import React from 'react';
import { motion } from 'motion/react';
import { Star, MapPin, Heart } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { toast } from 'sonner@2.0.3';
import { cn } from '../ui/utils';

interface ExperienceCardProps {
  id: string;
  title: string;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  location?: string;
  onClick?: () => void;
}

export const ExperienceCard = ({ 
  id,
  title, 
  rating, 
  reviewCount, 
  image, 
  category,
  location = "El Poblado, Medellín",
  onClick
}: ExperienceCardProps) => {
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
        type: 'experience',
        title,
        location,
        image,
        notes: `${category} • ${rating} Stars`
      });
      toast.success("Saved to collection");
    }
  };

  return (
    <motion.div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer w-full border border-slate-100"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 ease-out"
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-emerald-900 uppercase tracking-widest border border-emerald-100/50 shadow-sm">
          {category}
        </div>
        
        {/* Save Button */}
        <button 
          onClick={handleSave}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10",
            isSaved 
              ? "bg-white text-rose-500 shadow-md scale-110" 
              : "bg-black/20 hover:bg-white text-white hover:text-rose-500"
          )}
        >
          <Heart className={cn("w-5 h-5", isSaved && "fill-current")} />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-1.5 mb-2">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-slate-900">{rating}</span>
          <span className="text-xs text-slate-400 font-light">({reviewCount} reviews)</span>
        </div>
        
        <h3 className="font-serif text-xl font-medium text-slate-900 leading-snug mb-3 group-hover:text-emerald-800 transition-colors duration-300">
          {title}
        </h3>
        
        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-light">
          <MapPin className="w-3.5 h-3.5 text-emerald-600/70" />
          <span>{location}</span>
        </div>
      </div>
    </motion.div>
  );
};
