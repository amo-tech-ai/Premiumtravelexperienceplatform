/**
 * Formatting Utility Functions
 * Display helpers for consistent formatting across the app
 */

/**
 * Format date for display
 * 
 * @param date - Date to format
 * @param format - Format type
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date("2024-01-15"), "short") // "Jan 15"
 * formatDate(new Date("2024-01-15"), "long") // "January 15, 2024"
 * formatDate(new Date("2024-01-15"), "full") // "Monday, January 15, 2024"
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (!(d instanceof Date) || isNaN(d.getTime())) {
    return '';
  }

  const options: Record<string, Intl.DateTimeFormatOptions> = {
    short: { month: 'short', day: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
  };

  return new Intl.DateTimeFormat('en-US', options[format]).format(d);
}

/**
 * Format date range
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted range string
 * 
 * @example
 * formatDateRange("2024-01-15", "2024-01-20") // "Jan 15 - 20, 2024"
 * formatDateRange("2024-01-15", "2024-02-05") // "Jan 15 - Feb 5, 2024"
 */
export function formatDateRange(
  startDate: Date | string,
  endDate: Date | string
): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (!start || !end) return '';

  const sameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const sameYear = start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    const monthYear = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(start);
    return `${monthYear} ${start.getDate()} - ${end.getDate()}`;
  } else if (sameYear) {
    const startStr = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(start);
    const endStr = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(end);
    return `${startStr} - ${endStr}, ${start.getFullYear()}`;
  } else {
    return `${formatDate(start, 'short')} - ${formatDate(end, 'short')}`;
  }
}

/**
 * Calculate number of days between dates
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of days (inclusive)
 */
export function daysBetween(
  startDate: Date | string,
  endDate: Date | string
): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays + 1; // Inclusive of both start and end
}

/**
 * Pluralize word based on count
 * 
 * @param count - Number of items
 * @param singular - Singular form
 * @param plural - Plural form (optional, defaults to singular + "s")
 * @returns Pluralized string
 * 
 * @example
 * pluralize(1, "day") // "1 day"
 * pluralize(5, "day") // "5 days"
 * pluralize(2, "activity", "activities") // "2 activities"
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  const word = count === 1 ? singular : plural || `${singular}s`;
  return `${count} ${word}`;
}

/**
 * Truncate text with ellipsis
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter of each word
 * 
 * @param text - Text to capitalize
 * @returns Capitalized text
 * 
 * @example
 * capitalize("hello world") // "Hello World"
 */
export function capitalize(text: string): string {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Format number with commas
 * 
 * @param num - Number to format
 * @returns Formatted number string
 * 
 * @example
 * formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format currency (USD)
 * 
 * @param amount - Amount to format
 * @param showCents - Whether to show cents (default: false)
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1500) // "$1,500"
 * formatCurrency(1500.50) // "$1,501"
 * formatCurrency(1500.50, true) // "$1,500.50"
 */
export function formatCurrency(amount: number, showCents: boolean = false): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(amount);
}

/**
 * Format percentage
 * 
 * @param value - Decimal value (0-1)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage
 * 
 * @example
 * formatPercent(0.856) // "86%"
 * formatPercent(0.856, 1) // "85.6%"
 */
export function formatPercent(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format relative time (e.g., "2 hours ago")
 * 
 * @param date - Date to format
 * @returns Relative time string
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  
  return formatDate(d, 'medium');
}

/**
 * Generate initials from name
 * 
 * @param name - Full name
 * @returns Initials (max 2 characters)
 * 
 * @example
 * getInitials("John Smith") // "JS"
 * getInitials("John") // "J"
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Format file size
 * 
 * @param bytes - File size in bytes
 * @returns Formatted size string
 * 
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1536) // "1.5 KB"
 * formatFileSize(1048576) // "1 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format phone number (US format)
 * 
 * @param phone - Phone number (digits only)
 * @returns Formatted phone
 * 
 * @example
 * formatPhone("1234567890") // "(123) 456-7890"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
}

/**
 * Create URL-friendly slug
 * 
 * @param text - Text to slugify
 * @returns URL-safe slug
 * 
 * @example
 * slugify("Medellín Design Week") // "medellin-design-week"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Normalize accents
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens
    .trim();
}

/**
 * Format list with commas and "and"
 * 
 * @param items - Array of strings
 * @returns Formatted list
 * 
 * @example
 * formatList(["apples"]) // "apples"
 * formatList(["apples", "oranges"]) // "apples and oranges"
 * formatList(["apples", "oranges", "bananas"]) // "apples, oranges, and bananas"
 */
export function formatList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

/**
 * Format rating with stars
 * 
 * @param rating - Rating value (0-5)
 * @param showNumber - Include numeric rating
 * @returns Star string
 * 
 * @example
 * formatRating(4.5) // "★★★★☆"
 * formatRating(4.5, true) // "★★★★☆ 4.5"
 */
export function formatRating(rating: number, showNumber: boolean = false): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const stars = 
    '★'.repeat(fullStars) +
    (hasHalfStar ? '⯨' : '') +
    '☆'.repeat(emptyStars);

  return showNumber ? `${stars} ${rating.toFixed(1)}` : stars;
}

/**
 * Mask sensitive information
 * 
 * @param value - Value to mask
 * @param visibleChars - Number of visible characters at end
 * @returns Masked string
 * 
 * @example
 * maskSensitive("1234567890", 4) // "******7890"
 */
export function maskSensitive(value: string, visibleChars: number = 4): string {
  if (value.length <= visibleChars) return value;
  const masked = '*'.repeat(value.length - visibleChars);
  return masked + value.slice(-visibleChars);
}