import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { DetailHero } from '../../components/experiences/DetailHero';
import { QuickFacts } from '../../components/experiences/QuickFacts';
import { VisualStory } from '../../components/experiences/VisualStory';
import { DetailBookingCard } from '../../components/booking/DetailBookingCard';
import { SubscribeSection } from '../../components/layout/SubscribeSection';
import { Bed, Bath, Square, TrendingUp, MapPin, Building2, ShieldCheck } from 'lucide-react';
import { MOCK_STAY_RESULTS } from '../../components/ai/MockData';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find data or fallback to first item
  const data = MOCK_STAY_RESULTS.find(d => d.id === id) || MOCK_STAY_RESULTS[0];

  const heroData = {
    title: data.title,
    location: data.location,
    description: `A masterpiece of modern design in ${data.location}. Offering unparalleled luxury and potential for high-yield returns.`,
    image: data.imageUrl
  };

  const facts = [
    { icon: Bed, label: `${data.beds} Beds` },
    { icon: Bath, label: `${data.baths} Baths` },
    { icon: Square, label: `${data.sqft} Sqft` },
    { icon: TrendingUp, label: "High ROI" },
  ];

  // Enhanced Mock Content for Real Estate
  const stories = [
    {
      title: "The Architecture",
      text: "Designed by award-winning architects, this property blends seamless indoor-outdoor living with robust concrete and glass structures. Floor-to-ceiling windows frame the stunning views of the Aburrá Valley, while sustainable materials ensure a connection to the natural surroundings.",
      image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1080&auto=format&fit=crop",
      reversed: false
    },
    {
      title: "The Investment",
      text: "Medellín's real estate market is experiencing a golden era. This property is located in a high-appreciation zone, perfect for short-term luxury rentals. Expected annual occupancy rates for properties of this caliber exceed 85%, offering a significant passive income stream.",
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1080&auto=format&fit=crop",
      reversed: true
    }
  ];

  // Similar Properties
  const relatedItems = MOCK_STAY_RESULTS.filter(item => item.id !== data.id).slice(0, 2);

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

            {/* Amenities / Features List */}
            <div className="py-12 border-t border-slate-100">
                <h3 className="font-serif text-3xl text-slate-900 mb-8">Property Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {['Smart Home System', 'Heated Pool', 'Private Gym', '24/7 Security', 'Chef\'s Kitchen', 'Rooftop Terrace'].map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-slate-700">
                            <ShieldCheck className="w-5 h-5 text-emerald-900" />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 relative">
             <div className="sticky top-32 space-y-8">
               <DetailBookingCard 
                 title={data.title}
                 type="STAY"
                 price={data.price}
                 subtitle="Asking Price (USD)"
                 reviewCount={0} // Not applicable for sales usually
                 rating={undefined}
               />
               
               {/* Related Listings */}
               <div className="hidden lg:block bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="font-serif text-lg text-slate-900 mb-4">Similar Listings</h4>
                  <div className="space-y-4">
                      {relatedItems.map(item => (
                          <div 
                            key={item.id} 
                            className="group cursor-pointer flex gap-3 items-start"
                            onClick={() => {
                                navigate(`/real-estate/listing/${item.id}`);
                                window.scrollTo(0, 0);
                            }}
                          >
                              <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                              <div>
                                  <h5 className="font-medium text-slate-900 group-hover:text-emerald-800 transition-colors">{item.title}</h5>
                                  <p className="text-xs text-slate-500">${item.price.toLocaleString()} USD</p>
                              </div>
                          </div>
                      ))}
                  </div>
               </div>
             </div>
          </div>

        </div>
      </div>

      <SubscribeSection />
    </div>
  );
};

export default PropertyDetail;