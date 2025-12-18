import { Venue, UserIntent, FilterState, ResultType } from '../types/wizard';

// --- Data Constants ---

const NEIGHBORHOODS = ['El Poblado', 'Laureles', 'Envigado', 'Sabaneta', 'Centro'];

const IMAGES = {
  dining: [
    "https://images.unsplash.com/photo-1673705988622-18d05a5cf293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "https://images.unsplash.com/photo-1514362545857-3bc16549766b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
  ],
  experience: [
    "https://images.unsplash.com/photo-1662218704415-75f5c569bd28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "https://images.unsplash.com/photo-1596436889106-be35e843f974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
  ],
  stay: [
    "https://images.unsplash.com/photo-1757264119016-7e6b568b810d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
  ]
};

// --- Helper Functions ---

const getRandomImage = (type: 'dining' | 'experience' | 'stay') => {
  const list = IMAGES[type];
  return list[Math.floor(Math.random() * list.length)];
};

const calculateMatchScore = (venue: Venue, filters: FilterState): number => {
  let score = 70; // Base score

  // Budget Match
  // Map priceLevel (1-4) to rough USD ranges: 1: <20, 2: 20-50, 3: 50-100, 4: 100+
  const maxBudget = filters.budget.max;
  let estimatedCost = 0;
  if (venue.priceLevel === 1) estimatedCost = 15;
  if (venue.priceLevel === 2) estimatedCost = 40;
  if (venue.priceLevel === 3) estimatedCost = 80;
  if (venue.priceLevel === 4) estimatedCost = 150;

  if (estimatedCost <= maxBudget) score += 10;
  else score -= 20;

  // Tag Match
  if (filters.tags && filters.tags.length > 0) {
    const venueTags = venue.ai.tags.map(t => t.toLowerCase());
    const filterTags = filters.tags.map(t => t.toLowerCase());
    const matches = filterTags.filter(t => venueTags.some(vt => vt.includes(t)));
    score += (matches.length * 10);
  }

  // Location Match
  if (filters.location?.address) {
     if (venue.location.neighborhood.toLowerCase().includes(filters.location.address.toLowerCase())) {
         score += 15;
     }
  }

  return Math.min(99, Math.max(10, score));
};

// --- Main Engine ---

export const MockEngine = {
  search: (filters: FilterState): Venue[] => {
    const { intent, budget, tags } = filters;
    const count = 12; // Base pool size
    let results: Venue[] = [];

    // 1. Generate Base Pool based on Intent
    if (intent === 'DINING') {
      const subtypes = ['Bistro', 'Rooftop', 'Omakase', 'Steakhouse', 'Fusion', 'Cafe'];
      results = Array.from({ length: count }).map((_, i) => ({
        id: `dining-${i}`,
        type: 'RESTAURANT',
        name: `El Cielo ${subtypes[i % subtypes.length]}`,
        description: "Modern Colombian cuisine with a sensory experience.",
        shortDescription: `${"$".repeat((i % 4) + 1)} • ${subtypes[i % subtypes.length]}`,
        images: [getRandomImage('dining')],
        rating: 4.5 + (Math.random() * 0.5),
        reviewCount: 100 + (i * 20),
        priceLevel: ((i % 4) + 1) as 1|2|3|4,
        location: {
          address: `Calle ${10 + i}`,
          lat: 6.208 + (Math.random() * 0.02),
          lng: -75.567 + (Math.random() * 0.02),
          neighborhood: NEIGHBORHOODS[i % NEIGHBORHOODS.length]
        },
        metadata: {},
        ai: { 
            matchScore: 0, // Calculated later
            reasoning: "Top rated for fine dining.", 
            tags: ["Luxury", "Gastronomy", i % 2 === 0 ? "Romantic" : "Nightlife", i % 3 === 0 ? "Outdoor" : "Indoor"] 
        }
      }));
    } else if (intent === 'STAYS' || intent === 'REAL_ESTATE') {
        const subtypes = ['Hotel', 'Penthouse', 'Apartment', 'Villa'];
        results = Array.from({ length: count }).map((_, i) => ({
          id: `stay-${i}`,
          type: 'PROPERTY',
          name: `The ${subtypes[i % subtypes.length]} Collection`,
          description: "Design driven accommodation with rooftop pool and mountain views.",
          shortDescription: `${subtypes[i % subtypes.length]} • ${NEIGHBORHOODS[i % NEIGHBORHOODS.length]}`,
          images: [getRandomImage('stay')],
          rating: 4.7 + (Math.random() * 0.3),
          reviewCount: 50 + (i * 50),
          priceLevel: ((i % 3) + 2) as 1|2|3|4, // Usually more expensive
          location: {
            address: `Carrera ${30 + i}`,
            lat: 6.209 + (Math.random() * 0.02),
            lng: -75.565 + (Math.random() * 0.02),
            neighborhood: NEIGHBORHOODS[i % NEIGHBORHOODS.length]
          },
          metadata: {},
          ai: { 
              matchScore: 0, 
              reasoning: "Perfect location.", 
              tags: ["Design", "Rooftop", "Pool", "Luxury"] 
          }
        }));
    } else {
        // General/Tourist/Events
        const subtypes = ['Tour', 'Concert', 'Workshop', 'Hike'];
        results = Array.from({ length: count }).map((_, i) => ({
          id: `exp-${i}`,
          type: 'EXPERIENCE',
          name: `Medellín ${subtypes[i % subtypes.length]} Experience`,
          description: "Experience the transformation of Medellín with a local guide.",
          shortDescription: `${subtypes[i % subtypes.length]} • 4 Hours`,
          images: [getRandomImage('experience')],
          rating: 4.8 + (Math.random() * 0.2),
          reviewCount: 200 + (i * 10),
          priceLevel: ((i % 3) + 1) as 1|2|3|4,
          location: {
            address: "Meeting Point",
            lat: 6.250 + (Math.random() * 0.04),
            lng: -75.600 + (Math.random() * 0.04),
            neighborhood: NEIGHBORHOODS[i % NEIGHBORHOODS.length]
          },
          metadata: {},
          ai: { 
              matchScore: 0, 
              reasoning: "Must-do cultural experience.", 
              tags: ["Culture", "History", "Outdoor"] 
          }
        }));
    }

    // 2. Score and Sort
    results = results.map(venue => {
        const score = calculateMatchScore(venue, filters);
        return {
            ...venue,
            ai: {
                ...venue.ai,
                matchScore: score,
                reasoning: score > 90 ? "Excellent match for your criteria." : "Good alternative option."
            }
        };
    }).sort((a, b) => b.ai.matchScore - a.ai.matchScore);

    // 3. Filter out low scores (optional, or just return sorted)
    // results = results.filter(r => r.ai.matchScore > 50);

    return results;
  }
};