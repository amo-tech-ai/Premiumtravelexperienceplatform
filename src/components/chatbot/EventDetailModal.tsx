import React from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Users,
  Star,
  Ticket,
  Navigation,
  Timer,
  Share2,
  ExternalLink,
  Bookmark,
  Plus,
  Check,
  AlertTriangle,
  Sparkles,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Event, TicketStatus } from './EventCard';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (id: string) => void;
  onAddToTrip?: (id: string) => void;
  onAddToCalendar?: (event: Event) => void;
}

export function EventDetailModal({
  event,
  isOpen,
  onClose,
  onSave,
  onAddToTrip,
  onAddToCalendar
}: EventDetailModalProps) {
  if (!event) return null;

  const getTicketStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'limited': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'sold-out': return 'bg-red-100 text-red-700 border-red-200';
      case 'free': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTicketStatusLabel = (status: TicketStatus) => {
    switch (status) {
      case 'available': return 'Tickets Available';
      case 'limited': return event.ticketsRemaining 
        ? `Only ${event.ticketsRemaining} Tickets Left!` 
        : 'Limited Tickets';
      case 'sold-out': return 'Sold Out';
      case 'free': return 'Free Entry';
      default: return 'Unknown';
    }
  };

  const hasConflicts = event.conflicts && event.conflicts.length > 0;
  const majorConflict = event.conflicts?.find(c => c.severity === 'major');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header Image */}
              <div className="relative h-48 bg-gradient-to-br from-purple-200 via-indigo-200 to-pink-200 flex items-center justify-center">
                <Ticket className="w-24 h-24 text-white/40" />
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                >
                  <X className="w-5 h-5 text-slate-700" />
                </button>

                {/* Category & Status */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-white/90 text-purple-700 border-purple-200">
                    {event.category}
                  </Badge>
                  <Badge className={cn("font-semibold", getTicketStatusColor(event.ticketStatus))}>
                    {getTicketStatusLabel(event.ticketStatus)}
                  </Badge>
                </div>

                {/* State Badge */}
                {event.addedToTrip && (
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-purple-600 text-white">
                      <Check className="w-3 h-3 mr-1" />
                      Added to Trip
                    </Badge>
                  </div>
                )}
                {event.saved && !event.addedToTrip && (
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-amber-500 text-white">
                      <Bookmark className="w-3 h-3 mr-1 fill-white" />
                      Saved
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Title & Venue */}
                <div>
                  <h2 className="font-semibold text-slate-900 mb-1">{event.name}</h2>
                  <p className="text-sm text-slate-600">{event.venue}</p>
                </div>

                {/* Key Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Date */}
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-medium">Date</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{event.date}</p>
                  </div>

                  {/* Time */}
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium">Time</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      {event.time}
                      {event.endTime && ` - ${event.endTime}`}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-600 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-medium">Location</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{event.location}</p>
                  </div>

                  {/* Price */}
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-600 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs font-medium">Price</span>
                    </div>
                    <p className="text-sm font-semibold text-emerald-600">{event.price}</p>
                  </div>
                </div>

                {/* Distance & Travel Time */}
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">{event.distance}</span>
                    </div>
                    {event.walkTime && (
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-700">{event.walkTime} walk</span>
                      </div>
                    )}
                    {event.driveTime && (
                      <span className="text-blue-600 text-xs">• {event.driveTime} drive</span>
                    )}
                  </div>
                </div>

                {/* Conflict Warning */}
                {hasConflicts && (
                  <div className={cn(
                    "p-4 rounded-lg border",
                    majorConflict 
                      ? "bg-red-50 border-red-200" 
                      : "bg-amber-50 border-amber-200"
                  )}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={cn(
                        "w-5 h-5 flex-shrink-0",
                        majorConflict ? "text-red-600" : "text-amber-600"
                      )} />
                      <div className="flex-1">
                        <h4 className={cn(
                          "font-semibold mb-2",
                          majorConflict ? "text-red-900" : "text-amber-900"
                        )}>
                          {majorConflict ? '⚠️ Schedule Conflict Detected' : '⚡ Potential Time Overlap'}
                        </h4>
                        {event.conflicts?.map((conflict, idx) => (
                          <div key={idx} className="mb-2 last:mb-0">
                            <p className="text-sm text-slate-700 leading-relaxed">
                              Overlaps with <span className="font-semibold">{conflict.tripName}</span>
                            </p>
                            <p className="text-xs text-slate-600 mt-0.5">
                              Conflict time: {conflict.conflictTime}
                            </p>
                          </div>
                        ))}
                        <div className="mt-3 p-2 bg-white/50 rounded border border-current/20">
                          <p className="text-xs text-slate-700 flex items-start gap-1.5">
                            <Sparkles className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            <span>
                              Consider adjusting your trip schedule or choosing a different event time.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">About This Event</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{event.description}</p>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Tags</h4>
                  <div className="flex gap-2 flex-wrap">
                    {event.tags.map((tag, idx) => (
                      <Badge 
                        key={idx}
                        className="bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Rating & Attendees */}
                {(event.rating || event.attendees) && (
                  <div className="flex items-center gap-4">
                    {event.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-semibold">{event.rating}</span>
                        {event.reviews && (
                          <span className="text-xs text-slate-500">({event.reviews} reviews)</span>
                        )}
                      </div>
                    )}
                    {event.attendees && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700">{event.attendees} attending</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Contact Info (Mock) */}
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Venue Information</h4>
                  <div className="space-y-2">
                    <a href="#" className="flex items-center gap-2 text-sm text-slate-600 hover:text-purple-600 transition-colors">
                      <Phone className="w-3.5 h-3.5" />
                      <span>+57 321 456 7890</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 text-sm text-slate-600 hover:text-purple-600 transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                      <span>info@venue.com</span>
                    </a>
                    <a href="#" className="flex items-center gap-2 text-sm text-slate-600 hover:text-purple-600 transition-colors">
                      <Globe className="w-3.5 h-3.5" />
                      <span>www.venue.com</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-2">
                {/* Calendar Integration */}
                <Button
                  onClick={() => onAddToCalendar?.(event)}
                  variant="outline"
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>

                {/* Main Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => onSave?.(event.id)}
                    variant="outline"
                    className={cn(
                      "flex-1",
                      event.saved && "bg-amber-100 border-amber-300 text-amber-700"
                    )}
                  >
                    <Bookmark className={cn(
                      "w-4 h-4 mr-2",
                      event.saved && "fill-amber-600"
                    )} />
                    {event.saved ? 'Saved' : 'Save Event'}
                  </Button>
                  
                  {!event.addedToTrip ? (
                    <Button
                      onClick={() => onAddToTrip?.(event.id)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={event.ticketStatus === 'sold-out' || hasConflicts}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Trip
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex-1 border-purple-300 text-purple-700 bg-purple-50"
                      disabled
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Added to Trip
                    </Button>
                  )}
                </div>

                {/* Share & Get Tickets */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                  >
                    <Share2 className="w-3.5 h-3.5 mr-1.5" />
                    Share
                  </Button>
                  {event.ticketStatus !== 'free' && event.ticketStatus !== 'sold-out' && (
                    <Button
                      size="sm"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      Get Tickets
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
