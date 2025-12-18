import React from 'react';
import { motion } from 'motion/react';
import { X, MapPin, Star, Clock, Globe, Phone, Share2, Heart, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { cn } from '../ui/utils';

interface PlaceDetailDrawerProps {
  place: any;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onAskAI: () => void;
}

export function PlaceDetailDrawer({ 
  place, 
  isOpen, 
  onClose, 
  isSaved, 
  onToggleSave, 
  onAskAI 
}: PlaceDetailDrawerProps) {
  if (!place) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
        />
      )}

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? "0%" : "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/50 backdrop-blur-md rounded-full text-slate-900 hover:bg-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-72 w-full">
           <ImageWithFallback 
             src={place.image} 
             alt={place.title}
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
           <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs font-medium mb-2 border border-white/10">
                {place.category}
              </span>
              <h2 className="text-3xl font-serif font-medium mb-2">{place.title}</h2>
              <div className="flex items-center gap-4 text-sm text-slate-200">
                <span className="flex items-center gap-1">
                   <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                   {place.rating} ({place.reviews})
                </span>
                <span>•</span>
                <span>{place.price}</span>
              </div>
           </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
           
           {/* Actions */}
           <div className="flex gap-3">
              <Button 
                onClick={onToggleSave}
                className={cn(
                  "flex-1 h-12 rounded-xl text-base font-medium transition-colors",
                  isSaved 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100" 
                    : "bg-slate-900 text-white hover:bg-slate-800"
                )}
              >
                 <Heart className={cn("w-4 h-4 mr-2", isSaved && "fill-current")} />
                 {isSaved ? "Saved to Trip" : "Add to Trip"}
              </Button>
              <Button 
                variant="outline" 
                onClick={onAskAI}
                className="h-12 w-12 p-0 rounded-xl border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 text-emerald-700"
                title="Ask AI Concierge"
              >
                 <MessageSquare className="w-5 h-5" />
              </Button>
              <Button variant="outline" className="h-12 w-12 p-0 rounded-xl border-slate-200 text-slate-500">
                 <Share2 className="w-5 h-5" />
              </Button>
           </div>

           {/* AI Insight */}
           {place.aiHint && (
             <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <h3 className="font-serif text-emerald-900 font-medium mb-2 flex items-center gap-2">
                   <span className="text-xl">✨</span> Why you'll love it
                </h3>
                <p className="text-emerald-800/80 text-sm leading-relaxed">
                   {place.aiHint} This spot perfectly matches your preference for {place.tags?.[0]?.toLowerCase() || 'unique experiences'}.
                </p>
             </div>
           )}

           {/* Quick Info */}
           <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                 <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                 <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Open Now</p>
                    <p className="text-sm text-slate-700 font-medium">Until 11:00 PM</p>
                 </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                 <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                 <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Distance</p>
                    <p className="text-sm text-slate-700 font-medium">{place.distance} away</p>
                 </div>
              </div>
           </div>

           {/* Description */}
           <div>
              <h3 className="font-bold text-slate-900 mb-3">About</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                 Experience the essence of Medellín luxury. This location offers a unique blend of local culture and modern sophistication, making it a favorite among discerning travelers.
              </p>
           </div>

           {/* Location */}
           <div>
              <h3 className="font-bold text-slate-900 mb-3">Location</h3>
              <div className="h-40 bg-slate-100 rounded-xl overflow-hidden relative">
                 <img 
                   src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=600&auto=format&fit=crop" 
                   alt="Map Preview" 
                   className="w-full h-full object-cover opacity-50 grayscale"
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Button variant="outline" className="bg-white/80 backdrop-blur text-xs h-8">
                       View on Google Maps
                    </Button>
                 </div>
              </div>
              <div className="mt-3 flex gap-2">
                 {place.tags?.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                       {tag}
                    </span>
                 ))}
              </div>
           </div>

        </div>
      </motion.div>
    </>
  );
}
