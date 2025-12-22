/**
 * useRestaurants Hook
 * 
 * React hooks for managing restaurants data via server API
 * Uses server endpoints to bypass RLS restrictions
 */

import { useState, useEffect, useCallback } from 'react';
import { serverGet, serverPost, serverPut, serverDelete } from '../api/server';
import type { Restaurant, RestaurantFilters, CreateRestaurantInput, UpdateRestaurantInput } from '../types/locations';

// ============================================================================
// LIST RESTAURANTS
// ============================================================================

export function useRestaurants(filters?: RestaurantFilters) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params: Record<string, string | undefined> = {};
      
      if (filters?.city) {
        params.city = filters.city;
      }

      if (filters?.cuisine_types && filters.cuisine_types.length > 0) {
        params.cuisine_types = filters.cuisine_types.join(',');
      }

      if (filters?.price_level && filters.price_level.length > 0) {
        params.price_level = filters.price_level.join(',');
      }

      if (filters?.dietary_options && filters.dietary_options.length > 0) {
        params.dietary_options = filters.dietary_options.join(',');
      }

      if (filters?.rating_min !== undefined) {
        params.rating_min = String(filters.rating_min);
      }

      if (filters?.open_now !== undefined) {
        params.open_now = String(filters.open_now);
      }

      if (filters?.search) {
        params.search = filters.search;
      }

      const data = await serverGet<Restaurant[]>('/restaurants', params);
      setRestaurants(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch restaurants');
      setError(error);
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const refetch = useCallback(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return { restaurants, loading, error, refetch };
}

// ============================================================================
// SINGLE RESTAURANT
// ============================================================================

export function useRestaurant(restaurantId: string | undefined) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRestaurant = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await serverGet<Restaurant>(`/restaurants/${restaurantId}`);
      setRestaurant(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch restaurant');
      setError(error);
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  const refetch = useCallback(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  return { restaurant, loading, error, refetch };
}

// ============================================================================
// CREATE RESTAURANT
// ============================================================================

export function useCreateRestaurant() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createRestaurant = useCallback(async (input: CreateRestaurantInput): Promise<Restaurant | null> => {
    try {
      setCreating(true);
      setError(null);

      const restaurant = await serverPost<Restaurant>('/restaurants', input);
      return restaurant;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create restaurant');
      setError(error);
      console.error('Error creating restaurant:', error);
      return null;
    } finally {
      setCreating(false);
    }
  }, []);

  return { createRestaurant, creating, error };
}

// ============================================================================
// UPDATE RESTAURANT
// ============================================================================

export function useUpdateRestaurant() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateRestaurant = useCallback(async (
    restaurantId: string,
    input: UpdateRestaurantInput
  ): Promise<Restaurant | null> => {
    try {
      setUpdating(true);
      setError(null);

      const restaurant = await serverPut<Restaurant>(`/restaurants/${restaurantId}`, input);
      return restaurant;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update restaurant');
      setError(error);
      console.error('Error updating restaurant:', error);
      return null;
    } finally {
      setUpdating(false);
    }
  }, []);

  return { updateRestaurant, updating, error };
}

// ============================================================================
// DELETE RESTAURANT
// ============================================================================

export function useDeleteRestaurant() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteRestaurant = useCallback(async (restaurantId: string): Promise<boolean> => {
    try {
      setDeleting(true);
      setError(null);

      await serverDelete(`/restaurants/${restaurantId}`);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete restaurant');
      setError(error);
      console.error('Error deleting restaurant:', error);
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  return { deleteRestaurant, deleting, error };
}

// ============================================================================
// SEARCH RESTAURANTS
// ============================================================================

export function useSearchRestaurants() {
  const [results, setResults] = useState<Restaurant[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchRestaurants = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    try {
      setSearching(true);
      setError(null);

      const data = await serverGet<Restaurant[]>('/locations/search', {
        q: query,
        category: 'restaurant',
      });
      
      setResults(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to search restaurants');
      setError(error);
      console.error('Error searching restaurants:', error);
    } finally {
      setSearching(false);
    }
  }, []);

  return { searchRestaurants, results, searching, error };
}
