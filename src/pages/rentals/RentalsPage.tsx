import React from 'react';
import { useNavigate } from 'react-router';
import { MapPin, DollarSign, Plus, Car, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useRentals } from '../../lib/hooks/useRentals';
import { LoadingSkeleton, ErrorMessage, EmptyState } from '../../components/common';

/**
 * RentalsPage - Main rentals listing page
 * Route: /rentals
 */
export default function RentalsPage() {
  const navigate = useNavigate();
  const { rentals, loading, error, refetch } = useRentals();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-4xl font-serif text-slate-900 mb-2">Rentals</h1>
          <p className="text-slate-600">Find the perfect vehicle for your adventure</p>
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

  if (rentals.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif text-slate-900 mb-2">Rentals</h1>
              <p className="text-slate-600">Find the perfect vehicle for your adventure</p>
            </div>
            <Button
              onClick={() => navigate('/rentals/create')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Rental
            </Button>
          </div>
        </div>
        <EmptyState
          icon={Car}
          title="No rentals found"
          description="Be the first to add a rental listing"
          actionLabel="Add First Rental"
          onAction={() => navigate('/rentals/create')}
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
            <h1 className="text-4xl font-serif text-slate-900 mb-2">Rentals</h1>
            <p className="text-slate-600">Find the perfect vehicle for your adventure</p>
          </div>
          <Button
            onClick={() => navigate('/rentals/create')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Rental
          </Button>
        </div>
      </div>

      {/* Rentals Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rentals.map((rental) => (
          <div
            key={rental.id}
            onClick={() => navigate(`/rentals/${rental.id}`)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
          >
            {/* Rental Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={rental.primary_image_url || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'}
                alt={rental.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {rental.vehicle_type && (
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-medium text-slate-900">
                  {rental.vehicle_type}
                </div>
              )}
            </div>

            {/* Rental Details */}
            <div className="p-6">
              <h3 className="font-serif text-xl text-slate-900 mb-3 group-hover:text-slate-600 transition-colors">
                {rental.name}
              </h3>

              <div className="space-y-2">
                {rental.daily_rate && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <DollarSign className="w-4 h-4" />
                    <span>${rental.daily_rate}/day</span>
                  </div>
                )}
                {rental.passenger_capacity && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{rental.passenger_capacity} passengers</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{rental.address || rental.city || 'Location TBD'}</span>
                </div>
                {rental.transmission && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Car className="w-4 h-4" />
                    <span>{rental.transmission}</span>
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