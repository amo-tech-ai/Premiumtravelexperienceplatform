/**
 * DB Events Service
 * 
 * Supabase-first implementation for events table
 * All queries use Postgres with proper joins to locations
 */

import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

// ============================================================================
// TYPES
// ============================================================================

export interface Event {
  id: string;
  location_id: string | null;
  name: string;
  description: string | null;
  category: string | null;
  price_tier: string | null;
  rating: number | null;
  start_time: string | null;
  end_time: string | null;
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
// GET ALL EVENTS
// ============================================================================

export async function getAll(filters?: {
  search?: string;
  category?: string;
  area?: string;
}): Promise<Event[]> {
  try {
    const supabase = getSupabaseAdmin();
    
    let query = supabase
      .from('events')
      .select(`
        *,
        location:locations(id, name, area, address, lat, lng)
      `)
      .is('deleted_at', null)
      .order('start_time', { ascending: true });
    
    // Apply filters
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }
    
    if (filters?.area) {
      query = query.eq('location.area', filters.area);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
    
    return data as Event[];
  } catch (error) {
    console.error('Error in getAll events:', error);
    return [];
  }
}

// ============================================================================
// GET SINGLE EVENT
// ============================================================================

export async function getById(id: string): Promise<Event | null> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        location:locations(id, name, area, address, lat, lng)
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching event:', error);
      throw error;
    }
    
    return data as Event;
  } catch (error) {
    console.error('Error in getById event:', error);
    return null;
  }
}

// ============================================================================
// CREATE EVENT
// ============================================================================

export async function create(data: Partial<Event>): Promise<Event> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: created, error } = await supabase
      .from('events')
      .insert(data)
      .select(`
        *,
        location:locations(id, name, area, address, lat, lng)
      `)
      .single();
    
    if (error) {
      console.error('Error creating event:', error);
      throw error;
    }
    
    console.log(`✅ Created event: ${created.name}`);
    return created as Event;
  } catch (error) {
    console.error('Error in create event:', error);
    throw error;
  }
}

// ============================================================================
// UPDATE EVENT
// ============================================================================

export async function update(id: string, data: Partial<Event>): Promise<Event | null> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: updated, error } = await supabase
      .from('events')
      .update(data)
      .eq('id', id)
      .select(`
        *,
        location:locations(id, name, area, address, lat, lng)
      `)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error updating event:', error);
      throw error;
    }
    
    console.log(`✅ Updated event: ${updated.name}`);
    return updated as Event;
  } catch (error) {
    console.error('Error in update event:', error);
    return null;
  }
}

// ============================================================================
// SOFT DELETE EVENT
// ============================================================================

export async function softDelete(id: string): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { error } = await supabase
      .from('events')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error('Error soft deleting event:', error);
      return false;
    }
    
    console.log(`✅ Soft deleted event: ${id}`);
    return true;
  } catch (error) {
    console.error('Error in softDelete event:', error);
    return false;
  }
}

// ============================================================================
// SEARCH EVENTS
// ============================================================================

export async function search(query: string): Promise<Event[]> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        location:locations(id, name, area, address, lat, lng)
      `)
      .is('deleted_at', null)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error searching events:', error);
      return [];
    }
    
    return data as Event[];
  } catch (error) {
    console.error('Error in search events:', error);
    return [];
  }
}
