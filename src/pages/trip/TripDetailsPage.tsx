import React from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { TripChat } from '../../components/trip-details/TripChat';
import { ItineraryFeed } from '../../components/trip-details/ItineraryFeed';
import { TripSidebar } from '../../components/trip-details/TripSidebar';
import { TripDetailsProvider, useTripDetails } from '../../components/trip-details/TripDetailsContext';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import { Button } from '../../components/ui/button';
import { MessageSquare, Layout } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Inner Layout Component that uses the Context
const TripDetailsLayout = () => {
  const { isChatOpen, toggleChat, activePanel, setActivePanel } = useTripDetails();

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* 0. Main App Navigation (Far Left) - Hidden on Mobile */}
      <Sidebar className="hidden lg:flex w-[60px] md:w-[240px] border-r border-slate-200 z-30" /> 

      {/* TRIP OS CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* 1. LEFT: Chat (25%) - Desktop Only */}
        <div className="w-[350px] xl:w-[25%] hidden xl:block h-full border-r border-slate-100 bg-white z-20">
           <TripChat />
        </div>

        {/* 2. CENTER: Itinerary (45%) - Always Visible */}
        <div className="flex-1 h-full overflow-y-auto scrollbar-hide bg-[#FDFBF7] relative z-10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
           <ItineraryFeed />
           
           {/* Mobile Floating Actions */}
           <div className="xl:hidden fixed bottom-6 right-6 z-50 flex flex-col gap-4">
              {/* Chat Toggle */}
              <Sheet>
                 <SheetTrigger asChild>
                    <Button className="h-14 w-14 rounded-full bg-emerald-900 shadow-luxury flex items-center justify-center">
                       <MessageSquare className="w-6 h-6 text-white" />
                    </Button>
                 </SheetTrigger>
                 <SheetContent side="left" className="w-[90%] sm:w-[400px] p-0">
                    <TripChat />
                 </SheetContent>
              </Sheet>

              {/* Sidebar/Tools Toggle */}
              <Sheet>
                 <SheetTrigger asChild>
                    <Button variant="outline" className="h-14 w-14 rounded-full bg-white border-slate-200 shadow-lg flex items-center justify-center">
                       <Layout className="w-6 h-6 text-slate-700" />
                    </Button>
                 </SheetTrigger>
                 <SheetContent side="right" className="w-[90%] sm:w-[400px] p-0">
                    <TripSidebar />
                 </SheetContent>
              </Sheet>
           </div>
        </div>

        {/* 3. RIGHT: Sidebar Tools (30%) - Desktop Only */}
        <div className="w-[320px] xl:w-[30%] hidden lg:block h-full relative z-20 bg-slate-50">
           <TripSidebar />
        </div>

      </div>
    </div>
  );
};

import { useParams } from 'react-router-dom';

// Main Export with Provider
export default function TripDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <DndProvider backend={HTML5Backend}>
      <TripDetailsProvider tripId={id}>
         <TripDetailsLayout />
      </TripDetailsProvider>
    </DndProvider>
  );
}
