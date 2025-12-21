/**
 * useTrips Hook
 * 
 * Production-ready React hook for trip management with:
 * - Automatic data fetching
 * - Loading states
 * - Error handling
 * - Optimistic updates
 * - Cache management
 */

import { useState, useEffect, useCallback } from 'react';
import { getTrips, getTrip, createTrip, updateTrip, deleteTrip } from '../lib/api';
import type { Trip, TripWithItems, CreateTripRequest, UpdateTripRequest } from '../lib/api';

interface UseTripsReturn {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createTrip: (data: CreateTripRequest) => Promise<Trip | null>;
  updateTrip: (tripId: string, data: UpdateTripRequest) => Promise<Trip | null>;
  deleteTrip: (tripId: string) => Promise<boolean>;
}

/**
 * Hook for managing user's trips
 */
export function useTrips(): UseTripsReturn {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrips();
      setTrips(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trips');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const create = useCallback(
    async (data: CreateTripRequest): Promise<Trip | null> => {
      try {
        setError(null);
        const newTrip = await createTrip(data);
        
        // Optimistic update
        setTrips((prev) => [newTrip, ...prev]);
        
        return newTrip;
      } catch (err: any) {
        setError(err.message || 'Failed to create trip');
        console.error('Error creating trip:', err);
        return null;
      }
    },
    []
  );

  const update = useCallback(
    async (tripId: string, data: UpdateTripRequest): Promise<Trip | null> => {
      try {
        setError(null);
        
        // Optimistic update
        setTrips((prev) =>
          prev.map((trip) =>
            trip.id === tripId ? { ...trip, ...data } : trip
          )
        );
        
        const updatedTrip = await updateTrip(tripId, data);
        
        // Update with server response
        setTrips((prev) =>
          prev.map((trip) => (trip.id === tripId ? updatedTrip : trip))
        );
        
        return updatedTrip;
      } catch (err: any) {
        setError(err.message || 'Failed to update trip');
        console.error('Error updating trip:', err);
        
        // Revert optimistic update
        await fetchTrips();
        
        return null;
      }
    },
    [fetchTrips]
  );

  const remove = useCallback(
    async (tripId: string): Promise<boolean> => {
      try {
        setError(null);
        
        // Optimistic update
        setTrips((prev) => prev.filter((trip) => trip.id !== tripId));
        
        await deleteTrip(tripId);
        
        return true;
      } catch (err: any) {
        setError(err.message || 'Failed to delete trip');
        console.error('Error deleting trip:', err);
        
        // Revert optimistic update
        await fetchTrips();
        
        return false;
      }
    },
    [fetchTrips]
  );

  return {
    trips,
    loading,
    error,
    refetch: fetchTrips,
    createTrip: create,
    updateTrip: update,
    deleteTrip: remove,
  };
}

interface UseTripReturn {
  trip: TripWithItems | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for managing a single trip with items
 */
export function useTrip(tripId: string | null): UseTripReturn {
  const [trip, setTrip] = useState<TripWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrip = useCallback(async () => {
    if (!tripId) {
      setTrip(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getTrip(tripId);
      setTrip(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trip');
      console.error('Error fetching trip:', err);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  return {
    trip,
    loading,
    error,
    refetch: fetchTrip,
  };
}
