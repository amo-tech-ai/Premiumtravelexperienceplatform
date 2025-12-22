import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Phone, Globe, Clock, DollarSign, ArrowLeft, Share2, Heart, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useRestaurant } from '../../lib/hooks/useRestaurants';
import { LoadingSkeleton, ErrorMessage } from '../../components/common';

/**
 * RestaurantDetailPage - Individual restaurant details
 * Route: /restaurants/:restaurantId
 */
export default function RestaurantDetailPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const { restaurant, loading, error, refetch } = useRestaurant(restaurantId);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/restaurants')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Restaurants
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <LoadingSkeleton count={1} variant="list" />
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/restaurants')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Restaurants
            </button>
          </div>
        </div>
        <ErrorMessage 
          error={error || new Error('Restaurant not found')} 
          onRetry={refetch}
          title="Restaurant not found"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back Button */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/restaurants')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Restaurants
          </button>
        </div>
      </div>

      {/* Restaurant Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero Image */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
          <img
            src={restaurant.primary_image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200'}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          {restaurant.price_level && (
            <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-full text-sm font-medium text-slate-900">
              {'$'.repeat(restaurant.price_level)}
            </div>
          )}
        </div>

        {/* Restaurant Info */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-serif text-slate-900 mb-4">
                {restaurant.name}
              </h1>
              <div className="space-y-3">
                {restaurant.rating && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{restaurant.rating.toFixed(1)} / 5.0</span>
                  </div>
                )}
                {restaurant.cuisine_types && restaurant.cuisine_types.length > 0 && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="font-medium">Cuisine:</span>
                    <span>{restaurant.cuisine_types.join(', ')}</span>
                  </div>
                )}
                {restaurant.address && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="w-5 h-5" />
                    <span>{restaurant.address}{restaurant.city && `, ${restaurant.city}`}</span>
                  </div>
                )}
                {restaurant.phone && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="w-5 h-5" />
                    <span>{restaurant.phone}</span>
                  </div>
                )}
                {restaurant.opening_hours && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-5 h-5" />
                    <span>{restaurant.opening_hours}</span>
                  </div>
                )}
                {restaurant.price_level && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <DollarSign className="w-5 h-5" />
                    <span>Price level: {restaurant.price_level} out of 4</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add to Trip
              </Button>
            </div>
          </div>

          {/* Description */}
          {restaurant.description && (
            <div className="mb-6">
              <h2 className="text-xl font-serif text-slate-900 mb-3">About</h2>
              <p className="text-slate-600 leading-relaxed">
                {restaurant.description}
              </p>
            </div>
          )}

          {/* Dietary Options */}
          {restaurant.dietary_options && restaurant.dietary_options.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-serif text-slate-900 mb-3">Dietary Options</h2>
              <div className="flex flex-wrap gap-2">
                {restaurant.dietary_options.map((option, index) => (
                  <span key={index} className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-700">
                    {option}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details */}
          {(restaurant.website || restaurant.reservation_url) && (
            <div className="border-t border-slate-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurant.website && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Website</p>
                    <a 
                      href={restaurant.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-900 hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      Visit Website
                    </a>
                  </div>
                )}
                {restaurant.reservation_url && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Reservations</p>
                    <a 
                      href={restaurant.reservation_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-slate-900 hover:underline"
                    >
                      Make a Reservation
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
