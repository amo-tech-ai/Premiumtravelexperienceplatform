/**
 * TRIPS HUB PAGE V2
 * 
 * Mobile-optimized entry point for V2 Trip System
 * Shows all trips in single-column layout on mobile
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripV2 } from '../context/TripV2Context';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { TouchTargetButton } from '../components/mobile/TouchTarget';
import { HorizontalTripCard } from '../components/cards/HorizontalTripCard';
import { EmptyState } from '../components/trips/hub/EmptyState';
import { BottomSheet, BottomSheetList } from '../components/ui/BottomSheet';
import { Trip } from '../types/trip';

export default function TripsHubPage() {
  const { state, dispatch } = useTripV2();
  const navigate = useNavigate();
  
  const { trips, isLoading } = state;
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Load mock trips on first visit (development)
  useEffect(() => {
    if (trips.length === 0 && !isLoading) {
      const hasMockData = localStorage.getItem('v2-mock-loaded');
      if (!hasMockData) {
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

  const handleMenuClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowMenu(true);
  };

  const menuItems = selectedTrip ? [
    {
      label: 'View Trip Details',
      onClick: () => {
        navigate(`/v2/trips/${selectedTrip.id}`);
        setShowMenu(false);
      },
    },
    {
      label: 'View Itinerary',
      onClick: () => {
        navigate(`/v2/trips/${selectedTrip.id}/itinerary`);
        setShowMenu(false);
      },
    },
    {
      label: 'Edit Trip',
      onClick: () => {
        // TODO: Implement edit
        setShowMenu(false);
      },
    },
    {
      label: 'Share Trip',
      onClick: () => {
        // TODO: Implement share
        setShowMenu(false);
      },
    },
    {
      label: 'Duplicate Trip',
      onClick: () => {
        // TODO: Implement duplicate
        setShowMenu(false);
      },
    },
    {
      label: 'Delete Trip',
      onClick: () => {
        if (confirm('Are you sure you want to delete this trip?')) {
          dispatch({ type: 'DELETE_TRIP', payload: selectedTrip.id });
          setShowMenu(false);
        }
      },
      destructive: true,
    },
  ] : [];

  // Filter trips based on search
  const filteredTrips = trips.filter(trip => 
    searchQuery === '' ||
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Separate trips by status
  const upcomingTrips = filteredTrips.filter(t => 
    ['draft', 'planning', 'booked'].includes(t.status)
  );
  const activeTrips = filteredTrips.filter(t => t.status === 'active');
  const pastTrips = filteredTrips.filter(t => 
    ['completed', 'archived'].includes(t.status)
  );
  
  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Mobile-optimized Header */}
      <div className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-semibold">My Trips</h1>
            <div className="flex items-center gap-2">
              <TouchTargetButton
                variant="icon"
                size="md"
                onClick={() => setShowSearch(!showSearch)}
                aria-label="Search trips"
              >
                <Search className="w-5 h-5" />
              </TouchTargetButton>
              <TouchTargetButton
                variant="primary"
                size="sm"
                onClick={handleCreateTrip}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Trip</span>
              </TouchTargetButton>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="mb-3">
              <input
                type="search"
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 px-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                autoFocus
              />
            </div>
          )}

          {/* Trip Count */}
          <p className="text-sm text-neutral-600">
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'}
          </p>
        </div>
      </div>
      
      {/* Content - Single Column on Mobile */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredTrips.length === 0 ? (
          searchQuery ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No trips found matching "{searchQuery}"</p>
            </div>
          ) : (
            <EmptyState onCreateTrip={handleCreateTrip} />
          )
        ) : (
          <div className="space-y-8">
            {/* Active Trips */}
            {activeTrips.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">Active Trips</h2>
                <div className="flex flex-col gap-3">
                  {activeTrips.map(trip => (
                    <HorizontalTripCard 
                      key={trip.id} 
                      trip={trip}
                      onMenuClick={handleMenuClick}
                    />
                  ))}
                </div>
              </section>
            )}
            
            {/* Upcoming Trips */}
            {upcomingTrips.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">Upcoming Trips</h2>
                <div className="flex flex-col gap-3">
                  {upcomingTrips.map(trip => (
                    <HorizontalTripCard 
                      key={trip.id} 
                      trip={trip}
                      onMenuClick={handleMenuClick}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Past Trips */}
            {pastTrips.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">Past Trips</h2>
                <div className="flex flex-col gap-3">
                  {pastTrips.map(trip => (
                    <HorizontalTripCard 
                      key={trip.id} 
                      trip={trip}
                      onMenuClick={handleMenuClick}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Trip Actions Bottom Sheet */}
      <BottomSheet
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        title={selectedTrip?.title || selectedTrip?.destination}
        height="auto"
      >
        <BottomSheetList 
          items={menuItems}
          onItemClick={() => setShowMenu(false)}
        />
      </BottomSheet>
    </div>
  );
}