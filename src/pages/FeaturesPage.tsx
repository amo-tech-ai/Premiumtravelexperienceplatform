/**
 * Features Page - I Love Medellín
 * Premium, intelligent features overview
 * Matches HomeV3 design system: emerald-950, serif fonts, amber accents
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Filter, 
  Map,
  Compass,
  Heart,
  Star,
  Navigation,
  Coffee,
  Home,
  Car,
  Music,
  ChevronRight,
  Check,
  Layers,
  Zap,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <FeaturesHero />
      <WhyChooseUs />
      <CoreDiscovery />
      <MapFirstExperience />
      <SmartFiltering />
      <PlanningTools />
      <LocalIntelligence />
      <FinalCTA />
    </div>
  );
}

/**
 * Section 1: Features Hero
 * Clean hero with serif typography
 */
function FeaturesHero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white">
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Eyebrow */}
          <p className="text-amber-500 uppercase tracking-wider text-sm font-bold mb-6">
            Features
          </p>

          {/* Main Headline - Serif */}
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-slate-900 leading-tight">
            Everything you need to
            <br />
            experience Medellín
          </h1>

          {/* Supporting Text */}
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Discover places, see them on the map, and plan your time — all in one calm interface.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/explore')}
              className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-base px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Start Exploring
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/how-it-works-v2')}
              className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-base px-8 py-6 rounded-full"
            >
              See How It Works
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Section 2: Why Choose Us (Stats Section)
 * Matches the image design exactly
 */
function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats = [
    { value: '120+', label: 'Curated Experiences', color: 'border-emerald-400' },
    { value: '15+', label: 'Destinations', color: 'border-emerald-400' },
    { value: '98%', label: 'Traveler Satisfaction', color: 'border-emerald-400' },
  ];

  return (
    <section ref={ref} className="py-24 px-6 bg-emerald-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-emerald-400 uppercase tracking-wider text-sm font-bold mb-6">
              Why Choose Us
            </p>
            
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              A journey crafted with{' '}
              <span className="italic">intelligence & care.</span>
            </h2>

            <p className="text-lg text-slate-300 leading-relaxed">
              We go beyond the guidebooks. Our platform uses data-driven insights and local expertise to curate trips that match your specific travel style.
            </p>
          </motion.div>

          {/* Right: Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.15 + 0.4, duration: 0.5 }}
                className="text-center"
              >
                <div className={`border-b-4 ${stat.color} pb-3 mb-3`}>
                  <div className="font-serif text-4xl md:text-5xl font-bold text-white">
                    {stat.value}
                  </div>
                </div>
                <p className="text-xs uppercase tracking-wide text-slate-400 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/**
 * Section 3: Core Discovery (Primary Feature)
 * Smart discovery by category and neighborhood
 */
function CoreDiscovery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const categories = [
    { icon: Coffee, label: 'Restaurants', count: '2,400+', color: 'bg-amber-100 text-amber-700' },
    { icon: Home, label: 'Apartments', count: '850+', color: 'bg-blue-100 text-blue-700' },
    { icon: Music, label: 'Events', count: '300+', color: 'bg-purple-100 text-purple-700' },
    { icon: Car, label: 'Car Rentals', count: '120+', color: 'bg-green-100 text-green-700' },
  ];

  return (
    <section ref={ref} className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-500 uppercase tracking-wider text-sm font-bold mb-6">
              Smart Discovery
            </p>

            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
              Discover places that match{' '}
              <span className="italic">your life</span>
            </h2>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Browse apartments, restaurants, events, cars, and trips — filtered by what matters to you. Our smart search understands context and preferences.
            </p>

            {/* Real-world example */}
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-slate-700 italic mb-2">
                    "I'm staying in Laureles and want a café nearby."
                  </p>
                  <p className="text-sm text-slate-600">
                    ILM shows cafés on the map, sorted by distance and vibe.
                  </p>
                </div>
              </div>
            </div>

            {/* Category grid */}
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                  className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center mb-3`}>
                    <category.icon className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-slate-900">{category.label}</div>
                  <div className="text-sm text-slate-500">{category.count}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Illustrated map preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Map background */}
            <div className="bg-slate-100 rounded-3xl p-8 shadow-xl">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 relative overflow-hidden">
                {/* Simulated map pins */}
                <div className="absolute inset-0 p-8">
                  {[
                    { top: '20%', left: '30%', color: 'bg-amber-500' },
                    { top: '40%', left: '60%', color: 'bg-blue-500' },
                    { top: '60%', left: '40%', color: 'bg-purple-500' },
                    { top: '70%', left: '70%', color: 'bg-green-500' },
                    { top: '30%', left: '80%', color: 'bg-amber-500' },
                  ].map((pin, index) => (
                    <motion.div
                      key={index}
                      className={`absolute w-8 h-8 ${pin.color} rounded-full shadow-lg flex items-center justify-center`}
                      style={{ top: pin.top, left: pin.left }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      <MapPin className="w-4 h-4 text-white" />
                    </motion.div>
                  ))}
                </div>

                {/* Grid lines (subtle) */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-4 grid-rows-4 h-full">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="border border-emerald-300" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Featured card overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="mt-4 bg-white rounded-2xl shadow-lg p-4 border border-slate-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Coffee className="w-8 h-8 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 mb-1">Café Velvet</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 text-amber-500 text-sm">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-medium">4.8</span>
                      </div>
                      <span className="text-slate-400">•</span>
                      <span className="text-sm text-slate-600">Laureles</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3 h-3" />
                      <span>0.4 km away</span>
                    </div>
                  </div>
                  <Heart className="w-5 h-5 text-slate-300 hover:text-rose-500 cursor-pointer transition-colors" />
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/**
 * Section 4: Map-First Experience
 * Dark emerald background
 */
function MapFirstExperience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-32 px-6 bg-emerald-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left: Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
              {/* Map header */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">Map View</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                    <Layers className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                    <Navigation className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Map canvas */}
              <div className="aspect-[4/3] bg-gradient-to-br from-emerald-50 to-slate-100 relative">
                {/* Neighborhood labels */}
                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
                  <span className="text-xs font-medium text-slate-700">Laureles</span>
                </div>
                <div className="absolute top-24 right-12 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
                  <span className="text-xs font-medium text-slate-700">El Poblado</span>
                </div>

                {/* Category pins with icons */}
                {[
                  { icon: Coffee, top: '25%', left: '35%', label: 'Café', color: 'bg-amber-500' },
                  { icon: Home, top: '45%', left: '65%', label: 'Apartment', color: 'bg-blue-500' },
                  { icon: Music, top: '60%', left: '45%', label: 'Event', color: 'bg-purple-500' },
                  { icon: Coffee, top: '70%', left: '75%', label: 'Restaurant', color: 'bg-amber-500' },
                ].map((pin, index) => (
                  <motion.div
                    key={index}
                    className="absolute"
                    style={{ top: pin.top, left: pin.left }}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: index * 0.15 + 0.3, type: 'spring', stiffness: 200 }}
                  >
                    <div className={`w-10 h-10 ${pin.color} rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}>
                      <pin.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded px-2 py-0.5 shadow-sm whitespace-nowrap text-xs font-medium text-slate-700">
                      {pin.label}
                    </div>
                  </motion.div>
                ))}

                {/* Roads/streets (simplified) */}
                <svg className="absolute inset-0 w-full h-full opacity-20">
                  <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#64748b" strokeWidth="2" />
                  <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#64748b" strokeWidth="2" />
                  <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#64748b" strokeWidth="2" />
                  <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#64748b" strokeWidth="2" />
                </svg>
              </div>

              {/* Map controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
                  <span className="text-slate-700 font-bold">+</span>
                </button>
                <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
                  <span className="text-slate-700 font-bold">−</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right: Explanation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 md:order-2"
          >
            <p className="text-emerald-400 uppercase tracking-wider text-sm font-bold mb-6">
              Map-First Experience
            </p>

            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              See Medellín{' '}
              <span className="italic">visually</span>,
              <br />
              not as a list
            </h2>

            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Pins show what's around you. Tap to preview. Zoom to discover more. Our map interface puts exploration first.
            </p>

            {/* Flow diagram */}
            <div className="space-y-4 mb-8">
              <FlowStep 
                number={1} 
                title="Browse the map" 
                description="See all categories at once"
                delay={0.4}
                isInView={isInView}
              />
              <FlowStep 
                number={2} 
                title="Tap any pin" 
                description="Preview details instantly"
                delay={0.5}
                isInView={isInView}
              />
              <FlowStep 
                number={3} 
                title="Zoom & filter" 
                description="Refine by neighborhood or type"
                delay={0.6}
                isInView={isInView}
              />
            </div>

            <div className="flex items-start gap-3 bg-emerald-900/50 border border-emerald-800 rounded-xl p-4">
              <Compass className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white mb-1">
                  Location-aware
                </p>
                <p className="text-sm text-slate-300">
                  Shows distance from your current position
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/**
 * Flow Step Component (for Map section)
 */
interface FlowStepProps {
  number: number;
  title: string;
  description: string;
  delay: number;
  isInView: boolean;
}

function FlowStep({ number, title, description, delay, isInView }: FlowStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.4 }}
      className="flex items-start gap-4"
    >
      <div className="w-8 h-8 rounded-full bg-emerald-400 text-emerald-950 flex items-center justify-center flex-shrink-0 font-bold text-sm">
        {number}
      </div>
      <div>
        <h4 className="font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
    </motion.div>
  );
}

/**
 * Section 5: Smart Filtering
 */
function SmartFiltering() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const filters = [
    { icon: MapPin, label: 'Neighborhood', example: 'Laureles, El Poblado' },
    { icon: Star, label: 'Rating', example: '4.5+ stars' },
    { icon: Clock, label: 'Open Now', example: 'Currently open' },
    { icon: Zap, label: 'Quick Results', example: 'Instant filtering' },
  ];

  return (
    <section ref={ref} className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-amber-500 uppercase tracking-wider text-sm font-bold mb-6">
            Smart Filtering
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            Filter by what{' '}
            <span className="italic">matters</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Narrow down thousands of options to find exactly what you're looking for
          </p>
        </motion.div>

        {/* Filter cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filters.map((filter, index) => (
            <motion.div
              key={filter.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
              className="group bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                <filter.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">{filter.label}</h3>
              <p className="text-sm text-slate-600">{filter.example}</p>
            </motion.div>
          ))}
        </div>

        {/* Example UI */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-slate-50 rounded-2xl p-8 border border-slate-200"
        >
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="bg-white border-2 border-emerald-300 rounded-full px-4 py-2 text-sm font-medium text-emerald-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Laureles
              <button className="ml-1 text-emerald-400 hover:text-emerald-600">×</button>
            </div>
            <div className="bg-white border-2 border-emerald-300 rounded-full px-4 py-2 text-sm font-medium text-emerald-700 flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              Restaurants
              <button className="ml-1 text-emerald-400 hover:text-emerald-600">×</button>
            </div>
            <div className="bg-white border-2 border-emerald-300 rounded-full px-4 py-2 text-sm font-medium text-emerald-700 flex items-center gap-2">
              <Star className="w-4 h-4" />
              4.5+
              <button className="ml-1 text-emerald-400 hover:text-emerald-600">×</button>
            </div>
            <button className="bg-emerald-600 text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More filters
            </button>
          </div>
          <p className="text-sm text-slate-600">
            <span className="font-bold text-emerald-600">47 results</span> found matching your criteria
          </p>
        </motion.div>

      </div>
    </section>
  );
}

/**
 * Section 6: Planning Tools
 * Dark emerald background
 */
function PlanningTools() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const tools = [
    {
      icon: Heart,
      title: 'Save Favorites',
      description: 'Bookmark places you love for quick access later',
      color: 'bg-gradient-to-br from-rose-400 to-rose-600'
    },
    {
      icon: Calendar,
      title: 'Plan Your Schedule',
      description: 'Organize activities by day and time',
      color: 'bg-gradient-to-br from-blue-400 to-blue-600'
    },
    {
      icon: Compass,
      title: 'Get Directions',
      description: 'Navigate to any location with one tap',
      color: 'bg-gradient-to-br from-emerald-400 to-emerald-600'
    }
  ];

  return (
    <section ref={ref} className="py-32 px-6 bg-emerald-950">
      <div className="max-w-7xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-emerald-400 uppercase tracking-wider text-sm font-bold mb-6">
            Planning Tools
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-white">
            From discovery to{' '}
            <span className="italic">your plan</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Tools to help you organize and remember the best spots
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
              className="text-center p-8"
            >
              <div className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                <tool.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{tool.title}</h3>
              <p className="text-slate-300 leading-relaxed">{tool.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

/**
 * Section 7: Local Intelligence
 */
function LocalIntelligence() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const features = [
    { icon: CheckCircle2, text: 'Real reviews from locals and travelers' },
    { icon: CheckCircle2, text: 'Up-to-date hours and contact info' },
    { icon: CheckCircle2, text: 'Photos from the community' },
    { icon: CheckCircle2, text: 'Neighborhood insights and tips' },
  ];

  return (
    <section ref={ref} className="py-32 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-amber-500 uppercase tracking-wider text-sm font-bold mb-6">
            Local Intelligence
          </p>

          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            Powered by{' '}
            <span className="italic">local knowledge</span>
          </h2>
          
          <p className="text-xl text-slate-600 mb-12">
            Information you can trust from people who know Medellín best
          </p>

          <div className="bg-slate-50 rounded-3xl shadow-lg p-12 mb-12 border border-slate-200">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1 + 0.4, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <feature.icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-slate-700">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

/**
 * Section 8: Final CTA
 * Emerald background with rose CTA
 */
function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-32 px-6 bg-emerald-950">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-white">
            Ready to explore Medellín?
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Start discovering the best places the city has to offer
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/explore')}
            className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-base px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Start Exploring
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
