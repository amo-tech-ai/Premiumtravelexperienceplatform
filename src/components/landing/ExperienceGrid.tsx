import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

const experiences = [
  {
    title: "Adventure Escapes",
    image: "https://images.unsplash.com/photo-1623167987947-c25a2cc06a21?q=80&w=600&auto=format&fit=crop",
    count: "24 Trips"
  },
  {
    title: "Culture & History",
    image: "https://images.unsplash.com/photo-1664851490956-b45905d6ffba?q=80&w=600&auto=format&fit=crop",
    count: "18 Tours"
  },
  {
    title: "Beach & Nature",
    image: "https://images.unsplash.com/photo-1687360433214-ec5b0e6b46b1?q=80&w=600&auto=format&fit=crop",
    count: "12 Spots"
  },
  {
    title: "Food & Local Life",
    image: "https://images.unsplash.com/photo-1644753787131-a75cbda834cd?q=80&w=600&auto=format&fit=crop",
    count: "30 Experiences"
  }
];

export const ExperienceGrid = () => {
  return (
    <section className="py-24 bg-[#F7F7F5]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl lg:text-4xl font-serif font-medium text-slate-900 mb-4">Explore by Experience</h2>
            <p className="text-slate-600 text-lg">Curated collections designed around your travel style.</p>
          </div>
          <Link to="/experiences/medellin" className="text-emerald-900 font-medium hover:text-emerald-700 flex items-center gap-2 transition-colors">
            View all collections <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-8 md:pb-0 snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
          {experiences.map((item, index) => (
            <Link to="/experiences/medellin" key={index} className="w-full md:w-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative min-w-[280px] w-full h-[400px] rounded-2xl overflow-hidden cursor-pointer snap-center"
            >
              <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors duration-500 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />
              
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              
              <div className="absolute bottom-0 left-0 w-full p-6 z-30 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-white/80 text-sm font-medium mb-1 block">{item.count}</span>
                <h3 className="text-2xl font-serif text-white mb-4">{item.title}</h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2 text-white font-medium text-sm">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};