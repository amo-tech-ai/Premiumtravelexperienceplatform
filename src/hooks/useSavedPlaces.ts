/**
 * useSavedPlaces Hook
 * 
 * React hook for managing saved places
 */

import { useState, useEffect, useCallback } from 'react';
import { getSavedPlaces, savePlace, unsavePlace } from '../lib/api';
import type { SavedPlace, SavePlaceRequest } from '../lib/api';

interface UseSavedPlacesReturn {
  places: SavedPlace[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  savePlace: (data: SavePlaceRequest) => Promise<SavedPlace | null>;
  unsavePlace: (placeId: string) => Promise<boolean>;
  isPlaceSaved: (placeId: string) => boolean;
}

/**
 * Hook for managing saved places
 */
export function useSavedPlaces(): UseSavedPlacesReturn {
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSavedPlaces();
      setPlaces(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch saved places');
      console.error('Error fetching saved places:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const save = useCallback(
    async (data: SavePlaceRequest): Promise<SavedPlace | null> => {
      try {
        setError(null);
        const newPlace = await savePlace(data);
        
        // Optimistic update
        setPlaces((prev) => [newPlace, ...prev]);
        
        return newPlace;
      } catch (err: any) {
        setError(err.message || 'Failed to save place');
        console.error('Error saving place:', err);
        return null;
      }
    },
    []
  );

  const unsave = useCallback(
    async (placeId: string): Promise<boolean> => {
      try {
        setError(null);
        
        // Optimistic update
        setPlaces((prev) => prev.filter((place) => place.place_id !== placeId));
        
        await unsavePlace(placeId);
        
        return true;
      } catch (err: any) {
        setError(err.message || 'Failed to unsave place');
        console.error('Error unsaving place:', err);
        
        // Revert optimistic update
        await fetchPlaces();
        
        return false;
      }
    },
    [fetchPlaces]
  );

  const isSaved = useCallback(
    (placeId: string): boolean => {
      return places.some((place) => place.place_id === placeId);
    },
    [places]
  );

  return {
    places,
    loading,
    error,
    refetch: fetchPlaces,
    savePlace: save,
    unsavePlace: unsave,
    isPlaceSaved: isSaved,
  };
}
