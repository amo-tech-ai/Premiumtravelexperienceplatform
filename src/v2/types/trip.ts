/**
 * TRIP SYSTEM V2 - TYPE DEFINITIONS
 * 
 * Clean-slate type system for V2 architecture
 * Inspired by Mindtrip, built for mobile-first, AI-native experiences
 */

// ============================================================================
// CORE TRIP TYPES
// ============================================================================

export interface TripV2 {
  // Core Identity
  id: string;
  userId: string; // Creator
  
  // Basic Info
  destination: {
    city: string;
    country: string;
    region?: string;
    coordinates?: { lat: number; lng: number };
  };
  
  // Timing
  startDate: string; // ISO date
  endDate: string; // ISO date
  duration: number; // Calculated days
  timezone: string;
  
  // Travelers
  travelers: {
    adults: number;
    children: number;
    childAges?: number[];
    type: 'solo' | 'couple' | 'family' | 'friends';
  };
  
  // Budget
  budget: {
    total: number;
    currency: string;
    type: 'total' | 'per_person';
    includes: ('accommodation' | 'activities' | 'food' | 'flights')[];
    spent: number; // Calculated
  };
  
  // Preferences
  interests: string[]; // 'food', 'culture', 'nature', etc.
  pace: 'relaxed' | 'moderate' | 'packed';
  style: 'luxury' | 'comfort' | 'budget';
  dietary?: string[];
  
  // Status
  status: 'draft' | 'planning' | 'booked' | 'active' | 'completed' | 'archived';
  progress: number; // 0-100
  
  // Collaboration
  collaborators?: string[]; // User IDs
  permissions: Record<string, 'owner' | 'editor' | 'viewer'>;
  
  // Metadata
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  coverImage?: string;
}

// ============================================================================
// ITINERARY TYPES
// ============================================================================

export interface ItineraryV2 {
  tripId: string;
  days: DayV2[];
}

export interface DayV2 {
  dayNumber: number; // 1-30
  date: string; // ISO date
  title?: string; // "Beach Day", "Food Tour"
  items: ItineraryItemV2[];
  totalCost: number; // Calculated
  totalDuration: number; // Minutes, calculated
}

export type ItemType = 
  | 'restaurant'
  | 'activity'
  | 'attraction'
  | 'stay'
  | 'transport'
  | 'custom';

export interface ItineraryItemV2 {
  id: string;
  type: ItemType;
  
  // Core
  name: string;
  description?: string;
  
  // Timing
  startTime: string; // HH:MM
  endTime?: string; // HH:MM
  duration?: number; // Minutes
  
  // Location
  location?: {
    address: string;
    neighborhood: string;
    coordinates: { lat: number; lng: number };
  };
  
  // Cost
  cost?: number;
  currency?: string;
  costType?: 'per_person' | 'total';
  
  // Booking
  bookingStatus: 'none' | 'required' | 'requested' | 'confirmed';
  bookingUrl?: string;
  confirmationNumber?: string;
  
  // Type-specific details
  details: ItemDetails;
  
  // Source
  addedBy: 'user' | 'ai';
  sourceId?: string; // From explore database
  
  // Metadata
  createdAt: string;
  notes?: string;
}

export interface ItemDetails {
  // Restaurant
  cuisine?: string;
  rating?: number;
  priceLevel?: '$' | '$$' | '$$$' | '$$$$';
  reservationRequired?: boolean;
  
  // Activity/Attraction
  ticketsRequired?: boolean;
  openingHours?: string;
  website?: string;
  
  // Transport
  mode?: 'walk' | 'drive' | 'taxi' | 'metro' | 'bus';
  distance?: number; // Meters
  
  // Any
  [key: string]: unknown;
}

// ============================================================================
// IDEAS & INBOX
// ============================================================================

export interface IdeasInboxV2 {
  tripId: string;
  items: IdeaItemV2[];
  groups: AIGroupV2[];
}

export interface IdeaItemV2 {
  id: string;
  name: string;
  type: ItemType;
  location?: {
    neighborhood: string;
    coordinates: { lat: number; lng: number };
  };
  cost?: number;
  rating?: number;
  details: ItemDetails;
  savedAt: string; // ISO timestamp
  source: 'explore' | 'ai' | 'manual';
}

export interface AIGroupV2 {
  id: string;
  name: string; // "Poblado Restaurants", "Museum Day"
  itemIds: string[];
  groupingReason: string; // "Same neighborhood", "Same theme"
  suggestion: string; // "Add all to Saturday dinner"
  confidence: number; // 0-1
  createdAt: string;
}

// ============================================================================
// AI CONVERSATION
// ============================================================================

export interface ConversationV2 {
  tripId: string;
  messages: MessageV2[];
}

export interface MessageV2 {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  
  // AI-specific
  intent?: 'plan_day' | 'optimize' | 'search' | 'question';
  suggestions?: SuggestionV2[];
  appliedChanges?: ChangeLogV2[];
}

export interface SuggestionV2 {
  id: string;
  type: 'itinerary' | 'item' | 'optimization';
  preview: unknown; // What will change
  reasoning: string; // Why suggested
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ChangeLogV2 {
  id: string;
  action: 'add' | 'remove' | 'update' | 'reorder';
  entityType: string;
  entityId: string;
  timestamp: string;
  userId: string;
  changes: Record<string, unknown>;
}

// ============================================================================
// WIZARD TYPES
// ============================================================================

export interface WizardStateV2 {
  currentStep: number; // 1-5
  totalSteps: number; // 5
  canProceed: boolean;
  data: Partial<TripV2>;
  errors: Record<string, string>;
}

export interface WizardStepV2 {
  step: number;
  title: string;
  fields: string[];
  validation: (data: Partial<TripV2>) => boolean;
}

// ============================================================================
// UI STATE
// ============================================================================

export interface TripV2State {
  // Current Trip
  currentTrip: TripV2 | null;
  currentItinerary: ItineraryV2 | null;
  currentIdeas: IdeasInboxV2 | null;
  currentConversation: ConversationV2 | null;
  
  // All Trips
  trips: TripV2[];
  
  // UI State
  selectedDay?: number;
  selectedItem?: ItineraryItemV2;
  viewMode: 'overview' | 'itinerary' | 'ideas' | 'details';
  
  // Loading & Errors
  isLoading: boolean;
  error: string | null;
  
  // Wizard
  wizardState: WizardStateV2 | null;
}

// ============================================================================
// CONTEXT ACTIONS
// ============================================================================

export type TripV2Action =
  | { type: 'SET_TRIPS'; payload: TripV2[] }
  | { type: 'SET_CURRENT_TRIP'; payload: TripV2 }
  | { type: 'CREATE_TRIP'; payload: TripV2 }
  | { type: 'UPDATE_TRIP'; payload: Partial<TripV2> }
  | { type: 'DELETE_TRIP'; payload: string }
  | { type: 'SET_ITINERARY'; payload: ItineraryV2 }
  | { type: 'ADD_ITINERARY_ITEM'; payload: { dayNumber: number; item: ItineraryItemV2 } }
  | { type: 'REMOVE_ITINERARY_ITEM'; payload: { dayNumber: number; itemId: string } }
  | { type: 'UPDATE_ITINERARY_ITEM'; payload: { dayNumber: number; itemId: string; updates: Partial<ItineraryItemV2> } }
  | { type: 'REORDER_ITINERARY_ITEMS'; payload: { dayNumber: number; items: ItineraryItemV2[] } }
  | { type: 'ADD_IDEA'; payload: IdeaItemV2 }
  | { type: 'REMOVE_IDEA'; payload: string }
  | { type: 'PROMOTE_IDEA_TO_ITINERARY'; payload: { ideaId: string; dayNumber: number } }
  | { type: 'ADD_MESSAGE'; payload: MessageV2 }
  | { type: 'SET_SELECTED_DAY'; payload: number }
  | { type: 'SET_VIEW_MODE'; payload: TripV2State['viewMode'] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'START_WIZARD'; payload: Partial<TripV2> }
  | { type: 'UPDATE_WIZARD'; payload: Partial<WizardStateV2> }
  | { type: 'COMPLETE_WIZARD'; payload: TripV2 };

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface OptimizationSuggestion {
  type: 'reorder' | 'time_adjust' | 'remove' | 'add_buffer';
  dayNumber: number;
  itemIds: string[];
  reasoning: string;
  improvement: {
    timeSaved?: number; // Minutes
    costSaved?: number;
    conflictsResolved?: number;
  };
}

export interface BudgetBreakdown {
  accommodation: number;
  activities: number;
  food: number;
  transport: number;
  other: number;
  total: number;
  remaining: number;
}

export interface TripStatistics {
  totalDays: number;
  totalItems: number;
  totalCost: number;
  avgItemsPerDay: number;
  budgetUsed: number; // Percentage
  topCategories: { category: string; count: number }[];
  neighborhoods: { name: string; visits: number }[];
}