/**
 * DiscoverSlide - Single Static Demo Screen
 * CRITICAL: EXACTLY 2 COLUMNS (60% left / 40% right)
 * Left = UI content | Right = Map preview ONLY
 * NO third panel, NO duplicated screens, NO overlapping layers
 */

import React from 'react';
import { Search, MapPin, Star, Sparkles, Layers } from 'lucide-react';
import mapImage from 'figma:asset/cd99f04fef002301a9036604eafa9bafb7c3199f.png';

export function DiscoverSlide() {
  const categories = ['Trips', 'Rentals', 'Events', 'Experiences'];
  
  const items = [
    {
      id: 1,
      name: 'El Cielo Restaurant',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      type: 'Trip',
      label: 'Fine Dining',
      rating: 4.9,
      price: '$$$$',
      distance: '0.2 mi',
      note: 'Must-visit for molecular gastronomy lovers.',
      highlighted: true,
    },
    {
      id: 2,
      name: 'Comuna 13 Experience',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop',
      type: 'Trip',
      label: 'Cultural Tour',
      rating: 4.8,
      price: '$50',
      distance: '3.2 mi',
      note: 'Includes graffiti tour + local food tasting.',
      highlighted: false,
    },
    {
      id: 3,
      name: 'Modern Apartment',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      type: 'Rental',
      label: 'Laureles',
      rating: 4.7,
      price: '$850/mo',
      distance: '2.1 mi',
      note: '2 bed • Rooftop • Gym • Close to metro.',
      highlighted: false,
    },
    {
      id: 4,
      name: 'Salsa Night at Son Havana',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
      type: 'Event',
      label: 'Tonight 9PM',
      rating: 4.6,
      price: 'Free',
      distance: '1.8 mi',
      note: 'Live band • Beginner-friendly • El Poblado.',
      highlighted: false,
    },
  ];

  return (
    <div className="relative w-full h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden">
      
      {/* EXACTLY 2 COLUMNS: 60% left / 40% right */}
      <div className="flex h-full">
        
        {/* LEFT COLUMN: UI Content (60%) */}
        <div className="w-[60%] flex flex-col p-6 overflow-hidden bg-white">
          
          {/* Location Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide leading-tight">EXPLORING</div>
              <div className="text-xs font-bold text-slate-900">El Poblado ▼</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search places, vibes, or cravings..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              readOnly
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {categories.map((cat, idx) => (
              <button
                key={cat}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                  idx === 0
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* AI Insight Banner (1-2 lines only) */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 mb-4 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] text-emerald-800 leading-tight">
              <span className="font-semibold">Thursday Afternoon</span> · 24°C · Perfect for a walking tour or rooftop coffee.
            </div>
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900">Trips</h3>
            <button className="text-[11px] text-emerald-600 font-medium hover:text-emerald-700">
              See more
            </button>
          </div>

          {/* EXACTLY 4 Item Cards (Trip, Trip, Rental, Event) */}
          <div className="space-y-2.5 flex-1 overflow-hidden">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex gap-2.5 p-2.5">
                  {/* Image */}
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0.5 left-0.5 bg-white/90 backdrop-blur-sm text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.type.toUpperCase()}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                        <span className="text-[11px] font-bold text-slate-900">
                          {item.rating}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-600 mb-1.5">
                      <span>{item.price}</span>
                      <span>•</span>
                      <span>{item.distance}</span>
                    </div>

                    {/* AI Note */}
                    <div className="flex items-start gap-1 bg-amber-50 px-1.5 py-1 rounded">
                      <Sparkles className="w-2.5 h-2.5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-amber-900 leading-tight">
                        {item.note}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Map Preview ONLY (40%) */}
        <div className="w-[40%] relative bg-slate-200 overflow-hidden">
          
          {/* Real Map Image Background */}
          <img 
            src={mapImage} 
            alt="Medellín Map" 
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Top Right Map Controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button className="w-9 h-9 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </button>
            <button className="w-9 h-9 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors">
              <Layers className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Map Location Labels - styled like the image */}
          
          {/* Comuna 13 - Highlighted (top left) */}
          <div className="absolute top-[35%] left-[35%] transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white px-3 py-1.5 rounded-full shadow-lg border border-slate-200">
              <div className="text-[10px] font-bold text-slate-900 whitespace-nowrap">Comuna 13</div>
            </div>
          </div>

          {/* Laureles - nearby (left center) */}
          <div className="absolute top-[55%] left-[30%] transform -translate-x-1/2">
            <div className="bg-white px-2.5 py-1 rounded-full shadow-md border border-slate-200">
              <div className="text-[9px] font-semibold text-slate-700 whitespace-nowrap">Laureles</div>
            </div>
          </div>

          {/* El Poblado - center right */}
          <div className="absolute top-[50%] left-[60%] transform -translate-x-1/2">
            <div className="bg-white px-2.5 py-1 rounded-full shadow-md border border-slate-200">
              <div className="text-[9px] font-semibold text-slate-700 whitespace-nowrap">El Poblado</div>
            </div>
          </div>

          {/* Envigado - bottom */}
          <div className="absolute top-[75%] left-[50%] transform -translate-x-1/2">
            <div className="bg-white px-2.5 py-1 rounded-full shadow-md border border-slate-200">
              <div className="text-[9px] font-semibold text-slate-700 whitespace-nowrap">Envigado</div>
            </div>
          </div>

          {/* Bottom Right: Zoom Controls */}
          <div className="absolute bottom-20 right-3 flex flex-col gap-0.5 bg-white rounded-xl shadow-lg overflow-hidden">
            <button className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 border-b border-slate-200 text-slate-700 text-base font-bold transition-colors">
              +
            </button>
            <button className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-700 text-base font-bold transition-colors">
              −
            </button>
          </div>

          {/* Bottom Right: Floating Action Button */}
          <div className="absolute bottom-3 right-3">
            <button className="w-12 h-12 bg-emerald-700 rounded-full shadow-xl flex items-center justify-center hover:bg-emerald-800 transition-colors">
              <Sparkles className="w-5 h-5 text-white" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}