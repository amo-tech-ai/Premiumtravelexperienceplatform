import React, { useMemo } from 'react';
import { useTripDetails } from './TripDetailsContext';
import { MapPin, Navigation, Map as MapIcon } from 'lucide-react';
import { cn } from '../../lib/utils/utils';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';

// Mock Mapbox Style Visual
// Since we don't have a real map renderer, we'll create a stylized visual representation
// that updates based on the itinerary items.

export function TripMap() {
  const { days } = useTripDetails();

  // Aggregate all locations from all days
  const allLocations = useMemo(() => {
    return days.flatMap((day, dayIndex) => 
       day.items
         .filter(i => i.type !== 'logistics') // Filter out abstract items
         .map(i => ({ 
             ...i, 
             day: day.day,
             // Generate deterministic mock coords based on ID hash if no real coords
             lat: 40 + (i.id.split('').reduce((a,b)=>a+b.charCodeAt(0),0)%20),
             lng: -70 + (i.id.split('').reduce((a,b)=>a+b.charCodeAt(0),0)%20)
         }))
    );
  }, [days]);

  return (
    <div className="relative w-full h-full bg-[#E5E3DF] overflow-hidden rounded-xl border border-slate-200 group">
        
        {/* Faux Map Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A0AEC0_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* River (Decorative) */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0,50 Q25,60 50,50 T100,50" stroke="#3B82F6" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke"/>
        </svg>

        {/* Map UI Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <Button size="icon" variant="secondary" className="bg-white shadow-sm hover:bg-slate-50 rounded-lg">
                <Navigation className="w-4 h-4 text-slate-700" />
            </Button>
            <Button size="icon" variant="secondary" className="bg-white shadow-sm hover:bg-slate-50 rounded-lg">
                <MapIcon className="w-4 h-4 text-slate-700" />
            </Button>
        </div>

        {/* Dynamic Pins */}
        <div className="absolute inset-0 p-12">
            {allLocations.map((loc, i) => {
                // Pseudo-random positioning for demo
                // In real app, use map library (Leaflet/Mapbox)
                const top = `${20 + (i * 15) % 60}%`;
                const left = `${20 + (i * 25) % 60}%`;

                return (
                    <div 
                        key={loc.id} 
                        className="absolute group/pin"
                        style={{ top, left }}
                    >
                        <div className="relative -translate-x-1/2 -translate-y-full cursor-pointer hover:z-50 transition-all hover:scale-110">
                             {/* Pin Head */}
                             <div className={cn(
                                 "w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold",
                                 loc.type === 'food' ? "bg-orange-500" :
                                 loc.type === 'activity' ? "bg-emerald-500" : "bg-blue-500"
                             )}>
                                 {loc.day}
                             </div>
                             
                             {/* Pin Stem */}
                             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-0.5 h-3 bg-slate-400/50" />
                             
                             {/* Tooltip Card (Hover) */}
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-xl p-2 opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none z-20">
                                 {loc.image && (
                                     <div className="h-20 w-full mb-2 rounded overflow-hidden">
                                         <ImageWithFallback src={loc.image} className="w-full h-full object-cover" />
                                     </div>
                                 )}
                                 <p className="text-xs font-bold text-slate-900 truncate">{loc.title}</p>
                                 <p className="text-[10px] text-slate-500">{loc.time} • {loc.duration}</p>
                             </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-slate-200 shadow-sm text-[10px] font-medium text-slate-500 flex gap-3">
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Activity</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500" /> Food</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Stay</div>
        </div>

    </div>
  );
}