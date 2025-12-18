import React, { useState } from 'react';
import { ConciergePromptBar } from '../components/trip-discovery/ConciergePromptBar';
import { EventCardList, Event } from '../components/trip-discovery/EventCardList';
import { StayRecommendationList, Stay } from '../components/trip-discovery/StayRecommendationList';
import { ExperienceCardList, Experience } from '../components/trip-discovery/ExperienceCardList';
import { SmartMapView } from '../components/trip-discovery/SmartMapView';
import { toast } from 'sonner@2.0.3';
import { useAI } from '../context/AIContext';
import { Drawer, DrawerContent, DrawerTrigger } from '../components/ui/drawer';
import { Button } from '../components/ui/button';
import { Map } from 'lucide-react';

// Mock Data (Moved outside component to be initial state)
const INITIAL_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Medellín Flower Festival Parade',
    image: 'https://images.unsplash.com/photo-1596707328607-28d15a97573d?q=80&w=800&auto=format&fit=crop',
    date: 'This week',
    popularity: 'Almost sold out',
    price: '$25',
    location: 'Avenida Guayabal'
  },
  {
    id: 'e2',
    title: 'Karol G: Mañana Será Bonito Fest',
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop',
    date: 'Fri, Dec 22',
    popularity: 'Selling fast',
    price: '$80',
    location: 'Atanasio Girardot Stadium'
  },
  {
    id: 'e3',
    title: 'Salsa Night at Eslabón Prendido',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    date: 'Tonight',
    price: '$10',
    location: 'Centro'
  }
];

const INITIAL_STAYS: Stay[] = [
  {
    id: 's1',
    title: 'The Click Clack Hotel Medellín',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    priceTier: '$$$',
    area: 'El Poblado',
    badge: 'Best Match'
  },
  {
    id: 's2',
    title: 'Elcielo Hotel & Restaurant',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    priceTier: '$$$$',
    area: 'El Poblado',
    badge: 'Luxury Pick'
  },
  {
    id: 's3',
    title: 'Masaya Medellín',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop',
    rating: 4.6,
    priceTier: '$$',
    area: 'El Poblado',
    badge: 'Value'
  }
];

const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: 'x1',
    title: 'Comuna 13 Graffiti Tour & Street Food',
    image: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80&w=800&auto=format&fit=crop',
    duration: '3 hours',
    fit: 'Easy to fit'
  },
  {
    id: 'x2',
    title: 'Coffee Farm Tour in Guatape',
    image: 'https://images.unsplash.com/photo-1626202384351-e1293c683b54?q=80&w=800&auto=format&fit=crop',
    duration: 'Full day',
    fit: 'Must see'
  },
  {
    id: 'x3',
    title: 'Paragliding over San Felix',
    image: 'https://images.unsplash.com/photo-1475518112798-86ae35e9e620?q=80&w=800&auto=format&fit=crop',
    duration: '4 hours',
  }
];

const INITIAL_MAP_PLACES = [
  // Events
  { id: 'e1', lat: 40, lng: 45, title: 'Flower Festival', category: 'Events' as const },
  { id: 'e2', lat: 60, lng: 55, title: 'Karol G Concert', category: 'Events' as const },
  { id: 'e3', lat: 35, lng: 30, title: 'Salsa Night', category: 'Events' as const },
  // Stays
  { id: 's1', lat: 45, lng: 60, title: 'Click Clack', category: 'Stays' as const, price: '$220', isLuxury: true },
  { id: 's2', lat: 48, lng: 62, title: 'Elcielo', category: 'Stays' as const, price: '$450', isLuxury: true },
  { id: 's3', lat: 42, lng: 58, title: 'Masaya', category: 'Stays' as const, price: '$80' },
  // Experiences
  { id: 'x1', lat: 70, lng: 20, title: 'Comuna 13', category: 'Attractions' as const },
  { id: 'x2', lat: 20, lng: 80, title: 'Guatape', category: 'Attractions' as const },
  { id: 'x3', lat: 80, lng: 40, title: 'Paragliding', category: 'Attractions' as const },
];

export default function TripDiscoveryDashboard() {
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);
  const { sendMessage, toggleOpen, saveItem } = useAI();
  
  // State for content
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [stays, setStays] = useState(INITIAL_STAYS);
  const [experiences, setExperiences] = useState(INITIAL_EXPERIENCES);
  const [mapPlaces, setMapPlaces] = useState(INITIAL_MAP_PLACES);

  const handleSearch = (query: string) => {
    // Quick Actions Simulation
    if (query === 'More luxury') {
       toast.success("Concierge: Upgrading your recommendations to Luxury tier...");
       setTimeout(() => {
           setStays(prev => prev.filter(s => s.priceTier === '$$$$' || s.priceTier === '$$$'));
           toast.info("Showing only luxury stays.");
       }, 800);
       return;
    }
    
    if (query === 'Quieter places') {
        toast.success("Concierge: Filtering for quiet zones...");
        setTimeout(() => {
            setEvents([]); // Remove noisy events
            setStays(prev => prev.filter(s => s.area !== 'El Poblado')); // Mock filter
            toast.info("Removed high-traffic areas.");
        }, 800);
        return;
    }

    // Default: Open AI Chat
    toast.success(`Concierge is looking for "${query}"...`);
    sendMessage(query);
    toggleOpen();
  };

  const handleAdd = (item: any) => {
    saveItem({
        id: item.id,
        type: item.date ? 'event' : item.rating ? 'property' : 'experience',
        title: item.title,
        image: item.image,
        price: item.price || item.priceTier,
        location: item.location || item.area,
        date: item.date,
        // Mock lat/lng lookup
        lat: INITIAL_MAP_PLACES.find(p => p.id === item.id)?.lat || 50,
        lng: INITIAL_MAP_PLACES.find(p => p.id === item.id)?.lng || 50,
    });
    toast.success(`Added "${item.title}" to your trip.`);
  };

  const handlePinClick = (id: string) => {
    setActivePlaceId(id);
    const element = document.getElementById(`card-${id}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-emerald-500');
        setTimeout(() => element.classList.remove('ring-2', 'ring-emerald-500'), 2000);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#FDFBF7] flex flex-col md:flex-row relative">
      {/* Left Column: Content Feed */}
      <div className="w-full md:w-[55%] lg:w-[60%] h-full overflow-y-auto scrollbar-hide p-4 md:p-8 space-y-8 bg-[#FDFBF7]">
        
        {/* Header Section */}
        <div className="space-y-2">
            <h1 className="font-serif text-3xl md:text-4xl text-emerald-950 font-medium">
               Welcome to Medellín
            </h1>
            <p className="text-slate-500">
               We've curated these picks for your trip Jan 15 - Jan 20.
            </p>
        </div>

        {/* AI Prompt */}
        <ConciergePromptBar onSearch={handleSearch} />

        {/* Content Sections */}
        <div className="space-y-10 pb-20">
            <div id="section-events">
                <EventCardList events={events} onAdd={handleAdd} />
            </div>
            <div id="section-stays">
                <StayRecommendationList stays={stays} onAdd={handleAdd} />
            </div>
            <div id="section-experiences">
                <ExperienceCardList experiences={experiences} onAdd={handleAdd} />
            </div>
        </div>
      </div>

      {/* Right Column: Interactive Map (Desktop) */}
      <div className="hidden md:block w-[45%] lg:w-[40%] h-full relative border-l border-emerald-900/10">
         <SmartMapView 
            places={mapPlaces} 
            activePlaceId={activePlaceId} 
            onPinClick={handlePinClick}
            className="w-full h-full rounded-none"
         />
      </div>

      {/* Mobile Map Drawer */}
      <div className="md:hidden">
          <Drawer>
              <DrawerTrigger asChild>
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                    <Button className="bg-emerald-900 text-white px-6 py-6 rounded-full shadow-luxury font-bold flex items-center gap-2 hover:bg-emerald-800 transition-all hover:scale-105 active:scale-95">
                        <Map className="w-5 h-5" />
                        View Interactive Map
                    </Button>
                </div>
              </DrawerTrigger>
              <DrawerContent className="h-[85vh] p-0 rounded-t-[2rem]">
                  <div className="h-full w-full relative">
                      <SmartMapView 
                        places={mapPlaces} 
                        activePlaceId={activePlaceId} 
                        onPinClick={handlePinClick}
                        className="w-full h-full rounded-t-[2rem]"
                      />
                  </div>
              </DrawerContent>
          </Drawer>
      </div>
    </div>
  );
}
