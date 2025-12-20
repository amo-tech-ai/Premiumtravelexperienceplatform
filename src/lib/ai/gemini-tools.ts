/**
 * Gemini Function Calling & Tools
 * Advanced AI capabilities using Gemini's function calling features
 */

import { getGeminiClient } from './gemini-client';
import { getGeocodingService } from '../services/geocoding';
import { getNotificationService } from '../services/notifications';

// --- TYPES ---

export interface FunctionDeclaration {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface FunctionCall {
  name: string;
  args: Record<string, any>;
}

export interface ToolConfig {
  functionDeclarations: FunctionDeclaration[];
}

// --- FUNCTION DECLARATIONS ---

/**
 * Available functions that AI can call
 */
export const AVAILABLE_FUNCTIONS: FunctionDeclaration[] = [
  {
    name: 'search_places',
    description: 'Search for places, restaurants, or activities in a specific location',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'What to search for (e.g., "Italian restaurants", "museums")',
        },
        location: {
          type: 'string',
          description: 'City or area to search in (e.g., "Medellín", "Poblado")',
        },
        radius: {
          type: 'number',
          description: 'Search radius in kilometers (optional)',
        },
      },
      required: ['query', 'location'],
    },
  },
  {
    name: 'get_weather',
    description: 'Get weather forecast for a location and date',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City name',
        },
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format (optional, defaults to today)',
        },
      },
      required: ['location'],
    },
  },
  {
    name: 'calculate_route',
    description: 'Calculate optimal route between multiple locations',
    parameters: {
      type: 'object',
      properties: {
        locations: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of location names or addresses',
        },
        optimize: {
          type: 'boolean',
          description: 'Whether to optimize the route order (default: true)',
        },
      },
      required: ['locations'],
    },
  },
  {
    name: 'check_budget',
    description: 'Check budget status and spending for the trip',
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Budget category (food, activities, stay, transport, or "all")',
        },
      },
    },
  },
  {
    name: 'add_to_itinerary',
    description: 'Add an item to the trip itinerary',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Name of the activity or place',
        },
        type: {
          type: 'string',
          enum: ['activity', 'food', 'stay', 'logistics'],
          description: 'Type of itinerary item',
        },
        day: {
          type: 'number',
          description: 'Day number (0-indexed)',
        },
        time: {
          type: 'string',
          description: 'Time in HH:MM format (e.g., "14:30")',
        },
        duration: {
          type: 'string',
          description: 'Duration (e.g., "2h", "30m", "1h 30m")',
        },
        cost: {
          type: 'number',
          description: 'Estimated cost in USD',
        },
      },
      required: ['title', 'type', 'day'],
    },
  },
  {
    name: 'search_events',
    description: 'Search for events happening in a location during specific dates',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City name',
        },
        startDate: {
          type: 'string',
          description: 'Start date in YYYY-MM-DD format',
        },
        endDate: {
          type: 'string',
          description: 'End date in YYYY-MM-DD format',
        },
        category: {
          type: 'string',
          description: 'Event category (music, art, food, sports, etc.)',
        },
      },
      required: ['location'],
    },
  },
  {
    name: 'get_recommendations',
    description: 'Get AI-powered recommendations based on user preferences',
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['restaurants', 'activities', 'hotels', 'experiences'],
          description: 'Type of recommendations',
        },
        preferences: {
          type: 'string',
          description: 'User preferences or constraints',
        },
        budget: {
          type: 'string',
          enum: ['budget', 'moderate', 'luxury'],
          description: 'Budget level',
        },
      },
      required: ['type'],
    },
  },
  {
    name: 'send_notification',
    description: 'Send a notification to the user',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Notification title',
        },
        message: {
          type: 'string',
          description: 'Notification message',
        },
        priority: {
          type: 'string',
          enum: ['low', 'normal', 'high', 'urgent'],
          description: 'Notification priority',
        },
      },
      required: ['title', 'message'],
    },
  },
  {
    name: 'geocode_location',
    description: 'Get coordinates (latitude/longitude) for an address or place name',
    parameters: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          description: 'Address or place name to geocode',
        },
      },
      required: ['address'],
    },
  },
  {
    name: 'calculate_distance',
    description: 'Calculate distance between two locations',
    parameters: {
      type: 'object',
      properties: {
        from: {
          type: 'string',
          description: 'Starting location',
        },
        to: {
          type: 'string',
          description: 'Destination location',
        },
        unit: {
          type: 'string',
          enum: ['km', 'mi'],
          description: 'Unit of measurement',
        },
      },
      required: ['from', 'to'],
    },
  },
];

// --- FUNCTION IMPLEMENTATIONS ---

/**
 * Execute a function call from AI
 */
export async function executeFunctionCall(functionCall: FunctionCall): Promise<any> {
  const { name, args } = functionCall;

  console.log(`Executing function: ${name}`, args);

  switch (name) {
    case 'search_places':
      return searchPlaces(args.query, args.location, args.radius);

    case 'get_weather':
      return getWeather(args.location, args.date);

    case 'calculate_route':
      return calculateRoute(args.locations, args.optimize);

    case 'check_budget':
      return checkBudget(args.category);

    case 'add_to_itinerary':
      return addToItinerary(args);

    case 'search_events':
      return searchEvents(args.location, args.startDate, args.endDate, args.category);

    case 'get_recommendations':
      return getRecommendations(args.type, args.preferences, args.budget);

    case 'send_notification':
      return sendNotification(args.title, args.message, args.priority);

    case 'geocode_location':
      return geocodeLocation(args.address);

    case 'calculate_distance':
      return calculateDistance(args.from, args.to, args.unit);

    default:
      throw new Error(`Unknown function: ${name}`);
  }
}

// --- FUNCTION IMPLEMENTATIONS ---

async function searchPlaces(query: string, location: string, radius?: number): Promise<any> {
  // In production, this would call a real API (Google Places, Yelp, etc.)
  console.log(`Searching for "${query}" in ${location} (radius: ${radius || 'default'})`);

  // Mock data for demo
  return {
    results: [
      {
        name: `${query} in ${location}`,
        address: `Sample address in ${location}`,
        rating: 4.5,
        priceLevel: 2,
        types: ['restaurant'],
      },
    ],
    count: 1,
  };
}

async function getWeather(location: string, date?: string): Promise<any> {
  // In production, call weather API (OpenWeather, Weather.com, etc.)
  console.log(`Getting weather for ${location} on ${date || 'today'}`);

  return {
    location,
    date: date || new Date().toISOString().split('T')[0],
    temperature: { high: 28, low: 18, unit: 'C' },
    conditions: 'Partly cloudy',
    precipitation: 20,
    humidity: 65,
  };
}

async function calculateRoute(locations: string[], optimize: boolean = true): Promise<any> {
  console.log(`Calculating route for ${locations.length} locations`);

  // In production, use routing API (Google Directions, Mapbox, etc.)
  return {
    locations: optimize ? locations.sort() : locations,
    totalDistance: { value: 15.3, unit: 'km' },
    totalTime: { value: 45, unit: 'minutes' },
    optimized: optimize,
  };
}

async function checkBudget(category?: string): Promise<any> {
  // Get budget from localStorage/context
  const trips = JSON.parse(localStorage.getItem('trips') || '[]');
  const currentTrip = trips[0]; // Simplified - get active trip

  if (!currentTrip) {
    return { error: 'No active trip found' };
  }

  // Calculate spending by category
  const spending = {
    food: 450,
    activities: 320,
    stay: 600,
    transport: 150,
    total: 1520,
  };

  const budget = currentTrip.budget || 2500;

  if (category && category !== 'all') {
    return {
      category,
      spent: spending[category as keyof typeof spending] || 0,
      remaining: budget - spending.total,
    };
  }

  return {
    budget,
    spent: spending.total,
    remaining: budget - spending.total,
    breakdown: spending,
  };
}

async function addToItinerary(item: any): Promise<any> {
  console.log('Adding to itinerary:', item);

  // In production, this would update the trip context/database
  return {
    success: true,
    item: {
      id: `item_${Date.now()}`,
      ...item,
    },
  };
}

async function searchEvents(
  location: string,
  startDate?: string,
  endDate?: string,
  category?: string
): Promise<any> {
  console.log(`Searching events in ${location}`, { startDate, endDate, category });

  // In production, call events API (Ticketmaster, Eventbrite, etc.)
  return {
    events: [
      {
        name: 'Sample Event',
        location,
        date: startDate || new Date().toISOString().split('T')[0],
        category: category || 'general',
      },
    ],
    count: 1,
  };
}

async function getRecommendations(
  type: string,
  preferences?: string,
  budget?: string
): Promise<any> {
  console.log(`Getting ${type} recommendations`, { preferences, budget });

  // In production, use AI + database to generate recommendations
  return {
    type,
    recommendations: [
      {
        name: `Recommended ${type}`,
        rating: 4.7,
        budget: budget || 'moderate',
        matchScore: 0.92,
      },
    ],
  };
}

async function sendNotification(
  title: string,
  message: string,
  priority: string = 'normal'
): Promise<any> {
  const service = getNotificationService();

  service.send(title, message, 'ai_suggestion', {
    priority: priority as any,
  });

  return { success: true };
}

async function geocodeLocation(address: string): Promise<any> {
  const service = getGeocodingService();

  try {
    const result = await service.geocode(address);
    return {
      address: result.address.formatted,
      coordinates: result.coordinates,
      accuracy: result.accuracy,
    };
  } catch (error) {
    return {
      error: 'Geocoding failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function calculateDistance(from: string, to: string, unit: string = 'km'): Promise<any> {
  const service = getGeocodingService();

  try {
    const [fromResult, toResult] = await Promise.all([
      service.geocode(from),
      service.geocode(to),
    ]);

    const distance = calculateDistanceBetweenCoords(
      fromResult.coordinates,
      toResult.coordinates,
      unit as 'km' | 'mi'
    );

    return {
      from,
      to,
      distance: {
        value: distance,
        unit,
      },
    };
  } catch (error) {
    return {
      error: 'Distance calculation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function calculateDistanceBetweenCoords(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number },
  unit: 'km' | 'mi' = 'km'
): number {
  const R = unit === 'km' ? 6371 : 3959;
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// --- AI INTERACTION WITH TOOLS ---

/**
 * Generate response with function calling support
 */
export async function generateWithTools(
  prompt: string,
  availableFunctions: FunctionDeclaration[] = AVAILABLE_FUNCTIONS
): Promise<{
  text: string;
  functionCalls?: FunctionCall[];
  functionResults?: any[];
}> {
  const client = getGeminiClient();

  if (!client.isReady()) {
    // Fallback to regular generation
    const response = await client.generate(prompt);
    return { text: response.text };
  }

  // For now, return regular response
  // In production with Gemini Pro, you'd use the function calling API
  const response = await client.generate(
    `${prompt}\n\nAvailable functions: ${availableFunctions.map((f) => f.name).join(', ')}`
  );

  return { text: response.text };
}

/**
 * Multi-turn conversation with function calling
 */
export async function chatWithTools(
  messages: Array<{ role: 'user' | 'model'; content: string }>,
  availableFunctions: FunctionDeclaration[] = AVAILABLE_FUNCTIONS
): Promise<{
  response: string;
  functionCalls?: FunctionCall[];
  functionResults?: any[];
}> {
  const client = getGeminiClient();

  // Convert messages to Gemini format
  const geminiMessages = messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  const response = await client.chat(geminiMessages);

  return { response: response.text };
}

export default {
  AVAILABLE_FUNCTIONS,
  executeFunctionCall,
  generateWithTools,
  chatWithTools,
};
