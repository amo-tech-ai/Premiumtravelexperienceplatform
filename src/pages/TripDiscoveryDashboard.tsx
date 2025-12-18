import React from 'react';
import { ConciergePromptBar } from '../components/trip-discovery/ConciergePromptBar';
import { EventCardList } from '../components/trip-discovery/EventCardList';
import { StayRecommendationList } from '../components/trip-discovery/StayRecommendationList';
import { ExperienceCardList } from '../components/trip-discovery/ExperienceCardList';
import { SmartMapView } from '../components/trip-discovery/SmartMapView';
import { TripSummarySheet } from '../components/trip-discovery/TripSummarySheet';
import { toast } from 'sonner@2.0.3';
import { useAI } from '../context/AIContext';
import { useTrip } from '../context/TripContext';
import { Drawer, DrawerContent, DrawerTrigger } from '../components/ui/drawer';
import { Button } from '../components/ui/button';
import { Map } from 'lucide-react';

export default function TripDiscoveryDashboard() {
  const { sendMessage, toggleOpen } = useAI();
  const { 
    events, stays, experiences, mapPlaces, 
    activePlaceId, setActivePlaceId,
    addToTrip, filterByAI, savedIds
  } = useTrip();

  const handleSearch = (query: string) => {
    // 1. Show feedback
    toast.success(`Concierge is looking for "${query}"...`);
    
    // 2. Filter data in TripContext
    filterByAI(query);
    
    // 3. Send message to AI for chat history (and potential future advanced logic)
    sendMessage(query);
    
    // Only open chat if it's a complex query or user explicitly asks (optional, here we keep it simple)
    // toggleOpen(); 
  };

  const handleAdd = (item: any) => {
    // Determine type based on properties
    const type = item.date ? 'event' : item.rating ? 'stay' : 'experience';
    addToTrip(item, type);
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
                <EventCardList 
                  events={events} 
                  onAdd={handleAdd} 
                  savedIds={savedIds}
                />
            </div>
            <div id="section-stays">
                <StayRecommendationList 
                  stays={stays} 
                  onAdd={handleAdd} 
                  savedIds={savedIds}
                />
            </div>
            <div id="section-experiences">
                <ExperienceCardList 
                  experiences={experiences} 
                  onAdd={handleAdd} 
                  savedIds={savedIds}
                />
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
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
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

      {/* Floating Summary Sheet */}
      <TripSummarySheet />
    </div>
  );
}
