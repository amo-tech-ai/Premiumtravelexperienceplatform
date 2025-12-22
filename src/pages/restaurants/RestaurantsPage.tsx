import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, DollarSign, Plus, UtensilsCrossed } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useRestaurants } from '../../lib/hooks/useRestaurants';
import { LoadingSkeleton, ErrorMessage, EmptyState } from '../../components/common';

/**
 * RestaurantsPage - Main restaurants listing page
 * Route: /restaurants
 */
export default function RestaurantsPage() {
  const navigate = useNavigate();
  const { restaurants, loading, error, refetch } = useRestaurants();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-4xl font-serif text-slate-900 mb-2">Restaurants</h1>
          <p className="text-slate-600">Discover amazing dining experiences</p>
        </div>
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton count={6} variant="grid" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  if (restaurants.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif text-slate-900 mb-2">Restaurants</h1>
              <p className="text-slate-600">Discover amazing dining experiences</p>
            </div>
            <Button
              onClick={() => navigate('/restaurants/create')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Restaurant
            </Button>
          </div>
        </div>
        <EmptyState
          icon={UtensilsCrossed}
          title="No restaurants found"
          description="Be the first to add a restaurant to the guide"
          actionLabel="Add First Restaurant"
          onAction={() => navigate('/restaurants/create')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif text-slate-900 mb-2">Restaurants</h1>
            <p className="text-slate-600">Discover amazing dining experiences</p>
          </div>
          <Button
            onClick={() => navigate('/restaurants/create')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Restaurant
          </Button>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            onClick={() => navigate(`/restaurants/${restaurant.id}`)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
          >
            {/* Restaurant Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={restaurant.primary_image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'}
                alt={restaurant.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {restaurant.price_level && (
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-medium text-slate-900">
                  {'$'.repeat(restaurant.price_level)}
                </div>
              )}
            </div>

            {/* Restaurant Details */}
            <div className="p-6">
              <h3 className="font-serif text-xl text-slate-900 mb-3 group-hover:text-slate-600 transition-colors">
                {restaurant.name}
              </h3>

              <div className="space-y-2">
                {restaurant.rating && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{restaurant.rating.toFixed(1)}</span>
                  </div>
                )}
                {restaurant.cuisine_types && restaurant.cuisine_types.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>{restaurant.cuisine_types.join(', ')}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.address || restaurant.city || 'Location TBD'}</span>
                </div>
                {restaurant.price_level && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <DollarSign className="w-4 h-4" />
                    <span>Price level: {restaurant.price_level}/4</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
