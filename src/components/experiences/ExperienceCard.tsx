import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExperienceCardProps {
  id: number | string;
  title: string;
  description: string;
  image: string;
  category: string;
  location: string;
  duration: string;
  price: string;
  rating: number;
  reviews: number;
}

export const ExperienceCard = ({ 
  id,
  title, 
  description, 
  image, 
  category, 
  location, 
  duration, 
  price,
  rating,
  reviews
}: ExperienceCardProps) => {
  return (
    <Link to={`/experiences/medellin/la-deriva`} className="block h-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer h-full"
      >
        {/* Image Container */}
        <div className="relative h-[280px] overflow-hidden">
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-semibold tracking-wide uppercase text-slate-900 rounded-full shadow-sm">
              {category}
            </span>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 z-10" />
          
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Price Badge */}
          <div className="absolute bottom-4 right-4 z-20">
            <span className="px-3 py-1.5 bg-emerald-900/90 backdrop-blur-sm text-emerald-50 text-sm font-medium rounded-lg shadow-sm">
              {price}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow relative">
          <div className="flex items-center gap-2 mb-3 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {location}
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {duration}
            </div>
          </div>

          <h3 className="text-xl font-serif text-slate-900 mb-2 group-hover:text-emerald-800 transition-colors">
            {title}
          </h3>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
            {description}
          </p>

          <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium text-slate-900">{rating}</span>
              <span className="text-sm text-slate-400">({reviews})</span>
            </div>

            <span className="flex items-center gap-1 text-sm font-medium text-emerald-800 opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              View Details <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
