/**
 * AI Agent Integration
 * Connects AI agents to UI workflows and manages agent interactions
 */

import { useEffect, useCallback } from 'react';
import { getOrchestrator } from '../../lib/ai/orchestrator';
import { getEventBus } from '../../lib/ai/event-bus';
import { toast } from 'sonner@2.0.3';

interface AIAgentIntegrationProps {
  onEventDiscovered?: (events: any[]) => void;
  onDiningRecommendation?: (restaurants: any[]) => void;
  onItineraryOptimized?: (optimizedItinerary: any) => void;
  onBudgetAlert?: (alert: any) => void;
  onBookingSuggestion?: (booking: any) => void;
  onConflictDetected?: (conflicts: any[]) => void;
}

/**
 * Hook to integrate AI agents with UI components
 * Provides simple interface for triggering AI actions and handling responses
 */
export const useAIAgents = () => {
  const orchestrator = getOrchestrator();
  const eventBus = getEventBus();

  /**
   * Discover events based on criteria
   */
  const discoverEvents = useCallback(async (query: string, context?: any) => {
    try {
      const result = await orchestrator.processUserMessage(query, {
        ...context,
        agentType: 'local_scout',
      });

      return result.responses;
    } catch (error) {
      console.error('Event discovery error:', error);
      toast.error('Failed to discover events');
      return [];
    }
  }, [orchestrator]);

  /**
   * Get dining recommendations
   */
  const getDiningRecommendations = useCallback(async (query: string, filters?: any) => {
    try {
      const result = await orchestrator.processUserMessage(query, {
        filters,
        agentType: 'dining_orchestrator',
      });

      return result.responses;
    } catch (error) {
      console.error('Dining recommendation error:', error);
      toast.error('Failed to get restaurant recommendations');
      return [];
    }
  }, [orchestrator]);

  /**
   * Optimize itinerary
   */
  const optimizeItinerary = useCallback(async (itinerary: any) => {
    try {
      const result = await orchestrator.processUserMessage(
        'Optimize my itinerary to minimize travel time',
        {
          itinerary,
          agentType: 'itinerary_optimizer',
        }
      );

      return result.responses[0]?.data;
    } catch (error) {
      console.error('Itinerary optimization error:', error);
      toast.error('Failed to optimize itinerary');
      return null;
    }
  }, [orchestrator]);

  /**
   * Check budget and get recommendations
   */
  const checkBudget = useCallback(async (trip: any) => {
    try {
      const result = await orchestrator.processUserMessage(
        'Analyze my budget and provide recommendations',
        {
          trip,
          agentType: 'budget_guardian',
        }
      );

      return result.responses[0]?.data;
    } catch (error) {
      console.error('Budget check error:', error);
      toast.error('Failed to analyze budget');
      return null;
    }
  }, [orchestrator]);

  /**
   * Get booking suggestions
   */
  const getBookingSuggestions = useCallback(async (query: string, type: 'flight' | 'hotel' | 'activity' | 'restaurant') => {
    try {
      const result = await orchestrator.processUserMessage(query, {
        bookingType: type,
        agentType: 'booking_assistant',
      });

      return result.responses;
    } catch (error) {
      console.error('Booking suggestion error:', error);
      toast.error('Failed to get booking suggestions');
      return [];
    }
  }, [orchestrator]);

  /**
   * Detect conflicts in itinerary
   */
  const detectConflicts = useCallback(async (itinerary: any) => {
    try {
      const result = await orchestrator.processUserMessage(
        'Check my itinerary for scheduling conflicts',
        {
          itinerary,
          agentType: 'itinerary_optimizer',
        }
      );

      return result.responses[0]?.data?.conflicts || [];
    } catch (error) {
      console.error('Conflict detection error:', error);
      toast.error('Failed to detect conflicts');
      return [];
    }
  }, [orchestrator]);

  /**
   * Curate events based on preferences
   */
  const curateEvents = useCallback(async (preferences: any) => {
    try {
      const result = await orchestrator.processUserMessage(
        'Suggest events based on my preferences',
        {
          preferences,
          agentType: 'event_curator',
        }
      );

      return result.responses;
    } catch (error) {
      console.error('Event curation error:', error);
      toast.error('Failed to curate events');
      return [];
    }
  }, [orchestrator]);

  /**
   * Subscribe to real-time agent updates
   */
  useEffect(() => {
    // Listen for budget alerts
    const handleBudgetAlert = (payload: any) => {
      const { message, severity } = payload.data;
      
      if (severity === 'critical') {
        toast.error(message);
      } else if (severity === 'warning') {
        toast.warning(message);
      } else {
        toast.info(message);
      }
    };

    // Listen for conflict detection
    const handleConflictDetected = (payload: any) => {
      const conflicts = payload.data?.conflicts || [];
      
      if (conflicts.length > 0) {
        toast.warning(`${conflicts.length} scheduling conflict(s) detected`);
      }
    };

    // Listen for optimization suggestions
    const handleOptimizationSuggestion = (payload: any) => {
      const { timeSaved, suggestion } = payload.data;
      
      if (timeSaved > 0) {
        toast.success(`Optimization available: Save ${timeSaved} minutes`, {
          action: {
            label: 'Apply',
            onClick: () => {
              // Trigger optimization
            },
          },
        });
      }
    };

    eventBus.on('budget:alert', handleBudgetAlert);
    eventBus.on('itinerary:conflict', handleConflictDetected);
    eventBus.on('itinerary:optimization', handleOptimizationSuggestion);

    return () => {
      eventBus.off('budget:alert', handleBudgetAlert);
      eventBus.off('itinerary:conflict', handleConflictDetected);
      eventBus.off('itinerary:optimization', handleOptimizationSuggestion);
    };
  }, [eventBus]);

  return {
    discoverEvents,
    getDiningRecommendations,
    optimizeItinerary,
    checkBudget,
    getBookingSuggestions,
    detectConflicts,
    curateEvents,
  };
};

/**
 * Component wrapper for AI integration (optional)
 */
export const AIAgentIntegration: React.FC<AIAgentIntegrationProps> = ({
  onEventDiscovered,
  onDiningRecommendation,
  onItineraryOptimized,
  onBudgetAlert,
  onBookingSuggestion,
  onConflictDetected,
}) => {
  const eventBus = getEventBus();

  useEffect(() => {
    // Wire up event handlers
    if (onEventDiscovered) {
      eventBus.on('event:discovered', (payload) => {
        onEventDiscovered(payload.data?.events || []);
      });
    }

    if (onDiningRecommendation) {
      eventBus.on('dining:recommendation', (payload) => {
        onDiningRecommendation(payload.data?.restaurants || []);
      });
    }

    if (onItineraryOptimized) {
      eventBus.on('itinerary:optimized', (payload) => {
        onItineraryOptimized(payload.data);
      });
    }

    if (onBudgetAlert) {
      eventBus.on('budget:alert', (payload) => {
        onBudgetAlert(payload.data);
      });
    }

    if (onBookingSuggestion) {
      eventBus.on('booking:suggestion', (payload) => {
        onBookingSuggestion(payload.data);
      });
    }

    if (onConflictDetected) {
      eventBus.on('itinerary:conflict', (payload) => {
        onConflictDetected(payload.data?.conflicts || []);
      });
    }

    return () => {
      // Cleanup
      eventBus.off('event:discovered');
      eventBus.off('dining:recommendation');
      eventBus.off('itinerary:optimized');
      eventBus.off('budget:alert');
      eventBus.off('booking:suggestion');
      eventBus.off('itinerary:conflict');
    };
  }, [
    eventBus,
    onEventDiscovered,
    onDiningRecommendation,
    onItineraryOptimized,
    onBudgetAlert,
    onBookingSuggestion,
    onConflictDetected,
  ]);

  return null; // This is a logic-only component
};
