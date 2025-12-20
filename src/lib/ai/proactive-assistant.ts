/**
 * Proactive AI Assistant
 * Monitors user activity and provides intelligent suggestions without being asked
 * 
 * Features:
 * - Detects patterns in itinerary
 * - Suggests optimizations automatically
 * - Warns about conflicts before they happen
 * - Recommends complementary activities
 * - Budget alerts and alternatives
 */

import { getEventBus, type EventBus } from './event-bus';
import { getGeminiClient, type GeminiClient } from './gemini-client';
import { getNotificationService } from '../services/notifications';
import type { TripItem, TripDay } from '../../components/trip-details/TripDetailsContext';

// --- TYPES ---

export interface ProactiveSuggestion {
  id: string;
  type: 'optimization' | 'warning' | 'recommendation' | 'budget_alert' | 'weather_alert';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  actions?: SuggestionAction[];
  metadata?: Record<string, any>;
  timestamp: number;
  dismissible: boolean;
}

export interface SuggestionAction {
  label: string;
  action: 'apply' | 'dismiss' | 'view_details' | 'customize';
  payload?: any;
}

export interface Pattern {
  type: 'travel_time' | 'budget_risk' | 'conflict' | 'opportunity' | 'preference';
  confidence: number;
  data: any;
}

// --- PROACTIVE ASSISTANT CLASS ---

export class ProactiveAssistant {
  private bus: EventBus;
  private gemini: GeminiClient;
  private suggestions: Map<string, ProactiveSuggestion>;
  private watchedPatterns: Set<string>;
  private isActive: boolean;

  constructor() {
    this.bus = getEventBus();
    this.gemini = getGeminiClient();
    this.suggestions = new Map();
    this.watchedPatterns = new Set();
    this.isActive = true;

    this.initialize();
  }

  /**
   * Initialize and start watching for patterns
   */
  private initialize() {
    // Subscribe to relevant events
    this.bus.on('itinerary:changed', (payload) => {
      this.onItineraryChanged(payload.data);
    });

    this.bus.on('budget:updated', (payload) => {
      this.onBudgetUpdated(payload.data);
    });

    this.bus.on('user:action', (payload) => {
      this.onUserAction(payload.data);
    });

    console.log('[ProactiveAssistant] Initialized and watching for patterns');
  }

  /**
   * Enable/disable proactive suggestions
   */
  setActive(active: boolean) {
    this.isActive = active;
    console.log(`[ProactiveAssistant] ${active ? 'Activated' : 'Deactivated'}`);
  }

  /**
   * Handle itinerary changes
   */
  private async onItineraryChanged(data: { days: TripDay[]; action: string }) {
    if (!this.isActive) return;

    const patterns = this.detectPatternsInItinerary(data.days);

    for (const pattern of patterns) {
      await this.generateSuggestionForPattern(pattern, data.days);
    }
  }

  /**
   * Handle budget updates
   */
  private async onBudgetUpdated(data: { spent: number; budget: number }) {
    if (!this.isActive) return;

    const percentageUsed = (data.spent / data.budget) * 100;

    if (percentageUsed > 80 && percentageUsed < 95) {
      this.createSuggestion({
        type: 'budget_alert',
        title: 'Budget Alert',
        message: `You've used ${Math.round(percentageUsed)}% of your budget. Consider reviewing upcoming expenses.`,
        priority: 'medium',
        actions: [
          { label: 'View Budget', action: 'view_details', payload: { panel: 'budget' } },
          { label: 'Find Alternatives', action: 'customize', payload: { action: 'find_cheaper' } },
        ],
      });
    } else if (percentageUsed >= 95) {
      this.createSuggestion({
        type: 'budget_alert',
        title: 'Budget Nearly Exceeded',
        message: `You've used ${Math.round(percentageUsed)}% of your budget. Time to make some changes!`,
        priority: 'high',
        actions: [
          { label: 'Find Cheaper Options', action: 'apply', payload: { action: 'optimize_budget' } },
          { label: 'Increase Budget', action: 'customize' },
        ],
      });
    }
  }

  /**
   * Handle user actions
   */
  private async onUserAction(data: { action: string; context: any }) {
    if (!this.isActive) return;

    // Detect patterns based on user behavior
    if (data.action === 'add_restaurant') {
      // Suggest nearby attractions
      this.suggestComplementaryActivities('restaurant', data.context);
    } else if (data.action === 'add_activity') {
      // Suggest nearby dining
      this.suggestComplementaryActivities('activity', data.context);
    }
  }

  /**
   * Detect patterns in itinerary
   */
  private detectPatternsInItinerary(days: TripDay[]): Pattern[] {
    const patterns: Pattern[] = [];

    for (const day of days) {
      // Pattern 1: Long travel times
      const travelPattern = this.detectTravelTimePattern(day);
      if (travelPattern) patterns.push(travelPattern);

      // Pattern 2: Schedule conflicts
      const conflictPattern = this.detectConflictPattern(day);
      if (conflictPattern) patterns.push(conflictPattern);

      // Pattern 3: Missing meals
      const mealPattern = this.detectMissingMealsPattern(day);
      if (mealPattern) patterns.push(mealPattern);

      // Pattern 4: Rushed schedule
      const rushPattern = this.detectRushedSchedulePattern(day);
      if (rushPattern) patterns.push(rushPattern);
    }

    // Pattern 5: Budget optimization opportunities
    const budgetPattern = this.detectBudgetOptimizationPattern(days);
    if (budgetPattern) patterns.push(budgetPattern);

    return patterns;
  }

  /**
   * Detect long travel times between activities
   */
  private detectTravelTimePattern(day: TripDay): Pattern | null {
    // Simplified: check if items are far apart
    if (day.items.length < 2) return null;

    // In production, calculate actual distances
    // For now, simulate detection
    const hasLongTravel = Math.random() > 0.8; // 20% chance for demo

    if (hasLongTravel) {
      return {
        type: 'travel_time',
        confidence: 0.85,
        data: {
          day: day.day,
          estimatedTravelTime: '45 minutes',
          suggestion: 'Reorder activities to minimize travel',
        },
      };
    }

    return null;
  }

  /**
   * Detect schedule conflicts
   */
  private detectConflictPattern(day: TripDay): Pattern | null {
    // Check for overlapping times
    for (let i = 0; i < day.items.length - 1; i++) {
      const current = day.items[i];
      const next = day.items[i + 1];

      if (current.time && next.time && current.duration) {
        // Simplified conflict detection
        // In production, use proper time parsing
        if (this.hasTimeOverlap(current, next)) {
          return {
            type: 'conflict',
            confidence: 0.95,
            data: {
              day: day.day,
              items: [current.id, next.id],
              conflict: `${current.title} overlaps with ${next.title}`,
            },
          };
        }
      }
    }

    return null;
  }

  /**
   * Detect missing meals
   */
  private detectMissingMealsPattern(day: TripDay): Pattern | null {
    const hasMeals = day.items.some((item) => item.type === 'food');
    const hasMultipleActivities = day.items.filter((item) => item.type === 'activity').length > 2;

    if (!hasMeals && hasMultipleActivities) {
      return {
        type: 'opportunity',
        confidence: 0.7,
        data: {
          day: day.day,
          suggestion: 'Add meal breaks to your day',
          reason: 'Long day with no scheduled meals',
        },
      };
    }

    return null;
  }

  /**
   * Detect rushed schedule
   */
  private detectRushedSchedulePattern(day: TripDay): Pattern | null {
    if (day.items.length > 6) {
      return {
        type: 'warning',
        confidence: 0.75,
        data: {
          day: day.day,
          itemCount: day.items.length,
          suggestion: 'This day looks packed. Consider spreading activities across multiple days.',
        },
      };
    }

    return null;
  }

  /**
   * Detect budget optimization opportunities
   */
  private detectBudgetOptimizationPattern(days: TripDay[]): Pattern | null {
    // Analyze all items for budget optimization
    const allItems = days.flatMap((d) => d.items);
    const expensiveItems = allItems.filter((item) => item.cost && item.cost > 100);

    if (expensiveItems.length > 3) {
      return {
        type: 'budget_risk',
        confidence: 0.8,
        data: {
          expensiveItemCount: expensiveItems.length,
          suggestion: 'Several high-cost items found. Would you like to see cheaper alternatives?',
        },
      };
    }

    return null;
  }

  /**
   * Generate suggestion for detected pattern
   */
  private async generateSuggestionForPattern(pattern: Pattern, days: TripDay[]) {
    const patternKey = `${pattern.type}_${JSON.stringify(pattern.data)}`;

    // Don't duplicate suggestions
    if (this.watchedPatterns.has(patternKey)) return;
    this.watchedPatterns.add(patternKey);

    switch (pattern.type) {
      case 'travel_time':
        this.createSuggestion({
          type: 'optimization',
          title: 'Long Travel Time Detected',
          message: pattern.data.suggestion,
          priority: 'medium',
          actions: [
            { label: 'Optimize Route', action: 'apply', payload: { day: pattern.data.day } },
            { label: 'View Map', action: 'view_details' },
          ],
          metadata: pattern.data,
        });
        break;

      case 'conflict':
        this.createSuggestion({
          type: 'warning',
          title: 'Schedule Conflict Detected',
          message: pattern.data.conflict,
          priority: 'high',
          actions: [
            { label: 'Resolve Conflict', action: 'apply', payload: { items: pattern.data.items } },
            { label: 'View Schedule', action: 'view_details' },
          ],
          metadata: pattern.data,
        });
        break;

      case 'opportunity':
        this.createSuggestion({
          type: 'recommendation',
          title: 'Meal Break Recommended',
          message: pattern.data.suggestion,
          priority: 'low',
          actions: [
            { label: 'Find Restaurants', action: 'apply', payload: { day: pattern.data.day } },
            { label: 'Dismiss', action: 'dismiss' },
          ],
          metadata: pattern.data,
        });
        break;

      case 'warning':
        this.createSuggestion({
          type: 'warning',
          title: 'Packed Schedule',
          message: pattern.data.suggestion,
          priority: 'medium',
          actions: [
            { label: 'Spread Activities', action: 'apply', payload: { day: pattern.data.day } },
            { label: 'Keep As Is', action: 'dismiss' },
          ],
          metadata: pattern.data,
        });
        break;

      case 'budget_risk':
        this.createSuggestion({
          type: 'budget_alert',
          title: 'Budget Optimization Available',
          message: pattern.data.suggestion,
          priority: 'medium',
          actions: [
            { label: 'Find Alternatives', action: 'apply' },
            { label: 'View Budget', action: 'view_details' },
          ],
          metadata: pattern.data,
        });
        break;
    }
  }

  /**
   * Suggest complementary activities
   */
  private async suggestComplementaryActivities(type: string, context: any) {
    if (type === 'restaurant') {
      this.createSuggestion({
        type: 'recommendation',
        title: 'Nearby Attractions',
        message: `While you're in ${context.neighborhood || 'the area'}, check out these nearby activities!`,
        priority: 'low',
        actions: [
          { label: 'Show Nearby', action: 'apply', payload: { location: context.location } },
          { label: 'Not Now', action: 'dismiss' },
        ],
        dismissible: true,
      });
    } else if (type === 'activity') {
      this.createSuggestion({
        type: 'recommendation',
        title: 'Dining Nearby',
        message: 'Looking for a place to eat after? Here are some great restaurants nearby.',
        priority: 'low',
        actions: [
          { label: 'Find Restaurants', action: 'apply', payload: { location: context.location } },
          { label: 'Not Now', action: 'dismiss' },
        ],
        dismissible: true,
      });
    }
  }

  /**
   * Create and store a suggestion
   */
  private createSuggestion(partial: Omit<ProactiveSuggestion, 'id' | 'timestamp' | 'dismissible'> & { dismissible?: boolean }) {
    const suggestion: ProactiveSuggestion = {
      id: `suggestion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      dismissible: partial.dismissible ?? true,
      ...partial,
    };

    this.suggestions.set(suggestion.id, suggestion);

    // Emit event for UI to pick up
    this.bus.emit('agent:response', {
      type: 'proactive_suggestion',
      suggestion,
    }, { source: 'proactive_assistant' });

    // Also send notification if high priority
    if (suggestion.priority === 'high') {
      const notificationService = getNotificationService();
      notificationService.send(
        suggestion.title,
        suggestion.message,
        'ai_suggestion',
        { priority: 'high' }
      );
    }

    return suggestion;
  }

  /**
   * Get all active suggestions
   */
  getActiveSuggestions(): ProactiveSuggestion[] {
    return Array.from(this.suggestions.values());
  }

  /**
   * Dismiss a suggestion
   */
  dismissSuggestion(id: string) {
    const suggestion = this.suggestions.get(id);
    if (suggestion && suggestion.dismissible) {
      this.suggestions.delete(id);
      return true;
    }
    return false;
  }

  /**
   * Clear all suggestions
   */
  clearAll() {
    this.suggestions.clear();
    this.watchedPatterns.clear();
  }

  // --- HELPER METHODS ---

  private hasTimeOverlap(item1: TripItem, item2: TripItem): boolean {
    // Simplified overlap detection
    // In production, use proper time parsing library
    return false; // Placeholder
  }
}

// --- SINGLETON INSTANCE ---

let proactiveAssistantInstance: ProactiveAssistant | null = null;

export function getProactiveAssistant(): ProactiveAssistant {
  if (!proactiveAssistantInstance) {
    proactiveAssistantInstance = new ProactiveAssistant();
  }
  return proactiveAssistantInstance;
}

export function initializeProactiveAssistant(): ProactiveAssistant {
  proactiveAssistantInstance = new ProactiveAssistant();
  return proactiveAssistantInstance;
}

// --- EXPORTS ---

export default ProactiveAssistant;
