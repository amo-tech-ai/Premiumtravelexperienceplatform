/**
 * Database Setup for Luxury AI Travel Platform
 * 
 * This file contains functions to create database tables using the kv_store.
 * Since we can't run migrations directly, we'll use the kv_store as our data layer
 * with a structured schema approach.
 * 
 * Schema Design:
 * - trips:{userId}:{tripId} → Trip object
 * - trip_items:{tripId}:{itemId} → Trip item object
 * - saved:{userId}:{placeId} → Saved place object
 * - user_prefs:{userId} → User preferences object
 * - ai_conversations:{userId}:{conversationId} → AI conversation object
 * - agent_logs:{logId} → Agent log object
 */

import * as kv from "./kv_store.tsx";

// ============================================================================
// TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  description?: string;
  cover_image?: string;
  collaborators?: string[]; // Array of user IDs
  status: 'draft' | 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface TripItem {
  id: string;
  trip_id: string;
  type: 'place' | 'event' | 'accommodation' | 'transport' | 'note';
  title: string;
  description?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  date: string; // ISO date
  start_time?: string; // HH:mm
  end_time?: string; // HH:mm
  day: number; // Which day of the trip (1-indexed)
  order: number; // Order within the day
  price?: number;
  currency?: string;
  url?: string;
  image?: string;
  rating?: number;
  category?: string;
  notes?: string;
  booking_status?: 'none' | 'pending' | 'confirmed' | 'cancelled';
  ai_suggested?: boolean;
  ai_reasoning?: string;
  created_at: string;
  updated_at: string;
}

export interface SavedPlace {
  id: string;
  user_id: string;
  place_id: string; // External place ID (Google Places, etc.)
  title: string;
  description?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  image?: string;
  category?: string;
  rating?: number;
  price_level?: number;
  url?: string;
  collections?: string[]; // Array of collection IDs
  notes?: string;
  saved_at: string;
}

export interface UserPreferences {
  user_id: string;
  travel_style?: string[]; // ['luxury', 'adventure', 'cultural', etc.]
  interests?: string[]; // ['food', 'art', 'nightlife', etc.]
  budget_range?: {
    min: number;
    max: number;
    currency: string;
  };
  dietary_restrictions?: string[];
  accessibility_needs?: string[];
  language?: string;
  currency?: string;
  ai_enabled?: boolean;
  notification_preferences?: {
    email: boolean;
    push: boolean;
    ai_suggestions: boolean;
  };
  updated_at: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  trip_id?: string;
  messages: AIMessage[];
  context: {
    user_preferences?: UserPreferences;
    current_trip?: Trip;
    search_query?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agent?: string; // Which agent generated this
  reasoning?: string; // AI reasoning (explainability)
  suggestions?: any[]; // Structured suggestions (places, events, etc.)
}

export interface AgentLog {
  id: string;
  agent_name: string;
  event_type: 'request' | 'response' | 'error';
  user_id?: string;
  trip_id?: string;
  conversation_id?: string;
  input?: any;
  output?: any;
  error?: string;
  duration_ms?: number;
  tokens_used?: number;
  timestamp: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  cover_image?: string;
  place_ids: string[]; // Array of saved place IDs
  is_public?: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get current ISO timestamp
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// ============================================================================
// DATABASE FUNCTIONS
// ============================================================================

// ----------------------------------------------------------------------------
// TRIPS
// ----------------------------------------------------------------------------

export async function createTrip(userId: string, tripData: Partial<Trip>): Promise<Trip> {
  const tripId = generateId();
  const now = getCurrentTimestamp();
  
  const trip: Trip = {
    id: tripId,
    user_id: userId,
    title: tripData.title || 'Untitled Trip',
    destination: tripData.destination || '',
    start_date: tripData.start_date || '',
    end_date: tripData.end_date || '',
    description: tripData.description,
    cover_image: tripData.cover_image,
    collaborators: tripData.collaborators || [],
    status: tripData.status || 'draft',
    created_at: now,
    updated_at: now,
  };
  
  await kv.set(`trips:${userId}:${tripId}`, trip);
  return trip;
}

export async function getTrip(userId: string, tripId: string): Promise<Trip | null> {
  const trip = await kv.get<Trip>(`trips:${userId}:${tripId}`);
  return trip || null;
}

export async function getUserTrips(userId: string): Promise<Trip[]> {
  const trips = await kv.getByPrefix<Trip>(`trips:${userId}:`);
  return trips.sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export async function updateTrip(userId: string, tripId: string, updates: Partial<Trip>): Promise<Trip | null> {
  const trip = await getTrip(userId, tripId);
  if (!trip) return null;
  
  const updatedTrip: Trip = {
    ...trip,
    ...updates,
    id: trip.id, // Don't allow ID changes
    user_id: trip.user_id, // Don't allow user_id changes
    updated_at: getCurrentTimestamp(),
  };
  
  await kv.set(`trips:${userId}:${tripId}`, updatedTrip);
  return updatedTrip;
}

export async function deleteTrip(userId: string, tripId: string): Promise<boolean> {
  await kv.del(`trips:${userId}:${tripId}`);
  
  // Also delete all trip items
  const items = await getTripItems(tripId);
  for (const item of items) {
    await kv.del(`trip_items:${tripId}:${item.id}`);
  }
  
  return true;
}

// ----------------------------------------------------------------------------
// TRIP ITEMS
// ----------------------------------------------------------------------------

export async function addTripItem(tripId: string, itemData: Partial<TripItem>): Promise<TripItem> {
  const itemId = generateId();
  const now = getCurrentTimestamp();
  
  const item: TripItem = {
    id: itemId,
    trip_id: tripId,
    type: itemData.type || 'place',
    title: itemData.title || 'Untitled',
    description: itemData.description,
    location: itemData.location,
    date: itemData.date || '',
    start_time: itemData.start_time,
    end_time: itemData.end_time,
    day: itemData.day || 1,
    order: itemData.order || 0,
    price: itemData.price,
    currency: itemData.currency,
    url: itemData.url,
    image: itemData.image,
    rating: itemData.rating,
    category: itemData.category,
    notes: itemData.notes,
    booking_status: itemData.booking_status || 'none',
    ai_suggested: itemData.ai_suggested || false,
    ai_reasoning: itemData.ai_reasoning,
    created_at: now,
    updated_at: now,
  };
  
  await kv.set(`trip_items:${tripId}:${itemId}`, item);
  return item;
}

export async function getTripItems(tripId: string): Promise<TripItem[]> {
  const items = await kv.getByPrefix<TripItem>(`trip_items:${tripId}:`);
  return items.sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.order - b.order;
  });
}

export async function updateTripItem(tripId: string, itemId: string, updates: Partial<TripItem>): Promise<TripItem | null> {
  const item = await kv.get<TripItem>(`trip_items:${tripId}:${itemId}`);
  if (!item) return null;
  
  const updatedItem: TripItem = {
    ...item,
    ...updates,
    id: item.id,
    trip_id: item.trip_id,
    updated_at: getCurrentTimestamp(),
  };
  
  await kv.set(`trip_items:${tripId}:${itemId}`, updatedItem);
  return updatedItem;
}

export async function deleteTripItem(tripId: string, itemId: string): Promise<boolean> {
  await kv.del(`trip_items:${tripId}:${itemId}`);
  return true;
}

// ----------------------------------------------------------------------------
// SAVED PLACES
// ----------------------------------------------------------------------------

export async function savePlace(userId: string, placeData: Partial<SavedPlace>): Promise<SavedPlace> {
  const placeId = placeData.place_id || generateId();
  const now = getCurrentTimestamp();
  
  const savedPlace: SavedPlace = {
    id: placeId,
    user_id: userId,
    place_id: placeData.place_id || placeId,
    title: placeData.title || 'Untitled Place',
    description: placeData.description,
    location: placeData.location,
    image: placeData.image,
    category: placeData.category,
    rating: placeData.rating,
    price_level: placeData.price_level,
    url: placeData.url,
    collections: placeData.collections || [],
    notes: placeData.notes,
    saved_at: now,
  };
  
  await kv.set(`saved:${userId}:${placeId}`, savedPlace);
  return savedPlace;
}

export async function getSavedPlaces(userId: string): Promise<SavedPlace[]> {
  try {
    const places = await kv.getByPrefix<SavedPlace>(`saved:${userId}:`);
    return places.sort((a, b) => 
      new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime()
    );
  } catch (error) {
    console.error('Error in getSavedPlaces:', error);
    return []; // Return empty array on error
  }
}

export async function unsavePlace(userId: string, placeId: string): Promise<boolean> {
  await kv.del(`saved:${userId}:${placeId}`);
  return true;
}

// ----------------------------------------------------------------------------
// USER PREFERENCES
// ----------------------------------------------------------------------------

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const prefs = await kv.get<UserPreferences>(`user_prefs:${userId}`);
  return prefs || null;
}

export async function updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences> {
  const existing = await getUserPreferences(userId);
  
  const prefs: UserPreferences = {
    user_id: userId,
    ...existing,
    ...updates,
    updated_at: getCurrentTimestamp(),
  };
  
  await kv.set(`user_prefs:${userId}`, prefs);
  return prefs;
}

// ----------------------------------------------------------------------------
// AI CONVERSATIONS
// ----------------------------------------------------------------------------

export async function createConversation(userId: string, tripId?: string): Promise<AIConversation> {
  const conversationId = generateId();
  const now = getCurrentTimestamp();
  
  const conversation: AIConversation = {
    id: conversationId,
    user_id: userId,
    trip_id: tripId,
    messages: [],
    context: {},
    created_at: now,
    updated_at: now,
  };
  
  await kv.set(`ai_conversations:${userId}:${conversationId}`, conversation);
  return conversation;
}

export async function getConversation(userId: string, conversationId: string): Promise<AIConversation | null> {
  const conversation = await kv.get<AIConversation>(`ai_conversations:${userId}:${conversationId}`);
  return conversation || null;
}

export async function addMessageToConversation(
  userId: string,
  conversationId: string,
  message: Omit<AIMessage, 'id' | 'timestamp'>
): Promise<AIConversation | null> {
  const conversation = await getConversation(userId, conversationId);
  if (!conversation) return null;
  
  const newMessage: AIMessage = {
    id: generateId(),
    timestamp: getCurrentTimestamp(),
    ...message,
  };
  
  conversation.messages.push(newMessage);
  conversation.updated_at = getCurrentTimestamp();
  
  await kv.set(`ai_conversations:${userId}:${conversationId}`, conversation);
  return conversation;
}

// ----------------------------------------------------------------------------
// AGENT LOGS
// ----------------------------------------------------------------------------

export async function logAgentEvent(logData: Omit<AgentLog, 'id' | 'timestamp'>): Promise<AgentLog> {
  const logId = generateId();
  const now = getCurrentTimestamp();
  
  const log: AgentLog = {
    id: logId,
    timestamp: now,
    ...logData,
  };
  
  await kv.set(`agent_logs:${logId}`, log);
  return log;
}

export async function getAgentLogs(limit: number = 100): Promise<AgentLog[]> {
  const logs = await kv.getByPrefix<AgentLog>('agent_logs:');
  return logs
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

// ----------------------------------------------------------------------------
// COLLECTIONS
// ----------------------------------------------------------------------------

export async function createCollection(userId: string, collectionData: Partial<Collection>): Promise<Collection> {
  const collectionId = generateId();
  const now = getCurrentTimestamp();
  
  const collection: Collection = {
    id: collectionId,
    user_id: userId,
    name: collectionData.name || 'Untitled Collection',
    description: collectionData.description,
    cover_image: collectionData.cover_image,
    place_ids: collectionData.place_ids || [],
    is_public: collectionData.is_public || false,
    created_at: now,
    updated_at: now,
  };
  
  await kv.set(`collections:${userId}:${collectionId}`, collection);
  return collection;
}

export async function getUserCollections(userId: string): Promise<Collection[]> {
  const collections = await kv.getByPrefix<Collection>(`collections:${userId}:`);
  return collections.sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export async function addPlaceToCollection(userId: string, collectionId: string, placeId: string): Promise<Collection | null> {
  const collection = await kv.get<Collection>(`collections:${userId}:${collectionId}`);
  if (!collection) return null;
  
  if (!collection.place_ids.includes(placeId)) {
    collection.place_ids.push(placeId);
    collection.updated_at = getCurrentTimestamp();
    await kv.set(`collections:${userId}:${collectionId}`, collection);
  }
  
  return collection;
}

// ============================================================================
// SEED DATA (for development/demo)
// ============================================================================

export async function seedDemoData(userId: string): Promise<void> {
  // Create demo trip
  const trip = await createTrip(userId, {
    title: 'Weekend in Paris',
    destination: 'Paris, France',
    start_date: '2025-02-14',
    end_date: '2025-02-16',
    description: 'A romantic weekend getaway',
    cover_image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    status: 'active',
  });
  
  // Add some trip items
  await addTripItem(trip.id, {
    type: 'accommodation',
    title: 'Le Meurice',
    description: 'Luxury hotel near the Louvre',
    location: {
      lat: 48.8656,
      lng: 2.3280,
      address: '228 Rue de Rivoli, 75001 Paris',
    },
    date: '2025-02-14',
    day: 1,
    order: 1,
    price: 450,
    currency: 'EUR',
    rating: 4.8,
    category: 'accommodation',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
  });
  
  await addTripItem(trip.id, {
    type: 'place',
    title: 'Eiffel Tower',
    description: 'Iconic iron lattice tower',
    location: {
      lat: 48.8584,
      lng: 2.2945,
      address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
    },
    date: '2025-02-14',
    start_time: '14:00',
    end_time: '16:00',
    day: 1,
    order: 2,
    price: 26,
    currency: 'EUR',
    rating: 4.7,
    category: 'landmark',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600',
    ai_suggested: true,
    ai_reasoning: 'Iconic landmark, must-see for first-time visitors',
  });
  
  // Save some places
  await savePlace(userId, {
    place_id: 'louvre-museum',
    title: 'Louvre Museum',
    description: 'World\'s largest art museum',
    location: {
      lat: 48.8606,
      lng: 2.3376,
      address: 'Rue de Rivoli, 75001 Paris',
    },
    rating: 4.8,
    price_level: 2,
    category: 'museum',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600',
  });
  
  // Set user preferences
  await updateUserPreferences(userId, {
    travel_style: ['luxury', 'cultural', 'foodie'],
    interests: ['art', 'fine-dining', 'architecture'],
    budget_range: {
      min: 100,
      max: 500,
      currency: 'EUR',
    },
    language: 'en',
    currency: 'EUR',
    ai_enabled: true,
    notification_preferences: {
      email: true,
      push: true,
      ai_suggestions: true,
    },
  });
  
  console.log('✓ Demo data seeded successfully');
}