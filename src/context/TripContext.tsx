import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Event } from '../components/trip-discovery/EventCardList';
import { Stay } from '../components/trip-discovery/StayRecommendationList';
import { Experience } from '../components/trip-discovery/ExperienceCardList';
import { toast } from 'sonner@2.0.3';

// --- MOCK DATA SOURCE (Moved from Dashboard) ---
export const INITIAL_EVENTS: Event[] = [
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

export const INITIAL_STAYS: Stay[] = [
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

export const INITIAL_EXPERIENCES: Experience[] = [
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

// --- TYPES ---
interface SmartPlace {
  id: string;
  lat: number;
  lng: number;
  title: string;
  category: 'Events' | 'Stays' | 'Food' | 'Attractions' | 'Nightlife';
  price?: string;
  isLuxury?: boolean;
}

interface TripContextType {
  // Data
  events: Event[];
  stays: Stay[];
  experiences: Experience[];
  mapPlaces: SmartPlace[];
  
  // State
  savedIds: string[];
  activePlaceId: string | null;
  
  // Actions
  addToTrip: (item: Event | Stay | Experience, type: 'event' | 'stay' | 'experience') => void;
  removeFromTrip: (id: string) => void;
  setActivePlaceId: (id: string | null) => void;
  filterByAI: (query: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [stays, setStays] = useState<Stay[]>(INITIAL_STAYS);
  const [experiences, setExperiences] = useState<Experience[]>(INITIAL_EXPERIENCES);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);

  // Derive Map Places from current data
  // In a real app, we'd have lat/lng on the source objects. 
  // For now we map them to the mock coords or generate consistent ones based on ID hash
  const mapPlaces = useMemo(() => {
    const places: SmartPlace[] = [];
    
    // Helper for pseudo-random coords
    const getCoords = (id: string, baseLat: number, baseLng: number) => {
        const hash = id.split('').reduce((a,b)=>a+b.charCodeAt(0),0);
        return {
            lat: baseLat + (hash % 20) - 10,
            lng: baseLng + (hash % 20) - 10
        };
    };

    events.forEach(e => {
        const { lat, lng } = getCoords(e.id, 50, 50);
        places.push({ 
            id: e.id, lat, lng, 
            title: e.title, 
            category: 'Events',
            price: e.price
        });
    });

    stays.forEach(s => {
        const { lat, lng } = getCoords(s.id, 45, 60);
        places.push({ 
            id: s.id, lat, lng, 
            title: s.title, 
            category: 'Stays',
            price: s.priceTier,
            isLuxury: s.priceTier === '$$$$' || s.priceTier === '$$$'
        });
    });

    experiences.forEach(x => {
        const { lat, lng } = getCoords(x.id, 60, 30);
        places.push({ 
            id: x.id, lat, lng, 
            title: x.title, 
            category: 'Attractions'
        });
    });

    return places;
  }, [events, stays, experiences]);

  const addToTrip = (item: any, type: string) => {
    if (savedIds.includes(item.id)) {
        toast.info("Already in your trip");
        return;
    }
    setSavedIds(prev => [...prev, item.id]);
    toast.success(`Added ${item.title} to trip`);
    
    // Here we could also sync with the global AIContext.savedItems if we wanted persistence across pages
  };

  const removeFromTrip = (id: string) => {
    setSavedIds(prev => prev.filter(mid => mid !== id));
    toast.success("Removed from trip");
  };

  const filterByAI = (query: string) => {
    const lowerQ = query.toLowerCase();
    
    // Mock Filtering Logic
    if (lowerQ.includes('luxury') || lowerQ.includes('expensive')) {
        setStays(INITIAL_STAYS.filter(s => s.priceTier === '$$$$' || s.priceTier === '$$$'));
        setEvents(INITIAL_EVENTS.filter(e => e.price !== 'Free' && parseInt(e.price?.replace('$','')||'0') > 20));
        toast.success("Filtered for Luxury");
    } else if (lowerQ.includes('budget') || lowerQ.includes('cheap')) {
        setStays(INITIAL_STAYS.filter(s => s.priceTier === '$' || s.priceTier === '$$'));
        setEvents(INITIAL_EVENTS.filter(e => e.price === '$10' || e.price === 'Free'));
        toast.success("Filtered for Budget");
    } else if (lowerQ.includes('reset') || lowerQ.includes('all')) {
        setEvents(INITIAL_EVENTS);
        setStays(INITIAL_STAYS);
        setExperiences(INITIAL_EXPERIENCES);
        toast.success("Reset recommendations");
    } else {
        // Generic search
        toast.info(`Refining results for "${query}"...`);
        // We could just filter by title match for a "real" feel
        const matchTitle = (i: any) => i.title.toLowerCase().includes(lowerQ);
        
        // If we find matches, filter. If not, don't empty everything.
        const eMatch = INITIAL_EVENTS.filter(matchTitle);
        const sMatch = INITIAL_STAYS.filter(matchTitle);
        const xMatch = INITIAL_EXPERIENCES.filter(matchTitle);

        if (eMatch.length || sMatch.length || xMatch.length) {
            setEvents(eMatch.length ? eMatch : events);
            setStays(sMatch.length ? sMatch : stays);
            setExperiences(xMatch.length ? xMatch : experiences);
        } else {
            // No matches, maybe just shuffle or pretend to update
            toast.info("No exact matches, but here are some suggestions.");
        }
    }
  };

  return (
    <TripContext.Provider value={{
      events, stays, experiences, mapPlaces,
      savedIds, activePlaceId,
      addToTrip, removeFromTrip, setActivePlaceId, filterByAI
    }}>
      {children}
    </TripContext.Provider>
  );
}

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
