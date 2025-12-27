/**
 * TRIP V2 CONTEXT
 * 
 * State management for V2 Trip System
 * Completely isolated from V1
 */

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { TripV2, TripV2Action, ItineraryItemV2 } from '../types';
import { mockTrips } from '../data/mockDataV2';
import { useAnalyticsV2 } from './AnalyticsV2Context';

interface TripV2ContextType {
  state: TripV2State;
  createTrip: (trip: TripV2) => void;
  updateTrip: (tripId: string, updates: Partial<TripV2>) => void;
  deleteTrip: (tripId: string) => void;
  setCurrentTrip: (tripId: string | null) => void;
  addItineraryItem: (dayNumber: number, item: ItineraryItemV2) => void;
  removeItineraryItem: (dayNumber: number, itemId: string) => void;
  updateItineraryItem: (dayNumber: number, itemId: string, updates: Partial<ItineraryItemV2>) => void;
  reorderItineraryItems: (dayNumber: number, reorderedItems: ItineraryItemV2[]) => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: TripV2State = {
  currentTrip: null,
  currentItinerary: null,
  currentIdeas: null,
  currentConversation: null,
  trips: [],
  selectedDay: undefined,
  selectedItem: undefined,
  viewMode: 'overview',
  isLoading: false,
  error: null,
  wizardState: null,
};

// ============================================================================
// REDUCER
// ============================================================================

function tripV2Reducer(state: TripV2State, action: TripV2Action): TripV2State {
  switch (action.type) {
    case 'SET_TRIPS':
      return { ...state, trips: action.payload, isLoading: false };
    
    case 'SET_CURRENT_TRIP':
      return {
        ...state,
        currentTrip: action.payload,
        currentItinerary: null, // Will be loaded separately
        currentIdeas: null,
        currentConversation: null,
        isLoading: false,
      };
    
    case 'CREATE_TRIP': {
      const newTrips = [...state.trips, action.payload];
      // Save to localStorage
      localStorage.setItem('v2-trips', JSON.stringify(newTrips));
      return {
        ...state,
        trips: newTrips,
        currentTrip: action.payload,
        isLoading: false,
      };
    }
    
    case 'UPDATE_TRIP': {
      if (!state.currentTrip) return state;
      const updated = { ...state.currentTrip, ...action.payload, updatedAt: new Date().toISOString() };
      const updatedTrips = state.trips.map(t => t.id === updated.id ? updated : t);
      localStorage.setItem('v2-trips', JSON.stringify(updatedTrips));
      return {
        ...state,
        currentTrip: updated,
        trips: updatedTrips,
      };
    }
    
    case 'DELETE_TRIP': {
      const filtered = state.trips.filter(t => t.id !== action.payload);
      localStorage.setItem('v2-trips', JSON.stringify(filtered));
      return {
        ...state,
        trips: filtered,
        currentTrip: state.currentTrip?.id === action.payload ? null : state.currentTrip,
      };
    }
    
    case 'SET_ITINERARY':
      return { ...state, currentItinerary: action.payload };
    
    case 'ADD_ITINERARY_ITEM': {
      if (!state.currentItinerary) return state;
      const { dayNumber, item } = action.payload;
      const updatedDays = state.currentItinerary.days.map(day => {
        if (day.dayNumber === dayNumber) {
          const updatedItems = [...day.items, item];
          return {
            ...day,
            items: updatedItems,
            totalCost: updatedItems.reduce((sum, i) => sum + (i.cost || 0), 0),
            totalDuration: updatedItems.reduce((sum, i) => sum + (i.duration || 0), 0),
          };
        }
        return day;
      });
      const updated = { ...state.currentItinerary, days: updatedDays };
      // Save to localStorage
      localStorage.setItem(`v2-itinerary-${state.currentItinerary.tripId}`, JSON.stringify(updated));
      return { ...state, currentItinerary: updated };
    }
    
    case 'REMOVE_ITINERARY_ITEM': {
      if (!state.currentItinerary) return state;
      const { dayNumber, itemId } = action.payload;
      const updatedDays = state.currentItinerary.days.map(day => {
        if (day.dayNumber === dayNumber) {
          const updatedItems = day.items.filter(i => i.id !== itemId);
          return {
            ...day,
            items: updatedItems,
            totalCost: updatedItems.reduce((sum, i) => sum + (i.cost || 0), 0),
            totalDuration: updatedItems.reduce((sum, i) => sum + (i.duration || 0), 0),
          };
        }
        return day;
      });
      const updated = { ...state.currentItinerary, days: updatedDays };
      localStorage.setItem(`v2-itinerary-${state.currentItinerary.tripId}`, JSON.stringify(updated));
      return { ...state, currentItinerary: updated };
    }
    
    case 'UPDATE_ITINERARY_ITEM': {
      if (!state.currentItinerary) return state;
      const { dayNumber, itemId, updates } = action.payload;
      const updatedDays = state.currentItinerary.days.map(day => {
        if (day.dayNumber === dayNumber) {
          const updatedItems = day.items.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          );
          return {
            ...day,
            items: updatedItems,
            totalCost: updatedItems.reduce((sum, i) => sum + (i.cost || 0), 0),
            totalDuration: updatedItems.reduce((sum, i) => sum + (i.duration || 0), 0),
          };
        }
        return day;
      });
      const updated = { ...state.currentItinerary, days: updatedDays };
      localStorage.setItem(`v2-itinerary-${state.currentItinerary.tripId}`, JSON.stringify(updated));
      return { ...state, currentItinerary: updated };
    }
    
    case 'REORDER_ITINERARY_ITEMS': {
      if (!state.currentItinerary) return state;
      const { dayNumber, items } = action.payload;
      const updatedDays = state.currentItinerary.days.map(day =>
        day.dayNumber === dayNumber ? { ...day, items } : day
      );
      const updated = { ...state.currentItinerary, days: updatedDays };
      localStorage.setItem(`v2-itinerary-${state.currentItinerary.tripId}`, JSON.stringify(updated));
      return { ...state, currentItinerary: updated };
    }
    
    case 'ADD_IDEA': {
      if (!state.currentIdeas) return state;
      const updatedIdeas = {
        ...state.currentIdeas,
        items: [...state.currentIdeas.items, action.payload],
      };
      localStorage.setItem(`v2-ideas-${state.currentIdeas.tripId}`, JSON.stringify(updatedIdeas));
      return { ...state, currentIdeas: updatedIdeas };
    }
    
    case 'REMOVE_IDEA': {
      if (!state.currentIdeas) return state;
      const updatedIdeas = {
        ...state.currentIdeas,
        items: state.currentIdeas.items.filter(i => i.id !== action.payload),
      };
      localStorage.setItem(`v2-ideas-${state.currentIdeas.tripId}`, JSON.stringify(updatedIdeas));
      return { ...state, currentIdeas: updatedIdeas };
    }
    
    case 'PROMOTE_IDEA_TO_ITINERARY': {
      // This would remove from ideas and add to itinerary
      // Simplified for now
      return state;
    }
    
    case 'ADD_MESSAGE': {
      if (!state.currentConversation) return state;
      const updated = {
        ...state.currentConversation,
        messages: [...state.currentConversation.messages, action.payload],
      };
      localStorage.setItem(`v2-conversation-${state.currentConversation.tripId}`, JSON.stringify(updated));
      return { ...state, currentConversation: updated };
    }
    
    case 'SET_SELECTED_DAY':
      return { ...state, selectedDay: action.payload };
    
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'START_WIZARD':
      return {
        ...state,
        wizardState: {
          currentStep: 1,
          totalSteps: 5,
          canProceed: false,
          data: action.payload,
          errors: {},
        },
      };
    
    case 'UPDATE_WIZARD':
      if (!state.wizardState) return state;
      return {
        ...state,
        wizardState: { ...state.wizardState, ...action.payload },
      };
    
    case 'COMPLETE_WIZARD':
      return {
        ...state,
        wizardState: null,
        // CREATE_TRIP will be dispatched next
      };
    
    default:
      return state;
  }
}

// ============================================================================
// CONTEXT
// ============================================================================

const TripV2Context = createContext<TripV2ContextType | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

export function TripV2Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tripV2Reducer, initialState);
  
  // Load trips from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('v2-trips');
    if (stored) {
      try {
        const trips = JSON.parse(stored) as TripV2[];
        dispatch({ type: 'SET_TRIPS', payload: trips });
      } catch (error) {
        console.error('Failed to load V2 trips:', error);
      }
    }
  }, []);
  
  // Load itinerary when currentTrip changes
  useEffect(() => {
    if (state.currentTrip) {
      const stored = localStorage.getItem(`v2-itinerary-${state.currentTrip.id}`);
      if (stored) {
        try {
          const itinerary = JSON.parse(stored) as ItineraryV2;
          dispatch({ type: 'SET_ITINERARY', payload: itinerary });
        } catch (error) {
          console.error('Failed to load itinerary:', error);
          // Create empty itinerary
          const emptyItinerary: ItineraryV2 = {
            tripId: state.currentTrip.id,
            days: Array.from({ length: state.currentTrip.duration }, (_, i) => ({
              dayNumber: i + 1,
              date: new Date(new Date(state.currentTrip.startDate).getTime() + i * 86400000).toISOString().split('T')[0],
              items: [],
              totalCost: 0,
              totalDuration: 0,
            })),
          };
          dispatch({ type: 'SET_ITINERARY', payload: emptyItinerary });
        }
      } else {
        // Create empty itinerary
        const emptyItinerary: ItineraryV2 = {
          tripId: state.currentTrip.id,
          days: Array.from({ length: state.currentTrip.duration }, (_, i) => ({
            dayNumber: i + 1,
            date: new Date(new Date(state.currentTrip.startDate).getTime() + i * 86400000).toISOString().split('T')[0],
            items: [],
            totalCost: 0,
            totalDuration: 0,
          })),
        };
        dispatch({ type: 'SET_ITINERARY', payload: emptyItinerary });
      }
      
      // Load ideas
      const storedIdeas = localStorage.getItem(`v2-ideas-${state.currentTrip.id}`);
      if (storedIdeas) {
        try {
          const ideas = JSON.parse(storedIdeas);
          dispatch({ type: 'SET_ITINERARY', payload: ideas }); // Need to add SET_IDEAS action
        } catch (error) {
          console.error('Failed to load ideas:', error);
        }
      }
      
      // Load conversation
      const storedConv = localStorage.getItem(`v2-conversation-${state.currentTrip.id}`);
      if (storedConv) {
        try {
          const conversation = JSON.parse(storedConv);
          // Need to add SET_CONVERSATION action
        } catch (error) {
          console.error('Failed to load conversation:', error);
        }
      }
    }
  }, [state.currentTrip?.id]);
  
  // Convenience methods
  const createTrip = (trip: TripV2) => {
    dispatch({ type: 'CREATE_TRIP', payload: trip });
  };
  
  const updateTrip = (tripId: string, updates: Partial<TripV2>) => {
    dispatch({ type: 'UPDATE_TRIP', payload: updates });
  };
  
  const deleteTrip = (tripId: string) => {
    dispatch({ type: 'DELETE_TRIP', payload: tripId });
  };
  
  const setCurrentTrip = (tripId: string | null) => {
    const trip = state.trips.find(t => t.id === tripId);
    if (trip) {
      dispatch({ type: 'SET_CURRENT_TRIP', payload: trip });
    }
  };
  
  const addItineraryItem = (dayNumber: number, item: ItineraryItemV2) => {
    dispatch({ type: 'ADD_ITINERARY_ITEM', payload: { dayNumber, item } });
  };
  
  const removeItineraryItem = (dayNumber: number, itemId: string) => {
    dispatch({ type: 'REMOVE_ITINERARY_ITEM', payload: { dayNumber, itemId } });
  };
  
  const updateItineraryItem = (dayNumber: number, itemId: string, updates: Partial<ItineraryItemV2>) => {
    dispatch({ type: 'UPDATE_ITINERARY_ITEM', payload: { dayNumber, itemId, updates } });
  };
  
  const reorderItineraryItems = (dayNumber: number, reorderedItems: ItineraryItemV2[]) => {
    dispatch({ type: 'REORDER_ITINERARY_ITEMS', payload: { dayNumber, items: reorderedItems } });
  };
  
  const value: TripV2ContextType = {
    state,
    createTrip,
    updateTrip,
    deleteTrip,
    setCurrentTrip,
    addItineraryItem,
    removeItineraryItem,
    updateItineraryItem,
    reorderItineraryItems,
  };
  
  return <TripV2Context.Provider value={value}>{children}</TripV2Context.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useTripV2() {
  const context = useContext(TripV2Context);
  if (!context) {
    throw new Error('useTripV2 must be used within TripV2Provider');
  }
  return context;
}