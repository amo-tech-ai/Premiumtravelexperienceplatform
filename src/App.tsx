import './styles/globals.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router';
import { Toaster } from 'sonner@2.0.3';
import { TripProvider } from './context/TripContext';
import { WizardProvider } from './context/WizardContext';
import { registerServiceWorker } from './utils/serviceWorker';
import { getAnalyticsService } from './lib/services/analytics';
import config from './config/runtime';
import { useEffect } from 'react';

import Home from './pages/Home';
import HomeV2 from './pages/HomeV2';
import HomeV3 from './pages/HomeV3';
import SliderDemo from './pages/SliderDemo';
import MedellinExperiencesPage from './pages/MedellinExperiences';
import ExperienceDetailPage from './pages/ExperienceDetail';
import ExperiencesIndex from './pages/ExperiencesIndex';
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
import { AIWizardBridge } from './components/ai/AIWizardBridge';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { AppShell } from './components/layout/AppShell';

import OldRestaurantDetailPage from './pages/RestaurantDetail';
import OldEventDetailPage from './pages/EventDetail';
import StyleGuidePage from './pages/StyleGuide';
import ArchitecturePage from './pages/Architecture'; // Internal Docs
import HowItWorksPage from './pages/HowItWorks'; // Public Page
import HowItWorksV2 from './pages/HowItWorksV2'; // Detailed Walkthrough
import Dashboard from './pages/Dashboard';
import TripDiscoveryDashboard from './pages/TripDiscoveryDashboard';
import ExplorePage from './pages/ExplorePage';
import ExplorePageV2 from './pages/ExplorePageV2';
import SavedPlacesPage from './pages/saved/SavedPlacesPage';
import TripDetailsPage from './pages/trip/TripDetailsPage';
import ChatsPage from './pages/ChatsPage';
import ChatbotPage from './pages/ChatbotPage';
import ChatbotV2 from './pages/ChatbotV2';
import TabNavigationDemo from './pages/TabNavigationDemo';
import ProductionStatus from './pages/ProductionStatus';
import { InstallPrompt } from './components/pwa/InstallPrompt';
import FeatureGallery from './pages/FeatureGallery';
import AdvancedAIDemo from './components/ai/AdvancedAIDemo';

// New App Pages
import TripsPage from './pages/app/TripsPage';
import ConciergePage from './pages/app/ConciergePage';
import TripDetailPage from './pages/app/TripDetailPage';
import WhatsNewPage from './pages/WhatsNew';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Events, Restaurants, Rentals imports
import EventsPage from './pages/events/EventsPage';
import EventDetailPage from './pages/events/EventDetailPage';
import CreateEventPage from './pages/events/CreateEventPage';
import RestaurantsPage from './pages/restaurants/RestaurantsPage';
import RestaurantDetailPage from './pages/restaurants/RestaurantDetailPage';
import CreateRestaurantPage from './pages/restaurants/CreateRestaurantPage';
import RentalsPage from './pages/rentals/RentalsPage';
import RentalDetailPage from './pages/rentals/RentalDetailPage';
import CreateRentalPage from './pages/rentals/CreateRentalPage';
import { RequireAuth } from './components/auth/RequireAuth';

// V2 Trip System
import { TripV2Provider } from './v2/context/TripV2Context';
import { AIV2Provider } from './v2/context/AIV2Context';
import { AnalyticsV2Provider } from './v2/context/AnalyticsV2Context';
import { BottomNavigation } from './v2/components/mobile/BottomNavigation';
import TripsHubPage from './v2/pages/TripsHubPage';
import CreateTripWizardPage from './v2/pages/CreateTripWizardPage';
import TripCommandCenterPage from './v2/pages/TripCommandCenterPage';
import ItineraryBuilderPage from './v2/pages/ItineraryBuilderPage';

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
        if (registration && config.isDev) {
          console.log('✓ Service worker registered successfully');
        }
      })
      .catch((error) => {
        // Silent fail - service worker is optional
        if (config.isDev) {
          console.log('Service worker not available:', error?.message || 'Unknown error');
        }
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
              <TripV2Provider>
                <ErrorBoundary>
                  <AIV2Provider>
                    <ErrorBoundary>
                      <AnalyticsV2Provider>
                        <ErrorBoundary>
                          <TripProvider>
                            <ErrorBoundary>
                              <WizardProvider>
                                <ScrollToTop />
                                <ServiceInitializer />
                                <AppShell>
                                  <Routes>
                                    {/* V2 Trip System - MUST be BEFORE other trip routes */}
                                    <Route path="/v2/trips" element={<TripsHubPage />} />
                                    <Route path="/v2/trips/new" element={<CreateTripWizardPage />} />
                                    <Route path="/v2/trips/:tripId" element={<TripCommandCenterPage />} />
                                    <Route path="/v2/trips/:tripId/itinerary" element={<ItineraryBuilderPage />} />
                                    
                                    <Route path="/" element={<Home />} />
                                    <Route path="/home-v2" element={<HomeV2 />} />
                                    <Route path="/home-v3" element={<HomeV3 />} />
                                    <Route path="/experiences" element={<ExperiencesIndex />} />
                                    <Route path="/experiences/medellin" element={<MedellinExperiencesPage />} />
                                    <Route path="/map" element={<Explorer />} />
                                    <Route path="/concierge" element={<Concierge />} />
                                    <Route path="/wizard/:category" element={<WizardFlow />} />
                                    <Route path="/results" element={<Results />} />
                                    {/* Legacy route - kept for backwards compatibility, redirects handled in component */}
                                    <Route path="/experiences/:id" element={<OldEventDetailPage />} />
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
                                    <Route path="/slider-demo" element={<SliderDemo />} />
                                    <Route path="/tab-nav-demo" element={<TabNavigationDemo />} />
                                    
                                    {/* Events Routes - /create BEFORE /:eventId to avoid shadowing */}
                                    <Route path="/events" element={<EventsPage />} />
                                    <Route path="/events/create" element={<RequireAuth><CreateEventPage /></RequireAuth>} />
                                    <Route path="/events/:eventId" element={<EventDetailPage />} />
                                    
                                    {/* Restaurants Routes - /create BEFORE /:restaurantId to avoid shadowing */}
                                    <Route path="/restaurants" element={<RestaurantsPage />} />
                                    <Route path="/restaurants/create" element={<RequireAuth><CreateRestaurantPage /></RequireAuth>} />
                                    <Route path="/restaurants/:restaurantId" element={<RestaurantDetailPage />} />
                                    
                                    {/* Rentals Routes - /create BEFORE /:rentalId to avoid shadowing */}
                                    <Route path="/rentals" element={<RentalsPage />} />
                                    <Route path="/rentals/create" element={<RequireAuth><CreateRentalPage /></RequireAuth>} />
                                    <Route path="/rentals/:rentalId" element={<RentalDetailPage />} />
                                    
                                    {/* New Routes Alias */}
                                    <Route path="/explore" element={<ExplorePage />} />
                                    <Route path="/explore-v2" element={<ExplorePageV2 />} />
                                    <Route path="/chats" element={<ChatsPage />} />
                                    <Route path="/chatbot" element={<ChatbotPage />} />
                                    <Route path="/chatbot-v2" element={<ChatbotV2 />} />
                                    <Route path="/itineraries" element={<Dashboard />} />
                                    <Route path="/saved" element={<SavedPlacesPage />} />
                                    <Route path="/collections" element={<SavedPlacesPage />} />
                                    <Route path="/trip/:id" element={<TripDetailsPage />} />
                                    <Route path="/profile" element={<Dashboard />} />

                                    {/* New App Pages */}
                                    <Route path="/app/trips" element={<TripsPage />} />
                                    <Route path="/app/concierge" element={<ConciergePage />} />
                                    <Route path="/app/trip/:id" element={<TripDetailPage />} />
                                    <Route path="/app/whats-new" element={<WhatsNewPage />} />

                                    {/* Legal Pages */}
                                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                    <Route path="/terms-of-service" element={<TermsOfService />} />

                                    {/* 404 Route */}
                                    <Route path="*" element={<NotFound />} />
                                  </Routes>
                                  <AIWizardBridge />
                                </AppShell>
                                <BottomNavigation />
                                <InstallPrompt />
                                <Toaster position="top-right" richColors />
                              </WizardProvider>
                            </ErrorBoundary>
                          </TripProvider>
                        </ErrorBoundary>
                      </AnalyticsV2Provider>
                    </ErrorBoundary>
                  </AIV2Provider>
                </ErrorBoundary>
              </TripV2Provider>
            </ErrorBoundary>
          </AIProvider>
        </ErrorBoundary>
      </Router>
    </ErrorBoundary>
  );
}

export default App;