/**
 * Location Types
 * 
 * TypeScript interfaces matching the Supabase locations table schema
 * Located at: /supabase/schemas/03-core-places.sql
 */

// ============================================================================
// BASE TYPES
// ============================================================================

export type LocationSource = 'google' | 'yelp' | 'ticketmaster' | 'manual' | 'ai_generated';
export type LocationCategory = 'restaurant' | 'event' | 'rental' | 'poi' | 'hotel' | 'activity';
export type PriceLevel = 1 | 2 | 3 | 4;

// ============================================================================
// CORE LOCATION INTERFACE
// ============================================================================

export interface Location {
  // Primary key
  id: string;
  
  // External identifiers
  google_place_id?: string | null;
  yelp_id?: string | null;
  ticketmaster_id?: string | null;
  external_id?: string | null;
  source: LocationSource;
  
  // Basic info
  name: string;
  description?: string | null;
  category: LocationCategory;
  subcategory?: string | null;
  tags?: string[];
  
  // Location
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  
  // Contact
  phone?: string | null;
  website?: string | null;
  email?: string | null;
  
  // Media
  primary_image_url?: string | null;
  images?: {
    url: string;
    caption?: string;
    width?: number;
    height?: number;
  }[] | null;
  
  // Details (category-specific flexible JSON)
  details?: Record<string, any> | null;
  
  // Restaurant-specific
  cuisine_types?: string[] | null;
  price_level?: PriceLevel | null;
  dietary_options?: string[] | null;
  ambiance?: string[] | null;
  
  // Event-specific
  event_start_time?: string | null;
  event_end_time?: string | null;
  event_type?: string | null;
  ticket_url?: string | null;
  
  // Rental-specific
  vehicle_type?: string | null;
  rental_features?: string[] | null;
  hourly_rate?: number | null;
  daily_rate?: number | null;
  
  // Ratings
  rating?: number | null;
  rating_count?: number;
  
  // Hours
  hours_of_operation?: Record<string, { open: string; close: string }> | null;
  is_open_now?: boolean | null;
  
  // Status
  is_active?: boolean;
  is_verified?: boolean;
  
  // Cache metadata
  data_freshness?: string;
  cache_expires_at?: string | null;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

// ============================================================================
// SPECIALIZED INTERFACES
// ============================================================================

export interface Event extends Location {
  category: 'event';
  event_start_time: string;
  event_end_time?: string | null;
  event_type?: string | null;
  ticket_url?: string | null;
}

export interface Restaurant extends Location {
  category: 'restaurant';
  cuisine_types?: string[];
  price_level?: PriceLevel;
  dietary_options?: string[];
  ambiance?: string[];
}

export interface Rental extends Location {
  category: 'rental';
  vehicle_type?: string;
  rental_features?: string[];
  hourly_rate?: number;
  daily_rate?: number;
}

// ============================================================================
// SAVED PLACES
// ============================================================================

export interface SavedPlace {
  id: string;
  user_id: string;
  location_id: string;
  
  // Organization
  collection_name?: string;
  is_favorite?: boolean;
  
  // User notes
  notes?: string | null;
  tags?: string[];
  
  // User rating
  user_rating?: 1 | 2 | 3 | 4 | 5 | null;
  
  // Visit tracking
  visited?: boolean;
  visit_date?: string | null;
  visit_count?: number;
  
  // Reminders
  reminder_date?: string | null;
  reminder_sent?: boolean;
  
  // Metadata
  created_at: string;
  updated_at: string;
  
  // Joined data (from queries)
  location?: Location;
}

// ============================================================================
// COLLECTIONS
// ============================================================================

export interface Collection {
  id: string;
  user_id: string;
  
  // Collection info
  name: string;
  description?: string | null;
  emoji?: string | null;
  color?: string | null;
  
  // Visibility
  is_public?: boolean;
  is_collaborative?: boolean;
  
  // Stats
  place_count?: number;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface EventFilters {
  city?: string;
  date_range?: {
    start?: string;
    end?: string;
  };
  event_type?: string;
  price_range?: {
    min?: number;
    max?: number;
  };
  search?: string;
}

export interface RestaurantFilters {
  city?: string;
  cuisine_types?: string[];
  price_level?: PriceLevel[];
  dietary_options?: string[];
  rating_min?: number;
  open_now?: boolean;
  search?: string;
}

export interface RentalFilters {
  city?: string;
  vehicle_type?: string;
  price_range?: {
    min?: number;
    max?: number;
  };
  features?: string[];
  search?: string;
}

// ============================================================================
// CREATE/UPDATE TYPES
// ============================================================================

export type CreateEventInput = Omit<Event, 'id' | 'created_at' | 'updated_at'> & {
  category: 'event';
};

export type UpdateEventInput = Partial<CreateEventInput>;

export type CreateRestaurantInput = Omit<Restaurant, 'id' | 'created_at' | 'updated_at'> & {
  category: 'restaurant';
};

export type UpdateRestaurantInput = Partial<CreateRestaurantInput>;

export type CreateRentalInput = Omit<Rental, 'id' | 'created_at' | 'updated_at'> & {
  category: 'rental';
};

export type UpdateRentalInput = Partial<CreateRentalInput>;

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
