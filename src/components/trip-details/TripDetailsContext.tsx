import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';
import { checkTimeOverlap, parseTime, parseDuration, formatTime, addDuration } from '../../utils/time';
import { sortByProximity, calculateDistance } from '../../utils/distance';
import type { Location } from '../../utils/distance';

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
  cost?: number;
  location_lat?: number;
  location_lng?: number;
}

export interface TripDay {
  day: number;
  date: string;
  items: TripItem[];
}

export interface Conflict {
  item1: string;
  item2: string;
  overlap: string;
  dayIndex: number;
}

interface TripDetailsContextType {
  // State
  days: TripDay[];
  activePanel: string | null;
  isChatOpen: boolean;
  conflicts: Conflict[];
  recommendations: string[];
  
  // Actions
  setActivePanel: (panel: string | null) => void;
  toggleChat: () => void;
  addItemToDay: (dayIndex: number, item: Omit<TripItem, 'id'>) => void;
  updateItem: (dayIndex: number, itemId: string, updates: Partial<TripItem>) => void;
  deleteItem: (dayIndex: number, itemId: string) => void;
  moveItem: (fromDay: number, toDay: number, itemId: string) => void;
  addDay: () => void;
  removeDay: (dayIndex: number) => void;
  autoGenerateTrip: () => void;
  optimizeItinerary: () => void;
  autoScheduleDay: (dayIndex: number) => void;
  checkConflicts: () => void;
  applyTemplate: (templateId: string) => void;
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
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

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
        // Ensure day exists (and fill gaps if needed)
        if (!newDays[dayIndex]) {
           // Create day if missing (simple fallback)
           newDays[dayIndex] = {
               day: dayIndex + 1,
               date: `Day ${dayIndex + 1}`,
               items: []
           };
        }
        
        newDays[dayIndex] = {
            ...newDays[dayIndex],
            items: [...newDays[dayIndex].items, newItem]
        };
        return newDays;
    });
    
    toast.success(`Added ${item.title} to Day ${dayIndex + 1}`);
  };

  const updateItem = (dayIndex: number, itemId: string, updates: Partial<TripItem>) => {
    setDays(prev => {
        const newDays = [...prev];
        const day = newDays[dayIndex];
        if (!day) return prev;
        
        const itemIndex = day.items.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return prev;
        
        const item = day.items[itemIndex];
        const updatedItem = { ...item, ...updates };
        
        day.items[itemIndex] = updatedItem;
        return newDays;
    });
    
    toast.success("Item updated");
  };

  const deleteItem = (dayIndex: number, itemId: string) => {
    setDays(prev => {
        const newDays = [...prev];
        const day = newDays[dayIndex];
        if (!day) return prev;
        
        const itemIndex = day.items.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return prev;
        
        day.items.splice(itemIndex, 1);
        return newDays;
    });
    
    toast.success("Item deleted");
  };

  const moveItem = (fromDayIndex: number, toDayIndex: number, itemId: string) => {
    setDays(prev => {
        const newDays = [...prev]; // Shallow copy of array
        
        // Deep copy of modified days to avoid mutation
        const sourceDay = { ...newDays[fromDayIndex], items: [...newDays[fromDayIndex].items] };
        const targetDay = fromDayIndex === toDayIndex 
            ? sourceDay 
            : { ...newDays[toDayIndex], items: [...newDays[toDayIndex].items] };

        // Find item
        const itemIndex = sourceDay.items.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return prev;

        // Remove
        const [item] = sourceDay.items.splice(itemIndex, 1);
        
        // Add (Append for now)
        targetDay.items.push(item);
        
        // Update state
        newDays[fromDayIndex] = sourceDay;
        if (fromDayIndex !== toDayIndex) {
            newDays[toDayIndex] = targetDay;
        }

        return newDays;
    });
    
    // toast.success("Item moved");
  };

  const addDay = () => {
    setDays(prev => {
      const newDays = [...prev];
      const lastDay = newDays[newDays.length - 1];
      const newDay: TripDay = {
        day: lastDay.day + 1,
        date: `Day ${lastDay.day + 1}`,
        items: []
      };
      newDays.push(newDay);
      return newDays;
    });
    toast.success("Added a new day to your itinerary.");
  };

  const removeDay = (dayIndex: number) => {
    setDays(prev => {
      const newDays = [...prev];
      newDays.splice(dayIndex, 1);
      return newDays;
    });
    toast.success("Removed a day from your itinerary.");
  };

  const autoGenerateTrip = () => {
     // Mock AI Generation - Smarter Logic
     // In a real app, this would call an API with the User's Preferences
     
     const MOCK_ITINERARY_A = [
        {
           day: 0, 
           items: [
              { id: 'gen1', title: 'Arrival & Check-in', type: 'logistics', time: '14:00', duration: '1h', status: 'planned', cost: 0 },
              { id: 'gen2', title: 'Welcome Dinner at El Cielo', type: 'food', time: '19:00', duration: '2h', status: 'planned', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80', cost: 150 }
           ]
        },
        {
           day: 1, 
           items: [
              { id: 'gen3', title: 'Comuna 13 Graffiti Tour', type: 'activity', time: '09:00', duration: '3h', status: 'planned', image: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80', cost: 25 },
              { id: 'gen4', title: 'Lunch at Pergamino', type: 'food', time: '13:00', duration: '1.5h', status: 'planned', cost: 20 },
              { id: 'gen5', title: 'Modern Art Museum', type: 'activity', time: '15:30', duration: '2h', status: 'planned', cost: 15 }
           ]
        },
        {
           day: 2, 
           items: [
              { id: 'gen6', title: 'Guatapé Day Trip', type: 'activity', time: '08:00', duration: '8h', status: 'planned', image: 'https://images.unsplash.com/photo-1596395819057-d37e954c7d0d?q=80', cost: 85 }
           ]
        }
     ];

     // Use a different mock if the first one is already present (simple toggle for demo)
     const hasElCielo = days.some(d => d.items.some(i => i.title.includes('El Cielo')));
     
     const MOCK_ITINERARY_B = [
        {
            day: 0,
            items: [
                { id: 'genB1', title: 'Check-in at Click Clack', type: 'logistics', time: '15:00', duration: '1h', status: 'confirmed' },
                { id: 'genB2', title: 'Rooftop Drinks at Envy', type: 'food', time: '18:00', duration: '2h', image: 'https://images.unsplash.com/photo-1519671482502-9759101d4561?q=80', cost: 60 }
            ]
        },
        {
            day: 1,
            items: [
                { id: 'genB3', title: 'Botero Plaza Walking Tour', type: 'activity', time: '10:00', duration: '2h', cost: 0 },
                { id: 'genB4', title: 'Lunch at Mondongos', type: 'food', time: '13:00', duration: '1.5h', cost: 15 },
                { id: 'genB5', title: 'Metrocable Ride to Arví', type: 'activity', time: '15:00', duration: '3h', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80', cost: 5 }
            ]
        }
     ];

     const itineraryToUse = hasElCielo ? MOCK_ITINERARY_B : MOCK_ITINERARY_A;

     setDays(prev => {
        // We want to replace or merge? 
        // For "Auto Generate", let's clear and replace to show the power of the AI, 
        // but perhaps keep Day 1 if it has "Arrival".
        // Actually, let's just MERGE into the days, or replace if empty.
        
        const newDays = [...prev];
        
        itineraryToUse.forEach(mockDay => {
           if (newDays[mockDay.day]) {
              // Check if items already exist to avoid dupes (simple title check)
              const existingTitles = new Set(newDays[mockDay.day].items.map(i => i.title));
              const newItems = (mockDay.items as TripItem[]).filter(i => !existingTitles.has(i.title));
              
              if (newItems.length > 0) {
                 newDays[mockDay.day] = {
                    ...newDays[mockDay.day],
                    items: [...newDays[mockDay.day].items, ...newItems]
                 };
              }
           }
        });
        return newDays;
     });
     
     toast.success(hasElCielo ? "AI Concierge: I've suggested an alternative itinerary." : "AI Concierge: I've generated a 3-day plan for you.");
  };

  const optimizeItinerary = () => {
    const optimizedDays = sortByProximity(days);
    setDays(optimizedDays);
    toast.success("AI Concierge: I've optimized your itinerary for proximity.");
  };

  const autoScheduleDay = (dayIndex: number) => {
    const scheduledDay = autoScheduleTimes(days[dayIndex]);
    setDays(prev => {
      const newDays = [...prev];
      newDays[dayIndex] = scheduledDay;
      return newDays;
    });
    toast.success(`AI Concierge: I've scheduled Day ${dayIndex + 1} for you.`);
  };

  const checkConflicts = () => {
    const detectedConflicts: Conflict[] = [];
    days.forEach((day, dayIndex) => {
      day.items.forEach((item1, index1) => {
        day.items.forEach((item2, index2) => {
          if (index1 < index2 && item1.time && item2.time && item1.duration && item2.duration) {
            const overlap = checkTimeOverlap(parseTime(item1.time), parseDuration(item1.duration), parseTime(item2.time), parseDuration(item2.duration));
            if (overlap) {
              detectedConflicts.push({
                item1: item1.title,
                item2: item2.title,
                overlap: overlap,
                dayIndex: dayIndex
              });
            }
          }
        });
      });
    });
    setConflicts(detectedConflicts);
    toast.success("AI Concierge: I've checked for conflicts in your itinerary.");
  };

  const applyTemplate = (templateId: string) => {
    // Mock template application
    const template = {
      day: 0,
      items: [
        { id: 'temp1', title: 'Arrival & Check-in', type: 'logistics', time: '14:00', duration: '1h', status: 'planned', cost: 0 },
        { id: 'temp2', title: 'Welcome Dinner at El Cielo', type: 'food', time: '19:00', duration: '2h', status: 'planned', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80', cost: 150 }
      ]
    };

    setDays(prev => {
      const newDays = [...prev];
      newDays[template.day] = {
        ...newDays[template.day],
        items: [...newDays[template.day].items, ...template.items]
      };
      return newDays;
    });
    toast.success("AI Concierge: I've applied a template to your itinerary.");
  };

  return (
    <TripDetailsContext.Provider value={{
      days, activePanel, isChatOpen, conflicts, recommendations,
      setActivePanel, toggleChat, addItemToDay, updateItem, deleteItem, moveItem, addDay, removeDay,
      autoGenerateTrip, optimizeItinerary, autoScheduleDay, checkConflicts, applyTemplate
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

// Helper function to auto-schedule times for a day
function autoScheduleTimes(day: TripDay): TripDay {
  const newItems: TripItem[] = [];
  let currentTime = '09:00 AM';

  day.items.forEach(item => {
    const newItem: TripItem = {
      ...item,
      time: currentTime
    };
    newItems.push(newItem);
    currentTime = addDuration(currentTime, item.duration || '1h');
  });

  return {
    ...day,
    items: newItems
  };
}