import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { 
  WizardContextType, 
  FilterState, 
  Venue, 
  UIState, 
  UserIntent, 
  AIEvent, 
  AIActionType 
} from '../types/wizard';

// Default Initial States
const INITIAL_FILTERS: FilterState = {
  intent: 'GENERAL',
  tags: [],
  dateRange: { start: null, end: null },
  budget: { min: 0, max: 1000, currency: 'USD' },
  location: null,
  guests: 1
};

const INITIAL_UI: UIState = {
  currentStep: 0,
  totalSteps: 3,
  isComplete: false,
  isLoading: false,
  viewMode: 'SPLIT',
  activeResultId: null,
  isChatOpen: false,
  isCreateTripOpen: false
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFiltersState] = useState<FilterState>(INITIAL_FILTERS);
  const [results, setResultsState] = useState<Venue[]>([]);
  const [ui, setUIState] = useState<UIState>(INITIAL_UI);

  // Actions
  const setIntent = useCallback((intent: UserIntent) => {
    setFiltersState(prev => ({ ...prev, intent }));
    // Reset steps when intent changes
    setUIState(prev => ({ ...prev, currentStep: 0, isComplete: false }));
  }, []);

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...updates }));
  }, []);

  const setResults = useCallback((newResults: Venue[]) => {
    setResultsState(newResults);
  }, []);

  const setUI = useCallback((updates: Partial<UIState>) => {
    setUIState(prev => ({ ...prev, ...updates }));
  }, []);

  const openCreateTrip = useCallback(() => {
    setUIState(prev => ({ ...prev, isCreateTripOpen: true }));
  }, []);

  const closeCreateTrip = useCallback(() => {
    setUIState(prev => ({ ...prev, isCreateTripOpen: false }));
  }, []);

  const handleAIEvent = useCallback((event: AIEvent) => {
    console.log('[WizardContext] AI Event:', event);
    switch (event.type) {
      case 'SET_INTENT':
        if (event.payload) setIntent(event.payload as UserIntent);
        break;
      case 'UPDATE_FILTERS':
        if (event.payload) updateFilters(event.payload);
        break;
      case 'SET_RESULTS':
        if (event.payload) setResults(event.payload);
        break;
      case 'NAVIGATE_TO_STEP':
        if (typeof event.payload === 'number') setUI({ currentStep: event.payload });
        break;
      case 'TOGGLE_VIEW_MODE':
        setUI({ viewMode: event.payload });
        break;
      case 'SELECT_RESULT':
        setUI({ activeResultId: event.payload });
        break;
      case 'OPEN_CREATE_TRIP':
        openCreateTrip();
        break;
      default:
        console.warn('Unknown AI Action:', event.type);
    }
  }, [setIntent, updateFilters, setResults, setUI, openCreateTrip]);

  const resetWizard = useCallback(() => {
    setFiltersState(INITIAL_FILTERS);
    setResultsState([]);
    setUIState(INITIAL_UI);
  }, []);

  const value = {
    filters,
    results,
    ui,
    setIntent,
    updateFilters,
    setResults,
    setUI,
    handleAIEvent,
    resetWizard,
    openCreateTrip,
    closeCreateTrip
  };

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};
