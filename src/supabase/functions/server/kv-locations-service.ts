/**
 * KV-Based Locations Service
 * 
 * Alternative implementation using KV store instead of database
 * Works immediately without requiring database setup
 * 
 * KV Schema:
 * - location:{category}:{id} → Location object
 * - location:index:{category} → Array of location IDs
 */

import * as kv from './kv_store.tsx';
import type { Event, Restaurant, Rental } from './locations-service.ts';

// ============================================================================
// TYPES
// ============================================================================

type Location = Event | Restaurant | Rental;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateId(): string {
  return crypto.randomUUID();
}

function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// ============================================================================
// KV KEYS
// ============================================================================

function locationKey(category: string, id: string): string {
  return `location:${category}:${id}`;
}

function indexKey(category: string): string {
  return `location:index:${category}`;
}

// ============================================================================
// GET ALL LOCATIONS BY CATEGORY
// ============================================================================

export async function getLocationsByCategory(category: 'event' | 'restaurant' | 'rental'): Promise<Location[]> {
  try {
    // Get index of IDs
    const index = await kv.get<string[]>(indexKey(category));
    
    if (!index || index.length === 0) {
      return [];
    }

    // Get all locations
    const keys = index.map(id => locationKey(category, id));
    const locations = await kv.mget<Location>(keys);
    
    // Filter out nulls and inactive items
    return locations.filter((loc): loc is Location => 
      loc !== null && loc.is_active !== false
    );
  } catch (error) {
    console.error(`Error fetching ${category} locations:`, error);
    return [];
  }
}

// ============================================================================
// GET SINGLE LOCATION
// ============================================================================

export async function getLocationById(category: string, id: string): Promise<Location | null> {
  try {
    const location = await kv.get<Location>(locationKey(category, id));
    
    if (!location || location.is_active === false) {
      return null;
    }
    
    return location;
  } catch (error) {
    console.error(`Error fetching location ${id}:`, error);
    return null;
  }
}

// ============================================================================
// CREATE LOCATION
// ============================================================================

export async function createLocation(category: string, data: Partial<Location>): Promise<Location> {
  const id = generateId();
  const timestamp = getCurrentTimestamp();
  
  const location: Location = {
    id,
    category: category as any,
    source: 'manual',
    is_active: true,
    created_at: timestamp,
    updated_at: timestamp,
    ...data,
  } as Location;

  // Save location
  await kv.set(locationKey(category, id), location);

  // Update index
  const index = await kv.get<string[]>(indexKey(category)) || [];
  index.push(id);
  await kv.set(indexKey(category), index);

  return location;
}

// ============================================================================
// UPDATE LOCATION
// ============================================================================

export async function updateLocation(
  category: string,
  id: string,
  data: Partial<Location>
): Promise<Location | null> {
  const existing = await getLocationById(category, id);
  
  if (!existing) {
    return null;
  }

  const updated: Location = {
    ...existing,
    ...data,
    id, // Ensure ID doesn't change
    updated_at: getCurrentTimestamp(),
  };

  await kv.set(locationKey(category, id), updated);
  return updated;
}

// ============================================================================
// DELETE LOCATION (SOFT)
// ============================================================================

export async function deleteLocation(category: string, id: string): Promise<boolean> {
  const existing = await getLocationById(category, id);
  
  if (!existing) {
    return false;
  }

  // Soft delete
  const updated = {
    ...existing,
    is_active: false,
    updated_at: getCurrentTimestamp(),
  };

  await kv.set(locationKey(category, id), updated);
  return true;
}

// ============================================================================
// SEARCH LOCATIONS
// ============================================================================

export async function searchLocations(category: string, query: string): Promise<Location[]> {
  const all = await getLocationsByCategory(category as any);
  const lowerQuery = query.toLowerCase();
  
  return all.filter(loc => 
    loc.name?.toLowerCase().includes(lowerQuery) ||
    loc.description?.toLowerCase().includes(lowerQuery) ||
    loc.city?.toLowerCase().includes(lowerQuery) ||
    loc.address?.toLowerCase().includes(lowerQuery)
  );
}

// ============================================================================
// SEED DEMO DATA
// ============================================================================

export async function seedDemoData(): Promise<void> {
  // Check if already seeded
  const eventsIndex = await kv.get<string[]>(indexKey('event'));
  if (eventsIndex && eventsIndex.length > 0) {
    console.log('Demo data already exists, skipping seed');
    return;
  }

  console.log('Seeding demo data...');

  // Seed Events
  await createLocation('event', {
    name: 'Medellín Music Festival',
    event_type: 'concert',
    description: 'The biggest music festival in Colombia featuring international and local artists',
    address: 'Plaza Mayor, Calle 41',
    city: 'Medellín',
    country: 'Colombia',
    event_start_time: '2025-03-15T19:00:00Z',
    event_end_time: '2025-03-15T23:00:00Z',
    primary_image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1200',
  });

  await createLocation('event', {
    name: 'Feria de las Flores',
    event_type: 'festival',
    description: 'Annual flower festival celebrating Medellín\'s culture',
    address: 'Multiple locations',
    city: 'Medellín',
    country: 'Colombia',
    event_start_time: '2025-08-01T10:00:00Z',
    event_end_time: '2025-08-10T20:00:00Z',
    primary_image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=1200',
  });

  await createLocation('event', {
    name: 'Colombiamoda Fashion Week',
    event_type: 'fashion',
    description: 'Latin America\'s premier fashion event',
    address: 'Plaza Mayor Convention Center',
    city: 'Medellín',
    country: 'Colombia',
    event_start_time: '2025-07-25T14:00:00Z',
    event_end_time: '2025-07-27T22:00:00Z',
    primary_image_url: 'https://images.unsplash.com/photo-1558769132-cb1aea8f4477?auto=format&fit=crop&q=80&w=1200',
  });

  // Seed Restaurants
  await createLocation('restaurant', {
    name: 'Carmen',
    cuisine_types: ['Colombian', 'Contemporary'],
    price_level: 4,
    rating: 4.8,
    description: 'Fine dining restaurant showcasing Colombian ingredients',
    address: 'Carrera 36 #10A-27',
    city: 'Medellín',
    country: 'Colombia',
    phone: '+57 4 311 6658',
    website: 'https://carmen.com.co',
    primary_image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200',
  });

  await createLocation('restaurant', {
    name: 'El Cielo',
    cuisine_types: ['Colombian', 'Fusion'],
    price_level: 4,
    rating: 4.9,
    description: 'Sensory dining experience with molecular gastronomy',
    address: 'Calle 9 Sur #43B-95',
    city: 'Medellín',
    country: 'Colombia',
    phone: '+57 4 268 3485',
    website: 'https://elcielo.com.co',
    primary_image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
  });

  await createLocation('restaurant', {
    name: 'Oci.Mde',
    cuisine_types: ['Peruvian', 'Seafood'],
    price_level: 3,
    rating: 4.7,
    description: 'Modern Peruvian cuisine with fresh seafood',
    address: 'Carrera 37 #8A-32',
    city: 'Medellín',
    country: 'Colombia',
    phone: '+57 4 444 4448',
    website: 'https://ocimde.com',
    primary_image_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200',
  });

  // Seed Rentals
  await createLocation('rental', {
    name: 'Toyota Fortuner 2024',
    vehicle_type: 'suv',
    daily_rate: 75.00,
    description: 'Spacious SUV perfect for exploring Colombia',
    address: 'Calle 10 #43-33',
    city: 'Medellín',
    country: 'Colombia',
    phone: '+57 300 123 4567',
    primary_image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200',
    rental_features: ['GPS', 'Air Conditioning', 'Bluetooth'],
    passenger_capacity: 7,
    transmission: 'Automatic',
  });

  await createLocation('rental', {
    name: 'Honda PCX 150 Scooter',
    vehicle_type: 'scooter',
    daily_rate: 25.00,
    description: 'Perfect for navigating Medellín traffic',
    address: 'Carrera 70 #44-10',
    city: 'Medellín',
    country: 'Colombia',
    phone: '+57 300 987 6543',
    primary_image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200',
    rental_features: ['Helmet Included', 'Under-seat Storage'],
    passenger_capacity: 2,
    transmission: 'Automatic',
  });

  await createLocation('rental', {
    name: 'Trek Mountain Bike',
    vehicle_type: 'bicycle',
    daily_rate: 15.00,
    description: 'High-quality mountain bike for exploring',
    address: 'Calle 33 #70-30',
    city: 'Medellín',
    country: 'Colombia',
    phone: '+57 311 555 7788',
    primary_image_url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&q=80&w=1200',
    rental_features: ['Helmet Included', 'Lock Included'],
    passenger_capacity: 1,
  });

  console.log('✅ Demo data seeded successfully (9 locations)');
}
