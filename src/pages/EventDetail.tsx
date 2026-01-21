import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { DetailHero } from '../components/experiences/DetailHero';
import { QuickFacts } from '../components/experiences/QuickFacts';
import { VisualStory } from '../components/experiences/VisualStory';
import { DetailBookingCard } from '../components/booking/DetailBookingCard';
import { MobileBookingBar } from '../components/booking/MobileBookingBar';
import { SubscribeSection } from '../components/layout/SubscribeSection';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { MOCK_EVENT_RESULTS } from '../components/ai/MockData';
import { ExperienceCard } from '../components/ui/ExperienceCard';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find data or fallback to first item
  const data = MOCK_EVENT_RESULTS.find(d => d.id === id) || MOCK_EVENT_RESULTS[0];

  const heroData = {
    title: data.title,
    location: `${data.location}, Medellín`,
    description: "Immerse yourself in the vibrant culture of Medellín with this exclusive experience. Curated for those who seek authenticity and style.",
    image: data.image
  };

  const facts = [
    { icon: Calendar, label: "Daily" },
    { icon: Clock, label: "4 Hours" },
    { icon: MapPin, label: data.location || "Medellín" },
    { icon: Users, label: "Small Group" },
  ];

  const stories = [
    {
      title: "The Experience",
      text: "Go beyond the guidebooks. This experience is designed to give you an insider's look at the real Medellín. Whether it's the rhythm of salsa or the history of the streets, you'll connect with the city on a deeper level.",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1080&auto=format&fit=crop",
      reversed: false
    },
    {
      title: "What to Expect",
      text: "Expect professional guides, seamless logistics, and VIP treatment. We handle all the details so you can focus on making memories. Includes transportation, refreshments, and exclusive access.",
      image: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80&w=1080&auto=format&fit=crop",
      reversed: true
    }
  ];

  // Filter out current item for related list
  const relatedItems = MOCK_EVENT_RESULTS.filter(item => item.id !== data.id).slice(0, 2);

  return (
    <div className="bg-white">
      <DetailHero {...heroData} />
      
      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12 lg:space-y-24">
            <QuickFacts facts={facts} />
            
            <div className="space-y-0">
              {stories.map((story, idx) => (
                <VisualStory key={idx} {...story} />
              ))}
            </div>
            
            {/* Itinerary Section */}
            <div className="py-12 border-t border-slate-100">
                <h3 className="font-serif text-3xl text-slate-900 mb-8">Itinerary Highlights</h3>
                <ul className="space-y-6 border-l-2 border-emerald-900/10 ml-3 pl-8">
                    <li className="relative">
                        <span className="absolute -left-[39px] w-5 h-5 rounded-full bg-emerald-900 border-4 border-white shadow-sm"></span>
                        <h4 className="font-semibold text-slate-900">Pickup</h4>
                        <p className="text-slate-500 text-sm">Luxury transport from your hotel.</p>
                    </li>
                    <li className="relative">
                        <span className="absolute -left-[39px] w-5 h-5 rounded-full bg-emerald-200 border-4 border-white shadow-sm"></span>
                        <h4 className="font-semibold text-slate-900">Guided Tour</h4>
                        <p className="text-slate-500 text-sm">Expert led exploration of key sites.</p>
                    </li>
                    <li className="relative">
                        <span className="absolute -left-[39px] w-5 h-5 rounded-full bg-emerald-200 border-4 border-white shadow-sm"></span>
                        <h4 className="font-semibold text-slate-900">Local Tasting</h4>
                        <p className="text-slate-500 text-sm">Sample authentic snacks and coffee.</p>
                    </li>
                    <li className="relative">
                        <span className="absolute -left-[39px] w-5 h-5 rounded-full bg-slate-200 border-4 border-white shadow-sm"></span>
                        <h4 className="font-semibold text-slate-900">Return</h4>
                        <p className="text-slate-500 text-sm">Drop-off at your accommodation.</p>
                    </li>
                </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 relative">
             <div className="sticky top-32 space-y-8">
               <DetailBookingCard 
                 title={data.title}
                 rating={data.rating}
                 reviewCount={data.reviewCount}
                 type="EVENT"
                 price={65} // Mock Price
               />

               {/* Related Items - Sidebar for Desktop */}
               <div className="hidden lg:block bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="font-serif text-lg text-slate-900 mb-4">Popular Tours</h4>
                  <div className="space-y-4">
                      {relatedItems.map(item => (
                          <div 
                            key={item.id} 
                            className="group cursor-pointer flex gap-3 items-start"
                            onClick={() => {
                                navigate(`/experiences/${item.id}`);
                                window.scrollTo(0, 0);
                            }}
                          >
                              <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                              <div>
                                  <h5 className="font-medium text-slate-900 group-hover:text-emerald-800 transition-colors">{item.title}</h5>
                                  <p className="text-xs text-slate-500">{item.category}</p>
                              </div>
                          </div>
                      ))}
                  </div>
               </div>
             </div>
          </div>

        </div>

        {/* Related Items - Mobile Grid */}
        <div className="lg:hidden mt-16 pt-16 border-t border-slate-100">
            <h3 className="font-serif text-2xl text-slate-900 mb-6">Similar Experiences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedItems.map(item => (
                    <ExperienceCard key={item.id} {...item} onClick={() => {
                        navigate(`/experiences/${item.id}`);
                        window.scrollTo(0, 0);
                    }} />
                ))}
            </div>
        </div>

      </div>

      <MobileBookingBar 
        title={data.title}
        price={65}
        type="EVENT"
      />

      <SubscribeSection />
    </div>
  );
};

export default EventDetailPage;