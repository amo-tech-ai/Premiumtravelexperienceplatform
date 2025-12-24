/**
 * DB Events Service
 * 
 * Uses Supabase locations table with category='event'
 * All queries filter by category to get only events
 */

import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

// ============================================================================
// TYPES
// ============================================================================

export interface Event {
  id: string;
  name: string;
  description: string | null;
  category: 'event';
  subcategory: string | null;
  tags: string[];
  
  // Location
  address: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  
  // Event-specific
  event_start_time: string | null;
  event_end_time: string | null;
  event_type: string | null;
  ticket_url: string | null;
  
  // Media
  primary_image_url: string | null;
  images: any | null;
  
  // Details
  details: any | null;
  
  // Ratings
  rating: number | null;
  rating_count: number | null;
  
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
      .from('locations')
      .select('*')
      .eq('category', 'event')
      .eq('is_active', true)
      .order('event_start_time', { ascending: true });
    
    // Apply filters
    if (filters?.category) {
      query = query.eq('event_type', filters.category);
    }
    
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    
    if (filters?.area) {
      query = query.eq('city', filters.area);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching events:', JSON.stringify(error));
      throw error;
    }
    
    console.log(`✅ Fetched ${data?.length || 0} events from locations table`);
    return (data as Event[]) || [];
  } catch (error) {
    console.error('Error in getAll events:', JSON.stringify(error));
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
      .from('locations')
      .select('*')
      .eq('id', id)
      .eq('category', 'event')
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching event:', JSON.stringify(error));
      throw error;
    }
    
    return data as Event;
  } catch (error) {
    console.error('Error in getById event:', JSON.stringify(error));
    return null;
  }
}

// ============================================================================
// CREATE EVENT
// ============================================================================

export async function create(data: Partial<Event>): Promise<Event> {
  try {
    const supabase = getSupabaseAdmin();
    
    const eventData = {
      ...data,
      category: 'event' as const,
      source: data.details?.source || 'manual',
      is_active: true,
    };
    
    const { data: created, error } = await supabase
      .from('locations')
      .insert(eventData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating event:', JSON.stringify(error));
      throw error;
    }
    
    console.log(`✅ Created event: ${created.name}`);
    return created as Event;
  } catch (error) {
    console.error('Error in create event:', JSON.stringify(error));
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
      .from('locations')
      .update(data)
      .eq('id', id)
      .eq('category', 'event')
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error updating event:', JSON.stringify(error));
      throw error;
    }
    
    console.log(`✅ Updated event: ${updated.name}`);
    return updated as Event;
  } catch (error) {
    console.error('Error in update event:', JSON.stringify(error));
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
      .from('locations')
      .update({ is_active: false })
      .eq('id', id)
      .eq('category', 'event');
    
    if (error) {
      console.error('Error soft deleting event:', JSON.stringify(error));
      return false;
    }
    
    console.log(`✅ Soft deleted event: ${id}`);
    return true;
  } catch (error) {
    console.error('Error in softDelete event:', JSON.stringify(error));
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
      .from('locations')
      .select('*')
      .eq('category', 'event')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,event_type.ilike.%${query}%`)
      .order('event_start_time', { ascending: true });
    
    if (error) {
      console.error('Error searching events:', JSON.stringify(error));
      return [];
    }
    
    return (data as Event[]) || [];
  } catch (error) {
    console.error('Error in search events:', JSON.stringify(error));
    return [];
  }
}
