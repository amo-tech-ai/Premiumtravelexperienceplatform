import React from 'react';
import { LuxuryHero } from '../components/home/LuxuryHero';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { CuratedCategories } from '../components/home/CuratedCategories';
import { StatsSection } from '../components/landing/StatsSection';
import { PreFooterCTA } from '../components/landing/PreFooterCTA';

// New luxury homepage sections
import { HeroSection } from '../components/home-v2/HeroSection';
import { HowItWorksSection as HowItWorksV2 } from '../components/home-v2/HowItWorksSection';
import { RecommendationsSection } from '../components/home-v2/RecommendationsSection';
import { GetInspiredGallery } from '../components/home-v2/GetInspiredGallery';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* New Luxury Design */}
      <HeroSection />
      <HowItWorksV2 />
      <RecommendationsSection />
      <GetInspiredGallery />
      
      {/* Keep existing sections */}
      <CuratedCategories />
      <StatsSection />
      <PreFooterCTA />
    </div>
  );
};

export default Home;