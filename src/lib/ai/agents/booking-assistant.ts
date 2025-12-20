/**
 * Booking Assistant Agent
 * Handles flight, hotel, restaurant, and activity bookings
 */

import { BaseAgent } from './base-agent';
import { getGeminiClient } from '../gemini-client';
import type { AgentRequest, AgentResponse, AgentContext } from '../types';

export class BookingAssistantAgent extends BaseAgent {
  constructor() {
    super({
      type: 'booking_assistant',
      name: 'Booking Assistant',
      description: 'Helps find and book flights, hotels, restaurants, and activities',
      capabilities: [
        'flight_search',
        'hotel_search',
        'restaurant_reservations',
        'activity_booking',
        'availability_check',
        'price_comparison',
      ],
      priority: 3,
      enabled: true,
    });
  }

  protected async processRequest(request: AgentRequest, context: AgentContext): Promise<any> {
    const { intent, parameters } = request;

    let result: any;

    switch (intent) {
      case 'make_booking':
        result = await this.handleBooking(parameters);
        break;

      case 'search_flights':
        result = await this.searchFlights(parameters);
        break;

      case 'search_hotels':
        result = await this.searchHotels(parameters);
        break;

      case 'find_restaurants':
        result = await this.findRestaurants(parameters);
        break;

      case 'book_activity':
        result = await this.searchActivities(parameters);
        break;

      default:
        // General booking query
        result = await this.handleGeneralQuery(parameters);
    }

    return result;
  }

  /**
   * Handle general booking request
   */
  private async handleBooking(params: any): Promise<any> {
    const { bookingType, details } = params;

    switch (bookingType) {
      case 'flight':
        return this.searchFlights(details);
      case 'hotel':
        return this.searchHotels(details);
      case 'restaurant':
        return this.findRestaurants(details);
      case 'activity':
        return this.searchActivities(details);
      default:
        return {
          success: false,
          message: 'Unknown booking type',
        };
    }
  }

  /**
   * Search for flights
   */
  private async searchFlights(params: any): Promise<any> {
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers = 1,
      cabinClass = 'economy',
    } = params;

    // Check if Gemini can help with complex queries
    const gemini = getGeminiClient();
    if (gemini.isReady() && params.message) {
      try {
        return await this.searchFlightsWithAI(params);
      } catch (error) {
        console.error('[BookingAssistant] AI flight search failed:', error);
      }
    }

    // Mock flight results (would integrate with Amadeus, Skyscanner, etc.)
    return this.getMockFlightResults({
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
      cabinClass,
    });
  }

  /**
   * AI-powered flight search
   */
  private async searchFlightsWithAI(params: any): Promise<any> {
    const gemini = getGeminiClient();

    const prompt = `Find flights based on this request: "${params.message}"

Extract and search for:
- Origin city
- Destination city  
- Departure date
- Return date (if round-trip)
- Number of passengers
- Cabin class preference

Provide 3-5 flight options with:
- Airline
- Departure/arrival times
- Duration
- Stops
- Price (estimate)

Format as JSON array.`;

    const response = await gemini.generateContent(prompt);

    try {
      const flights = JSON.parse(response);
      return {
        success: true,
        flights,
        method: 'ai',
      };
    } catch {
      return this.getMockFlightResults(params);
    }
  }

  /**
   * Mock flight search results
   */
  private getMockFlightResults(params: any): any {
    const { origin, destination, departureDate, passengers = 1 } = params;

    const basePrice = 250;
    const priceVariance = Math.random() * 150;

    return {
      success: true,
      flights: [
        {
          id: 'flight_1',
          airline: 'Avianca',
          flightNumber: 'AV 123',
          origin: origin || 'JFK',
          destination: destination || 'MDE',
          departure: departureDate || '2025-01-15',
          departureTime: '08:00 AM',
          arrivalTime: '12:30 PM',
          duration: '4h 30m',
          stops: 0,
          price: Math.round(basePrice + priceVariance),
          perPerson: true,
          cabinClass: params.cabinClass || 'economy',
          available: true,
        },
        {
          id: 'flight_2',
          airline: 'Copa Airlines',
          flightNumber: 'CM 456',
          origin: origin || 'JFK',
          destination: destination || 'MDE',
          departure: departureDate || '2025-01-15',
          departureTime: '11:15 AM',
          arrivalTime: '05:45 PM',
          duration: '6h 30m',
          stops: 1,
          stopCity: 'Panama City',
          price: Math.round(basePrice - 50 + priceVariance),
          perPerson: true,
          cabinClass: params.cabinClass || 'economy',
          available: true,
        },
        {
          id: 'flight_3',
          airline: 'LATAM',
          flightNumber: 'LA 789',
          origin: origin || 'JFK',
          destination: destination || 'MDE',
          departure: departureDate || '2025-01-15',
          departureTime: '06:00 PM',
          arrivalTime: '11:15 PM',
          duration: '5h 15m',
          stops: 0,
          price: Math.round(basePrice + 100 + priceVariance),
          perPerson: true,
          cabinClass: params.cabinClass || 'economy',
          available: true,
        },
      ],
      totalPassengers: passengers,
      method: 'mock',
    };
  }

  /**
   * Search for hotels
   */
  private async searchHotels(params: any): Promise<any> {
    const {
      location,
      checkIn,
      checkOut,
      guests = 2,
      rooms = 1,
      priceRange,
    } = params;

    // Check if Gemini can help
    const gemini = getGeminiClient();
    if (gemini.isReady() && params.message) {
      try {
        return await this.searchHotelsWithAI(params);
      } catch (error) {
        console.error('[BookingAssistant] AI hotel search failed:', error);
      }
    }

    // Mock hotel results (would integrate with Booking.com, Expedia, etc.)
    return this.getMockHotelResults({
      location,
      checkIn,
      checkOut,
      guests,
      rooms,
      priceRange,
    });
  }

  /**
   * AI-powered hotel search
   */
  private async searchHotelsWithAI(params: any): Promise<any> {
    const gemini = getGeminiClient();

    const prompt = `Find hotels based on: "${params.message}"

Location: ${params.location || 'Medellín'}
Check-in: ${params.checkIn || 'flexible'}
Check-out: ${params.checkOut || 'flexible'}
Guests: ${params.guests || 2}

Provide 4-6 hotel options with:
- Name
- Area/neighborhood
- Star rating
- Price per night
- Amenities
- Guest rating

Format as JSON array.`;

    const response = await gemini.generateContent(prompt);

    try {
      const hotels = JSON.parse(response);
      return {
        success: true,
        hotels,
        method: 'ai',
      };
    } catch {
      return this.getMockHotelResults(params);
    }
  }

  /**
   * Mock hotel search results
   */
  private getMockHotelResults(params: any): any {
    const { location, checkIn, checkOut, guests = 2 } = params;

    return {
      success: true,
      hotels: [
        {
          id: 'hotel_1',
          name: 'The Click Clack Hotel',
          area: 'El Poblado',
          location: location || 'Medellín',
          stars: 4,
          rating: 4.8,
          reviewCount: 1250,
          pricePerNight: 180,
          totalPrice: 900, // 5 nights
          checkIn: checkIn || '2025-01-15',
          checkOut: checkOut || '2025-01-20',
          amenities: ['Free WiFi', 'Pool', 'Gym', 'Restaurant', 'Rooftop bar'],
          image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400',
          available: true,
        },
        {
          id: 'hotel_2',
          name: 'Elcielo Hotel',
          area: 'El Poblado',
          location: location || 'Medellín',
          stars: 5,
          rating: 4.9,
          reviewCount: 890,
          pricePerNight: 320,
          totalPrice: 1600,
          checkIn: checkIn || '2025-01-15',
          checkOut: checkOut || '2025-01-20',
          amenities: ['Free WiFi', 'Fine dining', 'Spa', 'Concierge'],
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400',
          available: true,
          badge: 'Luxury',
        },
        {
          id: 'hotel_3',
          name: 'Masaya Medellín',
          area: 'El Poblado',
          location: location || 'Medellín',
          stars: 3,
          rating: 4.6,
          reviewCount: 2100,
          pricePerNight: 85,
          totalPrice: 425,
          checkIn: checkIn || '2025-01-15',
          checkOut: checkOut || '2025-01-20',
          amenities: ['Free WiFi', 'Hostel vibes', 'Social events'],
          image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=400',
          available: true,
          badge: 'Best Value',
        },
      ],
      guests,
      method: 'mock',
    };
  }

  /**
   * Find restaurant reservations
   */
  private async findRestaurants(params: any): Promise<any> {
    const {
      location,
      date,
      time,
      partySize = 2,
      cuisine,
    } = params;

    // Check if Gemini can help
    const gemini = getGeminiClient();
    if (gemini.isReady() && params.message) {
      try {
        return await this.findRestaurantsWithAI(params);
      } catch (error) {
        console.error('[BookingAssistant] AI restaurant search failed:', error);
      }
    }

    // Mock restaurant results (would integrate with OpenTable, Resy, etc.)
    return this.getMockRestaurantResults({
      location,
      date,
      time,
      partySize,
      cuisine,
    });
  }

  /**
   * AI-powered restaurant search
   */
  private async findRestaurantsWithAI(params: any): Promise<any> {
    const gemini = getGeminiClient();

    const prompt = `Find restaurants for: "${params.message}"

Location: ${params.location || 'Medellín'}
Cuisine: ${params.cuisine || 'any'}
Party size: ${params.partySize || 2}
Date/Time: ${params.date || 'flexible'} ${params.time || ''}

Provide 4-6 restaurant options with:
- Name
- Cuisine type
- Price range ($-$$$$)
- Rating
- Neighborhood
- Availability for reservation

Format as JSON array.`;

    const response = await gemini.generateContent(prompt);

    try {
      const restaurants = JSON.parse(response);
      return {
        success: true,
        restaurants,
        method: 'ai',
      };
    } catch {
      return this.getMockRestaurantResults(params);
    }
  }

  /**
   * Mock restaurant results
   */
  private getMockRestaurantResults(params: any): any {
    const { location, date, time, partySize = 2, cuisine } = params;

    return {
      success: true,
      restaurants: [
        {
          id: 'restaurant_1',
          name: 'El Cielo',
          cuisine: 'Colombian Fusion',
          priceRange: '$$$$',
          rating: 4.9,
          reviewCount: 650,
          location: location || 'El Poblado, Medellín',
          availableTimes: ['6:00 PM', '6:30 PM', '9:00 PM'],
          requestedTime: time || '7:00 PM',
          date: date || '2025-01-16',
          partySize,
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=400',
          acceptsReservations: true,
        },
        {
          id: 'restaurant_2',
          name: 'Carmen',
          cuisine: 'Contemporary Latin',
          priceRange: '$$$',
          rating: 4.7,
          reviewCount: 890,
          location: location || 'El Poblado, Medellín',
          availableTimes: ['7:00 PM', '7:30 PM', '8:00 PM'],
          requestedTime: time || '7:00 PM',
          date: date || '2025-01-16',
          partySize,
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400',
          acceptsReservations: true,
        },
        {
          id: 'restaurant_3',
          name: 'Oci.Mde',
          cuisine: 'Mediterranean',
          priceRange: '$$$',
          rating: 4.8,
          reviewCount: 720,
          location: location || 'El Poblado, Medellín',
          availableTimes: ['6:30 PM', '7:00 PM', '8:30 PM'],
          requestedTime: time || '7:00 PM',
          date: date || '2025-01-16',
          partySize,
          image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400',
          acceptsReservations: true,
        },
      ],
      method: 'mock',
    };
  }

  /**
   * Search for activities/experiences
   */
  private async searchActivities(params: any): Promise<any> {
    const { location, date, category, duration } = params;

    // Check if Gemini can help
    const gemini = getGeminiClient();
    if (gemini.isReady() && params.message) {
      try {
        return await this.searchActivitiesWithAI(params);
      } catch (error) {
        console.error('[BookingAssistant] AI activity search failed:', error);
      }
    }

    // Mock activity results (would integrate with Viator, GetYourGuide, etc.)
    return this.getMockActivityResults({ location, date, category, duration });
  }

  /**
   * AI-powered activity search
   */
  private async searchActivitiesWithAI(params: any): Promise<any> {
    const gemini = getGeminiClient();

    const prompt = `Find activities/tours for: "${params.message}"

Location: ${params.location || 'Medellín'}
Date: ${params.date || 'flexible'}
Duration: ${params.duration || 'any'}

Provide 4-6 activity options with:
- Name
- Category (tour, adventure, cultural, etc.)
- Duration
- Price
- Rating
- What's included

Format as JSON array.`;

    const response = await gemini.generateContent(prompt);

    try {
      const activities = JSON.parse(response);
      return {
        success: true,
        activities,
        method: 'ai',
      };
    } catch {
      return this.getMockActivityResults(params);
    }
  }

  /**
   * Mock activity results
   */
  private getMockActivityResults(params: any): any {
    const { location, date } = params;

    return {
      success: true,
      activities: [
        {
          id: 'activity_1',
          name: 'Comuna 13 Graffiti Tour',
          category: 'Cultural Tour',
          duration: '3 hours',
          price: 25,
          rating: 4.9,
          reviewCount: 3200,
          location: location || 'Comuna 13, Medellín',
          date: date || 'Daily',
          included: ['Expert guide', 'Street food tasting', 'Cable car ride'],
          image: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80&w=400',
          available: true,
        },
        {
          id: 'activity_2',
          name: 'Coffee Farm Tour in Guatapé',
          category: 'Day Trip',
          duration: 'Full day',
          price: 85,
          rating: 4.8,
          reviewCount: 1850,
          location: 'Guatapé',
          date: date || 'Daily',
          included: ['Transportation', 'Lunch', 'Coffee tasting', 'El Peñol climb'],
          image: 'https://images.unsplash.com/photo-1626202384351-e1293c683b54?q=80&w=400',
          available: true,
        },
        {
          id: 'activity_3',
          name: 'Paragliding Adventure',
          category: 'Adventure',
          duration: '2-3 hours',
          price: 65,
          rating: 5.0,
          reviewCount: 980,
          location: 'San Felix, Medellín',
          date: date || 'Weather dependent',
          included: ['Certified instructor', 'Photos/videos', 'Insurance'],
          image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=400',
          available: true,
        },
      ],
      method: 'mock',
    };
  }

  /**
   * Check availability for specific booking
   */
  private async checkAvailability(params: any): Promise<any> {
    const { bookingType, bookingId, date, time } = params;

    // Mock availability check
    return {
      success: true,
      available: Math.random() > 0.3, // 70% available
      bookingType,
      bookingId,
      date,
      time,
      alternativeTimes: ['6:00 PM', '7:30 PM', '8:00 PM'],
    };
  }

  /**
   * Handle general booking query
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
        const prompt = `User booking query: "${message}"

Determine:
1. What type of booking (flight, hotel, restaurant, activity)?
2. Key details (location, dates, people, preferences)
3. What action to take

Respond with JSON containing: { type, details, suggestions }`;

        const response = await gemini.generateContent(prompt);
        const parsed = JSON.parse(response);

        // Route to appropriate handler
        if (parsed.type === 'flight') return this.searchFlights(parsed.details);
        if (parsed.type === 'hotel') return this.searchHotels(parsed.details);
        if (parsed.type === 'restaurant') return this.findRestaurants(parsed.details);
        if (parsed.type === 'activity') return this.searchActivities(parsed.details);

        return parsed;
      } catch (error) {
        console.error('[BookingAssistant] General query failed:', error);
      }
    }

    // Fallback
    return {
      success: false,
      message: 'Unable to process booking request',
      hint: 'Try specifying: flight, hotel, restaurant, or activity',
    };
  }

  // --- SUGGESTION GENERATORS ---

  private generateBookingSuggestions(result: any): any[] {
    if (!result.success) return [];

    return [{
      type: 'booking',
      priority: 'high',
      title: 'Booking Options Found',
      description: 'Review and confirm your booking',
      action: 'review_booking',
      data: result,
    }];
  }

  private generateFlightSuggestions(result: any): any[] {
    if (!result.success || !result.flights) return [];

    return result.flights.slice(0, 3).map((flight: any) => ({
      type: 'flight',
      priority: 'normal',
      title: `${flight.airline} ${flight.flightNumber}`,
      description: `${flight.departureTime} - ${flight.arrivalTime} • $${flight.price}`,
      action: 'book_flight',
      data: flight,
    }));
  }

  private generateHotelSuggestions(result: any): any[] {
    if (!result.success || !result.hotels) return [];

    return result.hotels.slice(0, 3).map((hotel: any) => ({
      type: 'hotel',
      priority: 'normal',
      title: hotel.name,
      description: `${hotel.area} • $${hotel.pricePerNight}/night • ${hotel.rating}⭐`,
      action: 'book_hotel',
      data: hotel,
    }));
  }

  private generateRestaurantSuggestions(result: any): any[] {
    if (!result.success || !result.restaurants) return [];

    return result.restaurants.slice(0, 3).map((restaurant: any) => ({
      type: 'restaurant',
      priority: 'normal',
      title: restaurant.name,
      description: `${restaurant.cuisine} • ${restaurant.priceRange} • ${restaurant.rating}⭐`,
      action: 'reserve_table',
      data: restaurant,
    }));
  }

  private generateActivitySuggestions(result: any): any[] {
    if (!result.success || !result.activities) return [];

    return result.activities.slice(0, 3).map((activity: any) => ({
      type: 'activity',
      priority: 'normal',
      title: activity.name,
      description: `${activity.duration} • $${activity.price} • ${activity.rating}⭐`,
      action: 'book_activity',
      data: activity,
    }));
  }

  private generateGeneralSuggestions(result: any): any[] {
    if (!result.success) return [];

    return [{
      type: 'info',
      priority: 'normal',
      title: 'Booking Assistant Ready',
      description: 'Ask me to find flights, hotels, restaurants, or activities',
    }];
  }
}

// Singleton instance
let bookingInstance: BookingAssistantAgent | null = null;

export function getBookingAssistant(): BookingAssistantAgent {
  if (!bookingInstance) {
    bookingInstance = new BookingAssistantAgent();
  }
  return bookingInstance;
}

export default BookingAssistantAgent;