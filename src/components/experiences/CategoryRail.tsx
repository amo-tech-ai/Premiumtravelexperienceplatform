import React from 'react';
import { motion } from 'motion/react';
import { Palette, Coffee, Music, Mountain, Camera } from 'lucide-react';

const categories = [
  { icon: Palette, name: "Culture & History", count: "45+ Experiences" },
  { icon: Coffee, name: "Food & Drink", count: "30+ Experiences" },
  { icon: Music, name: "Nightlife", count: "20+ Experiences" },
  { icon: Mountain, name: "Nature & Adventure", count: "25+ Experiences" },
  { icon: Camera, name: "Art & Design", count: "15+ Experiences" },
];

export const CategoryRail = () => {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-serif text-slate-900">Browse by Category</h2>
          <div className="hidden md:flex gap-2">
            {/* Arrows could go here */}
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide snap-x">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[260px] md:min-w-[280px] bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group snap-center border border-slate-100"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-colors">
                <cat.icon className="w-6 h-6 text-emerald-800" />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-2">{cat.name}</h3>
              <p className="text-slate-500 text-sm">{cat.count}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
