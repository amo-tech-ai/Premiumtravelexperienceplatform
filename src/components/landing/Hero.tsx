import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Map } from 'lucide-react';

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen pt-24 pb-20 overflow-hidden bg-[#F7F7F5] flex items-center">
      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Content */}
        <div className="relative z-10 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-emerald-900/5 text-emerald-900 text-xs font-medium tracking-wider mb-6 uppercase">
              Premium Travel Collection
            </span>
            <h1 className="text-5xl lg:text-7xl font-serif font-medium text-slate-900 leading-[1.1] mb-6">
              Discover Colombia <br/>
              <span className="italic text-emerald-800">Through Culture,</span> <br/>
              Nature & Experience.
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 leading-relaxed mb-10 max-w-lg">
              Curated journeys across Colombia’s most iconic destinations — designed for travelers who value authenticity, beauty, and meaning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-slate-900 text-white rounded-xl hover:bg-emerald-900 transition-colors duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-slate-900/20">
                Explore Experiences
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm">
                <Map className="w-4 h-4" />
                Get Travel Insights
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Visuals - Parallax Collage */}
        <motion.div 
          style={{ opacity }}
          className="relative h-[600px] hidden lg:block"
        >
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-4">
            {/* Main Image - Cartagena */}
            <motion.div 
              style={{ y: y1 }}
              className="col-span-7 row-span-8 relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 z-10"
            >
              <img 
                src="https://images.unsplash.com/photo-1715503485494-1ed23a5be1ba?q=80&w=1080&auto=format&fit=crop" 
                alt="Cartagena Streets" 
                className="w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>

            {/* Top Right - Nature/Palms */}
            <motion.div 
              style={{ y: y2 }}
              className="col-start-8 col-span-5 row-span-6 relative rounded-3xl overflow-hidden shadow-xl shadow-emerald-900/10 z-0 mt-8"
            >
              <img 
                src="https://images.unsplash.com/photo-1693357635675-95cc79c6ef46?q=80&w=800&auto=format&fit=crop" 
                alt="Cocora Valley" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Bottom Right - Beach/Water */}
            <motion.div 
              style={{ y: y3 }}
              className="col-start-6 col-span-6 row-start-8 row-span-5 relative rounded-3xl overflow-hidden shadow-xl shadow-blue-900/10 z-20 -ml-12 border-4 border-[#F7F7F5]"
            >
              <img 
                src="https://images.unsplash.com/photo-1687360433214-ec5b0e6b46b1?q=80&w=800&auto=format&fit=crop" 
                alt="Tayrona Beach" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl -z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
