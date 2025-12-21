import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import MedellinExperiencesPage from './pages/MedellinExperiences';
import ExperienceDetailPage from './pages/ExperienceDetail';
import Explorer from './pages/Explorer';
import Concierge from './pages/Concierge';
import RealEstateHome from './pages/real-estate/RealEstateHome';
import PropertySearch from './pages/real-estate/PropertySearch';
import PropertyDetail from './pages/real-estate/PropertyDetail';
import MarketInsights from './pages/real-estate/MarketInsights';
import ItineraryWizard from './pages/ItineraryWizard';
import NotFound from './pages/NotFound';
import Results from './pages/Results';
import WizardFlow from './pages/WizardFlow';
import Pricing from './pages/Pricing';
import UseCasesIndex from './pages/use-cases/UseCasesIndex';
import DigitalNomadPage from './pages/use-cases/DigitalNomadPage';
import LuxuryTravelerPage from './pages/use-cases/LuxuryTravelerPage';
import GroupTripPage from './pages/use-cases/GroupTripPage';
import { AIProvider } from './context/AIContext';
import { WizardProvider } from './context/WizardContext';
import { TripProvider } from './context/TripContext';
import { AIWizardBridge } from './components/ai/AIWizardBridge';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { AppShell } from './components/layout/AppShell';

import RestaurantDetailPage from './pages/RestaurantDetail';
import EventDetailPage from './pages/EventDetail';
import StyleGuidePage from './pages/StyleGuide';
import ArchitecturePage from './pages/Architecture'; // Internal Docs
import HowItWorksPage from './pages/HowItWorks'; // Public Page
import HowItWorksV2 from './pages/HowItWorksV2'; // Detailed Walkthrough
import Dashboard from './pages/Dashboard';
import TripDiscoveryDashboard from './pages/TripDiscoveryDashboard';
import ExplorePage from './pages/ExplorePage';
import SavedPlacesPage from './pages/saved/SavedPlacesPage';
import TripDetailsPage from './pages/trip/TripDetailsPage';
import ChatsPage from './pages/ChatsPage';
import ProductionStatus from './pages/ProductionStatus';
import { InstallPrompt } from './components/pwa/InstallPrompt';
import { registerServiceWorker } from './lib/services/pwa';
import { getAnalyticsService } from './lib/services/analytics';
import FeatureGallery from './pages/FeatureGallery';
import AdvancedAIDemo from './components/ai/AdvancedAIDemo';

// ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Initialize services component
const ServiceInitializer = () => {
  useEffect(() => {
    // Register service worker for PWA support (gracefully fails in unsupported environments)
    registerServiceWorker()
      .then((registration) => {
        if (registration) {
          console.log('✓ Service worker registered successfully');
        }
      })
      .catch((error) => {
        // Silent fail - service worker is optional
        console.log('Service worker not available:', error?.message || 'Unknown error');
      });

    // Initialize analytics
    const analytics = getAnalyticsService();
    analytics.trackPageView(window.location.pathname, document.title);

    // Track page views on route changes
    const handleRouteChange = () => {
      analytics.trackPageView(window.location.pathname, document.title);
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ErrorBoundary>
          <AIProvider>
            <ErrorBoundary>
              <TripProvider>
                <ErrorBoundary>
                  <WizardProvider>
                    <ScrollToTop />
                    <ServiceInitializer />
                    <AppShell>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/experiences/medellin" element={<MedellinExperiencesPage />} />
                        <Route path="/map" element={<Explorer />} />
                        <Route path="/concierge" element={<Concierge />} />
                        <Route path="/wizard/:category" element={<WizardFlow />} />
                        <Route path="/results" element={<Results />} />
                        <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
                        <Route path="/experiences/:id" element={<EventDetailPage />} />
                        <Route path="/experiences/medellin/la-deriva" element={<ExperienceDetailPage />} />
                        
                        {/* Real Estate Routes */}
                        <Route path="/real-estate" element={<RealEstateHome />} />
                        <Route path="/real-estate/search" element={<PropertySearch />} />
                        <Route path="/real-estate/listing/:id" element={<PropertyDetail />} />
                        <Route path="/real-estate/market-data" element={<MarketInsights />} />
                        
                        {/* Itinerary Route */}
                        <Route path="/itinerary" element={<ItineraryWizard />} />
                        <Route path="/itinerary/new" element={<ItineraryWizard />} />
                        
                        {/* Design System & Info */}
                        <Route path="/style-guide" element={<StyleGuidePage />} />
                        <Route path="/architecture" element={<ArchitecturePage />} />
                        <Route path="/how-it-works" element={<HowItWorksPage />} />
                        <Route path="/how-it-works-v2" element={<HowItWorksV2 />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/use-cases" element={<UseCasesIndex />} />
                        <Route path="/use-cases/digital-nomad" element={<DigitalNomadPage />} />
                        <Route path="/use-cases/luxury-traveler" element={<LuxuryTravelerPage />} />
                        <Route path="/use-cases/group-trip" element={<GroupTripPage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/status" element={<ProductionStatus />} />
                        
                        {/* Feature Gallery & AI Demo */}
                        <Route path="/features" element={<FeatureGallery />} />
                        <Route path="/ai-demo" element={<AdvancedAIDemo />} />
                        
                        {/* New Routes Alias */}
                        <Route path="/explore" element={<ExplorePage />} />
                        <Route path="/chats" element={<ChatsPage />} />
                        <Route path="/itineraries" element={<Dashboard />} />
                        <Route path="/events" element={<ExplorePage />} />
                        <Route path="/saved" element={<SavedPlacesPage />} />
                        <Route path="/collections" element={<SavedPlacesPage />} />
                        <Route path="/trip/:id" element={<TripDetailsPage />} />
                        <Route path="/profile" element={<Dashboard />} />

                        {/* 404 Route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <AIWizardBridge />
                    </AppShell>
                    <InstallPrompt />
                  </WizardProvider>
                </ErrorBoundary>
              </TripProvider>
            </ErrorBoundary>
          </AIProvider>
        </ErrorBoundary>
      </Router>
    </ErrorBoundary>
  );
}

export default App;