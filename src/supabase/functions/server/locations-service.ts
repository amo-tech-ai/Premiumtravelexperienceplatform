/**
 * Locations Service
 * 
 * Database operations for locations table (events, restaurants, rentals)
 * Uses service_role to bypass RLS restrictions
 */

import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

// ============================================================================
// SUPABASE CLIENT (SERVICE ROLE)
// ============================================================================

const getSupabaseAdmin = () => {
  return createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
  );
};

// ============================================================================
// EVENTS
// ============================================================================

/**
 * Get all events (with optional filters)
 */
export async function getEvents(filters: {
  city?: string;
  event_type?: string;
  date_start?: string;
  date_end?: string;
  search?: string;
} = {}) {
  const supabase = getSupabaseAdmin();
  
  let query = supabase
    .from('locations')
    .select('*')
    .eq('category', 'event')
    .eq('is_active', true)
    .order('event_start_time', { ascending: true });

  // Apply filters
  if (filters.city) {
    query = query.eq('city', filters.city);
  }

  if (filters.event_type) {
    query = query.eq('event_type', filters.event_type);
  }

  if (filters.date_start) {
    query = query.gte('event_start_time', filters.date_start);
  }

  if (filters.date_end) {
    query = query.lte('event_start_time', filters.date_end);
  }

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching events:', error);
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return data || [];
}

/**
 * Get single event by ID
 */
export async function getEvent(eventId: string) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', eventId)
    .eq('category', 'event')
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    throw new Error(`Failed to fetch event: ${error.message}`);
  }

  return data;
}

/**
 * Create new event
 */
export async function createEvent(eventData: any) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('locations')
    .insert({
      ...eventData,
      category: 'event',
      is_active: true,
      source: eventData.source || 'manual',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw new Error(`Failed to create event: ${error.message}`);
  }

  return data;
}

/**
 * Update event
 */
export async function updateEvent(eventId: string, eventData: any) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('locations')
    .update({
      ...eventData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', eventId)
    .eq('category', 'event')
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    throw new Error(`Failed to update event: ${error.message}`);
  }

  return data;
}

/**
 * Delete event (soft delete)
 */
export async function deleteEvent(eventId: string) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('locations')
    .update({ is_active: false })
    .eq('id', eventId)
    .eq('category', 'event');

  if (error) {
    console.error('Error deleting event:', error);
    throw new Error(`Failed to delete event: ${error.message}`);
  }

  return true;
}

// ============================================================================
// RESTAURANTS
// ============================================================================

/**
 * Get all restaurants (with optional filters)
 */
export async function getRestaurants(filters: {
  city?: string;
  cuisine_types?: string[];
  price_level?: number[];
  dietary_options?: string[];
  rating_min?: number;
  open_now?: boolean;
  search?: string;
} = {}) {
  const supabase = getSupabaseAdmin();
  
  let query = supabase
    .from('locations')
    .select('*')
    .eq('category', 'restaurant')
    .eq('is_active', true)
    .order('rating', { ascending: false, nullsFirst: false });

  // Apply filters
  if (filters.city) {
    query = query.eq('city', filters.city);
  }

  if (filters.cuisine_types && filters.cuisine_types.length > 0) {
    query = query.contains('cuisine_types', filters.cuisine_types);
  }

  if (filters.price_level && filters.price_level.length > 0) {
    query = query.in('price_level', filters.price_level);
  }

  if (filters.dietary_options && filters.dietary_options.length > 0) {
    query = query.contains('dietary_options', filters.dietary_options);
  }

  if (filters.rating_min) {
    query = query.gte('rating', filters.rating_min);
  }

  if (filters.open_now) {
    query = query.eq('is_open_now', true);
  }

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching restaurants:', error);
    throw new Error(`Failed to fetch restaurants: ${error.message}`);
  }

  return data || [];
}

/**
 * Get single restaurant by ID
 */
export async function getRestaurant(restaurantId: string) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', restaurantId)
    .eq('category', 'restaurant')
    .single();

  if (error) {
    console.error('Error fetching restaurant:', error);
    throw new Error(`Failed to fetch restaurant: ${error.message}`);
  }

  return data;
}

/**
 * Create new restaurant
 */
export async function createRestaurant(restaurantData: any) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('locations')
    .insert({
      ...restaurantData,
      category: 'restaurant',
      is_active: true,
      source: restaurantData.source || 'manual',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating restaurant:', error);
    throw new Error(`Failed to create restaurant: ${error.message}`);
  }

  return data;
}

/**
 * Update restaurant
 */
export async function updateRestaurant(restaurantId: string, restaurantData: any) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('locations')
    .update({
      ...restaurantData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', restaurantId)
    .eq('category', 'restaurant')
    .select()
    .single();

  if (error) {
    console.error('Error updating restaurant:', error);
    throw new Error(`Failed to update restaurant: ${error.message}`);
  }

  return data;
}

/**
 * Delete restaurant (soft delete)
 */
export async function deleteRestaurant(restaurantId: string) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('locations')
    .update({ is_active: false })
    .eq('id', restaurantId)
    .eq('category', 'restaurant');

  if (error) {
    console.error('Error deleting restaurant:', error);
    throw new Error(`Failed to delete restaurant: ${error.message}`);
  }

  return true;
}

// ============================================================================
// RENTALS
// ============================================================================

/**
 * Get all rentals (with optional filters)
 */
export async function getRentals(filters: {
  city?: string;
  vehicle_type?: string;
  price_min?: number;
  price_max?: number;
  features?: string[];
  search?: string;
} = {}) {
  const supabase = getSupabaseAdmin();
  
  let query = supabase
    .from('locations')
    .select('*')
    .eq('category', 'rental')
    .eq('is_active', true)
    .order('daily_rate', { ascending: true, nullsFirst: false });

  // Apply filters
  if (filters.city) {
    query = query.eq('city', filters.city);
  }

  if (filters.vehicle_type) {
    query = query.eq('vehicle_type', filters.vehicle_type);
  }

  if (filters.price_min) {
    query = query.gte('daily_rate', filters.price_min);
  }

  if (filters.price_max) {
    query = query.lte('daily_rate', filters.price_max);
  }

  if (filters.features && filters.features.length > 0) {
    query = query.contains('rental_features', filters.features);
  }

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,vehicle_type.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching rentals:', error);
    throw new Error(`Failed to fetch rentals: ${error.message}`);
  }

  return data || [];
}

/**
 * Get single rental by ID
 */
export async function getRental(rentalId: string) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', rentalId)
    .eq('category', 'rental')
    .single();

  if (error) {
    console.error('Error fetching rental:', error);
    throw new Error(`Failed to fetch rental: ${error.message}`);
  }

  return data;
}

/**
 * Create new rental
 */
export async function createRental(rentalData: any) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('locations')
    .insert({
      ...rentalData,
      category: 'rental',
      is_active: true,
      source: rentalData.source || 'manual',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating rental:', error);
    throw new Error(`Failed to create rental: ${error.message}`);
  }

  return data;
}

/**
 * Update rental
 */
export async function updateRental(rentalId: string, rentalData: any) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('locations')
    .update({
      ...rentalData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', rentalId)
    .eq('category', 'rental')
    .select()
    .single();

  if (error) {
    console.error('Error updating rental:', error);
    throw new Error(`Failed to update rental: ${error.message}`);
  }

  return data;
}

/**
 * Delete rental (soft delete)
 */
export async function deleteRental(rentalId: string) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('locations')
    .update({ is_active: false })
    .eq('id', rentalId)
    .eq('category', 'rental');

  if (error) {
    console.error('Error deleting rental:', error);
    throw new Error(`Failed to delete rental: ${error.message}`);
  }

  return true;
}

// ============================================================================
// SEARCH (Unified)
// ============================================================================

/**
 * Search across all location categories
 */
export async function searchLocations(
  query: string,
  category?: 'event' | 'restaurant' | 'rental'
) {
  const supabase = getSupabaseAdmin();

  let dbQuery = supabase
    .from('locations')
    .select('*')
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(20);

  if (category) {
    dbQuery = dbQuery.eq('category', category);
  }

  const { data, error } = await dbQuery;

  if (error) {
    console.error('Error searching locations:', error);
    throw new Error(`Failed to search locations: ${error.message}`);
  }

  return data || [];
}
