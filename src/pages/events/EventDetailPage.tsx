import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowLeft, Share2, Heart, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useEvent } from '../../lib/hooks/useEvents';
import { LoadingSkeleton, ErrorMessage } from '../../components/common';

/**
 * EventDetailPage - Individual event details
 * Route: /events/:eventId
 */
export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { event, loading, error, refetch } = useEvent(eventId);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/events')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <LoadingSkeleton count={1} variant="list" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/events')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </button>
          </div>
        </div>
        <ErrorMessage 
          error={error || new Error('Event not found')} 
          onRetry={refetch}
          title="Event not found"
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
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>
        </div>
      </div>

      {/* Event Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero Image */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
          <img
            src={event.primary_image_url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1200'}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          {event.event_type && (
            <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-full text-sm font-medium text-slate-900">
              {event.event_type}
            </div>
          )}
        </div>

        {/* Event Info */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-serif text-slate-900 mb-4">
                {event.name}
              </h1>
              <div className="space-y-3">
                {event.event_start_time && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">
                      {new Date(event.event_start_time).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                {event.event_start_time && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-5 h-5" />
                    <span>
                      {new Date(event.event_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {event.event_end_time && ` - ${new Date(event.event_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    </span>
                  </div>
                )}
                {event.address && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="w-5 h-5" />
                    <span>{event.address}{event.city && `, ${event.city}`}</span>
                  </div>
                )}
                {event.capacity && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <Users className="w-5 h-5" />
                    <span>{event.capacity.toLocaleString()} capacity</span>
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
          {event.description && (
            <div className="mb-6">
              <h2 className="text-xl font-serif text-slate-900 mb-3">About</h2>
              <p className="text-slate-600 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* Additional Details */}
          {(event.price_range || event.website || event.phone) && (
            <div className="border-t border-slate-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.price_range && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Price Range</p>
                    <p className="text-lg font-serif text-slate-900">{event.price_range}</p>
                  </div>
                )}
                {event.website && (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Website</p>
                    <a 
                      href={event.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-slate-900 hover:underline"
                    >
                      Visit Website
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