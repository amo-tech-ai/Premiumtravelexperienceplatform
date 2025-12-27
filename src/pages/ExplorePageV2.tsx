/**
 * EXPLORE PAGE V2 - Context-Aware Implementation
 * 
 * Consumes ExplorationContext from Chat → Explore flow
 * Implements PROMPT 1 Week 2 requirements:
 * - Reads context from URL params or SessionStorage
 * - Renders primary intent above the fold
 * - Collapses secondary content by default
 * - Shows AI context banner
 * - Implements graceful fallbacks
 * 
 * @see /docs/01-ai-features/02-context-state-contract.md
 * @see /docs/01-ai-features/PROMPT-1-WEEK-1-COMPLETE.md
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Map as MapIcon, List, X, ChevronDown, ChevronUp, AlertCircle, RefreshCw } from 'lucide-react';
import { PlaceCard } from '../components/explore/PlaceCard';
import { ExploreMap } from '../components/explore/ExploreMap';
import { ExploreFilters } from '../components/explore/ExploreFilters';
import { PlaceDetailDrawer } from '../components/explore/PlaceDetailDrawer';
import { ContextBanner } from '../components/explore/ContextBanner';
import { SecondarySection } from '../components/explore/SecondarySection';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAI } from '../context/AIContext';
import { useTrip } from '../context/TripContext';
import { useMapListSync, useScrollToSelected } from '../context/hooks/useMapListSync';
import { 
  useExplorationContext, 
  parseExploreParams,
  ExplorationIntent,
  ExplorationResult,
} from '../context';
import { cn } from '../components/ui/utils';

/**
 * AI Context Banner Component
 * Shows where the exploration came from and why
 */
function AIContextBanner({ 
  context, 
  onDismiss 
}: { 
  context: any; 
  onDismiss: () => void;
}) {
  if (!context || context.source !== 'ai') return null;

  return <ContextBanner context={context} onDismiss={onDismiss} />;
}

/**
 * Secondary Results Section Component
 * Shows events, attractions, rentals near primary results
 */
function SecondaryResultsSection({
  intent,
  results,
  isExpanded,
  onToggle,
  isSaved,
  onPlaceClick,
  onToggleSave,
  onAdd,
}: {
  intent: string;
  results: ExplorationResult[];
  isExpanded: boolean;
  onToggle: () => void;
  isSaved: (id: string) => boolean;
  onPlaceClick: (id: string) => void;
  onToggleSave: (e: React.MouseEvent | null, place: any) => void;
  onAdd: (e: React.MouseEvent | null, place: any) => void;
}) {
  const sectionConfig = {
    events: {
      title: 'Events near these restaurants',
      type: 'events' as const,
      emptyMessage: 'No events tonight near these spots — weekend options available',
    },
    attractions: {
      title: 'Things to do nearby',
      type: 'attractions' as const,
      emptyMessage: 'No major attractions within walking distance',
    },
    rentals: {
      title: 'Stays within walking distance',
      type: 'rentals' as const,
      emptyMessage: 'No vacation rentals in this immediate area',
    },
  };

  const config = sectionConfig[intent as keyof typeof sectionConfig];
  if (!config) return null;

  return (
    <SecondarySection
      title={config.title}
      type={config.type}
      results={results}
      defaultExpanded={isExpanded}
      onResultClick={onPlaceClick}
      emptyMessage={config.emptyMessage}
    />
  );
}

/**
 * Main Explore Page Component
 */
export default function ExplorePageV2() {
  const [searchParams] = useSearchParams();
  const { savedItems, saveItem, removeItem, injectMessage, toggleOpen } = useAI();
  const { addToTrip } = useTrip();

  // Parse route params
  const routeParams = parseExploreParams(searchParams);

  // Load exploration context
  const {
    context,
    isLoading,
    error,
    getPrimaryResults,
    getSecondaryResults,
    getPins,
    getMapCenter,
    clearContext,
  } = useExplorationContext({
    contextId: routeParams.contextId,
    autoLoad: true,
  });

  // Local state
  const [activeFilter, setActiveFilter] = useState('For You');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Get results from context
  const primaryResults = getPrimaryResults();
  const secondaryIntents = context?.secondaryIntents || [];

  // Helper to check if saved
  const isSaved = (id: string) => savedItems.some((i) => i.id === id);

  // Action Handlers
  const handleToggleSave = (e: React.MouseEvent | null, place: any) => {
    e?.stopPropagation();

    if (isSaved(place.id)) {
      removeItem(place.id);
    } else {
      saveItem({
        id: place.id,
        type: place.type === 'rentals' ? 'property' : 'experience',
        title: place.name || place.title,
        image: place.imageUrl || place.image,
        price: place.price,
        location: place.location?.address || context?.area?.name || 'Unknown',
        lat: place.location?.lat || place.lat,
        lng: place.location?.lng || place.lng,
        notes: place.description,
      });
    }
  };

  const handleAdd = (e: React.MouseEvent | null, place: any) => {
    e?.stopPropagation();
    const type = place.type === 'rentals' ? 'stay' : place.type === 'restaurants' ? 'event' : 'experience';
    addToTrip(place, type);
  };

  const handleAskAI = (place: any) => {
    setIsDrawerOpen(false);
    injectMessage(
      `Tell me more about ${place.name || place.title}. Is it a good choice?`,
      'user',
      'GENERAL'
    );
    toggleOpen();
  };

  const handlePlaceClick = (id: string) => {
    setActivePlaceId(id);
    setIsDrawerOpen(true);
  };

  const handleStartExploring = () => {
    // Navigate to AI concierge
    toggleOpen();
  };

  const handleRefresh = () => {
    clearContext();
    window.location.href = '/explore';
  };

  const toggleSecondarySection = (intent: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(intent)) {
      newExpanded.delete(intent);
    } else {
      newExpanded.add(intent);
    }
    setExpandedSections(newExpanded);
  };

  // Find active place
  const activePlace = primaryResults.find((p) => p.id === activePlaceId) || 
    secondaryIntents.flatMap(intent => getSecondaryResults(intent)).find((p) => p.id === activePlaceId);

  // Filter logic (applies to context results)
  const filteredPrimaryResults = useMemo(() => {
    if (!searchQuery) return primaryResults;

    const query = searchQuery.toLowerCase();
    return primaryResults.filter((place) =>
      place.name.toLowerCase().includes(query) ||
      place.description?.toLowerCase().includes(query)
    );
  }, [primaryResults, searchQuery]);

  // Map data
  const mapPins = getPins();
  const mapCenter = getMapCenter();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading exploration context...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-white px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-3">
            Something went wrong
          </h2>
          <p className="text-slate-600 mb-6">{error.message}</p>
          <Button onClick={handleRefresh}>Start Fresh</Button>
        </div>
      </div>
    );
  }

  // Handle expired context
  if (context && new Date() > new Date(context.expiresAt)) {
    return (
      <div className="flex h-screen bg-white">
        <div className="flex-1 flex flex-col">
          <ExpiredContextState onRefresh={handleRefresh} />
          <EmptyExploreState onStartExploring={handleStartExploring} />
        </div>
      </div>
    );
  }

  // Handle no context (manual exploration)
  if (!context) {
    return (
      <div className="flex h-screen bg-white">
        <div className="flex-1 flex flex-col">
          <EmptyExploreState onStartExploring={handleStartExploring} />
        </div>
      </div>
    );
  }

  const intentLabel = {
    restaurants: 'Restaurants',
    events: 'Events',
    rentals: 'Vacation Rentals',
    destinations: 'Destinations',
    activities: 'Activities',
    mixed: 'Recommendations',
  }[context.intent] || 'Places';

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* CENTER CONTENT FEED */}
      <div className="flex-1 flex flex-col h-full bg-white relative z-10 w-full min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-100 sticky top-0 bg-white z-30">
          <span className="font-serif text-lg font-bold">Explore</span>
          <Button variant="ghost" size="sm">
            <List className="w-5 h-5" />
          </Button>
        </div>

        <ExploreFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onSearch={setSearchQuery}
        />

        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20 lg:pb-0">
          {/* AI Context Banner */}
          {showBanner && context.source === 'ai' && (
            <AIContextBanner context={context} onDismiss={() => setShowBanner(false)} />
          )}

          {/* Primary Results Section */}
          <div className="px-4 md:px-6 space-y-10 pb-12">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900">{intentLabel}</h2>
                  {context.source === 'ai' && (
                    <p className="text-sm text-slate-500 mt-1">
                      {filteredPrimaryResults.length} AI-recommended {filteredPrimaryResults.length === 1 ? 'place' : 'places'}
                    </p>
                  )}
                </div>
              </div>

              {/* Primary Results Grid */}
              {filteredPrimaryResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredPrimaryResults.map((result) => (
                    <PlaceCard
                      key={result.id}
                      id={result.id}
                      title={result.name}
                      category={result.type}
                      rating={result.rating}
                      reviews={0}
                      price={result.priceLevel ? '$'.repeat(result.priceLevel) : undefined}
                      priceLevel={result.priceLevel}
                      images={result.imageUrl ? [result.imageUrl] : []}
                      image={result.imageUrl}
                      lat={result.location.lat}
                      lng={result.location.lng}
                      tags={[]}
                      aiHint={context.source === 'ai' ? 'AI recommended' : undefined}
                      distance={result.distance ? `${(result.distance / 1609).toFixed(1)} mi` : undefined}
                      isOpen={true}
                      isSaved={isSaved(result.id)}
                      layout="vertical"
                      onClick={() => handlePlaceClick(result.id)}
                      onToggleSave={(e) => handleToggleSave(e, result)}
                      onAdd={(e) => handleAdd(e, result)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400">No results match your search.</p>
                  <Button variant="link" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                </div>
              )}
            </div>

            {/* Secondary Results Sections (Collapsed by default) */}
            {secondaryIntents.map((intent) => {
              const secondaryResults = getSecondaryResults(intent);
              return (
                <SecondaryResultsSection
                  key={intent}
                  intent={intent}
                  results={secondaryResults}
                  isExpanded={expandedSections.has(intent)}
                  onToggle={() => toggleSecondarySection(intent)}
                  isSaved={isSaved}
                  onPlaceClick={handlePlaceClick}
                  onToggleSave={handleToggleSave}
                  onAdd={handleAdd}
                />
              );
            })}
          </div>
        </div>

        {/* Mobile Map Toggle */}
        <div className="lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
          <Button
            onClick={() => setShowMobileMap(true)}
            className="rounded-full shadow-2xl bg-slate-900 text-white px-6 h-12 flex items-center gap-2 hover:bg-emerald-900 transform transition-transform hover:scale-105"
          >
            <MapIcon className="w-4 h-4" />
            Map View
          </Button>
        </div>
      </div>

      {/* RIGHT PANE: Map (Desktop) */}
      <div className="hidden lg:block w-[400px] xl:w-[500px] flex-shrink-0 h-full relative border-l border-slate-200">
        <ExploreMap
          places={filteredPrimaryResults}
          activePlaceId={activePlaceId}
          onPinClick={handlePlaceClick}
        />
      </div>

      {/* DETAIL DRAWER (Overlay) */}
      <AnimatePresence>
        {isDrawerOpen && activePlace && (
          <PlaceDetailDrawer
            place={{
              id: activePlace.id,
              title: activePlace.name,
              category: activePlace.type,
              rating: activePlace.rating,
              reviews: 0,
              price: activePlace.priceLevel ? '$'.repeat(activePlace.priceLevel) : undefined,
              priceLevel: activePlace.priceLevel,
              images: activePlace.imageUrl ? [activePlace.imageUrl] : [],
              image: activePlace.imageUrl,
              lat: activePlace.location.lat,
              lng: activePlace.location.lng,
              tags: [],
              distance: activePlace.distance ? `${(activePlace.distance / 1609).toFixed(1)} mi` : undefined,
              isOpen: true,
            }}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            isSaved={isSaved(activePlace.id)}
            onToggleSave={() => handleToggleSave(null, activePlace)}
            onAskAI={() => handleAskAI(activePlace)}
          />
        )}
      </AnimatePresence>

      {/* MOBILE MAP OVERLAY */}
      <AnimatePresence>
        {showMobileMap && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-white lg:hidden flex flex-col"
          >
            <div className="relative flex-1">
              <ExploreMap
                places={filteredPrimaryResults}
                activePlaceId={activePlaceId}
                onPinClick={setActivePlaceId}
              />

              {/* Close Button */}
              <button
                onClick={() => setShowMobileMap(false)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg text-slate-900 z-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-white border-t border-slate-100 p-4 pb-8 flex justify-center">
              <Button variant="outline" onClick={() => setShowMobileMap(false)} className="gap-2 rounded-full">
                <List className="w-4 h-4" /> Show List
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// FALLBACK STATE COMPONENTS
// ============================================================================

/**
 * Empty Explore State
 * Shown when no context is available
 */
function EmptyExploreState({ onStartExploring }: { onStartExploring: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-3">
          Start Exploring
        </h2>
        <p className="text-slate-600 mb-6 leading-relaxed">
          Tell me what you're looking for and I'll find the perfect places for you.
        </p>
        <Button onClick={onStartExploring} className="gap-2">
          <Sparkles className="w-4 h-4" />
          Ask AI Concierge
        </Button>
      </div>
    </div>
  );
}

/**
 * Expired Context State
 * Shown when context has expired (>2 hours old)
 */
function ExpiredContextState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="border-b border-slate-100 bg-amber-50 px-6 py-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-amber-900 font-medium">
            This exploration context has expired
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Start a new search or refresh to see updated recommendations.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}