/**
 * Itinerary Optimizer Agent
 * Optimizes routes, resolves conflicts, and suggests better scheduling
 */

import { BaseAgent } from './base-agent';
import { getGeminiClient } from '../gemini-client';
import type { AgentRequest, AgentResponse, AgentContext } from '../types';

export class ItineraryOptimizerAgent extends BaseAgent {
  constructor() {
    super({
      type: 'itinerary_optimizer',
      name: 'Itinerary Optimizer',
      description: 'Optimizes travel routes, resolves scheduling conflicts, and suggests efficient itineraries',
      capabilities: [
        'route_optimization',
        'conflict_detection',
        'time_optimization',
        'distance_calculation',
        'smart_scheduling',
      ],
      priority: 2,
      enabled: true,
    });
  }

  protected async processRequest(request: AgentRequest, context: AgentContext): Promise<any> {
    const { intent, parameters } = request;

    let result: any;

    switch (intent) {
      case 'optimize_route':
        result = await this.optimizeRoute(parameters);
        break;

      case 'resolve_conflicts':
        result = await this.detectConflicts(parameters);
        break;

      case 'smart_schedule':
        result = await this.smartSchedule(parameters);
        break;

      default:
        // Generic query about optimization
        result = await this.analyzeItinerary(parameters);
    }

    return result;
  }

  /**
   * Optimize route by proximity and efficiency
   */
  private async optimizeRoute(params: any): Promise<any> {
    const { itinerary, preferences = {} } = params;

    if (!itinerary || !itinerary.days) {
      return {
        success: false,
        message: 'Invalid itinerary data',
      };
    }

    // Check if Gemini is available for advanced optimization
    const gemini = getGeminiClient();
    if (gemini.isReady() && preferences.useAI) {
      try {
        return await this.optimizeRouteWithAI(itinerary, preferences);
      } catch (error) {
        console.error('[ItineraryOptimizer] AI optimization failed, falling back:', error);
      }
    }

    // Fallback: Rule-based optimization
    return this.optimizeRouteRuleBased(itinerary, preferences);
  }

  /**
   * AI-powered route optimization using Gemini
   */
  private async optimizeRouteWithAI(itinerary: any, preferences: any): Promise<any> {
    const gemini = getGeminiClient();

    const prompt = `Optimize this travel itinerary for efficiency:

${JSON.stringify(itinerary, null, 2)}

Preferences:
- Priority: ${preferences.priority || 'balanced'} (time, cost, or experience)
- Max daily travel: ${preferences.maxDailyTravel || '2 hours'}
- Pace: ${preferences.pace || 'moderate'}

Provide:
1. Reordered activities by day (group by proximity)
2. Time saved
3. Distance saved
4. Explanation of changes

Format as JSON.`;

    const response = await gemini.generateContent(prompt);
    
    try {
      // Try to parse JSON response
      const parsed = JSON.parse(response);
      return {
        success: true,
        optimized: true,
        ...parsed,
        method: 'ai',
      };
    } catch {
      // If not JSON, extract insights
      return {
        success: true,
        optimized: true,
        insights: response,
        method: 'ai',
      };
    }
  }

  /**
   * Rule-based route optimization (fallback)
   */
  private optimizeRouteRuleBased(itinerary: any, preferences: any): Promise<any> {
    return new Promise((resolve) => {
      const optimizedDays = itinerary.days.map((day: any) => {
        if (!day.items || day.items.length === 0) return day;

        // Sort items with locations by proximity
        const itemsWithLocation = day.items.filter((item: any) => 
          item.location_lat && item.location_lng
        );
        
        const itemsWithoutLocation = day.items.filter((item: any) => 
          !item.location_lat || !item.location_lng
        );

        if (itemsWithLocation.length <= 1) {
          return day; // Nothing to optimize
        }

        // Simple nearest-neighbor algorithm
        const optimized = [];
        let current = itemsWithLocation[0];
        optimized.push(current);
        let remaining = itemsWithLocation.slice(1);

        while (remaining.length > 0) {
          let nearestIndex = 0;
          let nearestDistance = Infinity;

          remaining.forEach((item, index) => {
            const distance = this.calculateDistance(
              current.location_lat,
              current.location_lng,
              item.location_lat,
              item.location_lng
            );

            if (distance < nearestDistance) {
              nearestDistance = distance;
              nearestIndex = index;
            }
          });

          current = remaining[nearestIndex];
          optimized.push(current);
          remaining.splice(nearestIndex, 1);
        }

        // Combine optimized items with items without location
        return {
          ...day,
          items: [...optimized, ...itemsWithoutLocation],
        };
      });

      // Calculate savings
      const originalDistance = this.calculateTotalDistance(itinerary.days);
      const optimizedDistance = this.calculateTotalDistance(optimizedDays);
      const distanceSaved = Math.max(0, originalDistance - optimizedDistance);
      const timeSaved = Math.round(distanceSaved * 3); // ~3 min per km estimate

      resolve({
        success: true,
        optimized: true,
        days: optimizedDays,
        savings: {
          timeSaved: `${timeSaved} min`,
          distanceSaved: `${distanceSaved.toFixed(1)} km`,
          costSaved: `$${Math.round(distanceSaved * 0.5)}`, // ~$0.50/km estimate
        },
        changes: [
          'Reordered activities by proximity',
          'Grouped nearby locations together',
          'Minimized backtracking',
        ],
        method: 'rule_based',
      });
    });
  }

  /**
   * Detect scheduling conflicts
   */
  private async detectConflicts(params: any): Promise<any> {
    const { itinerary } = params;

    if (!itinerary || !itinerary.days) {
      return {
        success: false,
        conflicts: [],
      };
    }

    const conflicts: any[] = [];

    itinerary.days.forEach((day: any, dayIndex: number) => {
      if (!day.items || day.items.length === 0) return;

      for (let i = 0; i < day.items.length - 1; i++) {
        const item1 = day.items[i];
        const item2 = day.items[i + 1];

        if (!item1.time || !item2.time || !item1.duration) continue;

        const overlap = this.checkTimeOverlap(item1, item2);
        if (overlap) {
          conflicts.push({
            dayIndex,
            item1: item1.title,
            item2: item2.title,
            issue: overlap,
            severity: 'high',
          });
        }
      }

      // Check for unrealistic scheduling
      day.items.forEach((item: any, index: number) => {
        if (!item.time || !item.duration) return;

        const duration = this.parseDuration(item.duration);
        if (duration > 480) { // > 8 hours
          conflicts.push({
            dayIndex,
            item1: item.title,
            issue: `Duration seems unrealistic (${item.duration})`,
            severity: 'medium',
          });
        }
      });
    });

    return {
      success: true,
      conflicts,
      hasConflicts: conflicts.length > 0,
      count: conflicts.length,
    };
  }

  /**
   * Smart scheduling based on activity type, time of day, etc.
   */
  private async smartSchedule(params: any): Promise<any> {
    const { day, items, preferences = {} } = params;

    if (!items || items.length === 0) {
      return {
        success: false,
        message: 'No items to schedule',
      };
    }

    // Check if Gemini is available
    const gemini = getGeminiClient();
    if (gemini.isReady() && preferences.useAI) {
      try {
        return await this.smartScheduleWithAI(items, preferences);
      } catch (error) {
        console.error('[ItineraryOptimizer] AI scheduling failed:', error);
      }
    }

    // Fallback: Rule-based scheduling
    return this.smartScheduleRuleBased(items, preferences);
  }

  /**
   * AI-powered smart scheduling
   */
  private async smartScheduleWithAI(items: any[], preferences: any): Promise<any> {
    const gemini = getGeminiClient();

    const prompt = `Schedule these activities for optimal experience:

${JSON.stringify(items, null, 2)}

Preferences:
- Start time: ${preferences.startTime || '9:00 AM'}
- Pace: ${preferences.pace || 'moderate'}
- Include breaks: ${preferences.includeBreaks !== false}

Consider:
- Best time of day for each activity
- Meal times
- Energy levels
- Travel time between locations

Provide scheduled items with times. Format as JSON array.`;

    const response = await gemini.generateContent(prompt);
    
    try {
      const scheduled = JSON.parse(response);
      return {
        success: true,
        items: scheduled,
        method: 'ai',
      };
    } catch {
      return {
        success: false,
        message: 'Failed to parse AI response',
      };
    }
  }

  /**
   * Rule-based smart scheduling
   */
  private smartScheduleRuleBased(items: any[], preferences: any): Promise<any> {
    return new Promise((resolve) => {
      const startTime = preferences.startTime || '9:00 AM';
      const includeBreaks = preferences.includeBreaks !== false;

      let currentTime = this.parseTime(startTime);
      const scheduled = [];

      for (const item of items) {
        // Assign time based on type
        if (item.type === 'food') {
          // Schedule meals at typical times
          if (currentTime < 12 * 60) {
            currentTime = Math.max(currentTime, 12 * 60); // Lunch at noon
          } else if (currentTime < 19 * 60) {
            currentTime = Math.max(currentTime, 19 * 60); // Dinner at 7pm
          }
        }

        scheduled.push({
          ...item,
          time: this.formatTime(currentTime),
        });

        // Add duration and travel buffer
        const duration = this.parseDuration(item.duration || '1h');
        currentTime += duration + 15; // 15 min buffer

        // Add lunch break if needed
        if (includeBreaks && currentTime > 12 * 60 && currentTime < 13 * 60) {
          currentTime = 13 * 60; // Skip to 1pm after lunch
        }
      }

      resolve({
        success: true,
        items: scheduled,
        method: 'rule_based',
      });
    });
  }

  /**
   * Analyze itinerary for optimization opportunities
   */
  private async analyzeItinerary(params: any): Promise<any> {
    const { itinerary } = params;

    const conflicts = await this.detectConflicts({ itinerary });
    const optimizationPotential = this.assessOptimizationPotential(itinerary);

    return {
      success: true,
      hasConflicts: conflicts.hasConflicts,
      conflictCount: conflicts.count,
      optimizationPotential,
      recommendations: this.generateRecommendations(itinerary, conflicts),
    };
  }

  /**
   * Assess how much optimization is possible
   */
  private assessOptimizationPotential(itinerary: any): string {
    if (!itinerary.days) return 'none';

    let itemsWithLocation = 0;
    let totalItems = 0;

    itinerary.days.forEach((day: any) => {
      if (!day.items) return;
      totalItems += day.items.length;
      itemsWithLocation += day.items.filter((item: any) => 
        item.location_lat && item.location_lng
      ).length;
    });

    if (itemsWithLocation < 2) return 'none';
    if (itemsWithLocation / totalItems > 0.7) return 'high';
    if (itemsWithLocation / totalItems > 0.4) return 'medium';
    return 'low';
  }

  /**
   * Generate optimization suggestions
   */
  private generateOptimizationSuggestions(result: any): any[] {
    if (!result.success || !result.optimized) return [];

    return [
      {
        type: 'optimization',
        priority: 'high',
        title: 'Route Optimized',
        description: `Save ${result.savings?.timeSaved || 'time'} and ${result.savings?.distanceSaved || 'distance'}`,
        action: 'apply_optimization',
        data: result,
      },
    ];
  }

  /**
   * Generate conflict resolution suggestions
   */
  private generateConflictSuggestions(result: any): any[] {
    if (!result.hasConflicts) {
      return [{
        type: 'info',
        priority: 'low',
        title: 'No Conflicts Found',
        description: 'Your itinerary looks good!',
      }];
    }

    return [{
      type: 'warning',
      priority: 'high',
      title: `${result.count} Conflict${result.count > 1 ? 's' : ''} Found`,
      description: 'Some activities overlap or are unrealistic',
      action: 'fix_conflicts',
      data: result.conflicts,
    }];
  }

  /**
   * Generate schedule suggestions
   */
  private generateScheduleSuggestions(result: any): any[] {
    if (!result.success) return [];

    return [{
      type: 'scheduling',
      priority: 'normal',
      title: 'Smart Schedule Created',
      description: 'Activities scheduled for optimal timing',
      action: 'apply_schedule',
      data: result.items,
    }];
  }

  /**
   * Generate general recommendations
   */
  private generateRecommendations(itinerary: any, conflicts: any): string[] {
    const recommendations: string[] = [];

    if (conflicts.hasConflicts) {
      recommendations.push('Fix scheduling conflicts for a smoother trip');
    }

    // Check for missing times
    let itemsMissingTime = 0;
    itinerary.days?.forEach((day: any) => {
      day.items?.forEach((item: any) => {
        if (!item.time) itemsMissingTime++;
      });
    });

    if (itemsMissingTime > 0) {
      recommendations.push(`Add times to ${itemsMissingTime} activities for better planning`);
    }

    // Check for optimization potential
    let itemsWithLocation = 0;
    itinerary.days?.forEach((day: any) => {
      day.items?.forEach((item: any) => {
        if (item.location_lat && item.location_lng) itemsWithLocation++;
      });
    });

    if (itemsWithLocation >= 3) {
      recommendations.push('Optimize your route to save time and reduce travel');
    }

    return recommendations;
  }

  /**
   * Generate general suggestions
   */
  private generateGeneralSuggestions(result: any): any[] {
    const suggestions: any[] = [];

    if (result.recommendations && result.recommendations.length > 0) {
      result.recommendations.forEach((rec: string) => {
        suggestions.push({
          type: 'recommendation',
          priority: 'normal',
          title: rec,
          action: 'optimize',
        });
      });
    }

    return suggestions;
  }

  // --- UTILITY METHODS ---

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private calculateTotalDistance(days: any[]): number {
    let total = 0;
    days.forEach(day => {
      if (!day.items || day.items.length < 2) return;
      
      for (let i = 0; i < day.items.length - 1; i++) {
        const item1 = day.items[i];
        const item2 = day.items[i + 1];
        
        if (item1.location_lat && item1.location_lng && 
            item2.location_lat && item2.location_lng) {
          total += this.calculateDistance(
            item1.location_lat,
            item1.location_lng,
            item2.location_lat,
            item2.location_lng
          );
        }
      }
    });
    return total;
  }

  private checkTimeOverlap(item1: any, item2: any): string | null {
    const start1 = this.parseTime(item1.time);
    const duration1 = this.parseDuration(item1.duration || '1h');
    const end1 = start1 + duration1;

    const start2 = this.parseTime(item2.time);

    if (end1 > start2) {
      const overlap = end1 - start2;
      return `${item1.title} ends at ${this.formatTime(end1)} but ${item2.title} starts at ${item2.time} (${overlap} min overlap)`;
    }

    return null;
  }

  private parseTime(timeStr: string): number {
    // Convert "10:00 AM" or "14:00" to minutes since midnight
    const cleaned = timeStr.trim().toUpperCase();
    const match = cleaned.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/);
    
    if (!match) return 0;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3];

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  private parseDuration(durationStr: string): number {
    // Convert "2h" or "30m" to minutes
    const match = durationStr.match(/(\d+\.?\d*)\s*(h|m|hour|min)/i);
    if (!match) return 60; // Default 1 hour

    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    if (unit.startsWith('h')) return Math.round(value * 60);
    return Math.round(value);
  }

  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  }
}

// Singleton instance
let optimizerInstance: ItineraryOptimizerAgent | null = null;

export function getItineraryOptimizer(): ItineraryOptimizerAgent {
  if (!optimizerInstance) {
    optimizerInstance = new ItineraryOptimizerAgent();
  }
  return optimizerInstance;
}

export default ItineraryOptimizerAgent;