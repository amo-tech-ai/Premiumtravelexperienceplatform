/**
 * ANALYTICS V2 CONTEXT
 * 
 * Analytics tracking for V2 Trip System
 * Tracks events, user flows, errors, and performance
 */

import { createContext, useContext, ReactNode, useCallback } from 'react';

// Event types
export type AnalyticsEvent = 
  // Trip events
  | 'trip_created'
  | 'trip_updated'
  | 'trip_deleted'
  | 'trip_viewed'
  // Itinerary events
  | 'item_added'
  | 'item_edited'
  | 'item_deleted'
  | 'item_reordered'
  | 'day_planned'
  // AI events
  | 'ai_panel_opened'
  | 'ai_message_sent'
  | 'ai_suggestion_accepted'
  | 'ai_suggestion_rejected'
  | 'discovery_agent_used'
  | 'planning_agent_used'
  | 'optimization_agent_used'
  // Mobile events
  | 'item_dragged'
  | 'item_swiped_delete'
  | 'item_swiped_edit'
  | 'long_press_menu_opened'
  | 'pull_to_refresh'
  // Navigation events
  | 'page_viewed'
  | 'button_clicked'
  | 'link_clicked'
  // Error events
  | 'error_occurred'
  | 'error_recovered';

export interface AnalyticsEventData {
  [key: string]: any;
}

export interface AnalyticsV2ContextType {
  // Event tracking
  trackEvent: (event: AnalyticsEvent, data?: AnalyticsEventData) => void;
  
  // Page tracking
  trackPageView: (path: string, title?: string) => void;
  
  // Error tracking
  trackError: (error: Error, context?: string) => void;
  
  // Performance tracking
  trackPerformance: (metric: string, value: number, unit?: string) => void;
  
  // User flow tracking
  startFlow: (flowName: string) => void;
  completeFlow: (flowName: string) => void;
  abandonFlow: (flowName: string, reason?: string) => void;
}

const AnalyticsV2Context = createContext<AnalyticsV2ContextType | undefined>(undefined);

// Mock implementation - replace with real analytics service
export function AnalyticsV2Provider({ children }: { children: ReactNode }) {
  const isDev = process.env.NODE_ENV === 'development';
  
  const trackEvent = useCallback((event: AnalyticsEvent, data?: AnalyticsEventData) => {
    if (isDev) {
      console.log('[Analytics] Event:', event, data);
    }
    
    // In production, send to analytics service
    // Example: analytics.track(event, data);
    
    try {
      // Store in localStorage for debugging
      const events = JSON.parse(localStorage.getItem('v2_analytics_events') || '[]');
      events.push({
        event,
        data,
        timestamp: new Date().toISOString(),
      });
      // Keep last 100 events
      if (events.length > 100) {
        events.shift();
      }
      localStorage.setItem('v2_analytics_events', JSON.stringify(events));
    } catch (error) {
      // Silent fail
    }
  }, [isDev]);
  
  const trackPageView = useCallback((path: string, title?: string) => {
    if (isDev) {
      console.log('[Analytics] Page View:', path, title);
    }
    
    trackEvent('page_viewed', { path, title });
    
    // In production, send to analytics service
    // Example: analytics.page(path, title);
  }, [isDev, trackEvent]);
  
  const trackError = useCallback((error: Error, context?: string) => {
    if (isDev) {
      console.error('[Analytics] Error:', context, error);
    }
    
    trackEvent('error_occurred', {
      message: error.message,
      stack: error.stack,
      context,
    });
    
    // In production, send to error monitoring service
    // Example: Sentry.captureException(error, { extra: { context } });
  }, [isDev, trackEvent]);
  
  const trackPerformance = useCallback((metric: string, value: number, unit: string = 'ms') => {
    if (isDev) {
      console.log(`[Analytics] Performance: ${metric} = ${value}${unit}`);
    }
    
    trackEvent('performance_metric' as AnalyticsEvent, {
      metric,
      value,
      unit,
    });
  }, [isDev, trackEvent]);
  
  const startFlow = useCallback((flowName: string) => {
    if (isDev) {
      console.log('[Analytics] Flow Started:', flowName);
    }
    
    // Store flow start time
    sessionStorage.setItem(`flow_${flowName}_start`, Date.now().toString());
  }, [isDev]);
  
  const completeFlow = useCallback((flowName: string) => {
    const startTime = sessionStorage.getItem(`flow_${flowName}_start`);
    const duration = startTime ? Date.now() - parseInt(startTime) : null;
    
    if (isDev) {
      console.log('[Analytics] Flow Completed:', flowName, duration ? `${duration}ms` : '');
    }
    
    trackEvent('flow_completed' as AnalyticsEvent, {
      flowName,
      duration,
    });
    
    sessionStorage.removeItem(`flow_${flowName}_start`);
  }, [isDev, trackEvent]);
  
  const abandonFlow = useCallback((flowName: string, reason?: string) => {
    const startTime = sessionStorage.getItem(`flow_${flowName}_start`);
    const duration = startTime ? Date.now() - parseInt(startTime) : null;
    
    if (isDev) {
      console.log('[Analytics] Flow Abandoned:', flowName, reason, duration ? `${duration}ms` : '');
    }
    
    trackEvent('flow_abandoned' as AnalyticsEvent, {
      flowName,
      reason,
      duration,
    });
    
    sessionStorage.removeItem(`flow_${flowName}_start`);
  }, [isDev, trackEvent]);
  
  const value: AnalyticsV2ContextType = {
    trackEvent,
    trackPageView,
    trackError,
    trackPerformance,
    startFlow,
    completeFlow,
    abandonFlow,
  };
  
  return (
    <AnalyticsV2Context.Provider value={value}>
      {children}
    </AnalyticsV2Context.Provider>
  );
}

// Hook
export function useAnalyticsV2() {
  const context = useContext(AnalyticsV2Context);
  if (!context) {
    throw new Error('useAnalyticsV2 must be used within AnalyticsV2Provider');
  }
  return context;
}
