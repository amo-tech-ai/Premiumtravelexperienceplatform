import React from 'react';
import { motion } from 'motion/react';

const stats = [
  { label: "Curated Experiences", value: "120+", percentage: 95 },
  { label: "Neighborhoods", value: "5", percentage: 100 },
  { label: "Local Guides", value: "45", percentage: 88 },
];

export const TrustIndicators = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <span className="text-emerald-800 text-sm font-semibold tracking-widest uppercase mb-4 block">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">
              Curated for Quality, <br/>Verified for Trust.
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              We don't just list tours; we design experiences. Every guide is vetted, every itinerary is tested, and every moment is crafted to ensure you see the real Colombia.
            </p>
            
            <div className="flex gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-3xl font-serif text-slate-900">4.9/5</span>
                <span className="text-sm text-slate-500 uppercase tracking-wide">Average Rating</span>
              </div>
              <div className="w-px h-16 bg-slate-200" />
              <div className="flex flex-col gap-2">
                <span className="text-3xl font-serif text-slate-900">10k+</span>
                <span className="text-sm text-slate-500 uppercase tracking-wide">Happy Travelers</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-100"
              >
                <div className="flex justify-between items-end mb-4">
                  <span className="text-slate-500 font-medium">{stat.label}</span>
                  <span className="text-2xl font-serif text-slate-900">{stat.value}</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stat.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-emerald-800"
                  />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
