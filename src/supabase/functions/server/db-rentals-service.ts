/**
 * DB Rentals Service
 * 
 * Uses Supabase locations table with category='rental'
 * All queries filter by category to get only rentals
 */

import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

// ============================================================================
// TYPES
// ============================================================================

export interface Rental {
  id: string;
  name: string;
  description: string | null;
  category: 'rental';
  subcategory: string | null;
  tags: string[];
  
  // Location
  address: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  
  // Rental-specific
  vehicle_type: string | null;
  rental_features: string[] | null;
  hourly_rate: number | null;
  daily_rate: number | null;
  
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
// GET ALL RENTALS
// ============================================================================

export async function getAll(filters?: {
  search?: string;
  type?: string;
  area?: string;
}): Promise<Rental[]> {
  try {
    const supabase = getSupabaseAdmin();
    
    let query = supabase
      .from('locations')
      .select('*')
      .eq('category', 'rental')
      .eq('is_active', true)
      .order('rating', { ascending: false, nullsFirst: false });
    
    // Apply filters
    if (filters?.type) {
      query = query.eq('vehicle_type', filters.type);
    }
    
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    
    if (filters?.area) {
      query = query.eq('city', filters.area);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching rentals:', JSON.stringify(error));
      throw error;
    }
    
    console.log(`✅ Fetched ${data?.length || 0} rentals from locations table`);
    return (data as Rental[]) || [];
  } catch (error) {
    console.error('Error in getAll rentals:', JSON.stringify(error));
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
      .from('locations')
      .select('*')
      .eq('id', id)
      .eq('category', 'rental')
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching rental:', JSON.stringify(error));
      throw error;
    }
    
    return data as Rental;
  } catch (error) {
    console.error('Error in getById rental:', JSON.stringify(error));
    return null;
  }
}

// ============================================================================
// CREATE RENTAL
// ============================================================================

export async function create(data: Partial<Rental>): Promise<Rental> {
  try {
    const supabase = getSupabaseAdmin();
    
    const rentalData = {
      ...data,
      category: 'rental' as const,
      source: data.details?.source || 'manual',
      is_active: true,
    };
    
    const { data: created, error } = await supabase
      .from('locations')
      .insert(rentalData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating rental:', JSON.stringify(error));
      throw error;
    }
    
    console.log(`✅ Created rental: ${created.name}`);
    return created as Rental;
  } catch (error) {
    console.error('Error in create rental:', JSON.stringify(error));
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
      .from('locations')
      .update(data)
      .eq('id', id)
      .eq('category', 'rental')
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error updating rental:', JSON.stringify(error));
      throw error;
    }
    
    console.log(`✅ Updated rental: ${updated.name}`);
    return updated as Rental;
  } catch (error) {
    console.error('Error in update rental:', JSON.stringify(error));
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
      .from('locations')
      .update({ is_active: false })
      .eq('id', id)
      .eq('category', 'rental');
    
    if (error) {
      console.error('Error soft deleting rental:', JSON.stringify(error));
      return false;
    }
    
    console.log(`✅ Soft deleted rental: ${id}`);
    return true;
  } catch (error) {
    console.error('Error in softDelete rental:', JSON.stringify(error));
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
      .from('locations')
      .select('*')
      .eq('category', 'rental')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,vehicle_type.ilike.%${query}%`)
      .order('rating', { ascending: false, nullsFirst: false });
    
    if (error) {
      console.error('Error searching rentals:', JSON.stringify(error));
      return [];
    }
    
    return (data as Rental[]) || [];
  } catch (error) {
    console.error('Error in search rentals:', JSON.stringify(error));
    return [];
  }
}
