import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export const CTA = () => {
  return (
    <section className="py-32 bg-[#F7F7F5] flex flex-col items-center justify-center text-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl"
      >
        <h2 className="text-4xl lg:text-6xl font-serif text-slate-900 mb-6">Start Your Colombia Journey</h2>
        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
          Discover experiences crafted with care, culture, and intention. Your next adventure awaits.
        </p>
        
        <Link to="/experiences/medellin" className="inline-block px-10 py-5 bg-slate-900 text-white rounded-full text-lg hover:bg-emerald-900 transition-colors duration-300 flex items-center gap-3 mx-auto shadow-xl shadow-slate-900/10 group w-fit">
          Explore Experiences
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
};