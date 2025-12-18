import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Layers, Plus, Minus, Navigation, Ticket, Music, Utensils, BedDouble, Landmark } from 'lucide-react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';

interface SmartPlace {
  id: string;
  lat: number;
  lng: number;
  title: string;
  category: 'Events' | 'Stays' | 'Food' | 'Attractions' | 'Nightlife';
  price?: string; // $ - $$$$
  isLuxury?: boolean;
}

interface SmartMapViewProps {
  places: SmartPlace[];
  activePlaceId?: string | null;
  onPinClick: (id: string) => void;
  className?: string;
}

export function SmartMapView({ places, activePlaceId, onPinClick, className }: SmartMapViewProps) {
  const [zoom, setZoom] = useState(1);
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [center, setCenter] = useState({ x: 50, y: 50 }); // Percentage center

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));

  const visiblePlaces = useMemo(() => {
     return places; 
  }, [places]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Events': return <Ticket className="w-4 h-4" />;
      case 'Stays': return <BedDouble className="w-4 h-4" />;
      case 'Food': return <Utensils className="w-4 h-4" />;
      case 'Attractions': return <Landmark className="w-4 h-4" />;
      case 'Nightlife': return <Music className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string, isLuxury?: boolean) => {
     if (isLuxury) return "bg-slate-900 text-amber-400 border-amber-400"; // Luxury styling
     
     switch (category) {
       case 'Events': return "bg-rose-500 text-white border-white";
       case 'Stays': return "bg-emerald-900 text-white border-white";
       case 'Food': return "bg-orange-500 text-white border-white";
       case 'Attractions': return "bg-indigo-500 text-white border-white";
       default: return "bg-slate-900 text-white border-white";
     }
  };

  return (
    <div className={cn("relative w-full h-full bg-[#E5E5E5] overflow-hidden group rounded-3xl", className)}>
      {/* Map Background Layer */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        animate={{ 
          scale: zoom,
          x: `${(50 - center.x) * zoom}%`,
          y: `${(50 - center.y) * zoom}%`
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
          {mapType === 'street' ? (
             <img 
               src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop" 
               alt="Map Street View" 
               className="w-full h-full object-cover opacity-90 grayscale-[0.1]"
             />
          ) : (
             <img 
               src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2000&auto=format&fit=crop" 
               alt="Map Satellite View" 
               className="w-full h-full object-cover"
             />
          )}
          
          <div className={cn(
             "absolute inset-0 mix-blend-multiply pointer-events-none",
             mapType === 'street' ? "bg-slate-100/20" : "bg-black/10"
          )} />
      </motion.div>

      {/* Pins Layer */}
      <motion.div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        animate={{ 
          scale: zoom,
          x: `${(50 - center.x) * zoom}%`,
          y: `${(50 - center.y) * zoom}%`
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {visiblePlaces.map((place) => {
          const isActive = activePlaceId === place.id;
          const isStay = place.category === 'Stays';
          
          return (
            <motion.div
              key={place.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto z-10"
              style={{ left: `${place.lng}%`, top: `${place.lat}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scaleX: isActive ? 1.2 : 1 / Math.sqrt(zoom), 
                scaleY: isActive ? 1.2 : 1 / Math.sqrt(zoom),
                opacity: 1,
                zIndex: isActive ? 50 : 10 
              }}
              whileHover={{ scale: 1.2 }}
              onClick={() => onPinClick(place.id)}
            >
              <div className="relative flex flex-col items-center group">
                
                {/* Pin Render Logic */}
                {isStay ? (
                   <div className={cn(
                     "px-3 py-1.5 rounded-full shadow-lg border-2 text-xs font-bold transition-all duration-300 backdrop-blur-md flex items-center gap-1.5",
                     isActive ? "bg-emerald-900 border-white text-white scale-110" : "bg-white/90 border-white text-slate-900 hover:bg-emerald-900 hover:text-white"
                   )}>
                     <BedDouble className="w-3 h-3" />
                     {place.price || '$?'}
                   </div>
                ) : (
                   <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-300 backdrop-blur-md",
                    getCategoryColor(place.category, place.isLuxury),
                    isActive && "scale-110 ring-4 ring-white/30"
                   )}>
                     {getCategoryIcon(place.category)}
                   </div>
                )}
                
                {/* Pin Point (Triangle) */}
                {!isStay && (
                  <div className={cn(
                    "w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-1 drop-shadow-sm",
                    place.isLuxury ? "border-t-slate-900" :
                    place.category === 'Events' ? "border-t-rose-500" :
                    place.category === 'Food' ? "border-t-orange-500" :
                    place.category === 'Attractions' ? "border-t-indigo-500" :
                    "border-t-slate-900"
                  )} />
                )}
                
                {/* Label (Only active or hover) */}
                <div className={cn(
                  "absolute top-full mt-2 px-3 py-1.5 bg-white rounded-lg shadow-xl text-xs font-bold whitespace-nowrap transition-all transform pointer-events-none z-20",
                  isActive 
                    ? "opacity-100 translate-y-0 scale-100" 
                    : "opacity-0 -translate-y-2 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
                )}>
                  {place.title}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
         <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-1 flex flex-col gap-1">
             <button onClick={handleZoomIn} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-lg"><Plus className="w-5 h-5 text-slate-600" /></button>
             <div className="h-px bg-slate-100 mx-2" />
             <button onClick={handleZoomOut} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-lg"><Minus className="w-5 h-5 text-slate-600" /></button>
         </div>
      </div>

    </div>
  );
}
