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
import { AIProvider } from './context/AIContext';
import { WizardProvider } from './context/WizardContext';
import { TripProvider } from './context/TripContext';
import { ChatOverlay } from './components/wizard/ChatOverlay';
import { AIWizardBridge } from './components/ai/AIWizardBridge';

import { AppShell } from './components/layout/AppShell';

import RestaurantDetailPage from './pages/RestaurantDetail';
import EventDetailPage from './pages/EventDetail';
import StyleGuidePage from './pages/StyleGuide';
import ArchitecturePage from './pages/Architecture'; // Internal Docs
import HowItWorksPage from './pages/HowItWorks'; // Public Page
import Dashboard from './pages/Dashboard';
import TripDiscoveryDashboard from './pages/TripDiscoveryDashboard';
import ExplorePage from './pages/ExplorePage';

// ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <AIProvider>
        <TripProvider>
          <WizardProvider>
            <ScrollToTop />
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
            <Route path="/dashboard" element={<Dashboard />} />

            {/* New Routes Alias */}
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/ai" element={<Concierge />} />
            <Route path="/itineraries" element={<Dashboard />} />
            <Route path="/events" element={<ExplorePage />} />
            <Route path="/collections" element={<ExplorePage />} />
            <Route path="/trip/:id" element={<TripDiscoveryDashboard />} />
            <Route path="/profile" element={<Dashboard />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatOverlay />
          <AIWizardBridge />
        </AppShell>
        </WizardProvider>
      </TripProvider>
      </AIProvider>
    </Router>
  );
}

export default App;
