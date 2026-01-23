import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PropertyCard, PropertyCardProps } from '../../components/real-estate/PropertyCard';
import { Search, Filter, SlidersHorizontal, Map, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useAI } from '../../context/AIContext';
import { useWizard } from '../../context/WizardContext';

const MOCK_PROPERTIES: PropertyCardProps[] = [
  {
    id: '1',
    title: 'Grand Poblado Penthouse',
    location: 'El Poblado, Medellín',
    price: 450000,
    beds: 3,
    baths: 3.5,
    sqft: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1588724813535-b8ae25946a81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwZW50aG91c2UlMjBsaXZpbmclMjByb29tJTIwd2l0aCUyMHZpZXd8ZW58MXx8fHwxNzY1OTI1ODYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    aiInsight: 'High Appreciation Potential',
    tags: ['Penthouse', 'City View'],
    isFeatured: true
  },
  {
    id: '2',
    title: 'Laureles Garden Villa',
    location: 'Laureles, Medellín',
    price: 320000,
    beds: 4,
    baths: 4,
    sqft: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1627916607164-7b20241db935?q=80&w=1080&auto=format&fit=crop',
    aiInsight: 'Great for Families',
    tags: ['Garden', 'Quiet Street']
  },
  {
    id: '3',
    title: 'Modern Loft in Envigado',
    location: 'Envigado, Medellín',
    price: 185000,
    beds: 1,
    baths: 2,
    sqft: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?q=80&w=1080&auto=format&fit=crop',
    aiInsight: 'High Rental Demand',
    tags: ['Loft', 'Walkable']
  },
  {
    id: '4',
    title: 'Llanogrande Country Estate',
    location: 'Llanogrande, Rionegro',
    price: 850000,
    beds: 5,
    baths: 6,
    sqft: 5500,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-60c375043303?q=80&w=1080&auto=format&fit=crop',
    aiInsight: 'Luxury Investment',
    tags: ['Pool', 'Expansive Grounds'],
    isFeatured: true
  },
  {
    id: '5',
    title: 'Provenza Boutique Apartment',
    location: 'El Poblado, Medellín',
    price: 210000,
    beds: 2,
    baths: 2,
    sqft: 950,
    imageUrl: 'https://images.unsplash.com/photo-1556912173-3db996e7c3ac?q=80&w=1080&auto=format&fit=crop',
    aiInsight: 'Airbnb Ready',
    tags: ['Nightlife', 'Turnkey']
  },
  {
    id: '6',
    title: 'Sabaneta High-Rise View',
    location: 'Sabaneta, Medellín',
    price: 145000,
    beds: 3,
    baths: 2,
    sqft: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1080&auto=format&fit=crop',
    aiInsight: 'Emerging Market',
    tags: ['Value', 'Metro Access']
  }
];

const PropertySearch = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();
  const { toggleOpen, injectMessage } = useAI();
  const { setIntent } = useWizard();

  // Sync Context
  useEffect(() => {
    setIntent('REAL_ESTATE');
  }, [setIntent]);

  const handleConciergeHelp = () => {
    injectMessage("I'm looking at properties. Can you help me filter for investment opportunities?", 'user', 'REAL_ESTATE');
    toggleOpen();
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="pt-8 pb-20">
        <div className="container mx-auto px-6 lg:px-12">
          
          {/* Header & Filters */}
          <div className="mb-12">
            <h1 className="text-3xl lg:text-4xl font-serif text-slate-900 mb-6">Discover Properties</h1>
            
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              
              {/* Search Bar */}
              <div className="relative w-full lg:w-96 group">
                <input 
                  type="text" 
                  placeholder="Search by neighborhood, amenities..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all group-hover:shadow-md"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {['All', 'For Sale', 'For Rent', 'Investment'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeFilter === filter 
                        ? 'bg-emerald-900 text-white shadow-md transform scale-105' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-emerald-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
                
                <div className="w-px h-8 bg-slate-200 mx-1 hidden lg:block" />
                
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-900 hover:border-emerald-200 transition-all">
                   <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
                 <button 
                   onClick={() => navigate('/map?filter=Real Estate')}
                   className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-900 hover:border-emerald-200 transition-all"
                 >
                   <Map className="w-4 h-4" /> Map View
                </button>
                <button 
                   onClick={handleConciergeHelp}
                   className="flex items-center gap-2 px-4 py-2 bg-emerald-900 border border-emerald-900 rounded-lg text-sm font-medium text-white hover:bg-emerald-800 transition-all shadow-md"
                 >
                   <Sparkles className="w-4 h-4 text-emerald-200" /> Ask AI
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {MOCK_PROPERTIES.map((property) => (
              <motion.div key={property.id} variants={item} className="h-[450px]">
                <PropertyCard {...property} />
              </motion.div>
            ))}
          </motion.div>

          {/* Load More */}
          <div className="mt-16 text-center">
             <button className="px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-medium hover:bg-slate-50 hover:border-emerald-300 hover:shadow-md transition-all shadow-sm">
                Load More Properties
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertySearch;