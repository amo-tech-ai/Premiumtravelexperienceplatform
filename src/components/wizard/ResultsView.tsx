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
import { MockEngine } from '../../utils/mockEngine';

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
    
    // Use the Mock Engine
    const mocks = MockEngine.search(filters);
    setResults(mocks);
  }, [filters, setResults, setIntent]); // React to ALL filter changes now

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
