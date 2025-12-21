/**
 * Trips Page - Main Dashboard
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useTrips } from '../../hooks/useTrips';
import { formatDateRange } from '../../lib/utils/date';
import { Skeleton } from '../../components/ui/skeleton';

export default function TripsPage() {
  const { trips, loading, error, createTrip } = useTrips();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTrip = async () => {
    setIsCreating(true);
    try {
      const newTrip = await createTrip({
        title: 'Untitled Trip',
        destination: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });

      if (newTrip) {
        window.location.href = `/app/trip/${newTrip.id}`;
      }
    } catch (err) {
      console.error('Failed to create trip:', err);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="mb-2 text-xl text-red-900">Failed to load trips</h2>
          <p className="text-red-700">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl text-stone-900">My Trips</h1>
          <p className="text-stone-600">Plan, organize, and manage your adventures</p>
        </div>
        <Button onClick={handleCreateTrip} disabled={isCreating} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          {isCreating ? 'Creating...' : 'New Trip'}
        </Button>
      </div>

      {/* Empty State */}
      {trips.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 p-12 text-center"
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <Calendar className="h-10 w-10 text-amber-600" />
          </div>
          <h2 className="mb-3 text-2xl text-stone-900">No trips yet</h2>
          <p className="mb-6 max-w-md text-stone-600">
            Start planning your next adventure. Our AI will help you discover amazing places and create the perfect itinerary.
          </p>
          <Button onClick={handleCreateTrip} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Trip
          </Button>
        </motion.div>
      )}

      {/* Trips Grid */}
      {trips.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
                onClick={() => (window.location.href = `/app/trip/${trip.id}`)}
              >
                {/* Cover Image */}
                {trip.cover_image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={trip.cover_image}
                      alt={trip.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}

                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant={trip.status === 'active' ? 'default' : 'secondary'}>
                      {trip.status}
                    </Badge>
                    {trip.collaborators && trip.collaborators.length > 0 && (
                      <div className="flex items-center gap-1 text-sm text-stone-500">
                        <Users className="h-4 w-4" />
                        <span>{trip.collaborators.length}</span>
                      </div>
                    )}
                  </div>
                  <CardTitle>{trip.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{trip.destination}</span>
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
                  </div>
                  {trip.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-stone-600">
                      {trip.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}