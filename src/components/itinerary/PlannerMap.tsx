import React from 'react';
import { MapPin, BedDouble, Utensils, Share2, ShieldCheck, CreditCard, Sparkles, ShoppingBag, Music, Mountain, Landmark, Ticket } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ItineraryActivity } from './ItineraryItem';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { LocalEvent } from '../../utils/mockTripData';

interface PlannerMapProps {
  onBookClick?: () => void;
  activities?: ItineraryActivity[];
  events?: LocalEvent[];
  showBookingPanel?: boolean;
  onEventClick?: (event: LocalEvent) => void;
}

// Helper to deterministically position pins based on ID
const getPinPosition = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const top = (hash % 50) + 25; // 25-75%
  const left = ((hash * 17) % 60) + 20; // 20-80%
  return { top: `${top}%`, left: `${left}%` };
};

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'Food': return <Utensils className="w-4 h-4" />;
        case 'Shopping': return <ShoppingBag className="w-4 h-4" />;
        case 'Nature': return <Mountain className="w-4 h-4" />;
        case 'Nightlife': return <Music className="w-4 h-4" />;
        case 'Music': return <Music className="w-4 h-4" />;
        case 'Culture': return <Landmark className="w-4 h-4" />;
        case 'Event': return <Ticket className="w-4 h-4" />;
        default: return <MapPin className="w-4 h-4" />;
    }
};

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Food': return 'bg-orange-500';
        case 'Shopping': return 'bg-purple-500';
        case 'Nature': return 'bg-emerald-600';
        case 'Nightlife': return 'bg-blue-600';
        case 'Music': return 'bg-violet-600';
        case 'Culture': return 'bg-rose-600';
        default: return 'bg-slate-700';
    }
};

const getEventColorStyles = (category: string) => {
    switch (category) {
        case 'Food': return 'border-orange-500 text-orange-600 bg-white ring-orange-200';
        case 'Nature': return 'border-emerald-500 text-emerald-600 bg-white ring-emerald-200';
        case 'Music': return 'border-violet-500 text-violet-600 bg-white ring-violet-200';
        case 'Nightlife': return 'border-blue-500 text-blue-600 bg-white ring-blue-200';
        case 'Culture': return 'border-rose-500 text-rose-600 bg-white ring-rose-200';
        default: return 'border-slate-500 text-slate-600 bg-white ring-slate-200';
    }
};

export const PlannerMap: React.FC<PlannerMapProps> = ({ 
    onBookClick, 
    activities = [], 
    events = [], 
    showBookingPanel = true,
    onEventClick 
}) => {
  return (
    <div className="h-full flex flex-col gap-4">
      {/* Map Preview */}
      <div className={`flex-1 bg-slate-200 rounded-3xl overflow-hidden relative group min-h-[400px] border border-slate-200 shadow-inner ${!showBookingPanel ? 'h-full' : ''}`}>
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover opacity-80"
          alt="Map Preview"
        />
        
        {/* Dynamic Pins */}
        <TooltipProvider>
            {/* Itinerary Activity Pins (Solid Filled = Confirmed) */}
            {activities.map((activity) => {
                const pos = getPinPosition(activity.id);
                return (
                    <Tooltip key={activity.id}>
                        <TooltipTrigger asChild>
                            <div 
                                className={`absolute w-8 h-8 rounded-full ${getCategoryColor(activity.category)} text-white flex items-center justify-center shadow-lg border-2 border-white transform hover:scale-110 transition-all cursor-pointer z-10`}
                                style={{ top: pos.top, left: pos.left }}
                            >
                                {getCategoryIcon(activity.category)}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-white text-slate-900 border-slate-200 shadow-xl font-medium">
                            <p>{activity.title}</p>
                        </TooltipContent>
                    </Tooltip>
                );
            })}

            {/* Local Event Pins (Hollow/White = Potential/Scouted) */}
            {events.map((event) => {
                const pos = getPinPosition(event.id); 
                const styles = getEventColorStyles(event.category);
                
                return (
                    <Tooltip key={event.id}>
                        <TooltipTrigger asChild>
                            <div 
                                onClick={() => onEventClick?.(event)}
                                className={`absolute w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 ring-4 transform hover:scale-110 transition-all cursor-pointer z-20 animate-in fade-in zoom-in duration-500 ${styles}`}
                                style={{ top: pos.top, left: pos.left }}
                            >
                                {getCategoryIcon(event.category)}
                                {/* Small Badge to indicate 'New' */}
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-white" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-white text-slate-900 border-slate-200 shadow-xl font-medium p-3 min-w-[150px]">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{event.category}</span>
                                <p className="font-bold text-slate-900 leading-tight">{event.title}</p>
                                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate max-w-[120px]">{event.venue?.name || 'Medellín'}</span>
                                </div>
                                {onEventClick && <p className="text-[10px] text-emerald-600 font-bold mt-2 text-right">Click to Details →</p>}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                );
            })}
        </TooltipProvider>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <Button className="pointer-events-auto bg-white/90 backdrop-blur-md text-slate-900 hover:bg-white shadow-lg rounded-full">
            <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
            Explore Map
          </Button>
        </div>
      </div>

      {/* Actions Panel / Sticky Cost Summary */}
      {showBookingPanel && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 sticky bottom-6">
            <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-xs text-slate-500 uppercase font-medium mb-1">Total Estimated</p>
                <p className="text-3xl font-serif font-bold text-slate-900">$2,450</p>
            </div>
            <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                <Share2 className="w-3 h-3" />
            </Button>
            </div>

            {/* Breakdown Preview */}
            <div className="space-y-2 mb-6 border-b border-slate-100 pb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-2"><BedDouble className="w-3 h-3"/> Stays (4 Nights)</span>
                    <span className="font-medium text-slate-900">$880</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-2"><Sparkles className="w-3 h-3"/> Experiences</span>
                    <span className="font-medium text-slate-900">$450</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-2"><Utensils className="w-3 h-3"/> Dining Reserve</span>
                    <span className="font-medium text-slate-900">$320</span>
                </div>
                <div className="flex justify-between text-sm pt-2">
                    <span className="text-xs text-emerald-600 font-medium cursor-pointer hover:underline">See what's included</span>
                </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Secure Payment
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    <CreditCard className="w-3 h-3 text-emerald-600" />
                    Free Cancellation
                </div>
            </div>

            <div className="space-y-3">
            <Button 
                onClick={onBookClick}
                className="w-full bg-emerald-900 hover:bg-emerald-800 text-white py-6 rounded-xl shadow-emerald-900/20 shadow-lg text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                Book Trip
            </Button>
            <Button variant="ghost" className="w-full text-slate-600 hover:bg-slate-50 hover:text-emerald-700 text-xs">
                Download PDF Itinerary
            </Button>
            </div>
        </div>
      )}
    </div>
  );
};