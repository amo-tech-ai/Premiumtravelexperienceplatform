import React, { useState } from 'react';
import { 
  Clock,
  MapPin,
  DollarSign,
  Users,
  Star,
  Calendar,
  Ticket,
  AlertTriangle,
  Plus,
  Check,
  Bookmark,
  Share2,
  ExternalLink,
  Navigation,
  Timer,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { motion } from 'motion/react';

// Types
export type EventTimeGroup = 'tonight' | 'weekend' | 'next-week' | 'later';
export type TicketStatus = 'available' | 'limited' | 'sold-out' | 'free';

export interface Event {
  id: string;
  name: string;
  category: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  venue: string;
  price: string;
  priceValue?: number;
  ticketStatus: TicketStatus;
  ticketsRemaining?: number;
  distance: string;
  walkTime?: string;
  driveTime?: string;
  rating?: string;
  reviews?: string;
  attendees?: string;
  tags: string[];
  description: string;
  imageUrl?: string;
  conflicts?: {
    tripId: string;
    tripName: string;
    conflictTime: string;
    severity: 'minor' | 'major';
  }[];
  saved?: boolean;
  addedToTrip?: boolean;
  timeGroup: EventTimeGroup;
}

interface EventCardProps {
  event: Event;
  onSave?: (id: string) => void;
  onAddToTrip?: (id: string) => void;
  onViewDetails?: (event: Event) => void;
  compact?: boolean;
}

export function EventCard({ 
  event, 
  onSave,
  onAddToTrip,
  onViewDetails,
  compact = false
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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
        ? `Only ${event.ticketsRemaining} Left!` 
        : 'Limited Tickets';
      case 'sold-out': return 'Sold Out';
      case 'free': return 'Free Entry';
      default: return 'Unknown';
    }
  };

  const hasConflicts = event.conflicts && event.conflicts.length > 0;
  const majorConflict = event.conflicts?.find(c => c.severity === 'major');

  if (compact) {
    return (
      <div 
        className={cn(
          "bg-white rounded-lg p-3 border transition-all cursor-pointer",
          isHovered ? "border-purple-300 shadow-sm" : "border-slate-200",
          event.saved && "ring-1 ring-amber-200",
          event.addedToTrip && "bg-purple-50/30"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onViewDetails?.(event)}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-slate-900 text-sm">{event.name}</h4>
          <Badge className={cn("text-xs", getTicketStatusColor(event.ticketStatus))}>
            {event.ticketStatus === 'free' ? 'Free' : event.price}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {event.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {event.location}
          </span>
        </div>
        <div className="flex items-center justify-between">
          {event.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium">{event.rating}</span>
            </div>
          )}
          {hasConflicts && (
            <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px]">
              <AlertTriangle className="w-2.5 h-2.5 mr-1" />
              Conflict
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-xl border transition-all cursor-pointer group",
        isHovered ? "border-purple-300 shadow-md" : "border-slate-200 hover:shadow-sm",
        event.saved && "ring-1 ring-amber-200",
        event.addedToTrip && "bg-purple-50/30",
        hasConflicts && "ring-2 ring-red-100"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails?.(event)}
    >
      {/* Image Header */}
      <div className="relative h-32 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-t-xl overflow-hidden flex items-center justify-center">
        <Ticket className="w-16 h-16 text-purple-300" />
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <Badge className="bg-white/90 text-purple-700 border-purple-200 text-[10px]">
            {event.category}
          </Badge>
        </div>

        {/* Ticket Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge className={cn("text-[10px] font-semibold", getTicketStatusColor(event.ticketStatus))}>
            {getTicketStatusLabel(event.ticketStatus)}
          </Badge>
        </div>

        {/* State Indicators */}
        {event.saved && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-amber-500 text-white text-[10px]">Saved</Badge>
          </div>
        )}
        {event.addedToTrip && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-purple-600 text-white text-[10px]">
              <Check className="w-2.5 h-2.5 mr-1" />
              In Trip
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900 mb-1">{event.name}</h4>
            <p className="text-xs text-slate-600">{event.venue}</p>
          </div>
          {event.attendees && (
            <div className="flex items-center gap-1 text-xs text-slate-500 ml-2">
              <Users className="w-3.5 h-3.5" />
              <span>{event.attendees}</span>
            </div>
          )}
        </div>

        {/* Date & Time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Calendar className="w-3 h-3" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <Clock className="w-3 h-3" />
            <span>{event.time}</span>
            {event.endTime && <span>- {event.endTime}</span>}
          </div>
        </div>

        {/* Location & Distance */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <MapPin className="w-3 h-3" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-0.5">
              <Navigation className="w-3 h-3" />
              {event.distance}
            </span>
            {event.walkTime && (
              <span className="flex items-center gap-0.5">
                <Timer className="w-3 h-3" />
                {event.walkTime}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {event.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Conflict Warning */}
        {hasConflicts && (
          <div className={cn(
            "mb-3 p-2.5 rounded-lg border",
            majorConflict 
              ? "bg-red-50 border-red-200" 
              : "bg-amber-50 border-amber-200"
          )}>
            <div className="flex items-start gap-2">
              <AlertTriangle className={cn(
                "w-3.5 h-3.5 flex-shrink-0 mt-0.5",
                majorConflict ? "text-red-600" : "text-amber-600"
              )} />
              <div className="flex-1">
                <p className={cn(
                  "text-[11px] font-semibold mb-1",
                  majorConflict ? "text-red-900" : "text-amber-900"
                )}>
                  {majorConflict ? 'Schedule Conflict' : 'Potential Overlap'}
                </p>
                {event.conflicts?.map((conflict, idx) => (
                  <p key={idx} className="text-[10px] text-slate-700 leading-relaxed">
                    Overlaps with <span className="font-medium">{conflict.tripName}</span> at {conflict.conflictTime}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-slate-700 leading-relaxed mb-3 line-clamp-2">
          {event.description}
        </p>

        {/* Price & Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {event.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-medium">{event.rating}</span>
                {event.reviews && (
                  <span className="text-xs text-slate-400">({event.reviews})</span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-600">{event.price}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onSave?.(event.id);
            }}
            className={cn(
              "flex-1",
              event.saved && "bg-amber-100 border-amber-300 text-amber-700"
            )}
          >
            <Bookmark className={cn(
              "w-3.5 h-3.5 mr-1.5",
              event.saved && "fill-amber-600"
            )} />
            {event.saved ? 'Saved' : 'Save'}
          </Button>
          {!event.addedToTrip ? (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddToTrip?.(event.id);
              }}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              disabled={event.ticketStatus === 'sold-out' || hasConflicts}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add to Trip
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-purple-300 text-purple-700 bg-purple-50"
              disabled
            >
              <Check className="w-3.5 h-3.5 mr-1.5" />
              Added
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Time Group Header Component
export function TimeGroupHeader({ 
  group, 
  count 
}: { 
  group: EventTimeGroup; 
  count: number;
}) {
  const getGroupLabel = (group: EventTimeGroup) => {
    switch (group) {
      case 'tonight': return '🌙 Tonight';
      case 'weekend': return '🎉 This Weekend';
      case 'next-week': return '📅 Next Week';
      case 'later': return '🔮 Coming Soon';
      default: return 'Events';
    }
  };

  const getGroupDescription = (group: EventTimeGroup) => {
    switch (group) {
      case 'tonight': return 'Happening today';
      case 'weekend': return 'Saturday & Sunday';
      case 'next-week': return 'Week of Dec 30';
      case 'later': return 'Beyond next week';
      default: return '';
    }
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <h4 className="font-semibold text-slate-900">{getGroupLabel(group)}</h4>
        <p className="text-[10px] text-slate-500">{getGroupDescription(group)}</p>
      </div>
      <Badge className="bg-purple-100 text-purple-700 border-purple-200">
        {count}
      </Badge>
    </div>
  );
}
