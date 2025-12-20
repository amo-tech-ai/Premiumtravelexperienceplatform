/**
 * Local Scout Agent
 * Discovers local events, activities, and experiences using AI + search
 */

import { BaseAgent } from './base-agent';
import type {
  AgentRequest,
  AgentContext,
  AgentSuggestion,
  EventDiscoveryRequest,
  EventResult,
} from '../types';

export class LocalScoutAgent extends BaseAgent {
  constructor() {
    super({
      type: 'local_scout',
      name: 'Local Scout',
      description: 'Discovers local events, festivals, concerts, and activities',
      capabilities: [
        {
          name: 'Event Discovery',
          description: 'Find events happening in any city',
          examples: [
            'What events are happening this weekend?',
            'Find concerts in Medellín',
            'Show me festivals in December',
          ],
        },
        {
          name: 'Activity Recommendations',
          description: 'Suggest activities based on preferences',
          examples: [
            'What should I do on a rainy day?',
            'Outdoor activities for families',
            'Romantic date ideas',
          ],
        },
      ],
      priority: 1,
      enabled: true,
    });
  }

  /**
   * Process event discovery request
   */
  protected async processRequest(
    request: AgentRequest,
    context: AgentContext
  ): Promise<EventResult[]> {
    // Extract search parameters from request
    const searchParams = this.extractSearchParams(request, context);

    // Use Gemini to discover events
    if (this.gemini.isReady()) {
      return await this.discoverEventsWithAI(searchParams);
    } else {
      // Fallback to mock data
      return this.getMockEvents(searchParams);
    }
  }

  /**
   * Extract search parameters from request
   */
  private extractSearchParams(
    request: AgentRequest,
    context: AgentContext
  ): EventDiscoveryRequest {
    const params = request.parameters || {};

    return {
      location: context.location?.city || params.location || 'Medellín',
      startDate: context.dates?.startDate || params.startDate || new Date().toISOString(),
      endDate: context.dates?.endDate || params.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      categories: params.categories || [],
      maxResults: params.maxResults || 10,
      priceRange: params.priceRange,
    };
  }

  /**
   * Discover events using Gemini AI with Google Search Grounding
   */
  private async discoverEventsWithAI(
    params: EventDiscoveryRequest
  ): Promise<EventResult[]> {
    const prompt = `Find real events and activities in ${params.location} from ${params.startDate} to ${params.endDate}.

Search for:
- Concerts and live music
- Festivals and cultural events
- Art exhibitions and gallery openings
- Food and dining events
- Outdoor activities and tours
- Nightlife and entertainment

Return a JSON array of events with this structure:
[
  {
    "title": "Event name",
    "description": "Brief description",
    "category": "music|festival|art|food|outdoor|nightlife",
    "date": "YYYY-MM-DD",
    "time": "HH:MM",
    "duration": "2h",
    "location": {
      "name": "Venue name",
      "address": "Full address"
    },
    "price": {
      "amount": 0,
      "currency": "USD",
      "type": "free|paid|donation"
    },
    "image": "https://...",
    "url": "https://...",
    "source": "Website name"
  }
]

Focus on real, verifiable events. Include free and paid events. Provide accurate dates and locations.`;

    try {
      const response = await this.gemini.generate(prompt, {
        temperature: 0.3, // Lower temperature for factual responses
      });

      // Parse JSON from response
      const events = this.parseEventsFromResponse(response.text);

      // Add relevance scores
      return events.map((event, index) => ({
        ...event,
        id: `event_${Date.now()}_${index}`,
        relevanceScore: this.calculateRelevance(event, params),
      }));
    } catch (error) {
      console.error('[LocalScout] AI discovery error:', error);
      return this.getMockEvents(params);
    }
  }

  /**
   * Parse events from AI response
   */
  private parseEventsFromResponse(text: string): Partial<EventResult>[] {
    try {
      // Try to extract JSON array from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // If no JSON found, try to parse line by line
      const lines = text.split('\n').filter(line => line.trim());
      const events: Partial<EventResult>[] = [];

      let currentEvent: any = null;

      for (const line of lines) {
        if (line.includes('"title"') || line.includes('title:')) {
          if (currentEvent) events.push(currentEvent);
          currentEvent = {};
        }

        // Basic parsing (rough)
        if (currentEvent) {
          if (line.includes('title')) {
            const match = line.match(/["']([^"']+)["']/);
            if (match) currentEvent.title = match[1];
          }
          // Add more parsing logic as needed
        }
      }

      if (currentEvent) events.push(currentEvent);

      return events.length > 0 ? events : [];
    } catch (error) {
      console.error('[LocalScout] Parse error:', error);
      return [];
    }
  }

  /**
   * Calculate relevance score for an event
   */
  private calculateRelevance(event: Partial<EventResult>, params: EventDiscoveryRequest): number {
    let score = 0.5; // Base score

    // Category match
    if (params.categories && params.categories.length > 0) {
      if (event.category && params.categories.includes(event.category)) {
        score += 0.3;
      }
    }

    // Price range match
    if (params.priceRange && event.price) {
      const amount = event.price.amount || 0;
      if (amount >= params.priceRange.min && amount <= params.priceRange.max) {
        score += 0.2;
      }
    }

    // Free events get a boost
    if (event.price?.type === 'free') {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Generate suggestions based on discovered events
   */
  protected generateSuggestions(events: EventResult[]): AgentSuggestion[] {
    const suggestions: AgentSuggestion[] = [];

    if (events.length === 0) {
      suggestions.push({
        id: 'no_events',
        type: 'information',
        title: 'No events found',
        description: 'Try broadening your search criteria or dates',
        priority: 'normal',
      });
      return suggestions;
    }

    // Suggest free events
    const freeEvents = events.filter(e => e.price?.type === 'free');
    if (freeEvents.length > 0) {
      suggestions.push({
        id: 'free_events',
        type: 'information',
        title: `${freeEvents.length} Free Events`,
        description: 'Check out these events at no cost',
        priority: 'high',
      });
    }

    // Suggest adding to itinerary
    if (events.length > 0) {
      suggestions.push({
        id: 'add_to_itinerary',
        type: 'action',
        title: 'Add to Itinerary',
        description: 'Add these events to your trip plan',
        action: {
          label: 'Add All',
          handler: async () => {
            this.bus.emit('itinerary:add_events', { events });
          },
        },
        priority: 'high',
      });
    }

    return suggestions;
  }

  /**
   * Mock events for fallback/demo
   */
  private getMockEvents(params: EventDiscoveryRequest): EventResult[] {
    const mockEvents: EventResult[] = [
      {
        id: 'mock_1',
        title: 'Salsa Night at Eslabon Prendido',
        description: 'Live salsa music and dancing. All levels welcome. Free dance lessons at 8pm.',
        category: 'nightlife',
        date: new Date().toISOString().split('T')[0],
        time: '20:00',
        duration: '4h',
        location: {
          name: 'Eslabon Prendido',
          address: 'Carrera 35 #8A-52, El Poblado, Medellín',
          coordinates: { lat: 6.2088, lng: -75.5673 },
        },
        price: {
          amount: 0,
          currency: 'USD',
          type: 'free',
        },
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800',
        relevanceScore: 0.9,
        source: 'Local Guide',
      },
      {
        id: 'mock_2',
        title: 'Medellín Food Festival',
        description: 'Taste the best of Colombian cuisine. Over 50 vendors, live music, and cooking demonstrations.',
        category: 'food',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '12:00',
        duration: '8h',
        location: {
          name: 'Parque Lleras',
          address: 'Parque Lleras, El Poblado, Medellín',
          coordinates: { lat: 6.2097, lng: -75.5669 },
        },
        price: {
          amount: 15,
          currency: 'USD',
          type: 'paid',
        },
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800',
        relevanceScore: 0.85,
        source: 'Events.com',
      },
      {
        id: 'mock_3',
        title: 'Comuna 13 Street Art Tour',
        description: 'Guided walking tour through the famous graffiti district. Learn the history and meet local artists.',
        category: 'art',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        duration: '3h',
        location: {
          name: 'Comuna 13',
          address: 'San Javier, Medellín',
          coordinates: { lat: 6.2442, lng: -75.5998 },
        },
        price: {
          amount: 25,
          currency: 'USD',
          type: 'paid',
        },
        image: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80&w=800',
        relevanceScore: 0.95,
        source: 'TourProvider',
      },
      {
        id: 'mock_4',
        title: 'Live Jazz at Teatro Metropolitano',
        description: 'International jazz ensemble performing contemporary and classic pieces.',
        category: 'music',
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '19:30',
        duration: '2.5h',
        location: {
          name: 'Teatro Metropolitano',
          address: 'Calle 41 #57-30, La Candelaria, Medellín',
          coordinates: { lat: 6.2476, lng: -75.5675 },
        },
        price: {
          amount: 35,
          currency: 'USD',
          type: 'paid',
        },
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800',
        relevanceScore: 0.8,
        source: 'Teatro Metropolitano',
      },
      {
        id: 'mock_5',
        title: 'Guatapé Day Trip & Rock Climbing',
        description: 'Full day excursion to the colorful town of Guatapé. Climb El Peñol rock for panoramic views.',
        category: 'outdoor',
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '08:00',
        duration: '10h',
        location: {
          name: 'Guatapé',
          address: 'Guatapé, Antioquia',
          coordinates: { lat: 6.2318, lng: -75.1613 },
        },
        price: {
          amount: 85,
          currency: 'USD',
          type: 'paid',
        },
        image: 'https://images.unsplash.com/photo-1596395819057-d37e954c7d0d?q=80&w=800',
        relevanceScore: 0.9,
        source: 'Adventure Tours',
      },
    ];

    // Filter by date range if specified
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);

    return mockEvents
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= startDate && eventDate <= endDate;
      })
      .slice(0, params.maxResults || 10);
  }
}

// Create singleton instance
let localScoutInstance: LocalScoutAgent | null = null;

export function getLocalScout(): LocalScoutAgent {
  if (!localScoutInstance) {
    localScoutInstance = new LocalScoutAgent();
  }
  return localScoutInstance;
}

export default LocalScoutAgent;
