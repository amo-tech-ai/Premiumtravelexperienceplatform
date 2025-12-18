import React, { useState } from 'react';
import { Calendar, Users, MapPin, MoreHorizontal, Plus, GripVertical, Clock, Coffee, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTripDetails } from './TripDetailsContext';
import { useDrop } from 'react-dnd';
import { useParams } from 'react-router-dom';
import { useAI } from '../../context/AIContext';
import { BookingFlow } from '../booking/BookingFlow';
import { toast } from 'sonner@2.0.3';

// Mock Trip Data (Fallback)
const DEFAULT_TRIP = {
  title: 'Medellín Design Week',
  location: 'Medellín, Colombia',
  dates: 'Jan 15 - Jan 20',
  travelers: 2,
  budget: '$2,500',
  image: 'https://images.unsplash.com/photo-1599582106603-946654a9388c?q=80&w=2000'
};

const DroppableDay = ({ day, dayIndex, children, onDrop }: { day: any, dayIndex: number, children: React.ReactNode, onDrop: (idx: number, item: any) => void }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'IDEA',
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
  const { days, addItemToDay } = useTripDetails();
  const { id } = useParams<{ id: string }>();
  const { savedItems } = useAI();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  
  // Find trip metadata
  const tripItem = savedItems.find(i => i.id === id);
  
  // Construct display data
  const tripDetails = tripItem ? {
      title: tripItem.title,
      location: tripItem.location || (tripItem.data?.location || 'Medellín, Colombia'),
      dates: tripItem.date || 'Dates TBD',
      travelers: tripItem.data?.travelers || 2,
      budget: tripItem.data?.budget ? `$${tripItem.data.budget}` : 'TBD',
      image: tripItem.image || DEFAULT_TRIP.image,
      total: tripItem.data?.budget || 2500,
      days: 5
  } : DEFAULT_TRIP;

  const handleDrop = (dayIndex: number, item: any) => {
      addItemToDay(dayIndex, {
          title: item.title,
          type: item.type,
          time: 'TBD', // Logic could calculate next available slot
          duration: item.duration || '1h',
          image: item.image
      });
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
                <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-xs">Budget: {tripDetails.budget}</span>
                </div>
            </div>
            
            {/* CTA Action */}
            <div className="hidden md:block">
                {isBooked ? (
                    <div className="bg-emerald-500/20 backdrop-blur border border-emerald-500/50 text-emerald-100 px-4 py-2 rounded-xl flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-bold">Trip Confirmed</span>
                    </div>
                ) : (
                    <Button 
                        onClick={() => setIsBookingOpen(true)}
                        className="bg-white text-slate-900 hover:bg-emerald-50 font-bold px-6 py-6 text-lg rounded-xl shadow-lg transition-transform hover:scale-105"
                    >
                        Book Trip
                    </Button>
                )}
            </div>
         </div>
      </div>

      {/* Days Feed */}
      <div className="max-w-3xl mx-auto w-full px-6 py-8 space-y-12">
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
                {day.items.length > 0 ? (
                  day.items.map((item) => (
                    <div key={item.id} className="group relative bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer flex gap-4 ml-4">
                       
                       {/* Time Column */}
                       <div className="flex flex-col items-center gap-1 min-w-[60px] pt-1">
                          <span className="text-xs font-bold text-slate-900">{item.time}</span>
                          <span className="text-[10px] text-slate-400">{item.duration}</span>
                       </div>

                       {/* Content */}
                       <div className="flex-1">
                          <div className="flex items-start justify-between">
                             <h3 className="font-semibold text-slate-800">{item.title}</h3>
                             <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
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
                    </div>
                  ))
                ) : (
                  <div 
                    className="ml-4 py-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => addItemToDay(dayIndex, { title: 'New Item', type: 'activity', time: '10:00 AM' })}
                  >
                     <Plus className="w-6 h-6 mb-2 text-slate-300 group-hover:text-emerald-500" />
                     <span className="text-sm font-medium">Plan activities for Day {day.day}</span>
                  </div>
                )}
             </div>
          </DroppableDay>
        ))}

        <div className="pt-8 flex justify-center">
            <Button variant="outline" className="gap-2 text-slate-500 border-dashed border-slate-300 hover:border-emerald-500 hover:text-emerald-700">
               <Plus className="w-4 h-4" /> Add Day
            </Button>
        </div>
      </div>
    </div>
  );
}
