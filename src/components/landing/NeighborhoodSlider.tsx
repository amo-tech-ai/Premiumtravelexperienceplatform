import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

const neighborhoods = [
  {
    name: "El Poblado",
    desc: "Modern, vibrant, and upscale living with nightlife and views",
    image: "https://images.unsplash.com/photo-1680551346563-87fbf6376aae?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Laureles",
    desc: "Walkable, leafy, and local with relaxed city charm",
    image: "https://images.unsplash.com/photo-1646150445684-871116fcc3ff?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Envigado",
    desc: "Authentic culture, cafés, and community atmosphere",
    image: "https://images.unsplash.com/photo-1633627425472-d07ac65e2a36?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Guatapé",
    desc: "Colorful lakeside town with iconic landscapes and views",
    image: "https://images.unsplash.com/photo-1568632234170-9adf33c23dd9?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Sabaneta",
    desc: "Quiet, residential, and traditionally Colombian",
    image: "https://images.unsplash.com/photo-1671240430657-3462d32baa5b?q=80&w=800&auto=format&fit=crop"
  }
];

export const NeighborhoodSlider = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350; // Approx card width + gap
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount 
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl lg:text-4xl font-serif font-medium text-slate-900 mb-3">Browse Neighborhoods</h2>
            <p className="text-slate-500 text-lg max-w-xl">
              Discover the lifestyle, culture, and atmosphere of Medellín’s most iconic areas.
            </p>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slider Container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-8 -mx-6 px-6 md:mx-0 md:px-0 gap-6 snap-x snap-mandatory scrollbar-hide md:cursor-grab active:cursor-grabbing"
          style={{ scrollBehavior: 'smooth' }}
        >
          {neighborhoods.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex-shrink-0 w-[75vw] sm:w-[320px] md:w-[280px] lg:w-[320px] snap-center group relative flex flex-col transition-transform duration-500 hover:-translate-y-2"
            >
              {/* Card Image */}
              <div className="relative h-[400px] rounded-3xl overflow-hidden mb-5 shadow-lg shadow-slate-900/5">
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 z-20" />
                
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                
                {/* Mobile Overlay Text (Visible only on very small screens if preferred, but design asks for Text Area below. 
                    However, the example image shows text below. I will follow the text-below instruction strictly, 
                    but keep the gradient for subtle depth on the image itself.) */}
              </div>

              {/* Text Area */}
              <div className="px-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-serif text-slate-900 group-hover:text-emerald-800 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 text-emerald-800" />
                  </div>
                </div>
                <p className="text-slate-500 leading-relaxed text-sm pr-4">
                  {item.desc}
                </p>
                
                <div className="mt-4 flex items-center gap-2 text-emerald-900 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:hidden">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Spacer for right padding on mobile scrolling */}
          <div className="w-6 shrink-0 md:hidden" />
        </div>

      </div>
    </section>
  );
};
