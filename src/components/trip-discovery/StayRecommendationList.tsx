import React from 'react';
import { Star, MapPin, BedDouble, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

export interface Stay {
  id: string;
  title: string;
  image: string;
  rating: number;
  priceTier: string; // $ - $$$$
  area: string;
  badge?: 'Best Match' | 'Luxury Pick' | 'Value';
}

interface StayRecommendationListProps {
  stays: Stay[];
  onAdd: (stay: Stay) => void;
  onHover?: (id: string) => void;
  onLeave?: () => void;
  savedIds?: string[];
}

export function StayRecommendationList({ stays, onAdd, onHover, onLeave, savedIds = [] }: StayRecommendationListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xl font-serif font-semibold text-emerald-950 flex items-center gap-2">
          <BedDouble className="w-5 h-5 text-emerald-700" />
          Where to Stay
        </h3>
        <Button variant="link" className="text-emerald-700 h-auto p-0">See all</Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stays.map((stay) => (
          <div 
            key={stay.id}
            onMouseEnter={() => onHover && onHover(stay.id)}
            onMouseLeave={() => onLeave && onLeave()}
            className="group relative bg-white rounded-2xl border border-emerald-900/5 shadow-sm hover:shadow-luxury transition-all duration-300 overflow-hidden cursor-pointer"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
               <ImageWithFallback 
                 src={stay.image} 
                 alt={stay.title}
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40" />
               
               {/* Match Badge */}
               {stay.badge && (
                 <div className={cn(
                   "absolute top-3 left-3 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1",
                   stay.badge === 'Best Match' ? "bg-emerald-900/90 text-white" : "bg-white/90 text-emerald-900"
                 )}>
                    {stay.badge === 'Best Match' && <CheckCircle className="w-3 h-3" />}
                    {stay.badge}
                 </div>
               )}

               <button 
                  onClick={(e) => { e.stopPropagation(); onAdd(stay); }}
                  disabled={savedIds.includes(stay.id)}
                  className={cn(
                      "absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg transition-all duration-300 transform",
                      savedIds.includes(stay.id)
                        ? "bg-emerald-900 text-white opacity-100 translate-y-0"
                        : "bg-white text-emerald-900 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                  )}
               >
                  {savedIds.includes(stay.id) ? 'Selected' : 'Select Property'}
               </button>
            </div>

            {/* Content */}
            <div className="p-4">
               <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-emerald-950 text-lg leading-tight line-clamp-1">
                    {stay.title}
                  </h4>
                  <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {stay.rating}
                  </div>
               </div>
               
               <div className="flex items-center gap-3 text-sm text-slate-500">
                 <span className="font-medium text-emerald-700">{stay.priceTier}</span>
                 <span className="w-1 h-1 rounded-full bg-slate-300" />
                 <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {stay.area}
                 </span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
