/**
 * TRIP OPERATING SYSTEM - CORE TYPE DEFINITIONS
 * 
 * Comprehensive type system for all entities in the Trip OS:
 * - Trips & Itineraries
 * - Events
 * - Restaurants
 * - Rentals (Real Estate)
 * - Tourist Destinations
 * - Activities
 */

// ============================================================================
// BASE TYPES
// ============================================================================

export type EntityType = 
  | 'trip'
  | 'event' 
  | 'restaurant' 
  | 'rental' 
  | 'destination' 
  | 'activity'
  | 'travel'
  | 'flex_time';

export type EntityStatus = 
  | 'draft'
  | 'planned' 
  | 'confirmed' 
  | 'booked' 
  | 'completed' 
  | 'cancelled';

export type TimeSlotStatus = 
  | 'available'
  | 'tentative'
  | 'booked'
  | 'conflict';

// ============================================================================
// LOCATION TYPES
// ============================================================================

export interface Location {
  id: string;
  name: string;
  address?: string;
  neighborhood?: string;
  city: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string; // Google Places ID
}

export interface Distance {
  meters: number;
  kilometers: number;
  walkTimeMinutes: number;
  driveTimeMinutes: number;
  publicTransitMinutes?: number;
}

// ============================================================================
// TIME & SCHEDULE TYPES
// ============================================================================

export interface TimeSlot {
  id: string;
  start: Date;
  end: Date;
  duration: number; // minutes
  isFlexible: boolean;
  bufferBefore?: number; // minutes
  bufferAfter?: number; // minutes
}

export interface Schedule {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
  conflicts: ScheduleConflict[];
}

export interface ScheduleConflict {
  id: string;
  type: 'overlap' | 'tight_timing' | 'travel_time' | 'closed' | 'fully_booked';
  severity: 'minor' | 'major' | 'blocking';
  conflictingItems: string[]; // Entity IDs
  message: string;
  suggestions: string[];
  autoResolvable: boolean;
}

// ============================================================================
// BUDGET TYPES
// ============================================================================

export interface Budget {
  total: number;
  currency: string;
  breakdown: {
    restaurants: number;
    events: number;
    rentals: number;
    activities: number;
    travel: number;
    other: number;
  };
  spent: number;
  remaining: number;
  dailyLimit?: number;
  alerts: BudgetAlert[];
}

export interface BudgetAlert {
  id: string;
  type: 'approaching_limit' | 'exceeded' | 'daily_limit' | 'category_limit';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  amount: number;
  threshold: number;
}

// ============================================================================
// RESTAURANT TYPES
// ============================================================================

export interface Restaurant {
  id: string;
  type: 'restaurant';
  name: string;
  cuisine: string;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  estimatedCost: number;
  location: Location;
  
  // Details
  rating?: number;
  reviewCount?: number;
  description?: string;
  menuUrl?: string;
  phone?: string;
  website?: string;
  
  // Availability
  openingHours?: {
    [day: string]: { open: string; close: string };
  };
  currentStatus: 'open' | 'closes_soon' | 'closed';
  closingTime?: string;
  
  // Features
  tags: string[];
  amenities: string[];
  dietary: string[]; // vegetarian, vegan, gluten-free, etc.
  
  // Trip Integration
  addedToTrip: boolean;
  tripDate?: string;
  reservationTime?: Date;
  reservationStatus?: 'pending' | 'confirmed' | 'waitlist';
  numberOfGuests?: number;
  
  // AI Context
  aiReason?: string;
  matchScore?: number;
  saved: boolean;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface Event {
  id: string;
  type: 'event';
  name: string;
  category: 'concert' | 'sports' | 'festival' | 'art' | 'nightlife' | 'cultural' | 'other';
  location: Location;
  
  // Timing
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  doors?: Date; // Door opening time
  
  // Pricing
  price: number;
  priceRange?: { min: number; max: number };
  ticketUrl?: string;
  
  // Details
  description?: string;
  performers?: string[];
  organizer?: string;
  rating?: number;
  attendees?: number;
  
  // Availability
  ticketAvailability: 'available' | 'low' | 'sold_out' | 'waitlist';
  capacityRemaining?: number;
  
  // Features
  tags: string[];
  ageRestriction?: string;
  dresscode?: string;
  
  // Trip Integration
  addedToTrip: boolean;
  tripDate?: string;
  ticketStatus?: 'not_purchased' | 'reserved' | 'purchased';
  numberOfTickets?: number;
  
  // AI Context
  aiReason?: string;
  matchScore?: number;
  saved: boolean;
}

// ============================================================================
// RENTAL (REAL ESTATE) TYPES
// ============================================================================

export interface Rental {
  id: string;
  type: 'rental';
  name: string;
  propertyType: 'apartment' | 'house' | 'condo' | 'studio' | 'penthouse' | 'villa';
  location: Location;
  
  // Pricing
  pricePerMonth: number;
  pricePerNight?: number;
  deposit?: number;
  fees?: {
    cleaning?: number;
    service?: number;
    utilities?: number;
  };
  
  // Specs
  bedrooms: number;
  bathrooms: number;
  size: number; // square meters
  floor?: number;
  maxGuests?: number;
  
  // Features
  furnished: boolean;
  petFriendly: boolean;
  amenities: string[];
  
  // Availability
  availability: 'available' | 'ending_soon' | 'unavailable';
  availableFrom?: Date;
  availableUntil?: Date;
  minimumStay?: number; // days
  
  // Rental Type
  shortTerm: boolean;
  longTerm: boolean;
  
  // Details
  images: string[];
  description?: string;
  rating?: number;
  reviewCount?: number;
  
  // Value Analysis
  marketValue?: number;
  valueScore?: number; // percentage below/above market
  
  // Trip Integration
  addedToTrip: boolean;
  bookingStatus?: 'inquiry' | 'reserved' | 'booked' | 'confirmed';
  checkIn?: Date;
  checkOut?: Date;
  
  // AI Context
  aiReason?: string;
  matchScore?: number;
  saved: boolean;
}

// ============================================================================
// DESTINATION (TOURIST ATTRACTION) TYPES
// ============================================================================

export interface Destination {
  id: string;
  type: 'destination';
  name: string;
  category: 'landmark' | 'museum' | 'park' | 'viewpoint' | 'historical' | 'nature' | 'shopping' | 'other';
  location: Location;
  
  // Timing
  estimatedDuration: number; // minutes
  bestTimeToVisit?: 'morning' | 'afternoon' | 'evening' | 'sunset' | 'anytime';
  openingHours?: {
    [day: string]: { open: string; close: string };
  };
  
  // Pricing
  price: number;
  priceType: 'free' | 'paid' | 'donation';
  ticketUrl?: string;
  
  // Details
  description?: string;
  highlights: string[];
  rating?: number;
  reviewCount?: number;
  visitorsPerDay?: number;
  
  // Features
  tags: string[];
  accessibility: string[];
  facilities: string[];
  
  // Requirements
  reservationRequired: boolean;
  advanceBooking?: number; // days
  
  // Trip Integration
  addedToTrip: boolean;
  tripDate?: string;
  visitTime?: Date;
  
  // AI Context
  aiReason?: string;
  matchScore?: number;
  priority?: 'must_see' | 'recommended' | 'optional';
  saved: boolean;
}

// ============================================================================
// ACTIVITY TYPES (Generic trip activities)
// ============================================================================

export interface Activity {
  id: string;
  type: 'activity';
  name: string;
  category: string;
  location?: Location;
  
  // Timing
  startTime?: Date;
  duration?: number; // minutes
  isFlexible: boolean;
  
  // Pricing
  cost?: number;
  
  // Details
  description?: string;
  notes?: string;
  
  // Trip Integration
  tripDate: string;
  status: EntityStatus;
}

// ============================================================================
// TRAVEL (Transportation) TYPES
// ============================================================================

export interface Travel {
  id: string;
  type: 'travel';
  mode: 'walk' | 'drive' | 'taxi' | 'uber' | 'metro' | 'bus' | 'bike' | 'scooter';
  from: Location;
  to: Location;
  
  // Timing
  departureTime: Date;
  arrivalTime: Date;
  duration: number; // minutes
  
  // Pricing
  cost?: number;
  
  // Details
  distance: Distance;
  route?: any; // Google Maps route object
  
  // Trip Integration
  tripDate: string;
  linkedActivities: string[]; // IDs of activities this connects
}

// ============================================================================
// TRIP & ITINERARY TYPES
// ============================================================================

export type TripEntity = 
  | Restaurant 
  | Event 
  | Rental 
  | Destination 
  | Activity 
  | Travel;

export interface TripDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  dayNumber: number; // Day 1, Day 2, etc.
  
  items: TripEntity[];
  schedule: Schedule;
  
  stats: {
    totalCost: number;
    totalDuration: number; // minutes
    activitiesCount: number;
    travelTime: number; // minutes
    freeTime: number; // minutes
  };
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  
  // Dates
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  duration: number; // days
  
  // Days
  days: TripDay[];
  
  // Budget
  budget: Budget;
  
  // Preferences
  preferences: UserPreferences;
  
  // Status
  status: 'planning' | 'confirmed' | 'in_progress' | 'completed';
  lastModified: Date;
  
  // Metadata
  createdAt: Date;
  createdBy?: string;
  sharedWith?: string[]; // User IDs for collaboration
}

// ============================================================================
// USER PREFERENCES
// ============================================================================

export interface UserPreferences {
  // Dining
  cuisines: string[];
  dietaryRestrictions: string[];
  priceRange: {
    min: number;
    max: number;
  };
  
  // Activities
  interests: string[];
  activityLevel: 'relaxed' | 'moderate' | 'active' | 'intense';
  
  // Travel
  preferredTransport: string[];
  maxWalkingDistance: number; // meters
  
  // Schedule
  pacing: 'relaxed' | 'moderate' | 'packed';
  morningStart: string; // "08:00"
  eveningEnd: string; // "22:00"
  
  // Accommodation
  accommodationType: string[];
  amenitiesRequired: string[];
  
  // General
  language: string;
  currency: string;
  timezone: string;
}

// ============================================================================
// GLOBAL STATE
// ============================================================================

export interface TripState {
  // Current Trip
  currentTrip: Trip | null;
  
  // All Trips
  trips: Trip[];
  
  // Available Items (not yet added to trip)
  availableRestaurants: Restaurant[];
  availableEvents: Event[];
  availableRentals: Rental[];
  availableDestinations: Destination[];
  
  // Saved/Bookmarked Items
  savedItems: {
    restaurants: Restaurant[];
    events: Event[];
    rentals: Rental[];
    destinations: Destination[];
  };
  
  // User Context
  userLocation?: Location;
  userPreferences: UserPreferences;
  
  // UI State
  selectedDate?: string;
  selectedEntity?: TripEntity;
  isLoading: boolean;
  error?: string;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface SearchFilters {
  entityType?: EntityType[];
  priceRange?: { min: number; max: number };
  date?: string;
  location?: string;
  radius?: number; // meters
  tags?: string[];
  availability?: string[];
  sortBy?: 'price' | 'rating' | 'distance' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface AnalyticsData {
  totalCost: number;
  totalDuration: number;
  activitiesPerDay: number;
  averageDailyBudget: number;
  topCategories: { category: string; count: number }[];
  neighborhoods: { name: string; visits: number }[];
}
