import { supabase, getCurrentUser } from '../client';
import type { Trip, InsertTrip, UpdateTrip, ItineraryDay, ItineraryItem } from '../types';

/**
 * Trip CRUD Operations
 * All functions include error handling and respect RLS policies
 */

// Helper to add days between dates
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Helper to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get all trips for current user
 */
export async function getTrips(): Promise<{ data: Trip[] | null; error: Error | null }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching trips:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Get single trip by ID with all days and items
 */
export async function getTripById(tripId: string): Promise<{ 
  data: (Trip & { days: (ItineraryDay & { items: ItineraryItem[] })[] }) | null; 
  error: Error | null 
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    // First get the trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .eq('user_id', user.id)
      .single();

    if (tripError) throw tripError;
    if (!trip) return { data: null, error: new Error('Trip not found') };

    // Get all days for this trip
    const { data: days, error: daysError } = await supabase
      .from('itinerary_days')
      .select('*')
      .eq('trip_id', tripId)
      .order('day_number', { ascending: true });

    if (daysError) throw daysError;

    // Get all items for each day
    const daysWithItems = await Promise.all(
      (days || []).map(async (day) => {
        const { data: items, error: itemsError } = await supabase
          .from('itinerary_items')
          .select('*')
          .eq('day_id', day.id)
          .order('order_index', { ascending: true });

        if (itemsError) throw itemsError;

        return { ...day, items: items || [] };
      })
    );

    return { data: { ...trip, days: daysWithItems }, error: null };
  } catch (error) {
    console.error('Error fetching trip:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Create new trip with auto-generated days
 */
export async function createTrip(tripData: Omit<InsertTrip, 'user_id'>): Promise<{ 
  data: Trip | null; 
  error: Error | null 
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    // Create trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert({
        ...tripData,
        user_id: user.id,
      })
      .select()
      .single();

    if (tripError) throw tripError;
    if (!trip) return { data: null, error: new Error('Failed to create trip') };

    // Auto-create days based on date range
    const startDate = new Date(tripData.start_date);
    const endDate = new Date(tripData.end_date);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const days = Array.from({ length: daysDiff }, (_, i) => ({
      trip_id: trip.id,
      day_number: i + 1,
      date: formatDate(addDays(startDate, i)),
      title: `Day ${i + 1}`,
    }));

    const { error: daysError } = await supabase
      .from('itinerary_days')
      .insert(days);

    if (daysError) {
      console.error('Error creating days:', daysError);
      // Don't fail the whole operation, days can be added later
    }

    return { data: trip, error: null };
  } catch (error) {
    console.error('Error creating trip:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Update trip details
 */
export async function updateTrip(tripId: string, updates: UpdateTrip): Promise<{ 
  data: Trip | null; 
  error: Error | null 
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const { data, error } = await supabase
      .from('trips')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tripId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating trip:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Delete trip (cascades to days and items via database foreign keys)
 */
export async function deleteTrip(tripId: string): Promise<{ 
  error: Error | null 
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId)
      .eq('user_id', user.id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error deleting trip:', error);
    return { error: error as Error };
  }
}

/**
 * Update trip budget spent (called after adding/removing costs)
 */
export async function updateBudgetSpent(tripId: string, amount: number): Promise<{ 
  error: Error | null 
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    // Get current budget_spent
    const { data: trip } = await supabase
      .from('trips')
      .select('budget_spent')
      .eq('id', tripId)
      .single();

    if (!trip) return { error: new Error('Trip not found') };

    const newBudgetSpent = (trip.budget_spent || 0) + amount;

    const { error } = await supabase
      .from('trips')
      .update({ 
        budget_spent: newBudgetSpent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tripId)
      .eq('user_id', user.id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Error updating budget:', error);
    return { error: error as Error };
  }
}
