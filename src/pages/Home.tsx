import React from 'react';
import { LuxuryHero } from '../components/home/LuxuryHero';
import { HowItWorksFlow } from '../components/home/HowItWorksFlow';
import { CuratedCategories } from '../components/home/CuratedCategories';
import { StatsSection } from '../components/landing/StatsSection';
import { PreFooterCTA } from '../components/landing/PreFooterCTA';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <LuxuryHero />
      <HowItWorksFlow />
      <CuratedCategories />
      <StatsSection />
      <PreFooterCTA />
    </div>
  );
};

export default Home;
