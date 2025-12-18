import React from 'react';
import { DetailHero } from '../components/experiences/DetailHero';
import { QuickFacts } from '../components/experiences/QuickFacts';
import { VisualStory } from '../components/experiences/VisualStory';
import { ExperienceGallery } from '../components/experiences/ExperienceGallery';
import { Amenities } from '../components/experiences/Amenities';
import { TrustIndicators } from '../components/experiences/TrustIndicators';
import { ExperienceGrid } from '../components/experiences/ExperienceGrid'; 
import { BookingCard } from '../components/experiences/BookingCard';
import { SubscribeSection } from '../components/layout/SubscribeSection';
import { Waves, Martini, Mountain, Sun } from 'lucide-react';

const ExperienceDetailPage = () => {
  // Mock Data for "La Deriva"
  const heroData = {
    title: "La Deriva – Click Clack",
    location: "Rooftop · El Poblado, Medellín",
    description: "A refined rooftop escape blending modern design, panoramic city views, and relaxed elegance atop the Click Clack Hotel.",
    image: "https://images.unsplash.com/photo-1623298460174-371443cc45f0?q=80&w=1920&auto=format&fit=crop"
  };

  const facts = [
    { icon: Waves, label: "Rooftop Pool" },
    { icon: Martini, label: "Craft Cocktails" },
    { icon: Mountain, label: "City Views" },
    { icon: Sun, label: "Sunset Lounge" },
  ];

  const stories = [
    {
      title: "The Vibe",
      text: "Ascend to the top of Click Clack and leave the bustling streets behind. La Deriva offers a sanctuary of cool blues and warm woods, designed to frame the stunning Aburrá Valley. Whether you're soaking up the afternoon sun or watching the city lights flicker on, the atmosphere is always effortlessly chic.",
      image: "https://images.unsplash.com/photo-1759038085935-b2f14c2c04a7?q=80&w=1080&auto=format&fit=crop",
      reversed: false
    },
    {
      title: "The Taste",
      text: "Our mixologists craft cocktails that tell a story of Colombian biodiversity, using local fruits and premium spirits. Pair your drink with a selection of gourmet bites, from fresh ceviche to artisanal sliders, all prepared with the freshest ingredients sourced from nearby farms.",
      image: "https://images.unsplash.com/photo-1564947774160-532ef016eaa6?q=80&w=1080&auto=format&fit=crop",
      reversed: true
    }
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1623298460174-371443cc45f0?q=80&w=800",
    "https://images.unsplash.com/photo-1564947774160-532ef016eaa6?q=80&w=800",
    "https://images.unsplash.com/photo-1720630275162-eb3734164d05?q=80&w=800",
    "https://images.unsplash.com/photo-1759038085935-b2f14c2c04a7?q=80&w=800",
    "https://images.unsplash.com/photo-1755811248279-1ab13b7d4384?q=80&w=800",
  ];

  const amenities = [
    "Swimming Pool", "Towel Service", "Full Bar", "Gourmet Kitchen", "Free Wi-Fi", "Valet Parking", "Live DJ (Weekends)", "VIP Tables"
  ];

  const schedule = {
    days: "Monday - Sunday",
    hours: "10:00 AM - 1:00 AM",
    notes: "Pool access is prioritized for hotel guests until 2 PM. Reservations recommended for sunset hours."
  };

  return (
    <div className="bg-background">
      <DetailHero {...heroData} />
      
      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-12 lg:space-y-24">
            <QuickFacts facts={facts} />
            
            <div className="space-y-0">
              {stories.map((story, idx) => (
                <VisualStory key={idx} {...story} />
              ))}
            </div>

            <Amenities amenities={amenities} schedule={schedule} />
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 relative">
             <div className="sticky top-32">
               <BookingCard />
             </div>
          </div>

        </div>
      </div>

      <ExperienceGallery images={galleryImages} />
      <TrustIndicators />
      
      <div className="bg-slate-50 py-24 border-t border-slate-200">
          <div className="container mx-auto px-6 lg:px-12 mb-12 text-center">
              <h2 className="text-3xl font-serif text-slate-900">You Might Also Like</h2>
          </div>
          <ExperienceGrid />
      </div>

      <SubscribeSection />
    </div>
  );
};


export default ExperienceDetailPage;
