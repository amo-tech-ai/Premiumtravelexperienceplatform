import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { cn } from '../ui/utils';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { GripVertical, Clock, Sparkles, MapPin, Ticket, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';

export interface ItineraryActivity {
  id: string;
  time: string;
  title: string;
  category: string;
  image?: string;
  isSavedItem?: boolean;
  reason?: string; // "Why this fits"
  venue?: {
    name: string;
    address: string;
  };
  booking_url?: string;
  price?: string;
}

interface ItineraryItemProps {
  activity: ItineraryActivity;
  index: number;
  total: number;
  moveActivity: (dragIndex: number, hoverIndex: number) => void;
  manualMove: (index: number, direction: 'up' | 'down') => void;
}

export const ItineraryItem: React.FC<ItineraryItemProps> = ({
  activity,
  index,
  total,
  moveActivity,
  manualMove,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'activity',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'activity',
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveActivity(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  // Determine badge color based on category
  const getBadgeColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'culture': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'nature': return 'bg-green-100 text-green-800 border-green-200';
      case 'food': return 'bg-red-100 text-red-800 border-red-200';
      case 'nightlife': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'wellness': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'event': return 'bg-violet-100 text-violet-800 border-violet-200';
      case 'music': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'stay': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'check-in': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <motion.div
      layout
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative flex flex-col md:flex-row gap-0 md:gap-4 mb-6 rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300",
        isDragging && "opacity-50 ring-2 ring-emerald-500 ring-offset-2"
      )}
    >
      {/* Drag Handle (Desktop) */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity hidden md:block text-white/80 hover:text-white drop-shadow-md">
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Visual Side (Image) */}
      <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0 overflow-hidden">
        {activity.image ? (
          <ImageWithFallback 
            src={activity.image} 
            alt={activity.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-slate-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-transparent" />
        
        {/* Mobile Time Badge */}
        <div className="absolute top-3 left-3 md:hidden">
             <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md text-xs font-medium text-white border border-white/20">
                <Clock className="w-3 h-3 mr-1.5" />
                {activity.time}
             </span>
        </div>
      </div>

      {/* Content Side */}
      <div className="flex-1 p-5 flex flex-col justify-center">
        <div className="flex justify-between items-start mb-1">
            <div className="flex-1 min-w-0 mr-4">
                {/* Desktop Time */}
                <div className="hidden md:flex items-center text-sm text-slate-500 mb-1 font-medium">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    {activity.time}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-900 transition-colors leading-tight truncate">
                    {activity.title}
                </h3>
                
                {activity.venue && (
                    <div className="flex items-center text-xs text-slate-500 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                        <span className="truncate">{activity.venue.name}</span>
                    </div>
                )}
            </div>
            
            <div className={cn(
                "text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider shrink-0",
                getBadgeColor(activity.category)
            )}>
                {activity.category}
            </div>
        </div>

        {/* AI Insight / Details */}
        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-3 items-start group-hover:bg-emerald-50/30 group-hover:border-emerald-100/50 transition-colors">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
                <p className="text-xs font-semibold text-slate-700 mb-0.5">Why this fits</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                    {activity.reason || "Balances your preference for local culture with a relaxing pace."}
                </p>
            </div>
            {activity.booking_url && (
                <Button size="sm" variant="outline" className="h-7 text-[10px] bg-white border-slate-200 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 shrink-0" asChild>
                    <a href={activity.booking_url} target="_blank" rel="noopener noreferrer">
                        <Ticket className="w-3 h-3 mr-1.5" /> Tickets
                    </a>
                </Button>
            )}
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden gap-2 mt-4">
            <button 
                onClick={(e) => { e.stopPropagation(); manualMove(index, 'up'); }}
                disabled={index === 0}
                className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium disabled:opacity-50"
            >
                Move Up
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); manualMove(index, 'down'); }}
                disabled={index === total - 1}
                className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium disabled:opacity-50"
            >
                Move Down
            </button>
        </div>
      </div>
    </motion.div>
  );
};