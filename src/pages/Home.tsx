import React from 'react';
import { Link } from 'react-router';
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
      {/* Version Switcher - Fixed position */}
      <div className="fixed top-20 right-6 z-50">
        <Link 
          to="/home-v2"
          className="bg-gradient-to-r from-[#D4AF37] to-[#CD7F32] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-semibold text-sm flex items-center gap-2"
        >
          ✨ Preview Home V2
        </Link>
      </div>

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