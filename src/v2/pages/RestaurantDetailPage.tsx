/**
 * RESTAURANT DETAIL PAGE - Mobile-optimized with tabs
 * 
 * Tabs: Overview | Menu | Reviews | Location
 * Reduces scrolling by organizing content into sections
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share, 
  MapPin, 
  Clock, 
  Phone,
  Star,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react';
import { TouchTargetButton } from '../../components/mobile/TouchTarget';
import { StickyBottomCTA } from '../../components/ui/StickyBottomCTA';
import { TabNavigation, TabPanel } from '../../components/ui/TabNavigation';

// Mock data - replace with actual API
const mockRestaurant = {
  id: '1',
  name: 'Le Bernardin',
  cuisine: 'French Seafood',
  priceRange: '$$$$',
  rating: 4.8,
  reviewCount: 1243,
  image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  images: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
  ],
  address: '155 W 51st St, New York, NY 10019',
  phone: '(212) 554-1515',
  hours: {
    monday: 'Closed',
    tuesday: '5:00 PM - 10:00 PM',
    wednesday: '5:00 PM - 10:00 PM',
    thursday: '5:00 PM - 10:00 PM',
    friday: '5:00 PM - 10:30 PM',
    saturday: '5:00 PM - 10:30 PM',
    sunday: '5:00 PM - 9:00 PM',
  },
  description: 'Sophisticated French seafood restaurant with a Michelin 3-star rating, known for its elegant atmosphere and exceptional service.',
  highlights: [
    'Michelin 3-star',
    'James Beard Award',
    'Zagat Top Rated',
    'Wine Spectator Grand Award',
  ],
  menu: [
    {
      category: 'Appetizers',
      items: [
        { name: 'Yellowfin Tuna', description: 'Foie gras, caramelized miso', price: 38 },
        { name: 'Langoustine', description: 'Preserved lemon, caviar', price: 42 },
      ],
    },
    {
      category: 'Main Courses',
      items: [
        { name: 'Black Bass', description: 'Baby leeks, red wine sauce', price: 56 },
        { name: 'Lobster', description: 'Coral butter, celery root', price: 68 },
      ],
    },
  ],
  reviews: [
    {
      id: '1',
      author: 'Sarah M.',
      rating: 5,
      date: '2024-01-15',
      text: 'Absolutely incredible experience. Every dish was perfectly executed. The tuna appetizer was the highlight of our meal.',
      images: [],
    },
    {
      id: '2',
      author: 'Michael K.',
      rating: 5,
      date: '2024-01-10',
      text: 'Worth every penny. Impeccable service and the wine pairing was spot on.',
      images: [],
    },
  ],
};

export default function RestaurantDetailPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const restaurant = mockRestaurant;

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <TabPanel>
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700 leading-relaxed">{restaurant.description}</p>
            </div>

            {/* Highlights */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h3>
              <div className="grid grid-cols-2 gap-2">
                {restaurant.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="p-3 bg-blue-50 rounded-lg text-sm font-medium text-blue-900"
                  >
                    {highlight}
                  </div>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Hours</h3>
              <div className="space-y-2">
                {Object.entries(restaurant.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700 capitalize">{day}</span>
                    <span className="text-gray-600">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
              <div className="space-y-3">
                <a 
                  href={`tel:${restaurant.phone}`}
                  className="flex items-center gap-3 text-blue-600 hover:text-blue-700"
                >
                  <Phone className="w-5 h-5" />
                  <span>{restaurant.phone}</span>
                </a>
                <div className="flex items-start gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{restaurant.address}</span>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      ),
    },
    {
      id: 'menu',
      label: 'Menu',
      content: (
        <TabPanel>
          <div className="space-y-6">
            {restaurant.menu.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.category}</h3>
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="pb-4 border-b border-gray-200 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <span className="text-gray-900 font-semibold">${item.price}</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabPanel>
      ),
    },
    {
      id: 'reviews',
      label: 'Reviews',
      content: (
        <TabPanel>
          <div className="space-y-4">
            {/* Rating Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">{restaurant.rating}</span>
                <div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= restaurant.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{restaurant.reviewCount} reviews</p>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {restaurant.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{review.author}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </TabPanel>
      ),
    },
    {
      id: 'location',
      label: 'Location',
      content: (
        <TabPanel>
          <div className="space-y-4">
            {/* Map Placeholder */}
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-700">{restaurant.address}</p>
              <TouchTargetButton
                variant="secondary"
                size="md"
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`)}
                className="mt-3 w-full"
              >
                <MapPin className="w-4 h-4" />
                Get Directions
              </TouchTargetButton>
            </div>

            {/* Nearby Transit */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Nearby Transit</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-600">M</span>
                  </div>
                  <div>
                    <p className="font-medium">50th Street Station</p>
                    <p className="text-gray-600">0.2 miles</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Parking */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Parking</h3>
              <p className="text-sm text-gray-700">Street parking available. Garage parking at 1271 6th Ave (3 min walk).</p>
            </div>
          </div>
        </TabPanel>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Image Carousel */}
      <div className="relative">
        <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
          <img
            src={restaurant.images[currentImageIndex]}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Image Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {restaurant.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex ? 'w-6 bg-white' : 'bg-white/60'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>

        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <TouchTargetButton
            variant="ghost"
            size="md"
            onClick={() => navigate(-1)}
            className="bg-white/90 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </TouchTargetButton>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <TouchTargetButton
            variant="ghost"
            size="md"
            onClick={() => setIsSaved(!isSaved)}
            className="bg-white/90 backdrop-blur-sm"
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
          </TouchTargetButton>
          <TouchTargetButton
            variant="ghost"
            size="md"
            onClick={() => {/* Share */}}
            className="bg-white/90 backdrop-blur-sm"
          >
            <Share className="w-5 h-5" />
          </TouchTargetButton>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="px-4 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{restaurant.name}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <span>{restaurant.cuisine}</span>
          <span>•</span>
          <span>{restaurant.priceRange}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-900">{restaurant.rating}</span>
            <span>({restaurant.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation tabs={tabs} defaultTab="overview" />

      {/* Sticky Bottom CTA */}
      <StickyBottomCTA
        label="Reserve Table"
        onClick={() => {/* Reservation flow */}}
        icon={<Calendar className="w-5 h-5" />}
      />
    </div>
  );
}
