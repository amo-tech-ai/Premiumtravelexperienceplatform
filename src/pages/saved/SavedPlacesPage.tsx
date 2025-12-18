import React, { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { PlaceCard } from '../../components/explore/PlaceCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import { cn } from '../../components/ui/utils';
import { useTrip } from '../../context/TripContext';

// --- Mock Data for Saved Places (Synced with TripContext) ---
const SAVED_PLACES = [
  {
    id: 's2', // Matches TripContext
    title: 'Elcielo Hotel & Restaurant',
    category: 'Restaurants',
    rating: 4.9,
    price: '$$$$',
    distance: '0.2 mi',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
    aiHint: 'Perfect for your anniversary dinner.',
    isSaved: true
  },
  {
    id: 's1', // Matches TripContext
    title: 'The Click Clack Hotel',
    category: 'Stays',
    rating: 4.8,
    price: '$180/night',
    distance: '0.1 mi',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800',
    aiHint: 'You liked the rooftop pool concept.',
    isSaved: true
  },
  {
    id: 'x1', // Matches TripContext (Comuna 13)
    title: 'Comuna 13 Graffiti Tour',
    category: 'Things to Do',
    rating: 4.7,
    price: '$10',
    distance: '4.0 mi',
    image: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80&w=800',
    aiHint: 'Good for a rainy afternoon.',
    isSaved: true
  }
];

const COLLECTIONS = [
  { id: 'c1', title: 'Medellín Coffee Tour', count: 4, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000' },
  { id: 'c2', title: 'Romantic Getaway', count: 3, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000' },
];

export default function SavedPlacesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const { addToTrip } = useTrip();

  const FILTERS = ['All', 'Stays', 'Restaurants', 'Things to Do', 'Activities'];

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* 1. LEFT SIDEBAR */}
      <Sidebar className="hidden md:flex flex-shrink-0 z-20" />

      {/* 2. CENTER CONTENT */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 relative z-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full px-6 py-8 md:px-12 md:py-12">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2">
              Your saved places
            </h1>
            <p className="text-slate-500 text-lg">
              Everything you've hearted, organized for your next trip.
            </p>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="places" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <TabsList className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
                <TabsTrigger value="places" className="px-6 py-2 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Places
                </TabsTrigger>
                <TabsTrigger value="collections" className="px-6 py-2 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Collections
                </TabsTrigger>
                <TabsTrigger value="guides" className="px-6 py-2 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Guides
                </TabsTrigger>
              </TabsList>

              {/* Search & Action */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search saved..." 
                    className="pl-9 w-64 bg-white border-slate-200 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button className="rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white gap-2">
                  <Plus className="w-4 h-4" /> New Collection
                </Button>
              </div>
            </div>

            {/* TAB: PLACES */}
            <TabsContent value="places" className="space-y-6 animate-in fade-in-50 duration-500">
              
              {/* Filter Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {FILTERS.map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                      activeFilter === filter 
                        ? "bg-slate-900 text-white shadow-md" 
                        : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Places Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {SAVED_PLACES.map(place => (
                  <PlaceCard 
                    key={place.id}
                    {...place}
                    layout="vertical"
                    onClick={() => {}} // TODO: Open Detail
                    onAdd={(e) => { 
                        e.stopPropagation(); 
                        const type = place.category === 'Stays' ? 'stay' : place.category === 'Restaurants' ? 'event' : 'experience';
                        addToTrip(place as any, type);
                    }}
                    onToggleSave={(e) => { e.stopPropagation(); console.log("Unsave"); }}
                  />
                ))}
                
                {/* Empty State Mock (if needed) */}
                {/* <div className="col-span-full py-20 text-center text-slate-400">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No places saved yet. Go explore!</p>
                </div> */}
              </div>
            </TabsContent>

            {/* TAB: COLLECTIONS */}
            <TabsContent value="collections" className="animate-in fade-in-50 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {COLLECTIONS.map(collection => (
                  <div key={collection.id} className="group cursor-pointer bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden">
                    <div className="aspect-[16/9] relative overflow-hidden">
                       <img src={collection.image} alt={collection.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                       <div className="absolute bottom-4 left-4 text-white">
                         <h3 className="text-xl font-serif font-bold shadow-black drop-shadow-md">{collection.title}</h3>
                         <p className="text-sm font-medium opacity-90">{collection.count} places</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB: GUIDES */}
            <TabsContent value="guides">
              <div className="py-20 text-center">
                 <p className="text-slate-400">AI-curated guides coming soon.</p>
              </div>
            </TabsContent>

          </Tabs>

        </div>
      </div>
    </div>
  );
}
