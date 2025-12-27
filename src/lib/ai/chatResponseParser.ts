/**
 * CHAT RESPONSE PARSER
 * 
 * Detects and parses AI recommendations from chat responses
 * 
 * @see /docs/FIGMA-MAKE-PROMPTS.md (PROMPT 1)
 */

import { ExplorationContext, ExplorationResult, ExplorationIntent } from '../../context/types/ExplorationTypes';
import { createContextId } from '../../context/types/ExplorationTypes';
import { explorationStorage } from '../../context/storage/ExplorationStorage';

// ============================================================================
// DETECTION
// ============================================================================

/**
 * Detect if response contains recommendations
 */
export function hasRecommendations(response: string): boolean {
  const keywords = [
    'restaurant',
    'hotel',
    'event',
    'activity',
    'place to stay',
    'thing to do',
    'recommend',
    'suggest',
    'check out',
    'top picks',
    'best',
  ];

  const lower = response.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword));
}

/**
 * Detect intent from response
 */
export function detectIntentFromResponse(response: string): ExplorationIntent {
  const lower = response.toLowerCase();

  if (
    lower.includes('restaurant') ||
    lower.includes('food') ||
    lower.includes('eat') ||
    lower.includes('dining')
  ) {
    return 'restaurants';
  }

  if (lower.includes('event') || lower.includes('nightlife') || lower.includes('concert')) {
    return 'events';
  }

  if (
    lower.includes('hotel') ||
    lower.includes('stay') ||
    lower.includes('accommodation') ||
    lower.includes('airbnb')
  ) {
    return 'rentals';
  }

  if (lower.includes('activity') || lower.includes('thing to do') || lower.includes('attraction')) {
    return 'activities';
  }

  return 'mixed';
}

// ============================================================================
// PARSING
// ============================================================================

/**
 * Parse AI response into recommendation context
 * 
 * For MVP, creates mock data structure
 * In production, would parse actual API responses
 */
export function parseRecommendationResponse(
  response: string,
  userQuery: string
): {
  success: boolean;
  context?: ExplorationContext;
  contextId?: string;
  topResults?: ExplorationResult[];
  error?: string;
} {
  try {
    // Check if has recommendations
    if (!hasRecommendations(response)) {
      return { success: false, error: 'No recommendations detected' };
    }

    // Detect intent
    const intent = detectIntentFromResponse(response);

    // Extract area (simplified - would use NER in production)
    const areaMatch = response.match(/in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
    const areaName = areaMatch ? areaMatch[1] : 'the area';

    // For MVP: Create mock results based on intent
    // In production: Parse actual structured data from AI
    const mockResults = createMockResults(intent, areaName);

    // Create context
    const context: ExplorationContext = {
      id: createContextId(),
      source: 'ai',
      intent,
      area: {
        name: areaName,
        lat: 6.2, // Mock coordinates
        lng: -75.6,
      },
      radius: 'short_drive',
      timeRelevance: {
        type: 'flexible',
      },
      primaryResults: mockResults,
      pins: mockResults.map((r) => ({
        id: `pin_${r.id}`,
        entityId: r.id,
        entityType: intent,
        lat: r.location.lat,
        lng: r.location.lng,
        title: r.name,
        isPrimary: true,
      })),
      ranking: {
        algorithm: 'ai_recommended',
        confidence: 'high',
        reasoning: extractReasoning(response),
        factors: ['rating', 'distance', 'popularity'],
      },
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    };

    // Store context
    explorationStorage.store(context);

    // Extract top 3
    const topResults = mockResults.slice(0, 3);

    return {
      success: true,
      context,
      contextId: context.id,
      topResults,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse recommendations',
    };
  }
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Extract reasoning from response
 */
function extractReasoning(response: string): string {
  // Look for reasoning phrases
  const phrases = [
    'because',
    'since',
    'as',
    'based on',
    'considering',
    'given',
    'known for',
    'perfect for',
  ];

  for (const phrase of phrases) {
    const index = response.toLowerCase().indexOf(phrase);
    if (index !== -1) {
      // Extract sentence containing reasoning
      const start = response.lastIndexOf('.', index) + 1;
      const end = response.indexOf('.', index + phrase.length);
      if (end !== -1) {
        return response.substring(start, end + 1).trim();
      }
    }
  }

  return 'Selected based on ratings, reviews, and location';
}

/**
 * Create mock results
 * 
 * In production, this would parse actual API responses
 * For MVP, generates structured mock data
 */
function createMockResults(intent: ExplorationIntent, area: string): ExplorationResult[] {
  const mockData = {
    restaurants: [
      {
        name: 'Carmen',
        description: 'Upscale Colombian fusion in historic mansion',
        rating: 4.8,
        priceLevel: 3,
      },
      {
        name: 'El Cielo',
        description: 'Molecular gastronomy with sensory experience',
        rating: 4.9,
        priceLevel: 4,
      },
      {
        name: 'Mondongo\'s',
        description: 'Traditional Colombian comfort food',
        rating: 4.6,
        priceLevel: 2,
      },
      {
        name: 'Oci.Mde',
        description: 'Contemporary Asian-Latin fusion',
        rating: 4.7,
        priceLevel: 3,
      },
      {
        name: 'Hatoviejo',
        description: 'Authentic paisa cuisine and ambiance',
        rating: 4.5,
        priceLevel: 2,
      },
    ],
    events: [
      {
        name: 'Parque Lleras Nightlife',
        description: 'Vibrant bar and club scene',
        rating: 4.3,
        priceLevel: 3,
      },
      {
        name: 'Salsa Dancing at Son Havana',
        description: 'Live salsa music and dance lessons',
        rating: 4.6,
        priceLevel: 2,
      },
      {
        name: 'Rooftop Bar Envy',
        description: 'Sky-high cocktails with city views',
        rating: 4.7,
        priceLevel: 3,
      },
    ],
    rentals: [
      {
        name: 'Modern Poblado Apartment',
        description: 'Sleek 2BR with rooftop terrace',
        rating: 4.8,
        priceLevel: 3,
      },
      {
        name: 'Charming Laureles Studio',
        description: 'Cozy space in trendy neighborhood',
        rating: 4.6,
        priceLevel: 2,
      },
    ],
    activities: [
      {
        name: 'Comuna 13 Street Art Tour',
        description: 'Guided tour of transformation story',
        rating: 4.9,
        priceLevel: 1,
      },
      {
        name: 'Paragliding in San Felix',
        description: 'Tandem flights with valley views',
        rating: 4.8,
        priceLevel: 3,
      },
    ],
  };

  const data = mockData[intent] || mockData.restaurants;

  return data.map((item, index) => ({
    id: `${intent}_${index}`,
    name: item.name,
    type: intent,
    description: item.description,
    location: {
      address: `${area}, Medellín`,
      lat: 6.2 + (index * 0.01),
      lng: -75.6 + (index * 0.01),
    },
    rating: item.rating,
    priceLevel: item.priceLevel,
    imageUrl: undefined, // Would come from API
    distance: (index + 1) * 500, // meters
  }));
}

/**
 * Generate "View all" CTA text
 */
export function generateViewAllText(
  context: ExplorationContext
): string {
  const total = context.primaryResults.length;
  const intentLabel = {
    restaurants: 'restaurants',
    events: 'events',
    rentals: 'places to stay',
    activities: 'activities',
    destinations: 'destinations',
    mixed: 'recommendations',
  }[context.intent];

  return `View all ${total} ${intentLabel} on the map`;
}