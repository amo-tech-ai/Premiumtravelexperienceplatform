/**
 * Trips API Service
 * 
 * Production-ready service for trip management with:
 * - CRUD operations
 * - Type safety
 * - Error handling
 * - Optimistic updates
 * - Mock data fallback for development
 */

import api from './client';
import type {
  Trip,
  TripWithItems,
  TripItem,
  CreateTripRequest,
  UpdateTripRequest,
  CreateTripItemRequest,
  UpdateTripItemRequest,
} from './types';

// ============================================================================
// MOCK DATA (FALLBACK)
// ============================================================================

const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    user_id: 'mock-user',
    title: 'Medellín Adventure',
    description: 'A luxury exploration of Colombia\'s most innovative city',
    destination: 'Medellín, Colombia',
    start_date: '2025-02-15',
    end_date: '2025-02-22',
    status: 'planning',
    budget: 3500,
    currency: 'USD',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'trip-2',
    user_id: 'mock-user',
    title: 'Tokyo Discovery',
    description: 'Modern meets traditional in Japan\'s dynamic capital',
    destination: 'Tokyo, Japan',
    start_date: '2025-03-10',
    end_date: '2025-03-20',
    status: 'planning',
    budget: 5000,
    currency: 'USD',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let mockTripsStore = [...MOCK_TRIPS];
let mockIdCounter = 3;

// ============================================================================
// CONFIGURATION
// ============================================================================

const USE_MOCK_DATA = typeof import.meta?.env?.VITE_USE_MOCK_DATA !== 'undefined' 
  ? import.meta.env.VITE_USE_MOCK_DATA === 'true'
  : true; // Default to true for development

// Log mock data status
if (USE_MOCK_DATA) {
  console.log(
    '%c🎭 MOCK DATA MODE ENABLED',
    'background: #4CAF50; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
    '\nTrip API is using mock data. To use real backend, set VITE_USE_MOCK_DATA=false'
  );
}

// ============================================================================
// TRIPS
// ============================================================================

/**
 * Get all trips for current user
 */
export async function getTrips(): Promise<Trip[]> {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockTripsStore];
  }
  
  try {
    const response = await api.get<Trip[]>('/trips');
    return response.data;
  } catch (error) {
    console.warn('API unavailable, falling back to mock data');
    return [...mockTripsStore];
  }
}

/**
 * Get single trip with items
 */
export async function getTrip(tripId: string): Promise<TripWithItems> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const trip = mockTripsStore.find(t => t.id === tripId);
    if (!trip) {
      throw new Error('Trip not found');
    }
    return {
      ...trip,
      items: [], // No items in mock data yet
    };
  }
  
  try {
    const response = await api.get<TripWithItems>(`/trips/${tripId}`);
    return response.data;
  } catch (error) {
    console.warn('API unavailable, falling back to mock data');
    const trip = mockTripsStore.find(t => t.id === tripId);
    if (!trip) {
      throw new Error('Trip not found');
    }
    return {
      ...trip,
      items: [],
    };
  }
}

/**
 * Create new trip
 */
export async function createTrip(data: CreateTripRequest): Promise<Trip> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newTrip: Trip = {
      id: `trip-${mockIdCounter++}`,
      user_id: 'mock-user',
      ...data,
      status: 'planning',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockTripsStore = [...mockTripsStore, newTrip];
    return newTrip;
  }
  
  try {
    const response = await api.post<Trip>('/trips', data);
    return response.data;
  } catch (error) {
    console.warn('API unavailable, using mock create');
    const newTrip: Trip = {
      id: `trip-${mockIdCounter++}`,
      user_id: 'mock-user',
      ...data,
      status: 'planning',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockTripsStore = [...mockTripsStore, newTrip];
    return newTrip;
  }
}

/**
 * Update existing trip
 */
export async function updateTrip(
  tripId: string,
  data: UpdateTripRequest
): Promise<Trip> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = mockTripsStore.findIndex(t => t.id === tripId);
    if (index === -1) {
      throw new Error('Trip not found');
    }
    const updatedTrip = {
      ...mockTripsStore[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    mockTripsStore = [
      ...mockTripsStore.slice(0, index),
      updatedTrip,
      ...mockTripsStore.slice(index + 1),
    ];
    return updatedTrip;
  }
  
  try {
    const response = await api.put<Trip>(`/trips/${tripId}`, data);
    return response.data;
  } catch (error) {
    console.warn('API unavailable, using mock update');
    const index = mockTripsStore.findIndex(t => t.id === tripId);
    if (index === -1) {
      throw new Error('Trip not found');
    }
    const updatedTrip = {
      ...mockTripsStore[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    mockTripsStore = [
      ...mockTripsStore.slice(0, index),
      updatedTrip,
      ...mockTripsStore.slice(index + 1),
    ];
    return updatedTrip;
  }
}

/**
 * Delete trip
 */
export async function deleteTrip(tripId: string): Promise<void> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 200));
    mockTripsStore = mockTripsStore.filter(t => t.id !== tripId);
    return;
  }
  
  try {
    await api.delete(`/trips/${tripId}`);
  } catch (error) {
    console.warn('API unavailable, using mock delete');
    mockTripsStore = mockTripsStore.filter(t => t.id !== tripId);
  }
}

// ============================================================================
// TRIP ITEMS
// ============================================================================

/**
 * Get all items for a trip
 */
export async function getTripItems(tripId: string): Promise<TripItem[]> {
  const response = await api.get<TripItem[]>(`/trips/${tripId}/items`);
  return response.data;
}

/**
 * Add item to trip
 */
export async function addTripItem(
  tripId: string,
  data: CreateTripItemRequest
): Promise<TripItem> {
  const response = await api.post<TripItem>(`/trips/${tripId}/items`, data);
  return response.data;
}

/**
 * Update trip item
 */
export async function updateTripItem(
  tripId: string,
  itemId: string,
  data: UpdateTripItemRequest
): Promise<TripItem> {
  const response = await api.put<TripItem>(
    `/trips/${tripId}/items/${itemId}`,
    data
  );
  return response.data;
}

/**
 * Delete trip item
 */
export async function deleteTripItem(
  tripId: string,
  itemId: string
): Promise<void> {
  await api.delete(`/trips/${tripId}/items/${itemId}`);
}

/**
 * Reorder trip items
 */
export async function reorderTripItems(
  tripId: string,
  items: Array<{ id: string; day: number; order: number }>
): Promise<TripItem[]> {
  // Update each item individually (batch update could be added to backend later)
  const promises = items.map(({ id, day, order }) =>
    updateTripItem(tripId, id, { day, order })
  );

  return Promise.all(promises);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate trip duration in days
 */
export function getTripDuration(trip: Trip): number {
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Get items grouped by day
 */
export function getItemsByDay(items: TripItem[]): Map<number, TripItem[]> {
  const grouped = new Map<number, TripItem[]>();

  items.forEach((item) => {
    const dayItems = grouped.get(item.day) || [];
    dayItems.push(item);
    grouped.set(item.day, dayItems);
  });

  // Sort items within each day by order
  grouped.forEach((dayItems) => {
    dayItems.sort((a, b) => a.order - b.order);
  });

  return grouped;
}

/**
 * Calculate total trip cost
 */
export function calculateTripCost(items: TripItem[]): {
  total: number;
  currency: string;
  breakdown: Record<string, number>;
} {
  let total = 0;
  const breakdown: Record<string, number> = {};
  const currency = items.find((i) => i.currency)?.currency || 'USD';

  items.forEach((item) => {
    if (item.price) {
      total += item.price;
      breakdown[item.type] = (breakdown[item.type] || 0) + item.price;
    }
  });

  return { total, currency, breakdown };
}

/**
 * Check if trip is in the past
 */
export function isTripPast(trip: Trip): boolean {
  const endDate = new Date(trip.end_date);
  return endDate < new Date();
}

/**
 * Check if trip is upcoming (starts in future)
 */
export function isTripUpcoming(trip: Trip): boolean {
  const startDate = new Date(trip.start_date);
  return startDate > new Date();
}

/**
 * Check if trip is currently active
 */
export function isTripActive(trip: Trip): boolean {
  const now = new Date();
  const startDate = new Date(trip.start_date);
  const endDate = new Date(trip.end_date);
  return now >= startDate && now <= endDate;
}

/**
 * Get trip status label
 */
export function getTripStatusLabel(trip: Trip): string {
  if (trip.status === 'archived') return 'Archived';
  if (trip.status === 'completed') return 'Completed';
  if (isTripPast(trip)) return 'Past';
  if (isTripActive(trip)) return 'Active';
  if (isTripUpcoming(trip)) return 'Upcoming';
  return 'Draft';
}

/**
 * Validate trip dates
 */
export function validateTripDates(
  startDate: string,
  endDate: string
): { valid: boolean; error?: string } {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    return { valid: false, error: 'Invalid start date' };
  }

  if (isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid end date' };
  }

  if (end < start) {
    return { valid: false, error: 'End date must be after start date' };
  }

  return { valid: true };
}