/**
 * Shared AI Types
 * Common interfaces for AI agents and services
 */

// --- AGENT TYPES ---

export type AgentType =
  | 'local_scout'
  | 'dining_orchestrator'
  | 'itinerary_optimizer'
  | 'budget_guardian'
  | 'booking_assistant'
  | 'event_curator';

export type AgentStatus = 'idle' | 'thinking' | 'processing' | 'complete' | 'error';

export interface AgentCapability {
  name: string;
  description: string;
  examples: string[];
}

export interface AgentConfig {
  type: AgentType;
  name: string;
  description: string;
  capabilities: AgentCapability[];
  priority: number;
  enabled: boolean;
}

// --- REQUEST/RESPONSE TYPES ---

export interface AgentRequest {
  id: string;
  agentType: AgentType;
  intent: string;
  context: AgentContext;
  parameters?: Record<string, any>;
  priority?: 'low' | 'normal' | 'high';
  timestamp: number;
}

export interface AgentResponse {
  id: string;
  requestId: string;
  agentType: AgentType;
  status: AgentStatus;
  data: any;
  suggestions?: AgentSuggestion[];
  confidence?: number;
  error?: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

export interface AgentSuggestion {
  id: string;
  type: 'action' | 'information' | 'warning';
  title: string;
  description: string;
  action?: {
    label: string;
    handler: () => void | Promise<void>;
  };
  priority?: 'low' | 'normal' | 'high';
}

// --- CONTEXT TYPES ---

export interface AgentContext {
  tripId?: string;
  userId?: string;
  location?: {
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  dates?: {
    startDate: string;
    endDate: string;
  };
  budget?: {
    total: number;
    remaining: number;
    currency: string;
  };
  travelers?: {
    count: number;
    types?: ('adult' | 'child' | 'infant')[];
  };
  preferences?: UserPreferences;
  currentItinerary?: any;
}

export interface UserPreferences {
  cuisines?: string[];
  dietaryRestrictions?: string[];
  activityTypes?: string[];
  priceRange?: 'budget' | 'moderate' | 'luxury';
  pace?: 'relaxed' | 'moderate' | 'packed';
  accessibility?: string[];
  languages?: string[];
}

// --- EVENT DISCOVERY TYPES ---

export interface EventDiscoveryRequest {
  location: string;
  startDate: string;
  endDate: string;
  categories?: string[];
  maxResults?: number;
  priceRange?: { min: number; max: number };
}

export interface EventResult {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time?: string;
  duration?: string;
  location: {
    name: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  price?: {
    amount: number;
    currency: string;
    type: 'free' | 'paid' | 'donation';
  };
  image?: string;
  url?: string;
  source: string;
  relevanceScore: number;
}

// --- DINING TYPES ---

export interface DiningRequest {
  location: string;
  cuisine?: string[];
  priceRange?: 'budget' | 'moderate' | 'luxury';
  dietary?: string[];
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  occasion?: string;
  maxResults?: number;
}

export interface RestaurantResult {
  id: string;
  name: string;
  description?: string;
  cuisine: string[];
  priceLevel: number; // 1-4
  rating?: number;
  reviewCount?: number;
  location: {
    address: string;
    neighborhood?: string;
    coordinates?: { lat: number; lng: number };
  };
  hours?: {
    open: string;
    close: string;
  };
  image?: string;
  phone?: string;
  reservationUrl?: string;
  features?: string[];
  dietaryOptions?: string[];
  relevanceScore: number;
}

// --- OPTIMIZATION TYPES ---

export interface OptimizationRequest {
  itinerary: any[];
  criteria: OptimizationCriteria;
}

export interface OptimizationCriteria {
  minimizeDistance?: boolean;
  minimizeTime?: boolean;
  respectTimeConstraints?: boolean;
  groupByArea?: boolean;
  preferredStartTime?: string;
  preferredEndTime?: string;
}

export interface OptimizationResult {
  originalItinerary: any[];
  optimizedItinerary: any[];
  improvements: {
    distanceSaved: number;
    timeSaved: number;
    conflictsResolved: number;
  };
  suggestions: string[];
  confidence: number;
}

// --- CONFLICT TYPES ---

export interface Conflict {
  id: string;
  type: 'time' | 'location' | 'budget' | 'capacity';
  severity: 'low' | 'medium' | 'high';
  items: string[];
  description: string;
  suggestion?: string;
  autoFixAvailable?: boolean;
}

export interface ConflictResolution {
  conflictId: string;
  action: 'ignore' | 'fix' | 'reschedule';
  newSchedule?: any;
}

// --- BUDGET TYPES ---

export interface BudgetAlert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  message: string;
  threshold: number;
  currentSpend: number;
  recommendations?: string[];
}

export interface BudgetForecast {
  totalBudget: number;
  projectedSpend: number;
  confidence: number;
  breakdown: {
    category: string;
    budgeted: number;
    spent: number;
    projected: number;
  }[];
  alerts: BudgetAlert[];
}

// --- BOOKING TYPES ---

export interface BookingRequest {
  type: 'restaurant' | 'activity' | 'accommodation' | 'transport';
  itemId: string;
  date: string;
  time?: string;
  partySize?: number;
  specialRequests?: string;
}

export interface BookingResult {
  id: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmationNumber?: string;
  details: any;
  provider: string;
  error?: string;
}

// --- INTENT TYPES ---

export type UserIntent =
  | 'discover_events'
  | 'find_restaurants'
  | 'optimize_route'
  | 'check_budget'
  | 'make_booking'
  | 'get_recommendations'
  | 'resolve_conflicts'
  | 'general_question';

export interface IntentClassification {
  intent: UserIntent;
  confidence: number;
  entities: Record<string, any>;
  suggestedAgents: AgentType[];
}

// --- AGENT COORDINATION TYPES ---

export interface AgentTask {
  id: string;
  agentType: AgentType;
  action: string;
  parameters: any;
  dependencies?: string[]; // IDs of tasks that must complete first
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export interface OrchestrationPlan {
  id: string;
  userRequest: string;
  tasks: AgentTask[];
  expectedDuration: number;
  status: 'planning' | 'executing' | 'completed' | 'failed';
}

// --- ERROR TYPES ---

export interface AgentError {
  code: string;
  message: string;
  agentType?: AgentType;
  recoverable: boolean;
  retryAfter?: number;
  details?: any;
}

// --- CACHE TYPES ---

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  hits: number;
}

export interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  enableStats: boolean;
}

// --- EXPORT ALL ---

export default {};
