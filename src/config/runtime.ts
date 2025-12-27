/**
 * Runtime Configuration for Figma Make
 * 
 * This file provides runtime-safe configuration constants.
 * DO NOT use import.meta.env or process.env - they are not supported in Figma Make.
 */

// ============================================================================
// ENVIRONMENT FLAGS
// ============================================================================

/**
 * Development mode flag
 * Set to false for production builds
 */
export const IS_DEV = false;

/**
 * Production mode flag
 */
export const IS_PROD = !IS_DEV;

/**
 * Current environment mode
 */
export const MODE = IS_DEV ? 'development' : 'production';

// ============================================================================
// API CONFIGURATION
// ============================================================================

/**
 * Supabase configuration (placeholder values)
 * Replace with your actual Supabase credentials
 */
export const SUPABASE_CONFIG = {
  projectId: 'your-project-id',
  url: 'https://your-project-id.supabase.co',
  anonKey: 'your-anon-key-here',
};

/**
 * Google Maps API configuration (placeholder)
 * Replace with your actual Google Maps API key
 */
export const GOOGLE_MAPS_CONFIG = {
  apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
};

/**
 * Gemini AI configuration (placeholder)
 * Replace with your actual Gemini API key
 */
export const GEMINI_CONFIG = {
  apiKey: 'YOUR_GEMINI_API_KEY',
};

// ============================================================================
// FEATURE FLAGS
// ============================================================================

/**
 * Feature flags for toggling functionality
 */
export const FEATURES = {
  // Enable service worker PWA support
  serviceWorker: false,
  
  // Enable analytics tracking
  analytics: IS_PROD,
  
  // Enable debug logging
  debugMode: IS_DEV,
  
  // Enable AI agent logging
  aiAgentLogging: IS_DEV,
  
  // Enable error details in UI
  showErrorDetails: IS_DEV,
};

// ============================================================================
// LOGGING CONFIGURATION
// ============================================================================

/**
 * Console logging helper
 * Only logs in development mode
 */
export const devLog = (...args: any[]) => {
  if (IS_DEV) {
    console.log(...args);
  }
};

export const devWarn = (...args: any[]) => {
  if (IS_DEV) {
    console.warn(...args);
  }
};

export const devError = (...args: any[]) => {
  if (IS_DEV) {
    console.error(...args);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export const config = {
  isDev: IS_DEV,
  isProd: IS_PROD,
  mode: MODE,
  supabase: SUPABASE_CONFIG,
  googleMaps: GOOGLE_MAPS_CONFIG,
  gemini: GEMINI_CONFIG,
  features: FEATURES,
  log: {
    dev: devLog,
    warn: devWarn,
    error: devError,
  },
} as const;

export default config;
