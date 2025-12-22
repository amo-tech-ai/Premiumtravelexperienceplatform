import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useEvents } from '../../lib/hooks/useEvents';
import { LoadingSkeleton, ErrorMessage, EmptyState } from '../../components/common';

/**
 * EventsPage - Main events listing page
 * Route: /events
 */
export default function EventsPage() {
  const navigate = useNavigate();
  const { events, loading, error, refetch } = useEvents();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-4xl font-serif text-slate-900 mb-2">Events</h1>
          <p className="text-slate-600">Discover concerts, festivals, and experiences in Medellín</p>
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

  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif text-slate-900 mb-2">Events</h1>
              <p className="text-slate-600">Discover concerts, festivals, and experiences in Medellín</p>
            </div>
            <Button
              onClick={() => navigate('/events/create')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </div>
        </div>
        <EmptyState
          icon={Calendar}
          title="No events found"
          description="Be the first to create an event in your city"
          actionLabel="Create First Event"
          onAction={() => navigate('/events/create')}
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
            <h1 className="text-4xl font-serif text-slate-900 mb-2">Events</h1>
            <p className="text-slate-600">Discover concerts, festivals, and experiences in Medellín</p>
          </div>
          <Button
            onClick={() => navigate('/events/create')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => navigate(`/events/${event.id}`)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
          >
            {/* Event Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={event.primary_image_url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=800'}
                alt={event.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-medium text-slate-900">
                {event.event_type || 'Event'}
              </div>
            </div>

            {/* Event Details */}
            <div className="p-6">
              <h3 className="font-serif text-xl text-slate-900 mb-3 group-hover:text-slate-600 transition-colors">
                {event.name}
              </h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{event.event_start_time ? new Date(event.event_start_time).toLocaleDateString() : 'TBD'}</span>
                </div>
                {event.event_start_time && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(event.event_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{event.address || event.city || 'Location TBD'}</span>
                </div>
                {event.capacity && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <span>{event.capacity.toLocaleString()} capacity</span>
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