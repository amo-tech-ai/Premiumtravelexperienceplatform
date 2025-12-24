/**
 * EVENT BUS HOOKS
 * 
 * React hooks for subscribing to event bus events
 */

import { useEffect, useCallback, useRef } from 'react';
import { eventBus, EventType, EventPayload, EntityEventPayload } from '../EventBus';

/**
 * Subscribe to a specific event
 */
export function useEventBus<T extends EventPayload = EventPayload>(
  eventType: EventType,
  handler: (payload: T) => void,
  dependencies: any[] = []
) {
  const handlerRef = useRef(handler);
  
  // Update handler ref when it changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const unsubscribe = eventBus.subscribe<T>(eventType, (payload) => {
      handlerRef.current(payload);
    });

    return unsubscribe;
  }, [eventType, ...dependencies]);
}

/**
 * Subscribe to multiple events
 */
export function useEventBusMultiple(
  subscriptions: Array<{
    eventType: EventType;
    handler: (payload: any) => void;
  }>,
  dependencies: any[] = []
) {
  useEffect(() => {
    const unsubscribers = subscriptions.map(({ eventType, handler }) =>
      eventBus.subscribe(eventType, handler)
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [JSON.stringify(subscriptions.map(s => s.eventType)), ...dependencies]);
}

/**
 * Publish an event
 */
export function useEventBusPublisher() {
  return useCallback(<T extends EventPayload>(eventType: EventType, payload: T) => {
    return eventBus.publish(eventType, payload);
  }, []);
}

/**
 * Subscribe to entity events (add, remove, update)
 */
export function useEntityEvents(handlers: {
  onAdd?: (payload: EntityEventPayload) => void;
  onRemove?: (payload: EntityEventPayload) => void;
  onUpdate?: (payload: EntityEventPayload) => void;
}) {
  useEffect(() => {
    const unsubscribers: Array<() => void> = [];

    if (handlers.onAdd) {
      unsubscribers.push(
        eventBus.subscribe('entity.added', handlers.onAdd)
      );
    }

    if (handlers.onRemove) {
      unsubscribers.push(
        eventBus.subscribe('entity.removed', handlers.onRemove)
      );
    }

    if (handlers.onUpdate) {
      unsubscribers.push(
        eventBus.subscribe('entity.updated', handlers.onUpdate)
      );
    }

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [handlers.onAdd, handlers.onRemove, handlers.onUpdate]);
}

/**
 * Subscribe to budget events
 */
export function useBudgetEvents(handlers: {
  onUpdate?: (payload: any) => void;
  onAlert?: (payload: any) => void;
  onExceeded?: (payload: any) => void;
}) {
  useEffect(() => {
    const unsubscribers: Array<() => void> = [];

    if (handlers.onUpdate) {
      unsubscribers.push(
        eventBus.subscribe('budget.updated', handlers.onUpdate)
      );
    }

    if (handlers.onAlert) {
      unsubscribers.push(
        eventBus.subscribe('budget.alert', handlers.onAlert)
      );
    }

    if (handlers.onExceeded) {
      unsubscribers.push(
        eventBus.subscribe('budget.exceeded', handlers.onExceeded)
      );
    }

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [handlers.onUpdate, handlers.onAlert, handlers.onExceeded]);
}

/**
 * Get event history
 */
export function useEventHistory(limit?: number) {
  return useCallback(() => {
    return eventBus.getHistory(limit);
  }, [limit]);
}
