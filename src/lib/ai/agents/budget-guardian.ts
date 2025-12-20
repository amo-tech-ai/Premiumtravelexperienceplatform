/**
 * Budget Guardian Agent
 * Tracks spending, alerts on budget issues, and suggests cost optimizations
 */

import { BaseAgent } from './base-agent';
import { getGeminiClient } from '../gemini-client';
import type { AgentRequest, AgentResponse, AgentContext } from '../types';

export class BudgetGuardianAgent extends BaseAgent {
  constructor() {
    super({
      type: 'budget_guardian',
      name: 'Budget Guardian',
      description: 'Monitors trip budget, alerts on overspending, and suggests cost optimizations',
      capabilities: [
        'budget_tracking',
        'cost_analysis',
        'savings_suggestions',
        'expense_alerts',
        'price_comparison',
      ],
      priority: 4,
      enabled: true,
    });
  }

  protected async processRequest(request: AgentRequest, context: AgentContext): Promise<any> {
    const { intent, parameters } = request;

    let result: any;

    switch (intent) {
      case 'check_budget':
        result = await this.trackBudget(parameters);
        break;

      case 'analyze_costs':
        result = await this.analyzeCosts(parameters);
        break;

      case 'find_savings':
        result = await this.suggestSavings(parameters);
        break;

      default:
        // General budget query
        result = await this.handleGeneralQuery(parameters);
    }

    return result;
  }

  /**
   * Track budget and calculate spending
   */
  private async trackBudget(params: any): Promise<any> {
    const {
      totalBudget,
      itinerary,
      breakdown = true,
    } = params;

    if (!totalBudget || !itinerary) {
      return {
        success: false,
        message: 'Missing budget or itinerary data',
      };
    }

    // Calculate total spending
    const spending = this.calculateSpending(itinerary);
    const remaining = totalBudget - spending.total;
    const percentUsed = (spending.total / totalBudget) * 100;

    // Determine status
    let status: 'safe' | 'warning' | 'exceeded';
    if (percentUsed < 80) status = 'safe';
    else if (percentUsed < 100) status = 'warning';
    else status = 'exceeded';

    // Generate alerts
    const alerts: any[] = [];
    if (status === 'exceeded') {
      alerts.push({
        type: 'critical',
        message: `Over budget by $${Math.abs(remaining).toFixed(2)}`,
        action: 'reduce_costs',
      });
    } else if (status === 'warning') {
      alerts.push({
        type: 'warning',
        message: `${(100 - percentUsed).toFixed(0)}% of budget remaining`,
        action: 'monitor_spending',
      });
    }

    // Check for expensive items
    const expensiveItems = this.findExpensiveItems(itinerary, totalBudget);
    if (expensiveItems.length > 0) {
      alerts.push({
        type: 'info',
        message: `${expensiveItems.length} high-cost items found`,
        action: 'review_expenses',
        items: expensiveItems,
      });
    }

    return {
      success: true,
      totalBudget,
      spent: spending.total,
      remaining,
      percentUsed: Math.round(percentUsed),
      status,
      breakdown: breakdown ? spending.breakdown : undefined,
      alerts,
      dailyAverage: spending.dailyAverage,
      recommendedDailyLimit: totalBudget / (itinerary.days?.length || 1),
    };
  }

  /**
   * Analyze cost patterns and trends
   */
  private async analyzeCosts(params: any): Promise<any> {
    const { itinerary, totalBudget } = params;

    if (!itinerary) {
      return {
        success: false,
        message: 'No itinerary data provided',
      };
    }

    const spending = this.calculateSpending(itinerary);
    const analysis = {
      success: true,
      totalSpent: spending.total,
      breakdown: spending.breakdown,
      insights: [],
    };

    // Analyze by category
    const categoryInsights: any[] = [];
    Object.entries(spending.breakdown).forEach(([category, amount]: [string, any]) => {
      const percentage = (amount / spending.total) * 100;
      categoryInsights.push({
        category,
        amount,
        percentage: Math.round(percentage),
      });
    });

    // Sort by highest spending
    categoryInsights.sort((a, b) => b.amount - a.amount);

    // Generate insights
    const insights: string[] = [];
    
    if (categoryInsights[0]?.percentage > 50) {
      insights.push(`${categoryInsights[0].category} accounts for ${categoryInsights[0].percentage}% of your budget`);
    }

    if (spending.breakdown.food && spending.breakdown.food > totalBudget * 0.4) {
      insights.push('Dining expenses are high - consider some budget-friendly local spots');
    }

    if (spending.breakdown.activity && spending.breakdown.activity < totalBudget * 0.2) {
      insights.push('Room in budget for more activities and experiences');
    }

    // Daily variance
    const dailyCosts = this.calculateDailyCosts(itinerary);
    const variance = this.calculateVariance(dailyCosts);
    if (variance > 0.5) {
      insights.push('Spending varies significantly by day - consider balancing costs');
    }

    analysis.insights = insights;
    analysis['categoryBreakdown'] = categoryInsights;
    analysis['dailyCosts'] = dailyCosts;

    return analysis;
  }

  /**
   * Suggest cost savings opportunities
   */
  private async suggestSavings(params: any): Promise<any> {
    const { itinerary, totalBudget, currentSpending } = params;

    // Check if Gemini can provide personalized savings tips
    const gemini = getGeminiClient();
    if (gemini.isReady() && itinerary) {
      try {
        return await this.suggestSavingsWithAI(params);
      } catch (error) {
        console.error('[BudgetGuardian] AI savings suggestions failed:', error);
      }
    }

    // Fallback: Rule-based savings suggestions
    return this.suggestSavingsRuleBased(params);
  }

  /**
   * AI-powered savings suggestions
   */
  private async suggestSavingsWithAI(params: any): Promise<any> {
    const gemini = getGeminiClient();

    const { itinerary, totalBudget, currentSpending } = params;
    const overspend = currentSpending - totalBudget;

    const prompt = `Analyze this trip budget and suggest cost savings:

Total Budget: $${totalBudget}
Current Spending: $${currentSpending}
${overspend > 0 ? `Over budget by: $${overspend}` : `Under budget by: $${Math.abs(overspend)}`}

Itinerary:
${JSON.stringify(itinerary, null, 2)}

Provide:
1. Specific items that could be replaced with cheaper alternatives
2. Activities that offer similar value for less cost
3. Budget-friendly tips for this destination
4. Estimated savings for each suggestion

Format as JSON with: { suggestions: [], totalPotentialSavings: number }`;

    const response = await gemini.generateContent(prompt);

    try {
      const savings = JSON.parse(response);
      return {
        success: true,
        ...savings,
        method: 'ai',
      };
    } catch {
      return this.suggestSavingsRuleBased(params);
    }
  }

  /**
   * Rule-based savings suggestions
   */
  private suggestSavingsRuleBased(params: any): any {
    const { itinerary, totalBudget } = params;
    const spending = this.calculateSpending(itinerary);
    const suggestions: any[] = [];
    let potentialSavings = 0;

    // Check for expensive dining
    if (spending.breakdown.food && spending.breakdown.food > totalBudget * 0.35) {
      const savings = spending.breakdown.food * 0.3;
      potentialSavings += savings;
      suggestions.push({
        category: 'food',
        title: 'Mix in budget-friendly meals',
        description: 'Replace some expensive restaurants with local street food or casual spots',
        potentialSavings: Math.round(savings),
        priority: 'high',
        examples: [
          'Try the famous bandeja paisa at a local spot ($8 vs $25)',
          'Visit La Plaza food market for authentic cheap eats',
          'Cook one meal if your accommodation has a kitchen',
        ],
      });
    }

    // Check for expensive activities
    if (spending.breakdown.activity && spending.breakdown.activity > totalBudget * 0.4) {
      const savings = spending.breakdown.activity * 0.25;
      potentialSavings += savings;
      suggestions.push({
        category: 'activity',
        title: 'Find free or low-cost alternatives',
        description: 'Balance paid tours with free cultural experiences',
        potentialSavings: Math.round(savings),
        priority: 'medium',
        examples: [
          'Free walking tours in El Poblado (tip-based)',
          'Visit Parque Arvi via cable car ($5 round trip)',
          'Explore Botero Plaza and museums (free)',
        ],
      });
    }

    // Check for transportation costs
    if (spending.breakdown.logistics && spending.breakdown.logistics > totalBudget * 0.2) {
      const savings = spending.breakdown.logistics * 0.4;
      potentialSavings += savings;
      suggestions.push({
        category: 'logistics',
        title: 'Optimize transportation',
        description: 'Use metro and public transport instead of taxis',
        potentialSavings: Math.round(savings),
        priority: 'medium',
        examples: [
          'Metro rides cost $0.70 vs $5-10 for taxi',
          'Get a rechargeable metro card',
          'Walk between nearby spots in El Poblado',
        ],
      });
    }

    // General budget tips
    suggestions.push({
      category: 'general',
      title: 'Budget-friendly timing',
      description: 'Visit attractions during off-peak times for better deals',
      potentialSavings: 0,
      priority: 'low',
      examples: [
        'Lunch menus are often cheaper than dinner',
        'Book tours directly instead of through hotels',
        'Use a no-fee credit card for better exchange rates',
      ],
    });

    return {
      success: true,
      suggestions,
      totalPotentialSavings: Math.round(potentialSavings),
      method: 'rule_based',
    };
  }

  /**
   * Handle general budget query
   */
  private async handleGeneralQuery(params: any): Promise<any> {
    const { message, itinerary, totalBudget } = params;

    if (!message) {
      return this.trackBudget(params);
    }

    // Use Gemini to understand budget question
    const gemini = getGeminiClient();
    if (gemini.isReady()) {
      try {
        const prompt = `User budget question: "${message}"

Current budget: $${totalBudget || 'not set'}
Current itinerary: ${itinerary ? 'provided' : 'not provided'}

Determine what the user wants:
- Track current spending?
- Find cost savings?
- Analyze spending patterns?
- Get budget advice?

Provide helpful response and action. Format as JSON.`;

        const response = await gemini.generateContent(prompt);
        const parsed = JSON.parse(response);

        return {
          success: true,
          response: parsed,
          method: 'ai',
        };
      } catch (error) {
        console.error('[BudgetGuardian] General query failed:', error);
      }
    }

    // Fallback
    return this.trackBudget(params);
  }

  // --- UTILITY METHODS ---

  /**
   * Calculate total spending from itinerary
   */
  private calculateSpending(itinerary: any): any {
    let total = 0;
    const breakdown: Record<string, number> = {
      food: 0,
      activity: 0,
      logistics: 0,
      stay: 0,
      other: 0,
    };

    let dayCount = 0;
    itinerary.days?.forEach((day: any) => {
      if (!day.items || day.items.length === 0) return;
      dayCount++;

      day.items.forEach((item: any) => {
        const cost = item.cost || 0;
        total += cost;

        const category = item.type || 'other';
        if (breakdown[category] !== undefined) {
          breakdown[category] += cost;
        } else {
          breakdown.other += cost;
        }
      });
    });

    const dailyAverage = dayCount > 0 ? total / dayCount : 0;

    return {
      total,
      breakdown,
      dailyAverage,
    };
  }

  /**
   * Find expensive items (>15% of total budget)
   */
  private findExpensiveItems(itinerary: any, totalBudget: number): any[] {
    const threshold = totalBudget * 0.15;
    const expensive: any[] = [];

    itinerary.days?.forEach((day: any) => {
      day.items?.forEach((item: any) => {
        if (item.cost && item.cost > threshold) {
          expensive.push({
            title: item.title,
            cost: item.cost,
            percentOfBudget: Math.round((item.cost / totalBudget) * 100),
            day: day.day,
          });
        }
      });
    });

    return expensive;
  }

  /**
   * Calculate daily costs
   */
  private calculateDailyCosts(itinerary: any): number[] {
    const dailyCosts: number[] = [];

    itinerary.days?.forEach((day: any) => {
      let dayTotal = 0;
      day.items?.forEach((item: any) => {
        dayTotal += item.cost || 0;
      });
      dailyCosts.push(dayTotal);
    });

    return dailyCosts;
  }

  /**
   * Calculate variance in daily spending
   */
  private calculateVariance(dailyCosts: number[]): number {
    if (dailyCosts.length === 0) return 0;

    const mean = dailyCosts.reduce((a, b) => a + b, 0) / dailyCosts.length;
    const variance = dailyCosts.reduce((sum, cost) => {
      return sum + Math.pow(cost - mean, 2);
    }, 0) / dailyCosts.length;

    return Math.sqrt(variance) / mean; // Coefficient of variation
  }

  // --- SUGGESTION GENERATORS ---

  private generateBudgetSuggestions(result: any): any[] {
    if (!result.success) return [];

    const suggestions: any[] = [];

    // Budget status
    if (result.status === 'exceeded') {
      suggestions.push({
        type: 'alert',
        priority: 'critical',
        title: 'Over Budget',
        description: `You're over budget by $${Math.abs(result.remaining).toFixed(2)}`,
        action: 'find_savings',
        data: result,
      });
    } else if (result.status === 'warning') {
      suggestions.push({
        type: 'warning',
        priority: 'high',
        title: 'Budget Warning',
        description: `${result.percentUsed}% of budget used`,
        action: 'monitor_spending',
        data: result,
      });
    } else {
      suggestions.push({
        type: 'info',
        priority: 'low',
        title: 'On Track',
        description: `$${result.remaining.toFixed(2)} remaining`,
        action: 'view_breakdown',
        data: result,
      });
    }

    // Add alerts as suggestions
    result.alerts?.forEach((alert: any) => {
      suggestions.push({
        type: alert.type,
        priority: alert.type === 'critical' ? 'high' : 'normal',
        title: alert.message,
        action: alert.action,
        data: alert.items,
      });
    });

    return suggestions;
  }

  private generateCostSuggestions(result: any): any[] {
    if (!result.success) return [];

    const suggestions: any[] = [];

    // Highlight top spending category
    if (result.categoryBreakdown && result.categoryBreakdown.length > 0) {
      const top = result.categoryBreakdown[0];
      suggestions.push({
        type: 'insight',
        priority: 'normal',
        title: `Highest Spend: ${top.category}`,
        description: `$${top.amount.toFixed(2)} (${top.percentage}% of total)`,
        action: 'view_category_details',
        data: top,
      });
    }

    // Add insights as suggestions
    result.insights?.forEach((insight: string) => {
      suggestions.push({
        type: 'tip',
        priority: 'low',
        title: insight,
        action: 'none',
      });
    });

    return suggestions;
  }

  private generateSavingsSuggestions(result: any): any[] {
    if (!result.success || !result.suggestions) return [];

    return result.suggestions.map((suggestion: any) => ({
      type: 'savings',
      priority: suggestion.priority,
      title: suggestion.title,
      description: `Save up to $${suggestion.potentialSavings || 0}`,
      action: 'apply_savings_tip',
      data: suggestion,
    }));
  }

  private generateGeneralSuggestions(result: any): any[] {
    if (!result.success) return [];

    return [{
      type: 'info',
      priority: 'normal',
      title: 'Budget Guardian Active',
      description: 'Monitoring your trip spending',
      action: 'view_budget',
      data: result,
    }];
  }
}

// Singleton instance
let guardianInstance: BudgetGuardianAgent | null = null;

export function getBudgetGuardian(): BudgetGuardianAgent {
  if (!guardianInstance) {
    guardianInstance = new BudgetGuardianAgent();
  }
  return guardianInstance;
}

export default BudgetGuardianAgent;