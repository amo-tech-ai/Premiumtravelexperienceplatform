/**
 * PREVIEW FACTORY - Helper functions for creating preview batches
 * 
 * Provides convenient methods to create preview batches for common scenarios
 * across Trips, Events, Rentals, and Restaurants.
 */

import {
  PreviewBatch,
  PreviewAction,
  PreviewItem,
  PreviewConflict,
  PreviewActionType,
  PreviewEntityType,
  ConflictSeverity
} from './PreviewTypes';

/**
 * Generate unique ID
 */
const generateId = () => `preview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Create a preview batch
 */
export function createPreviewBatch(
  agentName: string,
  summary: string,
  actions: PreviewAction[],
  options: {
    explanation?: string;
    totalCost?: string;
    totalDuration?: string;
    affectedDate?: string;
    allowPartialApply?: boolean;
    requiresUserChoice?: boolean;
    alternatives?: PreviewBatch[];
  } = {}
): PreviewBatch {
  // Aggregate conflicts from all actions
  const conflicts: PreviewConflict[] = [];
  actions.forEach(action => {
    if (action.conflicts) {
      conflicts.push(...action.conflicts);
    }
  });

  return {
    id: generateId(),
    agentName,
    summary,
    explanation: options.explanation,
    actions,
    totalCost: options.totalCost,
    totalDuration: options.totalDuration,
    affectedDate: options.affectedDate,
    conflicts,
    status: 'pending',
    createdAt: new Date(),
    allowPartialApply: options.allowPartialApply ?? false,
    requiresUserChoice: options.requiresUserChoice ?? false,
    alternatives: options.alternatives
  };
}

/**
 * Create a preview action
 */
export function createPreviewAction(
  type: PreviewActionType,
  entityType: PreviewEntityType,
  item: PreviewItem,
  options: {
    previousItem?: PreviewItem;
    fromIndex?: number;
    toIndex?: number;
    conflicts?: PreviewConflict[];
    agentName?: string;
    reason?: string;
  } = {}
): PreviewAction {
  return {
    id: generateId(),
    type,
    entityType,
    item,
    previousItem: options.previousItem,
    fromIndex: options.fromIndex,
    toIndex: options.toIndex,
    conflicts: options.conflicts || [],
    timestamp: new Date(),
    agentName: options.agentName,
    reason: options.reason
  };
}

/**
 * Create a preview item
 */
export function createPreviewItem(
  name: string,
  details: string,
  options: {
    time?: string;
    duration?: string;
    location?: string;
    cost?: string;
    notes?: string;
    metadata?: Record<string, any>;
  } = {}
): PreviewItem {
  return {
    id: generateId(),
    name,
    details,
    ...options
  };
}

/**
 * Create a conflict
 */
export function createConflict(
  severity: ConflictSeverity,
  type: PreviewConflict['type'],
  message: string,
  conflictingItem: {
    id: string;
    name: string;
    time?: string;
    location?: string;
  },
  options: {
    suggestions?: string[];
    autoResolvable?: boolean;
  } = {}
): PreviewConflict {
  return {
    id: generateId(),
    severity,
    type,
    message,
    conflictingItem,
    suggestions: options.suggestions || [],
    autoResolvable: options.autoResolvable ?? false
  };
}

/**
 * RESTAURANT PREVIEW FACTORIES
 */

export function createRestaurantAddBatch(
  restaurants: Array<{
    name: string;
    cuisine: string;
    price: string;
    time: string;
    location: string;
  }>,
  reason?: string
): PreviewBatch {
  const actions = restaurants.map(restaurant =>
    createPreviewAction(
      'add',
      'restaurant',
      createPreviewItem(
        restaurant.name,
        `${restaurant.cuisine} • ${restaurant.price}`,
        {
          time: restaurant.time,
          location: restaurant.location
        }
      ),
      {
        agentName: 'Local Scout',
        reason: reason || 'Matches your cuisine preferences and budget'
      }
    )
  );

  return createPreviewBatch(
    'Local Scout',
    `Add ${restaurants.length} restaurants to your trip`,
    actions,
    {
      explanation: 'These restaurants match your preferences for Saturday dinner.',
      affectedDate: 'Saturday, Dec 28'
    }
  );
}

export function createRestaurantReserveBatch(
  restaurant: string,
  time: string,
  guests: number
): PreviewBatch {
  const action = createPreviewAction(
    'reserve',
    'restaurant',
    createPreviewItem(
      restaurant,
      `Table for ${guests}`,
      {
        time,
        notes: 'Reservation confirmed pending credit card'
      }
    ),
    {
      agentName: 'Local Scout',
      reason: 'Available time slot secured for 2 hours'
    }
  );

  return createPreviewBatch(
    'Local Scout',
    `Reserve table at ${restaurant}`,
    [action],
    {
      explanation: 'Your reservation will be held for 15 minutes.',
      affectedDate: time
    }
  );
}

/**
 * EVENT PREVIEW FACTORIES
 */

export function createEventAddBatch(
  event: {
    name: string;
    category: string;
    time: string;
    location: string;
    price: string;
  },
  conflicts?: Array<{
    tripName: string;
    conflictTime: string;
    severity: 'minor' | 'major';
  }>
): PreviewBatch {
  const conflictObjects = conflicts?.map(c =>
    createConflict(
      c.severity === 'major' ? 'major' : 'minor',
      'time_overlap',
      `This event overlaps with "${c.tripName}"`,
      {
        id: 'trip-1',
        name: c.tripName,
        time: c.conflictTime
      },
      {
        suggestions: [
          'Reschedule the conflicting activity',
          'Choose a different event time',
          'Shorten one of the activities'
        ],
        autoResolvable: c.severity === 'minor'
      }
    )
  );

  const action = createPreviewAction(
    'add',
    'event',
    createPreviewItem(
      event.name,
      event.category,
      {
        time: event.time,
        location: event.location,
        cost: event.price
      }
    ),
    {
      agentName: 'Local Scout',
      reason: 'Highly rated event matching your interests',
      conflicts: conflictObjects
    }
  );

  return createPreviewBatch(
    'Local Scout',
    `Add "${event.name}" to your trip`,
    [action],
    {
      explanation: conflicts?.length 
        ? 'Note: This event has scheduling conflicts that need resolution.'
        : 'This event fits perfectly into your Saturday schedule.',
      affectedDate: event.time.split(',')[0]
    }
  );
}

/**
 * TRIP PREVIEW FACTORIES
 */

export function createTripModifyBatch(
  changes: Array<{
    type: 'add' | 'remove' | 'modify' | 'reorder';
    name: string;
    details: string;
    time?: string;
    duration?: string;
    location?: string;
    cost?: string;
    previousName?: string;
    previousTime?: string;
  }>
): PreviewBatch {
  const actions = changes.map(change => {
    const item = createPreviewItem(change.name, change.details, {
      time: change.time,
      duration: change.duration,
      location: change.location,
      cost: change.cost
    });

    const previousItem = change.previousName
      ? createPreviewItem(change.previousName, change.details, {
          time: change.previousTime
        })
      : undefined;

    return createPreviewAction(
      change.type,
      'trip_activity',
      item,
      {
        previousItem,
        agentName: 'Local Scout',
        reason: `Optimizing your ${change.time?.split(',')[0] || 'schedule'}`
      }
    );
  });

  const totalCost = changes
    .filter(c => c.cost)
    .reduce((sum, c) => {
      const value = parseFloat(c.cost?.replace(/[^0-9.]/g, '') || '0');
      return sum + value;
    }, 0);

  return createPreviewBatch(
    'Local Scout',
    'Optimize your Saturday itinerary',
    actions,
    {
      explanation: 'These changes improve pacing and reduce travel time.',
      totalCost: totalCost > 0 ? `$${totalCost}` : undefined,
      affectedDate: 'Saturday, Dec 28',
      allowPartialApply: true
    }
  );
}

/**
 * RENTAL PREVIEW FACTORIES
 */

export function createRentalCompareBatch(
  properties: Array<{
    name: string;
    type: string;
    price: string;
    location: string;
    bedrooms: number;
    valueScore: number;
  }>
): PreviewBatch {
  const actions = properties.map(property =>
    createPreviewAction(
      'compare',
      'rental',
      createPreviewItem(
        property.name,
        `${property.bedrooms} bed ${property.type}`,
        {
          location: property.location,
          cost: property.price,
          notes: `Value score: ${property.valueScore > 0 ? '+' : ''}${property.valueScore}%`
        }
      ),
      {
        agentName: 'Local Scout',
        reason: 'Selected for comparison based on your criteria'
      }
    )
  );

  return createPreviewBatch(
    'Local Scout',
    `Compare ${properties.length} properties`,
    actions,
    {
      explanation: 'Side-by-side comparison of top-rated properties in your budget.',
      requiresUserChoice: true
    }
  );
}

/**
 * MULTI-OPTION PREVIEW FACTORY (for trip plans)
 */

export function createMultiOptionBatch(
  options: Array<{
    title: string;
    subtitle: string;
    activities: Array<{
      name: string;
      type: string;
      time: string;
      location: string;
      cost?: string;
    }>;
    totalCost: string;
    totalDuration: string;
    pacing: string;
  }>
): PreviewBatch {
  const alternatives = options.map(option => {
    const actions = option.activities.map(activity =>
      createPreviewAction(
        'add',
        'trip_activity',
        createPreviewItem(
          activity.name,
          activity.type,
          {
            time: activity.time,
            location: activity.location,
            cost: activity.cost
          }
        )
      )
    );

    return createPreviewBatch(
      'Local Scout',
      option.title,
      actions,
      {
        explanation: option.subtitle,
        totalCost: option.totalCost,
        totalDuration: option.totalDuration,
        affectedDate: 'Saturday, Dec 28'
      }
    );
  });

  // Return the first option with alternatives
  return {
    ...alternatives[0],
    summary: 'Choose your Saturday trip plan',
    explanation: `${options.length} options with different pacing and activities.`,
    requiresUserChoice: true,
    alternatives: alternatives.slice(1)
  };
}
