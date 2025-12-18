import React from 'react';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import { Button } from '../ui/button';

interface ExploreFiltersProps {
  onSearch: (query: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function ExploreFilters({ onSearch, activeFilter, onFilterChange }: ExploreFiltersProps) {
  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 p-4 pb-2">
      <div className="flex flex-col gap-4">
        {/* Top Row: Location & Actions */}
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 text-slate-900 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors group">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-100 transition-colors">
               <MapPin className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] text-slate-500 font-medium uppercase tracking-wider">Exploring</span>
              <span className="block text-sm font-bold font-serif leading-none">El Poblado ▾</span>
            </div>
          </button>
          
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full border border-slate-200 hover:bg-slate-50">
            <SlidersHorizontal className="w-4 h-4 text-slate-600" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search places, vibes, or cravings..." 
            className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {['All', 'Restaurants', 'Things to Do', 'Stays', 'Coffee', 'Nightlife'].map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all
                ${activeFilter === filter 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
