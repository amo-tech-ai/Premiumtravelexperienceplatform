/**
 * How It Works - Scroll-Driven Product Demo
 * Features 400vh scroll container with two-column layout
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Home, Shield, CheckCircle2 } from 'lucide-react';

export function HowItWorksScrollSection() {
  const [activeStep, setActiveStep] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const container = scrollContainerRef.current;
      const rect = container.getBoundingClientRect();
      const scrollTop = -rect.top;
      const scrollableHeight = container.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrollTop / scrollableHeight));
      
      // Determine active step (0-3)
      const step = Math.floor(progress * 4);
      setActiveStep(Math.min(3, step));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="bg-slate-50">
      {/* Section Header */}
      <div className="py-20 px-6 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              How It Works
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Medellín, organized by one AI concierge.
            </h2>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              Restaurants, events, rentals, and itineraries — planned intelligently, approved by you.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Preview first</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Approve actions</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Undo anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll-Driven Two-Column Layout */}
      <div 
        ref={scrollContainerRef}
        className="relative bg-slate-50"
        style={{ height: '400vh' }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 py-16 h-full">
            <div className="grid lg:grid-cols-12 gap-12 h-full items-center">
              
              {/* LEFT COLUMN - Sticky Narrative (40%) */}
              <div className="lg:col-span-5 space-y-12">
                
                {/* Step 01 - Discover */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: activeStep === 0 ? 1 : 0.3,
                    x: activeStep === 0 ? 0 : -20
                  }}
                  transition={{ duration: 0.4 }}
                  className={`${activeStep === 0 ? 'scale-100' : 'scale-95'} transition-transform duration-400`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-400 ${
                      activeStep === 0 
                        ? 'bg-emerald-600 text-white shadow-lg' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      01
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-3">Discover</h3>
                      <p className="text-lg text-slate-600 leading-relaxed">
                        Tell us your vibe. We surface the best nearby picks.
                      </p>
                    </div>
                  </div>
                  {activeStep === 0 && (
                    <div className="ml-16 mt-4">
                      <div className="h-1 w-16 bg-emerald-600 rounded-full" />
                    </div>
                  )}
                </motion.div>

                {/* Step 02 - Plan */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: activeStep === 1 ? 1 : 0.3,
                    x: activeStep === 1 ? 0 : -20
                  }}
                  transition={{ duration: 0.4 }}
                  className={`${activeStep === 1 ? 'scale-100' : 'scale-95'} transition-transform duration-400`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-400 ${
                      activeStep === 1 
                        ? 'bg-emerald-600 text-white shadow-lg' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      02
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-3">Plan</h3>
                      <p className="text-lg text-slate-600 leading-relaxed">
                        AI matches your time and location with what's happening.
                      </p>
                    </div>
                  </div>
                  {activeStep === 1 && (
                    <div className="ml-16 mt-4">
                      <div className="h-1 w-16 bg-emerald-600 rounded-full" />
                    </div>
                  )}
                </motion.div>

                {/* Step 03 - Stay */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: activeStep === 2 ? 1 : 0.3,
                    x: activeStep === 2 ? 0 : -20
                  }}
                  transition={{ duration: 0.4 }}
                  className={`${activeStep === 2 ? 'scale-100' : 'scale-95'} transition-transform duration-400`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-400 ${
                      activeStep === 2 
                        ? 'bg-emerald-600 text-white shadow-lg' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      03
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-3">Stay</h3>
                      <p className="text-lg text-slate-600 leading-relaxed">
                        Find the right neighborhood, not just a listing.
                      </p>
                    </div>
                  </div>
                  {activeStep === 2 && (
                    <div className="ml-16 mt-4">
                      <div className="h-1 w-16 bg-emerald-600 rounded-full" />
                    </div>
                  )}
                </motion.div>

                {/* Step 04 - Itinerary */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: activeStep === 3 ? 1 : 0.3,
                    x: activeStep === 3 ? 0 : -20
                  }}
                  transition={{ duration: 0.4 }}
                  className={`${activeStep === 3 ? 'scale-100' : 'scale-95'} transition-transform duration-400`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-400 ${
                      activeStep === 3 
                        ? 'bg-emerald-600 text-white shadow-lg' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      04
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-3">Itinerary</h3>
                      <p className="text-lg text-slate-600 leading-relaxed">
                        Turn picks into a day plan. Approve, save, go.
                      </p>
                    </div>
                  </div>
                  {activeStep === 3 && (
                    <div className="ml-16 mt-4">
                      <div className="h-1 w-16 bg-emerald-600 rounded-full" />
                    </div>
                  )}
                </motion.div>

              </div>

              {/* RIGHT COLUMN - Fixed App Window (60%) */}
              <div className="lg:col-span-7 relative hidden lg:block">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                  
                  {/* Browser Chrome */}
                  <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="bg-white rounded-md px-3 py-1 text-xs text-slate-500 max-w-xs">
                        app.ilovemedellin.com/dashboard
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Content - Crossfading Screens */}
                  <div className="relative bg-slate-50 aspect-[16/10]">
                    
                    {/* Screen 1 - Discover */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: activeStep === 0 ? 1 : 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 p-8"
                    >
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">Exploring El Poblado</h3>
                          <p className="text-sm text-slate-600">📍 El Poblado</p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-slate-200">
                          <input 
                            type="text" 
                            placeholder="Search places, vibes, cravings..." 
                            className="w-full text-sm outline-none text-slate-900"
                            readOnly
                          />
                        </div>

                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">All</span>
                          <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-medium">Restaurants</span>
                          <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-medium">Coffee</span>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                          <div className="flex items-start gap-2 text-sm">
                            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-emerald-900">Thursday Afternoon in El Poblado</p>
                              <p className="text-emerald-700 text-xs">24°C — perfect rooftop coffee</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-slate-900">Restaurants</h4>
                            <span className="text-xs text-emerald-600 font-medium">See more →</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-lg overflow-hidden border border-emerald-200 shadow-sm">
                              <div className="h-24 bg-gradient-to-br from-emerald-100 to-emerald-50" />
                              <div className="p-3">
                                <p className="font-bold text-sm text-slate-900">El Cielo</p>
                                <p className="text-xs text-slate-600">⭐ 4.8 · $$ · 0.5km</p>
                                <span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">🎯 AI pick</span>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                              <div className="h-24 bg-gradient-to-br from-slate-100 to-slate-50" />
                              <div className="p-3">
                                <p className="font-bold text-sm text-slate-900">Carmen</p>
                                <p className="text-xs text-slate-600">⭐ 4.9 · $$$ · 1.2km</p>
                                <span className="inline-block mt-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">👥 Popular</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Screen 2 - Plan */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: activeStep === 1 ? 1 : 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 p-8"
                    >
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">Tonight in Laureles</h3>
                          <p className="text-sm text-slate-600">📍 Laureles</p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-slate-200">
                          <input 
                            type="text" 
                            placeholder="Search events, venues, vibes..." 
                            className="w-full text-sm outline-none text-slate-900"
                            readOnly
                          />
                        </div>

                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Tonight ✓</span>
                          <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-medium">This Weekend</span>
                          <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-medium">Live Music</span>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-start gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-amber-900">Tonight's Plan — Based on your vibe</p>
                              <p className="text-amber-700 text-xs">Cool evening, low rain risk. Best start time: 8:00 PM</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-slate-900">Events Near You</h4>
                            <span className="text-xs text-emerald-600 font-medium">See more →</span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="bg-white rounded-lg p-4 border border-emerald-200 shadow-sm">
                              <div className="flex gap-3">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm text-slate-900">Jazz Night @ Alambique</p>
                                  <p className="text-xs text-slate-600">⏰ 8:00 PM · 1.5km</p>
                                  <span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">🎯 Best match</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                              <div className="flex gap-3">
                                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm text-slate-900">Art Gallery Opening</p>
                                  <p className="text-xs text-slate-600">⏰ 7:30 PM · 2.1km</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Screen 3 - Stay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: activeStep === 2 ? 1 : 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 p-8"
                    >
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">Stays in Envigado</h3>
                          <p className="text-sm text-slate-600">📍 Envigado</p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3 border border-slate-200">
                          <input 
                            type="text" 
                            placeholder="Search rentals, neighborhoods, needs..." 
                            className="w-full text-sm outline-none text-slate-900"
                            readOnly
                          />
                        </div>

                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-medium">Short stay</span>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Monthly ✓</span>
                          <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-medium">Fast Wi-Fi</span>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                          <p className="text-xs text-slate-600 mb-2">Budget: $500 — $2000</p>
                          <div className="relative h-2 bg-slate-100 rounded-full">
                            <div className="absolute top-0 left-0 h-2 w-2/3 bg-emerald-600 rounded-full" />
                            <div className="absolute top-1/2 left-2/3 w-4 h-4 bg-emerald-600 rounded-full -translate-y-1/2 -translate-x-1/2 border-2 border-white shadow" />
                          </div>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                          <div className="flex items-start gap-2 text-sm">
                            <Home className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-emerald-900">🏘️ Best neighborhoods for your stay</p>
                              <p className="text-emerald-700 text-xs">Envigado is calmer, walkable, great for longer stays.</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-slate-900">Top Matches</h4>
                            <span className="text-xs text-emerald-600 font-medium">See more →</span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="bg-white rounded-lg overflow-hidden border border-emerald-200 shadow-sm">
                              <div className="h-24 bg-gradient-to-br from-emerald-100 to-emerald-50" />
                              <div className="p-3">
                                <p className="font-bold text-sm text-slate-900">Modern Studio</p>
                                <p className="text-xs text-slate-600">$850/mo · ⭐ 4.9 (23)</p>
                                <p className="text-xs text-slate-500 mt-1">Fast Wi-Fi · Quiet</p>
                                <span className="inline-block mt-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">🎯 Matches your stay</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Screen 4 - Itinerary */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: activeStep === 3 ? 1 : 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 p-8"
                    >
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-1">Saturday in Medellín</h3>
                            <p className="text-sm text-slate-600">El Poblado → Laureles</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-medium">
                              Optimize route
                            </button>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Morning</p>
                            <div className="bg-white rounded-lg p-3 border border-emerald-200 shadow-sm">
                              <div className="flex gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg flex-shrink-0 flex items-center justify-center text-lg">
                                  ☕
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm text-slate-900">Café Velvet</p>
                                  <p className="text-xs text-slate-600">El Poblado · 9:00 AM</p>
                                  <span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">🎯 AI pick</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Afternoon</p>
                            <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                              <div className="flex gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center text-lg">
                                  🌳
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm text-slate-900">Parque Lleras</p>
                                  <p className="text-xs text-slate-600">El Poblado · 2:00 PM</p>
                                  <span className="inline-block mt-1 text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">💾 Saved</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Night</p>
                            <div className="bg-white rounded-lg p-3 border border-emerald-200 shadow-sm">
                              <div className="flex gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg flex-shrink-0 flex items-center justify-center text-lg">
                                  🎵
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm text-slate-900">Jazz Night</p>
                                  <p className="text-xs text-slate-600">Laureles · 8:00 PM</p>
                                  <span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">🎯 Best match</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AI Suggestion */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-2 text-xs flex-1">
                              <Sparkles className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                              <p className="text-amber-900">
                                <span className="font-medium">AI Suggestions:</span> Swap dinner to reduce travel (-18 min)
                              </p>
                            </div>
                            <button className="text-amber-700 font-medium text-xs hover:underline">Apply</button>
                          </div>
                        </div>

                        {/* Action Bar */}
                        <div className="bg-slate-100 rounded-lg p-3 flex items-center justify-between">
                          <p className="text-xs text-slate-600">Preview mode · Nothing booked yet</p>
                          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors">
                            Approve plan
                          </button>
                        </div>
                      </div>
                    </motion.div>

                  </div>

                  {/* Caption */}
                  <div className="bg-slate-50 px-4 py-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500 text-center">Real dashboard screens — not mockups</p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
