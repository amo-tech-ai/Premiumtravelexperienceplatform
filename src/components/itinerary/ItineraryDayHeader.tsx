import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ItineraryDayHeaderProps {
  day: number;
  date?: string;
  locationName?: string;
  image?: string;
}

export const ItineraryDayHeader: React.FC<ItineraryDayHeaderProps> = ({
  day,
  date = "Oct 12",
  locationName = "Medellín, Colombia",
  image = "https://images.unsplash.com/photo-1591503378544-42f2b3b72a4e?auto=format&fit=crop&q=80"
}) => {
  return (
    <div className="relative h-64 rounded-3xl overflow-hidden mb-8 group shadow-lg">
      <ImageWithFallback 
        src={image} 
        alt={`Day ${day} in ${locationName}`}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-white/80 mb-2 text-sm font-medium tracking-wide uppercase">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {date}
              </span>
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {locationName}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
              Day {day}
            </h2>
            <p className="text-emerald-100/90 text-lg max-w-xl font-light">
              A perfect mix of cultural immersion and local flavors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
