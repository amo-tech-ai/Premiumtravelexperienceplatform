import React from 'react';
import { motion } from 'motion/react';

interface StorySectionProps {
  title: string;
  text: string;
  image: string;
  reversed?: boolean;
}

export const VisualStory = ({ title, text, image, reversed = false }: StorySectionProps) => {
  return (
    <section className="py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${reversed ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-1/2 relative aspect-[4/5] lg:aspect-square rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/10 z-10" />
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, x: reversed ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-1/2 flex flex-col justify-center"
          >
            <h2 className="text-3xl lg:text-5xl font-serif text-emerald-950 mb-6 leading-tight">
              {title}
            </h2>
            <div className="w-16 h-1 bg-amber-400/80 mb-8" />
            <p className="text-lg text-slate-600 leading-relaxed font-light">
              {text}
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
