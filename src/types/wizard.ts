/**
 * AI Concierge Wizard - Global State Schema
 * Definition of the single source of truth for Wizard, Results, Map, and Chat.
 */

// --- 1. User Intent ---
export type UserIntent = 
  | 'GENERAL' 
  | 'DINING' 
  | 'EVENTS' 
  | 'STAYS' 
  | 'TOURIST'
  | 'LOCATIONS'
  | 'GUIDES';

// --- 2. Filters ---
export interface DateRange {
  start: Date | null;
  end: Date | null;
  flexible?: boolean; // e.g. "This Weekend"
  label?: string;     // e.g. "Tonight"
}

export interface LocationFilter {
  lat: number;
  lng: number;
  radius: number; // in meters
  neighborhoods?: string[];
  address?: string;
}

export interface BudgetFilter {
  min: number;
  max: number;
  currency: 'USD' | 'COP';
}

export interface FilterState {
  intent: UserIntent;
  tags: string[]; // e.g., "Romantic", "Rooftop"
  dateRange: DateRange;
  budget: BudgetFilter;
  location: LocationFilter | null;
  guests: number;
  query?: string; // Natural language override
}

// --- 3. Results (Venues/Events/Properties) ---
export type ResultType = 'RESTAURANT' | 'EVENT' | 'PROPERTY' | 'EXPERIENCE';

export interface AIAnalysis {
  matchScore: number; // 0-100
  reasoning: string;  // "Perfect because you asked for a view..."
  tags: string[];
}

export interface Venue {
  id: string;
  type: ResultType;
  name: string;
  description: string;
  shortDescription: string;
  images: string[];
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4; // $, $$, $$$, $$$$
  location: {
    address: string;
    lat: number;
    lng: number;
    neighborhood: string;
  };
  metadata: {
    [key: string]: any; // Flexible for specific types (e.g. bedrooms for property)
  };
  ai: AIAnalysis;
}

// --- 4. UI State ---
export interface UIState {
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
  isLoading: boolean;
  viewMode: 'MAP' | 'LIST' | 'SPLIT';
  activeResultId: string | null; // For highlighting on map/list
  isChatOpen: boolean;
}

// --- 5. AI Actions/Events ---
// Actions that the AI (Chat) can trigger to update the App State
export type AIActionType = 
  | 'SET_INTENT' 
  | 'UPDATE_FILTERS' 
  | 'SET_RESULTS' 
  | 'NAVIGATE_TO_STEP' 
  | 'TOGGLE_VIEW_MODE'
  | 'SELECT_RESULT';

export interface AIEvent {
  type: AIActionType;
  payload: any;
  timestamp: number;
}

// --- Global Context Interface ---
export interface WizardContextType {
  // State
  filters: FilterState;
  results: Venue[];
  ui: UIState;
  
  // Actions
  setIntent: (intent: UserIntent) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  setResults: (results: Venue[]) => void;
  setUI: (ui: Partial<UIState>) => void;
  handleAIEvent: (event: AIEvent) => void;
  resetWizard: () => void;
  
  // Favorites
  savedIds: string[];
  toggleSaved: (id: string) => void;
}
