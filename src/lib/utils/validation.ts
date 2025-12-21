/**
 * Validation Utility Functions
 * 
 * Production-ready input validation
 */

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Email is invalid');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate password
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain an uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain a lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain a number');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate URL
 */
export function validateURL(url: string): ValidationResult {
  const errors: string[] = [];

  if (!url) {
    errors.push('URL is required');
  } else {
    try {
      new URL(url);
    } catch {
      errors.push('URL is invalid');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate date range
 */
export function validateDateRange(
  startDate: string,
  endDate: string
): ValidationResult {
  const errors: string[] = [];

  if (!startDate) {
    errors.push('Start date is required');
  }

  if (!endDate) {
    errors.push('End date is required');
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime())) {
      errors.push('Start date is invalid');
    }

    if (isNaN(end.getTime())) {
      errors.push('End date is invalid');
    }

    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
      errors.push('End date must be after start date');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate required field
 */
export function validateRequired(
  value: any,
  fieldName: string = 'Field'
): ValidationResult {
  const errors: string[] = [];

  if (value === null || value === undefined || value === '') {
    errors.push(`${fieldName} is required`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate string length
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string = 'Field'
): ValidationResult {
  const errors: string[] = [];

  if (value.length < min) {
    errors.push(`${fieldName} must be at least ${min} characters`);
  }

  if (value.length > max) {
    errors.push(`${fieldName} must be at most ${max} characters`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate number range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = 'Value'
): ValidationResult {
  const errors: string[] = [];

  if (value < min) {
    errors.push(`${fieldName} must be at least ${min}`);
  }

  if (value > max) {
    errors.push(`${fieldName} must be at most ${max}`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate rating (1-5)
 */
export function validateRating(rating: number): ValidationResult {
  return validateRange(rating, 1, 5, 'Rating');
}

/**
 * Validate price level (1-4)
 */
export function validatePriceLevel(level: number): ValidationResult {
  return validateRange(level, 1, 4, 'Price level');
}

/**
 * Combine validation results
 */
export function combineValidations(...results: ValidationResult[]): ValidationResult {
  const allErrors = results.flatMap((r) => r.errors);
  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Sanitize HTML (basic - prevent XSS)
 */
export function sanitizeHTML(html: string): string {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize user input
 */
export function sanitizeInput(input: string, maxLength: number = 500): string {
  return sanitizeHTML(input.trim()).slice(0, maxLength);
}
