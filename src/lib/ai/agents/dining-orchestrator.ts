/**
 * Dining Orchestrator Agent
 * Discovers restaurants and dining experiences using AI
 */

import { BaseAgent } from './base-agent';
import type {
  AgentRequest,
  AgentContext,
  AgentSuggestion,
  DiningRequest,
  RestaurantResult,
} from '../types';

export class DiningOrchestratorAgent extends BaseAgent {
  constructor() {
    super({
      type: 'dining_orchestrator',
      name: 'Dining Orchestrator',
      description: 'Finds restaurants, cafes, and dining experiences',
      capabilities: [
        {
          name: 'Restaurant Search',
          description: 'Find restaurants by cuisine, price, location',
          examples: [
            'Where should I eat in Poblado?',
            'Find Italian restaurants under $50',
            'Vegan-friendly brunch spots',
          ],
        },
        {
          name: 'Dietary Filtering',
          description: 'Filter by dietary preferences',
          examples: [
            'Gluten-free options',
            'Vegetarian restaurants',
            'Halal food',
          ],
        },
      ],
      priority: 2,
      enabled: true,
    });
  }

  /**
   * Process dining request
   */
  protected async processRequest(
    request: AgentRequest,
    context: AgentContext
  ): Promise<RestaurantResult[]> {
    const searchParams = this.extractSearchParams(request, context);

    if (this.gemini.isReady()) {
      return await this.findRestaurantsWithAI(searchParams);
    } else {
      return this.getMockRestaurants(searchParams);
    }
  }

  /**
   * Extract search parameters
   */
  private extractSearchParams(
    request: AgentRequest,
    context: AgentContext
  ): DiningRequest {
    const params = request.parameters || {};

    return {
      location: context.location?.city || params.location || 'Medellín',
      cuisine: params.cuisine || [],
      priceRange: params.priceRange || 'moderate',
      dietary: context.preferences?.dietaryRestrictions || params.dietary || [],
      mealType: params.mealType,
      occasion: params.occasion,
      maxResults: params.maxResults || 10,
    };
  }

  /**
   * Find restaurants using Gemini AI
   */
  private async findRestaurantsWithAI(
    params: DiningRequest
  ): Promise<RestaurantResult[]> {
    const cuisineStr = params.cuisine && params.cuisine.length > 0 
      ? params.cuisine.join(', ') 
      : 'any cuisine';
    
    const dietaryStr = params.dietary && params.dietary.length > 0
      ? `Dietary: ${params.dietary.join(', ')}`
      : '';

    const prompt = `Find the best restaurants in ${params.location} with the following criteria:

Cuisine: ${cuisineStr}
Price Range: ${params.priceRange}
${dietaryStr}
${params.mealType ? `Meal Type: ${params.mealType}` : ''}
${params.occasion ? `Occasion: ${params.occasion}` : ''}

Return a JSON array of restaurants with this structure:
[
  {
    "name": "Restaurant name",
    "description": "Brief description",
    "cuisine": ["cuisine1", "cuisine2"],
    "priceLevel": 1-4,
    "rating": 4.5,
    "reviewCount": 250,
    "location": {
      "address": "Full address",
      "neighborhood": "Neighborhood name"
    },
    "hours": {
      "open": "12:00",
      "close": "22:00"
    },
    "phone": "+57 xxx xxx xxxx",
    "features": ["outdoor seating", "live music", "rooftop"],
    "dietaryOptions": ["vegetarian", "gluten-free"]
  }
]

Focus on real, highly-rated restaurants. Include diverse options across price ranges.`;

    try {
      const response = await this.gemini.generate(prompt, {
        temperature: 0.3,
      });

      const restaurants = this.parseRestaurantsFromResponse(response.text);

      return restaurants.map((restaurant, index) => ({
        ...restaurant,
        id: `restaurant_${Date.now()}_${index}`,
        relevanceScore: this.calculateRelevance(restaurant, params),
      }));
    } catch (error) {
      console.error('[DiningOrchestrator] AI search error:', error);
      return this.getMockRestaurants(params);
    }
  }

  /**
   * Parse restaurants from AI response
   */
  private parseRestaurantsFromResponse(text: string): Partial<RestaurantResult>[] {
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      console.error('[DiningOrchestrator] Parse error:', error);
      return [];
    }
  }

  /**
   * Calculate relevance score
   */
  private calculateRelevance(
    restaurant: Partial<RestaurantResult>,
    params: DiningRequest
  ): number {
    let score = 0.5;

    // Cuisine match
    if (params.cuisine && params.cuisine.length > 0 && restaurant.cuisine) {
      const matches = restaurant.cuisine.filter(c => 
        params.cuisine!.some(pc => c.toLowerCase().includes(pc.toLowerCase()))
      );
      score += matches.length > 0 ? 0.3 : 0;
    }

    // Price range match
    if (params.priceRange && restaurant.priceLevel) {
      const targetPrice = params.priceRange === 'budget' ? 1 
        : params.priceRange === 'moderate' ? 2 
        : params.priceRange === 'luxury' ? 4 : 3;
      
      const priceDiff = Math.abs(restaurant.priceLevel - targetPrice);
      score += priceDiff === 0 ? 0.2 : priceDiff === 1 ? 0.1 : 0;
    }

    // Dietary options match
    if (params.dietary && params.dietary.length > 0 && restaurant.dietaryOptions) {
      const matches = restaurant.dietaryOptions.filter(d => 
        params.dietary!.includes(d)
      );
      score += matches.length * 0.1;
    }

    // Rating boost
    if (restaurant.rating && restaurant.rating >= 4.5) {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Generate suggestions
   */
  protected generateSuggestions(restaurants: RestaurantResult[]): AgentSuggestion[] {
    const suggestions: AgentSuggestion[] = [];

    if (restaurants.length === 0) {
      suggestions.push({
        id: 'no_restaurants',
        type: 'information',
        title: 'No restaurants found',
        description: 'Try different cuisine or location',
        priority: 'normal',
      });
      return suggestions;
    }

    // Suggest top-rated
    const topRated = restaurants.filter(r => r.rating && r.rating >= 4.5);
    if (topRated.length > 0) {
      suggestions.push({
        id: 'top_rated',
        type: 'information',
        title: `${topRated.length} Highly Rated`,
        description: 'Restaurants with 4.5+ stars',
        priority: 'high',
      });
    }

    // Suggest making reservation
    suggestions.push({
      id: 'make_reservation',
      type: 'action',
      title: 'Make Reservation',
      description: 'Book a table at these restaurants',
      action: {
        label: 'Reserve',
        handler: async () => {
          this.bus.emit('booking:request', { restaurants });
        },
      },
      priority: 'high',
    });

    return suggestions;
  }

  /**
   * Mock restaurants for fallback
   */
  private getMockRestaurants(params: DiningRequest): RestaurantResult[] {
    const mockRestaurants: RestaurantResult[] = [
      {
        id: 'mock_rest_1',
        name: 'El Cielo',
        description: 'Award-winning fine dining with molecular gastronomy. 12-course tasting menu that tells a story.',
        cuisine: ['Colombian', 'International', 'Fine Dining'],
        priceLevel: 4,
        rating: 4.8,
        reviewCount: 1250,
        location: {
          address: 'Calle 10 #40-34, El Poblado, Medellín',
          neighborhood: 'El Poblado',
          coordinates: { lat: 6.2087, lng: -75.5681 },
        },
        hours: {
          open: '19:00',
          close: '23:00',
        },
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800',
        phone: '+57 4 268 2538',
        reservationUrl: 'https://example.com',
        features: ['Tasting Menu', 'Wine Pairing', 'Intimate Setting'],
        dietaryOptions: ['Vegetarian Available'],
        relevanceScore: 0.95,
      },
      {
        id: 'mock_rest_2',
        name: 'Carmen',
        description: 'Contemporary Colombian cuisine with a creative twist. Farm-to-table ingredients and stunning views.',
        cuisine: ['Colombian', 'Contemporary'],
        priceLevel: 3,
        rating: 4.7,
        reviewCount: 890,
        location: {
          address: 'Carrera 36 #10A-27, El Poblado, Medellín',
          neighborhood: 'El Poblado',
          coordinates: { lat: 6.2089, lng: -75.5671 },
        },
        hours: {
          open: '12:00',
          close: '22:00',
        },
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
        phone: '+57 4 311 7189',
        features: ['Outdoor Seating', 'City Views', 'Chef\'s Table'],
        dietaryOptions: ['Vegetarian', 'Gluten-free'],
        relevanceScore: 0.92,
      },
      {
        id: 'mock_rest_3',
        name: 'Pergamino Café',
        description: 'Premium coffee shop with light bites. Locally roasted beans and artisanal pastries.',
        cuisine: ['Cafe', 'Breakfast', 'Coffee'],
        priceLevel: 2,
        rating: 4.6,
        reviewCount: 1520,
        location: {
          address: 'Calle 7 #37-15, El Poblado, Medellín',
          neighborhood: 'El Poblado',
          coordinates: { lat: 6.2091, lng: -75.5665 },
        },
        hours: {
          open: '07:00',
          close: '20:00',
        },
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800',
        phone: '+57 4 268 0830',
        features: ['Free WiFi', 'Laptop Friendly', 'Outdoor Seating'],
        dietaryOptions: ['Vegan', 'Gluten-free'],
        relevanceScore: 0.88,
      },
      {
        id: 'mock_rest_4',
        name: 'Mondongos',
        description: 'Traditional Colombian fare. Famous for bandeja paisa and authentic local flavors.',
        cuisine: ['Colombian', 'Traditional'],
        priceLevel: 2,
        rating: 4.4,
        reviewCount: 2100,
        location: {
          address: 'Carrera 43A #11A-45, El Poblado, Medellín',
          neighborhood: 'El Poblado',
          coordinates: { lat: 6.2095, lng: -75.5663 },
        },
        hours: {
          open: '08:00',
          close: '22:00',
        },
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800',
        phone: '+57 4 268 3934',
        features: ['Family Friendly', 'Large Portions', 'Local Favorite'],
        dietaryOptions: ['Gluten-free Available'],
        relevanceScore: 0.85,
      },
      {
        id: 'mock_rest_5',
        name: 'Oci.Mde',
        description: 'Modern Asian fusion with rooftop terrace. Creative cocktails and shareable plates.',
        cuisine: ['Asian Fusion', 'Japanese', 'Sushi'],
        priceLevel: 3,
        rating: 4.7,
        reviewCount: 780,
        location: {
          address: 'Carrera 40 #10A-22, El Poblado, Medellín',
          neighborhood: 'El Poblado',
          coordinates: { lat: 6.2085, lng: -75.5677 },
        },
        hours: {
          open: '17:00',
          close: '01:00',
        },
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=800',
        phone: '+57 4 444 1906',
        reservationUrl: 'https://example.com',
        features: ['Rooftop', 'Cocktail Bar', 'Late Night'],
        dietaryOptions: ['Vegetarian', 'Vegan'],
        relevanceScore: 0.9,
      },
    ];

    // Filter by cuisine if specified
    let filtered = mockRestaurants;
    
    if (params.cuisine && params.cuisine.length > 0) {
      filtered = filtered.filter(r => 
        r.cuisine.some(c => 
          params.cuisine!.some(pc => c.toLowerCase().includes(pc.toLowerCase()))
        )
      );
    }

    // Filter by price range
    if (params.priceRange) {
      const targetPrice = params.priceRange === 'budget' ? [1, 2]
        : params.priceRange === 'moderate' ? [2, 3]
        : params.priceRange === 'luxury' ? [3, 4] : [1, 2, 3, 4];
      
      filtered = filtered.filter(r => targetPrice.includes(r.priceLevel));
    }

    // Filter by dietary
    if (params.dietary && params.dietary.length > 0) {
      filtered = filtered.filter(r =>
        params.dietary!.some(d => 
          r.dietaryOptions?.some(opt => opt.toLowerCase().includes(d.toLowerCase()))
        )
      );
    }

    return filtered.slice(0, params.maxResults || 10);
  }
}

// Singleton instance
let diningOrchestratorInstance: DiningOrchestratorAgent | null = null;

export function getDiningOrchestrator(): DiningOrchestratorAgent {
  if (!diningOrchestratorInstance) {
    diningOrchestratorInstance = new DiningOrchestratorAgent();
  }
  return diningOrchestratorInstance;
}

export default DiningOrchestratorAgent;
