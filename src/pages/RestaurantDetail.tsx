import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { DetailHero } from '../components/experiences/DetailHero';
import { QuickFacts } from '../components/experiences/QuickFacts';
import { VisualStory } from '../components/experiences/VisualStory';
import { DetailBookingCard } from '../components/booking/DetailBookingCard';
import { MobileBookingBar } from '../components/booking/MobileBookingBar';
import { SubscribeSection } from '../components/layout/SubscribeSection';
import { Utensils, Clock, MapPin, Sparkles } from 'lucide-react';
import { MOCK_DINING_RESULTS } from '../components/ai/MockData';
import { DiningCard } from '../components/ai/cards/DiningCard';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find data or fallback to first item
  const data = MOCK_DINING_RESULTS.find(d => d.id === id) || MOCK_DINING_RESULTS[0];

  // Enhanced Mock Data for specific view
  const heroData = {
    title: data.title,
    location: `${data.location}, Medellín`,
    description: `Experience the finest ${data.cuisine} cuisine in the heart of the city. A culinary journey that blends tradition with modern innovation.`,
    image: data.image
  };

  const facts = [
    { icon: Utensils, label: data.cuisine },
    { icon: Clock, label: "6PM - 11PM" },
    { icon: MapPin, label: data.location || "El Poblado" },
    { icon: Sparkles, label: "Fine Dining" },
  ];

  const stories = [
    {
      title: "The Culinary Vision",
      text: "Every dish tells a story of Colombia's rich biodiversity. Our chefs work directly with local farmers to source ingredients that are as fresh as they are unique. From the Amazon to the Andes, taste the landscape of our country.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1080&auto=format&fit=crop",
      reversed: false
    },
    {
      title: "The Atmosphere",
      text: "Designed to stimulate all senses, our dining room combines natural elements with contemporary architecture. The lighting is intimate, the acoustics are perfect for conversation, and the service is impeccably attentive without being intrusive.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1080&auto=format&fit=crop",
      reversed: true
    }
  ];

  // Filter out current item for related list
  const relatedItems = MOCK_DINING_RESULTS.filter(item => item.id !== data.id).slice(0, 2);

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

            {/* Menu Preview Section */}
            <div className="py-12 border-t border-slate-100">
                <h3 className="font-serif text-3xl text-slate-900 mb-8">Signature Dishes</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-baseline border-b border-slate-100 pb-2">
                            <h4 className="font-medium text-slate-900">Ceviche de Mango Biche</h4>
                            <span className="text-emerald-900 font-semibold">$18</span>
                        </div>
                        <p className="text-slate-500 text-sm">Green mango, lime, cilantro, red onion, and secret tiger's milk.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-baseline border-b border-slate-100 pb-2">
                            <h4 className="font-medium text-slate-900">Posta Cartagenera</h4>
                            <span className="text-emerald-900 font-semibold">$32</span>
                        </div>
                        <p className="text-slate-500 text-sm">Slow-cooked beef eye round in a panela and kola sauce, served with coconut rice.</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 relative">
             <div className="sticky top-32 space-y-8">
               <DetailBookingCard 
                 title={data.title}
                 rating={data.rating}
                 reviewCount={data.reviewCount}
                 type="DINING"
                 price={data.priceRange}
                 externalLink="https://opentable.com" // Mock external link
               />
               
               {/* Related Items - Sidebar for Desktop */}
               <div className="hidden lg:block bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="font-serif text-lg text-slate-900 mb-4">You Might Also Like</h4>
                  <div className="space-y-4">
                      {relatedItems.map(item => (
                          <div 
                            key={item.id} 
                            className="group cursor-pointer flex gap-3 items-start"
                            onClick={() => {
                                navigate(`/restaurants/${item.id}`);
                                window.scrollTo(0, 0);
                            }}
                          >
                              <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                              <div>
                                  <h5 className="font-medium text-slate-900 group-hover:text-emerald-800 transition-colors">{item.title}</h5>
                                  <p className="text-xs text-slate-500">{item.cuisine}</p>
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
            <h3 className="font-serif text-2xl text-slate-900 mb-6">Similar Restaurants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedItems.map(item => (
                    <DiningCard key={item.id} {...item} onClick={() => {
                        navigate(`/restaurants/${item.id}`);
                        window.scrollTo(0, 0);
                    }} />
                ))}
            </div>
        </div>

      </div>

      <MobileBookingBar 
        title={data.title}
        price={data.priceRange}
        type="DINING"
        externalLink="https://opentable.com"
      />

      <SubscribeSection />
    </div>
  );
};

export default RestaurantDetailPage;