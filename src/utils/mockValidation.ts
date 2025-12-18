import { LocalEvent } from './mockTripData';

export interface ValidationResult {
  isValid: boolean;
  event?: Partial<LocalEvent>;
  confidence: number;
  sources: string[];
  reason: string;
}

/**
 * Simulates a backend Edge Function that calls Google Maps & Search APIs
 * to validate if an event/venue actually exists.
 */
export const validateEventQuery = async (query: string): Promise<ValidationResult> => {
  // Simulate network delay (1.5s)
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerQuery = query.toLowerCase();

  // 1. Simulated Failure Case (For testing error states)
  if (lowerQuery.includes('fake') || lowerQuery.includes('nowhere')) {
    return {
      isValid: false,
      confidence: 0.1,
      sources: [],
      reason: "Could not verify venue existence on Google Maps. No matching business found."
    };
  }

  // 2. Simulated Ambiguous Case (For testing low confidence)
  if (lowerQuery.includes('maybe') || lowerQuery.includes('park')) {
    return {
      isValid: true,
      confidence: 0.65,
      sources: ['Google Search'],
      reason: "Found generic location but no specific event details for this date.",
      event: {
        title: query.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        venue: {
          name: "Public Park Area",
          address: "Medellín, Antioquia",
          lat: 6.2442,
          lng: -75.5812
        }
      }
    };
  }

  // 3. Simulated Success Case (Default)
  return {
    isValid: true,
    confidence: 0.94,
    sources: ['Google Maps', 'TripAdvisor', 'Official Instagram'],
    reason: "Verified venue address, open hours, and recent visitor photos.",
    event: {
      title: query.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      category: 'Nightlife',
      venue: {
        name: "Simulated Venue - " + query,
        address: "Cra. 35 #7-10, El Poblado, Medellín",
        lat: 6.2091,
        lng: -75.5677
      },
      rating: 4.7,
      price: "$$",
      tags: ['Verified', 'Trending']
    }
  };
};
