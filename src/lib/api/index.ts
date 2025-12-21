/**
 * API Service Barrel Export
 * 
 * Central export point for all API services
 */

// Core client
export { default as api, checkHealth } from './client';

// Types
export * from './types';

// Services
export * from './trips';
export * from './saved-places';
export * from './preferences';

// Re-export for convenience
import * as trips from './trips';
import * as savedPlaces from './saved-places';
import * as preferences from './preferences';

export const services = {
  trips,
  savedPlaces,
  preferences,
};

export default services;
