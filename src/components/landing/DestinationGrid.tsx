import React from 'react';
import { motion } from 'motion/react';
import { CloudSun, Umbrella, Coffee, ArrowUpRight } from 'lucide-react';

const destinations = [
  {
    name: "Medellín",
    desc: "The City of Eternal Spring. Innovation meets tradition in a valley surrounded by mountains.",
    stats: { season: "Year-round", type: "Urban & Culture" },
    image: "https://images.unsplash.com/photo-1720630275162-eb3734164d05?q=80&w=1200&auto=format&fit=crop",
    align: "left"
  },
  {
    name: "Cartagena",
    desc: "A colonial jewel on the Caribbean coast. Vibrant streets, history, and island hopping.",
    stats: { season: "Dec - Apr", type: "History & Beach" },
    image: "https://images.unsplash.com/photo-1715503485494-1ed23a5be1ba?q=80&w=1200&auto=format&fit=crop",
    align: "right"
  }
];

const secondaryDestinations = [
  {
    name: "Bogotá",
    image: "https://images.unsplash.com/photo-1664851490956-b45905d6ffba?q=80&w=800&auto=format&fit=crop",
    season: "Culture Capital"
  },
  {
    name: "Santa Marta",
    image: "https://images.unsplash.com/photo-1687360433214-ec5b0e6b46b1?q=80&w=800&auto=format&fit=crop",
    season: "Nature & Beach"
  },
  {
    name: "Coffee Region",
    image: "https://images.unsplash.com/photo-1693357635675-95cc79c6ef46?q=80&w=800&auto=format&fit=crop",
    season: "Relaxation"
  }
];

export const DestinationGrid = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <h2 className="text-3xl lg:text-4xl font-serif font-medium text-slate-900 mb-4">Explore by Destination</h2>
          <p className="text-slate-600 max-w-2xl text-lg">From the Andes to the Caribbean, discover the diversity of Colombia.</p>
        </div>

        <div className="space-y-24 mb-24">
          {destinations.map((city, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col lg:flex-row gap-12 items-center ${city.align === 'right' ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className="w-full lg:w-3/5 h-[500px] relative rounded-2xl overflow-hidden group">
                <img 
                  src={city.image} 
                  alt={city.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider">
                  Featured
                </div>
              </div>
              
              <div className="w-full lg:w-2/5 flex flex-col justify-center">
                <h3 className="text-4xl lg:text-5xl font-serif text-slate-900 mb-6">{city.name}</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">{city.desc}</p>
                
                <div className="grid grid-cols-2 gap-6 mb-8 border-t border-slate-100 pt-8">
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Best Season</span>
                    <div className="flex items-center gap-2 text-slate-900 font-medium">
                      <CloudSun className="w-4 h-4 text-emerald-600" />
                      {city.stats.season}
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Type</span>
                    <div className="flex items-center gap-2 text-slate-900 font-medium">
                      <Umbrella className="w-4 h-4 text-emerald-600" />
                      {city.stats.type}
                    </div>
                  </div>
                </div>

                <button className="self-start px-6 py-3 border border-slate-200 rounded-lg hover:bg-slate-900 hover:text-white transition-all duration-300">
                  Explore {city.name}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {secondaryDestinations.map((dest, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative h-80 rounded-xl overflow-hidden cursor-pointer"
            >
              <img 
                src={dest.image} 
                alt={dest.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute bottom-6 left-6 text-white">
                <h4 className="text-2xl font-serif mb-1">{dest.name}</h4>
                <span className="text-sm text-white/80">{dest.season}</span>
              </div>
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
