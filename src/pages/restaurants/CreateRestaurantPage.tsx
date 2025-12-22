import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useCreateRestaurant } from '../../lib/hooks/useRestaurants';
import { toast } from 'sonner@2.0.3';
import type { CreateRestaurantInput } from '../../lib/types/locations';

/**
 * CreateRestaurantPage - Create new restaurant (PROTECTED)
 * Route: /restaurants/create
 * Requires: Authentication via RequireAuth wrapper
 */
export default function CreateRestaurantPage() {
  const navigate = useNavigate();
  const { createRestaurant, creating, error } = useCreateRestaurant();
  
  const [formData, setFormData] = useState({
    name: '',
    cuisine_types: '',
    price_level: 2,
    address: '',
    city: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map form data to CreateRestaurantInput
    const restaurantInput: CreateRestaurantInput = {
      name: formData.name,
      category: 'restaurant',
      cuisine_types: formData.cuisine_types ? formData.cuisine_types.split(',').map(c => c.trim()) : undefined,
      price_level: formData.price_level,
      description: formData.description,
      address: formData.address,
      city: formData.city,
      source: 'manual',
      is_active: true,
    };
    
    const restaurant = await createRestaurant(restaurantInput);
    
    if (restaurant) {
      toast.success('Restaurant created successfully!');
      navigate(`/restaurants/${restaurant.id}`);
    } else {
      toast.error(error?.message || 'Failed to create restaurant');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/restaurants')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Restaurants
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-serif text-slate-900 mb-6">Add Restaurant</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Restaurant Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Restaurant Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="e.g., La Deriva"
              />
            </div>

            {/* Cuisine Types */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cuisine Types
              </label>
              <input
                type="text"
                name="cuisine_types"
                value={formData.cuisine_types}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="e.g., Italian, Mediterranean (comma-separated)"
              />
              <p className="text-xs text-slate-500 mt-1">Separate multiple cuisines with commas</p>
            </div>

            {/* Price Level */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price Level (1-4)
              </label>
              <select
                name="price_level"
                value={formData.price_level}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value={1}>$ - Budget</option>
                <option value={2}>$$ - Moderate</option>
                <option value={3}>$$$ - Upscale</option>
                <option value={4}>$$$$ - Fine Dining</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address *
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
                placeholder="Describe the restaurant..."
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
                {creating ? 'Creating...' : 'Add Restaurant'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/restaurants')}
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
