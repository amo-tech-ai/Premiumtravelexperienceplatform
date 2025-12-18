import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, SlidersHorizontal, Map as MapIcon, List, Sparkles, Zap, Loader2, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EventCard } from './EventCard';
import { PlannerMap } from '../itinerary/PlannerMap';
import { LocalEvent } from '../../utils/mockTripData';
import { validateEventQuery } from '../../utils/mockValidation';
import { toast } from 'sonner@2.0.3';

interface LocalEventsHubProps {
  isOpen: boolean;
  onClose: () => void;
  events: LocalEvent[];
  onSelectEvent: (event: LocalEvent) => void;
  onAddEvent: (event: LocalEvent) => void;
}

const CATEGORIES = ['All', 'Music', 'Culture', 'Food', 'Nightlife', 'Nature'];
const QUICK_PROMPTS = [
    { label: "💎 Hidden Gems", query: "Hidden gems" },
    { label: "🎷 Live Jazz", query: "Live jazz music" },
    { label: "💸 Free Entry", query: "Free events" }
];

export const LocalEventsHub: React.FC<LocalEventsHubProps> = ({ 
  isOpen, 
  onClose, 
  events, 
  onSelectEvent,
  onAddEvent 
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMapMobile, setShowMapMobile] = useState(false);
  const [isScouting, setIsScouting] = useState(false);
  const [dynamicEvents, setDynamicEvents] = useState<LocalEvent[]>([]);

  // Search Submission Handler (Enter Key)
  const handleSearchKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          await performSearch(searchQuery);
      }
  };

  const performSearch = async (query: string) => {
    if (!query || query.length < 3) return;
    
    setIsScouting(true);
    
    // 1. Simulate "Thinking" delay slightly longer for effect
    const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
    const [validation] = await Promise.all([validateEventQuery(query), minDelay]);

    setIsScouting(false);

    if (validation.isValid && validation.event) {
        const newEvent = {
            ...validation.event,
            id: `scout-${Date.now()}`,
            // Defaults for fields that might be missing in Partial<LocalEvent>
            date: validation.event.date || 'Jan 16', // Fallback to trip dates
            time: validation.event.time || 'Check Website',
            category: validation.event.category || 'Event',
            price_level: validation.event.price_level || 'Unknown',
            price: validation.event.price || 'Varies',
            why_recommended: validation.reason,
            confidence: validation.confidence,
            source_urls: validation.sources,
            image: validation.event.image || "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80",
            tags: validation.event.tags || ['New Discovery']
        } as LocalEvent;

        setDynamicEvents(prev => [newEvent, ...prev]);
        toast.success("Scout found a match!", { 
            description: validation.reason,
            icon: <Sparkles className="w-4 h-4 text-emerald-500" />
        });
    } else {
        toast.error("No verified events found", { 
            description: validation.reason,
            icon: <Globe className="w-4 h-4 text-slate-500" />
        });
    }
  };

  const handlePrompt = (query: string) => {
      setSearchQuery(query);
      performSearch(query);
  };

  if (!isOpen) return null;

  // Merge static and dynamic events
  const allEvents = [...dynamicEvents, ...events];

  // Filtering Logic
  const filteredEvents = allEvents.filter(evt => {
      const matchesCategory = activeCategory === 'All' || evt.category === activeCategory;
      const searchLower = searchQuery.toLowerCase();
      // Relaxed search logic: If dynamic, it's a match by definition (unless user clears search)
      const isDynamicMatch = dynamicEvents.some(d => d.id === evt.id);
      
      const matchesSearch = !searchQuery || 
                            evt.title.toLowerCase().includes(searchLower) || 
                            evt.category.toLowerCase().includes(searchLower) ||
                            evt.tags?.some(t => t.toLowerCase().includes(searchLower)) ||
                            isDynamicMatch;

      return matchesCategory && matchesSearch;
  });

  return (
    <AnimatePresence>
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">
            {/* Header */}
            <motion.header 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white border-b border-slate-200 px-4 py-3 md:py-4 flex flex-col gap-4 shadow-sm z-30 shrink-0"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-lg md:text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
                                Local Scout <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-sans flex items-center gap-1"><Zap className="w-3 h-3 fill-emerald-800" /> Live</span>
                            </h1>
                            <p className="text-xs text-slate-500 hidden md:block">Curated events for Jan 14 - 19</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {/* Desktop Map Toggle */}
                        <div className="hidden md:block text-xs text-slate-400 font-medium px-2 py-1">
                            Found {filteredEvents.length} events
                        </div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <div className="absolute left-3 top-2.5 w-4 h-4 flex items-center justify-center">
                            {isScouting ? (
                                <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                            ) : (
                                <Search className="w-4 h-4 text-slate-400" />
                            )}
                        </div>
                        <Input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Ask Scout (e.g., 'Jazz bars', 'Art shows')..." 
                            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 transition-all"
                        />
                        {isScouting && (
                            <div className="absolute right-3 top-2.5 text-[10px] font-medium text-emerald-600 animate-pulse">
                                Scouting...
                            </div>
                        )}
                    </div>
                    
                    {/* Categories / Prompts */}
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar items-center">
                         {!searchQuery && QUICK_PROMPTS.map(prompt => (
                             <button
                                key={prompt.label}
                                onClick={() => handlePrompt(prompt.query)}
                                className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                             >
                                {prompt.label}
                             </button>
                         ))}

                         <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block"></div>

                         {CATEGORIES.map(cat => (
                             <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                                    activeCategory === cat 
                                    ? 'bg-emerald-900 text-white shadow-md' 
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                             >
                                {cat}
                             </button>
                         ))}
                    </div>
                </div>
            </motion.header>

            {/* Split View Layout */}
            <div className="flex flex-1 overflow-hidden relative">
                
                {/* Left Panel: List View */}
                <div className={`${showMapMobile ? 'hidden' : 'block'} w-full md:w-5/12 lg:w-4/12 h-full overflow-y-auto bg-slate-50 border-r border-slate-200 scroll-smooth`}>
                    <div className="p-4 md:p-6 space-y-4 md:space-y-6 pb-24 min-h-[500px]">
                        {isScouting ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
                                <Sparkles className="w-8 h-8 text-emerald-400 mb-4 animate-bounce" />
                                <h3 className="text-sm font-medium text-emerald-800">Scouting local sources...</h3>
                                <p className="text-xs text-emerald-600/70">Checking Google Maps & Social Media</p>
                            </div>
                        ) : filteredEvents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-900">No events found</h3>
                                <p className="text-slate-500">Try checking "All" or asking specifically for "Jazz" or "Art".</p>
                                <Button 
                                    variant="link" 
                                    className="text-emerald-600 mt-2" 
                                    onClick={() => handlePrompt("Surprise me")}
                                >
                                    Ask Scout to find something
                                </Button>
                            </div>
                        ) : (
                            filteredEvents.map((evt, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={evt.id}
                                    onClick={() => onSelectEvent(evt)}
                                >
                                    <EventCard 
                                        event={evt} 
                                        onAdd={onAddEvent}
                                        onClick={() => onSelectEvent(evt)}
                                    />
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Panel: Map View */}
                <div className={`${showMapMobile ? 'block' : 'hidden'} md:block flex-1 h-full bg-slate-100 relative`}>
                    <PlannerMap 
                        events={filteredEvents}
                        showBookingPanel={false}
                        onEventClick={onSelectEvent}
                    />
                    
                    {/* Map Overlay for Mobile Context */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/50 shadow-sm md:hidden z-10">
                        <p className="text-xs font-bold text-slate-800">Map View</p>
                    </div>
                </div>

                {/* Mobile Floating Toggle Button */}
                <div className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-40 shadow-xl rounded-full">
                    <Button 
                        onClick={() => setShowMapMobile(!showMapMobile)}
                        className="rounded-full bg-slate-900 text-white hover:bg-slate-800 px-6 h-12 flex items-center gap-2"
                    >
                        {showMapMobile ? (
                            <>
                                <List className="w-4 h-4" /> List View
                            </>
                        ) : (
                            <>
                                <MapIcon className="w-4 h-4" /> Map View
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    </AnimatePresence>
  );
};