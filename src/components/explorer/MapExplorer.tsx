import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, MapPin, Navigation } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ExperienceCard } from '../ui/ExperienceCard';

const MOCK_EXPERIENCES = [
  {
    id: '1',
    title: 'Hacienda Coffee Tour',
    rating: 4.9,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1763675111499-acc7a7f52d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRlbGxpbiUyMGNvZmZlZSUyMGZhcm18ZW58MXx8fHwxNzY1OTIzMjk4fDA&ixlib=rb-4.1.0&q=80&w=600',
    category: 'Gastronomy',
    location: 'El Poblado'
  },
  {
    id: '2',
    title: 'Comuna 13 Graffiti Tour',
    rating: 4.8,
    reviewCount: 342,
    image: 'https://images.unsplash.com/photo-1664851490956-b45905d6ffba?q=80&w=600&auto=format&fit=crop',
    category: 'Culture',
    location: 'San Javier'
  },
  {
    id: '3',
    title: 'Envy Rooftop Bar',
    rating: 4.7,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1763675111499-acc7a7f52d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRlbGxpbiUyMHJvb2Z0b3AlMjBiYXIlMjBsdXh1cnl8ZW58MXx8fHwxNzY1OTIzMjk4fDA&ixlib=rb-4.1.0&q=80&w=600',
    category: 'Nightlife',
    location: 'El Poblado'
  },
  {
    id: '4',
    title: 'Arví Park Nature Hike',
    rating: 4.9,
    reviewCount: 56,
    image: 'https://images.unsplash.com/photo-1678546425228-4a98280bf91c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRlbGxpbiUyMGhpa2luZyUyMG5hdHVyZXxlbnwxfHx8fDE3NjU5MjMyOTh8MA&ixlib=rb-4.1.0&q=80&w=600',
    category: 'Nature',
    location: 'Santa Elena'
  },
  {
    id: '5',
    title: 'Botero Plaza Walk',
    rating: 4.6,
    reviewCount: 210,
    image: 'https://images.unsplash.com/photo-1599587756182-359f4039b552?q=80&w=600&auto=format&fit=crop',
    category: 'History',
    location: 'La Candelaria'
  },
  {
    id: '6',
    title: 'Grand Poblado Penthouse',
    rating: 5.0,
    reviewCount: 12,
    image: 'https://images.unsplash.com/photo-1588724813535-b8ae25946a81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwZW50aG91c2UlMjBsaXZpbmclMjByb29tJTIwd2l0aCUyMHZpZXd8ZW58MXx8fHwxNzY1OTI1ODYxfDA&ixlib=rb-4.1.0&q=80&w=600',
    category: 'Real Estate',
    location: 'El Poblado'
  },
  {
    id: '7',
    title: 'Llanogrande Estate',
    rating: 4.9,
    reviewCount: 8,
    image: 'https://images.unsplash.com/photo-1600596542815-60c375043303?q=80&w=600&auto=format&fit=crop',
    category: 'Real Estate',
    location: 'Rionegro'
  }
];

const FILTERS = ["Open Now", "Rated 4.5+", "Near Me", "Luxury", "Outdoor", "Arts", "Real Estate"];

export const MapExplorer = () => {
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState("Open Now");
  const navigate = useNavigate();

  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam && FILTERS.includes(filterParam)) {
      setActiveFilter(filterParam);
    }
  }, [searchParams]);

  const filteredExperiences = MOCK_EXPERIENCES.filter(exp => {
    if (activeFilter === "Open Now") return true; // Show all for now
    if (activeFilter === "Rated 4.5+") return exp.rating >= 4.5;
    if (activeFilter === "Real Estate") return exp.category === 'Real Estate';
    if (activeFilter === "Arts") return ['Culture', 'History'].includes(exp.category);
    if (activeFilter === "Outdoor") return ['Nature'].includes(exp.category);
    if (activeFilter === "Luxury") return ['Real Estate', 'Gastronomy', 'Nightlife'].includes(exp.category);
    return true;
  });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-100">
      
      {/* Layer 0: Full Screen Map Placeholder */}
      <div className="absolute inset-0 z-0 bg-slate-200">
        {/* Mock Map Texture */}
        <div className="w-full h-full opacity-30" 
             style={{ 
               backgroundImage: 'radial-gradient(#104a3e 1px, transparent 1px)', 
               backgroundSize: '30px 30px' 
             }} 
        />
        {/* Mock Map Elements */}
        <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2">
           <div className="relative">
             <div className="w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
             <MapPin className="absolute top-1/2 left-1/2 w-8 h-8 text-primary -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" />
           </div>
        </div>
      </div>

      {/* Layer 10: Top Filter Bar */}
      <div className="absolute top-24 left-0 w-full z-10 pl-4 md:pl-12 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 pb-4 min-w-max">
          <button className="p-2.5 bg-white text-slate-700 rounded-full shadow-lg border border-slate-100 hover:bg-slate-50">
            <Filter className="w-5 h-5" />
          </button>
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                px-5 py-2.5 rounded-full text-sm font-medium shadow-lg border transition-all duration-300
                ${activeFilter === filter 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50'}
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Layer 20: Content Overlay */}
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block absolute top-0 left-0 h-full w-[450px] bg-white/95 backdrop-blur-md z-20 shadow-2xl pt-40 px-6 overflow-y-auto border-r border-slate-200">
         <div className="flex items-center justify-between mb-6">
           <h2 className="text-2xl font-serif text-slate-900">Top Experiences</h2>
           <span className="text-sm text-slate-500">{filteredExperiences.length} Results</span>
         </div>
         <div className="grid grid-cols-1 gap-6 pb-20">
           {filteredExperiences.map((exp) => (
             <ExperienceCard 
               key={exp.id} 
               {...exp} 
               onClick={() => exp.id === '3' && navigate('/experiences/medellin/la-deriva')}
             />
           ))}
         </div>
      </div>

      {/* Mobile Card Carousel */}
      <div className="md:hidden absolute bottom-0 left-0 w-full z-20 pb-8 px-4">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
          {filteredExperiences.map((exp) => (
            <div key={exp.id} className="min-w-[85vw] snap-center">
              <ExperienceCard 
                {...exp} 
                onClick={() => exp.id === '3' && navigate('/experiences/medellin/la-deriva')}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button (Mobile Only - e.g. "Recenter") */}
      <div className="md:hidden absolute bottom-80 right-4 z-10">
        <button className="p-3 bg-white text-slate-700 rounded-full shadow-xl">
          <Navigation className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
};
