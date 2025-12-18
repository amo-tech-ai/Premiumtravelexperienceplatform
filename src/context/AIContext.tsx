import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type AIIntent = 'GENERAL' | 'REAL_ESTATE' | 'EVENTS' | 'ITINERARY' | 'DINING' | 'STAYS' | 'TOURIST' | 'LOCATIONS' | 'GUIDES' | 'DISCOVERY';

export interface Message {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  isThinking?: boolean;
}

export interface SavedItem {
  id: string;
  type: 'property' | 'event' | 'experience' | 'itinerary';
  title: string;
  image?: string;
  date?: string;
  price?: string;
  location?: string;
  lat?: number;
  lng?: number;
  notes?: string;
  data?: any; // For flexible data like itinerary activities
}

export interface AIContextType {
  messages: Message[];
  intent: AIIntent;
  savedItems: SavedItem[];
  isTyping: boolean;
  isOpen: boolean;
  toggleOpen: () => void;
  sendMessage: (text: string) => void;
  injectMessage: (content: string, role?: 'user' | 'ai' | 'system', newIntent?: AIIntent) => void;
  setIntent: (intent: AIIntent) => void;
  resetChat: () => void;
  saveItem: (item: SavedItem) => void;
  removeItem: (id: string) => void;
  lastAction: AIEvent | null;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

const STORAGE_KEY = 'medellin_ai_context_v2';

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [lastAction, setLastAction] = useState<AIEvent | null>(null);
  const navigate = useNavigate();
  
  // Load initial state from storage or default
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.messages || [];
      }
    } catch (e) {
      console.error('Failed to load chat history', e);
    }
    return [{
      id: '1',
      role: 'ai',
      content: 'Welcome to Medellín. I am your personal concierge. Ask me about events, real estate, or planning your trip.',
    }];
  });

  const [intent, setIntent] = useState<AIIntent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.intent || 'GENERAL';
      }
    } catch (e) {}
    return 'GENERAL';
  });

  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.savedItems || [];
      }
    } catch (e) {}
    return [];
  });

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, intent, savedItems }));
    } catch (e) {
      console.error('Failed to save chat history', e);
    }
  }, [messages, intent, savedItems]);

  const saveItem = (item: SavedItem) => {
    setSavedItems(prev => {
      if (prev.some(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
    // Optional: Notify user via chat
    injectMessage(`I've saved "${item.title}" to your dashboard.`, 'ai');
  };

  const removeItem = (id: string) => {
    setSavedItems(prev => prev.filter(i => i.id !== id));
  };

  // Simple Intent Classifier
  const detectIntent = (text: string): AIIntent => {
    const lowerText = text.toLowerCase();
    
    const realEstateKeywords = ['buy', 'rent', 'invest', 'condo', 'apartment', 'house', 'property', 'roi', 'yield', 'real estate'];
    const eventKeywords = ['party', 'event', 'music', 'dance', 'dinner', 'restaurant', 'club', 'nightlife', 'concert', 'food'];
    const itineraryKeywords = ['plan', 'trip', 'schedule', 'itinerary', 'day', 'week'];

    if (realEstateKeywords.some(k => lowerText.includes(k))) return 'REAL_ESTATE';
    if (eventKeywords.some(k => lowerText.includes(k))) return 'EVENTS';
    if (itineraryKeywords.some(k => lowerText.includes(k))) return 'ITINERARY';
    
    return 'GENERAL';
  };

  const toggleOpen = () => setIsOpen(prev => !prev);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // 2. Determine Intent
    // Keep existing intent if generic follow-up, otherwise switch
    const detected = detectIntent(text);
    const newIntent = detected === 'GENERAL' && intent !== 'GENERAL' ? intent : detected;
    
    if (newIntent !== intent) {
        setIntent(newIntent);
        
        // Navigation Logic based on Intent
        switch (newIntent) {
            case 'REAL_ESTATE':
                navigate('/real-estate');
                break;
            case 'EVENTS':
            case 'DINING':
                navigate('/experiences/medellin');
                break;
            case 'ITINERARY':
                navigate('/itinerary');
                break;
            case 'TOURIST':
                navigate('/map');
                break;
            default:
                break;
        }
    }

    // 3. Mock AI Response
    setTimeout(() => {
      setIsTyping(false);
      
      let aiResponseContent = "";
      const lowerText = text.toLowerCase();
      
      // -- Simple NL Parsing for Actions --
      const newActions: any[] = [];

      // Budget parsing: "under 500", "budget 200"
      const budgetMatch = lowerText.match(/(?:under|budget|max|limit)\s?\$?(\d+)/);
      if (budgetMatch) {
          const max = parseInt(budgetMatch[1]);
          newActions.push({
              type: 'UPDATE_FILTERS',
              payload: { budget: { min: 0, max, currency: 'USD' } },
              timestamp: Date.now()
          });
      }

      // Guest parsing: "for 2", "table for 4", "party of 3"
      const guestMatch = lowerText.match(/(?:for|of)\s(\d+)/);
      if (guestMatch) {
          const guests = parseInt(guestMatch[1]);
          newActions.push({
              type: 'UPDATE_FILTERS',
              payload: { guests },
              timestamp: Date.now()
          });
      }

      // Tag parsing
      const keywords = ['romantic', 'rooftop', 'outdoor', 'vegan', 'sushi', 'italian', 'live music'];
      const foundTags = keywords.filter(k => lowerText.includes(k));
      if (foundTags.length > 0) {
           // We need to fetch current tags first? No, we can just append or set.
           // Since we don't have access to WizardContext here, we'll send a partial update
           // The bridge will handle merging if needed, or we just overwrite. 
           // Better to send what we found.
           // Let's assume the payload replaces or merges in WizardContext. 
           // Actually WizardContext.updateFilters merges top-level keys. 
           // So providing 'tags' will overwrite tags. 
           // Limitation: We can't easily "append" without reading state. 
           // For this demo, overwriting with found tags + preserving intent is okay-ish.
           newActions.push({
              type: 'UPDATE_FILTERS',
              payload: { tags: foundTags },
              timestamp: Date.now()
           });
      }

      if (newActions.length > 0) {
          // Dispatch the last one for now (or batched if we supported it)
          setLastAction(newActions[newActions.length - 1]);
      }
      
      switch (newIntent) {
        case 'REAL_ESTATE':
          if (lowerText.includes('penthouse') || lowerText.includes('luxury')) {
              aiResponseContent = "I've filtered for our exclusive penthouse collection in El Poblado. These properties offer the best views in the city.";
          } else if (lowerText.includes('invest') || lowerText.includes('roi')) {
              aiResponseContent = "Excellent choice. Medellín's property market is booming. I'm showing you properties with high short-term rental potential.";
          } else {
              aiResponseContent = "I've switched to Real Estate mode. Here are some high-yield properties in El Poblado that match your criteria.";
          }
          break;
        case 'EVENTS':
        case 'DINING':
          if (lowerText.includes('salsa') || lowerText.includes('dance')) {
              aiResponseContent = "You can't come to Medellín without dancing! I've highlighted the best salsa clubs for tonight.";
          } else if (lowerText.includes('dinner') || lowerText.includes('food')) {
              aiResponseContent = "I know some hidden gems for gastronomy. Let's look at the best tables in town.";
          } else {
              aiResponseContent = "I've found some exclusive spots for you. Switching to Discovery mode.";
          }
          break;
        case 'ITINERARY':
          if (lowerText.includes('days') || lowerText.includes('week')) {
               aiResponseContent = "Perfect. I can help you plan day-by-day. Let's start the Itinerary Wizard to customize your trip.";
          } else {
               aiResponseContent = "Let's plan your trip. I can customize an itinerary based on your preferences.";
          }
          break;
        case 'TOURIST':
             aiResponseContent = "Opening the map. You can filter by 'Real Estate', 'Dining', or 'Culture' to see what's around you.";
             break;
        case 'DISCOVERY':
             aiResponseContent = "I've updated your dashboard with new recommendations based on your request. Let me know if you'd like to book any of them.";
             break;
        default:
          aiResponseContent = "I can help you with that. Would you like to see events, properties, or plan a trip?";
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponseContent
      }]);
    }, 1200);
  };

  // Allows other components to seed the chat (e.g., from Itinerary Wizard)
  const injectMessage = (content: string, role: 'user' | 'ai' | 'system' = 'user', newIntent?: AIIntent) => {
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role,
          content
      }]);
      
      if (newIntent) {
          setIntent(newIntent);
      }
  };

  const resetChat = () => {
    const defaultMsg: Message = {
      id: Date.now().toString(),
      role: 'ai',
      content: 'Welcome back. How can I assist you with your travel or property search?'
    };
    setMessages([defaultMsg]);
    setIntent('GENERAL');
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: [defaultMsg], intent: 'GENERAL' }));
  };

  return (
    <AIContext.Provider value={{ messages, intent, savedItems, isTyping, isOpen, toggleOpen, sendMessage, injectMessage, setIntent, resetChat, saveItem, removeItem }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
