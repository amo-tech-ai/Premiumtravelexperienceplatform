/**
 * DB Locations Service
 * 
 * Service for managing shared location entities (physical places)
 * Used by events, restaurants, rentals to reference coordinates/addresses
 */

import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

// ============================================================================
// TYPES
// ============================================================================

export interface Location {
  id: string;
  name: string;
  area: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  place_id: string | null;
  source: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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
// GET ALL LOCATIONS
// ============================================================================

export async function getAll(filters?: {
  search?: string;
  area?: string;
}): Promise<Location[]> {
  try {
    const supabase = getSupabaseAdmin();
    
    let query = supabase
      .from('locations')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true });
    
    // Apply filters
    if (filters?.area) {
      query = query.eq('area', filters.area);
    }
    
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
    
    return data as Location[];
  } catch (error) {
    console.error('Error in getAll locations:', error);
    return [];
  }
}

// ============================================================================
// GET SINGLE LOCATION
// ============================================================================

export async function getById(id: string): Promise<Location | null> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching location:', error);
      throw error;
    }
    
    return data as Location;
  } catch (error) {
    console.error('Error in getById location:', error);
    return null;
  }
}

// ============================================================================
// CREATE LOCATION
// ============================================================================

export async function create(data: Partial<Location>): Promise<Location> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: created, error } = await supabase
      .from('locations')
      .insert(data)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating location:', error);
      throw error;
    }
    
    console.log(`✅ Created location: ${created.name}`);
    return created as Location;
  } catch (error) {
    console.error('Error in create location:', error);
    throw error;
  }
}

// ============================================================================
// UPDATE LOCATION
// ============================================================================

export async function update(id: string, data: Partial<Location>): Promise<Location | null> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: updated, error } = await supabase
      .from('locations')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error updating location:', error);
      throw error;
    }
    
    console.log(`✅ Updated location: ${updated.name}`);
    return updated as Location;
  } catch (error) {
    console.error('Error in update location:', error);
    return null;
  }
}

// ============================================================================
// SOFT DELETE LOCATION
// ============================================================================

export async function softDelete(id: string): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { error } = await supabase
      .from('locations')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error('Error soft deleting location:', error);
      return false;
    }
    
    console.log(`✅ Soft deleted location: ${id}`);
    return true;
  } catch (error) {
    console.error('Error in softDelete location:', error);
    return false;
  }
}

// ============================================================================
// FIND OR CREATE LOCATION (Helper for imports)
// ============================================================================

export async function findOrCreate(data: {
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  place_id?: string;
  area?: string;
  source?: string;
}): Promise<Location> {
  try {
    const supabase = getSupabaseAdmin();
    
    // Try to find existing by place_id or exact name+address
    if (data.place_id) {
      const { data: existing } = await supabase
        .from('locations')
        .select('*')
        .eq('place_id', data.place_id)
        .is('deleted_at', null)
        .single();
      
      if (existing) {
        console.log(`📍 Found existing location: ${existing.name}`);
        return existing as Location;
      }
    }
    
    // Create new location
    return await create(data);
  } catch (error) {
    console.error('Error in findOrCreate location:', error);
    throw error;
  }
}
