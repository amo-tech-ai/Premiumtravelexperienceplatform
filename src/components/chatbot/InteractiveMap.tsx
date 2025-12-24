import React, { useState } from 'react';
import { 
  MapPin, 
  X, 
  Navigation, 
  Timer, 
  Star, 
  UtensilsCrossed, 
  Ticket, 
  Home,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { motion, AnimatePresence } from 'motion/react';

// Types
interface MapPin {
  id: string;
  type: 'restaurant' | 'event' | 'rental';
  name: string;
  lat: number;
  lng: number;
  rating?: string;
  price?: string;
  status?: string;
  distance?: string;
  walkTime?: string;
}

interface PinCluster {
  id: string;
  type: 'restaurant' | 'event' | 'rental' | 'mixed';
  count: number;
  lat: number;
  lng: number;
  pins: MapPin[];
}

interface InteractiveMapProps {
  onPinSelect?: (pin: MapPin) => void;
}

export function InteractiveMap({ onPinSelect }: InteractiveMapProps) {
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);
  const [visibleLayers, setVisibleLayers] = useState({
    restaurants: true,
    events: true,
    rentals: true
  });
  const [zoomLevel, setZoomLevel] = useState(14);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  // Sample pins data
  const pins: MapPin[] = [
    { id: 'r1', type: 'restaurant', name: 'Carmen', lat: 6.2088, lng: -75.5686, rating: '4.8', price: '$$$', status: 'Open', distance: '1.2 km', walkTime: '15 min' },
    { id: 'r2', type: 'restaurant', name: 'El Cielo', lat: 6.2095, lng: -75.5675, rating: '4.9', price: '$$$$', status: 'Open', distance: '0.8 km', walkTime: '10 min' },
    { id: 'r3', type: 'restaurant', name: 'OCI.Mde', lat: 6.2078, lng: -75.5698, rating: '4.7', price: '$$$', status: 'Closes soon', distance: '1.5 km', walkTime: '18 min' },
    { id: 'e1', type: 'event', name: 'Live Jazz at Pergamino', lat: 6.2105, lng: -75.5665, rating: '4.8', price: 'Free', distance: '0.5 km', walkTime: '6 min' },
    { id: 'e2', type: 'event', name: 'Salsa Night', lat: 6.2070, lng: -75.5710, rating: '4.9', price: '$15', distance: '2.1 km', walkTime: '25 min' },
    { id: 'e3', type: 'event', name: 'Art Gallery Opening', lat: 6.2100, lng: -75.5680, rating: '4.7', price: 'Free', distance: '0.7 km', walkTime: '9 min' },
    { id: 'p1', type: 'rental', name: 'Luxury Loft El Poblado', lat: 6.2090, lng: -75.5690, price: '$850/mo', distance: '1.0 km' },
    { id: 'p2', type: 'rental', name: 'Modern Studio', lat: 6.2085, lng: -75.5695, price: '$650/mo', distance: '1.3 km' }
  ];

  // Sample clusters (zoom level dependent)
  const clusters: PinCluster[] = zoomLevel < 15 ? [
    { 
      id: 'c1', 
      type: 'restaurant', 
      count: 8, 
      lat: 6.2090, 
      lng: -75.5685,
      pins: pins.filter(p => p.type === 'restaurant')
    },
    { 
      id: 'c2', 
      type: 'event', 
      count: 4, 
      lat: 6.2095, 
      lng: -75.5675,
      pins: pins.filter(p => p.type === 'event')
    },
    { 
      id: 'c3', 
      type: 'rental', 
      count: 3, 
      lat: 6.2080, 
      lng: -75.5700,
      pins: pins.filter(p => p.type === 'rental')
    }
  ] : [];

  const handlePinClick = (pin: MapPin) => {
    setSelectedPin(pin);
    setShowBottomSheet(true);
    onPinSelect?.(pin);
  };

  const handleClusterClick = (cluster: PinCluster) => {
    if (expandedCluster === cluster.id) {
      setExpandedCluster(null);
    } else {
      setExpandedCluster(cluster.id);
      setZoomLevel(16); // Expand cluster by zooming in
    }
  };

  const toggleLayer = (layer: 'restaurants' | 'events' | 'rentals') => {
    setVisibleLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const getPinColor = (type: 'restaurant' | 'event' | 'rental') => {
    switch (type) {
      case 'restaurant': return 'bg-orange-500 border-orange-600 text-white';
      case 'event': return 'bg-purple-500 border-purple-600 text-white';
      case 'rental': return 'bg-blue-500 border-blue-600 text-white';
    }
  };

  const getPinIcon = (type: 'restaurant' | 'event' | 'rental') => {
    switch (type) {
      case 'restaurant': return UtensilsCrossed;
      case 'event': return Ticket;
      case 'rental': return Home;
    }
  };

  const filteredPins = pins.filter(pin => visibleLayers[`${pin.type}s` as keyof typeof visibleLayers]);
  const filteredClusters = clusters.filter(cluster => 
    cluster.type === 'mixed' || visibleLayers[`${cluster.type}s` as keyof typeof visibleLayers]
  );

  return (
    <div className="relative w-full h-full bg-slate-100">
      {/* Map Background (Simulated with gradient and grid) */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Grid pattern for map effect */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-slate-400" />
          </svg>
        </div>

        {/* Simulated map roads */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
          <path d="M 50 100 Q 150 120, 250 100 T 450 120" 
            stroke="currentColor" 
            strokeWidth="3" 
            fill="none" 
            className="text-slate-300" 
          />
          <path d="M 100 50 Q 120 150, 100 250 T 120 450" 
            stroke="currentColor" 
            strokeWidth="3" 
            fill="none" 
            className="text-slate-300" 
          />
          <path d="M 200 0 L 200 400" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none" 
            className="text-slate-300" 
          />
          <path d="M 0 200 L 400 200" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none" 
            className="text-slate-300" 
          />
        </svg>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="bg-white hover:bg-slate-50 shadow-md"
          onClick={() => setZoomLevel(Math.min(18, zoomLevel + 1))}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="bg-white hover:bg-slate-50 shadow-md"
          onClick={() => setZoomLevel(Math.max(10, zoomLevel - 1))}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Layer Toggle */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3 max-w-[200px]">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-slate-700" />
          <span className="text-sm font-medium text-slate-900">Map Layers</span>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibleLayers.restaurants}
              onChange={() => toggleLayer('restaurants')}
              className="rounded border-slate-300"
            />
            <UtensilsCrossed className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs text-slate-700">Restaurants</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibleLayers.events}
              onChange={() => toggleLayer('events')}
              className="rounded border-slate-300"
            />
            <Ticket className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs text-slate-700">Events</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibleLayers.rentals}
              onChange={() => toggleLayer('rentals')}
              className="rounded border-slate-300"
            />
            <Home className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs text-slate-700">Rentals</span>
          </label>
        </div>
      </div>

      {/* Floating Legend */}
      <div className="absolute bottom-24 md:bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3">
        <div className="text-xs font-medium text-slate-900 mb-2">Legend</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-[11px] text-slate-600">Restaurants</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-[11px] text-slate-600">Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-[11px] text-slate-600">Rentals</span>
          </div>
        </div>
      </div>

      {/* Map Pins Container (positioned absolutely to simulate map coordinates) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Render Clusters */}
        {zoomLevel < 15 && filteredClusters.map(cluster => (
          <div
            key={cluster.id}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: `${((cluster.lng + 75.5700) * 1000) % 100}%`,
              top: `${((cluster.lat - 6.2050) * 1000) % 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleClusterClick(cluster)}
          >
            <div className={cn(
              "w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg transition-all hover:scale-110",
              getPinColor(cluster.type)
            )}>
              <span className="font-bold text-sm">{cluster.count}</span>
            </div>
            <div className="text-center mt-1">
              <span className="text-[10px] bg-white px-2 py-0.5 rounded-full shadow-sm font-medium text-slate-700">
                {cluster.count} places
              </span>
            </div>
          </div>
        ))}

        {/* Render Individual Pins */}
        {zoomLevel >= 15 && filteredPins.map(pin => {
          const Icon = getPinIcon(pin.type);
          const isSelected = selectedPin?.id === pin.id;
          
          return (
            <motion.div
              key={pin.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                left: `${((pin.lng + 75.5700) * 1000) % 100}%`,
                top: `${((pin.lat - 6.2050) * 1000) % 100}%`,
                transform: 'translate(-50%, -100%)',
                zIndex: isSelected ? 50 : 10
              }}
              onClick={() => handlePinClick(pin)}
            >
              <div className={cn(
                "relative transition-all",
                isSelected && "scale-125"
              )}>
                {/* Pin Head */}
                <div className={cn(
                  "w-10 h-10 rounded-full border-3 flex items-center justify-center shadow-lg",
                  getPinColor(pin.type),
                  isSelected && "ring-4 ring-white"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                {/* Pin Point */}
                <div className={cn(
                  "absolute left-1/2 bottom-0 w-0 h-0 -translate-x-1/2",
                  "border-l-[6px] border-l-transparent",
                  "border-r-[6px] border-r-transparent",
                  "border-t-[8px]",
                  pin.type === 'restaurant' && "border-t-orange-600",
                  pin.type === 'event' && "border-t-purple-600",
                  pin.type === 'rental' && "border-t-blue-600"
                )}></div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop: Selected Pin Info Card */}
      <AnimatePresence>
        {selectedPin && !showBottomSheet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="hidden md:block absolute bottom-4 right-4 w-80 bg-white rounded-xl shadow-2xl p-4 z-20"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-slate-900">{selectedPin.name}</h3>
                <p className="text-xs text-slate-600 capitalize">{selectedPin.type}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => setSelectedPin(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {selectedPin.rating && (
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium">{selectedPin.rating}</span>
              </div>
            )}
            
            {selectedPin.distance && (
              <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
                <span className="flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  {selectedPin.distance}
                </span>
                {selectedPin.walkTime && (
                  <span className="flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {selectedPin.walkTime}
                  </span>
                )}
              </div>
            )}
            
            {selectedPin.status && (
              <Badge className="bg-emerald-100 text-emerald-700 text-xs mb-3">
                {selectedPin.status}
              </Badge>
            )}
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                View Details
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Directions
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile: Bottom Sheet for Selected Pin */}
      <AnimatePresence>
        {selectedPin && showBottomSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden absolute inset-0 bg-black/30 z-30"
              onClick={() => setShowBottomSheet(false)}
            />
            
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="md:hidden absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl p-6 z-40"
            >
              {/* Handle */}
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4"></div>
              
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">{selectedPin.name}</h3>
                  <p className="text-sm text-slate-600 capitalize">{selectedPin.type}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowBottomSheet(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {selectedPin.rating && (
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-medium">{selectedPin.rating}</span>
                </div>
              )}
              
              {selectedPin.distance && (
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-4 h-4" />
                    {selectedPin.distance}
                  </span>
                  {selectedPin.walkTime && (
                    <span className="flex items-center gap-1.5">
                      <Timer className="w-4 h-4" />
                      {selectedPin.walkTime}
                    </span>
                  )}
                </div>
              )}
              
              {selectedPin.status && (
                <Badge className="bg-emerald-100 text-emerald-700 mb-4">
                  {selectedPin.status}
                </Badge>
              )}
              
              <div className="flex gap-3">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  View Details
                </Button>
                <Button variant="outline" className="flex-1">
                  Directions
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Zoom Level Indicator (for demo) */}
      <div className="absolute bottom-4 right-4 md:bottom-auto md:top-20 md:right-4 z-10 bg-slate-900/75 text-white text-xs px-3 py-1.5 rounded-full">
        Zoom: {zoomLevel} {zoomLevel < 15 ? '(Clusters)' : '(Pins)'}
      </div>
    </div>
  );
}
