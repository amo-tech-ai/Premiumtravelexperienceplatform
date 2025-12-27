/**
 * TRIP COMMAND CENTER PAGE V2
 * 
 * Main hub for viewing and managing a single trip
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTripV2 } from '../context/TripV2Context';
import { ArrowLeft, Calendar, DollarSign, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ItineraryOverview } from '../components/trips/command/ItineraryOverview';
import { TripDetails } from '../components/trips/command/TripDetails';

export default function TripCommandCenterPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { state, setCurrentTrip } = useTripV2();
  
  const { currentTrip, currentItinerary, isLoading } = state;
  
  useEffect(() => {
    if (tripId && (!currentTrip || currentTrip.id !== tripId)) {
      setCurrentTrip(tripId);
    }
  }, [tripId, currentTrip, setCurrentTrip]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <p className="text-neutral-600">Loading trip...</p>
      </div>
    );
  }
  
  if (!currentTrip) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Trip not found</p>
          <Button onClick={() => navigate('/v2/trips')}>
            Back to Trips
          </Button>
        </div>
      </div>
    );
  }
  
  // Format dates
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <button
            onClick={() => navigate('/v2/trips')}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Trips</span>
          </button>
          
          {/* Trip Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl mb-2">
                {currentTrip.destination.city}, {currentTrip.destination.country}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-neutral-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(currentTrip.startDate)} - {formatDate(currentTrip.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>
                    {currentTrip.travelers.adults} {currentTrip.travelers.adults === 1 ? 'adult' : 'adults'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>
                    {currentTrip.budget.currency} {currentTrip.budget.total.toLocaleString()}
                    {currentTrip.budget.type === 'per_person' && '/person'}
                  </span>
                </div>
              </div>
            </div>
            
            <Button variant="outline">Edit Trip</Button>
          </div>
          
          {/* Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600">Trip Planning Progress</span>
              <span className="text-sm font-medium">{currentTrip.progress}%</span>
            </div>
            <Progress value={currentTrip.progress} className="h-2" />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="ideas">Ideas</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <ItineraryOverview trip={currentTrip} itinerary={currentItinerary} />
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <h3 className="font-medium mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Add Activity
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Find Restaurants
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      View on Map
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <h3 className="font-medium mb-4">Budget Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Total Budget</span>
                      <span className="font-medium">
                        ${currentTrip.budget.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Spent</span>
                      <span className="font-medium">
                        ${currentTrip.budget.spent.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Remaining</span>
                      <span className="font-medium text-green-600">
                        ${(currentTrip.budget.total - currentTrip.budget.spent).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="itinerary">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="text-center">
                <p className="text-neutral-600 mb-4">Build your day-by-day itinerary</p>
                <Button onClick={() => navigate(`/v2/trips/${currentTrip.id}/itinerary`)}>
                  Open Itinerary Builder
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ideas">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <p className="text-neutral-600">Ideas inbox coming soon...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <TripDetails trip={currentTrip} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}