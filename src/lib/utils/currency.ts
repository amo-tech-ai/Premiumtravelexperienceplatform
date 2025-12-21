/**
 * Currency Utility Functions
 * 
 * Production-ready currency formatting
 */

/**
 * Format currency amount
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback if currency code is invalid
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Format currency with compact notation (e.g., $1.2K, $3.5M)
 */
export function formatCurrencyCompact(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      notation: 'compact',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(amount);
  } catch {
    return formatCurrency(amount, currency, locale);
  }
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: string = 'USD', locale: string = 'en-US'): string {
  try {
    const formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(0);
    
    // Extract symbol (remove digits)
    return formatted.replace(/[\d\s,.]/g, '');
  } catch {
    // Fallback to currency code
    return currency;
  }
}

/**
 * Format price level (1-4) as dollar signs
 */
export function formatPriceLevel(level: number): string {
  const symbols = ['$', '$$', '$$$', '$$$$'];
  return symbols[Math.max(0, Math.min(level - 1, 3))] || '$';
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number | null {
  // Remove currency symbols, spaces, and commas
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? null : parsed;
}

/**
 * Common currency codes
 */
export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
  CHF: { symbol: 'Fr', name: 'Swiss Franc' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  MXN: { symbol: 'Mex$', name: 'Mexican Peso' },
  BRL: { symbol: 'R$', name: 'Brazilian Real' },
  ZAR: { symbol: 'R', name: 'South African Rand' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar' },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar' },
  SEK: { symbol: 'kr', name: 'Swedish Krona' },
  NOK: { symbol: 'kr', name: 'Norwegian Krone' },
  DKK: { symbol: 'kr', name: 'Danish Krone' },
  THB: { symbol: '฿', name: 'Thai Baht' },
  AED: { symbol: 'AED', name: 'UAE Dirham' },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;
