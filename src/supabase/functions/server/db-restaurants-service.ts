/**
 * DB Restaurants Service
 * 
 * Supabase-first implementation for restaurants table
 * All queries use Postgres with proper joins to locations
 */

import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

// ============================================================================
// TYPES
// ============================================================================

export interface Restaurant {
  id: string;
  location_id: string | null;
  name: string;
  description: string | null;
  cuisine: string | null;
  price_tier: string | null;
  rating: number | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Joined location data
  location?: {
    id: string;
    name: string;
    area: string | null;
    address: string | null;
    lat: number | null;
    lng: number | null;
  } | null;
}

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

function getSupabaseAdmin() {
  return createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
  );
}

// ============================================================================
// GET ALL RESTAURANTS
// ============================================================================

export async function getAll(filters?: {
  search?: string;
  cuisine?: string;
  area?: string;
  minRating?: number;
}): Promise<Restaurant[]> {
  try {
    const supabase = getSupabaseAdmin();
    
    let query = supabase
      .from('restaurants')
      .select(`
        *,
        location:locations(id, name, area, address, lat, lng)
      `)
      .is('deleted_at', null)
      .order('rating', { ascending: false, nullsFirst: false });
    
    // Apply filters
    if (filters?.cuisine) {
      query = query.eq('cuisine', filters.cuisine);
    }
    
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }
    
    if (filters?.area) {
      query = query.eq('location.area', filters.area);
    }
    
    if (filters?.minRating) {
      query = query.gte('rating', filters.minRating);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
    
    return data as Restaurant[];
  } catch (error) {
    console.error('Error in getAll restaurants:', error);
    return [];
  }
}

// ============================================================================
// GET SINGLE RESTAURANT
// ============================================================================

export async function getById(id: string): Promise<Restaurant | null> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        location:locations(id, name, area, address, lat, lng)
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching restaurant:', error);
      throw error;
    }
    
    return data as Restaurant;
  } catch (error) {
    console.error('Error in getById restaurant:', error);
    return null;
  }
}

// ============================================================================
// CREATE RESTAURANT
// ============================================================================

export async function create(data: Partial<Restaurant>): Promise<Restaurant> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: created, error } = await supabase
      .from('restaurants')
      .insert(data)
      .select(`
        *,
        location:locations(id, name, area, address, lat, lng)
      `)
      .single();
    
    if (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
    
    console.log(`✅ Created restaurant: ${created.name}`);
    return created as Restaurant;
  } catch (error) {
    console.error('Error in create restaurant:', error);
    throw error;
  }
}

// ============================================================================
// UPDATE RESTAURANT
// ============================================================================

export async function update(id: string, data: Partial<Restaurant>): Promise<Restaurant | null> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: updated, error } = await supabase
      .from('restaurants')
      .update(data)
      .eq('id', id)
      .select(`
        *,
        location:locations(id, name, area, address, lat, lng)
      `)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error updating restaurant:', error);
      throw error;
    }
    
    console.log(`✅ Updated restaurant: ${updated.name}`);
    return updated as Restaurant;
  } catch (error) {
    console.error('Error in update restaurant:', error);
    return null;
  }
}

// ============================================================================
// SOFT DELETE RESTAURANT
// ============================================================================

export async function softDelete(id: string): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { error } = await supabase
      .from('restaurants')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error('Error soft deleting restaurant:', error);
      return false;
    }
    
    console.log(`✅ Soft deleted restaurant: ${id}`);
    return true;
  } catch (error) {
    console.error('Error in softDelete restaurant:', error);
    return false;
  }
}

// ============================================================================
// SEARCH RESTAURANTS
// ============================================================================

export async function search(query: string): Promise<Restaurant[]> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        location:locations(id, name, area, address, lat, lng)
      `)
      .is('deleted_at', null)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,cuisine.ilike.%${query}%`)
      .order('rating', { ascending: false, nullsFirst: false });
    
    if (error) {
      console.error('Error searching restaurants:', error);
      return [];
    }
    
    return data as Restaurant[];
  } catch (error) {
    console.error('Error in search restaurants:', error);
    return [];
  }
}
