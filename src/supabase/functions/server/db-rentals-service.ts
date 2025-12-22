/**
 * DB Rentals Service
 * 
 * Supabase-first implementation for rentals table
 * All queries use Postgres with proper joins to locations
 */

import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

// ============================================================================
// TYPES
// ============================================================================

export interface Rental {
  id: string;
  location_id: string | null;
  name: string;
  description: string | null;
  rental_type: string | null; // car/scooter/stay
  price_amount: number | null;
  price_unit: string | null; // per_day/per_night
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
// GET ALL RENTALS
// ============================================================================

export async function getAll(filters?: {
  search?: string;
  rental_type?: string;
  area?: string;
  maxPrice?: number;
}): Promise<Rental[]> {
  try {
    const supabase = getSupabaseAdmin();
    
    let query = supabase
      .from('rentals')
      .select(`
        *,
        location:locations(id, name, area, address, lat, lng)
      `)
      .is('deleted_at', null)
      .order('price_amount', { ascending: true, nullsFirst: false });
    
    // Apply filters
    if (filters?.rental_type) {
      query = query.eq('rental_type', filters.rental_type);
    }
    
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }
    
    if (filters?.area) {
      query = query.eq('location.area', filters.area);
    }
    
    if (filters?.maxPrice) {
      query = query.lte('price_amount', filters.maxPrice);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching rentals:', error);
      throw error;
    }
    
    return data as Rental[];
  } catch (error) {
    console.error('Error in getAll rentals:', error);
    return [];
  }
}

// ============================================================================
// GET SINGLE RENTAL
// ============================================================================

export async function getById(id: string): Promise<Rental | null> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('rentals')
      .select(`
        *,
        location:locations(id, name, area, address, lat, lng)
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching rental:', error);
      throw error;
    }
    
    return data as Rental;
  } catch (error) {
    console.error('Error in getById rental:', error);
    return null;
  }
}

// ============================================================================
// CREATE RENTAL
// ============================================================================

export async function create(data: Partial<Rental>): Promise<Rental> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: created, error } = await supabase
      .from('rentals')
      .insert(data)
      .select(`
        *,
        location:locations(id, name, area, address, lat, lng)
      `)
      .single();
    
    if (error) {
      console.error('Error creating rental:', error);
      throw error;
    }
    
    console.log(`✅ Created rental: ${created.name}`);
    return created as Rental;
  } catch (error) {
    console.error('Error in create rental:', error);
    throw error;
  }
}

// ============================================================================
// UPDATE RENTAL
// ============================================================================

export async function update(id: string, data: Partial<Rental>): Promise<Rental | null> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: updated, error } = await supabase
      .from('rentals')
      .update(data)
      .eq('id', id)
      .select(`
        *,
        location:locations(id, name, area, address, lat, lng)
      `)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error updating rental:', error);
      throw error;
    }
    
    console.log(`✅ Updated rental: ${updated.name}`);
    return updated as Rental;
  } catch (error) {
    console.error('Error in update rental:', error);
    return null;
  }
}

// ============================================================================
// SOFT DELETE RENTAL
// ============================================================================

export async function softDelete(id: string): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { error } = await supabase
      .from('rentals')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error('Error soft deleting rental:', error);
      return false;
    }
    
    console.log(`✅ Soft deleted rental: ${id}`);
    return true;
  } catch (error) {
    console.error('Error in softDelete rental:', error);
    return false;
  }
}

// ============================================================================
// SEARCH RENTALS
// ============================================================================

export async function search(query: string): Promise<Rental[]> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('rentals')
      .select(`
        *,
        location:locations(id, name, area, address, lat, lng)
      `)
      .is('deleted_at', null)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,rental_type.ilike.%${query}%`)
      .order('price_amount', { ascending: true, nullsFirst: false });
    
    if (error) {
      console.error('Error searching rentals:', error);
      return [];
    }
    
    return data as Rental[];
  } catch (error) {
    console.error('Error in search rentals:', error);
    return [];
  }
}
