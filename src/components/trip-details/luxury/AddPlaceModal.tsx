import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Bookmark,
  Plus,
  Sparkles,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../ui/utils';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '../../ui/dialog';

interface Place {
  id: string;
  name: string;
  category: 'food' | 'activity' | 'stay' | 'event';
  image?: string;
  neighborhood?: string;
  duration?: string;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  rating?: number;
  reviews?: number;
  description?: string;
  openHours?: string;
  trending?: boolean;
}

// Mock data
const MOCK_PLACES: Place[] = [
  {
    id: '1',
    name: 'El Cielo',
    category: 'food',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400',
    neighborhood: 'El Poblado',
    duration: '2 hours',
    priceRange: '$$$$',
    rating: 4.9,
    reviews: 1240,
    description: 'Avant-garde Colombian fusion with sensory experiences',
    openHours: '12 PM - 11 PM',
    trending: true
  },
  {
    id: '2',
    name: 'Comuna 13 Graffiti Tour',
    category: 'activity',
    image: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80&w=400',
    neighborhood: 'Comuna 13',
    duration: '3 hours',
    priceRange: '$',
    rating: 4.8,
    reviews: 3200,
    description: 'Street art tour through transformed neighborhood',
    trending: true
  },
  {
    id: '3',
    name: 'The Click Clack Hotel',
    category: 'stay',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400',
    neighborhood: 'El Poblado',
    priceRange: '$$$',
    rating: 4.7,
    reviews: 890,
    description: 'Boutique hotel with rooftop pool and city views'
  },
  {
    id: '4',
    name: 'Coffee Farm Tour',
    category: 'activity',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=400',
    neighborhood: 'Guatapé',
    duration: '5 hours',
    priceRange: '$$',
    rating: 4.9,
    reviews: 567,
    description: 'Learn about coffee production with tasting session'
  },
  {
    id: '5',
    name: 'Medellín Flower Festival',
    category: 'event',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400',
    neighborhood: 'Centro',
    duration: 'Full day',
    priceRange: '$$',
    rating: 5.0,
    reviews: 2100,
    description: 'Annual flower parade and cultural celebration',
    trending: true
  }
];

interface AddPlaceModalProps {
  open: boolean;
  onClose: () => void;
  onAddToIdeas: (place: Place) => void;
  onAddToDay: (place: Place, dayIndex?: number) => void;
  defaultTab?: 'search' | 'saved';
}

export const AddPlaceModal = ({
  open,
  onClose,
  onAddToIdeas,
  onAddToDay,
  defaultTab = 'search'
}: AddPlaceModalProps) => {
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All', icon: '✨' },
    { id: 'food', label: 'Dining', icon: '🍽️' },
    { id: 'activity', label: 'Activities', icon: '🎯' },
    { id: 'stay', label: 'Stays', icon: '🏨' },
    { id: 'event', label: 'Events', icon: '🎭' }
  ];

  const filteredPlaces = MOCK_PLACES.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-slate-200">
          <DialogTitle className="text-xl">Add to Trip</DialogTitle>
          <DialogDescription>
            Search for places or browse your saved collections
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-slate-200">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('search')}
              className={cn(
                "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === 'search'
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Search className="w-4 h-4 inline-block mr-2" />
              Search
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={cn(
                "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === 'saved'
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Bookmark className="w-4 h-4 inline-block mr-2" />
              Saved
            </button>
          </div>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="flex flex-col h-full">
            {/* Search Bar */}
            <div className="px-6 py-4 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants, activities, hotels..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  autoFocus
                />
              </div>

              {/* Category Filters */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5",
                      selectedCategory === cat.id
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-200"
                    )}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {filteredPlaces.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">No results found</h3>
                  <p className="text-sm text-slate-500">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {filteredPlaces.map((place) => (
                      <PlaceCard
                        key={place.id}
                        place={place}
                        onAddToIdeas={() => {
                          onAddToIdeas(place);
                          onClose();
                        }}
                        onAddToDay={() => {
                          onAddToDay(place);
                          onClose();
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Saved Tab */}
        {activeTab === 'saved' && (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              No saved places yet
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Save places you love to quickly add them to future trips
            </p>
            <Button
              onClick={() => setActiveTab('search')}
              variant="outline"
              size="sm"
            >
              Browse Places
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Place Card Component
interface PlaceCardProps {
  place: Place;
  onAddToIdeas: () => void;
  onAddToDay: () => void;
}

const PlaceCard = ({ place, onAddToIdeas, onAddToDay }: PlaceCardProps) => {
  const categoryConfig = {
    food: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    activity: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    stay: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    event: { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' }
  };

  const config = categoryConfig[place.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-emerald-200 transition-all"
    >
      {/* Image */}
      {place.image && (
        <div className="relative h-32 overflow-hidden bg-slate-100">
          <ImageWithFallback
            src={place.image}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {place.trending && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>Trending</span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h4 className="font-semibold text-slate-900 leading-snug">
          {place.name}
        </h4>

        {/* Description */}
        {place.description && (
          <p className="text-xs text-slate-600 line-clamp-2">
            {place.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {place.neighborhood && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{place.neighborhood}</span>
            </div>
          )}
          {place.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{place.duration}</span>
            </div>
          )}
          {place.priceRange && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>{place.priceRange}</span>
            </div>
          )}
          {place.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{place.rating} ({place.reviews})</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <Button
            size="sm"
            onClick={onAddToDay}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white"
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            Add to Day
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onAddToIdeas}
            className="px-3"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
