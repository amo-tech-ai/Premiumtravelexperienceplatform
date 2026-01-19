import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useCreateEvent } from '../../lib/hooks/useEvents';
import { toast } from 'sonner@2.0.3';
import type { CreateEventInput } from '../../lib/types/locations';

/**
 * CreateEventPage - Create new event (PROTECTED)
 * Route: /events/create
 * Requires: Authentication via RequireAuth wrapper
 */
export default function CreateEventPage() {
  const navigate = useNavigate();
  const { createEvent, creating, error } = useCreateEvent();
  
  const [formData, setFormData] = useState({
    name: '',
    event_type: 'concert',
    date: '',
    time: '',
    address: '',
    city: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map form data to CreateEventInput
    const eventInput: CreateEventInput = {
      name: formData.name,
      category: 'event',
      event_type: formData.event_type,
      event_start_time: `${formData.date}T${formData.time}:00.000Z`,
      description: formData.description,
      address: formData.address,
      city: formData.city,
      source: 'manual',
      is_active: true,
    };
    
    const event = await createEvent(eventInput);
    
    if (event) {
      toast.success('Event created successfully!');
      navigate(`/events/${event.id}`);
    } else {
      toast.error(error?.message || 'Failed to create event');
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
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-serif text-slate-900 mb-6">Create Event</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="e.g., Medellín Music Festival"
              />
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Type *
              </label>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value="concert">Concert</option>
                <option value="festival">Festival</option>
                <option value="sports">Sports</option>
                <option value="theater">Theater</option>
                <option value="nightlife">Nightlife</option>
                <option value="art">Art & Culture</option>
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
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
                placeholder="Describe the event..."
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
                {creating ? 'Creating...' : 'Create Event'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/events')}
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