/**
 * USE EXPLORATION CONTEXT HOOK
 * 
 * React hook for managing exploration contexts in the Chat → Explore flow.
 * Provides context creation, persistence, and retrieval.
 * 
 * @see /docs/01-ai-features/02-context-state-contract.md
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ExplorationContext,
  ExplorationIntent,
  ExplorationResult,
  MapPin,
  MapCluster,
  UseExplorationContextReturn,
  createContextId,
  createExpirationDate,
  isContextExpired,
  validateContext,
  EXPLORATION_DEFAULTS,
} from '../types/ExplorationTypes';
import { explorationStorage } from '../storage/ExplorationStorage';

/**
 * Hook parameters
 */
interface UseExplorationContextParams {
  contextId?: string;           // Load specific context by ID
  autoLoad?: boolean;           // Auto-load latest context on mount (default: true)
  autoCleanup?: boolean;        // Auto-cleanup expired contexts (default: true)
}

/**
 * Main hook for exploration context management
 */
export function useExplorationContext(
  params: UseExplorationContextParams = {}
): UseExplorationContextReturn {
  const { contextId, autoLoad = true, autoCleanup = true } = params;

  // State
  const [context, setContext] = useState<ExplorationContext | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Load context from storage
   */
  const loadContext = useCallback((id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const loaded = explorationStorage.get(id);

      if (!loaded) {
        throw new Error(`Context not found: ${id}`);
      }

      if (isContextExpired(loaded)) {
        throw new Error(`Context expired: ${id}`);
      }

      setContext(loaded);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load context');
      setError(error);
      console.error('[useExplorationContext] Load failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load latest context from storage
   */
  const loadLatest = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      const latest = explorationStorage.getLatest();

      if (!latest) {
        // No context found - this is OK, just means none exists
        setContext(null);
        return;
      }

      if (isContextExpired(latest)) {
        // Expired - remove it
        explorationStorage.delete(latest.id);
        setContext(null);
        return;
      }

      setContext(latest);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load latest context');
      setError(error);
      console.error('[useExplorationContext] Load latest failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new context
   */
  const createContext = useCallback((params: Partial<ExplorationContext>): ExplorationContext => {
    try {
      // Generate ID and timestamps
      const id = createContextId();
      const createdAt = new Date();
      const expiresAt = createExpirationDate();

      // Build context with defaults
      const newContext: ExplorationContext = {
        id,
        createdAt,
        expiresAt,
        source: params.source || 'manual',
        intent: params.intent || 'restaurants',
        area: params.area || {
          name: 'Current Location',
          lat: 0,
          lng: 0,
        },
        radius: params.radius || EXPLORATION_DEFAULTS.DEFAULT_RADIUS,
        timeRelevance: params.timeRelevance || { type: 'flexible' },
        primaryResults: params.primaryResults || [],
        secondaryResults: params.secondaryResults,
        pins: params.pins || [],
        clusters: params.clusters,
        mapCenter: params.mapCenter,
        ranking: params.ranking || {
          algorithm: 'default',
          confidence: 'medium',
          factors: [],
        },
        originalQuery: params.originalQuery,
        filters: params.filters,
        secondaryIntents: params.secondaryIntents,
      };

      // Validate
      const validation = validateContext(newContext);
      if (!validation.isValid) {
        console.error('[useExplorationContext] Invalid context:', validation.errors);
        throw new Error(`Invalid context: ${validation.errors.join(', ')}`);
      }

      // Warn about issues
      if (validation.warnings.length > 0) {
        console.warn('[useExplorationContext] Context warnings:', validation.warnings);
      }

      // Store
      explorationStorage.set(newContext);

      // Update state
      setContext(newContext);
      setError(null);

      console.info('[useExplorationContext] Context created:', {
        id: newContext.id,
        source: newContext.source,
        intent: newContext.intent,
        area: newContext.area.name,
        primaryResults: newContext.primaryResults.length,
      });

      return newContext;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create context');
      setError(error);
      throw error;
    }
  }, []);

  /**
   * Update current context
   */
  const updateContext = useCallback((updates: Partial<ExplorationContext>) => {
    if (!context) {
      console.warn('[useExplorationContext] No context to update');
      return;
    }

    try {
      const updatedContext: ExplorationContext = {
        ...context,
        ...updates,
        id: context.id, // Never change ID
        createdAt: context.createdAt, // Never change created date
      };

      // Validate
      const validation = validateContext(updatedContext);
      if (!validation.isValid) {
        throw new Error(`Invalid context update: ${validation.errors.join(', ')}`);
      }

      // Store
      explorationStorage.set(updatedContext);

      // Update state
      setContext(updatedContext);
      setError(null);

      console.info('[useExplorationContext] Context updated:', context.id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update context');
      setError(error);
      console.error('[useExplorationContext] Update failed:', error);
    }
  }, [context]);

  /**
   * Clear current context
   */
  const clearContext = useCallback(() => {
    if (context) {
      explorationStorage.delete(context.id);
      console.info('[useExplorationContext] Context cleared:', context.id);
    }
    setContext(null);
    setError(null);
  }, [context]);

  /**
   * Refresh context (reload from storage)
   */
  const refreshContext = useCallback(() => {
    if (!context) {
      console.warn('[useExplorationContext] No context to refresh');
      return;
    }

    loadContext(context.id);
  }, [context, loadContext]);

  /**
   * Check if a context is expired
   */
  const isExpired = useCallback((ctx: ExplorationContext): boolean => {
    return isContextExpired(ctx);
  }, []);

  /**
   * Check if a context is valid
   */
  const isValid = useCallback((ctx: ExplorationContext): boolean => {
    const validation = validateContext(ctx);
    return validation.isValid && !isContextExpired(ctx);
  }, []);

  /**
   * Get primary results
   */
  const getPrimaryResults = useCallback((): ExplorationResult[] => {
    if (!context) return [];
    return context.primaryResults || [];
  }, [context]);

  /**
   * Get secondary results for a specific intent
   */
  const getSecondaryResults = useCallback((intent: ExplorationIntent): ExplorationResult[] => {
    if (!context || !context.secondaryResults) return [];
    return context.secondaryResults[intent] || [];
  }, [context]);

  /**
   * Get all results (primary + secondary)
   */
  const getAllResults = useCallback((): ExplorationResult[] => {
    if (!context) return [];

    const all: ExplorationResult[] = [...context.primaryResults];

    if (context.secondaryResults) {
      Object.values(context.secondaryResults).forEach(results => {
        if (results) {
          all.push(...results);
        }
      });
    }

    return all;
  }, [context]);

  /**
   * Get map pins
   */
  const getPins = useCallback((): MapPin[] => {
    if (!context) return [];
    return context.pins || [];
  }, [context]);

  /**
   * Get map clusters
   */
  const getClusters = useCallback((): MapCluster[] => {
    if (!context) return [];
    return context.clusters || [];
  }, [context]);

  /**
   * Get map center
   */
  const getMapCenter = useCallback((): { lat: number; lng: number; zoom: number } | null => {
    if (!context) return null;
    
    if (context.mapCenter) {
      return context.mapCenter;
    }

    // Fallback to area location
    if (context.area) {
      return {
        lat: context.area.lat,
        lng: context.area.lng,
        zoom: EXPLORATION_DEFAULTS.DEFAULT_MAP_ZOOM,
      };
    }

    return null;
  }, [context]);

  /**
   * Auto-load context on mount
   */
  useEffect(() => {
    if (!autoLoad) return;

    if (contextId) {
      // Load specific context
      loadContext(contextId);
    } else {
      // Load latest context
      loadLatest();
    }
  }, [contextId, autoLoad, loadContext, loadLatest]);

  /**
   * Auto-cleanup expired contexts
   */
  useEffect(() => {
    if (!autoCleanup) return;

    const cleanup = () => {
      explorationStorage.cleanup();
    };

    // Cleanup on mount
    cleanup();

    // Cleanup every 5 minutes
    const interval = setInterval(cleanup, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [autoCleanup]);

  /**
   * Check if current context is expired
   */
  useEffect(() => {
    if (!context) return;

    if (isContextExpired(context)) {
      console.warn('[useExplorationContext] Context expired, clearing');
      clearContext();
    }
  }, [context, clearContext]);

  // Return interface
  return useMemo(
    () => ({
      // State
      context,
      isLoading,
      error,

      // Management
      createContext,
      loadContext,
      updateContext,
      clearContext,
      refreshContext,

      // Validation
      isExpired,
      isValid,

      // Results
      getPrimaryResults,
      getSecondaryResults,
      getAllResults,

      // Map data
      getPins,
      getClusters,
      getMapCenter,
    }),
    [
      context,
      isLoading,
      error,
      createContext,
      loadContext,
      updateContext,
      clearContext,
      refreshContext,
      isExpired,
      isValid,
      getPrimaryResults,
      getSecondaryResults,
      getAllResults,
      getPins,
      getClusters,
      getMapCenter,
    ]
  );
}

/**
 * Export type for external use
 */
export type { UseExplorationContextReturn };
