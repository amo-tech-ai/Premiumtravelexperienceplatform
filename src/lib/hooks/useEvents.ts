/**
 * useEvents Hook
 * 
 * React hooks for managing events data via server API
 * Uses server endpoints to bypass RLS restrictions
 */

import { useState, useEffect, useCallback } from 'react';
import { serverGet, serverPost, serverPut, serverDelete } from '../api/server';
import type { Event, EventFilters, CreateEventInput, UpdateEventInput } from '../types/locations';

// ============================================================================
// LIST EVENTS
// ============================================================================

export function useEvents(filters?: EventFilters) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params: Record<string, string | undefined> = {};
      
      if (filters?.city) {
        params.city = filters.city;
      }

      if (filters?.event_type) {
        params.event_type = filters.event_type;
      }

      if (filters?.date_range?.start) {
        params.date_start = filters.date_range.start;
      }

      if (filters?.date_range?.end) {
        params.date_end = filters.date_range.end;
      }

      if (filters?.search) {
        params.search = filters.search;
      }

      const data = await serverGet<Event[]>('/events', params);
      setEvents(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch events');
      setError(error);
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const refetch = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch };
}

// ============================================================================
// SINGLE EVENT
// ============================================================================

export function useEvent(eventId: string | undefined) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await serverGet<Event>(`/events/${eventId}`);
      setEvent(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch event');
      setError(error);
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const refetch = useCallback(() => {
    fetchEvent();
  }, [fetchEvent]);

  return { event, loading, error, refetch };
}

// ============================================================================
// CREATE EVENT
// ============================================================================

export function useCreateEvent() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createEvent = useCallback(async (input: CreateEventInput): Promise<Event | null> => {
    try {
      setCreating(true);
      setError(null);

      const event = await serverPost<Event>('/events', input);
      return event;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create event');
      setError(error);
      console.error('Error creating event:', error);
      return null;
    } finally {
      setCreating(false);
    }
  }, []);

  return { createEvent, creating, error };
}

// ============================================================================
// UPDATE EVENT
// ============================================================================

export function useUpdateEvent() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateEvent = useCallback(async (
    eventId: string,
    input: UpdateEventInput
  ): Promise<Event | null> => {
    try {
      setUpdating(true);
      setError(null);

      const event = await serverPut<Event>(`/events/${eventId}`, input);
      return event;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update event');
      setError(error);
      console.error('Error updating event:', error);
      return null;
    } finally {
      setUpdating(false);
    }
  }, []);

  return { updateEvent, updating, error };
}

// ============================================================================
// DELETE EVENT
// ============================================================================

export function useDeleteEvent() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteEvent = useCallback(async (eventId: string): Promise<boolean> => {
    try {
      setDeleting(true);
      setError(null);

      await serverDelete(`/events/${eventId}`);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete event');
      setError(error);
      console.error('Error deleting event:', error);
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  return { deleteEvent, deleting, error };
}

// ============================================================================
// SEARCH EVENTS
// ============================================================================

export function useSearchEvents() {
  const [results, setResults] = useState<Event[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchEvents = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    try {
      setSearching(true);
      setError(null);

      const data = await serverGet<Event[]>('/locations/search', {
        q: query,
        category: 'event',
      });
      
      setResults(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to search events');
      setError(error);
      console.error('Error searching events:', error);
    } finally {
      setSearching(false);
    }
  }, []);

  return { searchEvents, results, searching, error };
}
