/**
 * Analytics & Monitoring Service
 * Production-ready tracking for user behavior, performance, and errors
 */

// --- TYPES ---

export interface AnalyticsEvent {
  name: string;
  category: string;
  properties?: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

export interface PageView {
  path: string;
  title: string;
  referrer?: string;
  timestamp: Date;
  sessionId: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
}

export interface ErrorLog {
  message: string;
  stack?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  timestamp: Date;
}

// --- ANALYTICS SERVICE ---

export class AnalyticsService {
  private sessionId: string;
  private userId?: string;
  private events: AnalyticsEvent[] = [];
  private pageViews: PageView[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private errorLogs: ErrorLog[] = [];
  private batchSize = 10;
  private flushInterval = 30000; // 30 seconds
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.init();
  }

  /**
   * Initialize analytics
   */
  private init(): void {
    // Load user ID from localStorage if available
    this.userId = localStorage.getItem('analytics_user_id') || undefined;

    // Start periodic flush
    this.startPeriodicFlush();

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    });

    // Track performance metrics
    this.trackPerformanceMetrics();

    // Track errors
    this.setupErrorTracking();
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${timestamp}-${random}`;
  }

  /**
   * Set user ID for tracking
   */
  setUserId(userId: string): void {
    this.userId = userId;
    localStorage.setItem('analytics_user_id', userId);
  }

  /**
   * Track custom event
   */
  trackEvent(
    name: string,
    category: string,
    properties?: Record<string, any>
  ): void {
    const event: AnalyticsEvent = {
      name,
      category,
      properties,
      timestamp: new Date(),
      userId: this.userId,
      sessionId: this.sessionId,
    };

    this.events.push(event);

    console.log('[Analytics] Event:', event);

    // Flush if batch size reached
    if (this.events.length >= this.batchSize) {
      this.flush();
    }
  }

  /**
   * Track page view
   */
  trackPageView(path: string, title: string, referrer?: string): void {
    const pageView: PageView = {
      path,
      title,
      referrer: referrer || document.referrer,
      timestamp: new Date(),
      sessionId: this.sessionId,
    };

    this.pageViews.push(pageView);

    console.log('[Analytics] Page view:', pageView);

    this.flush();
  }

  /**
   * Track performance metric
   */
  trackPerformance(name: string, value: number, unit: string): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
    };

    this.performanceMetrics.push(metric);

    console.log('[Analytics] Performance:', metric);
  }

  /**
   * Log error
   */
  logError(
    message: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    context?: Record<string, any>,
    stack?: string
  ): void {
    const errorLog: ErrorLog = {
      message,
      stack,
      severity,
      context,
      timestamp: new Date(),
    };

    this.errorLogs.push(errorLog);

    console.error('[Analytics] Error logged:', errorLog);

    // Flush critical errors immediately
    if (severity === 'critical' || severity === 'high') {
      this.flush();
    }
  }

  /**
   * Flush analytics data to server
   */
  private async flush(): Promise<void> {
    if (
      this.events.length === 0 &&
      this.pageViews.length === 0 &&
      this.performanceMetrics.length === 0 &&
      this.errorLogs.length === 0
    ) {
      return;
    }

    const payload = {
      sessionId: this.sessionId,
      userId: this.userId,
      events: [...this.events],
      pageViews: [...this.pageViews],
      performanceMetrics: [...this.performanceMetrics],
      errorLogs: [...this.errorLogs],
      timestamp: new Date().toISOString(),
    };

    // Clear buffers
    this.events = [];
    this.pageViews = [];
    this.performanceMetrics = [];
    this.errorLogs = [];

    try {
      // In production, send to analytics backend
      // For now, just log to console and store locally
      console.log('[Analytics] Flush:', payload);

      // Store in localStorage as backup
      this.storeLocally(payload);

      // If you have a backend endpoint:
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });
    } catch (error) {
      console.error('[Analytics] Flush failed:', error);
      
      // Restore data on failure
      this.events.push(...payload.events);
      this.pageViews.push(...payload.pageViews);
      this.performanceMetrics.push(...payload.performanceMetrics);
      this.errorLogs.push(...payload.errorLogs);
    }
  }

  /**
   * Store analytics locally as fallback
   */
  private storeLocally(payload: any): void {
    try {
      const key = `analytics_${Date.now()}`;
      localStorage.setItem(key, JSON.stringify(payload));

      // Clean up old entries (keep last 10)
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('analytics_'));
      if (keys.length > 10) {
        const sorted = keys.sort();
        sorted.slice(0, keys.length - 10).forEach((k) => localStorage.removeItem(k));
      }
    } catch (error) {
      console.error('[Analytics] Local storage failed:', error);
    }
  }

  /**
   * Start periodic flush timer
   */
  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Stop periodic flush
   */
  stopPeriodicFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
  }

  /**
   * Track browser performance metrics
   */
  private trackPerformanceMetrics(): void {
    if (!('performance' in window)) {
      return;
    }

    // Wait for page to fully load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        if (perfData) {
          this.trackPerformance('page_load_time', perfData.loadEventEnd - perfData.fetchStart, 'ms');
          this.trackPerformance('dom_interactive', perfData.domInteractive - perfData.fetchStart, 'ms');
          this.trackPerformance('dom_content_loaded', perfData.domContentLoadedEventEnd - perfData.fetchStart, 'ms');
        }

        // Track First Contentful Paint
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach((entry) => {
          this.trackPerformance(entry.name, entry.startTime, 'ms');
        });
      }, 0);
    });
  }

  /**
   * Setup global error tracking
   */
  private setupErrorTracking(): void {
    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      this.logError(
        event.message,
        'high',
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
        event.error?.stack
      );
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(
        `Unhandled promise rejection: ${event.reason}`,
        'high',
        { reason: event.reason }
      );
    });
  }

  /**
   * Get all stored analytics data
   */
  getStoredData(): any[] {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('analytics_'));
    return keys.map((key) => {
      try {
        return JSON.parse(localStorage.getItem(key) || '{}');
      } catch {
        return null;
      }
    }).filter(Boolean);
  }

  /**
   * Clear all stored analytics data
   */
  clearStoredData(): void {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('analytics_'));
    keys.forEach((key) => localStorage.removeItem(key));
  }

  /**
   * Destroy analytics service
   */
  destroy(): void {
    this.stopPeriodicFlush();
    this.flush();
  }
}

// --- SINGLETON ---

let analyticsService: AnalyticsService | null = null;

export function getAnalyticsService(): AnalyticsService {
  if (!analyticsService) {
    analyticsService = new AnalyticsService();
  }
  return analyticsService;
}

// --- HELPER FUNCTIONS ---

/**
 * Track button click
 */
export function trackButtonClick(buttonName: string, context?: Record<string, any>): void {
  getAnalyticsService().trackEvent('button_click', 'interaction', {
    button: buttonName,
    ...context,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmit(formName: string, success: boolean): void {
  getAnalyticsService().trackEvent('form_submit', 'conversion', {
    form: formName,
    success,
  });
}

/**
 * Track search
 */
export function trackSearch(query: string, resultsCount: number): void {
  getAnalyticsService().trackEvent('search', 'engagement', {
    query,
    resultsCount,
  });
}

/**
 * Track AI interaction
 */
export function trackAIInteraction(
  agent: string,
  action: string,
  metadata?: Record<string, any>
): void {
  getAnalyticsService().trackEvent('ai_interaction', 'ai', {
    agent,
    action,
    ...metadata,
  });
}

/**
 * Track trip action
 */
export function trackTripAction(action: string, tripId?: string): void {
  getAnalyticsService().trackEvent('trip_action', 'trip', {
    action,
    tripId,
  });
}

// --- EXPORTS ---

export default AnalyticsService;
