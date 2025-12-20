/**
 * Database Types for Local Scout Trip OS
 * Generated from Supabase schema (Doc 04)
 * 
 * To regenerate: npx supabase gen types typescript --local > lib/supabase/types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          preferences: Json | null
          onboarding_completed: boolean
          onboarding_step: number | null
          oauth_provider: string | null
          last_login_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          preferences?: Json | null
          onboarding_completed?: boolean
          onboarding_step?: number | null
          oauth_provider?: string | null
          last_login_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          preferences?: Json | null
          onboarding_completed?: boolean
          onboarding_step?: number | null
          oauth_provider?: string | null
          last_login_at?: string | null
        }
      }
      trips: {
        Row: {
          id: string
          user_id: string
          title: string
          destination_city: string
          destination_country: string | null
          start_date: string
          end_date: string
          budget_total: number | null
          budget_spent: number
          status: 'planning' | 'confirmed' | 'in_progress' | 'completed'
          cover_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          destination_city: string
          destination_country?: string | null
          start_date: string
          end_date: string
          budget_total?: number | null
          budget_spent?: number
          status?: 'planning' | 'confirmed' | 'in_progress' | 'completed'
          cover_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          destination_city?: string
          destination_country?: string | null
          start_date?: string
          end_date?: string
          budget_total?: number | null
          budget_spent?: number
          status?: 'planning' | 'confirmed' | 'in_progress' | 'completed'
          cover_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      itinerary_days: {
        Row: {
          id: string
          trip_id: string
          day_number: number
          date: string
          title: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          day_number: number
          date: string
          title?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          day_number?: number
          date?: string
          title?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      itinerary_items: {
        Row: {
          id: string
          day_id: string
          type: 'activity' | 'dining' | 'transport' | 'accommodation' | 'event'
          title: string
          description: string | null
          start_time: string | null
          end_time: string | null
          duration_minutes: number | null
          location_name: string | null
          location_lat: number | null
          location_lng: number | null
          address: string | null
          cost: number | null
          booking_status: 'not_booked' | 'pending' | 'confirmed' | 'canceled'
          booking_reference: string | null
          order_index: number
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          day_id: string
          type: 'activity' | 'dining' | 'transport' | 'accommodation' | 'event'
          title: string
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          duration_minutes?: number | null
          location_name?: string | null
          location_lat?: number | null
          location_lng?: number | null
          address?: string | null
          cost?: number | null
          booking_status?: 'not_booked' | 'pending' | 'confirmed' | 'canceled'
          booking_reference?: string | null
          order_index?: number
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          day_id?: string
          type?: 'activity' | 'dining' | 'transport' | 'accommodation' | 'event'
          title?: string
          description?: string | null
          start_time?: string | null
          end_time?: string | null
          duration_minutes?: number | null
          location_name?: string | null
          location_lat?: number | null
          location_lng?: number | null
          address?: string | null
          cost?: number | null
          booking_status?: 'not_booked' | 'pending' | 'confirmed' | 'canceled'
          booking_reference?: string | null
          order_index?: number
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          trip_id: string | null
          title: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trip_id?: string | null
          title?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trip_id?: string | null
          title?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          intent: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          intent?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          intent?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          dietary_restrictions: string[] | null
          cuisine_preferences: string[] | null
          activity_pace: 'relaxed' | 'moderate' | 'fast' | null
          budget_level: 'budget' | 'mid_range' | 'luxury' | null
          interests: string[] | null
          travel_style: string[] | null
          accessibility_needs: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          dietary_restrictions?: string[] | null
          cuisine_preferences?: string[] | null
          activity_pace?: 'relaxed' | 'moderate' | 'fast' | null
          budget_level?: 'budget' | 'mid_range' | 'luxury' | null
          interests?: string[] | null
          travel_style?: string[] | null
          accessibility_needs?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          dietary_restrictions?: string[] | null
          cuisine_preferences?: string[] | null
          activity_pace?: 'relaxed' | 'moderate' | 'fast' | null
          budget_level?: 'budget' | 'mid_range' | 'luxury' | null
          interests?: string[] | null
          travel_style?: string[] | null
          accessibility_needs?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for common operations
export type User = Database['public']['Tables']['users']['Row'];
export type Trip = Database['public']['Tables']['trips']['Row'];
export type ItineraryDay = Database['public']['Tables']['itinerary_days']['Row'];
export type ItineraryItem = Database['public']['Tables']['itinerary_items']['Row'];
export type AIConversation = Database['public']['Tables']['ai_conversations']['Row'];
export type AIMessage = Database['public']['Tables']['ai_messages']['Row'];
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];

// Insert types (for creating new records)
export type InsertTrip = Database['public']['Tables']['trips']['Insert'];
export type InsertItineraryDay = Database['public']['Tables']['itinerary_days']['Insert'];
export type InsertItineraryItem = Database['public']['Tables']['itinerary_items']['Insert'];
export type InsertAIMessage = Database['public']['Tables']['ai_messages']['Insert'];

// Update types (for modifying existing records)
export type UpdateTrip = Database['public']['Tables']['trips']['Update'];
export type UpdateItineraryItem = Database['public']['Tables']['itinerary_items']['Update'];
