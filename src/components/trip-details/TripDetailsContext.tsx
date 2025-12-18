import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';

// --- TYPES ---
export type TripItemType = 'logistics' | 'food' | 'activity' | 'stay';

export interface TripItem {
  id: string;
  time?: string;
  title: string;
  type: TripItemType;
  duration?: string;
  notes?: string;
  image?: string;
  status?: 'planned' | 'booked' | 'confirmed';
}

export interface TripDay {
  day: number;
  date: string;
  items: TripItem[];
}

interface TripDetailsContextType {
  // State
  days: TripDay[];
  activePanel: string | null;
  isChatOpen: boolean;
  
  // Actions
  setActivePanel: (panel: string | null) => void;
  toggleChat: () => void;
  addItemToDay: (dayIndex: number, item: Omit<TripItem, 'id'>) => void;
  moveItem: (fromDay: number, toDay: number, itemId: string) => void;
}

// --- MOCK INITIAL DATA ---
const INITIAL_DAYS: TripDay[] = [
  {
    day: 1,
    date: 'Mon, Jan 15',
    items: [
      { id: '1', time: '10:00 AM', title: 'Arrival & Check-in', type: 'logistics', duration: '1h' },
      { id: '2', time: '12:30 PM', title: 'Lunch at El Cielo', type: 'food', duration: '2h', notes: 'Reservation confirmed #4492' },
      { id: '3', time: '03:00 PM', title: 'Explore Poblado', type: 'activity', duration: '3h' },
    ]
  },
  {
    day: 2,
    date: 'Tue, Jan 16',
    items: [
      { id: '4', time: '09:00 AM', title: 'Comuna 13 Tour', type: 'activity', duration: '4h', image: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80&w=400' },
      { id: '5', time: '02:00 PM', title: 'Coffee Tasting', type: 'food', duration: '1.5h' },
    ]
  },
  {
    day: 3,
    date: 'Wed, Jan 17',
    items: [] 
  }
];

const TripDetailsContext = createContext<TripDetailsContextType | undefined>(undefined);

export function TripDetailsProvider({ children, tripId }: { children: ReactNode, tripId?: string }) {
  const [days, setDays] = useState<TripDay[]>(() => {
    if (tripId) {
       const saved = localStorage.getItem(`trip_details_${tripId}`);
       if (saved) return JSON.parse(saved);
       
       // Default empty state for new trips
       return [
         { day: 1, date: 'Day 1', items: [] },
         { day: 2, date: 'Day 2', items: [] },
         { day: 3, date: 'Day 3', items: [] },
         { day: 4, date: 'Day 4', items: [] },
         { day: 5, date: 'Day 5', items: [] },
       ];
    }
    return INITIAL_DAYS;
  });

  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false); // Mobile toggle mainly

  // Persist to LocalStorage
  useEffect(() => {
    if (tripId) {
       localStorage.setItem(`trip_details_${tripId}`, JSON.stringify(days));
    }
  }, [days, tripId]);

  const toggleChat = () => setIsChatOpen(prev => !prev);

  const addItemToDay = (dayIndex: number, item: Omit<TripItem, 'id'>) => {
    const newItem: TripItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9)
    };
    
    setDays(prev => {
        const newDays = [...prev];
        // Ensure day exists
        if (!newDays[dayIndex]) return prev;
        
        newDays[dayIndex] = {
            ...newDays[dayIndex],
            items: [...newDays[dayIndex].items, newItem]
        };
        return newDays;
    });
    
    toast.success(`Added ${item.title} to Day ${dayIndex + 1}`);
  };

  const moveItem = (fromDay: number, toDay: number, itemId: string) => {
    // Advanced logic for DnD later
    console.log('Move item', { fromDay, toDay, itemId });
  };

  return (
    <TripDetailsContext.Provider value={{
      days, activePanel, isChatOpen,
      setActivePanel, toggleChat, addItemToDay, moveItem
    }}>
      {children}
    </TripDetailsContext.Provider>
  );
}

export const useTripDetails = () => {
  const context = useContext(TripDetailsContext);
  if (context === undefined) {
    throw new Error('useTripDetails must be used within a TripDetailsProvider');
  }
  return context;
};
