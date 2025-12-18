import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Trip Context - Global State Management
 * Provides trip data to all components in the application
 * 
 * DEV MODE: Mock trip data enabled for development
 */

// Types
interface Trip {
  id: string;
  title: string;
  destination_city: string;
  destination_country: string;
  start_date: string;
  end_date: string;
  total_budget?: number;
  currency: string;
  status: 'planning' | 'confirmed' | 'in_progress' | 'completed';
  creator_id: string;
  created_at: string;
  updated_at: string;
}

// TEMPORARY: Mock data for development
const DEV_MODE = true;
const MOCK_TRIP: Trip = {
  id: 'trip-123',
  title: 'Medellín Adventure',
  destination_city: 'Medellín',
  destination_country: 'Colombia',
  start_date: '2025-02-15',
  end_date: '2025-02-22',
  total_budget: 2000,
  currency: 'USD',
  status: 'planning',
  creator_id: 'dev-user-123',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

interface ItineraryItem {
  id: string;
  trip_id: string;
  type: 'dining' | 'activity' | 'event' | 'accommodation' | 'transport' | 'buffer';
  title: string;
  day_number: number;
  start_time?: string;
  end_time?: string;
  location_name?: string;
  estimated_cost?: number;
  status: 'planned' | 'booked' | 'confirmed' | 'completed';
  priority: 'must_have' | 'high' | 'normal' | 'optional';
  locked: boolean;
}

interface TripContextType {
  currentTrip: Trip | null;
  itinerary: ItineraryItem[];
  loading: boolean;
  error: string | null;
  
  // Actions
  loadTrip: (tripId: string) => Promise<void>;
  updateTrip: (updates: Partial<Trip>) => Promise<void>;
  addItineraryItem: (item: Omit<ItineraryItem, 'id' | 'trip_id' | 'created_at'>) => Promise<void>;
  updateItineraryItem: (itemId: string, updates: Partial<ItineraryItem>) => Promise<void>;
  removeItineraryItem: (itemId: string) => Promise<void>;
  refreshItinerary: () => Promise<void>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

/**
 * Trip Provider Component
 * Wraps application with trip state management
 */
export function TripProvider({ children }: { children: ReactNode }) {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load trip data
  const loadTrip = async (tripId: string) => {
    if (!tripId) return;

    setLoading(true);
    setError(null);

    try {
      // DEV MODE: Use mock trip data
      if (DEV_MODE) {
        setCurrentTrip(MOCK_TRIP);
        setItinerary([]);
        setLoading(false);
        return;
      }
      
      // TODO: Replace with Supabase query
      const response = await fetch(`/api/trips/${tripId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load trip');
      }

      const trip = await response.json();
      setCurrentTrip(trip);

      // Load itinerary
      await refreshItinerary();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error loading trip:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update trip
  const updateTrip = async (updates: Partial<Trip>) => {
    if (!currentTrip) return;

    try {
      // TODO: Replace with Supabase mutation
      const response = await fetch(`/api/trips/${currentTrip.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update trip');
      }

      const updated = await response.json();
      setCurrentTrip(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error updating trip:', err);
    }
  };

  // Refresh itinerary
  const refreshItinerary = async () => {
    if (!currentTrip) return;

    try {
      // TODO: Replace with Supabase query
      const response = await fetch(`/api/trips/${currentTrip.id}/itinerary`);
      
      if (!response.ok) {
        throw new Error('Failed to load itinerary');
      }

      const items = await response.json();
      setItinerary(items);
    } catch (err) {
      console.error('Error loading itinerary:', err);
    }
  };

  // Add itinerary item
  const addItineraryItem = async (item: Omit<ItineraryItem, 'id' | 'trip_id' | 'created_at'>) => {
    if (!currentTrip) return;

    try {
      // TODO: Replace with Supabase insert
      const response = await fetch(`/api/trips/${currentTrip.id}/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, trip_id: currentTrip.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to add itinerary item');
      }

      const newItem = await response.json();
      setItinerary(prev => [...prev, newItem]);

      // Emit event for optimizer to check conflicts
      window.dispatchEvent(new CustomEvent('itinerary-item-added', { detail: newItem }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error adding itinerary item:', err);
    }
  };

  // Update itinerary item
  const updateItineraryItem = async (itemId: string, updates: Partial<ItineraryItem>) => {
    try {
      // TODO: Replace with Supabase update
      const response = await fetch(`/api/itinerary/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update itinerary item');
      }

      const updated = await response.json();
      setItinerary(prev => prev.map(item => item.id === itemId ? updated : item));

      // Emit event for optimizer
      window.dispatchEvent(new CustomEvent('itinerary-item-updated', { detail: updated }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error updating itinerary item:', err);
    }
  };

  // Remove itinerary item
  const removeItineraryItem = async (itemId: string) => {
    try {
      // TODO: Replace with Supabase delete
      const response = await fetch(`/api/itinerary/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove itinerary item');
      }

      setItinerary(prev => prev.filter(item => item.id !== itemId));

      // Emit event
      window.dispatchEvent(new CustomEvent('itinerary-item-removed', { detail: { id: itemId } }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error removing itinerary item:', err);
    }
  };

  const contextValue: TripContextType = {
    currentTrip,
    itinerary,
    loading,
    error,
    loadTrip,
    updateTrip,
    addItineraryItem,
    updateItineraryItem,
    removeItineraryItem,
    refreshItinerary,
  };

  return (
    <TripContext.Provider value={contextValue}>
      {children}
    </TripContext.Provider>
  );
}

/**
 * Hook to use Trip Context
 * Throws error if used outside TripProvider
 */
export function useTrip() {
  const context = useContext(TripContext);
  
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  
  return context;
}

/**
 * Hook to automatically load trip from URL params
 * Use in pages with :tripId route parameter
 */
export function useTripFromParams() {
  const { tripId } = useParams<{ tripId: string }>();
  const { currentTrip, loadTrip, loading, error } = useTrip();

  useEffect(() => {
    if (tripId && (!currentTrip || currentTrip.id !== tripId)) {
      loadTrip(tripId);
    }
  }, [tripId]);

  return { currentTrip, loading, error };
}