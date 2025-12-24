/**
 * DB Restaurants Service
 * 
 * Uses Supabase locations table with category='restaurant'
 * All queries filter by category to get only restaurants
 */

import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

// ============================================================================
// TYPES
// ============================================================================

export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  category: 'restaurant';
  subcategory: string | null;
  tags: string[];
  
  // Location
  address: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  
  // Restaurant-specific
  cuisine_types: string[] | null;
  price_level: number | null;
  dietary_options: string[] | null;
  ambiance: string[] | null;
  
  // Media
  primary_image_url: string | null;
  images: any | null;
  
  // Details
  details: any | null;
  
  // Ratings
  rating: number | null;
  rating_count: number | null;
  
  // Hours
  hours_of_operation: any | null;
  is_open_now: boolean | null;
  
  // Status
  is_active: boolean;
  
  // Metadata
  created_at: string;
  updated_at: string;
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
}): Promise<Restaurant[]> {
  try {
    const supabase = getSupabaseAdmin();
    
    let query = supabase
      .from('locations')
      .select('*')
      .eq('category', 'restaurant')
      .eq('is_active', true)
      .order('rating', { ascending: false, nullsFirst: false });
    
    // Apply filters
    if (filters?.cuisine) {
      query = query.contains('cuisine_types', [filters.cuisine]);
    }
    
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    
    if (filters?.area) {
      query = query.eq('city', filters.area);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching restaurants:', JSON.stringify(error));
      throw error;
    }
    
    console.log(`✅ Fetched ${data?.length || 0} restaurants from locations table`);
    return (data as Restaurant[]) || [];
  } catch (error) {
    console.error('Error in getAll restaurants:', JSON.stringify(error));
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
      .from('locations')
      .select('*')
      .eq('id', id)
      .eq('category', 'restaurant')
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching restaurant:', JSON.stringify(error));
      throw error;
    }
    
    return data as Restaurant;
  } catch (error) {
    console.error('Error in getById restaurant:', JSON.stringify(error));
    return null;
  }
}

// ============================================================================
// CREATE RESTAURANT
// ============================================================================

export async function create(data: Partial<Restaurant>): Promise<Restaurant> {
  try {
    const supabase = getSupabaseAdmin();
    
    const restaurantData = {
      ...data,
      category: 'restaurant' as const,
      source: data.details?.source || 'manual',
      is_active: true,
    };
    
    const { data: created, error } = await supabase
      .from('locations')
      .insert(restaurantData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating restaurant:', JSON.stringify(error));
      throw error;
    }
    
    console.log(`✅ Created restaurant: ${created.name}`);
    return created as Restaurant;
  } catch (error) {
    console.error('Error in create restaurant:', JSON.stringify(error));
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
      .from('locations')
      .update(data)
      .eq('id', id)
      .eq('category', 'restaurant')
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error updating restaurant:', JSON.stringify(error));
      throw error;
    }
    
    console.log(`✅ Updated restaurant: ${updated.name}`);
    return updated as Restaurant;
  } catch (error) {
    console.error('Error in update restaurant:', JSON.stringify(error));
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
      .from('locations')
      .update({ is_active: false })
      .eq('id', id)
      .eq('category', 'restaurant');
    
    if (error) {
      console.error('Error soft deleting restaurant:', JSON.stringify(error));
      return false;
    }
    
    console.log(`✅ Soft deleted restaurant: ${id}`);
    return true;
  } catch (error) {
    console.error('Error in softDelete restaurant:', JSON.stringify(error));
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
      .from('locations')
      .select('*')
      .eq('category', 'restaurant')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('rating', { ascending: false, nullsFirst: false });
    
    if (error) {
      console.error('Error searching restaurants:', JSON.stringify(error));
      return [];
    }
    
    return (data as Restaurant[]) || [];
  } catch (error) {
    console.error('Error in search restaurants:', JSON.stringify(error));
    return [];
  }
}
