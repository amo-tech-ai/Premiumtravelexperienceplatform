/**
 * DB Restaurants Service
 * 
 * Uses Figma Make's KV Store (kv_store_fd8c4bf7 table)
 * Keys pattern: "restaurant:{id}" for individual restaurants
 */

import * as kv from "./kv_store.tsx";

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
// HELPER FUNCTIONS
// ============================================================================

function generateId(): string {
  return crypto.randomUUID();
}

function restaurantKey(id: string): string {
  return `restaurant:${id}`;
}

function restaurantIndexKey(): string {
  return 'restaurants:index';
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
    // Get all restaurant IDs from index
    const restaurantIds = await kv.get(restaurantIndexKey()) as string[] || [];
    
    if (restaurantIds.length === 0) {
      console.log('⚠️ No restaurants found in KV store');
      return [];
    }
    
    // Get all restaurants
    const restaurantKeys = restaurantIds.map(id => restaurantKey(id));
    const restaurants = await kv.mget(restaurantKeys) as Restaurant[];
    
    // Filter active restaurants
    let results = restaurants.filter(r => r && r.is_active);
    
    // Apply filters
    if (filters?.cuisine) {
      results = results.filter(r => 
        r.cuisine_types?.includes(filters.cuisine!)
      );
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
    
    console.log(`✅ Fetched ${results.length} restaurants from KV store`);
    return results;
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
    const restaurant = await kv.get(restaurantKey(id)) as Restaurant | null;
    
    if (!restaurant || !restaurant.is_active) {
      return null;
    }
    
    return restaurant;
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
    const id = generateId();
    const now = new Date().toISOString();
    
    const restaurant: Restaurant = {
      id,
      name: data.name || 'Untitled Restaurant',
      description: data.description || null,
      category: 'restaurant',
      subcategory: data.subcategory || null,
      tags: data.tags || [],
      address: data.address || null,
      city: data.city || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      cuisine_types: data.cuisine_types || null,
      price_level: data.price_level || null,
      dietary_options: data.dietary_options || null,
      ambiance: data.ambiance || null,
      primary_image_url: data.primary_image_url || null,
      images: data.images || null,
      details: data.details || null,
      rating: data.rating || null,
      rating_count: data.rating_count || null,
      hours_of_operation: data.hours_of_operation || null,
      is_open_now: data.is_open_now || null,
      is_active: true,
      created_at: now,
      updated_at: now,
    };
    
    // Save restaurant
    await kv.set(restaurantKey(id), restaurant);
    
    // Update index
    const restaurantIds = await kv.get(restaurantIndexKey()) as string[] || [];
    restaurantIds.push(id);
    await kv.set(restaurantIndexKey(), restaurantIds);
    
    console.log(`✅ Created restaurant: ${restaurant.name}`);
    return restaurant;
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
    const existing = await kv.get(restaurantKey(id)) as Restaurant | null;
    
    if (!existing) {
      return null;
    }
    
    const updated: Restaurant = {
      ...existing,
      ...data,
      id, // Ensure ID doesn't change
      category: 'restaurant', // Ensure category doesn't change
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(restaurantKey(id), updated);
    
    console.log(`✅ Updated restaurant: ${updated.name}`);
    return updated;
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
    const existing = await kv.get(restaurantKey(id)) as Restaurant | null;
    
    if (!existing) {
      return false;
    }
    
    const updated: Restaurant = {
      ...existing,
      is_active: false,
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(restaurantKey(id), updated);
    
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
    const allRestaurants = await getAll();
    const searchLower = query.toLowerCase();
    
    return allRestaurants.filter(r =>
      r.name?.toLowerCase().includes(searchLower) ||
      r.description?.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('Error in search restaurants:', JSON.stringify(error));
    return [];
  }
}
