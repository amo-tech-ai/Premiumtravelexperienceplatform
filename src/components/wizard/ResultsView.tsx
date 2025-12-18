import React, { useEffect } from 'react';
import { useWizard } from '../../context/WizardContext';
import { useAI } from '../../context/AIContext';
import { ResultsList } from './ResultsList';
import { ResultsMap } from './ResultsMap';
import { VenueDetail } from './VenueDetail';
import { Button } from '../ui/button';
import { Map, List, LayoutGrid } from 'lucide-react';
import { Venue, UserIntent } from '../../types/wizard';
import { cn } from '../ui/utils';

// --- Configuration ---

const CATEGORIES: { id: UserIntent; label: string }[] = [
  { id: 'DINING', label: 'Restaurants' },
  { id: 'TOURIST', label: 'Things to do' },
  { id: 'STAYS', label: 'Stays' },
  { id: 'LOCATIONS', label: 'Locations' },
  { id: 'GUIDES', label: 'Guides' },
];

const SECONDARY_FILTERS = [
  'Luxury',
  'Outdoor',
  'Arts',
  'Real Estate',
  'Nightlife',
  'Wellness'
];

// --- Mock Data Generator ---

const generateMockResults = (category: UserIntent): Venue[] => {
  const count = 8;
  
  if (category === 'DINING') {
    const types = ['Bistro', 'Rooftop', 'Omakase', 'Steakhouse'];
    return Array.from({ length: count }).map((_, i) => ({
      id: `dining-${i}`,
      type: 'RESTAURANT',
      name: `El Cielo ${types[i % types.length]}`,
      description: "Modern Colombian cuisine with a sensory experience.",
      shortDescription: "$$$$ • Molecular Dining",
      images: [
        "https://images.unsplash.com/photo-1673705988622-18d05a5cf293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      ],
      rating: 4.8,
      reviewCount: 320,
      priceLevel: 4,
      location: {
        address: "Cl. 7D #43C-36",
        lat: 6.208 + (Math.random() * 0.02),
        lng: -75.567 + (Math.random() * 0.02),
        neighborhood: "El Poblado"
      },
      metadata: {},
      ai: { matchScore: 98, reasoning: "Top rated for fine dining.", tags: ["Luxury", "Gastronomy"] }
    }));
  }

  if (category === 'TOURIST') {
    return Array.from({ length: count }).map((_, i) => ({
      id: `tourist-${i}`,
      type: 'EXPERIENCE',
      name: i % 2 === 0 ? "Comuna 13 Private Tour" : "Guatapé Helicopter Trip",
      description: "Experience the transformation of Medellín with a local guide.",
      shortDescription: "Culture • 4 Hours",
      images: [
        "https://images.unsplash.com/photo-1662218704415-75f5c569bd28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        "https://images.unsplash.com/photo-1596436889106-be35e843f974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      ],
      rating: 4.9,
      reviewCount: 850,
      priceLevel: 3,
      location: {
        address: "Comuna 13",
        lat: 6.250 + (Math.random() * 0.04),
        lng: -75.600 + (Math.random() * 0.04),
        neighborhood: "San Javier"
      },
      metadata: {},
      ai: { matchScore: 95, reasoning: "Must-do cultural experience.", tags: ["Culture", "History"] }
    }));
  }

  if (category === 'STAYS') {
    return Array.from({ length: count }).map((_, i) => ({
      id: `stay-${i}`,
      type: 'PROPERTY',
      name: "The Click Clack Hotel",
      description: "Design hotel with rooftop pool and mountain views.",
      shortDescription: "Hotel • El Poblado",
      images: [
        "https://images.unsplash.com/photo-1757264119016-7e6b568b810d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      ],
      rating: 4.7,
      reviewCount: 1200,
      priceLevel: 3,
      location: {
        address: "Calle 10B",
        lat: 6.209 + (Math.random() * 0.02),
        lng: -75.565 + (Math.random() * 0.02),
        neighborhood: "El Poblado"
      },
      metadata: {},
      ai: { matchScore: 92, reasoning: "Perfect location for nightlife.", tags: ["Design", "Rooftop"] }
    }));
  }

  if (category === 'LOCATIONS') {
    const neighborhoods = ['El Poblado', 'Laureles', 'Envigado', 'Sabaneta'];
    return Array.from({ length: 4 }).map((_, i) => ({
      id: `loc-${i}`,
      type: 'EXPERIENCE', // Using Experience type for now to render card
      name: neighborhoods[i],
      description: "The heart of nightlife and luxury living in Medellín.",
      shortDescription: "Neighborhood Guide",
      images: [
        "https://images.unsplash.com/photo-1599595604477-96c429780011?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      ],
      rating: 5.0,
      reviewCount: 0,
      priceLevel: 2,
      location: {
        address: "Medellín",
        lat: 6.21 + (Math.random() * 0.05),
        lng: -75.57 + (Math.random() * 0.05),
        neighborhood: neighborhoods[i]
      },
      metadata: {},
      ai: { matchScore: 100, reasoning: "Most popular area for tourists.", tags: ["Neighborhood", "Safe"] }
    }));
  }

  if (category === 'GUIDES') {
    return Array.from({ length: 5 }).map((_, i) => ({
      id: `guide-${i}`,
      type: 'EXPERIENCE',
      name: "72 Hours in Medellín",
      description: "The ultimate itinerary for a long weekend.",
      shortDescription: "Editorial Guide",
      images: [
        "https://images.unsplash.com/photo-1591503487373-c466436e2978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      ],
      rating: 5.0,
      reviewCount: 45,
      priceLevel: 1,
      location: {
        address: "Medellín",
        lat: 6.24 + (Math.random() * 0.05),
        lng: -75.58 + (Math.random() * 0.05),
        neighborhood: "City Wide"
      },
      metadata: {},
      ai: { matchScore: 99, reasoning: "Curated by locals.", tags: ["Editorial", "Itinerary"] }
    }));
  }

  // Default Fallback
  return [];
};

export const ResultsView = () => {
  const { results, ui, setUI, setResults, filters, setIntent, updateFilters } = useWizard();
  const { intent: aiIntent, setIntent: setAiIntent } = useAI();

  // Sync AI Context -> Wizard Context
  // When Chat changes intent, we update our local view
  useEffect(() => {
    // We only sync if they differ and it's a valid category we handle
    const validCategories = CATEGORIES.map(c => c.id);
    if (aiIntent && aiIntent !== filters.intent && validCategories.includes(aiIntent as UserIntent)) {
      setIntent(aiIntent as UserIntent);
    }
  }, [aiIntent, filters.intent, setIntent]);

  // Load initial mock data when intent changes
  useEffect(() => {
    // Enforce default state if GENERAL (per prompt requirements)
    if (filters.intent === 'GENERAL') {
        setIntent('STAYS');
        return;
    }
    const mocks = generateMockResults(filters.intent);
    setResults(mocks);
  }, [filters.intent, setResults, setIntent]);

  const handleToggleView = (mode: 'MAP' | 'LIST' | 'SPLIT') => {
    setUI({ viewMode: mode });
  };

  const handleSelect = (id: string) => {
    setUI({ activeResultId: id });
  };

  const handleCategoryClick = (id: UserIntent) => {
    setIntent(id);
    // Also sync back to AI Context so chat knows where we are
    setAiIntent(id);
  };

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    updateFilters({ tags: newTags });
  };

  const activeVenue = results.find(r => r.id === ui.activeResultId) || null;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] container mx-auto px-4 md:px-6 py-6 gap-6">
      
      {/* --- Header Section (Pills & Filters) --- */}
      <div className="flex flex-col gap-4 shrink-0">
        
        {/* Primary Navigation (Category Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
                filters.intent === cat.id
                  ? "bg-emerald-900 text-white shadow-md transform scale-105"
                  : "bg-white text-emerald-900 border border-border/50 hover:bg-emerald-50 hover:border-emerald-200"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary Filters & Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Filter Tags */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {SECONDARY_FILTERS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap",
                  filters.tags.includes(tag)
                    ? "bg-emerald-100 text-emerald-900 border-emerald-200"
                    : "bg-transparent text-muted-foreground border-border hover:border-emerald-200 hover:text-emerald-900"
                )}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* View Toggle (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-white rounded-lg p-1 border border-border/50 shadow-sm self-start md:self-auto">
            <Button
              variant={ui.viewMode === 'LIST' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleToggleView('LIST')}
              className={cn("h-8 px-3", ui.viewMode === 'LIST' && 'bg-emerald-900 text-white')}
            >
              <List className="w-4 h-4 mr-2" /> List
            </Button>
            <Button
              variant={ui.viewMode === 'SPLIT' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleToggleView('SPLIT')}
              className={cn("h-8 px-3", ui.viewMode === 'SPLIT' && 'bg-emerald-900 text-white')}
            >
              <LayoutGrid className="w-4 h-4 mr-2" /> Split
            </Button>
            <Button
              variant={ui.viewMode === 'MAP' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleToggleView('MAP')}
              className={cn("h-8 px-3", ui.viewMode === 'MAP' && 'bg-emerald-900 text-white')}
            >
              <Map className="w-4 h-4 mr-2" /> Map
            </Button>
          </div>
        </div>
      </div>

      {/* --- Content Area --- */}
      <div className="flex-1 min-h-0 relative border border-border/50 rounded-2xl overflow-hidden bg-white shadow-sm">
        {/* Mobile: Switch between List and Map */}
        <div className="md:hidden h-full flex flex-col">
           {/* Mobile View Toggle */}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex bg-emerald-900 text-white rounded-full shadow-luxury p-1">
              <button 
                onClick={() => handleToggleView('LIST')}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-medium transition-all", 
                  ui.viewMode !== 'MAP' ? "bg-white text-emerald-900" : "hover:bg-emerald-800"
                )}
              >
                List
              </button>
              <button 
                onClick={() => handleToggleView('MAP')}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-medium transition-all", 
                  ui.viewMode === 'MAP' ? "bg-white text-emerald-900" : "hover:bg-emerald-800"
                )}
              >
                Map
              </button>
           </div>

          {ui.viewMode === 'MAP' ? (
            <ResultsMap results={results} activeId={ui.activeResultId} onSelect={handleSelect} />
          ) : (
            <ResultsList results={results} onSelect={handleSelect} />
          )}
        </div>

        {/* Desktop: Split View Logic */}
        <div className="hidden md:flex h-full">
          {ui.viewMode !== 'MAP' && (
            <div className={cn(
              "h-full overflow-hidden transition-all duration-300",
              ui.viewMode === 'SPLIT' ? 'w-1/2 border-r border-border' : 'w-full'
            )}>
              <ResultsList results={results} onSelect={handleSelect} />
            </div>
          )}
          
          {(ui.viewMode === 'MAP' || ui.viewMode === 'SPLIT') && (
            <div className={cn(
              "h-full transition-all duration-300",
              ui.viewMode === 'SPLIT' ? 'w-1/2' : 'w-full'
            )}>
              <ResultsMap results={results} activeId={ui.activeResultId} onSelect={handleSelect} />
            </div>
          )}
        </div>
      </div>

      <VenueDetail 
        venue={activeVenue} 
        isOpen={!!activeVenue} 
        onClose={() => setUI({ activeResultId: null })} 
      />
    </div>
  );
};
