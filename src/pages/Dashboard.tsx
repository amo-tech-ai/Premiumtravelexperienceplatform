import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAI } from '../context/AIContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Map as MapIcon, Trash2, ArrowRight, 
  CalendarClock, Plus, MoreHorizontal
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { cn } from '../components/ui/utils';
import { useWizard } from '../context/WizardContext';
import { CreateTripModal } from '../components/trip/CreateTripModal';
import { formatDateRange } from '../utils/formatting';

// Helper for Empty State
const EmptyTripsState = ({ onCreate }: { onCreate: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
      <MapIcon className="w-10 h-10 text-emerald-600" />
    </div>
    <h3 className="text-2xl font-serif text-slate-900 mb-2">No trips planned yet</h3>
    <p className="text-slate-500 mb-8 max-w-sm mx-auto">
      Start planning your Medellín adventure. Create a new itinerary or ask the Concierge for help.
    </p>
    <Button 
       onClick={onCreate}
       size="lg"
       className="bg-emerald-900 text-white hover:bg-emerald-800 shadow-xl shadow-emerald-900/20 rounded-xl px-8"
    >
       <Plus className="w-5 h-5 mr-2" />
       Create New Trip
    </Button>
  </div>
);

const TripCard = ({ item, onRemove }: { item: any, onRemove: (id: string) => void }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer relative"
    >
      <Link to={`/trip/${item.id}`} className="absolute inset-0 z-10" />
      
      <div className="aspect-[16/9] relative overflow-hidden bg-slate-100">
        <ImageWithFallback 
          src={item.image || "https://images.unsplash.com/photo-1599582106603-946654a9388c?auto=format&fit=crop&q=80"} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
           <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur shadow-sm">
              <MoreHorizontal className="w-4 h-4 text-slate-600" />
           </Button>
        </div>
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900">
           {item.days || 5} Days
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
           <h4 className="font-serif text-xl text-slate-900 line-clamp-1 group-hover:text-emerald-800 transition-colors">{item.title}</h4>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
           <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {item.dates || "Jan 15 - Jan 20"}
           </span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-sm">
          <span className="text-slate-400 font-medium">Draft</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Details <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const { savedItems, removeItem } = useAI();
  const { openCreateTrip } = useWizard();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  
  // Load trips from localStorage
  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem('trips') || '[]');
    setTrips(savedTrips);
  }, []);
  
  // Filter for itineraries/trips
  // In a real app, this would be a separate API call or distinct state
  // For now we filter savedItems or use mocks if empty to demonstrate
  const itineraries = savedItems.filter(i => i.type === 'itinerary');

  // Combine real trips with saved items
  const allTrips = [...trips, ...itineraries];
  
  // MOCK TRIPS for Demo if none exist
  const hasTrips = allTrips.length > 0; 
  const displayTrips = hasTrips ? allTrips : [
     { id: 'mock1', title: 'Medellín Design Week', type: 'itinerary', image: 'https://images.unsplash.com/photo-1599582106603-946654a9388c?q=80', dates: 'Jan 15 - 20', days: 5 },
     { id: 'mock2', title: 'Coffee Region Tour', type: 'itinerary', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80', dates: 'Feb 10 - 12', days: 3 }
  ];
  
  const handleCreateTrip = () => {
    setShowCreateModal(true);
  };
  
  const handleCloseModal = () => {
    setShowCreateModal(false);
    // Reload trips after creation
    const savedTrips = JSON.parse(localStorage.getItem('trips') || '[]');
    setTrips(savedTrips);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] py-12 pb-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2">My Trips</h1>
            <p className="text-slate-500 text-lg">
              Manage your upcoming adventures and itineraries.
            </p>
          </div>
          <Button 
              onClick={handleCreateTrip}
              className="bg-emerald-900 text-white hover:bg-emerald-800 shadow-lg shadow-emerald-900/10 px-6 h-12 rounded-xl text-base"
          >
              <Plus className="w-5 h-5 mr-2" />
              Create New Trip
          </Button>
        </div>

        {/* Trips Grid */}
        {displayTrips.length === 0 ? (
           <EmptyTripsState onCreate={handleCreateTrip} />
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayTrips.map(trip => (
                 <TripCard key={trip.id} item={trip} onRemove={removeItem} />
              ))}
              
              {/* Add New Card */}
              <button 
                 onClick={handleCreateTrip}
                 className="group min-h-[300px] rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/50 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-emerald-700"
              >
                 <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-white group-hover:shadow-md flex items-center justify-center mb-4 transition-all">
                    <Plus className="w-8 h-8" />
                 </div>
                 <span className="font-semibold text-lg">Plan a new trip</span>
              </button>
           </div>
        )}
      </div>
      
      {/* Create Trip Modal */}
      <CreateTripModal open={showCreateModal} onClose={handleCloseModal} />
    </div>
  );
}