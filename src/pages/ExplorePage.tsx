import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Map as MapIcon, List, X, Plus } from 'lucide-react';
import { PlaceCard } from '../components/explore/PlaceCard';
import { ExploreMap } from '../components/explore/ExploreMap';
import { ExploreFilters } from '../components/explore/ExploreFilters';
import { PlaceDetailDrawer } from '../components/explore/PlaceDetailDrawer';
import { Sidebar } from '../components/layout/Sidebar';
import { Button } from '../components/ui/button';
import { useAI } from '../context/AIContext';
import { cn } from '../components/ui/utils';

// --- Mock Data ---
const PLACES = [
  {
    id: '1',
    title: 'El Cielo Restaurant',
    category: 'Restaurants',
    rating: 4.9,
    reviews: 1240,
    price: '$$$$',
    priceLevel: 4,
    images: [
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop', // Interior
      'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=1000&auto=format&fit=crop'  // Dish
    ],
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop', // Fallback
    lat: 30, 
    lng: 45,
    tags: ['Fine Dining', 'Experience', 'Romantic'],
    aiHint: 'Must-visit for molecular gastronomy lovers.',
    distance: '0.2 mi',
    isOpen: true
  },
  {
    id: '2',
    title: 'Pergamino Café',
    category: 'Coffee',
    rating: 4.8,
    reviews: 3200,
    price: '$$',
    priceLevel: 2,
    images: [
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1000&auto=format&fit=crop'
    ],
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop',
    lat: 35,
    lng: 50,
    tags: ['Laptop Friendly', 'Best Coffee', 'Quiet'],
    aiHint: 'Popular with digital nomads in the morning.',
    distance: '0.5 mi',
    isOpen: true
  },
  {
    id: '3',
    title: 'The Click Clack Hotel',
    category: 'Stays',
    rating: 4.7,
    reviews: 850,
    price: '$180/night',
    priceLevel: 3,
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop'
    ],
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop',
    lat: 42,
    lng: 48,
    tags: ['Luxury', 'Rooftop Pool', 'Lively'],
    aiHint: 'Best rooftop vibe in Poblado.',
    distance: '0.1 mi',
    isOpen: true
  },
  {
    id: '4',
    title: 'Comuna 13 Graffiti Tour',
    category: 'Things to Do',
    rating: 5.0,
    reviews: 5000,
    price: '$25',
    priceLevel: 1,
    images: [
      'https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1499893903130-481bd6c319d6?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518081461904-9d8f136351c2?q=80&w=1000&auto=format&fit=crop'
    ],
    image: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80&w=1000&auto=format&fit=crop',
    lat: 20,
    lng: 25,
    tags: ['Culture', 'Walking'],
    aiHint: 'Go early (9 AM) to avoid the crowds.',
    distance: '3.5 mi',
    isOpen: true
  },
  {
    id: '5',
    title: 'Carmen',
    category: 'Restaurants',
    rating: 4.8,
    reviews: 900,
    price: '$$$',
    priceLevel: 3,
    images: [
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop'
    ],
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop',
    lat: 32,
    lng: 52,
    tags: ['Romantic', 'Fusion', 'Quiet'],
    aiHint: 'Perfect for a date night. Reserve patio seating.',
    distance: '0.4 mi',
    isOpen: false 
  },
  {
    id: '6',
    title: 'Envy Rooftop',
    category: 'Nightlife',
    rating: 4.5,
    reviews: 600,
    price: '$$$',
    priceLevel: 3,
    images: [
      'https://images.unsplash.com/photo-1570872626485-d8ffea69f463?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514525253440-b393452e8d03?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000&auto=format&fit=crop'
    ],
    image: 'https://images.unsplash.com/photo-1570872626485-d8ffea69f463?q=80&w=1000&auto=format&fit=crop',
    lat: 42,
    lng: 49, 
    tags: ['Views', 'Cocktails', 'Lively'],
    distance: '0.1 mi',
    isOpen: false 
  },
  {
    id: '7',
    title: 'Museo de Antioquia',
    category: 'Things to Do',
    rating: 4.7,
    reviews: 2100,
    price: '$10',
    priceLevel: 1,
    images: [
      'https://images.unsplash.com/photo-1599582106603-946654a9388c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580792150338-7f28ba242633?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545963577-4b7194600e93?q=80&w=1000&auto=format&fit=crop'
    ],
    image: 'https://images.unsplash.com/photo-1599582106603-946654a9388c?q=80&w=1000&auto=format&fit=crop',
    lat: 60,
    lng: 30,
    tags: ['Art', 'History', 'Quiet'],
    distance: '4.0 mi',
    isOpen: true
  }
];

export default function ExplorePage() {
  const { savedItems, saveItem, removeItem, injectMessage, toggleOpen } = useAI();
  const [activeFilter, setActiveFilter] = useState('For You');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Helper to check if saved
  const isSaved = (id: string) => savedItems.some(i => i.id === id);

  // Action Handlers
  const handleToggleSave = (e: React.MouseEvent | null, place: any) => {
    e?.stopPropagation(); 
    
    if (isSaved(place.id)) {
      removeItem(place.id);
    } else {
      saveItem({
        id: place.id,
        type: place.category === 'Stays' ? 'property' : 'experience',
        title: place.title,
        image: place.image,
        price: place.price,
        location: 'El Poblado', 
        lat: place.lat,
        lng: place.lng,
        notes: place.aiHint
      });
    }
  };

  const handleAdd = (e: React.MouseEvent | null, place: any) => {
     e?.stopPropagation();
     // Add to itinerary logic (mock)
     injectMessage(`I'd like to add ${place.title} to my itinerary.`, 'user', 'ITINERARY');
     toggleOpen();
  };

  const handleAskAI = (place: any) => {
    setIsDrawerOpen(false); 
    injectMessage(`Tell me more about ${place.title}. Is it good for ${place.tags[0]}?`, 'user', 'GENERAL');
    toggleOpen();
  };

  const handlePlaceClick = (id: string) => {
    setActivePlaceId(id);
    setIsDrawerOpen(true);
  };

  const activePlace = PLACES.find(p => p.id === activePlaceId);

  // --- Smart Filter Logic ---
  const filteredPlaces = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    // 1. Keyword extraction (Smarter Regex)
    const isOpenNowQuery = /open\s?now/.test(query);
    const isBudgetQuery = /cheap|budget|\$ /.test(query) || query === '$';
    const isLuxuryQuery = /luxury|expensive|\$\$\$\$|high end/.test(query);
    const isQuietQuery = query.includes('quiet');
    const isRomanticQuery = query.includes('romantic');

    return PLACES.filter(place => {
      // Basic Category Filter (If not 'For You')
      if (activeFilter !== 'For You' && activeFilter !== 'All') {
         if (activeFilter === 'Restaurants' && place.category !== 'Restaurants') return false;
         if (activeFilter === 'Things to Do' && place.category !== 'Things to Do') return false;
         if (activeFilter === 'Stays' && place.category !== 'Stays') return false;
         if (activeFilter === 'Coffee' && place.category !== 'Coffee') return false;
         // Handle mappings if categories don't exactly match UI labels
      }

      // Smart Filters
      if (isOpenNowQuery && !place.isOpen) return false;
      if (isBudgetQuery && (place.priceLevel || 3) > 2) return false;
      if (isLuxuryQuery && (place.priceLevel || 1) < 3) return false;
      if (isQuietQuery && !place.tags.some(t => t.toLowerCase() === 'quiet')) return false;
      if (isRomanticQuery && !place.tags.some(t => t.toLowerCase() === 'romantic')) return false;

      // Standard Text Search
      const cleanQuery = query
        .replace(/open\s?now/g, '')
        .replace(/cheap|budget|luxury|expensive|high end/g, '')
        .replace('quiet', '')
        .replace('romantic', '')
        .replace(/\$/g, '')
        .trim();

      if (cleanQuery.length > 0) {
        return place.title.toLowerCase().includes(cleanQuery) || 
               place.tags.some(t => t.toLowerCase().includes(cleanQuery));
      }

      return true;
    });
  }, [activeFilter, searchQuery]);

  // Grouping for "For You" view
  const sections = useMemo(() => {
    if (activeFilter !== 'For You' && activeFilter !== 'All') {
       return { [activeFilter]: filteredPlaces };
    }
    
    return {
      'Restaurants': filteredPlaces.filter(p => p.category === 'Restaurants'),
      'Things to Do': filteredPlaces.filter(p => p.category === 'Things to Do'),
      'Stays': filteredPlaces.filter(p => p.category === 'Stays'),
    };
  }, [filteredPlaces, activeFilter]);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      
      {/* 1. LEFT SIDEBAR */}
      <Sidebar className="hidden md:flex flex-shrink-0 z-20" />

      {/* 2. CENTER CONTENT FEED */}
      <div className="flex-1 flex flex-col h-full bg-white relative z-10 w-full min-w-0">
        
        {/* Mobile Header (replaces sidebar on mobile) */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-100 sticky top-0 bg-white z-30">
           <span className="font-serif text-lg font-bold">Concierge</span>
           <Button variant="ghost" size="sm"><List className="w-5 h-5" /></Button>
        </div>

        <ExploreFilters 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter}
          onSearch={setSearchQuery}
        />

        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20 lg:pb-0">
          
          {/* AI Hint Section */}
          <div className="px-4 py-4 md:px-6">
             <div className="p-4 bg-gradient-to-r from-emerald-50 to-slate-50 border border-emerald-100 rounded-2xl flex gap-4 items-start shadow-sm">
               <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-emerald-600">
                  <Sparkles className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-sm font-bold text-slate-900 mb-1">Thursday Afternoon in Poblado</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    It's currently 24°C. Perfect for a walking tour or a rooftop coffee. Here are some spots near you.
                  </p>
               </div>
             </div>
          </div>

          <div className="px-4 md:px-6 space-y-10 pb-12">
            {Object.entries(sections).map(([sectionTitle, items]) => (
              items.length > 0 && (
                <div key={sectionTitle}>
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-xl font-serif font-bold text-slate-900">{sectionTitle}</h2>
                     <Button variant="ghost" className="text-sm font-medium text-slate-400 hover:text-emerald-700 h-auto p-0 hover:bg-transparent">
                        See more
                     </Button>
                  </div>
                  
                  {/* Grid Layouts */}
                  <div className={cn(
                     "grid gap-6",
                     sectionTitle === 'Things to Do' ? "grid-cols-1 md:grid-cols-2" : 
                     sectionTitle === 'Stays' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2" :
                     "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2" // Default grid
                  )}>
                    {items.map(place => (
                      <PlaceCard 
                        key={place.id}
                        {...place}
                        isSaved={isSaved(place.id)}
                        layout="vertical" // Always vertical cards per design
                        onHover={() => setActivePlaceId(place.id)}
                        onLeave={() => !isDrawerOpen && setActivePlaceId(null)}
                        onClick={() => handlePlaceClick(place.id)}
                        onToggleSave={(e) => handleToggleSave(e, place)}
                        onAdd={(e) => handleAdd(e, place)}
                      />
                    ))}
                  </div>
                </div>
              )
            ))}
            
            {filteredPlaces.length === 0 && (
               <div className="text-center py-20">
                  <p className="text-slate-400">No places found matching your search.</p>
                  <Button variant="link" onClick={() => { setActiveFilter('For You'); setSearchQuery(''); }}>
                    Clear Filters
                  </Button>
               </div>
            )}
          </div>
        </div>

        {/* Mobile Map Toggle */}
        <div className="lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
           <Button 
             onClick={() => setShowMobileMap(true)}
             className="rounded-full shadow-2xl bg-slate-900 text-white px-6 h-12 flex items-center gap-2 hover:bg-emerald-900 transform transition-transform hover:scale-105"
           >
             <MapIcon className="w-4 h-4" />
             Map View
           </Button>
        </div>
      </div>

      {/* 3. RIGHT PANE: Map (Desktop) */}
      <div className="hidden lg:block w-[400px] xl:w-[500px] flex-shrink-0 h-full relative border-l border-slate-200">
        <ExploreMap 
          places={filteredPlaces} 
          activePlaceId={activePlaceId}
          onPinClick={handlePlaceClick}
        />
        {/* Map Overlay Loading State Mock */}
        {filteredPlaces.length === 0 && (
           <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full" />
           </div>
        )}
      </div>

      {/* DETAIL DRAWER (Overlay) */}
      <AnimatePresence>
        {isDrawerOpen && activePlace && (
          <PlaceDetailDrawer 
            place={activePlace}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            isSaved={isSaved(activePlace.id)}
            onToggleSave={() => handleToggleSave(null, activePlace)}
            onAskAI={() => handleAskAI(activePlace)}
          />
        )}
      </AnimatePresence>

      {/* MOBILE MAP OVERLAY */}
      <AnimatePresence>
        {showMobileMap && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-white lg:hidden flex flex-col"
          >
            <div className="relative flex-1">
               <ExploreMap 
                 places={filteredPlaces} 
                 activePlaceId={activePlaceId}
                 onPinClick={setActivePlaceId}
               />
               
               {/* Close Button */}
               <button 
                 onClick={() => setShowMobileMap(false)}
                 className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg text-slate-900 z-50"
               >
                 <X className="w-6 h-6" />
               </button>

               {/* Map Bottom Sheet (Selected Place) */}
               {activePlaceId && (
                 <div className="absolute bottom-6 left-4 right-4 z-40">
                    <PlaceCard 
                      {...PLACES.find(p => p.id === activePlaceId)!}
                      layout="horizontal"
                      isSaved={isSaved(activePlaceId)}
                      onClick={() => handlePlaceClick(activePlaceId)}
                      onToggleSave={(e) => handleToggleSave(e, PLACES.find(p => p.id === activePlaceId))}
                      onAdd={(e) => handleAdd(e, PLACES.find(p => p.id === activePlaceId))}
                    />
                 </div>
               )}
            </div>
            
            <div className="bg-white border-t border-slate-100 p-4 pb-8 flex justify-center">
               <Button variant="outline" onClick={() => setShowMobileMap(false)} className="gap-2 rounded-full">
                  <List className="w-4 h-4" /> Show List
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
