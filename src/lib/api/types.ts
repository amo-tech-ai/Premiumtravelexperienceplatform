/**
 * Shared Types for Frontend & Backend
 * 
 * These types match the backend database schema exactly
 * Located at: /supabase/functions/server/database-setup.tsx
 */

// ============================================================================
// CORE ENTITIES
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
  collaborators?: string[];
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
  location?: Location;
  date: string;
  start_time?: string;
  end_time?: string;
  day: number;
  order: number;
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
  place_id: string;
  title: string;
  description?: string;
  location?: Location;
  image?: string;
  category?: string;
  rating?: number;
  price_level?: number;
  url?: string;
  collections?: string[];
  notes?: string;
  saved_at: string;
}

export interface UserPreferences {
  user_id: string;
  travel_style?: string[];
  interests?: string[];
  budget_range?: BudgetRange;
  dietary_restrictions?: string[];
  accessibility_needs?: string[];
  language?: string;
  currency?: string;
  ai_enabled?: boolean;
  notification_preferences?: NotificationPreferences;
  updated_at: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  cover_image?: string;
  place_ids: string[];
  is_public?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  trip_id?: string;
  messages: AIMessage[];
  context: ConversationContext;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agent?: string;
  reasoning?: string;
  suggestions?: any[];
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

// ============================================================================
// NESTED TYPES
// ============================================================================

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface BudgetRange {
  min: number;
  max: number;
  currency: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  ai_suggestions: boolean;
}

export interface ConversationContext {
  user_preferences?: UserPreferences;
  current_trip?: Trip;
  search_query?: string;
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateTripRequest {
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  description?: string;
  cover_image?: string;
  status?: 'draft' | 'active' | 'completed' | 'archived';
}

export interface UpdateTripRequest extends Partial<CreateTripRequest> {
  status?: Trip['status'];
  collaborators?: string[];
}

export interface CreateTripItemRequest {
  type: TripItem['type'];
  title: string;
  description?: string;
  location?: Location;
  date: string;
  start_time?: string;
  end_time?: string;
  day: number;
  order?: number;
  price?: number;
  currency?: string;
  url?: string;
  image?: string;
  category?: string;
  notes?: string;
}

export interface UpdateTripItemRequest extends Partial<CreateTripItemRequest> {
  booking_status?: TripItem['booking_status'];
}

export interface SavePlaceRequest {
  place_id?: string;
  title: string;
  description?: string;
  location?: Location;
  image?: string;
  category?: string;
  rating?: number;
  price_level?: number;
  url?: string;
  notes?: string;
}

export interface UpdatePreferencesRequest extends Partial<UserPreferences> {}

export interface CreateCollectionRequest {
  name: string;
  description?: string;
  cover_image?: string;
  is_public?: boolean;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  tripId?: string;
}

export interface ChatResponse {
  message: string;
  suggestions?: any[];
  reasoning?: string;
  conversationId: string;
}

export interface SearchRequest {
  query: string;
  category?: string;
  location?: Location;
  radius?: number;
  priceLevel?: number;
  rating?: number;
}

// ============================================================================
// RESPONSE TYPES WITH ITEMS
// ============================================================================

export interface TripWithItems extends Trip {
  items: TripItem[];
}

export interface CollectionWithPlaces extends Collection {
  places: SavedPlace[];
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type TripStatus = Trip['status'];
export type TripItemType = TripItem['type'];
export type BookingStatus = TripItem['booking_status'];
export type MessageRole = AIMessage['role'];
export type AgentEventType = AgentLog['event_type'];

// ============================================================================
// CONSTANTS
// ============================================================================

export const TRIP_STATUSES: TripStatus[] = ['draft', 'active', 'completed', 'archived'];

export const TRIP_ITEM_TYPES: TripItemType[] = [
  'place',
  'event',
  'accommodation',
  'transport',
  'note',
];

export const BOOKING_STATUSES: BookingStatus[] = [
  'none',
  'pending',
  'confirmed',
  'cancelled',
];

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isTripItem(item: any): item is TripItem {
  return (
    item &&
    typeof item === 'object' &&
    'id' in item &&
    'trip_id' in item &&
    'type' in item &&
    'title' in item
  );
}

export function isTrip(trip: any): trip is Trip {
  return (
    trip &&
    typeof trip === 'object' &&
    'id' in trip &&
    'title' in trip &&
    'destination' in trip
  );
}

export function isSavedPlace(place: any): place is SavedPlace {
  return (
    place &&
    typeof place === 'object' &&
    'id' in place &&
    'user_id' in place &&
    'title' in place
  );
}