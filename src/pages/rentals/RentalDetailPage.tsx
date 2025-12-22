import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Users, Car, Fuel, ArrowLeft, Share2, Heart, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useRental } from '../../lib/hooks/useRentals';
import { LoadingSkeleton, ErrorMessage } from '../../components/common';

/**
 * RentalDetailPage - Individual rental details
 * Route: /rentals/:rentalId
 */
export default function RentalDetailPage() {
  const { rentalId } = useParams<{ rentalId: string }>();
  const navigate = useNavigate();
  const { rental, loading, error, refetch } = useRental(rentalId);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/rentals')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Rentals
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <LoadingSkeleton count={1} variant="list" />
        </div>
      </div>
    );
  }

  if (error || !rental) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/rentals')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Rentals
            </button>
          </div>
        </div>
        <ErrorMessage 
          error={error || new Error('Rental not found')} 
          onRetry={refetch}
          title="Rental not found"
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
            onClick={() => navigate('/rentals')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rentals
          </button>
        </div>
      </div>

      {/* Rental Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero Image */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
          <img
            src={rental.primary_image_url || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200'}
            alt={rental.name}
            className="w-full h-full object-cover"
          />
          {rental.vehicle_type && (
            <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-full text-sm font-medium text-slate-900">
              {rental.vehicle_type}
            </div>
          )}
        </div>

        {/* Rental Info */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-serif text-slate-900 mb-4">
                {rental.name}
              </h1>
              <div className="space-y-3">
                {rental.daily_rate && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-medium">${rental.daily_rate} per day</span>
                  </div>
                )}
                {rental.passenger_capacity && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Users className="w-5 h-5" />
                    <span>Seats {rental.passenger_capacity} passengers</span>
                  </div>
                )}
                {rental.transmission && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Car className="w-5 h-5" />
                    <span>{rental.transmission} transmission</span>
                  </div>
                )}
                {rental.fuel_type && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Fuel className="w-5 h-5" />
                    <span>{rental.fuel_type}</span>
                  </div>
                )}
                {rental.address && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="w-5 h-5" />
                    <span>{rental.address}{rental.city && `, ${rental.city}`}</span>
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
          {rental.description && (
            <div className="mb-6">
              <h2 className="text-xl font-serif text-slate-900 mb-3">About This Rental</h2>
              <p className="text-slate-600 leading-relaxed">
                {rental.description}
              </p>
            </div>
          )}

          {/* Features */}
          {rental.rental_features && rental.rental_features.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-serif text-slate-900 mb-3">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {rental.rental_features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-2 h-2 bg-slate-400 rounded-full" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details */}
          {(rental.year || rental.luggage_capacity) && (
            <div className="border-t border-slate-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rental.year && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Year</p>
                    <p className="text-lg font-serif text-slate-900">{rental.year}</p>
                  </div>
                )}
                {rental.luggage_capacity && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Luggage Capacity</p>
                    <p className="text-lg font-serif text-slate-900">{rental.luggage_capacity} bags</p>
                  </div>
                )}
                {rental.mileage_limit && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Mileage Limit</p>
                    <p className="text-lg font-serif text-slate-900">{rental.mileage_limit} km/day</p>
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
