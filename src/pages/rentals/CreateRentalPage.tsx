import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useCreateRental } from '../../lib/hooks/useRentals';
import { toast } from 'sonner@2.0.3';
import type { CreateRentalInput } from '../../lib/types/locations';

/**
 * CreateRentalPage - Create new rental (PROTECTED)
 * Route: /rentals/create
 * Requires: Authentication via RequireAuth wrapper
 */
export default function CreateRentalPage() {
  const navigate = useNavigate();
  const { createRental, creating, error } = useCreateRental();
  
  const [formData, setFormData] = useState({
    name: '',
    vehicle_type: 'car',
    daily_rate: '',
    address: '',
    city: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map form data to CreateRentalInput
    const rentalInput: CreateRentalInput = {
      name: formData.name,
      category: 'rental',
      vehicle_type: formData.vehicle_type,
      daily_rate: formData.daily_rate ? Number(formData.daily_rate) : undefined,
      description: formData.description,
      address: formData.address,
      city: formData.city,
      source: 'manual',
      is_active: true,
    };
    
    const rental = await createRental(rentalInput);
    
    if (rental) {
      toast.success('Rental created successfully!');
      navigate(`/rentals/${rental.id}`);
    } else {
      toast.error(error?.message || 'Failed to create rental');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/rentals')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rentals
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-serif text-slate-900 mb-6">Add Rental Listing</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Vehicle Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="e.g., Toyota Fortuner 2024"
              />
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Vehicle Type *
              </label>
              <select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value="car">Car</option>
                <option value="suv">SUV</option>
                <option value="van">Van</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="bicycle">Bicycle</option>
                <option value="scooter">Scooter</option>
                <option value="truck">Truck</option>
              </select>
            </div>

            {/* Daily Rate */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Daily Rate (USD) *
              </label>
              <input
                type="number"
                name="daily_rate"
                value={formData.daily_rate}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="e.g., 45.00"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Pickup Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="Full address"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="e.g., Medellín"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="Describe the vehicle, features, rental terms..."
              />
            </div>

            {/* Submit */}
            <div className="flex items-center gap-4 pt-4">
              <Button 
                type="submit" 
                className="flex items-center gap-2"
                disabled={creating}
              >
                <Save className="w-4 h-4" />
                {creating ? 'Creating...' : 'Add Rental'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/rentals')}
                disabled={creating}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}