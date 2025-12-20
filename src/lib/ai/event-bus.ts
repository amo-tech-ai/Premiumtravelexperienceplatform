/**
 * Event Bus Architecture
 * Enables communication between AI agents and components
 */

// --- TYPES ---

export type EventType =
  | 'agent:request'
  | 'agent:response'
  | 'agent:error'
  | 'conflict:detected'
  | 'route:optimized'
  | 'budget:updated'
  | 'budget:alert'
  | 'booking:requested'
  | 'booking:confirmed'
  | 'event:discovered'
  | 'restaurant:found'
  | 'itinerary:changed'
  | 'user:action';

export interface EventPayload {
  type: EventType;
  data: any;
  timestamp: number;
  source?: string;
  target?: string;
  priority?: 'low' | 'normal' | 'high';
}

export type EventHandler = (payload: EventPayload) => void | Promise<void>;

export interface EventSubscription {
  id: string;
  type: EventType | EventType[];
  handler: EventHandler;
  once?: boolean;
}

// --- EVENT BUS CLASS ---

export class EventBus {
  private subscriptions: Map<EventType, Map<string, EventSubscription>>;
  private eventHistory: EventPayload[];
  private maxHistorySize: number;
  private isDebugMode: boolean;

  constructor(maxHistorySize: number = 100, debugMode: boolean = false) {
    this.subscriptions = new Map();
    this.eventHistory = [];
    this.maxHistorySize = maxHistorySize;
    this.isDebugMode = debugMode;

    // Initialize subscription maps for all event types
    const eventTypes: EventType[] = [
      'agent:request',
      'agent:response',
      'agent:error',
      'conflict:detected',
      'route:optimized',
      'budget:updated',
      'budget:alert',
      'booking:requested',
      'booking:confirmed',
      'event:discovered',
      'restaurant:found',
      'itinerary:changed',
      'user:action',
    ];

    eventTypes.forEach(type => {
      this.subscriptions.set(type, new Map());
    });
  }

  /**
   * Subscribe to one or more event types
   */
  on(
    type: EventType | EventType[],
    handler: EventHandler,
    options?: { once?: boolean; id?: string }
  ): string {
    const types = Array.isArray(type) ? type : [type];
    const subscriptionId = options?.id || this.generateId();

    types.forEach(eventType => {
      const subscription: EventSubscription = {
        id: subscriptionId,
        type: eventType,
        handler,
        once: options?.once || false,
      };

      const typeSubscriptions = this.subscriptions.get(eventType);
      if (typeSubscriptions) {
        typeSubscriptions.set(subscriptionId, subscription);
      }
    });

    if (this.isDebugMode) {
      console.log(`[EventBus] Subscribed to ${types.join(', ')} with ID: ${subscriptionId}`);
    }

    return subscriptionId;
  }

  /**
   * Subscribe once (auto-unsubscribe after first event)
   */
  once(type: EventType | EventType[], handler: EventHandler): string {
    return this.on(type, handler, { once: true });
  }

  /**
   * Unsubscribe from events
   */
  off(subscriptionId: string) {
    let found = false;

    this.subscriptions.forEach((typeSubscriptions, eventType) => {
      if (typeSubscriptions.has(subscriptionId)) {
        typeSubscriptions.delete(subscriptionId);
        found = true;
      }
    });

    if (this.isDebugMode && found) {
      console.log(`[EventBus] Unsubscribed: ${subscriptionId}`);
    }
  }

  /**
   * Emit an event to all subscribers
   */
  async emit(type: EventType, data: any, options?: { source?: string; target?: string; priority?: 'low' | 'normal' | 'high' }) {
    const payload: EventPayload = {
      type,
      data,
      timestamp: Date.now(),
      source: options?.source,
      target: options?.target,
      priority: options?.priority || 'normal',
    };

    // Add to history
    this.addToHistory(payload);

    if (this.isDebugMode) {
      console.log(`[EventBus] Emitting ${type}:`, payload);
    }

    // Get subscribers for this event type
    const typeSubscriptions = this.subscriptions.get(type);
    if (!typeSubscriptions || typeSubscriptions.size === 0) {
      if (this.isDebugMode) {
        console.log(`[EventBus] No subscribers for ${type}`);
      }
      return;
    }

    // Execute handlers
    const handlersToRemove: string[] = [];

    for (const [id, subscription] of typeSubscriptions) {
      try {
        // Filter by target if specified
        if (options?.target && options.target !== id) {
          continue;
        }

        await subscription.handler(payload);

        // Mark for removal if once
        if (subscription.once) {
          handlersToRemove.push(id);
        }
      } catch (error) {
        console.error(`[EventBus] Handler error for ${type}:`, error);
        
        // Emit error event
        this.emit('agent:error', {
          originalEvent: type,
          error: error instanceof Error ? error.message : 'Unknown error',
          handler: id,
        });
      }
    }

    // Remove once handlers
    handlersToRemove.forEach(id => this.off(id));
  }

  /**
   * Emit and wait for a response (request-response pattern)
   */
  async request(type: EventType, data: any, timeout: number = 5000): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = this.generateId();
      const responseType = 'agent:response';

      // Set up timeout
      const timer = setTimeout(() => {
        this.off(requestId);
        reject(new Error(`Request timeout for ${type}`));
      }, timeout);

      // Subscribe to response
      this.once(responseType, (payload: EventPayload) => {
        if (payload.data.requestId === requestId) {
          clearTimeout(timer);
          resolve(payload.data.response);
        }
      });

      // Emit request
      this.emit(type, { ...data, requestId }, { priority: 'high' });
    });
  }

  /**
   * Get event history
   */
  getHistory(filter?: { type?: EventType; source?: string; limit?: number }): EventPayload[] {
    let filtered = this.eventHistory;

    if (filter?.type) {
      filtered = filtered.filter(e => e.type === filter.type);
    }

    if (filter?.source) {
      filtered = filtered.filter(e => e.source === filter.source);
    }

    if (filter?.limit) {
      filtered = filtered.slice(-filter.limit);
    }

    return filtered;
  }

  /**
   * Clear event history
   */
  clearHistory() {
    this.eventHistory = [];
    if (this.isDebugMode) {
      console.log('[EventBus] History cleared');
    }
  }

  /**
   * Get all active subscriptions (for debugging)
   */
  getSubscriptions(): Record<EventType, number> {
    const counts: Record<string, number> = {};

    this.subscriptions.forEach((subs, type) => {
      counts[type] = subs.size;
    });

    return counts as Record<EventType, number>;
  }

  /**
   * Enable/disable debug mode
   */
  setDebugMode(enabled: boolean) {
    this.isDebugMode = enabled;
    console.log(`[EventBus] Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  // --- PRIVATE METHODS ---

  private addToHistory(payload: EventPayload) {
    this.eventHistory.push(payload);

    // Trim history if needed
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
    }
  }

  private generateId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// --- SINGLETON INSTANCE ---

let eventBusInstance: EventBus | null = null;

export function getEventBus(): EventBus {
  if (!eventBusInstance) {
    // Check if debug mode from localStorage
    const debugMode = typeof window !== 'undefined' 
      && localStorage.getItem('eventbus_debug') === 'true';
    
    eventBusInstance = new EventBus(100, debugMode);
  }
  return eventBusInstance;
}

export function initializeEventBus(maxHistorySize?: number, debugMode?: boolean): EventBus {
  eventBusInstance = new EventBus(maxHistorySize, debugMode);
  return eventBusInstance;
}

// --- CONVENIENCE FUNCTIONS ---

/**
 * Quick emit function
 */
export function emit(type: EventType, data: any, options?: { source?: string; target?: string; priority?: 'low' | 'normal' | 'high' }) {
  return getEventBus().emit(type, data, options);
}

/**
 * Quick subscribe function
 */
export function on(type: EventType | EventType[], handler: EventHandler, options?: { once?: boolean; id?: string }): string {
  return getEventBus().on(type, handler, options);
}

/**
 * Quick unsubscribe function
 */
export function off(subscriptionId: string) {
  return getEventBus().off(subscriptionId);
}

/**
 * Quick once function
 */
export function once(type: EventType | EventType[], handler: EventHandler): string {
  return getEventBus().once(type, handler);
}

// --- EXPORTS ---

export default EventBus;
