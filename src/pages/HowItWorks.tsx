/**
 * How It Works - Scroll-Driven Product Demo
 * Breef-style scroll narrative with fixed product window
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  Home,
  MessageSquare,
  Plane,
  Compass,
  Calendar,
  Utensils,
  MapPin,
  Heart,
  Star,
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  Shield,
  RotateCcw
} from 'lucide-react';
import { Button } from '../components/ui/button';

export default function HowItWorks() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Calculate scroll progress and active step
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress within the container
      const scrollTop = -rect.top;
      const scrollableHeight = containerHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrollTop / scrollableHeight));

      setScrollProgress(progress);

      // Determine active step (0-3)
      const step = Math.floor(progress * 4);
      setActiveStep(Math.min(3, step));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      number: '01',
      title: 'Discover',
      description: 'Tell us your vibe. We surface the best nearby picks.',
      screen: 'discover'
    },
    {
      number: '02',
      title: 'Plan',
      description: 'AI matches your schedule and location with what\'s happening tonight.',
      screen: 'events'
    },
    {
      number: '03',
      title: 'Stay',
      description: 'Find the right neighborhood and rental, not just a listing.',
      screen: 'rentals'
    },
    {
      number: '04',
      title: 'Itinerary',
      description: 'Turn picks into a day plan with routes and timing.',
      screen: 'trips'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Section Header */}
      <section className="py-20 px-6 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              How It Works
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Medellín, organized by one AI concierge.
            </h1>
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
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                <span>Undo anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scroll-Driven Demo Section */}
      <section 
        ref={containerRef}
        className="relative"
        style={{ height: '400vh' }}
      >
        <div className="sticky top-0 h-screen flex items-center py-12 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* Left Column - Sticky Step Indicator */}
              <div className="lg:col-span-5 flex items-center">
                <div className="space-y-8 w-full">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: activeStep === index ? 1 : 0.4,
                        x: 0
                      }}
                      transition={{ duration: 0.3 }}
                      className={`relative pl-12 ${activeStep === index ? '' : 'cursor-pointer'}`}
                    >
                      {/* Active Indicator Bar */}
                      {activeStep === index && (
                        <motion.div
                          layoutId="activeBar"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-full"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}

                      {/* Step Number */}
                      <div className={`text-sm font-bold mb-2 ${
                        activeStep === index ? 'text-emerald-600' : 'text-slate-400'
                      }`}>
                        {step.number}
                      </div>

                      {/* Step Title */}
                      <h3 className={`text-2xl md:text-3xl font-bold mb-2 transition-colors ${
                        activeStep === index ? 'text-slate-900' : 'text-slate-500'
                      }`}>
                        {step.title}
                      </h3>

                      {/* Step Description */}
                      <p className={`text-base md:text-lg transition-colors ${
                        activeStep === index ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {step.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Column - Fixed App Window */}
              <div className="lg:col-span-7">
                <div className="sticky top-24">
                  
                  {/* App Window Shell */}
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                    
                    {/* Browser Chrome */}
                    <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-slate-300" />
                        <div className="w-3 h-3 rounded-full bg-slate-300" />
                        <div className="w-3 h-3 rounded-full bg-slate-300" />
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-xs text-slate-500 font-medium">Live Dashboard Preview</span>
                      </div>
                    </div>

                    {/* Screenshot Container */}
                    <div className="relative bg-slate-50 aspect-[16/10] overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeStep}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4, ease: 'easeInOut' }}
                          className="absolute inset-0"
                        >
                          {activeStep === 0 && <DiscoverScreen />}
                          {activeStep === 1 && <EventsScreen />}
                          {activeStep === 2 && <RentalsScreen />}
                          {activeStep === 3 && <ItineraryScreen />}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Caption */}
                  <p className="text-center text-sm text-slate-500 mt-4">
                    Real dashboard screens — not mockups
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to explore Medellín?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Start planning your perfect day with the AI concierge.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/app/concierge')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base px-8 py-6 rounded-full shadow-lg"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

    </div>
  );
}

// Dashboard Screen Components

function DiscoverScreen() {
  return (
    <div className="h-full bg-white flex">
      {/* Sidebar */}
      <div className="w-16 bg-slate-900 flex flex-col items-center py-4 gap-4">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">I❤️</span>
        </div>
        <Home className="w-5 h-5 text-emerald-400" />
        <MessageSquare className="w-5 h-5 text-slate-500" />
        <Plane className="w-5 h-5 text-slate-500" />
        <Compass className="w-5 h-5 text-slate-500" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 p-3">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Exploring · El Poblado</span>
          </div>
          <input
            type="text"
            placeholder="Search places, vibes, or cravings..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50"
            readOnly
          />
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">All</span>
            <span className="px-3 py-1 text-xs font-medium text-slate-600 rounded-full">Restaurants</span>
            <span className="px-3 py-1 text-xs font-medium text-slate-600 rounded-full">Coffee</span>
          </div>
        </div>

        {/* Context Banner */}
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 m-3">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="font-serif font-bold text-sm text-slate-900">Thursday Afternoon in El Poblado</h3>
          </div>
          <p className="text-xs text-slate-600">24°C — perfect for a rooftop coffee. Here are top picks near you.</p>
        </div>

        {/* Restaurant Cards */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-sm text-slate-900">Restaurants</h4>
            <button className="text-xs text-emerald-600 font-medium">See more</button>
          </div>
          
          <div className="space-y-2">
            <div className="bg-white border border-slate-200 rounded-xl p-2 flex gap-2">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h5 className="font-bold text-xs text-slate-900 truncate">El Cielo</h5>
                  <Heart className="w-3 h-3 text-slate-400 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs text-slate-600">4.8 · $$ · 0.5 km</span>
                </div>
                <div className="inline-block bg-emerald-50 px-2 py-0.5 rounded text-xs text-emerald-700 font-medium">
                  AI pick · Great rooftop views
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-2 flex gap-2">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h5 className="font-bold text-xs text-slate-900 truncate">Carmen</h5>
                  <Heart className="w-3 h-3 text-slate-400 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs text-slate-600">4.9 · $$$ · 1.2 km</span>
                </div>
                <div className="inline-block bg-emerald-50 px-2 py-0.5 rounded text-xs text-emerald-700 font-medium">
                  Popular with locals · Easy walk
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventsScreen() {
  return (
    <div className="h-full bg-white flex">
      {/* Sidebar */}
      <div className="w-16 bg-slate-900 flex flex-col items-center py-4 gap-4">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">I❤️</span>
        </div>
        <Home className="w-5 h-5 text-slate-500" />
        <MessageSquare className="w-5 h-5 text-slate-500" />
        <Calendar className="w-5 h-5 text-emerald-400" />
        <Utensils className="w-5 h-5 text-slate-500" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 p-3">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Tonight in · Laureles</span>
          </div>
          <input
            type="text"
            placeholder="Search events, venues, or vibes..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50"
            readOnly
          />
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">Tonight</span>
            <span className="px-3 py-1 text-xs font-medium text-slate-600 rounded-full">This Weekend</span>
            <span className="px-3 py-1 text-xs font-medium text-slate-600 rounded-full">Live Music</span>
          </div>
        </div>

        {/* Context Banner */}
        <div className="bg-sky-50 border-l-4 border-sky-500 p-3 m-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-sky-600" />
            <h3 className="font-serif font-bold text-sm text-slate-900">Tonight's Plan — Based on your vibe</h3>
          </div>
          <p className="text-xs text-slate-600">Cool evening, low rain risk. Best start time: 8:00 PM.</p>
        </div>

        {/* Event Cards */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-sm text-slate-900">Events Near You</h4>
            <button className="text-xs text-emerald-600 font-medium">See more</button>
          </div>
          
          <div className="space-y-2">
            <div className="bg-white border-2 border-emerald-200 rounded-xl p-2 flex gap-2">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="inline-block bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium mb-1">
                  Live Music
                </span>
                <h5 className="font-bold text-xs text-slate-900 mb-1">Jazz Night at Alambique</h5>
                <div className="flex items-center gap-1 text-xs text-slate-600 mb-1">
                  <Clock className="w-3 h-3" />
                  <span>8:00 PM · 1.5 km</span>
                </div>
                <div className="inline-block bg-emerald-50 px-2 py-0.5 rounded text-xs text-emerald-700 font-medium">
                  Best match · Short Uber
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-2 flex gap-2">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-orange-100 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="inline-block bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-medium mb-1">
                  Culture
                </span>
                <h5 className="font-bold text-xs text-slate-900 mb-1">Art Gallery Opening</h5>
                <div className="flex items-center gap-1 text-xs text-slate-600 mb-1">
                  <Clock className="w-3 h-3" />
                  <span>7:30 PM · 2.1 km</span>
                </div>
                <div className="inline-block bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-600 font-medium">
                  Good crowd · Fits your schedule
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RentalsScreen() {
  return (
    <div className="h-full bg-white flex">
      {/* Sidebar */}
      <div className="w-16 bg-slate-900 flex flex-col items-center py-4 gap-4">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">I❤️</span>
        </div>
        <Home className="w-5 h-5 text-emerald-400" />
        <MessageSquare className="w-5 h-5 text-slate-500" />
        <Calendar className="w-5 h-5 text-slate-500" />
        <MapPin className="w-5 h-5 text-slate-500" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 p-3">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Stays in · Envigado</span>
          </div>
          <input
            type="text"
            placeholder="Search rentals, neighborhoods, or needs..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50"
            readOnly
          />
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 text-xs font-medium text-slate-600 rounded-full">Short stay</span>
            <span className="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">Monthly</span>
            <span className="px-3 py-1 text-xs font-medium text-slate-600 rounded-full">Fast Wi-Fi</span>
          </div>
        </div>

        {/* Context Banner */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-3 m-3">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif font-bold text-sm text-slate-900">Best neighborhoods for your stay</h3>
          </div>
          <p className="text-xs text-slate-600">Envigado is calmer, walkable, great for longer stays.</p>
        </div>

        {/* Rental Cards */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-sm text-slate-900">Top Matches</h4>
            <button className="text-xs text-emerald-600 font-medium">See more</button>
          </div>
          
          <div className="space-y-2">
            <div className="bg-white border-2 border-emerald-200 rounded-xl p-2">
              <div className="w-full h-24 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg mb-2" />
              <h5 className="font-serif font-bold text-xs text-slate-900 mb-1">Modern Studio in Envigado</h5>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-900">$850/mo</span>
                <div className="flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs text-slate-600">4.9 (23)</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-1">
                <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">Fast Wi-Fi</span>
                <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">Quiet street</span>
              </div>
              <div className="inline-block bg-emerald-50 px-2 py-0.5 rounded text-xs text-emerald-700 font-medium">
                Matches your stay
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-2">
              <div className="w-full h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg mb-2" />
              <h5 className="font-serif font-bold text-xs text-slate-900 mb-1">Cozy Loft with Terrace</h5>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-900">$920/mo</span>
                <div className="flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs text-slate-600">4.8 (17)</span>
                </div>
              </div>
              <p className="text-xs text-slate-600">Near cafés + gym · 8 min walk</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItineraryScreen() {
  return (
    <div className="h-full bg-white flex">
      {/* Sidebar */}
      <div className="w-16 bg-slate-900 flex flex-col items-center py-4 gap-4">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">I❤️</span>
        </div>
        <Home className="w-5 h-5 text-slate-500" />
        <MessageSquare className="w-5 h-5 text-slate-500" />
        <Plane className="w-5 h-5 text-emerald-400" />
        <Calendar className="w-5 h-5 text-slate-500" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif font-bold text-sm text-slate-900">Saturday in Medellín</h3>
            <div className="flex gap-1">
              <button className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">
                Optimize route
              </button>
              <button className="px-2 py-1 text-xs font-medium border border-slate-200 text-slate-600 rounded">
                Share
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500">El Poblado → Laureles</p>
        </div>

        {/* Timeline */}
        <div className="p-3 space-y-3">
          
          {/* Morning */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Morning</div>
            <div className="bg-white border border-slate-200 rounded-xl p-2 flex gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-xs text-slate-900 mb-0.5">Café Velvet</h5>
                <p className="text-xs text-slate-600 mb-1">El Poblado · 9:00 AM</p>
                <span className="inline-block px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 rounded">
                  AI pick
                </span>
              </div>
            </div>
          </div>

          {/* Afternoon */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Afternoon</div>
            <div className="bg-white border border-slate-200 rounded-xl p-2 flex gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-xs text-slate-900 mb-0.5">Parque Lleras</h5>
                <p className="text-xs text-slate-600 mb-1">El Poblado · 2:00 PM</p>
                <span className="inline-block px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
                  Saved
                </span>
              </div>
            </div>
          </div>

          {/* Night */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Night</div>
            <div className="bg-white border border-emerald-200 rounded-xl p-2 flex gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-xs text-slate-900 mb-0.5">Jazz Night</h5>
                <p className="text-xs text-slate-600 mb-1">Laureles · 8:00 PM</p>
                <span className="inline-block px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 rounded">
                  Best match
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="mx-3 mb-3 p-2 bg-amber-50 rounded-xl border border-amber-200">
          <div className="flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <h4 className="font-bold text-xs text-slate-900">AI Suggestions</h4>
          </div>
          <p className="text-xs text-slate-600 mb-1">Swap dinner to reduce travel time (-18 min)</p>
          <button className="text-xs font-medium text-emerald-600">Apply</button>
        </div>

        {/* Approval Control */}
        <div className="mx-3 p-2 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
          <span className="text-xs text-slate-600">Preview mode · Nothing booked yet</span>
          <button className="px-2 py-1 text-xs font-bold bg-emerald-600 text-white rounded">
            Approve plan
          </button>
        </div>
      </div>
    </div>
  );
}