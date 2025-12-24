/**
 * BUDGET TRACKER
 * 
 * Tracks spending across all trip entities and generates alerts.
 * Monitors: restaurants, events, rentals, destinations, activities
 */

import { Budget, BudgetAlert, TripEntity, Trip } from './types/TripTypes';
import { eventBus } from './EventBus';

// ============================================================================
// BUDGET TRACKER CLASS
// ============================================================================

export class BudgetTracker {
  
  /**
   * Calculate total budget from trip entities
   */
  calculateBudget(trip: Trip): Budget {
    const breakdown = {
      restaurants: 0,
      events: 0,
      rentals: 0,
      activities: 0,
      travel: 0,
      other: 0
    };

    // Calculate spending per category
    trip.days.forEach(day => {
      day.items.forEach(item => {
        const cost = this.getEntityCost(item);
        
        switch (item.type) {
          case 'restaurant':
            breakdown.restaurants += cost;
            break;
          case 'event':
            breakdown.events += cost;
            break;
          case 'rental':
            breakdown.rentals += cost;
            break;
          case 'destination':
          case 'activity':
            breakdown.activities += cost;
            break;
          case 'travel':
            breakdown.travel += cost;
            break;
          default:
            breakdown.other += cost;
        }
      });
    });

    const spent = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    const remaining = trip.budget.total - spent;

    // Generate alerts
    const alerts = this.generateAlerts(trip.budget.total, spent, breakdown, trip.budget.dailyLimit);

    return {
      total: trip.budget.total,
      currency: trip.budget.currency,
      breakdown,
      spent,
      remaining,
      dailyLimit: trip.budget.dailyLimit,
      alerts
    };
  }

  /**
   * Check if adding an entity would exceed budget
   */
  checkBudgetImpact(
    entity: TripEntity,
    currentBudget: Budget
  ): {
    canAfford: boolean;
    newTotal: number;
    remaining: number;
    alerts: BudgetAlert[];
  } {
    const cost = this.getEntityCost(entity);
    const newTotal = currentBudget.spent + cost;
    const remaining = currentBudget.total - newTotal;
    const canAfford = remaining >= 0;

    // Generate alerts for this addition
    const alerts: BudgetAlert[] = [];

    if (!canAfford) {
      alerts.push({
        id: `alert-exceeded-${Date.now()}`,
        type: 'exceeded',
        severity: 'critical',
        message: `Adding "${entity.name}" would exceed your budget by ${this.formatCurrency(Math.abs(remaining))}`,
        amount: cost,
        threshold: currentBudget.total
      });
    } else if (remaining < currentBudget.total * 0.1) {
      alerts.push({
        id: `alert-low-${Date.now()}`,
        type: 'approaching_limit',
        severity: 'warning',
        message: `Only ${this.formatCurrency(remaining)} remaining in budget after adding "${entity.name}"`,
        amount: newTotal,
        threshold: currentBudget.total
      });
    }

    // Daily limit check
    if (currentBudget.dailyLimit) {
      // This is simplified - in reality, you'd check per-day spending
      const avgDailySpending = newTotal / 7; // Assuming week-long trip
      if (avgDailySpending > currentBudget.dailyLimit) {
        alerts.push({
          id: `alert-daily-${Date.now()}`,
          type: 'daily_limit',
          severity: 'warning',
          message: `Average daily spending (${this.formatCurrency(avgDailySpending)}) exceeds limit of ${this.formatCurrency(currentBudget.dailyLimit)}`,
          amount: avgDailySpending,
          threshold: currentBudget.dailyLimit
        });
      }
    }

    return {
      canAfford,
      newTotal,
      remaining,
      alerts
    };
  }

  /**
   * Generate budget recommendations
   */
  generateRecommendations(budget: Budget): string[] {
    const recommendations: string[] = [];
    const percentSpent = (budget.spent / budget.total) * 100;

    if (percentSpent > 90) {
      recommendations.push('⚠️ You\'ve spent 90% of your budget. Consider cheaper alternatives.');
    } else if (percentSpent > 75) {
      recommendations.push('💡 You\'ve used 75% of your budget. Plan remaining days carefully.');
    } else if (percentSpent < 25 && budget.spent > 0) {
      recommendations.push('✨ You have plenty of budget left! Consider upgrading some experiences.');
    }

    // Category-specific recommendations
    const restaurantPercent = (budget.breakdown.restaurants / budget.spent) * 100;
    if (restaurantPercent > 40) {
      recommendations.push('🍴 Dining is 40%+ of spending. Mix in cheaper local eateries?');
    }

    const rentalPercent = (budget.breakdown.rentals / budget.spent) * 100;
    if (rentalPercent > 50) {
      recommendations.push('🏠 Accommodation is 50%+ of budget. This is typical for trips.');
    }

    if (budget.breakdown.activities === 0) {
      recommendations.push('🎯 No activities booked yet. Explore free attractions!');
    }

    return recommendations;
  }

  /**
   * Get spending breakdown by day
   */
  getDailyBreakdown(trip: Trip): { date: string; spent: number; budget: number }[] {
    const dailyBudget = trip.budget.dailyLimit || trip.budget.total / trip.duration;
    
    return trip.days.map(day => {
      const spent = day.items.reduce((sum, item) => sum + this.getEntityCost(item), 0);
      
      return {
        date: day.date,
        spent,
        budget: dailyBudget
      };
    });
  }

  /**
   * Get spending trends
   */
  getSpendingTrends(trip: Trip): {
    averagePerDay: number;
    highestDay: { date: string; amount: number };
    lowestDay: { date: string; amount: number };
    topCategory: string;
  } {
    const dailyBreakdown = this.getDailyBreakdown(trip);
    const averagePerDay = dailyBreakdown.reduce((sum, d) => sum + d.spent, 0) / dailyBreakdown.length;

    const sorted = [...dailyBreakdown].sort((a, b) => b.spent - a.spent);
    const highestDay = sorted[0] || { date: '', amount: 0 };
    const lowestDay = sorted[sorted.length - 1] || { date: '', amount: 0 };

    // Find top category
    const budget = this.calculateBudget(trip);
    const topCategory = Object.entries(budget.breakdown)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'restaurants';

    return {
      averagePerDay,
      highestDay: { date: highestDay.date, amount: highestDay.spent },
      lowestDay: { date: lowestDay.date, amount: lowestDay.spent },
      topCategory
    };
  }

  /**
   * Optimize budget allocation
   */
  suggestReallocation(budget: Budget): {
    category: string;
    currentAmount: number;
    suggestedAmount: number;
    reason: string;
  }[] {
    const suggestions: {
      category: string;
      currentAmount: number;
      suggestedAmount: number;
      reason: string;
    }[] = [];

    const total = budget.spent;

    // Check if restaurants are too high
    if (budget.breakdown.restaurants > total * 0.4) {
      suggestions.push({
        category: 'restaurants',
        currentAmount: budget.breakdown.restaurants,
        suggestedAmount: total * 0.3,
        reason: 'Dining is taking up a large portion of your budget. Consider local markets or casual eateries.'
      });
    }

    // Check if no activities planned
    if (budget.breakdown.activities === 0 && budget.remaining > 100) {
      suggestions.push({
        category: 'activities',
        currentAmount: 0,
        suggestedAmount: budget.remaining * 0.3,
        reason: 'You have budget remaining. Consider adding experiences or activities!'
      });
    }

    return suggestions;
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private getEntityCost(entity: TripEntity): number {
    if ('estimatedCost' in entity && entity.estimatedCost) {
      return entity.estimatedCost;
    }
    if ('price' in entity && typeof entity.price === 'number') {
      return entity.price;
    }
    if ('cost' in entity && entity.cost) {
      return entity.cost;
    }
    
    // For rentals, use daily rate if available
    if (entity.type === 'rental' && 'pricePerNight' in entity && entity.pricePerNight) {
      return entity.pricePerNight;
    }
    
    return 0;
  }

  private generateAlerts(
    total: number,
    spent: number,
    breakdown: Budget['breakdown'],
    dailyLimit?: number
  ): BudgetAlert[] {
    const alerts: BudgetAlert[] = [];
    const remaining = total - spent;
    const percentSpent = (spent / total) * 100;

    // Approaching limit alerts
    if (percentSpent >= 90) {
      alerts.push({
        id: `alert-90-${Date.now()}`,
        type: 'approaching_limit',
        severity: 'critical',
        message: `You've spent 90% of your budget (${this.formatCurrency(spent)} of ${this.formatCurrency(total)})`,
        amount: spent,
        threshold: total * 0.9
      });
    } else if (percentSpent >= 75) {
      alerts.push({
        id: `alert-75-${Date.now()}`,
        type: 'approaching_limit',
        severity: 'warning',
        message: `You've spent 75% of your budget (${this.formatCurrency(spent)} of ${this.formatCurrency(total)})`,
        amount: spent,
        threshold: total * 0.75
      });
    }

    // Exceeded alerts
    if (remaining < 0) {
      alerts.push({
        id: `alert-exceeded-${Date.now()}`,
        type: 'exceeded',
        severity: 'critical',
        message: `Budget exceeded by ${this.formatCurrency(Math.abs(remaining))}`,
        amount: spent,
        threshold: total
      });
    }

    // Category-specific alerts
    if (breakdown.restaurants > total * 0.5) {
      alerts.push({
        id: `alert-category-restaurants-${Date.now()}`,
        type: 'category_limit',
        severity: 'info',
        message: `Restaurants account for ${Math.round((breakdown.restaurants / spent) * 100)}% of spending`,
        amount: breakdown.restaurants,
        threshold: total * 0.5
      });
    }

    // Daily limit alerts
    if (dailyLimit) {
      const avgDaily = spent / 7; // Simplified
      if (avgDaily > dailyLimit) {
        alerts.push({
          id: `alert-daily-${Date.now()}`,
          type: 'daily_limit',
          severity: 'warning',
          message: `Average daily spending (${this.formatCurrency(avgDaily)}) exceeds limit of ${this.formatCurrency(dailyLimit)}`,
          amount: avgDaily,
          threshold: dailyLimit
        });
      }
    }

    return alerts;
  }

  private formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Publish budget events to event bus
   */
  publishBudgetUpdate(
    previousBudget: Budget,
    newBudget: Budget,
    tripId: string
  ): void {
    const difference = newBudget.spent - previousBudget.spent;
    
    eventBus.publish('budget.updated', {
      timestamp: new Date(),
      source: 'BudgetTracker',
      tripId,
      previousAmount: previousBudget.spent,
      newAmount: newBudget.spent,
      difference,
      category: 'general',
      remaining: newBudget.remaining,
      alert: newBudget.alerts.length > 0 ? {
        type: newBudget.alerts[0].type,
        severity: newBudget.alerts[0].severity,
        message: newBudget.alerts[0].message
      } : undefined
    });

    // Publish alerts
    newBudget.alerts.forEach(alert => {
      if (alert.severity === 'critical' || alert.severity === 'warning') {
        eventBus.publish('budget.alert', {
          timestamp: new Date(),
          source: 'BudgetTracker',
          tripId,
          alert
        } as any);
      }
    });

    // Publish exceeded event if budget is exceeded
    if (newBudget.remaining < 0) {
      eventBus.publish('budget.exceeded', {
        timestamp: new Date(),
        source: 'BudgetTracker',
        tripId,
        amount: Math.abs(newBudget.remaining)
      } as any);
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const budgetTracker = new BudgetTracker();
