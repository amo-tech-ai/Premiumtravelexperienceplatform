import React, { useState, useMemo } from 'react';
import { Calendar, Users, MapPin, MoreHorizontal, Plus, GripVertical, Clock, Coffee, CheckCircle, Share, Sparkles, DollarSign, Wand2, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTripDetails } from './TripDetailsContext';
import { useDrop, useDrag } from 'react-dnd';
import { useParams } from 'react-router-dom';
import { useAI } from '../../context/AIContext';
import { BookingFlow } from '../booking/BookingFlow';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { TripStatistics } from './TripStatistics';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '../ui/sheet';

// Mock Trip Data (Fallback)
const DEFAULT_TRIP = {
  title: 'Medellín Design Week',
  location: 'Medellín, Colombia',
  dates: 'Jan 15 - Jan 20',
  travelers: 2,
  budget: '$2,500',
  image: 'https://images.unsplash.com/photo-1599582106603-946654a9388c?q=80&w=2000'
};

// --- DRAGGABLE ITEM ---
const DraggableTripItem = React.forwardRef<HTMLDivElement, { item: any, dayIndex: number }>(
  ({ item, dayIndex }, ref) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'TRIP_ITEM',
      item: { id: item.id, fromDayIndex: dayIndex, type: 'TRIP_ITEM' },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    return (
      <motion.div 
          layout
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          ref={(node) => {
             // Connect drag source
             drag(node);
             // Forward ref from AnimatePresence or others
             if (typeof ref === 'function') {
               ref(node);
             } else if (ref) {
               (ref as React.MutableRefObject<any>).current = node;
             }
          }}
          className={cn(
              "group relative bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-grab active:cursor-grabbing flex gap-4 ml-4",
              isDragging ? "opacity-50 ring-2 ring-emerald-500 bg-emerald-50" : ""
          )}
      >
         
         {/* Time Column */}
         <div className="flex flex-col items-center gap-1 min-w-[60px] pt-1">
            <span className="text-xs font-bold text-slate-900">{item.time}</span>
            <span className="text-[10px] text-slate-400">{item.duration}</span>
         </div>

         {/* Content */}
         <div className="flex-1">
            <div className="flex items-start justify-between">
               <h3 className="font-semibold text-slate-800">{item.title}</h3>
               <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-900">
                      <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  <GripVertical className="w-4 h-4 text-slate-300" />
               </div>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
               <span className={cn(
                 "text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold",
                 item.type === 'food' ? "bg-orange-50 text-orange-600" :
                 item.type === 'activity' ? "bg-emerald-50 text-emerald-600" :
                 item.type === 'stay' ? "bg-blue-50 text-blue-600" :
                 "bg-slate-100 text-slate-500"
               )}>
                 {item.type}
               </span>
               {item.cost && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200">
                      ${item.cost}
                  </span>
               )}
               {item.status === 'confirmed' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center gap-1">
                     ✓ Booked
                  </span>
               )}
            </div>

            {item.notes && (
              <p className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg italic">
                 "{item.notes}"
              </p>
            )}

            {item.image && (
               <div className="mt-3 h-32 rounded-lg overflow-hidden relative">
                  <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
               </div>
            )}
         </div>

         {/* Timeline Dot */}
         <div className="absolute top-6 -left-[27px] w-3 h-3 rounded-full bg-white border-2 border-emerald-500 z-10 group-hover:scale-125 transition-transform" />
      </motion.div>
    );
  }
);
DraggableTripItem.displayName = "DraggableTripItem";

const DroppableDay = ({ day, dayIndex, children, onDrop }: { day: any, dayIndex: number, children: React.ReactNode, onDrop: (idx: number, item: any) => void }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['IDEA', 'TRIP_ITEM'], // Accept both
    drop: (item: any) => onDrop(dayIndex, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  return (
    <div 
        ref={drop} 
        className={cn(
            "relative rounded-xl transition-all duration-300", 
            isOver ? "bg-emerald-50 ring-2 ring-emerald-500 scale-[1.01] shadow-lg" : canDrop ? "bg-slate-50/50" : ""
        )}
    >
        {isOver && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-xl border-2 border-dashed border-emerald-500">
                <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-bold shadow-sm flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Drop to add to Day {day.day}
                </div>
            </div>
        )}
        {children}
    </div>
  );
};

export function ItineraryFeed() {
  const { days, addItemToDay, moveItem, autoGenerateTrip } = useTripDetails();
  const { id } = useParams<{ id: string }>();
  const { savedItems } = useAI();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  
  // Find trip metadata
  const tripItem = savedItems.find(i => i.id === id);
  
  const currentSpend = useMemo(() => {
    return days.reduce((acc, day) => 
        acc + day.items.reduce((sum, item) => sum + (item.cost || 0), 0), 0
    );
  }, [days]);

  // Construct display data
  const tripDetails = tripItem ? {
      title: tripItem.title,
      location: tripItem.location || (tripItem.data?.location || 'Medellín, Colombia'),
      dates: tripItem.date || 'Dates TBD',
      travelers: tripItem.data?.travelers || 2,
      budget: tripItem.data?.budget ? `$${tripItem.data.budget}` : 'TBD',
      image: tripItem.image || DEFAULT_TRIP.image,
      total: typeof tripItem.data?.budget === 'number' ? tripItem.data.budget : 2500,
      days: 5
  } : DEFAULT_TRIP;

  const hasItems = days.some(d => d.items.length > 0);

  const handleShare = () => {
     toast.success("Trip link copied to clipboard");
  };

  const handleAutoGenerate = () => {
     autoGenerateTrip();
  };

  const handleDrop = (dayIndex: number, item: any) => {
      if (item.type === 'TRIP_ITEM') {
          // Move Item
          if (item.fromDayIndex !== dayIndex) {
            moveItem(item.fromDayIndex, dayIndex, item.id);
            toast.success(`Moved to Day ${dayIndex + 1}`);
          }
      } else {
          // Add New Idea
          addItemToDay(dayIndex, {
              title: item.title,
              type: item.type,
              time: 'TBD', 
              duration: item.duration || '1h',
              image: item.image
          });
      }
  };

  const handleBookingComplete = () => {
     setIsBooked(true);
     setIsBookingOpen(false);
     toast.success("Trip successfully booked!");
  };

  return (
    <div className="flex flex-col min-h-full pb-20 relative">
      
      {/* Booking Flow Overlay */}
      <BookingFlow 
         isOpen={isBookingOpen}
         onClose={() => setIsBookingOpen(false)}
         onComplete={handleBookingComplete}
         tripDetails={{
            total: typeof tripDetails.total === 'string' ? 2500 : tripDetails.total || 2500,
            days: tripDetails.days || 5,
            travelers: tripDetails.travelers,
            location: tripDetails.location,
            dates: tripDetails.dates
         }}
      />

      {/* Trip Header */}
      <div className="relative h-64 w-full">
         <ImageWithFallback 
            src={tripDetails.image} 
            alt={tripDetails.title} 
            className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
         
         <div className="absolute bottom-0 left-0 right-0 p-8 text-white flex items-end justify-between">
            <div>
                <h1 className="text-3xl font-serif font-bold mb-2">{tripDetails.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium opacity-90">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {tripDetails.dates}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {tripDetails.location}</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {tripDetails.travelers} Travelers</span>
                <span className={cn(
                    "backdrop-blur px-2 py-0.5 rounded-full text-xs border flex items-center gap-1",
                    currentSpend > tripDetails.total ? "bg-red-500/20 border-red-500/50 text-white" : "bg-white/20 border-white/20"
                )}>
                    <DollarSign className="w-3 h-3" />
                    {currentSpend} / {tripDetails.total}
                </span>
                </div>
            </div>
            
            {/* CTA Action */}
            <div className="hidden md:flex items-center gap-3">
                <Button 
                   variant="secondary"
                   onClick={handleAutoGenerate}
                   className="bg-white/10 text-white hover:bg-white/20 backdrop-blur border-none h-14 px-6 rounded-xl flex items-center gap-2"
                >
                   <Wand2 className="w-5 h-5" />
                   <span className="font-semibold">Auto-Generate</span>
                </Button>

                <Button 
                   variant="secondary"
                   onClick={handleShare}
                   className="bg-white/10 text-white hover:bg-white/20 backdrop-blur border-none h-14 w-14 rounded-xl"
                >
                   <Share className="w-5 h-5" />
                </Button>

                {isBooked ? (
                    <div className="bg-emerald-500/20 backdrop-blur border border-emerald-500/50 text-emerald-100 px-6 py-4 rounded-xl flex items-center gap-2 h-14">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-bold">Trip Confirmed</span>
                    </div>
                ) : (
                    <Button 
                        onClick={() => setIsBookingOpen(true)}
                        className="bg-white text-slate-900 hover:bg-emerald-50 font-bold px-8 h-14 text-lg rounded-xl shadow-lg transition-transform hover:scale-105"
                    >
                        Book Trip
                    </Button>
                )}
            </div>
         </div>
      </div>

      {/* Days Feed */}
      <div className="max-w-3xl mx-auto w-full px-6 py-8 space-y-12">
        
        {/* Empty State / AI Hero */}
        {!hasItems && (
            <div className="p-8 bg-gradient-to-br from-emerald-50 to-white rounded-3xl border border-emerald-100 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-200 to-emerald-400" />
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 ring-4 ring-emerald-50">
                    <Sparkles className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Start your adventure</h2>
                <p className="text-slate-500 max-w-md mb-8">
                    Your itinerary is empty. Drag ideas from the right, or let the Concierge build it for you.
                </p>
                <Button onClick={handleAutoGenerate} size="lg" className="bg-emerald-900 text-white rounded-xl shadow-lg shadow-emerald-900/10 hover:bg-emerald-800 transition-all hover:scale-105">
                    <Sparkles className="w-4 h-4 mr-2" /> Auto-Generate Itinerary
                </Button>
                <p className="text-xs text-slate-400 mt-4 font-medium">You can always edit days and activities later.</p>
            </div>
        )}

        {days.map((day, dayIndex) => (
          <DroppableDay key={day.day} day={day} dayIndex={dayIndex} onDrop={handleDrop}>
             {/* Day Header */}
             <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#FDFBF7]/95 backdrop-blur z-10 py-4 border-b border-dashed border-emerald-900/10">
                <div className="flex items-baseline gap-3">
                   <h2 className="text-2xl font-serif font-bold text-slate-900">Day {day.day}</h2>
                   <span className="text-slate-500 font-medium">{day.date}</span>
                </div>
                <Button 
                   variant="ghost" 
                   size="sm" 
                   className="text-emerald-700 hover:bg-emerald-50"
                   onClick={() => addItemToDay(dayIndex, { title: 'New Activity', type: 'activity', time: 'TBD', duration: '1h' })}
                >
                   <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
             </div>

             {/* Timeline Items */}
             <div className="space-y-4 pl-4 border-l-2 border-slate-100 ml-3">
                <AnimatePresence mode="popLayout">
                  {day.items.length > 0 ? (
                    day.items.map((item) => (
                      <DraggableTripItem key={item.id} item={item} dayIndex={dayIndex} />
                    ))
                  ) : (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="ml-4 py-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer group"
                        onClick={() => addItemToDay(dayIndex, { title: 'New Item', type: 'activity', time: '10:00 AM' })}
                    >
                       <Plus className="w-6 h-6 mb-2 text-slate-300 group-hover:text-emerald-500" />
                       <span className="text-sm font-medium">Plan activities for Day {day.day}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </DroppableDay>
        ))}

        <div className="pt-8 flex justify-center">
            <Button variant="outline" className="gap-2 text-slate-500 border-dashed border-slate-300 hover:border-emerald-500 hover:text-emerald-700">
               <Plus className="w-4 h-4" /> Add Day
            </Button>
        </div>
      </div>

      {/* Trip Statistics Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed bottom-24 right-6 lg:bottom-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl w-14 h-14 flex items-center justify-center z-30">
            <BarChart3 className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Trip Statistics & Budget</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto h-full pb-20 pt-4">
            <TripStatistics 
              totalBudget={typeof tripDetails.total === 'number' ? tripDetails.total : 2500} 
              travelers={tripDetails.travelers} 
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}