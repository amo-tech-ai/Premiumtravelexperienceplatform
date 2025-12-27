/**
 * AI CONTEXT PARSER
 * 
 * Parses AI responses into ExplorationContext objects
 * 
 * WORKFLOW:
 * 1. AI responds with recommendations
 * 2. Parser extracts intent, results, area
 * 3. Creates ExplorationContext
 * 4. Stores in SessionStorage
 * 5. Returns context ID for navigation
 * 
 * @see /docs/01-ai-features/PROMPT-4-WEEK-1-COMPLETE.md
 */

import {
  ExplorationContext,
  ExplorationIntent,
  ExplorationResult,
  ExplorationArea,
  generateContextId,
} from '../../context/types/ExplorationTypes';
import { explorationStorage } from '../../context/storage/ExplorationStorage';

// ============================================================================
// TYPES
// ============================================================================

/**
 * AI Response Structure
 * Expected format from AI
 */
export interface AIResponse {
  intent: string;
  area?: {
    name: string;
    lat: number;
    lng: number;
  };
  results: Array<{
    id?: string;
    name: string;
    type: string;
    description?: string;
    location?: {
      address?: string;
      lat: number;
      lng: number;
    };
    rating?: number;
    priceLevel?: number;
    imageUrl?: string;
    distance?: number;
    isOpen?: boolean;
  }>;
  reasoning?: string;
  confidence?: 'high' | 'medium' | 'low';
}

/**
 * Parse Result
 */
export interface ParseResult {
  success: boolean;
  context?: ExplorationContext;
  contextId?: string;
  error?: string;
}

// ============================================================================
// INTENT DETECTION
// ============================================================================

/**
 * Detect exploration intent from text
 */
export function detectIntent(text: string): ExplorationIntent {
  const lower = text.toLowerCase();

  if (
    lower.includes('restaurant') ||
    lower.includes('food') ||
    lower.includes('eat') ||
    lower.includes('dining') ||
    lower.includes('cafe') ||
    lower.includes('coffee')
  ) {
    return 'restaurants';
  }

  if (
    lower.includes('event') ||
    lower.includes('concert') ||
    lower.includes('show') ||
    lower.includes('festival') ||
    lower.includes('nightlife') ||
    lower.includes('bar')
  ) {
    return 'events';
  }

  if (
    lower.includes('stay') ||
    lower.includes('hotel') ||
    lower.includes('airbnb') ||
    lower.includes('accommodation') ||
    lower.includes('rental')
  ) {
    return 'rentals';
  }

  if (
    lower.includes('activity') ||
    lower.includes('things to do') ||
    lower.includes('attraction') ||
    lower.includes('tour') ||
    lower.includes('experience')
  ) {
    return 'activities';
  }

  if (
    lower.includes('destination') ||
    lower.includes('city') ||
    lower.includes('place to visit') ||
    lower.includes('where to go')
  ) {
    return 'destinations';
  }

  return 'mixed';
}

/**
 * Normalize intent from AI response
 */
export function normalizeIntent(intent: string): ExplorationIntent {
  const intentMap: Record<string, ExplorationIntent> = {
    restaurant: 'restaurants',
    restaurants: 'restaurants',
    food: 'restaurants',
    dining: 'restaurants',
    event: 'events',
    events: 'events',
    nightlife: 'events',
    stay: 'rentals',
    stays: 'rentals',
    hotel: 'rentals',
    rental: 'rentals',
    rentals: 'rentals',
    activity: 'activities',
    activities: 'activities',
    attraction: 'activities',
    destination: 'destinations',
    destinations: 'destinations',
  };

  return intentMap[intent.toLowerCase()] || 'mixed';
}

// ============================================================================
// RESULT PARSING
// ============================================================================

/**
 * Parse single result into ExplorationResult
 */
function parseResult(
  result: AIResponse['results'][0],
  index: number
): ExplorationResult {
  return {
    id: result.id || `result_${Date.now()}_${index}`,
    name: result.name,
    type: result.type,
    description: result.description,
    location: {
      address: result.location?.address,
      lat: result.location?.lat || 0,
      lng: result.location?.lng || 0,
    },
    rating: result.rating,
    priceLevel: result.priceLevel,
    imageUrl: result.imageUrl,
    distance: result.distance,
    metadata: {
      isOpen: result.isOpen,
    },
  };
}

/**
 * Parse area from AI response
 */
function parseArea(aiResponse: AIResponse): ExplorationArea {
  if (aiResponse.area) {
    return {
      name: aiResponse.area.name,
      lat: aiResponse.area.lat,
      lng: aiResponse.area.lng,
      bounds: {
        north: aiResponse.area.lat + 0.05,
        south: aiResponse.area.lat - 0.05,
        east: aiResponse.area.lng + 0.05,
        west: aiResponse.area.lng - 0.05,
      },
    };
  }

  // Default to first result location if available
  const firstResult = aiResponse.results[0];
  if (firstResult?.location) {
    return {
      name: 'Nearby',
      lat: firstResult.location.lat,
      lng: firstResult.location.lng,
      bounds: {
        north: firstResult.location.lat + 0.05,
        south: firstResult.location.lat - 0.05,
        east: firstResult.location.lng + 0.05,
        west: firstResult.location.lng - 0.05,
      },
    };
  }

  // Default fallback
  return {
    name: 'Unknown Area',
    lat: 0,
    lng: 0,
  };
}

// ============================================================================
// MAIN PARSER
// ============================================================================

/**
 * Parse AI response into ExplorationContext
 * 
 * @param aiResponse - Raw AI response
 * @param userQuery - Original user query (for intent detection)
 * @returns Parse result with context or error
 * 
 * @example
 * ```typescript
 * const result = parseAIResponse(aiResponse, "Best restaurants in Poblado");
 * if (result.success) {
 *   navigateToExplore(result.contextId);
 * }
 * ```
 */
export function parseAIResponse(
  aiResponse: AIResponse,
  userQuery?: string
): ParseResult {
  try {
    // Detect intent
    const intent = userQuery
      ? detectIntent(userQuery)
      : normalizeIntent(aiResponse.intent);

    // Parse results
    const primaryResults = aiResponse.results
      .slice(0, 10)
      .map((r, i) => parseResult(r, i));

    // Parse area
    const area = parseArea(aiResponse);

    // Create pins
    const pins = primaryResults.map((r) => ({
      id: r.id,
      lat: r.location.lat,
      lng: r.location.lng,
      type: r.type,
      isPrimary: true,
    }));

    // Create context
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours

    const context: ExplorationContext = {
      id: generateContextId(),
      source: 'ai',
      intent,
      area,
      radius: 'short_drive',
      timeRelevance: {
        type: 'flexible',
      },
      primaryResults,
      pins,
      ranking: {
        algorithm: 'ai_recommended',
        confidence: aiResponse.confidence || 'high',
        reasoning: aiResponse.reasoning,
        factors: ['rating', 'distance', 'popularity'],
      },
      createdAt: now,
      expiresAt,
    };

    // Store context
    explorationStorage.store(context);

    return {
      success: true,
      context,
      contextId: context.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse AI response',
    };
  }
}

/**
 * Parse simple text recommendations
 * For cases where AI returns unstructured text
 */
export function parseTextRecommendations(
  text: string,
  userQuery: string
): ParseResult {
  try {
    // Extract place names from text (simple regex)
    const placePattern = /\d+\.\s*\*\*(.+?)\*\*/g;
    const matches = [...text.matchAll(placePattern)];

    if (matches.length === 0) {
      return {
        success: false,
        error: 'No recommendations found in text',
      };
    }

    // Create mock results
    const results = matches.map((match, index) => ({
      id: `text_result_${index}`,
      name: match[1].trim(),
      type: detectIntent(userQuery),
      location: {
        lat: 0,
        lng: 0,
      },
    }));

    // Parse as structured response
    return parseAIResponse(
      {
        intent: detectIntent(userQuery),
        results,
      },
      userQuery
    );
  } catch (error) {
    return {
      success: false,
      error: 'Failed to parse text recommendations',
    };
  }
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Extract top N results for Chat display
 */
export function extractTopResults(
  context: ExplorationContext,
  limit: number = 3
): ExplorationResult[] {
  return context.primaryResults.slice(0, limit);
}

/**
 * Generate "View all on map" CTA text
 */
export function generateViewAllCTA(context: ExplorationContext): string {
  const total = context.primaryResults.length;
  const intentLabel = {
    restaurants: 'restaurants',
    events: 'events',
    rentals: 'places',
    destinations: 'destinations',
    activities: 'activities',
    mixed: 'recommendations',
  }[context.intent];

  return `View all ${total} ${intentLabel} on the map`;
}

/**
 * Generate AI reasoning text for Chat
 */
export function generateReasoningText(context: ExplorationContext): string {
  if (context.ranking?.reasoning) {
    return context.ranking.reasoning;
  }

  const intentLabel = {
    restaurants: 'restaurants',
    events: 'events',
    rentals: 'stays',
    destinations: 'destinations',
    activities: 'activities',
    mixed: 'places',
  }[context.intent];

  return `Based on your interest in ${intentLabel} in ${context.area.name}`;
}
