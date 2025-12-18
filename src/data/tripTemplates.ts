/**
 * Pre-built Trip Templates for Quick Start
 * Users can select a template and customize it
 */

import { TripDay } from '../components/trip-details/TripDetailsContext';

export interface TripTemplate {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  budget: { min: number; max: number };
  tags: string[];
  image: string;
  days: Omit<TripDay, 'day' | 'date'>[];
  idealFor: string[];
}

export const TRIP_TEMPLATES: TripTemplate[] = [
  {
    id: 'romantic-getaway',
    title: 'Romantic Getaway',
    description: 'Perfect 3-day escape for couples seeking luxury, fine dining, and intimate experiences.',
    duration: 3,
    budget: { min: 1500, max: 3000 },
    tags: ['Romance', 'Luxury', 'Fine Dining', 'Couples'],
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1000',
    idealFor: ['Honeymoons', 'Anniversaries', 'Date Weekends'],
    days: [
      {
        items: [
          { id: 'r1', time: '15:00', title: 'Check-in at The Charlee Hotel', type: 'logistics', duration: '1h', cost: 0 },
          { id: 'r2', time: '18:00', title: 'Sunset Cocktails at Envy Rooftop', type: 'food', duration: '1.5h', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80', cost: 80 },
          { id: 'r3', time: '20:00', title: 'Dinner at El Cielo (molecular gastronomy)', type: 'food', duration: '3h', notes: 'Reservation required - ask for the tasting menu', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80', cost: 250 }
        ]
      },
      {
        items: [
          { id: 'r4', time: '10:00', title: 'Couples Spa at Hotel Vivre', type: 'activity', duration: '2h', cost: 200 },
          { id: 'r5', time: '13:00', title: 'Lunch at Carmen (intimate patio)', type: 'food', duration: '2h', cost: 120 },
          { id: 'r6', time: '16:00', title: 'Private Coffee Tasting Experience', type: 'activity', duration: '2.5h', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80', cost: 150 },
          { id: 'r7', time: '20:00', title: 'Tango Show & Dinner at Típico Asere', type: 'food', duration: '3h', cost: 180 }
        ]
      },
      {
        items: [
          { id: 'r8', time: '09:00', title: 'Hot Air Balloon Ride (sunrise)', type: 'activity', duration: '3h', cost: 300 },
          { id: 'r9', time: '14:00', title: 'Leisurely Lunch at Oci.Mde', type: 'food', duration: '2h', cost: 100 },
          { id: 'r10', time: '17:00', title: 'Shopping at Oviedo Mall', type: 'activity', duration: '2h', cost: 0 },
          { id: 'r11', time: '12:00', title: 'Check-out', type: 'logistics', duration: '1h', cost: 0 }
        ]
      }
    ]
  },
  {
    id: 'adventure-seeker',
    title: 'Adventure Seeker',
    description: 'Action-packed 4-day itinerary for thrill-seekers and outdoor enthusiasts.',
    duration: 4,
    budget: { min: 800, max: 1500 },
    tags: ['Adventure', 'Outdoors', 'Active', 'Budget-Friendly'],
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000',
    idealFor: ['Solo Travelers', 'Friends Groups', 'Young Couples'],
    days: [
      {
        items: [
          { id: 'a1', time: '14:00', title: 'Check-in at Selina Hostel', type: 'logistics', duration: '1h', cost: 0 },
          { id: 'a2', time: '16:00', title: 'Paragliding over Medellín Valley', type: 'activity', duration: '3h', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80', cost: 120 },
          { id: 'a3', time: '20:00', title: 'Street Food Tour in Poblado', type: 'food', duration: '2.5h', cost: 35 }
        ]
      },
      {
        items: [
          { id: 'a4', time: '08:00', title: 'Guatapé Rock Climb (La Piedra)', type: 'activity', duration: '8h', image: 'https://images.unsplash.com/photo-1596395819057-d37e954c7d0d?q=80', cost: 90, notes: '740 steps to the top - breathtaking views!' },
          { id: 'a5', time: '18:00', title: 'Dinner at local restaurant in Guatapé', type: 'food', duration: '1.5h', cost: 25 }
        ]
      },
      {
        items: [
          { id: 'a6', time: '09:00', title: 'Comuna 13 Graffiti Tour on Electric Scooter', type: 'activity', duration: '3h', image: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80', cost: 40 },
          { id: 'a7', time: '13:00', title: 'Lunch at Mercado del Rio', type: 'food', duration: '1.5h', cost: 20 },
          { id: 'a8', time: '15:00', title: 'Mountain Biking in Arví Park', type: 'activity', duration: '4h', cost: 50 },
          { id: 'a9', time: '20:00', title: 'Nightlife in Parque Lleras', type: 'activity', duration: '3h', cost: 60 }
        ]
      },
      {
        items: [
          { id: 'a10', time: '10:00', title: 'White Water Rafting Day Trip', type: 'activity', duration: '6h', cost: 110 },
          { id: 'a11', time: '18:00', title: 'Farewell Dinner at Mondongos', type: 'food', duration: '2h', cost: 30 },
          { id: 'a12', time: '12:00', title: 'Check-out', type: 'logistics', duration: '1h', cost: 0 }
        ]
      }
    ]
  },
  {
    id: 'culture-explorer',
    title: 'Culture Explorer',
    description: 'Immersive 5-day journey through art, history, and local traditions.',
    duration: 5,
    budget: { min: 1000, max: 2000 },
    tags: ['Culture', 'Art', 'History', 'Museums'],
    image: 'https://images.unsplash.com/photo-1599582106603-946654a9388c?q=80&w=1000',
    idealFor: ['Cultural Enthusiasts', 'Photographers', 'History Buffs'],
    days: [
      {
        items: [
          { id: 'c1', time: '15:00', title: 'Arrival & Hotel Check-in', type: 'logistics', duration: '1h', cost: 0 },
          { id: 'c2', time: '17:00', title: 'Walking Tour of Historic Downtown', type: 'activity', duration: '2.5h', cost: 25 },
          { id: 'c3', time: '20:00', title: 'Traditional Colombian Dinner at Hatoviejo', type: 'food', duration: '2h', cost: 40 }
        ]
      },
      {
        items: [
          { id: 'c4', time: '09:00', title: 'Museo de Antioquia (Botero Collection)', type: 'activity', duration: '3h', image: 'https://images.unsplash.com/photo-1599582106603-946654a9388c?q=80', cost: 15 },
          { id: 'c5', time: '13:00', title: 'Lunch at Café Colombo', type: 'food', duration: '1.5h', cost: 25 },
          { id: 'c6', time: '15:00', title: 'Casa de la Memoria (History Museum)', type: 'activity', duration: '2h', cost: 0 },
          { id: 'c7', time: '18:00', title: 'Tango Night at Salón Málaga', type: 'activity', duration: '3h', cost: 50 }
        ]
      },
      {
        items: [
          { id: 'c8', time: '09:00', title: 'Comuna 13 Transformation Tour', type: 'activity', duration: '3h', image: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80', cost: 30 },
          { id: 'c9', time: '13:00', title: 'Lunch in Comuna 13 (support local)', type: 'food', duration: '1.5h', cost: 15 },
          { id: 'c10', time: '15:00', title: 'Metrocable to Santo Domingo', type: 'activity', duration: '2h', cost: 5 },
          { id: 'c11', time: '18:00', title: 'Coffee Tasting at Pergamino', type: 'food', duration: '1.5h', cost: 20 }
        ]
      },
      {
        items: [
          { id: 'c12', time: '10:00', title: 'Day Trip to Guatapé (Colorful Town)', type: 'activity', duration: '8h', image: 'https://images.unsplash.com/photo-1596395819057-d37e954c7d0d?q=80', cost: 80 },
          { id: 'c13', time: '20:00', title: 'Dinner back in Medellín', type: 'food', duration: '2h', cost: 35 }
        ]
      },
      {
        items: [
          { id: 'c14', time: '09:00', title: 'Jardín Botánico', type: 'activity', duration: '2h', cost: 10 },
          { id: 'c15', time: '12:00', title: 'Lunch at Mercado del Rio', type: 'food', duration: '2h', cost: 30 },
          { id: 'c16', time: '15:00', title: 'Parque Explora (Interactive Science)', type: 'activity', duration: '3h', cost: 25 },
          { id: 'c17', time: '12:00', title: 'Departure', type: 'logistics', duration: '1h', cost: 0 }
        ]
      }
    ]
  },
  {
    id: 'digital-nomad',
    title: 'Digital Nomad Week',
    description: 'Work-life balance itinerary with coworking spaces and weekend adventures.',
    duration: 7,
    budget: { min: 1200, max: 2200 },
    tags: ['Remote Work', 'Coworking', 'Balanced', 'Long-term'],
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000',
    idealFor: ['Remote Workers', 'Long-term Travelers', 'Entrepreneurs'],
    days: [
      {
        items: [
          { id: 'd1', time: '09:00', title: 'Work from Selina Coworking', type: 'activity', duration: '8h', cost: 15 },
          { id: 'd2', time: '18:00', title: 'Networking Happy Hour', type: 'food', duration: '2h', cost: 30 },
          { id: 'd3', time: '21:00', title: 'Language Exchange Meetup', type: 'activity', duration: '2h', cost: 0 }
        ]
      },
      {
        items: [
          { id: 'd4', time: '09:00', title: 'Work from Atom House', type: 'activity', duration: '8h', cost: 18 },
          { id: 'd5', time: '18:00', title: 'Yoga Class in Poblado', type: 'activity', duration: '1.5h', cost: 12 },
          { id: 'd6', time: '20:00', title: 'Dinner at Healthy Spot', type: 'food', duration: '1.5h', cost: 20 }
        ]
      },
      // ... similar weekday pattern ...
      {
        items: [
          { id: 'd7', time: '10:00', title: 'Saturday Farmers Market', type: 'activity', duration: '2h', cost: 0 },
          { id: 'd8', time: '13:00', title: 'Brunch at Pergamino', type: 'food', duration: '2h', cost: 25 },
          { id: 'd9', time: '16:00', title: 'Comuna 13 Tour', type: 'activity', duration: '3h', cost: 30 }
        ]
      }
    ]
  },
  {
    id: 'family-fun',
    title: 'Family Fun Package',
    description: 'Kid-friendly 4-day adventure with activities for all ages.',
    duration: 4,
    budget: { min: 1500, max: 2800 },
    tags: ['Family', 'Kids', 'Educational', 'Safe'],
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000',
    idealFor: ['Families with Children', 'Multigenerational Trips'],
    days: [
      {
        items: [
          { id: 'f1', time: '15:00', title: 'Check-in at Family Hotel', type: 'logistics', duration: '1h', cost: 0 },
          { id: 'f2', time: '17:00', title: 'Parque de los Pies Descalzos', type: 'activity', duration: '2h', cost: 0 },
          { id: 'f3', time: '19:00', title: 'Pizza Dinner at Crepes & Waffles', type: 'food', duration: '1.5h', cost: 60 }
        ]
      },
      {
        items: [
          { id: 'f4', time: '09:00', title: 'Parque Explora (Science Museum)', type: 'activity', duration: '4h', cost: 80 },
          { id: 'f5', time: '14:00', title: 'Lunch at Food Court', type: 'food', duration: '1h', cost: 50 },
          { id: 'f6', time: '16:00', title: 'Planetarium Show', type: 'activity', duration: '2h', cost: 40 }
        ]
      },
      {
        items: [
          { id: 'f7', time: '10:00', title: 'Interactive Metro/Metrocable Tour', type: 'activity', duration: '3h', cost: 10 },
          { id: 'f8', time: '14:00', title: 'Lunch at Arví Park', type: 'food', duration: '1.5h', cost: 45 },
          { id: 'f9', time: '16:00', title: 'Nature Walk & Bird Watching', type: 'activity', duration: '2h', cost: 0 }
        ]
      },
      {
        items: [
          { id: 'f10', time: '10:00', title: 'Guatapé Day Trip (colorful town)', type: 'activity', duration: '8h', cost: 120 },
          { id: 'f11', time: '20:00', title: 'Farewell Ice Cream at Popsy', type: 'food', duration: '1h', cost: 20 }
        ]
      }
    ]
  }
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): TripTemplate | undefined {
  return TRIP_TEMPLATES.find(t => t.id === id);
}

/**
 * Filter templates by criteria
 */
export function filterTemplates(criteria: {
  budget?: number;
  duration?: number;
  tags?: string[];
}): TripTemplate[] {
  return TRIP_TEMPLATES.filter(template => {
    if (criteria.budget && (template.budget.min > criteria.budget || template.budget.max < criteria.budget)) {
      return false;
    }
    
    if (criteria.duration && template.duration !== criteria.duration) {
      return false;
    }
    
    if (criteria.tags && criteria.tags.length > 0) {
      const hasTag = criteria.tags.some(tag => 
        template.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
      );
      if (!hasTag) return false;
    }
    
    return true;
  });
}
