import { Event } from '../components/trip-discovery/EventCardList';
import { Stay } from '../components/trip-discovery/StayRecommendationList';
import { Experience } from '../components/trip-discovery/ExperienceCardList';

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Medellín Flower Festival Parade',
    image: 'https://images.unsplash.com/photo-1596707328607-28d15a97573d?q=80&w=800&auto=format&fit=crop',
    date: 'This week',
    popularity: 'Almost sold out',
    price: '$25',
    location: 'Avenida Guayabal'
  },
  {
    id: 'e2',
    title: 'Karol G: Mañana Será Bonito Fest',
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop',
    date: 'Fri, Dec 22',
    popularity: 'Selling fast',
    price: '$80',
    location: 'Atanasio Girardot Stadium'
  },
  {
    id: 'e3',
    title: 'Salsa Night at Eslabón Prendido',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    date: 'Tonight',
    price: '$10',
    location: 'Centro'
  }
];

export const MOCK_STAYS: Stay[] = [
  {
    id: 's1',
    title: 'The Click Clack Hotel Medellín',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    priceTier: '$$$',
    area: 'El Poblado',
    badge: 'Best Match'
  },
  {
    id: 's2',
    title: 'Elcielo Hotel & Restaurant',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    priceTier: '$$$$',
    area: 'El Poblado',
    badge: 'Luxury Pick'
  },
  {
    id: 's3',
    title: 'Masaya Medellín',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop',
    rating: 4.6,
    priceTier: '$$',
    area: 'El Poblado',
    badge: 'Value'
  }
];

export const MOCK_EXPERIENCES: Experience[] = [
  {
    id: 'x1',
    title: 'Comuna 13 Graffiti Tour & Street Food',
    image: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80&w=800&auto=format&fit=crop',
    duration: '3 hours',
    fit: 'Easy to fit'
  },
  {
    id: 'x2',
    title: 'Coffee Farm Tour in Guatape',
    image: 'https://images.unsplash.com/photo-1626202384351-e1293c683b54?q=80&w=800&auto=format&fit=crop',
    duration: 'Full day',
    fit: 'Must see'
  },
  {
    id: 'x3',
    title: 'Paragliding over San Felix',
    image: 'https://images.unsplash.com/photo-1475518112798-86ae35e9e620?q=80&w=800&auto=format&fit=crop',
    duration: '4 hours',
  }
];

export const MOCK_MAP_PLACES = [
  // Events
  { id: 'e1', lat: 40, lng: 45, title: 'Flower Festival', category: 'Events' as const },
  { id: 'e2', lat: 60, lng: 55, title: 'Karol G Concert', category: 'Events' as const },
  { id: 'e3', lat: 35, lng: 30, title: 'Salsa Night', category: 'Events' as const },
  // Stays
  { id: 's1', lat: 45, lng: 60, title: 'Click Clack', category: 'Stays' as const, price: '$220', isLuxury: true },
  { id: 's2', lat: 48, lng: 62, title: 'Elcielo', category: 'Stays' as const, price: '$450', isLuxury: true },
  { id: 's3', lat: 42, lng: 58, title: 'Masaya', category: 'Stays' as const, price: '$80' },
  // Experiences
  { id: 'x1', lat: 70, lng: 20, title: 'Comuna 13', category: 'Attractions' as const },
  { id: 'x2', lat: 20, lng: 80, title: 'Guatape', category: 'Attractions' as const },
  { id: 'x3', lat: 80, lng: 40, title: 'Paragliding', category: 'Attractions' as const },
];
