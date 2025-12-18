import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Layers, Plus, Minus, Navigation } from 'lucide-react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';

interface Place {
  id: string;
  lat: number;
  lng: number;
  title: string;
  category?: string;
  price?: string;
}

interface ExploreMapProps {
  places: Place[];
  activePlaceId?: string | null;
  onPinClick: (id: string) => void;
}

export function ExploreMap({ places, activePlaceId, onPinClick }: ExploreMapProps) {
  const [zoom, setZoom] = useState(1);
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [center, setCenter] = useState({ x: 50, y: 50 }); // Percentage center

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));

  // Determine clusters based on zoom level (Mock logic)
  // If zoom is low (1), we cluster. If zoom is high (>1.5), we show individual pins.
  const visiblePlaces = useMemo(() => {
     return places; 
     // In a real app, we'd filter by bounds and cluster here.
     // For this high-fidelity mock, we'll just scale the positions.
  }, [places, zoom]);

  return (
    <div className="relative w-full h-full bg-[#E5E5E5] overflow-hidden group">
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
          
          {/* Overlay to soften map */}
          <div className={cn(
             "absolute inset-0 mix-blend-multiply pointer-events-none",
             mapType === 'street' ? "bg-slate-100/20" : "bg-black/10"
          )} />
      </motion.div>

      {/* Pins Layer */}
      <motion.div 
        className="absolute inset-0 w-full h-full pointer-events-none" // Container is pointer-events-none so we can click through to drag (if we had drag)
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
                scale: isActive ? 1.2 : 1, // Inverse scale to keep pin size constant relative to screen? No, let them scale with map for now or 
                // typically pins stay same size on screen. To do that we need to divide by zoom.
                // Let's try to keep them somewhat consistent but allow slight growth.
                scaleX: 1 / Math.sqrt(zoom), 
                scaleY: 1 / Math.sqrt(zoom),
                opacity: 1,
                zIndex: isActive ? 50 : 10 
              }}
              whileHover={{ scale: 1.1 / Math.sqrt(zoom) }}
              onClick={() => onPinClick(place.id)}
            >
              <div className={cn(
                "relative flex flex-col items-center group transition-all duration-300",
                isActive ? "text-emerald-900" : "text-slate-700"
              )}>
                
                {/* Pin Render Logic */}
                {isStay ? (
                   // Price Pill for Stays
                   <div className={cn(
                     "px-3 py-1.5 rounded-full shadow-lg border-2 text-xs font-bold transition-all duration-300 backdrop-blur-md",
                     isActive 
                       ? "bg-emerald-900 border-white text-white scale-110" 
                       : "bg-white/90 border-white text-slate-900 hover:bg-emerald-50 hover:scale-105"
                   )}>
                     {place.price || '$?'}
                   </div>
                ) : (
                   // Icon Pin for others
                   <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-300 backdrop-blur-md",
                    isActive 
                      ? "bg-emerald-900 border-white text-white scale-110" 
                      : "bg-white/90 border-white hover:bg-emerald-50 hover:scale-105"
                   )}>
                     {place.category === 'Restaurants' && <span className="text-base">🍴</span>}
                     {place.category === 'Things to Do' && <span className="text-base">🎯</span>}
                     {place.category === 'Coffee' && <span className="text-base">☕</span>}
                     {place.category === 'Nightlife' && <span className="text-base">🍸</span>}
                     {!['Restaurants', 'Things to Do', 'Coffee', 'Nightlife'].includes(place.category || '') && <MapPin className="w-5 h-5 fill-current" />}
                   </div>
                )}
                
                {/* Pin Point (Triangle) - Hide for Stays (Pills) */}
                {!isStay && (
                  <div className={cn(
                    "w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-1 drop-shadow-sm",
                    isActive ? "border-t-emerald-900" : "border-t-white"
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
      
      {/* Top Right: Layer Control */}
      <div className="absolute top-6 right-6 flex flex-col gap-2">
         <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-1 flex flex-col gap-1">
             <button 
               onClick={() => setMapType('street')}
               className={cn(
                 "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                 mapType === 'street' ? "bg-slate-100 text-emerald-600" : "text-slate-400 hover:bg-slate-50"
               )}
               title="Street View"
             >
                <MapPin className="w-5 h-5" />
             </button>
             <button 
               onClick={() => setMapType('satellite')}
               className={cn(
                 "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                 mapType === 'satellite' ? "bg-slate-100 text-emerald-600" : "text-slate-400 hover:bg-slate-50"
               )}
               title="Satellite View"
             >
                <Layers className="w-5 h-5" />
             </button>
         </div>
      </div>

      {/* Bottom Right: Zoom Controls */}
      <div className="absolute bottom-8 right-6 flex flex-col gap-2">
         <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-1 flex flex-col gap-1">
             <button 
                onClick={handleZoomIn}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
             >
               <Plus className="w-5 h-5" />
             </button>
             <div className="h-px bg-slate-100 mx-2" />
             <button 
                onClick={handleZoomOut}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
             >
               <Minus className="w-5 h-5" />
             </button>
         </div>
         <button className="w-12 h-12 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors">
            <Navigation className="w-5 h-5 fill-current" />
         </button>
      </div>
      
      {/* "Search this area" Button (Mock) */}
      <AnimatePresence>
         {zoom > 1.5 && (
            <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="absolute top-6 left-1/2 -translate-x-1/2"
            >
               <Button className="bg-white text-slate-900 border border-slate-200 shadow-lg hover:bg-slate-50 rounded-full h-10 px-6 font-medium">
                  Search this area
               </Button>
            </motion.div>
         )}
      </AnimatePresence>

    </div>
  );
}
