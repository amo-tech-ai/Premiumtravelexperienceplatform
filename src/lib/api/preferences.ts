/**
 * User Preferences API Service
 * 
 * Production-ready service for user preferences management
 */

import api from './client';
import type { UserPreferences, UpdatePreferencesRequest } from './types';

// ============================================================================
// PREFERENCES
// ============================================================================

/**
 * Get user preferences
 */
export async function getPreferences(): Promise<UserPreferences> {
  const response = await api.get<UserPreferences>('/preferences');
  return response.data;
}

/**
 * Update user preferences
 */
export async function updatePreferences(
  data: UpdatePreferencesRequest
): Promise<UserPreferences> {
  const response = await api.put<UserPreferences>('/preferences', data);
  return response.data;
}

/**
 * Get specific preference
 */
export async function getPreference<K extends keyof UserPreferences>(
  key: K
): Promise<UserPreferences[K] | undefined> {
  try {
    const prefs = await getPreferences();
    return prefs[key];
  } catch {
    return undefined;
  }
}

/**
 * Update specific preference
 */
export async function updatePreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): Promise<UserPreferences> {
  return updatePreferences({ [key]: value } as UpdatePreferencesRequest);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if AI is enabled
 */
export async function isAIEnabled(): Promise<boolean> {
  const enabled = await getPreference('ai_enabled');
  return enabled ?? true; // Default to enabled
}

/**
 * Toggle AI enabled/disabled
 */
export async function toggleAI(): Promise<boolean> {
  const currentEnabled = await isAIEnabled();
  const prefs = await updatePreference('ai_enabled', !currentEnabled);
  return prefs.ai_enabled ?? true;
}

/**
 * Get user's preferred currency
 */
export async function getPreferredCurrency(): Promise<string> {
  const currency = await getPreference('currency');
  return currency || 'USD';
}

/**
 * Get user's preferred language
 */
export async function getPreferredLanguage(): Promise<string> {
  const language = await getPreference('language');
  return language || 'en';
}

/**
 * Check if user has specific travel style
 */
export async function hasTravelStyle(style: string): Promise<boolean> {
  const styles = await getPreference('travel_style');
  return styles?.includes(style) ?? false;
}

/**
 * Check if user has specific interest
 */
export async function hasInterest(interest: string): Promise<boolean> {
  const interests = await getPreference('interests');
  return interests?.includes(interest) ?? false;
}

/**
 * Get notification preferences
 */
export async function getNotificationPreferences() {
  const prefs = await getPreference('notification_preferences');
  return (
    prefs || {
      email: true,
      push: true,
      ai_suggestions: true,
    }
  );
}
