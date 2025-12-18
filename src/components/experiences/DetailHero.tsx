import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown, MapPin } from 'lucide-react';

interface DetailHeroProps {
  title: string;
  location: string;
  description: string;
  image: string;
}

export const DetailHero = ({ title, location, description, image }: DetailHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[80vh] w-full overflow-hidden flex items-end pb-20">
      {/* Parallax Background */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 w-full container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-amber-300 font-medium tracking-wide mb-4 uppercase text-sm"
          >
            <MapPin className="w-4 h-4" />
            {location}
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-sm">
            {title}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-100 font-light max-w-2xl leading-relaxed mb-8 drop-shadow-md">
            {description}
          </p>

          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="px-8 py-3 bg-white text-slate-900 rounded-full font-semibold hover:bg-emerald-50 transition-colors shadow-lg"
            >
              Check Availability
            </motion.button>
             <button className="px-6 py-3 text-white border border-white/30 rounded-full font-medium hover:bg-white/10 transition-colors backdrop-blur-sm">
              View Gallery
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </div>
  );
};
