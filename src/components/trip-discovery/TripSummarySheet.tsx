import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetFooter } from '../ui/sheet';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { useTrip } from '../../context/TripContext';
import { Trash2, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { useNavigate } from 'react-router';

export function TripSummarySheet() {
  const { savedIds, events, stays, experiences, removeFromTrip } = useTrip();
  const navigate = useNavigate();

  // Derive saved items
  const savedItems = React.useMemo(() => {
    const allItems = [...events, ...stays, ...experiences];
    return allItems.filter(item => savedIds.includes(item.id));
  }, [savedIds, events, stays, experiences]);

  const handleCheckout = () => {
    toast.success("Proceeding to Itinerary Builder...");
    navigate('/itinerary/new');
  };

  if (savedIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden md:block">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="lg" className="rounded-full shadow-2xl bg-emerald-900 text-white hover:bg-emerald-800 px-6 h-14 text-base font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="bg-white/20 px-2 py-0.5 rounded-md text-sm font-bold">
              {savedIds.length}
            </span>
            View Trip Selection
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
          <SheetHeader className="pb-4 border-b border-emerald-900/5">
            <SheetTitle className="font-serif text-2xl text-emerald-950">Your Trip Selections</SheetTitle>
            <SheetDescription>
              Review your saved experiences and stays before finalizing your itinerary.
            </SheetDescription>
          </SheetHeader>
          
          <ScrollArea className="flex-1 -mx-6 px-6 py-4">
            <div className="space-y-4">
              {savedItems.map((item: any) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-white border border-emerald-900/5 shadow-sm group hover:border-emerald-900/20 transition-colors">
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                    <ImageWithFallback 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="font-medium text-emerald-950 truncate">{item.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        {item.date && (
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {item.date}
                            </span>
                        )}
                        {item.area && (
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {item.area}
                            </span>
                        )}
                         {item.price || item.priceTier}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromTrip(item.id)}
                    className="text-slate-400 hover:text-rose-500 self-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>

          <SheetFooter className="pt-4 border-t border-emerald-900/5">
             <div className="w-full space-y-3">
                <div className="flex justify-between text-sm text-slate-500 px-1">
                    <span>{savedItems.length} items selected</span>
                    <span>Ready to plan</span>
                </div>
                <Button onClick={handleCheckout} className="w-full h-12 text-lg bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl shadow-lg shadow-emerald-900/10">
                    Build Itinerary <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
             </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}