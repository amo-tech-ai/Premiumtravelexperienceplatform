/**
 * EVENT BUS - Agent Communication System
 * 
 * Enables the 6 AI agents to communicate and coordinate:
 * - Curator (finds restaurants/events)
 * - Navigator (plans routes)
 * - Negotiator (handles bookings)
 * - Chronicler (documents trip)
 * - Sentinel (monitors for issues)
 * - Optimizer (improves plans)
 */

import { TripEntity, EntityType } from './types/TripTypes';

// ============================================================================
// EVENT TYPES
// ============================================================================

export type EventType =
  // Entity Events
  | 'entity.added'
  | 'entity.removed'
  | 'entity.updated'
  | 'entity.saved'
  | 'entity.unsaved'
  
  // Trip Events
  | 'trip.created'
  | 'trip.updated'
  | 'trip.deleted'
  | 'trip.day.changed'
  
  // Restaurant Events
  | 'restaurant.added'
  | 'restaurant.removed'
  | 'restaurant.reserved'
  | 'restaurant.reservation.confirmed'
  
  // Event Events
  | 'event.added'
  | 'event.removed'
  | 'event.ticket.purchased'
  | 'event.ticket.reserved'
  
  // Rental Events
  | 'rental.added'
  | 'rental.removed'
  | 'rental.inquiry.sent'
  | 'rental.booked'
  | 'rental.confirmed'
  
  // Destination Events
  | 'destination.added'
  | 'destination.removed'
  | 'destination.visited'
  
  // Schedule Events
  | 'schedule.conflict.detected'
  | 'schedule.conflict.resolved'
  | 'schedule.optimized'
  
  // Budget Events
  | 'budget.updated'
  | 'budget.alert'
  | 'budget.exceeded'
  
  // Navigation Events
  | 'route.calculated'
  | 'route.optimized'
  | 'location.changed'
  
  // Agent Events
  | 'agent.suggestion'
  | 'agent.action.completed'
  | 'agent.error'
  
  // User Events
  | 'user.preferences.updated'
  | 'user.location.updated';

// ============================================================================
// EVENT PAYLOAD TYPES
// ============================================================================

export interface BaseEventPayload {
  timestamp: Date;
  source: string; // Agent or component name
  userId?: string;
  tripId?: string;
}

export interface EntityEventPayload extends BaseEventPayload {
  entityType: EntityType;
  entityId: string;
  entity: TripEntity;
  previousEntity?: TripEntity;
  changes?: Partial<TripEntity>;
}

export interface ConflictEventPayload extends BaseEventPayload {
  conflictId: string;
  conflictType: string;
  severity: 'minor' | 'major' | 'blocking';
  affectedEntities: string[];
  message: string;
  suggestions?: string[];
}

export interface BudgetEventPayload extends BaseEventPayload {
  previousAmount: number;
  newAmount: number;
  difference: number;
  category: string;
  remaining: number;
  alert?: {
    type: string;
    severity: string;
    message: string;
  };
}

export interface RouteEventPayload extends BaseEventPayload {
  fromEntityId: string;
  toEntityId: string;
  mode: string;
  duration: number;
  distance: number;
  cost?: number;
  route?: any;
}

export interface AgentSuggestionPayload extends BaseEventPayload {
  agentName: string;
  suggestionType: string;
  suggestion: any;
  priority: 'low' | 'medium' | 'high';
  actionRequired: boolean;
}

export type EventPayload = 
  | EntityEventPayload 
  | ConflictEventPayload 
  | BudgetEventPayload 
  | RouteEventPayload
  | AgentSuggestionPayload
  | BaseEventPayload;

// ============================================================================
// EVENT BUS CLASS
// ============================================================================

type EventHandler<T extends EventPayload = EventPayload> = (payload: T) => void | Promise<void>;

interface Subscription {
  id: string;
  eventType: EventType;
  handler: EventHandler;
  once: boolean;
}

export class EventBus {
  private subscriptions: Map<EventType, Subscription[]> = new Map();
  private eventHistory: Array<{ type: EventType; payload: EventPayload }> = [];
  private maxHistorySize = 100;
  private isDebugMode = false;

  /**
   * Subscribe to an event
   */
  subscribe<T extends EventPayload = EventPayload>(
    eventType: EventType,
    handler: EventHandler<T>,
    options: { once?: boolean } = {}
  ): () => void {
    const subscription: Subscription = {
      id: this.generateId(),
      eventType,
      handler: handler as EventHandler,
      once: options.once || false
    };

    const handlers = this.subscriptions.get(eventType) || [];
    handlers.push(subscription);
    this.subscriptions.set(eventType, handlers);

    if (this.isDebugMode) {
      console.log(`[EventBus] Subscribed to ${eventType}`, subscription.id);
    }

    // Return unsubscribe function
    return () => this.unsubscribe(subscription.id);
  }

  /**
   * Subscribe to an event once
   */
  once<T extends EventPayload = EventPayload>(
    eventType: EventType,
    handler: EventHandler<T>
  ): () => void {
    return this.subscribe(eventType, handler, { once: true });
  }

  /**
   * Unsubscribe from an event
   */
  unsubscribe(subscriptionId: string): void {
    this.subscriptions.forEach((handlers, eventType) => {
      const filtered = handlers.filter(sub => sub.id !== subscriptionId);
      if (filtered.length === 0) {
        this.subscriptions.delete(eventType);
      } else {
        this.subscriptions.set(eventType, filtered);
      }
    });

    if (this.isDebugMode) {
      console.log(`[EventBus] Unsubscribed ${subscriptionId}`);
    }
  }

  /**
   * Publish an event
   */
  async publish<T extends EventPayload = EventPayload>(
    eventType: EventType,
    payload: T
  ): Promise<void> {
    // Add to history
    this.addToHistory(eventType, payload);

    if (this.isDebugMode) {
      console.log(`[EventBus] Publishing ${eventType}`, payload);
    }

    const handlers = this.subscriptions.get(eventType) || [];
    const onceHandlers: string[] = [];

    // Execute all handlers
    const promises = handlers.map(async (subscription) => {
      try {
        await subscription.handler(payload);
        
        if (subscription.once) {
          onceHandlers.push(subscription.id);
        }
      } catch (error) {
        console.error(`[EventBus] Error in handler for ${eventType}:`, error);
        
        // Publish error event
        this.publish('agent.error', {
          timestamp: new Date(),
          source: 'EventBus',
          error: error instanceof Error ? error.message : 'Unknown error'
        } as any);
      }
    });

    await Promise.all(promises);

    // Clean up once handlers
    onceHandlers.forEach(id => this.unsubscribe(id));
  }

  /**
   * Publish event synchronously (fire and forget)
   */
  publishSync<T extends EventPayload = EventPayload>(
    eventType: EventType,
    payload: T
  ): void {
    this.publish(eventType, payload).catch(error => {
      console.error('[EventBus] Sync publish error:', error);
    });
  }

  /**
   * Get event history
   */
  getHistory(limit?: number): Array<{ type: EventType; payload: EventPayload }> {
    const history = [...this.eventHistory];
    return limit ? history.slice(-limit) : history;
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Get all subscriptions for debugging
   */
  getSubscriptions(): Map<EventType, number> {
    const counts = new Map<EventType, number>();
    this.subscriptions.forEach((handlers, eventType) => {
      counts.set(eventType, handlers.length);
    });
    return counts;
  }

  /**
   * Enable/disable debug mode
   */
  setDebugMode(enabled: boolean): void {
    this.isDebugMode = enabled;
    console.log(`[EventBus] Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Clear all subscriptions
   */
  clearAllSubscriptions(): void {
    this.subscriptions.clear();
    if (this.isDebugMode) {
      console.log('[EventBus] All subscriptions cleared');
    }
  }

  // Private helpers
  private addToHistory(type: EventType, payload: EventPayload): void {
    this.eventHistory.push({ type, payload });
    
    // Trim history if too large
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
    }
  }

  private generateId(): string {
    return `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const eventBus = new EventBus();

// Enable debug mode in development
if (typeof window !== 'undefined') {
  (window as any).__eventBus = eventBus;
  
  if (process.env.NODE_ENV === 'development') {
    eventBus.setDebugMode(true);
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a typed event publisher
 */
export function createPublisher<T extends EventPayload>(
  eventType: EventType,
  source: string
) {
  return (payload: Omit<T, 'timestamp' | 'source'>) => {
    return eventBus.publish(eventType, {
      ...payload,
      timestamp: new Date(),
      source
    } as T);
  };
}

/**
 * Create a typed event subscriber
 */
export function createSubscriber<T extends EventPayload>(
  eventType: EventType
) {
  return (handler: EventHandler<T>, options?: { once?: boolean }) => {
    return eventBus.subscribe(eventType, handler, options);
  };
}

/**
 * Wait for an event (Promise-based)
 */
export function waitForEvent<T extends EventPayload>(
  eventType: EventType,
  timeout?: number
): Promise<T> {
  return new Promise((resolve, reject) => {
    let timeoutId: NodeJS.Timeout | undefined;

    const unsubscribe = eventBus.once(eventType, (payload) => {
      if (timeoutId) clearTimeout(timeoutId);
      resolve(payload as T);
    });

    if (timeout) {
      timeoutId = setTimeout(() => {
        unsubscribe();
        reject(new Error(`Event ${eventType} timeout after ${timeout}ms`));
      }, timeout);
    }
  });
}
