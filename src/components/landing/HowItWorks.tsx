import React from 'react';
import { motion } from 'motion/react';
import { Compass, MapPin, Tent, CalendarCheck, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Compass,
    title: "Choose a Vibe",
    desc: "Relaxation, adventure, or culture?"
  },
  {
    icon: MapPin,
    title: "Pick a Destination",
    desc: "From the Caribbean to the Andes."
  },
  {
    icon: Tent,
    title: "Curated Experiences",
    desc: "Hand-picked local activities."
  },
  {
    icon: CalendarCheck,
    title: "Save or Book",
    desc: "Secure your perfect trip."
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-emerald-800 font-medium tracking-wide uppercase text-sm">Simple Process</span>
          <h2 className="text-3xl lg:text-4xl font-serif font-medium text-slate-900 mt-3">How it Works</h2>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 overflow-hidden">
             <motion.div 
               className="h-full bg-emerald-900/20"
               initial={{ width: "0%" }}
               whileInView={{ width: "100%" }}
               viewport={{ once: true }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-white border border-slate-100 shadow-xl shadow-slate-900/5 flex items-center justify-center mb-6 relative z-10 group-hover:scale-105 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-emerald-900 stroke-[1.5]" />
                  <div className="absolute inset-0 rounded-full border border-emerald-900/10 scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
                <h3 className="text-xl font-serif text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
