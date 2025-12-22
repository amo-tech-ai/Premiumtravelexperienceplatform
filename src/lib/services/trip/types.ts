/**
 * Trip Service Types
 * TypeScript definitions for trip-related data structures
 */

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget?: number;
  travelers?: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface TripDay {
  id: string;
  trip_id: string;
  day_number: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface TripItem {
  id: string;
  day_id: string;
  title: string;
  type: 'food' | 'activity' | 'stay' | 'logistics' | 'transport';
  time: string;
  duration: string;
  cost?: number;
  notes?: string;
  image_url?: string;
  booking_status?: 'pending' | 'confirmed' | 'cancelled';
  booking_reference?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface TripDayWithItems extends TripDay {
  items: TripItem[];
}

export interface TripWithDetails extends Trip {
  days: TripDayWithItems[];
}

export interface CreateTripInput {
  user_id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget?: number;
  travelers?: number;
  status?: 'draft' | 'active';
}

export interface UpdateTripInput {
  title?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  travelers?: number;
  status?: 'draft' | 'active' | 'completed' | 'cancelled';
}

export interface CreateTripDayInput {
  trip_id: string;
  day_number: number;
  date: string;
}

export interface CreateTripItemInput {
  day_id: string;
  title: string;
  type: 'food' | 'activity' | 'stay' | 'logistics' | 'transport';
  time: string;
  duration: string;
  cost?: number;
  notes?: string;
  image_url?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
}

export interface UpdateTripItemInput {
  title?: string;
  type?: 'food' | 'activity' | 'stay' | 'logistics' | 'transport';
  time?: string;
  duration?: string;
  cost?: number;
  notes?: string;
  image_url?: string;
  booking_status?: 'pending' | 'confirmed' | 'cancelled';
  booking_reference?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
}

export interface TripStatistics {
  totalCost: number;
  averageCostPerDay: number;
  activitiesCount: number;
  foodCount: number;
  staysCount: number;
  transportCount: number;
  confirmedBookings: number;
  pendingBookings: number;
  daysCount: number;
}

export interface TripBudget {
  total: number;
  spent: number;
  remaining: number;
  breakdown: {
    food: number;
    activities: number;
    stays: number;
    transport: number;
    logistics: number;
  };
}
