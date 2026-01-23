import { useState } from 'react';
import { useParams } from 'react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Layout } from 'lucide-react';
import { cn } from '../../lib/utils/utils';
import { Button } from '../../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import { TripDetailsProvider, useTripDetails } from '../../components/trip-details/TripDetailsContext';
import { ItineraryFeed } from '../../components/trip-details/ItineraryFeed';
import { TripSidebar } from '../../components/trip-details/TripSidebar';
import { AIItineraryBridge } from '../../components/trip-details/AIItineraryBridge';

// Inner Layout Component that uses the Context
const TripDetailsLayout = () => {
  const { activePanel, setActivePanel } = useTripDetails();
  // Desktop Sidebar State (Collapsible)
  const [isToolsCollapsed, setIsToolsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AIItineraryBridge />
      {/* Main App Navigation provided by AppShell */}

      {/* TRIP OS CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* CENTER: Itinerary (Flex-1) - Always Visible. */}
        <div className="flex-1 h-full overflow-y-auto scrollbar-hide bg-[#FDFBF7] relative z-10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
           <ItineraryFeed />
           
           {/* Mobile Floating Actions 
               Positioned higher (bottom-24) to avoid overlap with Global AI Concierge (bottom-6)
           */}
           <div className="lg:hidden fixed bottom-24 right-6 z-40 flex flex-col gap-4">
              {/* Sidebar/Tools Toggle */}
              <Sheet>
                 <SheetTrigger asChild>
                    <Button variant="outline" className="h-14 w-14 rounded-full bg-white border-slate-200 shadow-lg flex items-center justify-center">
                       <Layout className="w-6 h-6 text-slate-700" />
                    </Button>
                 </SheetTrigger>
                 <SheetContent side="bottom" className="h-[80vh] w-full p-0 rounded-t-2xl">
                    <div className="h-full w-full overflow-hidden rounded-t-2xl">
                        {/* Always expanded on mobile */}
                        <TripSidebar />
                    </div>
                 </SheetContent>
              </Sheet>
           </div>
        </div>

        {/* RIGHT: Sidebar Tools - Desktop Only */}
        <div 
           className={cn(
               "hidden lg:block h-full relative z-20 bg-slate-50 border-l border-slate-200 shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.03)] transition-all duration-300 ease-in-out will-change-[width]",
               isToolsCollapsed ? "w-[72px]" : "w-[360px]"
           )}
        >
           <TripSidebar 
               collapsed={isToolsCollapsed} 
               onToggle={() => setIsToolsCollapsed(prev => !prev)} 
           />
        </div>

      </div>
    </div>
  );
};

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