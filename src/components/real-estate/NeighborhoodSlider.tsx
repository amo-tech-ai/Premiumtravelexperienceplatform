import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';

const NEIGHBORHOODS = [
  {
    id: 'poblado',
    name: "El Poblado",
    tagline: "The Golden Mile",
    desc: "Luxury high-rises, world-class dining, and lush green avenues.",
    stats: { price: "$2,800/m²", roi: "8.5%" },
    image: "https://images.unsplash.com/photo-1680551346563-87fbf6376aae?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 'laureles',
    name: "Laureles",
    tagline: "Garden District",
    desc: "Walkable boulevards, local cafes, and authentic charm.",
    stats: { price: "$1,900/m²", roi: "7.2%" },
    image: "https://images.unsplash.com/photo-1646150445684-871116fcc3ff?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 'envigado',
    name: "Envigado",
    tagline: "Community First",
    desc: "Suburban feel with modern amenities and strong community.",
    stats: { price: "$1,600/m²", roi: "6.8%" },
    image: "https://images.unsplash.com/photo-1633627425472-d07ac65e2a36?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 'llandeogrande',
    name: "Llanogrande",
    tagline: "Country Estates",
    desc: "Spacious country homes just outside the city. Pure luxury.",
    stats: { price: "$2,200/m²", roi: "5.5%" },
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 'sabaneta',
    name: "Sabaneta",
    tagline: "Rising Star",
    desc: "High density but highly walkable with emerging luxury zones.",
    stats: { price: "$1,500/m²", roi: "6.5%" },
    image: "https://images.unsplash.com/photo-1671240430657-3462d32baa5b?q=80&w=800&auto=format&fit=crop"
  }
];

export const NeighborhoodSlider = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount 
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl lg:text-4xl font-serif font-medium text-slate-900 mb-3">Explore by Neighborhood</h2>
            <p className="text-slate-500 text-lg max-w-xl">
              Find the perfect location for your lifestyle or investment goals.
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-8 -mx-6 px-6 md:mx-0 md:px-0 gap-6 snap-x snap-mandatory scrollbar-hide"
        >
          {NEIGHBORHOODS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex-shrink-0 w-[85vw] sm:w-[350px] snap-center group relative"
            >
                <Link to={`/real-estate/search?neighborhood=${item.id}`} className="block h-full">
                    <div className="relative h-[450px] rounded-3xl overflow-hidden mb-4 shadow-md group-hover:shadow-xl transition-all duration-500">
                        {/* Image */}
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <div className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-1">{item.tagline}</div>
                                    <h3 className="text-2xl font-serif">{item.name}</h3>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-emerald-900 transition-all duration-300">
                                    <ArrowUpRight className="w-5 h-5" />
                                </div>
                            </div>
                            
                            <p className="text-slate-300 text-sm mb-4 line-clamp-2 opacity-90">
                                {item.desc}
                            </p>

                            {/* Stats Row */}
                            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                                <div>
                                    <div className="text-xs text-slate-400">Avg. Price</div>
                                    <div className="font-medium">{item.stats.price}</div>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div>
                                    <div className="text-xs text-slate-400">Rental Yield</div>
                                    <div className="font-medium text-emerald-400 flex items-center gap-1">
                                        {item.stats.roi} <TrendingUp className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
          ))}
          <div className="w-6 shrink-0 md:hidden" />
        </div>
      </div>
    </section>
  );
};