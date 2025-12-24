/**
 * INTEGRATION EXAMPLES
 * 
 * How to integrate the Context Provider with existing components
 */

import React from 'react';
import { useRestaurants, useBudget, useConflicts, useEventBus } from '@/context';
import { Restaurant } from '@/context/types/TripTypes';
import { toast } from 'sonner';

// ============================================================================
// EXAMPLE 1: Restaurant Card Integration
// ============================================================================

export function RestaurantCardWithContext({ restaurant }: { restaurant: Restaurant }) {
  const { addToTrip, save, inTrip } = useRestaurants();
  const { checkImpact } = useBudget();
  const { conflicts, hasBlocking } = useConflicts(restaurant, 'Saturday');

  // Check if already in trip
  const isInTrip = inTrip.some(r => r.id === restaurant.id);

  // Handle add to trip
  const handleAddToTrip = async () => {
    // Check budget first
    const budgetCheck = checkImpact(restaurant);
    
    if (!budgetCheck.canAfford) {
      toast.error('This would exceed your budget!');
      return;
    }

    if (budgetCheck.alerts.length > 0) {
      const alert = budgetCheck.alerts[0];
      toast.warning(alert.message);
    }

    // Check conflicts
    if (hasBlocking) {
      toast.error('Resolve scheduling conflicts first!');
      return;
    }

    if (conflicts.length > 0) {
      // Show conflicts
      conflicts.forEach(c => {
        toast.warning(c.message);
      });
    }

    // Add to trip
    const result = addToTrip(
      restaurant,
      'Saturday',
      new Date('2024-12-28T19:00:00')
    );

    if (result.success) {
      toast.success(`Added ${restaurant.name} to your trip!`);
    } else {
      toast.error(result.message || 'Failed to add');
    }
  };

  const handleSave = () => {
    save(restaurant);
    toast.success('Saved for later!');
  };

  return (
    <div className="restaurant-card">
      <h3>{restaurant.name}</h3>
      <p>{restaurant.cuisine} • {restaurant.priceLevel}</p>
      
      {/* Show conflicts if any */}
      {conflicts.length > 0 && (
        <div className="conflicts">
          {conflicts.map(conflict => (
            <div key={conflict.id} className={`conflict-${conflict.severity}`}>
              ⚠️ {conflict.message}
            </div>
          ))}
        </div>
      )}

      <div className="actions">
        <button onClick={handleSave}>
          {restaurant.saved ? '❤️ Saved' : '🤍 Save'}
        </button>
        
        <button 
          onClick={handleAddToTrip}
          disabled={isInTrip || hasBlocking}
        >
          {isInTrip ? '✅ In Trip' : '➕ Add to Trip'}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Budget Widget
// ============================================================================

export function BudgetWidget() {
  const { budget, percentSpent, isOverBudget, alerts } = useBudget();

  if (!budget) {
    return <div>No active trip</div>;
  }

  return (
    <div className="budget-widget">
      <h4>Budget</h4>
      
      {/* Progress bar */}
      <div className="progress">
        <div 
          className={`progress-bar ${isOverBudget ? 'over' : ''}`}
          style={{ width: `${Math.min(percentSpent, 100)}%` }}
        />
      </div>

      {/* Stats */}
      <div className="stats">
        <span>${budget.spent} spent</span>
        <span>${budget.remaining} remaining</span>
      </div>

      {/* Breakdown */}
      <div className="breakdown">
        <div className="category">
          <span>Restaurants</span>
          <span>${budget.breakdown.restaurants}</span>
        </div>
        <div className="category">
          <span>Events</span>
          <span>${budget.breakdown.events}</span>
        </div>
        <div className="category">
          <span>Rentals</span>
          <span>${budget.breakdown.rentals}</span>
        </div>
        <div className="category">
          <span>Activities</span>
          <span>${budget.breakdown.activities}</span>
        </div>
      </div>

      {/* Alerts */}
      {alerts.map(alert => (
        <div 
          key={alert.id}
          className={`alert-${alert.severity}`}
        >
          {alert.message}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Event Bus Integration in Timeline
// ============================================================================

export function TripTimeline() {
  const { trip } = useCurrentTrip();
  const [notifications, setNotifications] = React.useState<string[]>([]);

  // Listen to all entity events
  useEventBus('entity.added', (payload) => {
    setNotifications(prev => [
      ...prev,
      `Added ${payload.entity.name}`
    ]);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  });

  useEventBus('schedule.conflict.detected', (payload) => {
    toast.warning(payload.message);
  });

  useEventBus('budget.alert', (payload) => {
    toast.error(payload.alert?.message || 'Budget alert!');
  });

  if (!trip) return <div>No active trip</div>;

  return (
    <div className="timeline">
      {/* Notifications */}
      <div className="notifications">
        {notifications.map((notif, i) => (
          <div key={i} className="notification">
            {notif}
          </div>
        ))}
      </div>

      {/* Timeline days */}
      {trip.days.map(day => (
        <div key={day.date} className="day">
          <h3>{day.dayOfWeek} - Day {day.dayNumber}</h3>
          
          <div className="items">
            {day.items.map(item => (
              <div key={item.id} className="item">
                <span className={`type-${item.type}`}>
                  {item.type}
                </span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>

          {/* Day stats */}
          <div className="stats">
            <span>${day.stats.totalCost}</span>
            <span>{Math.floor(day.stats.totalDuration / 60)}h</span>
            <span>{day.stats.activitiesCount} activities</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Multi-Tab Coordination
// ============================================================================

export function SmartSuggestions() {
  const { trip } = useCurrentTrip();
  const { available: restaurants } = useRestaurants();
  const { available: events } = useEvents();
  const [suggestions, setSuggestions] = React.useState<any[]>([]);

  // Listen for agent suggestions
  useEventBus('agent.suggestion', (payload) => {
    if (payload.suggestionType === 'restaurants') {
      setSuggestions(prev => [
        ...prev,
        {
          agent: payload.agentName,
          type: 'restaurants',
          items: payload.suggestion,
          priority: payload.priority
        }
      ]);
    }
  });

  // When user adds a restaurant, Navigator agent calculates route
  useEventBus('restaurant.added', async (payload) => {
    // This would trigger Navigator agent to calculate route
    console.log('Restaurant added, calculating route...');
  });

  // When Optimizer detects better arrangement
  useEventBus('schedule.optimized', (payload) => {
    toast.success('Found better schedule!');
  });

  return (
    <div className="suggestions">
      <h3>AI Suggestions</h3>
      
      {suggestions.map((suggestion, i) => (
        <div key={i} className="suggestion">
          <div className="header">
            <span className="agent">{suggestion.agent}</span>
            <span className={`priority-${suggestion.priority}`}>
              {suggestion.priority}
            </span>
          </div>
          
          <div className="items">
            {suggestion.items.slice(0, 3).map((item: any) => (
              <div key={item.id} className="item">
                {item.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Complete Integration in ChatbotV2Content
// ============================================================================

export function ChatbotIntegration() {
  const { trip } = useCurrentTrip();
  const { available: restaurants, addToTrip: addRestaurant } = useRestaurants();
  const { available: events, addToTrip: addEvent } = useEvents();
  const { budget, checkImpact } = useBudget();

  // Handle AI suggestion to add restaurant
  const handleAISuggestion = async (restaurant: Restaurant) => {
    // Check budget
    const impact = checkImpact(restaurant);
    
    if (!impact.canAfford) {
      return {
        success: false,
        message: 'Would exceed budget'
      };
    }

    // Add to trip
    const result = addRestaurant(restaurant, 'Saturday');
    
    return result;
  };

  // Listen for user queries
  const handleUserQuery = (query: string) => {
    if (query.includes('budget')) {
      return `You've spent $${budget?.spent} of $${budget?.total}. You have $${budget?.remaining} remaining.`;
    }

    if (query.includes('conflicts')) {
      // Check for conflicts
      return 'Checking for scheduling conflicts...';
    }

    if (query.includes('restaurants')) {
      return `Found ${restaurants.length} restaurants matching your preferences.`;
    }

    return 'How can I help with your trip?';
  };

  return (
    <div className="chatbot-integration">
      {/* This is where you'd integrate with ChatbotV2Content */}
      <p>Context-aware AI assistant ready!</p>
    </div>
  );
}
