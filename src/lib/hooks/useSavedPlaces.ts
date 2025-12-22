/**
 * useSavedPlaces Hook
 * 
 * React hooks for managing user's saved/favorited places
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/client';
import type { SavedPlace } from '../types/locations';

// ============================================================================
// GET USER'S SAVED PLACES
// ============================================================================

export function useSavedPlaces(userId: string | undefined) {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSavedPlaces = useCallback(async () => {
    if (!userId) {
      setSavedPlaces([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('saved_places')
        .select(`
          *,
          location:locations(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setSavedPlaces((data as SavedPlace[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch saved places'));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSavedPlaces();
  }, [fetchSavedPlaces]);

  return { savedPlaces, loading, error, refetch: fetchSavedPlaces };
}

// ============================================================================
// CHECK IF PLACE IS SAVED
// ============================================================================

export function useIsSaved(locationId: string | undefined, userId: string | undefined) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!locationId || !userId) {
      setIsSaved(false);
      return;
    }

    const checkSaved = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('saved_places')
          .select('id')
          .eq('user_id', userId)
          .eq('location_id', locationId)
          .maybeSingle();

        if (error) throw error;

        setIsSaved(!!data);
      } catch (err) {
        console.error('Failed to check saved status:', err);
        setIsSaved(false);
      } finally {
        setLoading(false);
      }
    };

    checkSaved();
  }, [locationId, userId]);

  return { isSaved, loading };
}

// ============================================================================
// SAVE A PLACE
// ============================================================================

export function useSavePlace() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const savePlace = useCallback(
    async (
      locationId: string,
      userId: string,
      options?: {
        collection_name?: string;
        is_favorite?: boolean;
        notes?: string;
        tags?: string[];
      }
    ): Promise<SavedPlace | null> => {
      try {
        setSaving(true);
        setError(null);

        const { data, error: saveError } = await supabase
          .from('saved_places')
          .insert({
            user_id: userId,
            location_id: locationId,
            collection_name: options?.collection_name || 'default',
            is_favorite: options?.is_favorite || false,
            notes: options?.notes,
            tags: options?.tags || [],
          })
          .select()
          .single();

        if (saveError) throw saveError;

        return data as SavedPlace;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to save place');
        setError(error);
        return null;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  return { savePlace, saving, error };
}

// ============================================================================
// UNSAVE A PLACE
// ============================================================================

export function useUnsavePlace() {
  const [unsaving, setUnsaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const unsavePlace = useCallback(async (locationId: string, userId: string): Promise<boolean> => {
    try {
      setUnsaving(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('saved_places')
        .delete()
        .eq('user_id', userId)
        .eq('location_id', locationId);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to unsave place');
      setError(error);
      return false;
    } finally {
      setUnsaving(false);
    }
  }, []);

  return { unsavePlace, unsaving, error };
}

// ============================================================================
// TOGGLE SAVE/UNSAVE
// ============================================================================

export function useToggleSave() {
  const { savePlace, saving: savingPlace } = useSavePlace();
  const { unsavePlace, unsaving: unsavingPlace } = useUnsavePlace();

  const toggleSave = useCallback(
    async (locationId: string, userId: string, currentlySaved: boolean): Promise<boolean> => {
      if (currentlySaved) {
        return await unsavePlace(locationId, userId);
      } else {
        const result = await savePlace(locationId, userId);
        return !!result;
      }
    },
    [savePlace, unsavePlace]
  );

  return {
    toggleSave,
    loading: savingPlace || unsavingPlace,
  };
}

// ============================================================================
// UPDATE SAVED PLACE (notes, tags, rating, etc.)
// ============================================================================

export function useUpdateSavedPlace() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateSavedPlace = useCallback(
    async (
      savedPlaceId: string,
      updates: {
        notes?: string;
        tags?: string[];
        user_rating?: 1 | 2 | 3 | 4 | 5;
        visited?: boolean;
        visit_date?: string;
        is_favorite?: boolean;
      }
    ): Promise<SavedPlace | null> => {
      try {
        setUpdating(true);
        setError(null);

        const { data, error: updateError } = await supabase
          .from('saved_places')
          .update(updates)
          .eq('id', savedPlaceId)
          .select()
          .single();

        if (updateError) throw updateError;

        return data as SavedPlace;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update saved place');
        setError(error);
        return null;
      } finally {
        setUpdating(false);
      }
    },
    []
  );

  return { updateSavedPlace, updating, error };
}

// ============================================================================
// GET FAVORITES ONLY
// ============================================================================

export function useFavorites(userId: string | undefined) {
  const [favorites, setFavorites] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('saved_places')
          .select(`
            *,
            location:locations(*)
          `)
          .eq('user_id', userId)
          .eq('is_favorite', true)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setFavorites((data as SavedPlace[]) || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch favorites'));
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  return { favorites, loading, error };
}
