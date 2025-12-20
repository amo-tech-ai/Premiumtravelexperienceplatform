/**
 * Advanced AI Hook
 * Provides access to all advanced AI features in React components
 * 
 * Features:
 * - Proactive suggestions
 * - Context-aware conversations
 * - Multi-agent collaboration
 * - Real-time updates via event bus
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getProactiveAssistant, type ProactiveSuggestion } from '../lib/ai/proactive-assistant';
import { getContextManager, type ConversationMessage } from '../lib/ai/context-manager';
import { getCollaborationEngine, type CollaborationResult } from '../lib/ai/collaboration-engine';
import { getEventBus } from '../lib/ai/event-bus';

// --- TYPES ---

export interface UseAdvancedAIOptions {
  enableProactive?: boolean;
  enableContext?: boolean;
  enableCollaboration?: boolean;
  sessionId?: string;
  tripId?: string;
}

export interface UseAdvancedAIReturn {
  // Proactive Suggestions
  suggestions: ProactiveSuggestion[];
  dismissSuggestion: (id: string) => void;
  clearSuggestions: () => void;
  
  // Context-Aware Chat
  sendMessage: (message: string) => Promise<{ response: string; references: any[] }>;
  conversationHistory: ConversationMessage[];
  clearConversation: () => void;
  
  // Multi-Agent Collaboration
  askComplex: (query: string) => Promise<CollaborationResult>;
  isProcessing: boolean;
  
  // Shared State
  isReady: boolean;
  error: string | null;
}

// --- HOOK ---

export function useAdvancedAI(options: UseAdvancedAIOptions = {}): UseAdvancedAIReturn {
  const {
    enableProactive = true,
    enableContext = true,
    enableCollaboration = true,
    sessionId,
    tripId,
  } = options;

  // State
  const [suggestions, setSuggestions] = useState<ProactiveSuggestion[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const proactiveRef = useRef(getProactiveAssistant());
  const contextRef = useRef(getContextManager());
  const collaborationRef = useRef(getCollaborationEngine());
  const eventBusRef = useRef(getEventBus());
  const subscriptionIdRef = useRef<string | null>(null);

  /**
   * Initialize AI services
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        // Set proactive assistant active state
        if (proactiveRef.current) {
          proactiveRef.current.setActive(enableProactive);
        }

        // Initialize or restore conversation session
        if (enableContext && contextRef.current) {
          if (sessionId) {
            contextRef.current.setActiveSession(sessionId);
          } else {
            contextRef.current.createSession({ tripId });
          }
          
          // Load existing conversation history
          const history = contextRef.current.getConversationHistory();
          setConversationHistory(history);
        }

        // Get existing proactive suggestions
        if (enableProactive && proactiveRef.current) {
          const existing = proactiveRef.current.getActiveSuggestions();
          setSuggestions(existing);
        }

        setIsReady(true);
      } catch (err) {
        console.error('[useAdvancedAI] Initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize AI');
      }
    };

    initialize();
  }, [enableProactive, enableContext, enableCollaboration, sessionId, tripId]);

  /**
   * Subscribe to proactive suggestions
   */
  useEffect(() => {
    if (!enableProactive || !isReady) return;

    // Subscribe to new suggestions via event bus
    const subId = eventBusRef.current.on('agent:response', (payload) => {
      if (payload.data.type === 'proactive_suggestion') {
        const suggestion = payload.data.suggestion as ProactiveSuggestion;
        setSuggestions((prev) => {
          // Check if already exists
          if (prev.some((s) => s.id === suggestion.id)) {
            return prev;
          }
          return [...prev, suggestion];
        });
      }
    });

    subscriptionIdRef.current = subId;

    return () => {
      if (subscriptionIdRef.current) {
        eventBusRef.current.off(subscriptionIdRef.current);
      }
    };
  }, [enableProactive, isReady]);

  /**
   * Dismiss a proactive suggestion
   */
  const dismissSuggestion = useCallback((id: string) => {
    if (proactiveRef.current) {
      const dismissed = proactiveRef.current.dismissSuggestion(id);
      if (dismissed) {
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
      }
    }
  }, []);

  /**
   * Clear all suggestions
   */
  const clearSuggestions = useCallback(() => {
    if (proactiveRef.current) {
      proactiveRef.current.clearAll();
      setSuggestions([]);
    }
  }, []);

  /**
   * Send a message with context awareness
   */
  const sendMessage = useCallback(
    async (message: string): Promise<{ response: string; references: any[] }> => {
      if (!enableContext || !contextRef.current) {
        throw new Error('Context manager not enabled');
      }

      setIsProcessing(true);
      setError(null);

      try {
        // Resolve references in message
        const { resolved, references } = contextRef.current.resolveReferences(message);

        // Add user message to history
        const userMessage = contextRef.current.addMessage('user', message, {
          references,
        });

        setConversationHistory((prev) => [...prev, userMessage]);

        // Get context summary for AI
        const contextSummary = contextRef.current.getContextSummary();

        // Use collaboration engine for complex queries
        let response = '';
        if (enableCollaboration && collaborationRef.current) {
          const result = await collaborationRef.current.processComplexQuery(resolved, {
            contextSummary,
            tripId,
          });
          response = result.synthesizedResponse;
        } else {
          // Simple response fallback
          response = `Processing: ${resolved}`;
        }

        // Add assistant response to history
        const assistantMessage = contextRef.current.addMessage('assistant', response);

        setConversationHistory((prev) => [...prev, assistantMessage]);

        return { response, references };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMsg);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [enableContext, enableCollaboration, tripId]
  );

  /**
   * Clear conversation history
   */
  const clearConversation = useCallback(() => {
    if (contextRef.current) {
      const session = contextRef.current.getActiveSession();
      if (session) {
        contextRef.current.clearSession(session.sessionId);
      }
      setConversationHistory([]);
    }
  }, []);

  /**
   * Ask a complex question (multi-agent collaboration)
   */
  const askComplex = useCallback(
    async (query: string): Promise<CollaborationResult> => {
      if (!enableCollaboration || !collaborationRef.current) {
        throw new Error('Collaboration engine not enabled');
      }

      setIsProcessing(true);
      setError(null);

      try {
        const result = await collaborationRef.current.processComplexQuery(query, {
          tripId,
        });

        // Add to conversation history if context is enabled
        if (enableContext && contextRef.current) {
          contextRef.current.addMessage('user', query);
          contextRef.current.addMessage('assistant', result.synthesizedResponse);
          
          const history = contextRef.current.getConversationHistory();
          setConversationHistory(history);
        }

        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to process complex query';
        setError(errorMsg);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [enableCollaboration, enableContext, tripId]
  );

  return {
    // Proactive Suggestions
    suggestions,
    dismissSuggestion,
    clearSuggestions,

    // Context-Aware Chat
    sendMessage,
    conversationHistory,
    clearConversation,

    // Multi-Agent Collaboration
    askComplex,
    isProcessing,

    // Shared State
    isReady,
    error,
  };
}

// --- EXPORTS ---

export default useAdvancedAI;
