import React from 'react';
import { motion } from 'motion/react';

const stats = [
  { label: "Curated Experiences", value: "120+", suffix: "" },
  { label: "Destinations", value: "15+", suffix: "" },
  { label: "Traveler Satisfaction", value: "98", suffix: "%" },
];

export const StatsSection = () => {
  return (
    <section className="py-24 bg-emerald-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-emerald-400 font-medium tracking-wide uppercase text-sm mb-4 block">Why Choose Us</span>
            <h2 className="text-4xl lg:text-5xl font-serif mb-6 leading-tight">
              A journey crafted with <br />
              <span className="text-emerald-200 italic">intelligence & care.</span>
            </h2>
            <p className="text-emerald-100/80 text-lg leading-relaxed max-w-md">
              We go beyond the guidebooks. Our platform uses data-driven insights and local expertise to curate trips that match your specific travel style.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                  className="flex items-baseline mb-2"
                >
                  <span className="text-5xl font-serif">{stat.value}</span>
                  <span className="text-2xl text-emerald-400">{stat.suffix}</span>
                </motion.div>
                <div className="h-1 w-full bg-emerald-900 rounded-full mb-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + (index * 0.2), duration: 1 }}
                    className="h-full bg-emerald-400 rounded-full"
                  />
                </div>
                <span className="text-sm text-emerald-200/80 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
