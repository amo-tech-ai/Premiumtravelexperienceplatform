import React from 'react';
import { Calendar, Ticket, Plus } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';

export interface Event {
  id: string;
  title: string;
  image: string;
  date: string;
  popularity?: string;
  price?: string;
  location?: string;
}

interface EventCardListProps {
  events: Event[];
  onAdd: (event: Event) => void;
  onHover?: (id: string | null) => void;
  activeId?: string | null;
  className?: string;
  itemRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

export function EventCardList({ events, onAdd, onHover, activeId, className, itemRefs }: EventCardListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xl font-serif font-semibold text-emerald-950 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-emerald-700" />
          Popular Events
        </h3>
        <Button variant="link" className="text-emerald-700 h-auto p-0">See all</Button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {events.map((event) => (
          <div 
            key={event.id}
            ref={(el) => { if(itemRefs) itemRefs.current[event.id] = el; }}
            onMouseEnter={() => onHover && onHover(event.id)}
            onMouseLeave={() => onHover && onHover(null)}
            className={cn(
               "group relative flex-none w-72 bg-white rounded-2xl border transition-all duration-300 overflow-hidden",
               activeId === event.id ? "ring-2 ring-emerald-500 shadow-xl scale-[1.02] border-transparent" : "border-emerald-900/5 shadow-sm hover:shadow-luxury"
            )}
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
               <ImageWithFallback 
                 src={event.image} 
                 alt={event.title}
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
               
               {/* Date Badge */}
               <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-900 flex items-center gap-1 shadow-sm">
                  <Calendar className="w-3 h-3" />
                  {event.date}
               </div>

               {/* Popularity Badge */}
               {event.popularity && (
                 <div className="absolute top-3 right-3 bg-rose-500/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm">
                    {event.popularity}
                 </div>
               )}
            </div>

            {/* Content */}
            <div className="p-4">
               <h4 className="font-medium text-emerald-950 text-lg leading-tight mb-1 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                 {event.title}
               </h4>
               <div className="flex items-center text-sm text-slate-500 mb-4">
                 <span className="truncate">{event.location || 'Medellín, Colombia'}</span>
               </div>

               <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-emerald-900">
                    {event.price || 'Free'}
                  </span>
                  <button 
                    onClick={() => onAdd(event)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
