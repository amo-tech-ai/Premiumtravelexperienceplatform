import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../ui/button';
import { PlannerSidebar } from './PlannerSidebar';
import { PlannerFeed } from './PlannerFeed';
import { PlannerMap } from './PlannerMap';
import { useTrip } from '../../context/TripContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { generateMockTrip, LocalEvent, MOCK_LOCAL_EVENTS } from '../../utils/mockTripData';
import { ItineraryActivity } from './ItineraryItem';
import { cn } from '../../lib/utils/utils';
import { BookingFlow } from '../booking/BookingFlow';
import { LocalEventsHub } from '../events/LocalEventsHub';
import { EventDetailSheet } from '../events/EventDetailSheet';
import { MessageSquare, Sparkles, X, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Input } from '../ui/input';
import { motion, AnimatePresence } from 'motion/react';

interface TripPlannerLayoutProps {
  initialState: {
    budget: number;
    interests: string[];
    locationName: string;
  };
}

export const TripPlannerLayout: React.FC<TripPlannerLayoutProps> = ({ initialState }) => {
  const [preferences, setPreferences] = useState<string[]>(initialState?.interests || ['Luxury', 'Nature']);
  const [budget, setBudget] = useState(initialState?.budget || 2000);
  const [mobileTab, setMobileTab] = useState<'context' | 'feed' | 'map'>('feed');

  // Booking State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [hasBooked, setHasBooked] = useState(false);
  
  // Assistant State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  
  // Events State
  const [isEventsHubOpen, setIsEventsHubOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<LocalEvent | null>(null);

  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
      { role: 'assistant', text: "Hola! I'm your Medellín concierge. Your trip is confirmed. How can I help you prepare?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Load Initial Data (Mock)
  const [tripData, setTripData] = useState(() => generateMockTrip(preferences, budget));
  
  // Activities with Local Storage Persistence
  const [activities, setActivities] = useState<ItineraryActivity[]>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('medellin_trip_activities');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved itinerary", e);
            }
        }
    }
    return tripData.activities;
  });

  // Persist activities whenever they change
  useEffect(() => {
    localStorage.setItem('medellin_trip_activities', JSON.stringify(activities));
  }, [activities]);

  // Reactive Logic: Update trip when preferences/budget change (unless booked)
  useEffect(() => {
    if (hasBooked) return; // Don't change plan after booking
    
    // Only regenerate if the user explicitly changes filters (we rely on the fact that this effect 
    // runs on mount, but we want to prefer localStorage on mount).
    // The issue: this effect runs on mount.
    // Workaround: Check if we just loaded from storage.
    
    // Actually, simply generating new data when prefs change is fine.
    // But on mount, we want to respect the lazy initializer of `activities`.
    // React strict mode might run this effect twice.
    // Let's rely on the user interacting with the sidebar to trigger this.
    
  }, [preferences, budget, hasBooked]); // This is tricky.
  
  const handlePreferencesChange = (newPrefs: string[]) => {
      if (hasBooked) return;
      setPreferences(newPrefs);
      const newData = generateMockTrip(newPrefs, budget);
      setTripData(newData);
      setActivities(newData.activities);
  };
  
  const handleBudgetChange = (newBudget: number) => {
      if (hasBooked) return;
      setBudget(newBudget);
      const newData = generateMockTrip(preferences, newBudget);
      setTripData(newData);
      setActivities(newData.activities);
  };

  // Connect to Trip Context for saved items
  const { savedIds, events, stays, experiences } = useTrip();
  
  const savedItems = React.useMemo(() => {
    const allItems = [...events, ...stays, ...experiences];
    return allItems.filter(item => savedIds.includes(item.id)).map(item => ({
        ...item,
        type: (item as any).date ? 'event' : (item as any).rating ? 'stay' : 'experience'
    }));
  }, [savedIds, events, stays, experiences]);

  // Activity Management Logic
  const handleMoveActivity = useCallback((dragIndex: number, hoverIndex: number) => {
    setActivities((prevActivities) => {
      const newActivities = [...prevActivities];
      const draggedItem = newActivities[dragIndex];
      newActivities.splice(dragIndex, 1);
      newActivities.splice(hoverIndex, 0, draggedItem);
      return newActivities;
    });
  }, []);

  const handleManualMove = useCallback((index: number, direction: 'up' | 'down') => {
    setActivities((prevActivities) => {
      const newActivities = [...prevActivities];
      if (direction === 'up' && index > 0) {
        const item = newActivities[index];
        newActivities.splice(index, 1);
        newActivities.splice(index - 1, 0, item);
      } else if (direction === 'down' && index < newActivities.length - 1) {
        const item = newActivities[index];
        newActivities.splice(index, 1);
        newActivities.splice(index + 1, 0, item);
      }
      return newActivities;
    });
  }, []);

  const handleAddActivity = () => {
    // Placeholder for adding logic
    console.log("Add activity clicked");
  };

  const handleAddEvent = (event: LocalEvent) => {
    const newActivity: ItineraryActivity = {
      id: `act-event-${Date.now()}`,
      time: event.time,
      title: event.title,
      category: event.category,
      reason: event.why_recommended,
      image: event.image,
      tags: event.tags,
      venue: event.venue,
      booking_url: event.booking_url,
      price: event.price
    };
    
    setActivities(prev => {
        if (prev.some(a => a.title === event.title)) {
            toast.error("This event is already in your itinerary");
            return prev;
        }
        toast.success("Event added to your itinerary", {
            description: `${event.title} on ${event.date}`
        });
        return [newActivity, ...prev]; 
    });
  };

  const handleSendMessage = () => {
      if (!chatInput.trim()) return;
      
      const newMsg = { role: 'user' as const, text: chatInput };
      setChatMessages(prev => [...prev, newMsg]);
      setChatInput("");

      // Mock AI Response
      setTimeout(() => {
          setChatMessages(prev => [...prev, { 
              role: 'assistant', 
              text: "I've noted that request. I'll update your itinerary shortly." 
          }]);
      }, 1000);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-stone-50/50 pt-20 pb-24 lg:pb-10 px-4 md:px-6 lg:px-8 relative">
        
        {/* Mobile View Toggle */}
        <div className="lg:hidden mb-6 sticky top-20 z-40">
            <div className="bg-white/80 backdrop-blur-md p-1 rounded-xl shadow-sm border border-slate-200 flex">
                <button 
                    onClick={() => setMobileTab('context')} 
                    className={cn("flex-1 py-2 text-xs font-medium rounded-lg transition-all", mobileTab === 'context' ? "bg-emerald-100 text-emerald-800 shadow-sm" : "text-slate-500")}
                >
                    Details
                </button>
                <button 
                    onClick={() => setMobileTab('feed')} 
                    className={cn("flex-1 py-2 text-xs font-medium rounded-lg transition-all", mobileTab === 'feed' ? "bg-emerald-100 text-emerald-800 shadow-sm" : "text-slate-500")}
                >
                    Itinerary
                </button>
                <button 
                    onClick={() => setMobileTab('map')} 
                    className={cn("flex-1 py-2 text-xs font-medium rounded-lg transition-all", mobileTab === 'map' ? "bg-emerald-100 text-emerald-800 shadow-sm" : "text-slate-500")}
                >
                    Map
                </button>
            </div>
        </div>

        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start h-auto lg:h-[calc(100vh-120px)]">
          
          {/* LEFT COL (Context) */}
          <div className={cn(
              "lg:col-span-3 h-full overflow-y-auto pr-2 custom-scrollbar",
              mobileTab === 'context' ? "block" : "hidden lg:block"
          )}>
            <PlannerSidebar 
              preferences={preferences} 
              setPreferences={handlePreferencesChange} 
              budget={budget}
              setBudget={handleBudgetChange}
              savedItems={savedItems}
            />
            {hasBooked && (
                <div className="mt-4 p-4 bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-emerald-900">Trip Confirmed</p>
                        <p className="text-xs text-emerald-700">All systems go!</p>
                    </div>
                </div>
            )}
          </div>

          {/* CENTER COL (AI Content) */}
          <div className={cn(
              "lg:col-span-6 h-full overflow-y-auto pr-2 custom-scrollbar pb-20",
               mobileTab === 'feed' ? "block" : "hidden lg:block"
          )}>
            <PlannerFeed 
                stays={tripData.stays}
                restaurants={tripData.restaurants}
                activities={activities}
                localEvents={tripData.localEvents}
                onMoveActivity={handleMoveActivity}
                onManualMove={handleManualMove}
                onAddActivity={handleAddActivity}
                onAddEvent={handleAddEvent}
                onOpenEventsHub={() => setIsEventsHubOpen(true)}
                onSelectEvent={setSelectedEvent}
            />
          </div>

          {/* RIGHT COL (Map) */}
          <div className={cn(
              "lg:col-span-3 h-full lg:sticky lg:top-24",
               mobileTab === 'map' ? "block" : "hidden lg:block"
          )}>
            {!hasBooked ? (
                <PlannerMap 
                    onBookClick={() => setIsBookingOpen(true)} 
                    activities={activities}
                />
            ) : (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full flex flex-col items-center justify-center text-center">
                    <Sparkles className="w-12 h-12 text-emerald-300 mb-4" />
                    <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">Concierge Active</h3>
                    <p className="text-sm text-slate-500">Your AI Concierge is monitoring your trip for updates.</p>
                </div>
            )}
          </div>
        </div>
        
        {/* Mobile Bottom Action Bar */}
        {!hasBooked && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-6 flex items-center justify-between z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div>
                <p className="text-xs text-slate-500">Total Est.</p>
                <p className="font-bold text-slate-900">${Math.round(budget * 1.12)}</p>
            </div>
            <Button onClick={() => setIsBookingOpen(true)} className="bg-emerald-900 text-white rounded-full px-6">
                Book Trip
            </Button>
            </div>
        )}

        {/* Post-Booking Floating Assistant */}
        {hasBooked && (
            <>
                <div className="fixed bottom-6 right-6 z-50">
                    <Button 
                        onClick={() => setIsAssistantOpen(!isAssistantOpen)}
                        className="h-14 w-14 rounded-full bg-emerald-900 shadow-xl shadow-emerald-900/30 flex items-center justify-center hover:scale-110 transition-transform"
                    >
                        {isAssistantOpen ? <X className="w-6 h-6 text-white" /> : <MessageSquare className="w-6 h-6 text-white" />}
                    </Button>
                    {!isAssistantOpen && (
                         <div className="absolute bottom-16 right-0 bg-white p-3 rounded-xl shadow-lg border border-slate-100 w-48 mb-2 animate-in slide-in-from-bottom-2 fade-in pointer-events-none">
                            <p className="text-xs font-medium text-slate-700">Need to change a reservation?</p>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {isAssistantOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[500px]"
                        >
                            <div className="bg-emerald-900 p-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center border border-emerald-700">
                                    <Sparkles className="w-4 h-4 text-emerald-100" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Concierge</p>
                                    <p className="text-[10px] text-emerald-200">Always here to help</p>
                                </div>
                            </div>
                            
                            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 min-h-[300px]">
                                {chatMessages.map((msg, i) => (
                                    <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                        <div className={cn(
                                            "max-w-[80%] p-3 rounded-xl text-sm",
                                            msg.role === 'user' ? "bg-emerald-900 text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm"
                                        )}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                                <Input 
                                    value={chatInput} 
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Type a message..." 
                                    className="bg-slate-50 border-slate-200 focus-visible:ring-emerald-900"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <Button size="icon" onClick={handleSendMessage} className="bg-emerald-900 text-white hover:bg-emerald-800">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </>
        )}

        {/* Booking Flow Overlay */}
        <BookingFlow 
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            onComplete={() => {
                setHasBooked(true);
                setIsBookingOpen(false);
                setIsAssistantOpen(true); // Auto-open assistant on success
            }}
            tripDetails={{
                total: budget,
                days: 5,
                travelers: 2,
                location: initialState?.locationName || 'Medellín',
                dates: 'Jan 14 - Jan 19'
            }}
        />

        {/* Local Scout Events Hub */}
        <LocalEventsHub 
            isOpen={isEventsHubOpen}
            onClose={() => setIsEventsHubOpen(false)}
            events={MOCK_LOCAL_EVENTS}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
            onAddEvent={handleAddEvent}
        />

        {/* Event Detail Sheet */}
        <EventDetailSheet 
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onAdd={handleAddEvent}
        />

      </div>
    </DndProvider>
  );
};