import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin, Clock, DollarSign } from 'lucide-react';
import { cn } from '../../lib/utils';

const filters = [
  { id: 'all', label: 'All Experiences' },
  { id: 'culture', label: 'Culture & History' },
  { id: 'food', label: 'Food & Drink' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'nightlife', label: 'Nightlife' },
];

export const ExperienceFilterBar = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 600); 
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`w-full z-40 transition-all duration-300 ${isSticky ? 'sticky top-[70px] bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-[320px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-800 transition-colors" />
            <input 
              type="text" 
              placeholder="Search experiences..." 
              className="w-full h-12 pl-11 pr-4 rounded-full bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
                  activeFilter === filter.id 
                    ? "bg-slate-900 text-white shadow-md transform scale-105" 
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Advanced Filter Toggles (Desktop only visual) */}
          <div className="hidden lg:flex items-center gap-3 border-l border-slate-200 pl-6">
            <button className="p-2.5 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors tooltip" aria-label="Filter by Location">
              <MapPin className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors" aria-label="Filter by Duration">
              <Clock className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors" aria-label="Filter by Price">
              <DollarSign className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
