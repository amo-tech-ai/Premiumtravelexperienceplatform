import { ItineraryActivity } from "../components/itinerary/ItineraryItem";
import { FeedItem } from "../components/itinerary/PlannerFeed";

export const MOCK_STAYS: FeedItem[] = [
  {
    id: 'stay-1',
    title: 'The Click Clack Hotel',
    price: '$180/night',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80',
    tags: ['Boutique', 'Design', 'Nightlife', 'Party'],
    reason: 'Matches your love for modern design and social vibes.'
  },
  {
    id: 'stay-2',
    title: 'Marquee Medellín',
    price: '$220/night',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80',
    tags: ['Luxury', 'Rooftop', 'Views', 'Relaxation'],
    reason: 'Best-in-class rooftop pool you requested.'
  },
  {
    id: 'stay-3',
    title: 'Celestino Boutique Hotel',
    price: '$120/night',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80',
    tags: ['Nature', 'Budget', 'Green'],
    reason: 'A lush, green sanctuary in the heart of Provenza.'
  },
  {
    id: 'stay-4',
    title: 'Elcielo Hotel',
    price: '$350/night',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
    tags: ['Luxury', 'Gourmet', 'Wellness'],
    reason: 'The ultimate luxury experience with in-room spa services.'
  }
];

export const MOCK_RESTAURANTS: FeedItem[] = [
  {
    id: 'food-1',
    title: 'El Cielo',
    cuisine: 'Modern Colombian',
    price: '$$$$',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
    tag: 'Michelin Star',
    tags: ['Luxury', 'Gourmet', 'Culture'],
    reason: 'The ultimate foodie experience in Medellín.'
  },
  {
    id: 'food-2',
    title: 'Oci.Mde',
    cuisine: 'Slow Food',
    price: '$$$',
    image: 'https://images.unsplash.com/photo-1544025162-d76690b6d012?auto=format&fit=crop&q=80',
    tag: 'Local Favorite',
    tags: ['Food', 'Casual', 'Design'],
    reason: 'Perfect for your relaxed evening pace.'
  },
  {
    id: 'food-3',
    title: 'Alambique',
    cuisine: 'Latin Fusion',
    price: '$$',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
    tag: 'Rooftop',
    tags: ['Nature', 'Casual', 'Views'],
    reason: 'A hidden gem filled with antiques and plants.'
  },
  {
    id: 'food-4',
    title: 'Carmen',
    cuisine: 'Contemporary',
    price: '$$$',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80',
    tag: 'Garden Dining',
    tags: ['Luxury', 'Nature', 'Romance'],
    reason: 'Elegant dining in a beautiful conservatory.'
  }
];

export const MOCK_ACTIVITIES: ItineraryActivity[] = [
  { id: 'act-1', time: 'Morning', title: 'Breakfast at Pergamino', category: 'Food', reason: 'Start your day with the best local coffee.', tags: ['Food', 'Coffee', 'Casual'] },
  { id: 'act-2', time: '10:00 AM', title: 'Comuna 13 Graffiti Tour', category: 'Culture', reason: 'Essential cultural immersion.', image: 'https://images.unsplash.com/photo-1599582106603-946654a9388c?auto=format&fit=crop&q=80', tags: ['Culture', 'Art', 'History'] },
  { id: 'act-3', time: 'Lunch', title: 'Lunch at Carmen', category: 'Food', reason: 'Refined dining in a lush garden setting.', tags: ['Food', 'Luxury', 'Nature'] },
  { id: 'act-4', time: 'Afternoon', title: 'Explore Provenza Boutiques', category: 'Shopping', reason: 'Relaxed walking and shopping in the greenest district.', tags: ['Shopping', 'Design', 'Walking'] },
  { id: 'act-5', time: 'Evening', title: 'Dinner at El Cielo', category: 'Food', reason: 'A culinary journey through Colombian flavors.', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80', tags: ['Food', 'Luxury', 'Gourmet'] },
  { id: 'act-6', time: 'Morning', title: 'Arví Park Cable Car', category: 'Nature', reason: 'Float above the canopy for breathtaking views.', image: 'https://images.unsplash.com/photo-1591500355325-24d1933c2763?auto=format&fit=crop&q=80', tags: ['Nature', 'Views', 'Adventure'] },
  { id: 'act-7', time: 'Night', title: 'Salsa Dancing at Eslabón', category: 'Nightlife', reason: 'Experience the authentic rhythm of the city.', tags: ['Nightlife', 'Music', 'Culture'] }
];

export interface LocalEvent extends FeedItem {
  date: string;
  isoDate?: string;
  time: string;
  category: string;
  why_recommended: string;
  confidence: number;
  venue: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  booking_url?: string;
  source_urls?: string[];
  price_level: 'Free' | '$' | '$$' | '$$$' | 'Unknown';
}

export const MOCK_LOCAL_EVENTS: LocalEvent[] = [
  {
    id: 'evt-1',
    title: 'Live Salsa Night at Son Havana',
    date: 'Jan 16',
    isoDate: '2026-01-16',
    time: '8:00 PM',
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80',
    why_recommended: 'Matches your interest in nightlife and local culture.',
    confidence: 0.92,
    price: '$15',
    price_level: '$',
    rating: 4.8,
    tags: ['Music', 'Nightlife', 'Culture'],
    venue: {
      name: 'Son Havana',
      address: 'Cra. 73 #44-56, Laureles, Medellín',
      lat: 6.2494,
      lng: -75.5912
    },
    booking_url: 'https://sonhavana.co',
    source_urls: ['https://medellinguru.com/salsa', 'https://sonhavana.co']
  },
  {
    id: 'evt-2',
    title: 'Feria de las Flores Pop-up',
    date: 'Jan 15',
    isoDate: '2026-01-15',
    time: '2:00 PM',
    category: 'Culture',
    image: 'https://images.unsplash.com/photo-1583209814683-c91e44a6505e?auto=format&fit=crop&q=80',
    why_recommended: 'A rare seasonal flower market happening this week.',
    confidence: 0.88,
    price: 'Free',
    price_level: 'Free',
    rating: 5.0,
    tags: ['Culture', 'Nature', 'Free'],
    venue: {
      name: 'Jardín Botánico de Medellín',
      address: 'Cl. 73 #51d-14, Aranjuez, Medellín',
      lat: 6.2705,
      lng: -75.5654
    },
    source_urls: ['https://botanicomedellin.org/agenda']
  },
  {
    id: 'evt-3',
    title: 'MAMM Cinema Night',
    date: 'Jan 17',
    isoDate: '2026-01-17',
    time: '6:30 PM',
    category: 'Culture',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80',
    why_recommended: 'Open-air cinema screening of Colombian indie films.',
    confidence: 0.85,
    price: '$5',
    price_level: '$',
    rating: 4.7,
    tags: ['Culture', 'Film', 'Relaxed'],
    venue: {
      name: 'Museo de Arte Moderno',
      address: 'Cra. 44 #19a-100, El Poblado, Medellín',
      lat: 6.2238,
      lng: -75.5750
    },
    booking_url: 'https://www.elmamm.org/Cine-y-Audiovisuales',
    source_urls: ['https://www.elmamm.org']
  }
];

export const generateMockTrip = (interests: string[], budget: number) => {
  // Normalize interests to lowercase for matching
  const safeInterests = (interests || []).map(i => i.toLowerCase());
  
  // Helper to score items
  const scoreItem = (itemTags: string[] = []) => {
    let score = 0;
    itemTags.forEach(tag => {
      if (safeInterests.includes(tag.toLowerCase())) score += 2;
    });
    return score;
  };

  // Filter and Sort Stays
  const stays = MOCK_STAYS.filter(stay => {
    // Budget filter (simple heuristic)
    const price = parseInt(stay.price?.replace(/[^0-9]/g, '') || '0');
    if (budget < 1000 && price > 200) return false;
    return true;
  }).sort((a, b) => scoreItem(b.tags) - scoreItem(a.tags)).slice(0, 2);

  // Filter and Sort Restaurants
  const restaurants = MOCK_RESTAURANTS.sort((a, b) => scoreItem(b.tags) - scoreItem(a.tags)).slice(0, 2);

  // Filter and Sort Activities
  let activities = MOCK_ACTIVITIES.filter(act => {
      // Always keep some essentials, but filter others
      if (act.title.includes('Breakfast')) return true;
      return scoreItem(act.tags) > 0 || safeInterests.length === 0;
  });
  
  // Ensure we have at least 3 activities
  if (activities.length < 3) {
      activities = MOCK_ACTIVITIES.slice(0, 4);
  }

  // Filter Events
  const localEvents = MOCK_LOCAL_EVENTS.filter(evt => {
      // Show events if they match interests or random chance
      return scoreItem(evt.tags) > 0 || Math.random() > 0.5;
  });

  return {
    stays,
    restaurants,
    activities: activities.slice(0, 5), // Limit to 5 items
    localEvents
  };
};
