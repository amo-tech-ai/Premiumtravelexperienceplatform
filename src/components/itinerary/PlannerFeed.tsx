import React from 'react';
import { Sparkles, ArrowRight, Heart, Plus, SearchX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ItineraryItem, ItineraryActivity } from './ItineraryItem';
import { EventCard } from '../events/EventCard';
import { LocalEvent } from '../../utils/mockTripData';

// Types
export interface FeedItem {
  id: string;
  title: string;
  price?: string;
  rating?: number;
  image: string;
  tags?: string[];
  tag?: string; // Single tag override
  cuisine?: string;
  reason: string;
}

interface PlannerFeedProps {
  stays: FeedItem[];
  restaurants: FeedItem[];
  activities: ItineraryActivity[];
  localEvents?: LocalEvent[];
  onMoveActivity: (dragIndex: number, hoverIndex: number) => void;
  onManualMove: (index: number, direction: 'up' | 'down') => void;
  onAddActivity?: () => void;
  onAddEvent?: (event: LocalEvent) => void;
  onOpenEventsHub?: () => void;
  onSelectEvent?: (event: LocalEvent) => void;
}

const AIPromptBar = () => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
      <div className="flex gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-700">Trip Assistant</p>
            <p className="text-xs text-slate-500">I've curated this based on your preference for luxury & nature.</p>
        </div>
      </div>
      <div className="relative">
        <Input 
          placeholder="Ask to change the pace, swap a hotel, or add an event..." 
          className="pr-10 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500"
        />
        <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8 text-emerald-600 hover:bg-emerald-50">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex gap-2 mt-3">
        {['Make it more relaxed', 'Add a coffee tour', 'Find cheaper stays'].map(chip => (
            <button key={chip} className="text-xs px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-full border border-slate-200 transition-colors">
                {chip}
            </button>
        ))}
      </div>
    </div>
  );
};

const RecommendationBlock = ({ title, items, type }: { title: string, items: FeedItem[], type: 'stay' | 'food' }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-serif font-semibold text-slate-900">{title}</h3>
        {items.length > 0 && (
            <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs h-8">
                View all
            </Button>
        )}
    </div>
    
    {items.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <SearchX className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-600">No matches found</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or budget.</p>
        </div>
    ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode='popLayout'>
                {items.map(item => (
                    <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        key={item.id}
                        whileHover={{ y: -4 }}
                        className="group bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                        <div className="relative h-40 overflow-hidden">
                            <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-rose-500 transition-colors">
                                <Heart className="w-4 h-4" />
                            </button>
                            {item.tag && (
                                <span className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium rounded-md">
                                    {item.tag}
                                </span>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-medium text-slate-900 group-hover:text-emerald-900">{item.title}</h4>
                                <span className="text-sm font-semibold text-slate-700">{item.price}</span>
                            </div>
                            {type === 'stay' && item.tags && (
                                <div className="flex gap-2 mb-3">
                                    {item.tags.map((t: string) => (
                                        <span key={t} className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">{t}</span>
                                    ))}
                                </div>
                            )}
                            {type === 'food' && (
                                <p className="text-xs text-slate-500 mb-3">{item.cuisine}</p>
                            )}
                            
                            <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100/50 flex gap-2 items-start">
                                <Sparkles className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                                <p className="text-xs text-emerald-800/80 leading-snug">{item.reason}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )}
  </div>
);

export const PlannerFeed: React.FC<PlannerFeedProps> = ({
  stays,
  restaurants,
  activities,
  localEvents,
  onMoveActivity,
  onManualMove,
  onAddActivity,
  onAddEvent,
  onOpenEventsHub,
  onSelectEvent
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <AIPromptBar />

      <RecommendationBlock title="Stays for You" items={stays} type="stay" />
      <RecommendationBlock title="Dining Highlights" items={restaurants} type="food" />

      {/* Local Scout Section */}
      {localEvents && localEvents.length > 0 && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-violet-100 rounded-xl">
                    <Sparkles className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                    <h3 className="text-lg font-serif font-semibold text-slate-900 leading-tight">Local Scout Highlights</h3>
                    <p className="text-xs text-slate-500">Exclusive events happening Jan 14-19</p>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onOpenEventsHub} 
                    className="ml-auto text-xs text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                >
                    View All
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localEvents.map(evt => (
                    <div key={evt.id} className="h-full">
                        <EventCard 
                            event={evt} 
                            onAdd={(e) => onAddEvent?.(e)} 
                            onClick={() => onSelectEvent?.(evt)}
                        />
                    </div>
                ))}
            </div>
          </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-serif font-semibold text-slate-900">Daily Flow</h3>
            <span className="text-xs text-slate-400">Drag to reorder</span>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="space-y-2">
            {activities.length === 0 ? (
                <div className="text-center py-8">
                     <p className="text-sm text-slate-500">Your itinerary is empty.</p>
                     <Button variant="link" className="text-emerald-600" onClick={onAddActivity}>Start adding activities</Button>
                </div>
            ) : (
                <>
                    {activities.map((activity, index) => (
                    <ItineraryItem
                        key={activity.id}
                        index={index}
                        total={activities.length}
                        activity={activity}
                        moveActivity={onMoveActivity}
                        manualMove={onManualMove}
                    />
                    ))}
                    <Button 
                    variant="ghost" 
                    onClick={onAddActivity}
                    className="w-full mt-4 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-dashed border-emerald-200"
                    >
                    <Plus className="w-4 h-4 mr-2" /> Add Activity
                    </Button>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
