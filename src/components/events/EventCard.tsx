import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Sparkles, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { LocalEvent } from '../../utils/mockTripData';

interface EventCardProps {
  event: LocalEvent;
  onAdd: (event: LocalEvent) => void;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onAdd, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="relative h-32 overflow-hidden">
        <ImageWithFallback 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md flex flex-col items-center shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-500">{event.date.split(' ')[0]}</span>
            <span className="text-sm font-bold text-slate-900">{event.date.split(' ')[1]}</span>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
            {event.confidence > 0.85 && (
                <div className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm border border-amber-200 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> 98%
                </div>
            )}
            <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                {event.category}
            </div>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h4 className="font-serif font-semibold text-slate-900 mb-2 leading-tight group-hover:text-emerald-900 transition-colors line-clamp-2">
            {event.title}
        </h4>
        
        <div className="space-y-1.5 mb-4">
            <div className="flex items-center text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                {event.time}
            </div>
            {event.venue && (
                <div className="flex items-center text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {event.venue.name}
                </div>
            )}
            <div className="flex items-center text-xs text-slate-500">
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 rounded-sm">{event.price}</span>
            </div>
        </div>

        <div className="mt-auto">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 mb-3">
                <div className="flex gap-2 items-start">
                    <Sparkles className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-slate-600 leading-snug">
                        <span className="font-medium text-emerald-700">Scout: </span>
                        {event.why_recommended}
                    </p>
                </div>
            </div>
            
            <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-xs h-8 border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                onClick={(e) => {
                    e.stopPropagation();
                    onAdd(event);
                }}
            >
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add to Itinerary
            </Button>
        </div>
      </div>
    </motion.div>
  );
};