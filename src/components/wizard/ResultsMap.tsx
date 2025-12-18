import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Heart } from 'lucide-react';
import { Venue } from '../../types/wizard';
import { useAI } from '../../context/AIContext';

interface ResultsMapProps {
  results: Venue[];
  activeId?: string | null;
  onSelect: (id: string) => void;
}

export const ResultsMap = ({ results, activeId, onSelect }: ResultsMapProps) => {
  const { savedItems } = useAI();

  // Deterministic random position generator for demo
  const getPosition = (id: string, index: number) => {
    // Use simple hash of ID to keep position stable
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const top = 20 + (hash % 60); // 20% to 80%
    const left = 20 + ((hash * 13) % 60); // 20% to 80%
    return { top: `${top}%`, left: `${left}%` };
  };

  return (
    <div className="w-full h-full relative bg-[#e5e7eb] overflow-hidden group">
      {/* Map Tiles (Static Image for Demo) */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
            backgroundImage: `url("https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-75.5636,6.2518,12,0/800x600?access_token=placeholder")`, 
            backgroundSize: 'cover'
        }}
      >
        <div className="w-full h-full bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Pins */}
      {results.map((venue, index) => {
        const pos = getPosition(venue.id, index);
        const isActive = activeId === venue.id;
        const isSaved = savedItems.some(item => item.id === venue.id);

        return (
          <motion.div
            key={venue.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: isActive ? 1.2 : 1, opacity: 1 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{ top: pos.top, left: pos.left }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(venue.id);
            }}
          >
            <div className={`
              relative flex items-center justify-center transition-transform duration-300
              ${isActive ? 'z-50 scale-110' : 'z-10 hover:scale-110'}
            `}>
              {/* Pin Shape */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center shadow-luxury border-2 border-white
                ${isActive ? 'bg-emerald-900 text-white' : 'bg-white text-emerald-900'}
              `}>
                <MapPin className="w-5 h-5" />
              </div>

              {/* Saved Badge */}
              {isSaved && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 border border-white shadow-sm z-20">
                  <Heart className="w-2.5 h-2.5 fill-current" />
                </div>
              )}

              {/* Tooltip */}
              <div className={`
                absolute top-full mt-2 px-3 py-1.5 bg-white rounded-lg shadow-xl 
                text-xs font-bold text-slate-800 whitespace-nowrap border border-slate-100
                transition-all transform
                ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}
              `}>
                {venue.name}
              </div>
            </div>
          </motion.div>
        );
      })}

      <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm text-xs text-muted-foreground pointer-events-none">
        Demo Map View
      </div>
    </div>
  );
};
