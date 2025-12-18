import { Event } from '../components/trip-discovery/EventCardList';
import { Stay } from '../components/trip-discovery/StayRecommendationList';
import { Experience } from '../components/trip-discovery/ExperienceCardList';

export interface SmartPlace {
  id: string;
  lat: number;
  lng: number;
  title: string;
  category: 'Events' | 'Stays' | 'Food' | 'Attractions' | 'Nightlife';
  price?: string;
  isLuxury?: boolean;
}

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
  },
  {
    id: 'e4',
    title: 'Techno Rooftop Party',
    image: 'https://images.unsplash.com/photo-1570872626485-d8ffea69f463?q=80&w=800&auto=format&fit=crop',
    date: 'Sat, Dec 23',
    price: '$35',
    location: 'El Poblado'
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
  },
  {
    id: 's4',
    title: 'Marquee Medellín',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    priceTier: '$$$',
    area: 'Parque Lleras'
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
  },
  {
    id: 'x4',
    title: 'Private Chef Dinner',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop',
    duration: '3 hours',
    fit: 'Luxury'
  }
];

export const MOCK_MAP_PLACES: SmartPlace[] = [
  // Events
  { id: 'e1', lat: 40, lng: 45, title: 'Flower Festival', category: 'Events' },
  { id: 'e2', lat: 60, lng: 55, title: 'Karol G Concert', category: 'Events' },
  { id: 'e3', lat: 35, lng: 30, title: 'Salsa Night', category: 'Events' },
  { id: 'e4', lat: 38, lng: 32, title: 'Techno Rooftop', category: 'Events' },
  // Stays
  { id: 's1', lat: 45, lng: 60, title: 'Click Clack', category: 'Stays', price: '$220', isLuxury: true },
  { id: 's2', lat: 48, lng: 62, title: 'Elcielo', category: 'Stays', price: '$450', isLuxury: true },
  { id: 's3', lat: 42, lng: 58, title: 'Masaya', category: 'Stays', price: '$80' },
  { id: 's4', lat: 46, lng: 61, title: 'Marquee', category: 'Stays', price: '$300', isLuxury: true },
  // Experiences
  { id: 'x1', lat: 70, lng: 20, title: 'Comuna 13', category: 'Attractions' },
  { id: 'x2', lat: 20, lng: 80, title: 'Guatape', category: 'Attractions' },
  { id: 'x3', lat: 80, lng: 40, title: 'Paragliding', category: 'Attractions' },
  { id: 'x4', lat: 44, lng: 59, title: 'Private Chef', category: 'Food', isLuxury: true },
];
