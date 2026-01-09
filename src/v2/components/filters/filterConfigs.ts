/**
 * FILTER CONFIGURATIONS
 * 
 * Pre-configured filter sets for each dashboard
 * Provides consistent filtering across the application
 */

import { FilterGroup } from './DashboardFilters';

/**
 * TRIPS HUB FILTERS
 */
export const tripsHubFilters: FilterGroup[] = [
  {
    id: 'status',
    label: 'Trip Status',
    type: 'checkbox',
    options: [
      { id: 'planning', label: 'Planning', value: 'planning', type: 'checkbox' },
      { id: 'upcoming', label: 'Upcoming', value: 'upcoming', type: 'checkbox' },
      { id: 'active', label: 'Active', value: 'active', type: 'checkbox' },
      { id: 'completed', label: 'Completed', value: 'completed', type: 'checkbox' },
    ],
  },
  {
    id: 'budget',
    label: 'Budget Range',
    type: 'range',
    min: 0,
    max: 10000,
    step: 500,
  },
  {
    id: 'duration',
    label: 'Trip Duration',
    type: 'checkbox',
    options: [
      { id: 'weekend', label: 'Weekend (1-3 days)', value: 'weekend', type: 'checkbox' },
      { id: 'short', label: 'Short (4-7 days)', value: 'short', type: 'checkbox' },
      { id: 'medium', label: 'Medium (1-2 weeks)', value: 'medium', type: 'checkbox' },
      { id: 'long', label: 'Long (2+ weeks)', value: 'long', type: 'checkbox' },
    ],
  },
  {
    id: 'travelers',
    label: 'Travel Type',
    type: 'checkbox',
    options: [
      { id: 'solo', label: 'Solo', value: 'solo', type: 'checkbox' },
      { id: 'couple', label: 'Couple', value: 'couple', type: 'checkbox' },
      { id: 'family', label: 'Family', value: 'family', type: 'checkbox' },
      { id: 'group', label: 'Group', value: 'group', type: 'checkbox' },
    ],
  },
];

/**
 * EVENTS DASHBOARD FILTERS
 */
export const eventsFilters: FilterGroup[] = [
  {
    id: 'category',
    label: 'Event Category',
    type: 'checkbox',
    options: [
      { id: 'music', label: 'Music & Concerts', value: 'music', type: 'checkbox' },
      { id: 'sports', label: 'Sports', value: 'sports', type: 'checkbox' },
      { id: 'food', label: 'Food & Drink', value: 'food', type: 'checkbox' },
      { id: 'art', label: 'Art & Culture', value: 'art', type: 'checkbox' },
      { id: 'nightlife', label: 'Nightlife', value: 'nightlife', type: 'checkbox' },
      { id: 'theater', label: 'Theater', value: 'theater', type: 'checkbox' },
    ],
  },
  {
    id: 'date',
    label: 'Date Range',
    type: 'radio',
    options: [
      { id: 'today', label: 'Today', value: 'today', type: 'radio' },
      { id: 'tomorrow', label: 'Tomorrow', value: 'tomorrow', type: 'radio' },
      { id: 'this-week', label: 'This Week', value: 'this-week', type: 'radio' },
      { id: 'this-weekend', label: 'This Weekend', value: 'this-weekend', type: 'radio' },
      { id: 'next-week', label: 'Next Week', value: 'next-week', type: 'radio' },
      { id: 'this-month', label: 'This Month', value: 'this-month', type: 'radio' },
    ],
  },
  {
    id: 'price',
    label: 'Price Range',
    type: 'checkbox',
    options: [
      { id: 'free', label: 'Free', value: 'free', type: 'checkbox' },
      { id: 'under-25', label: 'Under $25', value: 'under-25', type: 'checkbox' },
      { id: '25-50', label: '$25 - $50', value: '25-50', type: 'checkbox' },
      { id: '50-100', label: '$50 - $100', value: '50-100', type: 'checkbox' },
      { id: 'over-100', label: 'Over $100', value: 'over-100', type: 'checkbox' },
    ],
  },
  {
    id: 'distance',
    label: 'Distance',
    type: 'radio',
    options: [
      { id: '5mi', label: 'Within 5 miles', value: '5mi', type: 'radio' },
      { id: '10mi', label: 'Within 10 miles', value: '10mi', type: 'radio' },
      { id: '25mi', label: 'Within 25 miles', value: '25mi', type: 'radio' },
      { id: 'any', label: 'Any distance', value: 'any', type: 'radio' },
    ],
  },
];

/**
 * RESTAURANTS DASHBOARD FILTERS
 */
export const restaurantsFilters: FilterGroup[] = [
  {
    id: 'cuisine',
    label: 'Cuisine Type',
    type: 'checkbox',
    options: [
      { id: 'italian', label: 'Italian', value: 'italian', type: 'checkbox' },
      { id: 'french', label: 'French', value: 'french', type: 'checkbox' },
      { id: 'japanese', label: 'Japanese', value: 'japanese', type: 'checkbox' },
      { id: 'chinese', label: 'Chinese', value: 'chinese', type: 'checkbox' },
      { id: 'mexican', label: 'Mexican', value: 'mexican', type: 'checkbox' },
      { id: 'indian', label: 'Indian', value: 'indian', type: 'checkbox' },
      { id: 'thai', label: 'Thai', value: 'thai', type: 'checkbox' },
      { id: 'american', label: 'American', value: 'american', type: 'checkbox' },
      { id: 'mediterranean', label: 'Mediterranean', value: 'mediterranean', type: 'checkbox' },
    ],
  },
  {
    id: 'price',
    label: 'Price Range',
    type: 'checkbox',
    options: [
      { id: '$', label: '$ - Budget', value: '$', type: 'checkbox' },
      { id: '$$', label: '$$ - Moderate', value: '$$', type: 'checkbox' },
      { id: '$$$', label: '$$$ - Upscale', value: '$$$', type: 'checkbox' },
      { id: '$$$$', label: '$$$$ - Fine Dining', value: '$$$$', type: 'checkbox' },
    ],
  },
  {
    id: 'rating',
    label: 'Minimum Rating',
    type: 'radio',
    options: [
      { id: '3+', label: '3+ stars', value: '3+', type: 'radio' },
      { id: '4+', label: '4+ stars', value: '4+', type: 'radio' },
      { id: '4.5+', label: '4.5+ stars', value: '4.5+', type: 'radio' },
      { id: '5', label: '5 stars only', value: '5', type: 'radio' },
    ],
  },
  {
    id: 'dietary',
    label: 'Dietary Options',
    type: 'checkbox',
    options: [
      { id: 'vegetarian', label: 'Vegetarian', value: 'vegetarian', type: 'checkbox' },
      { id: 'vegan', label: 'Vegan', value: 'vegan', type: 'checkbox' },
      { id: 'gluten-free', label: 'Gluten-Free', value: 'gluten-free', type: 'checkbox' },
      { id: 'halal', label: 'Halal', value: 'halal', type: 'checkbox' },
      { id: 'kosher', label: 'Kosher', value: 'kosher', type: 'checkbox' },
    ],
  },
  {
    id: 'features',
    label: 'Features',
    type: 'checkbox',
    options: [
      { id: 'reservations', label: 'Accepts Reservations', value: 'reservations', type: 'checkbox' },
      { id: 'outdoor', label: 'Outdoor Seating', value: 'outdoor', type: 'checkbox' },
      { id: 'delivery', label: 'Delivery Available', value: 'delivery', type: 'checkbox' },
      { id: 'takeout', label: 'Takeout Available', value: 'takeout', type: 'checkbox' },
    ],
  },
  {
    id: 'open-now',
    label: 'Availability',
    type: 'toggle',
    options: [
      { id: 'open-now', label: 'Open Now', value: 'open-now', type: 'toggle' },
    ],
  },
];

/**
 * RENTALS DASHBOARD FILTERS
 */
export const rentalsFilters: FilterGroup[] = [
  {
    id: 'property-type',
    label: 'Property Type',
    type: 'checkbox',
    options: [
      { id: 'entire-home', label: 'Entire Home', value: 'entire-home', type: 'checkbox' },
      { id: 'private-room', label: 'Private Room', value: 'private-room', type: 'checkbox' },
      { id: 'shared-room', label: 'Shared Room', value: 'shared-room', type: 'checkbox' },
      { id: 'hotel', label: 'Hotel', value: 'hotel', type: 'checkbox' },
    ],
  },
  {
    id: 'price',
    label: 'Price per Night',
    type: 'range',
    min: 0,
    max: 1000,
    step: 25,
  },
  {
    id: 'bedrooms',
    label: 'Bedrooms',
    type: 'checkbox',
    options: [
      { id: 'studio', label: 'Studio', value: 'studio', type: 'checkbox' },
      { id: '1', label: '1 Bedroom', value: '1', type: 'checkbox' },
      { id: '2', label: '2 Bedrooms', value: '2', type: 'checkbox' },
      { id: '3', label: '3 Bedrooms', value: '3', type: 'checkbox' },
      { id: '4+', label: '4+ Bedrooms', value: '4+', type: 'checkbox' },
    ],
  },
  {
    id: 'amenities',
    label: 'Amenities',
    type: 'checkbox',
    options: [
      { id: 'wifi', label: 'WiFi', value: 'wifi', type: 'checkbox' },
      { id: 'kitchen', label: 'Kitchen', value: 'kitchen', type: 'checkbox' },
      { id: 'parking', label: 'Free Parking', value: 'parking', type: 'checkbox' },
      { id: 'ac', label: 'Air Conditioning', value: 'ac', type: 'checkbox' },
      { id: 'pool', label: 'Pool', value: 'pool', type: 'checkbox' },
      { id: 'gym', label: 'Gym', value: 'gym', type: 'checkbox' },
      { id: 'washer', label: 'Washer/Dryer', value: 'washer', type: 'checkbox' },
      { id: 'pet-friendly', label: 'Pet Friendly', value: 'pet-friendly', type: 'checkbox' },
    ],
  },
  {
    id: 'rating',
    label: 'Minimum Rating',
    type: 'radio',
    options: [
      { id: '3+', label: '3+ stars', value: '3+', type: 'radio' },
      { id: '4+', label: '4+ stars', value: '4+', type: 'radio' },
      { id: '4.5+', label: '4.5+ stars', value: '4.5+', type: 'radio' },
      { id: '5', label: '5 stars only', value: '5', type: 'radio' },
    ],
  },
  {
    id: 'instant-book',
    label: 'Booking',
    type: 'toggle',
    options: [
      { id: 'instant-book', label: 'Instant Book Only', value: 'instant-book', type: 'toggle' },
    ],
  },
];

/**
 * EXPLORE DASHBOARD FILTERS
 */
export const exploreFilters: FilterGroup[] = [
  {
    id: 'category',
    label: 'Category',
    type: 'checkbox',
    options: [
      { id: 'restaurants', label: 'Restaurants', value: 'restaurants', type: 'checkbox' },
      { id: 'events', label: 'Events', value: 'events', type: 'checkbox' },
      { id: 'activities', label: 'Activities', value: 'activities', type: 'checkbox' },
      { id: 'attractions', label: 'Attractions', value: 'attractions', type: 'checkbox' },
      { id: 'nightlife', label: 'Nightlife', value: 'nightlife', type: 'checkbox' },
      { id: 'shopping', label: 'Shopping', value: 'shopping', type: 'checkbox' },
    ],
  },
  {
    id: 'price',
    label: 'Price Level',
    type: 'checkbox',
    options: [
      { id: 'free', label: 'Free', value: 'free', type: 'checkbox' },
      { id: '$', label: '$ - Budget', value: '$', type: 'checkbox' },
      { id: '$$', label: '$$ - Moderate', value: '$$', type: 'checkbox' },
      { id: '$$$', label: '$$$ - Expensive', value: '$$$', type: 'checkbox' },
    ],
  },
  {
    id: 'rating',
    label: 'Minimum Rating',
    type: 'radio',
    options: [
      { id: '3+', label: '3+ stars', value: '3+', type: 'radio' },
      { id: '4+', label: '4+ stars', value: '4+', type: 'radio' },
      { id: '4.5+', label: '4.5+ stars', value: '4.5+', type: 'radio' },
    ],
  },
  {
    id: 'distance',
    label: 'Distance',
    type: 'radio',
    options: [
      { id: '1mi', label: 'Within 1 mile', value: '1mi', type: 'radio' },
      { id: '5mi', label: 'Within 5 miles', value: '5mi', type: 'radio' },
      { id: '10mi', label: 'Within 10 miles', value: '10mi', type: 'radio' },
      { id: 'any', label: 'Any distance', value: 'any', type: 'radio' },
    ],
  },
];

/**
 * Helper function to get initial filter state
 */
export function getInitialFilterState(filters: FilterGroup[]): Record<string, any> {
  const state: Record<string, any> = {};
  
  filters.forEach(group => {
    if (group.type === 'checkbox') {
      state[group.id] = [];
    } else if (group.type === 'toggle') {
      state[group.id] = false;
    } else if (group.type === 'range') {
      state[group.id] = [group.min || 0, group.max || 100];
    } else {
      state[group.id] = null;
    }
  });
  
  return state;
}
