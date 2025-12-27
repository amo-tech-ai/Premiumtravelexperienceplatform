/**
 * V2 MOCK DATA
 * 
 * Sample trips for development and testing
 */

import type { TripV2, ItineraryV2, ItineraryItemV2 } from '../types';

export const mockTripsV2: TripV2[] = [
  {
    id: 'trip-medellin-2025',
    userId: 'user-1',
    destination: {
      city: 'Medellín',
      country: 'Colombia',
      region: 'Antioquia',
      coordinates: { lat: 6.2442, lng: -75.5812 },
    },
    startDate: '2025-01-15',
    endDate: '2025-01-20',
    duration: 5,
    timezone: 'America/Bogota',
    travelers: {
      adults: 2,
      children: 0,
      type: 'couple',
    },
    budget: {
      total: 2400,
      currency: 'USD',
      type: 'per_person',
      includes: ['accommodation', 'activities', 'food'],
      spent: 1240,
    },
    interests: ['food', 'culture', 'nature'],
    pace: 'moderate',
    style: 'comfort',
    status: 'planning',
    progress: 60,
    permissions: {
      'user-1': 'owner',
    },
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-12-27T15:30:00Z',
    coverImage: 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=800',
  },
  {
    id: 'trip-cartagena-2025',
    userId: 'user-1',
    destination: {
      city: 'Cartagena',
      country: 'Colombia',
      region: 'Bolivar',
      coordinates: { lat: 10.3910, lng: -75.4794 },
    },
    startDate: '2025-03-01',
    endDate: '2025-03-07',
    duration: 7,
    timezone: 'America/Bogota',
    travelers: {
      adults: 2,
      children: 0,
      type: 'couple',
    },
    budget: {
      total: 4200,
      currency: 'USD',
      type: 'per_person',
      includes: ['accommodation', 'activities', 'food'],
      spent: 850,
    },
    interests: ['beach', 'history', 'food', 'photography'],
    pace: 'relaxed',
    style: 'luxury',
    status: 'draft',
    progress: 25,
    permissions: {
      'user-1': 'owner',
    },
    createdAt: '2024-12-26T14:00:00Z',
    updatedAt: '2024-12-26T18:20:00Z',
    coverImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800',
  },
];

export const mockItineraryMedellin: ItineraryV2 = {
  tripId: 'trip-medellin-2025',
  days: [
    {
      dayNumber: 1,
      date: '2025-01-15',
      title: 'Arrival & El Poblado',
      items: [
        {
          id: 'item-1-1',
          type: 'restaurant',
          name: 'Pergamino Café',
          description: 'Famous local coffee shop to start the day',
          startTime: '09:00',
          endTime: '10:00',
          duration: 60,
          location: {
            address: 'Calle 30 #43-43',
            neighborhood: 'El Poblado',
            coordinates: { lat: 6.2080, lng: -75.5658 },
          },
          cost: 15,
          currency: 'USD',
          costType: 'per_person',
          bookingStatus: 'none',
          details: {
            cuisine: 'Coffee & Pastries',
            rating: 4.7,
            priceLevel: '$',
          },
          addedBy: 'user',
          createdAt: '2024-12-20T10:30:00Z',
        },
        {
          id: 'item-1-2',
          type: 'attraction',
          name: 'Museo de Antioquia',
          description: 'Explore Botero\'s art and Colombian history',
          startTime: '11:00',
          endTime: '13:00',
          duration: 120,
          location: {
            address: 'Carrera 52A #52-43',
            neighborhood: 'Centro',
            coordinates: { lat: 6.2515, lng: -75.5689 },
          },
          cost: 10,
          currency: 'USD',
          costType: 'per_person',
          bookingStatus: 'none',
          details: {
            ticketsRequired: false,
            openingHours: '10:00-17:30',
            website: 'https://museodeantioquia.co',
            rating: 4.6,
          },
          addedBy: 'ai',
          createdAt: '2024-12-20T10:35:00Z',
        },
        {
          id: 'item-1-3',
          type: 'restaurant',
          name: 'Carmen',
          description: 'Contemporary Colombian fine dining',
          startTime: '14:00',
          endTime: '16:00',
          duration: 120,
          location: {
            address: 'Calle 33 #7-09',
            neighborhood: 'El Poblado',
            coordinates: { lat: 6.2088, lng: -75.5670 },
          },
          cost: 85,
          currency: 'USD',
          costType: 'per_person',
          bookingStatus: 'required',
          details: {
            cuisine: 'Contemporary Colombian',
            rating: 4.8,
            priceLevel: '$$$',
            reservationRequired: true,
          },
          addedBy: 'ai',
          createdAt: '2024-12-20T10:40:00Z',
          notes: 'Reservation required - book in advance!',
        },
      ],
      totalCost: 110,
      totalDuration: 300,
    },
    {
      dayNumber: 2,
      date: '2025-01-16',
      title: 'Nature & Views',
      items: [
        {
          id: 'item-2-1',
          type: 'activity',
          name: 'Cerro Nutibara Morning Hike',
          description: 'Panoramic views of the city',
          startTime: '07:30',
          endTime: '10:00',
          duration: 150,
          location: {
            address: 'Cerro Nutibara',
            neighborhood: 'Nutibara',
            coordinates: { lat: 6.2346, lng: -75.5758 },
          },
          cost: 0,
          currency: 'USD',
          costType: 'total',
          bookingStatus: 'none',
          details: {},
          addedBy: 'user',
          createdAt: '2024-12-21T09:00:00Z',
        },
        {
          id: 'item-2-2',
          type: 'restaurant',
          name: 'Mondongo\'s',
          description: 'Traditional bandeja paisa',
          startTime: '12:00',
          endTime: '13:30',
          duration: 90,
          location: {
            address: 'Carrera 70 #52-85',
            neighborhood: 'Laureles',
            coordinates: { lat: 6.2423, lng: -75.5908 },
          },
          cost: 25,
          currency: 'USD',
          costType: 'per_person',
          bookingStatus: 'none',
          details: {
            cuisine: 'Traditional Colombian',
            rating: 4.5,
            priceLevel: '$$',
          },
          addedBy: 'ai',
          createdAt: '2024-12-21T09:05:00Z',
        },
      ],
      totalCost: 25,
      totalDuration: 240,
    },
    {
      dayNumber: 3,
      date: '2025-01-17',
      items: [],
      totalCost: 0,
      totalDuration: 0,
    },
    {
      dayNumber: 4,
      date: '2025-01-18',
      items: [],
      totalCost: 0,
      totalDuration: 0,
    },
    {
      dayNumber: 5,
      date: '2025-01-19',
      items: [],
      totalCost: 0,
      totalDuration: 0,
    },
  ],
};

// Helper function to generate empty itinerary for a trip
export function generateEmptyItinerary(trip: TripV2): ItineraryV2 {
  const startDate = new Date(trip.startDate);
  return {
    tripId: trip.id,
    days: Array.from({ length: trip.duration }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return {
        dayNumber: i + 1,
        date: date.toISOString().split('T')[0],
        items: [],
        totalCost: 0,
        totalDuration: 0,
      };
    }),
  };
}
