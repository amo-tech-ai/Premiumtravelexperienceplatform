import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, MapPin, Sparkles, Share2, Heart, Plus, Ticket, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { LocalEvent } from '../../utils/mockTripData';

interface EventDetailSheetProps {
  event: LocalEvent | null;
  onClose: () => void;
  onAdd: (event: LocalEvent) => void;
}

export const EventDetailSheet: React.FC<EventDetailSheetProps> = ({ event, onClose, onAdd }) => {
  if (!event) return null;

  const confidencePct = Math.round(event.confidence * 100);

  return (
    <AnimatePresence>
        {event && (
            <div className="fixed inset-0 z-[60] flex justify-end">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />
                
                {/* Sheet */}
                <motion.div 
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-md bg-white shadow-2xl h-full overflow-y-auto flex flex-col"
                >
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Hero Image */}
                    <div className="relative h-72 shrink-0">
                        <ImageWithFallback 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent pt-24 text-white">
                             <div className="flex gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-emerald-500 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                    {event.category}
                                </span>
                                {confidencePct > 85 && (
                                     <span className="px-2 py-0.5 bg-amber-400 text-amber-950 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                        <Sparkles className="w-3 h-3" /> Top Pick
                                    </span>
                                )}
                             </div>
                             <h2 className="text-2xl font-serif font-bold leading-tight mb-2 text-shadow">{event.title}</h2>
                             <div className="flex items-center gap-4 text-sm font-medium text-emerald-100/90">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {event.date}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {event.time}
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1">
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">About this event</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    This is a unique opportunity to experience local {event.category.toLowerCase()} culture. 
                                    {event.reason || event.why_recommended}
                                </p>
                            </div>
                            <div className="text-right shrink-0 ml-4">
                                <p className="text-xl font-bold text-slate-900">{event.price || 'Free'}</p>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Entry</p>
                            </div>
                        </div>

                        {/* AI Insight Block */}
                        <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/50 rounded-full -mr-8 -mt-8 blur-2xl pointer-events-none" />
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                                    <Sparkles className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-emerald-900 text-sm">Scout's Insight</h4>
                                        <span className="text-[10px] font-bold bg-emerald-200/50 text-emerald-800 px-1.5 py-0.5 rounded-full">{confidencePct}% Match</span>
                                    </div>
                                    <p className="text-sm text-emerald-800/80 leading-relaxed">
                                        {event.why_recommended} 
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            {event.venue && (
                                <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue.name + ' ' + event.venue.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100 group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 group-hover:border-emerald-200 group-hover:text-emerald-600 transition-colors">
                                        <MapPin className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-slate-900 text-sm">{event.venue.name}</p>
                                            <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-emerald-400" />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{event.venue.address}</p>
                                    </div>
                                </a>
                            )}
                            
                            {event.booking_url && (
                                <a 
                                    href={event.booking_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100 group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 group-hover:border-purple-200 group-hover:text-purple-600 transition-colors">
                                        <Ticket className="w-4 h-4 text-slate-400 group-hover:text-purple-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-slate-900 text-sm">Official Tickets</p>
                                            <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-purple-400" />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5">Verified source</p>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 flex gap-3 safe-bottom">
                        <Button variant="outline" className="flex-1 border-slate-200 h-12 rounded-xl text-slate-600 font-medium">
                            <Heart className="w-4 h-4 mr-2" /> Save
                        </Button>
                        <Button 
                            className="flex-[2] bg-emerald-900 hover:bg-emerald-800 text-white h-12 rounded-xl text-base font-semibold shadow-emerald-900/10 shadow-lg"
                            onClick={() => {
                                onAdd(event);
                                onClose();
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add to Itinerary
                        </Button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
  );
};