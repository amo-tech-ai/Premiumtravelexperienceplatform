/**
 * useRentals Hook
 * 
 * React hooks for managing rentals data via server API
 * Uses server endpoints to bypass RLS restrictions
 */

import { useState, useEffect, useCallback } from 'react';
import { serverGet, serverPost, serverPut, serverDelete } from '../api/server';
import type { Rental, RentalFilters, CreateRentalInput, UpdateRentalInput } from '../types/locations';

// ============================================================================
// LIST RENTALS
// ============================================================================

export function useRentals(filters?: RentalFilters) {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRentals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params: Record<string, string | undefined> = {};
      
      if (filters?.city) {
        params.city = filters.city;
      }

      if (filters?.vehicle_type) {
        params.vehicle_type = filters.vehicle_type;
      }

      if (filters?.price_range?.min !== undefined) {
        params.price_min = String(filters.price_range.min);
      }

      if (filters?.price_range?.max !== undefined) {
        params.price_max = String(filters.price_range.max);
      }

      if (filters?.features && filters.features.length > 0) {
        params.features = filters.features.join(',');
      }

      if (filters?.search) {
        params.search = filters.search;
      }

      const data = await serverGet<Rental[]>('/rentals', params);
      setRentals(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch rentals');
      setError(error);
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const refetch = useCallback(() => {
    fetchRentals();
  }, [fetchRentals]);

  return { rentals, loading, error, refetch };
}

// ============================================================================
// SINGLE RENTAL
// ============================================================================

export function useRental(rentalId: string | undefined) {
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRental = useCallback(async () => {
    if (!rentalId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await serverGet<Rental>(`/rentals/${rentalId}`);
      setRental(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch rental');
      setError(error);
      console.error('Error fetching rental:', error);
    } finally {
      setLoading(false);
    }
  }, [rentalId]);

  useEffect(() => {
    fetchRental();
  }, [fetchRental]);

  const refetch = useCallback(() => {
    fetchRental();
  }, [fetchRental]);

  return { rental, loading, error, refetch };
}

// ============================================================================
// CREATE RENTAL
// ============================================================================

export function useCreateRental() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createRental = useCallback(async (input: CreateRentalInput): Promise<Rental | null> => {
    try {
      setCreating(true);
      setError(null);

      const rental = await serverPost<Rental>('/rentals', input);
      return rental;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create rental');
      setError(error);
      console.error('Error creating rental:', error);
      return null;
    } finally {
      setCreating(false);
    }
  }, []);

  return { createRental, creating, error };
}

// ============================================================================
// UPDATE RENTAL
// ============================================================================

export function useUpdateRental() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateRental = useCallback(async (
    rentalId: string,
    input: UpdateRentalInput
  ): Promise<Rental | null> => {
    try {
      setUpdating(true);
      setError(null);

      const rental = await serverPut<Rental>(`/rentals/${rentalId}`, input);
      return rental;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update rental');
      setError(error);
      console.error('Error updating rental:', error);
      return null;
    } finally {
      setUpdating(false);
    }
  }, []);

  return { updateRental, updating, error };
}

// ============================================================================
// DELETE RENTAL
// ============================================================================

export function useDeleteRental() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteRental = useCallback(async (rentalId: string): Promise<boolean> => {
    try {
      setDeleting(true);
      setError(null);

      await serverDelete(`/rentals/${rentalId}`);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete rental');
      setError(error);
      console.error('Error deleting rental:', error);
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  return { deleteRental, deleting, error };
}

// ============================================================================
// SEARCH RENTALS
// ============================================================================

export function useSearchRentals() {
  const [results, setResults] = useState<Rental[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchRentals = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    try {
      setSearching(true);
      setError(null);

      const data = await serverGet<Rental[]>('/locations/search', {
        q: query,
        category: 'rental',
      });
      
      setResults(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to search rentals');
      setError(error);
      console.error('Error searching rentals:', error);
    } finally {
      setSearching(false);
    }
  }, []);

  return { searchRentals, results, searching, error };
}
