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
import { ChatOverlay } from './components/wizard/ChatOverlay';

import { AppShell } from './components/layout/AppShell';

import RestaurantDetailPage from './pages/RestaurantDetail';
import EventDetailPage from './pages/EventDetail';
import StyleGuidePage from './pages/StyleGuide';
import ArchitecturePage from './pages/Architecture';
import Dashboard from './pages/Dashboard';

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
            
            {/* Design System */}
            <Route path="/style-guide" element={<StyleGuidePage />} />
            <Route path="/how-it-works" element={<ArchitecturePage />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatOverlay />
        </AppShell>
        </WizardProvider>
      </AIProvider>
    </Router>
  );
}

export default App;
