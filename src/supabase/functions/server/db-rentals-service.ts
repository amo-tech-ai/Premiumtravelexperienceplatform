/**
 * DB Rentals Service
 * 
 * Uses Figma Make's KV Store (kv_store_fd8c4bf7 table)
 * Keys pattern: "rental:{id}" for individual rentals
 */

import * as kv from "./kv_store.tsx";

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
// HELPER FUNCTIONS
// ============================================================================

function generateId(): string {
  return crypto.randomUUID();
}

function rentalKey(id: string): string {
  return `rental:${id}`;
}

function rentalIndexKey(): string {
  return 'rentals:index';
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
    // Get all rental IDs from index
    const rentalIds = await kv.get(rentalIndexKey()) as string[] || [];
    
    if (rentalIds.length === 0) {
      console.log('⚠️ No rentals found in KV store');
      return [];
    }
    
    // Get all rentals
    const rentalKeys = rentalIds.map(id => rentalKey(id));
    const rentals = await kv.mget(rentalKeys) as Rental[];
    
    // Filter active rentals
    let results = rentals.filter(r => r && r.is_active);
    
    // Apply filters
    if (filters?.type) {
      results = results.filter(r => r.vehicle_type === filters.type);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(r => 
        r.name?.toLowerCase().includes(searchLower) ||
        r.description?.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.area) {
      results = results.filter(r => r.city === filters.area);
    }
    
    // Sort by rating
    results.sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return ratingB - ratingA;
    });
    
    console.log(`✅ Fetched ${results.length} rentals from KV store`);
    return results;
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
    const rental = await kv.get(rentalKey(id)) as Rental | null;
    
    if (!rental || !rental.is_active) {
      return null;
    }
    
    return rental;
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
    const id = generateId();
    const now = new Date().toISOString();
    
    const rental: Rental = {
      id,
      name: data.name || 'Untitled Rental',
      description: data.description || null,
      category: 'rental',
      subcategory: data.subcategory || null,
      tags: data.tags || [],
      address: data.address || null,
      city: data.city || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      vehicle_type: data.vehicle_type || null,
      rental_features: data.rental_features || null,
      hourly_rate: data.hourly_rate || null,
      daily_rate: data.daily_rate || null,
      primary_image_url: data.primary_image_url || null,
      images: data.images || null,
      details: data.details || null,
      rating: data.rating || null,
      rating_count: data.rating_count || null,
      is_active: true,
      created_at: now,
      updated_at: now,
    };
    
    // Save rental
    await kv.set(rentalKey(id), rental);
    
    // Update index
    const rentalIds = await kv.get(rentalIndexKey()) as string[] || [];
    rentalIds.push(id);
    await kv.set(rentalIndexKey(), rentalIds);
    
    console.log(`✅ Created rental: ${rental.name}`);
    return rental;
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
    const existing = await kv.get(rentalKey(id)) as Rental | null;
    
    if (!existing) {
      return null;
    }
    
    const updated: Rental = {
      ...existing,
      ...data,
      id, // Ensure ID doesn't change
      category: 'rental', // Ensure category doesn't change
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(rentalKey(id), updated);
    
    console.log(`✅ Updated rental: ${updated.name}`);
    return updated;
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
    const existing = await kv.get(rentalKey(id)) as Rental | null;
    
    if (!existing) {
      return false;
    }
    
    const updated: Rental = {
      ...existing,
      is_active: false,
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(rentalKey(id), updated);
    
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
    const allRentals = await getAll();
    const searchLower = query.toLowerCase();
    
    return allRentals.filter(r =>
      r.name?.toLowerCase().includes(searchLower) ||
      r.description?.toLowerCase().includes(searchLower) ||
      r.vehicle_type?.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('Error in search rentals:', JSON.stringify(error));
    return [];
  }
}
