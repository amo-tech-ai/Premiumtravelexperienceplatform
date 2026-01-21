/**
 * How It Works - Scroll-Driven Product Demo
 * Features 400vh scroll container with two-column layout
 * RIGHT COLUMN: Viewport-safe screens (no overflow, perfectly framed)
 * RESPONSIVE: Desktop (≥1024px), Tablet (768-1023px), Mobile (≤767px)
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Home, Shield, CheckCircle2 } from 'lucide-react';
import { HowItWorksMobile } from './HowItWorksMobile';
import { HowItWorksTablet } from './HowItWorksTablet';
import { getPrefersReducedMotion } from '../utils/motionPreferences';
import { CalendarScreen } from './CalendarScreen';
import { DiscoverSlideAnimated } from './demo-slides/DiscoverSlideAnimated';

export function HowItWorksScrollSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for reduced motion preference
    setPrefersReducedMotion(getPrefersReducedMotion());

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

      {/* Mobile Layout (≤767px) */}
      <div className="md:hidden">
        <HowItWorksMobile />
      </div>

      {/* Tablet Layout (768px - 1023px) */}
      <div className="hidden md:block lg:hidden">
        <HowItWorksTablet />
      </div>

      {/* Desktop Layout (≥1024px) - Scroll-Driven */}
      <div className="hidden lg:block">
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
                        <h3 className="text-3xl font-bold text-slate-900 mb-3">Schedule</h3>
                        <p className="text-lg text-slate-600 leading-relaxed">
                          See your week at a glance. Book activities and keep time for exploration.
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
                          app.ilovemedellin.com
                        </div>
                      </div>
                    </div>

                    {/* Dashboard Content - FIXED VIEWPORT (600px for Discover, 500px for others) */}
                    <div className="relative bg-slate-50 overflow-hidden" style={{ height: activeStep === 0 ? '600px' : '500px' }}>
                      
                      {/* Screen 1 - Discover */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: activeStep === 0 ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <DiscoverSlideAnimated />
                      </motion.div>

                      {/* Screen 2 - Plan (Calendar View) */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: activeStep === 1 ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 p-10 flex flex-col justify-center"
                      >
                        <CalendarScreen compact />
                      </motion.div>

                      {/* Screen 3 - Stay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: activeStep === 2 ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 p-10 flex flex-col justify-center"
                      >
                        {/* Header */}
                        <div className="mb-8">
                          <h3 className="text-2xl font-bold text-slate-900">Stays in Envigado</h3>
                        </div>
                        
                        {/* Budget Slider */}
                        <div className="bg-white rounded-xl p-5 border border-slate-200 mb-6">
                          <p className="text-sm text-slate-600 mb-4 font-medium">Budget: $500 — $2000</p>
                          <div className="relative h-2 bg-slate-100 rounded-full">
                            <div className="absolute top-0 left-0 h-2 w-2/3 bg-emerald-600 rounded-full" />
                            <div className="absolute top-1/2 left-2/3 w-5 h-5 bg-emerald-600 rounded-full -translate-y-1/2 -translate-x-1/2 border-2 border-white shadow-md" />
                          </div>
                        </div>

                        {/* Neighborhood Insight */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8">
                          <div className="flex items-start gap-3 text-sm">
                            <Home className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-emerald-900 mb-1">Best for your stay</p>
                              <p className="text-emerald-700">Envigado is calmer and walkable</p>
                            </div>
                          </div>
                        </div>

                        {/* Single Featured Rental */}
                        <div className="bg-white rounded-xl overflow-hidden border border-emerald-200 shadow-md">
                          <div className="h-32 bg-gradient-to-br from-emerald-100 to-emerald-50" />
                          <div className="p-5">
                            <p className="font-bold text-lg text-slate-900 mb-2">Modern Studio</p>
                            <p className="text-sm text-slate-600 mb-1">$850/mo · ⭐ 4.9 (23 reviews)</p>
                            <p className="text-xs text-slate-500 mb-3">Fast Wi-Fi · Quiet · Walkable</p>
                            <span className="inline-block text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-md font-semibold">🎯 Matches your stay</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Screen 4 - Itinerary (MAXIMALLY SIMPLIFIED) */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: activeStep === 3 ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 p-10 flex flex-col justify-center"
                      >
                        {/* Header */}
                        <div className="mb-8">
                          <h3 className="text-2xl font-bold text-slate-900 mb-1">Saturday in Medellín</h3>
                          <p className="text-sm text-slate-600">El Poblado → Laureles</p>
                        </div>

                        {/* Timeline (3 compact cards) */}
                        <div className="space-y-4 mb-8">
                          {/* Morning */}
                          <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm">
                            <div className="flex gap-3 items-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg flex-shrink-0 flex items-center justify-center text-xl">
                                ☕
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Morning</p>
                                <p className="font-bold text-sm text-slate-900">Café Velvet</p>
                                <p className="text-xs text-slate-600">9:00 AM · El Poblado</p>
                              </div>
                            </div>
                          </div>

                          {/* Afternoon */}
                          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                            <div className="flex gap-3 items-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center text-xl">
                                🌳
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Afternoon</p>
                                <p className="font-bold text-sm text-slate-900">Parque Lleras</p>
                                <p className="text-xs text-slate-600">2:00 PM · El Poblado</p>
                              </div>
                            </div>
                          </div>

                          {/* Night */}
                          <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm">
                            <div className="flex gap-3 items-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg flex-shrink-0 flex items-center justify-center text-xl">
                                🎵
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Night</p>
                                <p className="font-bold text-sm text-slate-900">Jazz Night</p>
                                <p className="text-xs text-slate-600">8:00 PM · Laureles</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AI Suggestion Banner */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <p className="text-sm text-amber-900">
                              <span className="font-semibold">AI suggests:</span> Swap dinner to save 18 min
                            </p>
                          </div>
                        </div>

                        {/* Primary Action Button */}
                        <button className="w-full bg-emerald-600 text-white rounded-xl py-4 text-base font-bold hover:bg-emerald-700 transition-colors shadow-md">
                          Approve Plan
                        </button>
                      </motion.div>

                    </div>

                    {/* Caption */}
                    <div className="bg-slate-50 px-4 py-2 border-t border-slate-200">
                      <p className="text-xs text-slate-500 text-center">Real dashboard screens</p>
                    </div>

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