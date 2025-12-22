/**
 * Trip Service
 * Handles all trip-related business logic and data operations
 */

import { supabase } from '../supabase/client';
import type { Trip, CreateTripInput, UpdateTripInput, TripWithDetails } from './types';

export class TripService {
  /**
   * Get all trips for a user
   */
  async getUserTrips(userId: string): Promise<Trip[]> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[TripService] Error fetching trips:', error);
      throw error;
    }
  }

  /**
   * Get a single trip by ID with full details
   */
  async getTripById(tripId: string): Promise<TripWithDetails> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          days:trip_days(
            *,
            items:trip_items(*)
          )
        `)
        .eq('id', tripId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[TripService] Error fetching trip:', error);
      throw error;
    }
  }

  /**
   * Create a new trip
   */
  async createTrip(input: CreateTripInput): Promise<Trip> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert({
          ...input,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[TripService] Error creating trip:', error);
      throw error;
    }
  }

  /**
   * Update a trip
   */
  async updateTrip(tripId: string, input: UpdateTripInput): Promise<Trip> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tripId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[TripService] Error updating trip:', error);
      throw error;
    }
  }

  /**
   * Delete a trip
   */
  async deleteTrip(tripId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);
      
      if (error) throw error;
    } catch (error) {
      console.error('[TripService] Error deleting trip:', error);
      throw error;
    }
  }

  /**
   * Duplicate a trip
   */
  async duplicateTrip(tripId: string): Promise<Trip> {
    try {
      // Get original trip with details
      const original = await this.getTripById(tripId);
      
      // Create new trip
      const { data: newTrip, error: tripError } = await supabase
        .from('trips')
        .insert({
          title: `${original.title} (Copy)`,
          destination: original.destination,
          start_date: original.start_date,
          end_date: original.end_date,
          budget: original.budget,
          travelers: original.travelers,
          user_id: original.user_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (tripError) throw tripError;
      
      // Copy days and items (if they exist)
      if (original.days && original.days.length > 0) {
        for (const day of original.days) {
          const { data: newDay, error: dayError } = await supabase
            .from('trip_days')
            .insert({
              trip_id: newTrip.id,
              day_number: day.day_number,
              date: day.date,
            })
            .select()
            .single();
          
          if (dayError) throw dayError;
          
          // Copy items
          if (day.items && day.items.length > 0) {
            const itemsToInsert = day.items.map(item => ({
              day_id: newDay.id,
              title: item.title,
              type: item.type,
              time: item.time,
              duration: item.duration,
              cost: item.cost,
              notes: item.notes,
              image_url: item.image_url,
            }));
            
            const { error: itemsError } = await supabase
              .from('trip_items')
              .insert(itemsToInsert);
            
            if (itemsError) throw itemsError;
          }
        }
      }
      
      return newTrip;
    } catch (error) {
      console.error('[TripService] Error duplicating trip:', error);
      throw error;
    }
  }

  /**
   * Search trips
   */
  async searchTrips(userId: string, query: string): Promise<Trip[]> {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .or(`title.ilike.%${query}%,destination.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[TripService] Error searching trips:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const tripService = new TripService();
