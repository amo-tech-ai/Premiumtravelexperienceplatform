/**
 * TRIPS HUB PAGE V2
 * 
 * Entry point for V2 Trip System
 * Shows all trips, empty state, and create trip action
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripV2 } from '../context/TripV2Context';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { TripCard } from '../components/trips/hub/TripCard';
import { EmptyState } from '../components/trips/hub/EmptyState';

export default function TripsHubPage() {
  const { state, dispatch } = useTripV2();
  const navigate = useNavigate();
  
  const { trips, isLoading } = state;
  
  // Load mock trips on first visit (development)
  useEffect(() => {
    if (trips.length === 0 && !isLoading) {
      // Check if we should load mock data
      const hasMockData = localStorage.getItem('v2-mock-loaded');
      if (!hasMockData) {
        // Load mock trips
        import('../data/mockTrips').then(({ mockTripsV2 }) => {
          dispatch({ type: 'SET_TRIPS', payload: mockTripsV2 });
          localStorage.setItem('v2-mock-loaded', 'true');
        });
      }
    }
  }, [trips.length, isLoading, dispatch]);
  
  const handleCreateTrip = () => {
    navigate('/v2/trips/new');
  };
  
  const handleTripClick = (tripId: string) => {
    navigate(`/v2/trips/${tripId}`);
  };
  
  // Separate trips by status
  const upcomingTrips = trips.filter(t => 
    ['draft', 'planning', 'booked'].includes(t.status)
  );
  const activeTrips = trips.filter(t => t.status === 'active');
  const pastTrips = trips.filter(t => 
    ['completed', 'archived'].includes(t.status)
  );
  
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl">My Trips</h1>
              <p className="text-neutral-600 mt-1">
                Plan, organize, and explore your adventures
              </p>
            </div>
            <Button 
              onClick={handleCreateTrip}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Trip
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {trips.length === 0 ? (
          <EmptyState onCreateTrip={handleCreateTrip} />
        ) : (
          <div className="space-y-12">
            {/* Active Trips */}
            {activeTrips.length > 0 && (
              <section>
                <h2 className="text-xl mb-4">Active</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeTrips.map(trip => (
                    <TripCard 
                      key={trip.id} 
                      trip={trip} 
                      onClick={() => handleTripClick(trip.id)}
                    />
                  ))}
                </div>
              </section>
            )}
            
            {/* Upcoming Trips */}
            {upcomingTrips.length > 0 && (
              <section>
                <h2 className="text-xl mb-4">Upcoming</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingTrips.map(trip => (
                    <TripCard 
                      key={trip.id} 
                      trip={trip} 
                      onClick={() => handleTripClick(trip.id)}
                    />
                  ))}
                </div>
              </section>
            )}
            
            {/* Past Trips */}
            {pastTrips.length > 0 && (
              <section>
                <h2 className="text-xl mb-4">Past</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastTrips.map(trip => (
                    <TripCard 
                      key={trip.id} 
                      trip={trip} 
                      onClick={() => handleTripClick(trip.id)}
                      isPast
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
