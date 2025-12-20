/**
 * Event Curator Agent
 * Discovers and recommends events, concerts, festivals, and local happenings
 */

import { BaseAgent } from './base-agent';
import { getGeminiClient } from '../gemini-client';
import type { AgentRequest, AgentResponse, AgentContext } from '../types';

export class EventCuratorAgent extends BaseAgent {
  constructor() {
    super({
      type: 'event_curator',
      name: 'Event Curator',
      description: 'Discovers events, concerts, festivals, and local happenings based on interests',
      capabilities: [
        'event_discovery',
        'ticket_availability',
        'event_recommendations',
        'category_filtering',
        'trending_events',
      ],
      priority: 5,
      enabled: true,
    });
  }

  protected async processRequest(request: AgentRequest, context: AgentContext): Promise<any> {
    const { intent, parameters } = request;

    let result: any;

    switch (intent) {
      case 'discover_events':
        result = await this.discoverEvents(parameters);
        break;

      case 'get_recommendations':
        result = await this.recommendEvents(parameters);
        break;

      case 'check_tickets':
        result = await this.checkTickets(parameters);
        break;

      default:
        // General event query
        result = await this.handleGeneralQuery(parameters);
    }

    return result;
  }

  /**
   * Discover events based on criteria
   */
  private async discoverEvents(params: any): Promise<any> {
    const {
      location = 'Medellín',
      category,
      dateRange,
      priceRange,
      interests,
    } = params;

    // Check if Gemini can help with personalized discovery
    const gemini = getGeminiClient();
    if (gemini.isReady() && (params.message || interests)) {
      try {
        return await this.discoverEventsWithAI(params);
      } catch (error) {
        console.error('[EventCurator] AI event discovery failed:', error);
      }
    }

    // Fallback: Mock event discovery
    return this.getMockEvents({ location, category, dateRange, priceRange });
  }

  /**
   * AI-powered event discovery
   */
  private async discoverEventsWithAI(params: any): Promise<any> {
    const gemini = getGeminiClient();

    const prompt = `Discover events for: "${params.message || 'user interests'}"

Location: ${params.location || 'Medellín'}
Categories: ${params.category ? params.category.join(', ') : 'all'}
Date range: ${params.dateRange || 'this week'}
Price range: ${params.priceRange || 'any'}
Interests: ${params.interests ? params.interests.join(', ') : 'general'}

Provide 5-10 event recommendations with:
- Event name
- Category (music, art, food, cultural, sports, nightlife)
- Date/time
- Venue
- Price
- Description
- Why it matches user interests

Format as JSON array.`;

    const response = await gemini.generateContent(prompt);

    try {
      const events = JSON.parse(response);
      return {
        success: true,
        events,
        count: events.length,
        method: 'ai',
      };
    } catch {
      return this.getMockEvents(params);
    }
  }

  /**
   * Get mock event data
   */
  private getMockEvents(params: any): any {
    const { location, category } = params;

    const allEvents = [
      {
        id: 'event_1',
        title: 'Medellín Flower Festival Parade',
        category: 'cultural',
        date: 'Dec 22, 2024',
        time: '10:00 AM',
        venue: 'Avenida Guayabal',
        location: location || 'Medellín',
        price: 25,
        priceRange: '$',
        image: 'https://images.unsplash.com/photo-1596707328607-28d15a97573d?q=80&w=400',
        description: 'Annual flower parade celebrating Medellín\'s culture',
        popularity: 'Almost sold out',
        rating: 4.9,
        attendees: '50,000+',
        tags: ['cultural', 'family-friendly', 'outdoor'],
        ticketsAvailable: true,
      },
      {
        id: 'event_2',
        title: 'Karol G: Mañana Será Bonito Fest',
        category: 'music',
        date: 'Dec 28, 2024',
        time: '7:00 PM',
        venue: 'Atanasio Girardot Stadium',
        location: location || 'Medellín',
        price: 80,
        priceRange: '$$$',
        image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400',
        description: 'Reggaeton superstar live in concert',
        popularity: 'Selling fast',
        rating: 5.0,
        attendees: '40,000',
        tags: ['music', 'reggaeton', 'concert'],
        ticketsAvailable: true,
      },
      {
        id: 'event_3',
        title: 'Salsa Night at Eslabón Prendido',
        category: 'nightlife',
        date: 'Tonight',
        time: '9:00 PM',
        venue: 'Eslabón Prendido',
        location: 'Centro, Medellín',
        price: 10,
        priceRange: '$',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400',
        description: 'Authentic salsa dancing with live band',
        popularity: 'Popular spot',
        rating: 4.7,
        attendees: '200-300',
        tags: ['nightlife', 'salsa', 'dancing'],
        ticketsAvailable: true,
      },
      {
        id: 'event_4',
        title: 'Contemporary Art Exhibition',
        category: 'art',
        date: 'Dec 20-30, 2024',
        time: '10:00 AM - 6:00 PM',
        venue: 'MAMM - Museum of Modern Art',
        location: 'Ciudad del Río, Medellín',
        price: 12,
        priceRange: '$',
        image: 'https://images.unsplash.com/photo-1531243625752-6c3c21d85d7e?q=80&w=400',
        description: 'Latest works from Colombian contemporary artists',
        popularity: 'Hidden gem',
        rating: 4.6,
        attendees: 'Varies',
        tags: ['art', 'culture', 'indoor'],
        ticketsAvailable: true,
      },
      {
        id: 'event_5',
        title: 'Street Food Festival',
        category: 'food',
        date: 'Dec 21-22, 2024',
        time: '12:00 PM - 10:00 PM',
        venue: 'Parque Lleras',
        location: 'El Poblado, Medellín',
        price: 0,
        priceRange: 'Free entry',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400',
        description: 'Taste the best street food from across Colombia',
        popularity: 'Trending',
        rating: 4.8,
        attendees: '10,000+',
        tags: ['food', 'festival', 'outdoor'],
        ticketsAvailable: false,
      },
      {
        id: 'event_6',
        title: 'Fútbol: Atlético Nacional vs Millonarios',
        category: 'sports',
        date: 'Dec 23, 2024',
        time: '6:00 PM',
        venue: 'Atanasio Girardot Stadium',
        location: 'Medellín',
        price: 35,
        priceRange: '$$',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400',
        description: 'Colombian league rivalry match',
        popularity: 'High demand',
        rating: 4.7,
        attendees: '30,000',
        tags: ['sports', 'soccer', 'outdoor'],
        ticketsAvailable: true,
      },
      {
        id: 'event_7',
        title: 'Comedy Night in English',
        category: 'entertainment',
        date: 'Dec 24, 2024',
        time: '8:00 PM',
        venue: 'Hard Rock Cafe',
        location: 'El Poblado, Medellín',
        price: 20,
        priceRange: '$',
        image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=400',
        description: 'Stand-up comedy show with international comedians',
        popularity: 'Great for expats',
        rating: 4.5,
        attendees: '100',
        tags: ['comedy', 'english', 'indoor'],
        ticketsAvailable: true,
      },
    ];

    // Filter by category if specified
    let filtered = allEvents;
    if (category && category.length > 0) {
      filtered = allEvents.filter(event => 
        category.some((cat: string) => 
          event.category === cat.toLowerCase() || 
          event.tags.includes(cat.toLowerCase())
        )
      );
    }

    return {
      success: true,
      events: filtered,
      count: filtered.length,
      location,
      method: 'mock',
    };
  }

  /**
   * Recommend events based on user preferences
   */
  private async recommendEvents(params: any): Promise<any> {
    const {
      userInterests,
      tripItinerary,
      location = 'Medellín',
    } = params;

    // Check if Gemini can personalize
    const gemini = getGeminiClient();
    if (gemini.isReady() && (userInterests || tripItinerary)) {
      try {
        return await this.recommendEventsWithAI(params);
      } catch (error) {
        console.error('[EventCurator] AI recommendations failed:', error);
      }
    }

    // Fallback: Basic recommendations
    const allEvents = await this.getMockEvents({ location });
    
    return {
      success: true,
      recommendations: allEvents.events.slice(0, 5),
      reason: 'Popular events in your area',
      method: 'mock',
    };
  }

  /**
   * AI-powered event recommendations
   */
  private async recommendEventsWithAI(params: any): Promise<any> {
    const gemini = getGeminiClient();

    const prompt = `Recommend events for a traveler:

User interests: ${params.userInterests ? params.userInterests.join(', ') : 'general'}
Current itinerary: ${params.tripItinerary ? JSON.stringify(params.tripItinerary) : 'flexible'}
Location: ${params.location || 'Medellín'}
Travel dates: ${params.dates || 'this week'}

Analyze:
1. What events match their interests
2. What fits in their schedule
3. What adds variety to their trip

Provide 5 personalized recommendations with:
- Event name
- Why it's a good fit
- Best time to go
- How to integrate with current plans

Format as JSON.`;

    const response = await gemini.generateContent(prompt);

    try {
      const recommendations = JSON.parse(response);
      return {
        success: true,
        recommendations,
        personalized: true,
        method: 'ai',
      };
    } catch {
      // Fallback
      const allEvents = await this.getMockEvents(params);
      return {
        success: true,
        recommendations: allEvents.events.slice(0, 5),
        method: 'mock',
      };
    }
  }

  /**
   * Check ticket availability
   */
  private async checkTickets(params: any): Promise<any> {
    const { eventId, date, quantity = 1 } = params;

    // Mock ticket check (would integrate with Ticketmaster, Eventbrite, etc.)
    const available = Math.random() > 0.2; // 80% availability

    return {
      success: true,
      eventId,
      available,
      ticketsRemaining: available ? Math.floor(Math.random() * 500) + 50 : 0,
      priceRange: {
        min: 25,
        max: 150,
      },
      date,
      quantity,
      purchaseUrl: available ? `https://tickets.example.com/${eventId}` : null,
    };
  }

  /**
   * Handle general event query
   */
  private async handleGeneralQuery(params: any): Promise<any> {
    const { message } = params;

    if (!message) {
      return {
        success: false,
        message: 'No query provided',
      };
    }

    // Use Gemini to understand intent
    const gemini = getGeminiClient();
    if (gemini.isReady()) {
      try {
        const prompt = `User event query: "${message}"

Determine:
1. What type of events are they interested in?
2. What's their timeframe?
3. Any specific preferences?

Extract: { categories, dateRange, location, interests }

Format as JSON.`;

        const response = await gemini.generateContent(prompt);
        const parsed = JSON.parse(response);

        // Use extracted info to discover events
        return this.discoverEvents({
          ...parsed,
          message,
        });
      } catch (error) {
        console.error('[EventCurator] General query failed:', error);
      }
    }

    // Fallback: Show all events
    return this.getMockEvents({ location: 'Medellín' });
  }

  // --- SUGGESTION GENERATORS ---

  private generateEventSuggestions(result: any): any[] {
    if (!result.success || !result.events) return [];

    return result.events.slice(0, 5).map((event: any) => ({
      type: 'event',
      priority: event.popularity === 'Almost sold out' ? 'high' : 'normal',
      title: event.title,
      description: `${event.date} • ${event.venue} • ${event.priceRange}`,
      action: 'view_event',
      data: event,
      metadata: {
        category: event.category,
        ticketsAvailable: event.ticketsAvailable,
      },
    }));
  }

  private generateRecommendationSuggestions(result: any): any[] {
    if (!result.success || !result.recommendations) return [];

    return result.recommendations.map((event: any) => ({
      type: 'recommendation',
      priority: 'high',
      title: event.title || event.name,
      description: event.reason || event.description,
      action: 'add_to_trip',
      data: event,
    }));
  }

  private generateTicketSuggestions(result: any): any[] {
    if (!result.success) return [];

    if (result.available) {
      return [{
        type: 'tickets',
        priority: 'high',
        title: 'Tickets Available',
        description: `${result.ticketsRemaining} tickets remaining`,
        action: 'purchase_tickets',
        data: result,
      }];
    } else {
      return [{
        type: 'info',
        priority: 'normal',
        title: 'Sold Out',
        description: 'Check back later or find similar events',
        action: 'find_alternatives',
      }];
    }
  }

  private generateGeneralSuggestions(result: any): any[] {
    if (!result.success || !result.events) return [];

    const trending = result.events.filter((e: any) => 
      e.popularity === 'Trending' || e.popularity === 'Almost sold out'
    );

    const suggestions: any[] = [];

    if (trending.length > 0) {
      suggestions.push({
        type: 'trending',
        priority: 'high',
        title: 'Hot Events This Week',
        description: `${trending.length} trending events`,
        action: 'view_trending',
        data: trending,
      });
    }

    // Add category suggestions
    const categories = [...new Set(result.events.map((e: any) => e.category))];
    categories.slice(0, 3).forEach(cat => {
      const count = result.events.filter((e: any) => e.category === cat).length;
      suggestions.push({
        type: 'category',
        priority: 'low',
        title: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Events`,
        description: `${count} events available`,
        action: 'filter_category',
        data: { category: cat },
      });
    });

    return suggestions;
  }
}

// Singleton instance
let curatorInstance: EventCuratorAgent | null = null;

export function getEventCurator(): EventCuratorAgent {
  if (!curatorInstance) {
    curatorInstance = new EventCuratorAgent();
  }
  return curatorInstance;
}

export default EventCuratorAgent;