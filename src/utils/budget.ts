/**
 * Budget Calculation Utilities
 * Track spending, forecast costs, category breakdowns
 */

export interface BudgetItem {
  id: string;
  cost: number;
  type: 'food' | 'activity' | 'transport' | 'accommodation' | 'event' | 'other';
  title?: string;
  status?: 'planned' | 'booked' | 'confirmed' | 'paid';
}

export interface BudgetSummary {
  total: number;
  spent: number;
  remaining: number;
  byCategory: Record<string, number>;
  percentUsed: number;
  isOverBudget: boolean;
}

export interface BudgetForecast {
  projected: number;
  confidence: 'high' | 'medium' | 'low';
  recommendation: string;
  savingOpportunities: Array<{
    category: string;
    currentSpend: number;
    suggestedSpend: number;
    savings: number;
  }>;
}

/**
 * Calculate total cost of items
 * 
 * @param items - Array of budget items
 * @returns Total cost
 */
export function calculateTotal(items: BudgetItem[]): number {
  return items.reduce((sum, item) => sum + (item.cost || 0), 0);
}

/**
 * Calculate total by status
 * Useful for separating confirmed vs planned costs
 */
export function calculateTotalByStatus(
  items: BudgetItem[],
  status: BudgetItem['status']
): number {
  return items
    .filter((item) => item.status === status)
    .reduce((sum, item) => sum + (item.cost || 0), 0);
}

/**
 * Group spending by category
 * 
 * @param items - Array of budget items
 * @returns Object with category totals
 * 
 * @example
 * groupByCategory(items)
 * // { food: 450, activity: 200, transport: 80, ... }
 */
export function groupByCategory(items: BudgetItem[]): Record<string, number> {
  const grouped: Record<string, number> = {
    food: 0,
    activity: 0,
    transport: 0,
    accommodation: 0,
    event: 0,
    other: 0,
  };

  items.forEach((item) => {
    const category = item.type || 'other';
    grouped[category] = (grouped[category] || 0) + (item.cost || 0);
  });

  return grouped;
}

/**
 * Calculate remaining budget
 * 
 * @param totalBudget - Total allocated budget
 * @param spent - Amount spent so far
 * @returns Remaining amount (negative if over budget)
 */
export function calculateRemaining(totalBudget: number, spent: number): number {
  return totalBudget - spent;
}

/**
 * Calculate percentage of budget used
 * 
 * @param spent - Amount spent
 * @param totalBudget - Total budget
 * @returns Percentage (0-100, can exceed 100)
 */
export function calculatePercentUsed(spent: number, totalBudget: number): number {
  if (totalBudget === 0) return 0;
  return Math.round((spent / totalBudget) * 100);
}

/**
 * Generate budget summary
 * 
 * @param items - All budget items
 * @param totalBudget - Total allocated budget
 * @returns Complete budget summary
 */
export function generateBudgetSummary(
  items: BudgetItem[],
  totalBudget: number
): BudgetSummary {
  const spent = calculateTotal(items);
  const remaining = calculateRemaining(totalBudget, spent);
  const percentUsed = calculatePercentUsed(spent, totalBudget);
  const byCategory = groupByCategory(items);

  return {
    total: totalBudget,
    spent,
    remaining,
    byCategory,
    percentUsed,
    isOverBudget: spent > totalBudget,
  };
}

/**
 * Forecast spending based on current trajectory
 * Uses linear projection based on days elapsed
 * 
 * @param currentSpent - Amount spent so far
 * @param daysElapsed - Days since trip start
 * @param totalDays - Total trip duration
 * @returns Projected total spending
 * 
 * @example
 * // Spent $400 in first 2 days of 5-day trip
 * forecastSpending(400, 2, 5) // Projects ~$1000 total
 */
export function forecastSpending(
  currentSpent: number,
  daysElapsed: number,
  totalDays: number
): number {
  if (daysElapsed === 0 || totalDays === 0) return currentSpent;

  const dailyAverage = currentSpent / daysElapsed;
  const projected = dailyAverage * totalDays;

  return Math.round(projected);
}

/**
 * Generate spending forecast with recommendations
 * 
 * @param items - Current budget items
 * @param totalBudget - Total allocated budget
 * @param daysElapsed - Days since trip start
 * @param totalDays - Total trip duration
 * @returns Detailed forecast with recommendations
 */
export function generateBudgetForecast(
  items: BudgetItem[],
  totalBudget: number,
  daysElapsed: number,
  totalDays: number
): BudgetForecast {
  const currentSpent = calculateTotal(items);
  const projected = forecastSpending(currentSpent, daysElapsed, totalDays);
  const overUnder = totalBudget - projected;

  // Determine confidence based on data points
  let confidence: 'high' | 'medium' | 'low' = 'low';
  if (daysElapsed >= totalDays * 0.5) confidence = 'high';
  else if (daysElapsed >= totalDays * 0.3) confidence = 'medium';

  // Generate recommendation
  let recommendation = '';
  if (overUnder < 0) {
    const percentOver = Math.abs((overUnder / totalBudget) * 100);
    if (percentOver > 20) {
      recommendation = `You're projected to exceed your budget by ${formatCurrency(
        Math.abs(overUnder)
      )}. Consider reducing spending in high-cost categories.`;
    } else {
      recommendation = `You're slightly over budget. Look for cost-saving opportunities.`;
    }
  } else if (overUnder > totalBudget * 0.2) {
    recommendation = `You're well within budget! You have room to splurge on special experiences.`;
  } else {
    recommendation = `You're on track with your budget. Keep monitoring spending.`;
  }

  // Find saving opportunities
  const byCategory = groupByCategory(items);
  const savingOpportunities = Object.entries(byCategory)
    .filter(([_, amount]) => amount > 0)
    .map(([category, currentSpend]) => {
      const dailySpend = currentSpend / daysElapsed;
      const projectedCategorySpend = dailySpend * totalDays;
      const suggestedSpend = projectedCategorySpend * 0.85; // 15% reduction
      const savings = projectedCategorySpend - suggestedSpend;

      return {
        category,
        currentSpend,
        suggestedSpend: Math.round(suggestedSpend),
        savings: Math.round(savings),
      };
    })
    .filter((opp) => opp.savings > 20) // Only show if savings > $20
    .sort((a, b) => b.savings - a.savings); // Sort by biggest savings

  return {
    projected,
    confidence,
    recommendation,
    savingOpportunities,
  };
}

/**
 * Check if budget alert should be triggered
 * Returns alert level based on spending
 * 
 * @param spent - Current spending
 * @param totalBudget - Total budget
 * @returns Alert level: null | 'warning' | 'danger'
 */
export function checkBudgetAlert(
  spent: number,
  totalBudget: number
): 'warning' | 'danger' | null {
  const percentUsed = calculatePercentUsed(spent, totalBudget);

  if (percentUsed >= 100) return 'danger';
  if (percentUsed >= 80) return 'warning';
  return null;
}

/**
 * Find most expensive items
 * Useful for identifying big-ticket items
 * 
 * @param items - Budget items
 * @param limit - Number of items to return
 * @returns Top N most expensive items
 */
export function findMostExpensive(items: BudgetItem[], limit: number = 5): BudgetItem[] {
  return [...items].sort((a, b) => (b.cost || 0) - (a.cost || 0)).slice(0, limit);
}

/**
 * Calculate daily spending rate
 * 
 * @param spent - Total spent so far
 * @param daysElapsed - Days since start
 * @returns Average spending per day
 */
export function calculateDailyRate(spent: number, daysElapsed: number): number {
  if (daysElapsed === 0) return 0;
  return Math.round(spent / daysElapsed);
}

/**
 * Suggest budget allocation by category
 * Based on typical travel spending patterns
 * 
 * @param totalBudget - Total budget to allocate
 * @param tripType - Type of trip (affects allocation)
 * @returns Suggested allocation by category
 */
export function suggestBudgetAllocation(
  totalBudget: number,
  tripType: 'budget' | 'mid-range' | 'luxury' = 'mid-range'
): Record<string, number> {
  // Allocation percentages by trip type
  const allocations = {
    budget: {
      accommodation: 0.3,
      food: 0.35,
      activity: 0.2,
      transport: 0.1,
      other: 0.05,
    },
    'mid-range': {
      accommodation: 0.35,
      food: 0.3,
      activity: 0.2,
      transport: 0.1,
      other: 0.05,
    },
    luxury: {
      accommodation: 0.4,
      food: 0.25,
      activity: 0.2,
      transport: 0.1,
      other: 0.05,
    },
  };

  const percentages = allocations[tripType];
  const result: Record<string, number> = {};

  Object.entries(percentages).forEach(([category, percentage]) => {
    result[category] = Math.round(totalBudget * percentage);
  });

  return result;
}

/**
 * Format currency for display
 * 
 * @param amount - Amount to format
 * @param currency - Currency code (default: USD)
 * @param showCents - Show decimal places
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1234.56) // "$1,235"
 * formatCurrency(1234.56, 'USD', true) // "$1,234.56"
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  showCents: boolean = false
): string {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  };

  return new Intl.NumberFormat('en-US', options).format(amount);
}

/**
 * Compare budget vs actual for categories
 * Shows which categories are over/under budget
 */
export function compareBudgetVsActual(
  plannedBudget: Record<string, number>,
  actualSpending: Record<string, number>
): Array<{
  category: string;
  planned: number;
  actual: number;
  difference: number;
  percentDiff: number;
  status: 'over' | 'under' | 'on-track';
}> {
  const categories = new Set([
    ...Object.keys(plannedBudget),
    ...Object.keys(actualSpending),
  ]);

  return Array.from(categories).map((category) => {
    const planned = plannedBudget[category] || 0;
    const actual = actualSpending[category] || 0;
    const difference = actual - planned;
    const percentDiff = planned === 0 ? 0 : Math.round((difference / planned) * 100);

    let status: 'over' | 'under' | 'on-track' = 'on-track';
    if (percentDiff > 10) status = 'over';
    else if (percentDiff < -10) status = 'under';

    return {
      category,
      planned,
      actual,
      difference,
      percentDiff,
      status,
    };
  });
}
