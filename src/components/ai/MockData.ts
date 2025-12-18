export const MOCK_DINING_RESULTS = [
  {
    id: 'd1',
    title: 'El Cielo',
    rating: 4.9,
    reviewCount: 1250,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=800&auto=format&fit=crop',
    cuisine: 'Modern Colombian',
    priceRange: '$$$$',
    location: 'El Poblado',
    tags: ['Tasting Menu', 'Fine Dining', 'Sensory']
  },
  {
    id: 'd2',
    title: 'Carmen',
    rating: 4.8,
    reviewCount: 980,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop',
    cuisine: 'Contemporary',
    priceRange: '$$$',
    location: 'El Poblado',
    tags: ['Romantic', 'Garden', 'Cocktails']
  },
  {
    id: 'd3',
    title: 'Oci.Mde',
    rating: 4.7,
    reviewCount: 750,
    image: 'https://images.unsplash.com/photo-1550966871-3ed3c6227685?q=80&w=800&auto=format&fit=crop',
    cuisine: 'Slow Food',
    priceRange: '$$$',
    location: 'El Poblado',
    tags: ['Slow Cooked', 'Casual Luxury']
  },
  {
    id: 'd4',
    title: 'Alambique',
    rating: 4.8,
    reviewCount: 890,
    image: 'https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=800&auto=format&fit=crop',
    cuisine: 'Latin Fusion',
    priceRange: '$$',
    location: 'El Poblado',
    tags: ['Rooftop', 'Eclectic', 'Live Music']
  }
];

export const MOCK_STAY_RESULTS = [
  {
    id: 's1',
    title: 'Grand Poblado Penthouse',
    location: 'El Poblado, Medellín',
    price: 450000,
    currency: 'USD',
    beds: 3,
    baths: 3.5,
    sqft: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1512918760532-3edbedeff09b?q=80&w=800&auto=format&fit=crop',
    aiInsight: 'High Appreciation Potential',
    tags: ['Penthouse', 'City View', 'Pool'],
    isFeatured: true
  },
  {
    id: 's2',
    title: 'Jungle Villa Retreat',
    location: 'Envigado',
    price: 850000,
    currency: 'USD',
    beds: 5,
    baths: 6,
    sqft: 5200,
    imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&auto=format&fit=crop',
    aiInsight: 'Exclusive Privacy',
    tags: ['Villa', 'Nature', 'Staff Quarters']
  },
  {
    id: 's3',
    title: 'Modern Loft',
    location: 'Laureles',
    price: 220000,
    currency: 'USD',
    beds: 2,
    baths: 2,
    sqft: 1400,
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
    tags: ['Loft', 'Walkable']
  }
];

export const MOCK_EVENT_RESULTS = [
  {
    id: 'e1',
    title: 'Salsa Night at Eslabon',
    rating: 4.8,
    reviewCount: 320,
    image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=800&auto=format&fit=crop',
    category: 'Nightlife',
    location: 'Downtown',
  },
  {
    id: 'e2',
    title: 'Comuna 13 Graffiti Tour',
    rating: 4.9,
    reviewCount: 2100,
    image: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80&w=800&auto=format&fit=crop',
    category: 'Culture',
    location: 'Comuna 13',
  },
  {
    id: 'e3',
    title: 'Coffee Farm Experience',
    rating: 5.0,
    reviewCount: 150,
    image: 'https://images.unsplash.com/photo-1511537632536-b7a4896840a4?q=80&w=800&auto=format&fit=crop',
    category: 'Tours',
    location: 'Fredonia',
  }
];
