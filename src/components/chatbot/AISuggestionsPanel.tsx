/**
 * AI SUGGESTIONS PANEL
 * 
 * Shows AI-generated suggestions that can be applied to trip
 * Integrates with Context Provider to add items to tabs
 */

import React, { useState } from 'react';
import { AISuggestionCard, AISuggestion, AISuggestionCompact } from './AISuggestionCard';
import { useRestaurants, useEvents, useRentals, useDestinations } from '@/context';
import { Restaurant, Event, Rental, Destination } from '@/context/types/TripTypes';
import { toast } from 'sonner';
import { Sparkles, Zap } from 'lucide-react';
import { Badge } from '../ui/badge';

// ============================================================================
// TYPES
// ============================================================================

interface AISuggestionsPanelProps {
  suggestions: AISuggestion[];
  onSuggestionApplied?: (suggestionId: string) => void;
  onSuggestionDismissed?: (suggestionId: string) => void;
  compact?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function AISuggestionsPanel({
  suggestions,
  onSuggestionApplied,
  onSuggestionDismissed,
  compact = false
}: AISuggestionsPanelProps) {
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  const { setAvailable: setRestaurants } = useRestaurants();
  const { setAvailable: setEvents } = useEvents();
  const { setAvailable: setRentals } = useRentals();
  const { setAvailable: setDestinations } = useDestinations();

  const handleApplySuggestion = async (suggestion: AISuggestion) => {
    // Convert suggestion items to proper entities
    switch (suggestion.category) {
      case 'restaurants':
        const restaurants = convertToRestaurants(suggestion.items);
        setRestaurants(restaurants);
        toast.success(`${restaurants.length} restaurants added to Restaurants tab`);
        break;

      case 'events':
        const events = convertToEvents(suggestion.items);
        setEvents(events);
        toast.success(`${events.length} events added to Events tab`);
        break;

      case 'rentals':
        const rentals = convertToRentals(suggestion.items);
        setRentals(rentals);
        toast.success(`${rentals.length} properties added to Rentals tab`);
        break;

      case 'destinations':
        const destinations = convertToDestinations(suggestion.items);
        setDestinations(destinations);
        toast.success(`${destinations.length} attractions added to Explore`);
        break;
    }

    // Mark as applied
    setAppliedSuggestions(prev => new Set([...prev, suggestion.id]));
    onSuggestionApplied?.(suggestion.id);
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]));
    onSuggestionDismissed?.(suggestionId);
    toast.info('Suggestion dismissed');
  };

  const pendingSuggestions = suggestions.filter(
    s => !appliedSuggestions.has(s.id) && !dismissedSuggestions.has(s.id)
  );

  if (pendingSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">AI Suggests</h3>
            <p className="text-xs text-slate-600">Local Scout</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
          {pendingSuggestions.length} {pendingSuggestions.length === 1 ? 'suggestion' : 'suggestions'}
        </Badge>
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        {pendingSuggestions.map(suggestion => {
          const status = appliedSuggestions.has(suggestion.id)
            ? 'applied'
            : dismissedSuggestions.has(suggestion.id)
            ? 'dismissed'
            : 'pending';

          const suggestionWithStatus = { ...suggestion, status };

          if (compact) {
            return (
              <AISuggestionCompact
                key={suggestion.id}
                suggestion={suggestionWithStatus}
              />
            );
          }

          return (
            <AISuggestionCard
              key={suggestion.id}
              suggestion={suggestionWithStatus}
              onApply={() => handleApplySuggestion(suggestion)}
              onDismiss={() => handleDismissSuggestion(suggestion.id)}
              onPreview={() => {
                // TODO: Show preview modal
                toast.info('Preview coming soon');
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// CONVERSION HELPERS
// ============================================================================

function convertToRestaurants(items: any[]): Restaurant[] {
  return items.map((item, index) => ({
    id: item.id || `restaurant-${index}`,
    type: 'restaurant' as const,
    name: item.name,
    cuisine: item.subtitle || 'International',
    priceLevel: (item.badge === '$$$' ? '$$$' : '$$') as any,
    estimatedCost: 50,
    location: {
      id: `loc-${index}`,
      name: item.name,
      city: 'Medellín',
      country: 'Colombia',
      neighborhood: 'El Poblado'
    },
    rating: 4.5,
    reviewCount: 100,
    currentStatus: 'open' as const,
    tags: [],
    amenities: [],
    dietary: [],
    addedToTrip: false,
    saved: false,
    aiReason: item.subtitle || 'Recommended based on your preferences'
  }));
}

function convertToEvents(items: any[]): Event[] {
  return items.map((item, index) => ({
    id: item.id || `event-${index}`,
    type: 'event' as const,
    name: item.name,
    category: 'cultural' as const,
    location: {
      id: `loc-${index}`,
      name: item.name,
      city: 'Medellín',
      country: 'Colombia'
    },
    startTime: new Date(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    duration: 120,
    price: 30,
    ticketAvailability: 'available' as const,
    tags: [],
    addedToTrip: false,
    saved: false,
    aiReason: item.subtitle || 'Matches your interests'
  }));
}

function convertToRentals(items: any[]): Rental[] {
  return items.map((item, index) => ({
    id: item.id || `rental-${index}`,
    type: 'rental' as const,
    name: item.name,
    propertyType: 'apartment' as const,
    location: {
      id: `loc-${index}`,
      name: item.name,
      city: 'Medellín',
      country: 'Colombia',
      neighborhood: 'El Poblado'
    },
    pricePerMonth: 850,
    pricePerNight: 50,
    bedrooms: 2,
    bathrooms: 2,
    size: 85,
    furnished: true,
    petFriendly: false,
    amenities: ['WiFi', 'Kitchen', 'Gym'],
    availability: 'available' as const,
    shortTerm: true,
    longTerm: true,
    images: [],
    addedToTrip: false,
    saved: false,
    aiReason: item.subtitle || 'Great value for your needs'
  }));
}

function convertToDestinations(items: any[]): Destination[] {
  return items.map((item, index) => ({
    id: item.id || `destination-${index}`,
    type: 'destination' as const,
    name: item.name,
    category: 'landmark' as const,
    location: {
      id: `loc-${index}`,
      name: item.name,
      city: 'Medellín',
      country: 'Colombia'
    },
    estimatedDuration: 60,
    price: 0,
    priceType: 'free' as const,
    highlights: [],
    tags: [],
    accessibility: [],
    facilities: [],
    reservationRequired: false,
    addedToTrip: false,
    saved: false,
    aiReason: item.subtitle || 'Popular attraction'
  }));
}

// ============================================================================
// EXPORT SAMPLE DATA
// ============================================================================

export const SAMPLE_SUGGESTIONS: AISuggestion[] = [
  {
    id: 'suggestion-1',
    agent: 'Local Scout',
    title: 'Add 3 restaurants to Saturday dinner',
    description: 'These fit your cuisine preferences and are near your hotel in El Poblado. All three have rooftop seating for a romantic evening.',
    category: 'restaurants',
    items: [
      {
        id: 'carmen',
        name: 'Carmen',
        subtitle: 'Contemporary Colombian • $$$',
        time: 'Saturday, 7:00 PM',
        badge: '$$$'
      },
      {
        id: 'el-cielo',
        name: 'El Cielo',
        subtitle: 'Fine Dining • $$$$',
        time: 'Saturday, 8:30 PM',
        badge: '$$$$'
      },
      {
        id: 'oci-mde',
        name: 'OCI.Mde',
        subtitle: 'Asian Fusion • $$$',
        time: 'Saturday, 7:30 PM',
        badge: '$$$'
      }
    ],
    exploreLink: '/explore?category=restaurants'
  },
  {
    id: 'suggestion-2',
    agent: 'Navigator',
    title: 'Weekend events near you',
    description: 'Popular events happening this weekend within 2 km of your location.',
    category: 'events',
    items: [
      {
        id: 'parque-lleras',
        name: 'Parque Lleras Live Music',
        subtitle: 'Live Jazz • Free',
        time: 'Saturday, 8:00 PM'
      },
      {
        id: 'poblado-market',
        name: 'El Poblado Night Market',
        subtitle: 'Food & Crafts',
        time: 'Sunday, 6:00 PM'
      }
    ],
    exploreLink: '/explore?category=events'
  }
];
