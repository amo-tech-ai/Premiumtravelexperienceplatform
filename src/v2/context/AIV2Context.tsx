/**
 * AI V2 CONTEXT
 * 
 * AI-specific state management for V2 Trip System
 * Manages chat, suggestions, and agent states
 */

import { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agent?: 'discovery' | 'planning' | 'optimization';
  suggestions?: AISuggestion[];
}

export interface AISuggestion {
  id: string;
  type: 'activity' | 'restaurant' | 'optimization' | 'plan';
  title: string;
  description: string;
  data: any;
  confidence: number;
  action?: {
    label: string;
    type: 'add' | 'replace' | 'optimize';
  };
}

export interface AIV2State {
  isPanelOpen: boolean;
  isStreaming: boolean;
  messages: AIMessage[];
  currentAgent: 'discovery' | 'planning' | 'optimization' | null;
  pendingSuggestions: AISuggestion[];
  context: {
    tripId?: string;
    dayNumber?: number;
    currentView?: string;
  };
}

// Actions
type AIV2Action =
  | { type: 'OPEN_PANEL' }
  | { type: 'CLOSE_PANEL' }
  | { type: 'TOGGLE_PANEL' }
  | { type: 'SET_STREAMING'; payload: boolean }
  | { type: 'ADD_MESSAGE'; payload: AIMessage }
  | { type: 'SET_AGENT'; payload: AIV2State['currentAgent'] }
  | { type: 'ADD_SUGGESTION'; payload: AISuggestion }
  | { type: 'REMOVE_SUGGESTION'; payload: string }
  | { type: 'CLEAR_SUGGESTIONS' }
  | { type: 'SET_CONTEXT'; payload: Partial<AIV2State['context']> }
  | { type: 'CLEAR_MESSAGES' };

// Initial state
const initialState: AIV2State = {
  isPanelOpen: false,
  isStreaming: false,
  messages: [],
  currentAgent: null,
  pendingSuggestions: [],
  context: {},
};

// Reducer
function aiV2Reducer(state: AIV2State, action: AIV2Action): AIV2State {
  switch (action.type) {
    case 'OPEN_PANEL':
      return { ...state, isPanelOpen: true };
    
    case 'CLOSE_PANEL':
      return { ...state, isPanelOpen: false };
    
    case 'TOGGLE_PANEL':
      return { ...state, isPanelOpen: !state.isPanelOpen };
    
    case 'SET_STREAMING':
      return { ...state, isStreaming: action.payload };
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    
    case 'SET_AGENT':
      return { ...state, currentAgent: action.payload };
    
    case 'ADD_SUGGESTION':
      return {
        ...state,
        pendingSuggestions: [...state.pendingSuggestions, action.payload],
      };
    
    case 'REMOVE_SUGGESTION':
      return {
        ...state,
        pendingSuggestions: state.pendingSuggestions.filter(
          s => s.id !== action.payload
        ),
      };
    
    case 'CLEAR_SUGGESTIONS':
      return { ...state, pendingSuggestions: [] };
    
    case 'SET_CONTEXT':
      return {
        ...state,
        context: { ...state.context, ...action.payload },
      };
    
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    
    default:
      return state;
  }
}

// Context
interface AIV2ContextType {
  state: AIV2State;
  dispatch: React.Dispatch<AIV2Action>;
  // Helper methods
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  sendMessage: (content: string) => Promise<void>;
  acceptSuggestion: (suggestionId: string) => void;
  rejectSuggestion: (suggestionId: string) => void;
  askDiscovery: (query: string) => Promise<void>;
  askPlanning: (request: string) => Promise<void>;
  askOptimization: (dayNumber: number) => Promise<void>;
}

const AIV2Context = createContext<AIV2ContextType | undefined>(undefined);

// Provider
export function AIV2Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(aiV2Reducer, initialState);
  
  // Helper methods
  const openPanel = () => dispatch({ type: 'OPEN_PANEL' });
  const closePanel = () => dispatch({ type: 'CLOSE_PANEL' });
  const togglePanel = () => dispatch({ type: 'TOGGLE_PANEL' });
  
  const sendMessage = async (content: string) => {
    // Add user message
    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    
    // Set streaming
    dispatch({ type: 'SET_STREAMING', payload: true });
    
    // Simulate AI response (in production, this would call the event bus)
    setTimeout(() => {
      const aiMessage: AIMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `I understand you're asking about: "${content}". Let me help you with that.`,
        timestamp: new Date().toISOString(),
        agent: state.currentAgent || 'discovery',
      };
      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
      dispatch({ type: 'SET_STREAMING', payload: false });
    }, 1000);
  };
  
  const acceptSuggestion = (suggestionId: string) => {
    // In production, this would add the suggestion to the itinerary
    dispatch({ type: 'REMOVE_SUGGESTION', payload: suggestionId });
  };
  
  const rejectSuggestion = (suggestionId: string) => {
    dispatch({ type: 'REMOVE_SUGGESTION', payload: suggestionId });
  };
  
  const askDiscovery = async (query: string) => {
    dispatch({ type: 'SET_AGENT', payload: 'discovery' });
    dispatch({ type: 'OPEN_PANEL' });
    
    // Add user message
    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    
    // Simulate discovery response with suggestions
    setTimeout(() => {
      const suggestions: AISuggestion[] = [
        {
          id: `sug-${Date.now()}-1`,
          type: 'restaurant',
          title: 'Carmen',
          description: 'Upscale Colombian cuisine with a modern twist',
          confidence: 0.95,
          data: {
            cost: 85,
            duration: 120,
            location: 'El Poblado',
          },
          action: {
            label: 'Add to Itinerary',
            type: 'add',
          },
        },
        {
          id: `sug-${Date.now()}-2`,
          type: 'activity',
          title: 'Comuna 13 Graffiti Tour',
          description: 'Guided tour of street art and transformation',
          confidence: 0.92,
          data: {
            cost: 25,
            duration: 180,
            location: 'Comuna 13',
          },
          action: {
            label: 'Add to Itinerary',
            type: 'add',
          },
        },
      ];
      
      const aiMessage: AIMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `Based on your interests, I found 2 great options for you:`,
        timestamp: new Date().toISOString(),
        agent: 'discovery',
        suggestions,
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
      suggestions.forEach(s => dispatch({ type: 'ADD_SUGGESTION', payload: s }));
    }, 1500);
  };
  
  const askPlanning = async (request: string) => {
    dispatch({ type: 'SET_AGENT', payload: 'planning' });
    dispatch({ type: 'OPEN_PANEL' });
    
    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: request,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    
    // Simulate planning response
    setTimeout(() => {
      const suggestion: AISuggestion = {
        id: `sug-${Date.now()}`,
        type: 'plan',
        title: 'Full Day Itinerary',
        description: 'I\'ve created a complete itinerary for your day',
        confidence: 0.88,
        data: {
          activities: [
            { name: 'Breakfast at Café Pergamino', time: '09:00' },
            { name: 'Museo de Antioquia', time: '11:00' },
            { name: 'Lunch at Carmen', time: '14:00' },
            { name: 'Comuna 13 Tour', time: '16:00' },
            { name: 'Dinner at El Cielo', time: '19:00' },
          ],
        },
        action: {
          label: 'Apply to Day',
          type: 'add',
        },
      };
      
      const aiMessage: AIMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `I've planned a full day for you based on your interests:`,
        timestamp: new Date().toISOString(),
        agent: 'planning',
        suggestions: [suggestion],
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
      dispatch({ type: 'ADD_SUGGESTION', payload: suggestion });
    }, 2000);
  };
  
  const askOptimization = async (dayNumber: number) => {
    dispatch({ type: 'SET_AGENT', payload: 'optimization' });
    dispatch({ type: 'OPEN_PANEL' });
    
    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: `Optimize my itinerary for Day ${dayNumber}`,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    
    // Simulate optimization response
    setTimeout(() => {
      const suggestion: AISuggestion = {
        id: `sug-${Date.now()}`,
        type: 'optimization',
        title: 'Reorder Activities',
        description: 'I can save you 45 minutes by reordering your activities',
        confidence: 0.91,
        data: {
          changes: [
            'Move museum visit to morning (less crowded)',
            'Swap lunch and afternoon activity (better timing)',
          ],
          timeSaved: 45,
        },
        action: {
          label: 'Apply Optimization',
          type: 'optimize',
        },
      };
      
      const aiMessage: AIMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `I found some optimizations for your day:`,
        timestamp: new Date().toISOString(),
        agent: 'optimization',
        suggestions: [suggestion],
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
      dispatch({ type: 'ADD_SUGGESTION', payload: suggestion });
    }, 1500);
  };
  
  const value: AIV2ContextType = {
    state,
    dispatch,
    openPanel,
    closePanel,
    togglePanel,
    sendMessage,
    acceptSuggestion,
    rejectSuggestion,
    askDiscovery,
    askPlanning,
    askOptimization,
  };
  
  return (
    <AIV2Context.Provider value={value}>
      {children}
    </AIV2Context.Provider>
  );
}

// Hook
export function useAIV2() {
  const context = useContext(AIV2Context);
  if (!context) {
    throw new Error('useAIV2 must be used within AIV2Provider');
  }
  return context;
}
