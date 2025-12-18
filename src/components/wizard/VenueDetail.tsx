import React, { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetFooter, 
  SheetTitle, 
  SheetClose 
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Venue } from '../../types/wizard';
import { BookingSheet } from './BookingSheet';
import { useAI } from '../../context/AIContext';
import { 
  Star, 
  MapPin, 
  Clock, 
  Globe, 
  Share2, 
  Heart, 
  Sparkles,
  Check,
  Calendar
} from 'lucide-react';
import { cn } from '../ui/utils';
import { motion } from 'motion/react';

interface VenueDetailProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VenueDetail = ({ venue, isOpen, onClose }: VenueDetailProps) => {
  const [showBooking, setShowBooking] = useState(false);
  const { savedItems, saveItem, removeItem } = useAI();

  if (!venue) return null;

  const isSaved = savedItems.some(item => item.id === venue.id);

  const handleToggleSave = () => {
    if (isSaved) {
      removeItem(venue.id);
    } else {
      saveItem({
        id: venue.id,
        type: 'experience', // Generic type for wizard results
        title: venue.name,
        image: venue.images[0],
        location: venue.location.neighborhood,
        price: "$".repeat(venue.priceLevel),
        data: venue
      });
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent 
          side="right" 
          className="w-full sm:max-w-md md:max-w-lg p-0 overflow-y-auto bg-white border-l border-border/50 shadow-2xl z-[100]"
        >
        {/* --- Hero Image Section --- */}
        <div className="relative h-64 w-full shrink-0">
          <ImageWithFallback 
            src={venue.images[0]} 
            alt={venue.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Top Actions */}
          <div className="absolute top-4 right-12 flex items-center gap-2 z-10">
            <Button size="icon" variant="secondary" className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 border-none text-white h-8 w-8">
              <Share2 className="w-4 h-4" />
            </Button>
              <Button 
                size="icon" 
                variant="secondary" 
                className={cn(
                  "rounded-full backdrop-blur-md border-none h-8 w-8 transition-colors",
                  isSaved ? "bg-white text-emerald-600 hover:bg-white/90" : "bg-white/20 text-white hover:bg-white/40"
                )}
                onClick={handleToggleSave}
              >
                <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
              </Button>
          </div>

          {/* Title & Badge Overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-emerald-900 text-white hover:bg-emerald-800 border-none px-2 py-0.5 text-xs font-normal tracking-wide">
                {venue.type}
              </Badge>
              {venue.priceLevel && (
                <span className="text-sm font-medium opacity-90">
                  {"$".repeat(venue.priceLevel)}
                </span>
              )}
            </div>
            <SheetTitle className="text-2xl md:text-3xl font-serif text-white leading-tight">
              {venue.name}
            </SheetTitle>
            <div className="flex items-center gap-1 text-white/90 text-sm mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{venue.location.neighborhood}</span>
            </div>
          </div>
        </div>

        {/* --- Content Body --- */}
        <div className="p-6 space-y-8 pb-32">
          
          {/* AI Match Score */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-start gap-4"
          >
            <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-emerald-900">{venue.ai.matchScore}% Match</span>
                <span className="text-xs text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-100">
                  Recommended
                </span>
              </div>
              <p className="text-sm text-emerald-800 leading-relaxed">
                {venue.ai.reasoning}
              </p>
            </div>
          </motion.div>

          {/* Stats Row */}
          <div className="flex items-center justify-between py-2 border-y border-border/50">
            <div className="flex flex-col items-center gap-1 px-4">
              <span className="text-lg font-bold text-slate-900 flex items-center gap-1">
                {venue.rating} <Star className="w-3.5 h-3.5 fill-current text-yellow-500" />
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Rating</span>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div className="flex flex-col items-center gap-1 px-4">
              <span className="text-lg font-bold text-slate-900">
                {venue.reviewCount}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Reviews</span>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div className="flex flex-col items-center gap-1 px-4">
              <span className="text-lg font-bold text-slate-900">
                15<span className="text-xs font-normal">m</span>
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Away</span>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-3">
            <h3 className="font-medium text-slate-900">About</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {venue.description}
            </p>
          </div>

          {/* Tags/Amenities */}
          <div className="space-y-3">
            <h3 className="font-medium text-slate-900">Highlights</h3>
            <div className="flex flex-wrap gap-2">
              {venue.ai.tags.map((tag) => (
                <div key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs font-medium text-slate-700">
                  <Check className="w-3 h-3 text-emerald-600" />
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-3">
            <h3 className="font-medium text-slate-900">Location</h3>
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
              <div>
                <p className="font-medium text-slate-900">{venue.location.address}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{venue.location.neighborhood}, Medellín</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Sticky Footer --- */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-border/50 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4">
             <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Price Estimate</span>
                <span className="font-serif font-bold text-lg text-slate-900">$85<span className="text-sm font-sans font-normal text-muted-foreground">/pp</span></span>
             </div>
             <Button 
               className="flex-1 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl h-12 text-base font-medium shadow-luxury"
               onClick={() => setShowBooking(true)}
             >
                <Calendar className="w-4 h-4 mr-2" />
                Check Availability
             </Button>
          </div>
        </div>

      </SheetContent>
      </Sheet>

      <BookingSheet 
        venue={venue} 
        isOpen={showBooking} 
        onClose={() => setShowBooking(false)} 
      />
    </>
  );
};
