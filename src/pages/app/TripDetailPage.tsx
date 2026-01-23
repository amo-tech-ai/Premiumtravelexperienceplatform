/**
 * Trip Detail Page - Itinerary Builder
 * Production-Ready with Full Activity CRUD
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useParams } from 'react-router';
import { MapPin, Calendar, Plus, Settings, Share2, Download, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useTrip } from '../../hooks/useTrips';
import { formatDateRange, daysBetween } from '../../lib/utils/date';
import { Skeleton } from '../../components/ui/skeleton';
import { AddActivityModal } from '../../components/modals/AddActivityModal';
import { EditActivityModal } from '../../components/modals/EditActivityModal';
import { DeleteActivityDialog } from '../../components/modals/DeleteActivityDialog';
import { toast } from 'sonner';

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { trip, loading, error, refetch } = useTrip(id || null);
  const [activeTab, setActiveTab] = useState('itinerary');

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const handleAddActivity = (day: number) => {
    setSelectedDay(day);
    setShowAddModal(true);
  };

  const handleEditActivity = (activity: any) => {
    setSelectedActivity(activity);
    setShowEditModal(true);
  };

  const handleDeleteActivity = (activity: any) => {
    setSelectedActivity(activity);
    setShowDeleteDialog(true);
  };

  const handleActivitySuccess = () => {
    // Refetch trip data after any CRUD operation
    refetch();
    toast.success('Changes saved!');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Skeleton className="mb-6 h-20 w-full" />
        <Skeleton className="mb-4 h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="mb-2 text-xl text-red-900">Failed to load trip</h2>
          <p className="text-red-700">{error || 'Trip not found'}</p>
          <Button onClick={() => (window.location.href = '/app/trips')} className="mt-4">
            Back to Trips
          </Button>
        </div>
      </div>
    );
  }

  const duration = daysBetween(trip.start_date, trip.end_date);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Header */}
      <div className="relative h-64 overflow-hidden bg-stone-900">
        {trip.cover_image && (
          <>
            <img
              src={trip.cover_image}
              alt={trip.title}
              className="h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white"
            >
              <h1 className="mb-2 font-serif text-4xl">{trip.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{trip.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
                  <span>({duration} days)</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="border-b border-stone-200 bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <TabsContent value="itinerary">
          {trip.items && trip.items.length > 0 ? (
            <div className="space-y-6">
              {Array.from({ length: duration }, (_, i) => i + 1).map((day) => {
                const dayItems = trip.items.filter((item) => item.day === day);

                return (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: day * 0.1 }}
                    className="rounded-lg border border-stone-200 bg-white p-6"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl text-stone-900">Day {day}</h3>
                      <Button size="sm" variant="outline" onClick={() => handleAddActivity(day)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Activity
                      </Button>
                    </div>

                    {dayItems.length > 0 ? (
                      <div className="space-y-3">
                        {dayItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start gap-4 rounded-lg border border-stone-100 p-4 transition-colors hover:bg-stone-50"
                          >
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="mb-1 text-stone-900">{item.title}</h4>
                              {item.description && (
                                <p className="text-sm text-stone-600">{item.description}</p>
                              )}
                              <div className="mt-2 flex items-center gap-4 text-xs text-stone-500">
                                {item.start_time && <span>{item.start_time}</span>}
                                {item.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {item.location.address}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditActivity(item)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteActivity(item)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border-2 border-dashed border-stone-200 p-8 text-center">
                        <p className="text-stone-500">No activities planned for this day</p>
                        <Button size="sm" variant="outline" className="mt-3" onClick={() => handleAddActivity(day)}>
                          Add Activity
                        </Button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white p-12 text-center">
              <Calendar className="mb-4 h-16 w-16 text-stone-400" />
              <h3 className="mb-2 text-xl text-stone-900">No itinerary yet</h3>
              <p className="mb-6 max-w-md text-stone-600">
                Start building your itinerary by adding activities, or let our AI suggest a complete plan.
              </p>
              <div className="flex gap-3">
                <Button onClick={() => handleAddActivity(1)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Activity
                </Button>
                <Button variant="outline">Ask AI for Suggestions</Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="map">
          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <p className="text-stone-600">Map view coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="budget">
          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <p className="text-stone-600">Budget tracking coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <p className="text-stone-600">Notes coming soon...</p>
          </div>
        </TabsContent>
      </div>

      {/* Activity CRUD Modals */}
      {trip && (
        <>
          <AddActivityModal
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
            tripId={trip.id}
            tripDays={duration}
            onSuccess={handleActivitySuccess}
          />

          {selectedActivity && (
            <>
              <EditActivityModal
                open={showEditModal}
                onClose={() => {
                  setShowEditModal(false);
                  setSelectedActivity(null);
                }}
                tripId={trip.id}
                tripDays={duration}
                activity={selectedActivity}
                onSuccess={handleActivitySuccess}
              />

              <DeleteActivityDialog
                open={showDeleteDialog}
                onClose={() => {
                  setShowDeleteDialog(false);
                  setSelectedActivity(null);
                }}
                tripId={trip.id}
                activity={selectedActivity}
                onSuccess={handleActivitySuccess}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}