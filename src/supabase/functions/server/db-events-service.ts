/**
 * DB Events Service
 * 
 * Uses Figma Make's KV Store (kv_store_fd8c4bf7 table)
 * Keys pattern: "event:{id}" for individual events
 */

import * as kv from "./kv_store.tsx";

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
// HELPER FUNCTIONS
// ============================================================================

function generateId(): string {
  return crypto.randomUUID();
}

function eventKey(id: string): string {
  return `event:${id}`;
}

function eventIndexKey(): string {
  return 'events:index';
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
    // Get all event IDs from index
    const eventIds = await kv.get(eventIndexKey()) as string[] || [];
    
    if (eventIds.length === 0) {
      console.log('⚠️ No events found in KV store');
      return [];
    }
    
    // Get all events
    const eventKeys = eventIds.map(id => eventKey(id));
    const events = await kv.mget(eventKeys) as Event[];
    
    // Filter active events
    let results = events.filter(e => e && e.is_active);
    
    // Apply filters
    if (filters?.category) {
      results = results.filter(e => e.event_type === filters.category);
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(e => 
        e.name?.toLowerCase().includes(searchLower) ||
        e.description?.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.area) {
      results = results.filter(e => e.city === filters.area);
    }
    
    // Sort by start time
    results.sort((a, b) => {
      if (!a.event_start_time) return 1;
      if (!b.event_start_time) return -1;
      return new Date(a.event_start_time).getTime() - new Date(b.event_start_time).getTime();
    });
    
    console.log(`✅ Fetched ${results.length} events from KV store`);
    return results;
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
    const event = await kv.get(eventKey(id)) as Event | null;
    
    if (!event || !event.is_active) {
      return null;
    }
    
    return event;
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
    const id = generateId();
    const now = new Date().toISOString();
    
    const event: Event = {
      id,
      name: data.name || 'Untitled Event',
      description: data.description || null,
      category: 'event',
      subcategory: data.subcategory || null,
      tags: data.tags || [],
      address: data.address || null,
      city: data.city || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      event_start_time: data.event_start_time || null,
      event_end_time: data.event_end_time || null,
      event_type: data.event_type || null,
      ticket_url: data.ticket_url || null,
      primary_image_url: data.primary_image_url || null,
      images: data.images || null,
      details: data.details || null,
      rating: data.rating || null,
      rating_count: data.rating_count || null,
      is_active: true,
      created_at: now,
      updated_at: now,
    };
    
    // Save event
    await kv.set(eventKey(id), event);
    
    // Update index
    const eventIds = await kv.get(eventIndexKey()) as string[] || [];
    eventIds.push(id);
    await kv.set(eventIndexKey(), eventIds);
    
    console.log(`✅ Created event: ${event.name}`);
    return event;
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
    const existing = await kv.get(eventKey(id)) as Event | null;
    
    if (!existing) {
      return null;
    }
    
    const updated: Event = {
      ...existing,
      ...data,
      id, // Ensure ID doesn't change
      category: 'event', // Ensure category doesn't change
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(eventKey(id), updated);
    
    console.log(`✅ Updated event: ${updated.name}`);
    return updated;
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
    const existing = await kv.get(eventKey(id)) as Event | null;
    
    if (!existing) {
      return false;
    }
    
    const updated: Event = {
      ...existing,
      is_active: false,
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(eventKey(id), updated);
    
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
    const allEvents = await getAll();
    const searchLower = query.toLowerCase();
    
    return allEvents.filter(e =>
      e.name?.toLowerCase().includes(searchLower) ||
      e.description?.toLowerCase().includes(searchLower) ||
      e.event_type?.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('Error in search events:', JSON.stringify(error));
    return [];
  }
}
