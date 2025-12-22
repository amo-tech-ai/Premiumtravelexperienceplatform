/**
 * Trip Creation & Management Types
 * 
 * Centralized type definitions for trip-related functionality
 * Used across TripCreateModal, API layer, and trip management components
 */

// ============================================================================
// FORM DATA TYPES
// ============================================================================

export interface TripFormData {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  travelers: number;
  children: number;
  budget: string; // 'any' | '$' | '$$' | '$$$' | '$$$$'
}

export interface TripFormErrors {
  destination?: string;
  startDate?: string;
  endDate?: string;
  travelers?: string;
  children?: string;
  budget?: string;
  general?: string;
}

// ============================================================================
// API PAYLOAD TYPES
// ============================================================================

export interface TripCreationPayload {
  title: string;
  destination: string;
  start_date: string; // ISO format YYYY-MM-DD
  end_date: string;   // ISO format YYYY-MM-DD
  travelers?: number;
  children?: number;
  budget?: string;
  status?: 'draft' | 'active' | 'completed' | 'archived';
}

export interface TripUpdatePayload {
  title?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  cover_image?: string;
  collaborators?: string[];
  status?: 'draft' | 'active' | 'completed' | 'archived';
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export interface DateSelectProps {
  onClose: () => void;
}

export interface TravelersSelectProps {
  count: number;
  onChange: (count: number) => void;
  onClose: () => void;
}

export interface BudgetSelectProps {
  selected: string;
  onChange: (budget: string) => void;
  onClose: () => void;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type BudgetLevel = 'any' | '$' | '$$' | '$$$' | '$$$$';

export interface BudgetOption {
  label: string;
  val: BudgetLevel;
  icon?: string;
}