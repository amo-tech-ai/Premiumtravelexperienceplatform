import React from 'react';
import { motion } from 'motion/react';
import { useAI } from '../context/AIContext';
import { Link } from 'react-router-dom';
import { 
  Building, Calendar, Map as MapIcon, Trash2, ArrowRight, 
  LayoutDashboard, Heart, CalendarClock, MessageSquare
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { cn } from '../components/ui/utils';
import { ExploreMap } from '../components/explore/ExploreMap';

import { useWizard } from '../context/WizardContext';

// Helper component for Empty State
const EmptyDashboardState = ({ 
  type = 'all', 
  title = "No saved items yet", 
  description = "Start exploring Medellín to build your dream collection." 
}) => (
  <div className="text-center py-20 px-4">
    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
      {type === 'property' && <Building className="w-8 h-8 text-emerald-600" />}
      {type === 'event' && <Calendar className="w-8 h-8 text-emerald-600" />}
      {type === 'itinerary' && <MapIcon className="w-8 h-8 text-emerald-600" />}
      {type === 'all' && <Heart className="w-8 h-8 text-emerald-600" />}
    </div>
    <h3 className="text-xl font-serif text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 mb-8 max-w-sm mx-auto">{description}</p>
    <div className="flex gap-4 justify-center">
      <Link to="/explore">
        <Button variant="outline" className="border-slate-200 hover:bg-emerald-50 hover:text-emerald-700">
          Explore Map
        </Button>
      </Link>
      <Link to="/real-estate">
        <Button className="bg-slate-900 text-white hover:bg-emerald-600">
          Browse Properties
        </Button>
      </Link>
    </div>
  </div>
);

const SavedItemCard = ({ item, onRemove }: { item: any, onRemove: (id: string) => void }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <ImageWithFallback 
          src={item.image || "https://images.unsplash.com/photo-1599582106603-946654a9388c?auto=format&fit=crop&q=80"} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onRemove(item.id)}
            className="p-2 bg-white/90 backdrop-blur rounded-full text-slate-400 hover:text-rose-500 hover:bg-white transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className={cn(
            "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md",
            item.type === 'property' ? "bg-emerald-900/80 text-white" : "bg-amber-400/90 text-slate-900"
          )}>
            {item.type}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <h4 className="font-serif text-lg text-slate-900 line-clamp-1">{item.title}</h4>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
            <MapIcon className="w-3.5 h-3.5" />
            {item.location || "Medellín, Colombia"}
          </p>
        </div>
        
        {item.notes && (
           <div className="bg-slate-50 p-3 rounded-lg mt-2 mb-4 text-xs text-slate-600 italic border border-slate-100">
             "{item.notes}"
           </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="font-semibold text-emerald-700">
            {item.price || "Price on Request"}
          </span>
          <Link to={item.type === 'property' ? `/real-estate/listing/${item.id}` : `/experiences/${item.id}`}>
            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-emerald-700 p-0 h-auto font-normal">
              View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const { savedItems, removeItem, intent } = useAI();
  const { openCreateTrip } = useWizard();
  
  // Filter items
  const properties = savedItems.filter(i => i.type === 'property');
  const itineraries = savedItems.filter(i => i.type === 'itinerary');
  const experiences = savedItems.filter(i => i.type !== 'property' && i.type !== 'itinerary');

  const { injectMessage, toggleOpen } = useAI();
  
  const handleAskConcierge = () => {
     injectMessage(`I have ${savedItems.length} items in my collection. Can you help me organize them into a trip?`, 'user', 'ITINERARY');
     toggleOpen();
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] pt-24 pb-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif text-slate-900 mb-3">Your Collection</h1>
            <p className="text-slate-500">
              Manage your saved properties, events, and travel plans.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
             <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-slate-600">
                   Concierge Active
                </span>
             </div>
             
             {savedItems.length > 0 && (
                 <>
                    <Button 
                        variant="outline"
                        onClick={handleAskConcierge}
                        className="bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200"
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Ask Concierge
                    </Button>
                    <Button 
                        onClick={openCreateTrip}
                        className="bg-emerald-900 text-white hover:bg-emerald-800 shadow-lg shadow-emerald-900/10"
                    >
                        <CalendarClock className="w-4 h-4 mr-2" />
                        Plan Itinerary
                    </Button>
                 </>
             )}
          </div>
        </div>

        {/* Saved Places Map */}
        {savedItems.length > 0 && (
          <div className="mb-10 h-[300px] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative group">
             <ExploreMap 
                places={savedItems.map(item => ({
                   id: item.id,
                   lat: item.lat || 50,
                   lng: item.lng || 50,
                   title: item.title,
                   category: item.type === 'property' ? 'Stays' : 'Things to Do',
                   price: item.price
                }))}
                onPinClick={() => {}} 
             />
             <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 shadow-sm">
                Your Saved Locations
             </div>
          </div>
        )}

        {/* Content Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white border border-slate-100 p-1 rounded-xl mb-8 w-full md:w-auto overflow-x-auto justify-start">
            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              All Items ({savedItems.length})
            </TabsTrigger>
            <TabsTrigger value="properties" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              Real Estate ({properties.length})
            </TabsTrigger>
            <TabsTrigger value="experiences" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              Experiences ({experiences.length})
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              Trips ({itineraries.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {savedItems.length === 0 ? (
              <EmptyDashboardState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedItems.map(item => (
                  <SavedItemCard key={item.id} item={item} onRemove={removeItem} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="properties">
            {properties.length === 0 ? (
              <EmptyDashboardState type="property" title="No saved properties" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map(item => (
                  <SavedItemCard key={item.id} item={item} onRemove={removeItem} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="experiences">
            {experiences.length === 0 ? (
              <EmptyDashboardState type="event" title="No saved experiences" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {experiences.map(item => (
                  <SavedItemCard key={item.id} item={item} onRemove={removeItem} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="itinerary">
            {itineraries.length === 0 ? (
             <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                <CalendarClock className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <h3 className="text-xl font-serif text-slate-900 mb-2">No active trips</h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                   Use the Itinerary Wizard to plan your next stay in Medellín.
                </p>
                <Button 
                   onClick={openCreateTrip}
                   className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8"
                >
                   Start Planning
                </Button>
             </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {itineraries.map(item => (
                  <SavedItemCard key={item.id} item={item} onRemove={removeItem} />
                ))}
              </div>
            )}
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
