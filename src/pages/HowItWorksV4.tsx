/**
 * How It Works V4 - I Love Medellín
 * Luxury, intelligent scroll-driven storytelling
 * Design: Clarity before cleverness, one idea per section
 */

import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  Search,
  Calendar,
  Home,
  Map,
  Heart,
  MessageCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Clock,
  Users,
  Star,
  Compass,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';

export default function HowItWorksV4() {
  return (
    <div className="min-h-screen bg-slate-50">
      <IntroSection />
      <CoreFlowSection />
      <DiscoverSection />
      <ScheduleSection />
      <StaySection />
      <ItinerarySection />
      <IntelligenceSection />
      <FinalCTA />
    </div>
  );
}

/**
 * SECTION 1: INTRO / CONTEXT
 * Set expectations and frame the journey
 */
function IntroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative min-h-[80vh] flex items-center justify-center bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Eyebrow */}
          <p className="text-amber-500 uppercase tracking-wider text-sm font-bold mb-6">
            How It Works
          </p>

          {/* Headline - Serif */}
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
            Your Medellín life,{' '}
            <span className="italic">simplified.</span>
          </h1>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-12">
            Discover, plan, and organize everything — guided by one intelligent concierge.
          </p>

          {/* Divider line with animation */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto rounded-full"
          />
        </motion.div>
      </div>
    </section>
  );
}

/**
 * SECTION 2: THE CORE FLOW (OVERVIEW)
 * High-level understanding in one glance
 */
function CoreFlowSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Discover',
      description: 'Browse places, events, and experiences',
      color: 'from-amber-400 to-amber-600',
    },
    {
      number: '02',
      icon: Calendar,
      title: 'Schedule',
      description: 'Plan your days with AI assistance',
      color: 'from-blue-400 to-blue-600',
    },
    {
      number: '03',
      icon: Home,
      title: 'Stay',
      description: 'Find your perfect accommodation',
      color: 'from-purple-400 to-purple-600',
    },
    {
      number: '04',
      icon: Map,
      title: 'Itinerary',
      description: 'See everything organized on one map',
      color: 'from-emerald-400 to-emerald-600',
    },
  ];

  return (
    <section ref={ref} className="py-32 px-6 bg-emerald-950">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-emerald-400 uppercase tracking-wider text-sm font-bold mb-6">
            The Core Flow
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
            Four steps to your{' '}
            <span className="italic">perfect experience</span>
          </h2>
        </motion.div>

        {/* Desktop: Horizontal Flow */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-blue-400 via-purple-400 to-emerald-400 opacity-30"
              style={{ transformOrigin: 'left' }}
            />

            {/* Steps */}
            <div className="grid grid-cols-4 gap-8 relative">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.15 + 0.4, duration: 0.6 }}
                  className="text-center"
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Step Number */}
                  <div className="text-xs font-bold text-emerald-400 mb-3 tracking-wider">
                    STEP {step.number}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Stack */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.4, duration: 0.6 }}
              className="flex items-start gap-6 bg-emerald-900/30 p-6 rounded-2xl border border-emerald-800"
            >
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <step.icon className="w-7 h-7 text-white" />
              </div>

              <div className="flex-1">
                {/* Step Number */}
                <div className="text-xs font-bold text-emerald-400 mb-2 tracking-wider">
                  STEP {step.number}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 text-emerald-400 mt-4" />
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

/**
 * SECTION 3: DISCOVER
 * One idea per section - exploration
 */
function DiscoverSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const navigate = useNavigate();

  const categories = [
    { icon: MapPin, label: 'Restaurants', count: '2,400+' },
    { icon: Calendar, label: 'Events', count: '300+' },
    { icon: Home, label: 'Rentals', count: '850+' },
    { icon: Compass, label: 'Experiences', count: '120+' },
  ];

  return (
    <section ref={ref} className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-500 uppercase tracking-wider text-sm font-bold mb-6">
              Step 01 — Discover
            </p>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Find what{' '}
              <span className="italic">matters to you</span>
            </h2>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Browse curated places by category, neighborhood, or vibe. Filter by ratings, price, or distance. Save favorites to build your collection.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <FeatureItem
                icon={Search}
                text="Smart search understands natural language"
                isInView={isInView}
                delay={0.4}
              />
              <FeatureItem
                icon={Star}
                text="Filter by ratings, price, and distance"
                isInView={isInView}
                delay={0.5}
              />
              <FeatureItem
                icon={Heart}
                text="Save places to your personal collection"
                isInView={isInView}
                delay={0.6}
              />
            </div>

            <Button
              onClick={() => navigate('/explore')}
              variant="outline"
              size="lg"
              className="border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white font-bold rounded-xl"
            >
              Explore Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-slate-50 rounded-3xl p-8 shadow-lg border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.4 }}
                    className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{category.label}</h4>
                    <p className="text-sm text-slate-500">{category.count}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/**
 * SECTION 4: SCHEDULE
 * Plan your days with AI
 */
function ScheduleSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-32 px-6 bg-emerald-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Visual (Calendar Example) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-900">Your Schedule</h4>
                  <p className="text-sm text-slate-500">Saturday, January 18</p>
                </div>
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>

              {/* Time Slots */}
              <div className="space-y-3">
                {[
                  { time: '09:00 AM', title: 'Breakfast at Café Velvet', color: 'bg-amber-100 border-amber-300' },
                  { time: '11:00 AM', title: 'Explore El Poblado', color: 'bg-blue-100 border-blue-300' },
                  { time: '02:00 PM', title: 'Lunch at Carmen', color: 'bg-purple-100 border-purple-300' },
                  { time: '06:00 PM', title: 'Rooftop Drinks', color: 'bg-emerald-100 border-emerald-300' },
                ].map((slot, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.1 + 0.4, duration: 0.4 }}
                    className={`${slot.color} border-l-4 rounded-r-xl p-4`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-slate-600" />
                      <div>
                        <div className="text-xs font-medium text-slate-600">{slot.time}</div>
                        <div className="font-semibold text-slate-900">{slot.title}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AI Suggestion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="mt-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 flex items-start gap-3 border border-emerald-200"
              >
                <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  <span className="font-semibold">AI suggests:</span> Add 30 minutes travel time between locations
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <p className="text-emerald-400 uppercase tracking-wider text-sm font-bold mb-6">
              Step 02 — Schedule
            </p>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Plan your days with{' '}
              <span className="italic">AI assistance</span>
            </h2>

            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Drag and drop activities into your calendar. The AI optimizes timing, suggests travel routes, and warns about conflicts.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <FeatureItemLight
                icon={Calendar}
                text="Visual drag-and-drop calendar"
                isInView={isInView}
                delay={0.4}
              />
              <FeatureItemLight
                icon={Sparkles}
                text="AI optimizes timing and routes"
                isInView={isInView}
                delay={0.5}
              />
              <FeatureItemLight
                icon={CheckCircle2}
                text="Conflict detection and warnings"
                isInView={isInView}
                delay={0.6}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/**
 * SECTION 5: STAY
 * Find accommodations
 */
function StaySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-500 uppercase tracking-wider text-sm font-bold mb-6">
              Step 03 — Stay
            </p>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Find your{' '}
              <span className="italic">perfect home base</span>
            </h2>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Browse curated apartments and hotels by neighborhood. Filter by amenities, price, and proximity to your planned activities.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <FeatureItem
                icon={Home}
                text="Verified listings with honest reviews"
                isInView={isInView}
                delay={0.4}
              />
              <FeatureItem
                icon={MapPin}
                text="See distance to your itinerary items"
                isInView={isInView}
                delay={0.5}
              />
              <FeatureItem
                icon={Star}
                text="Neighborhood guides and local tips"
                isInView={isInView}
                delay={0.6}
              />
            </div>

            <Button
              onClick={() => navigate('/real-estate')}
              variant="outline"
              size="lg"
              className="border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white font-bold rounded-xl"
            >
              Browse Rentals
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          {/* Right: Property Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
              {/* Property Image */}
              <div className="h-64 bg-gradient-to-br from-emerald-100 to-blue-100 relative">
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-md">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-current" />
                    <span className="text-sm font-bold text-slate-900">4.9</span>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Home className="w-24 h-24 text-emerald-600 opacity-30" />
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  Modern Loft in El Poblado
                </h4>
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>0.8 km from your itinerary</span>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {['WiFi', 'Kitchen', 'Workspace', 'Pool'].map((amenity) => (
                    <span
                      key={amenity}
                      className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-700"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div>
                    <span className="text-2xl font-bold text-slate-900">$85</span>
                    <span className="text-sm text-slate-500">/night</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/**
 * SECTION 6: ITINERARY
 * See everything organized
 */
function ItinerarySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-32 px-6 bg-emerald-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Map Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl relative overflow-hidden">
                {/* Simulated route line */}
                <svg className="absolute inset-0 w-full h-full">
                  <motion.path
                    d="M 100 80 Q 150 120, 200 160 T 300 240"
                    stroke="#10b981"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="8 4"
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                </svg>

                {/* Location pins */}
                {[
                  { top: '20%', left: '25%', label: '1', color: 'bg-amber-500' },
                  { top: '40%', left: '50%', label: '2', color: 'bg-blue-500' },
                  { top: '60%', left: '75%', label: '3', color: 'bg-purple-500' },
                ].map((pin, index) => (
                  <motion.div
                    key={index}
                    className="absolute"
                    style={{ top: pin.top, left: pin.left }}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: index * 0.2 + 0.6, type: 'spring' }}
                  >
                    <div className={`w-10 h-10 ${pin.color} rounded-full shadow-lg flex items-center justify-center text-white font-bold border-4 border-white`}>
                      {pin.label}
                    </div>
                  </motion.div>
                ))}

                {/* Start point (home) */}
                <motion.div
                  className="absolute top-[10%] left-[15%]"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  <div className="w-12 h-12 bg-emerald-600 rounded-full shadow-lg flex items-center justify-center border-4 border-white">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Route Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="mt-6 flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>3 locations</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>~45 min total</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Optimized</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <p className="text-emerald-400 uppercase tracking-wider text-sm font-bold mb-6">
              Step 04 — Itinerary
            </p>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              See everything{' '}
              <span className="italic">organized on one map</span>
            </h2>

            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Your schedule, accommodations, and saved places appear together. Get walking directions, estimated times, and route optimization.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <FeatureItemLight
                icon={Map}
                text="All your plans visualized on one map"
                isInView={isInView}
                delay={0.4}
              />
              <FeatureItemLight
                icon={Navigation}
                text="Optimized routes between locations"
                isInView={isInView}
                delay={0.5}
              />
              <FeatureItemLight
                icon={Clock}
                text="Real-time travel duration estimates"
                isInView={isInView}
                delay={0.6}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/**
 * SECTION 7: INTELLIGENCE LAYER
 * What makes it different
 */
function IntelligenceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const features = [
    {
      icon: Sparkles,
      title: 'AI Learns Your Style',
      description: 'The more you use it, the better it understands your preferences.',
    },
    {
      icon: MessageCircle,
      title: 'Natural Language',
      description: 'Just type what you want — no complex forms or filters.',
    },
    {
      icon: Users,
      title: 'Local Expertise',
      description: 'Powered by real data from people who live in Medellín.',
    },
  ];

  return (
    <section ref={ref} className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-amber-500 uppercase tracking-wider text-sm font-bold mb-6">
            Intelligent by Design
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            What makes it{' '}
            <span className="italic">different</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Not just a directory — an intelligent system that learns and adapts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

/**
 * SECTION 8: FINAL CTA
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
            Ready to start planning?
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Your Medellín experience begins here
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/explore')}
              className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-base px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Start Exploring
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/features-ilm')}
              className="border-2 border-white/20 bg-white/10 text-white hover:bg-white/20 font-semibold text-base px-12 py-6 rounded-full"
            >
              View All Features
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * HELPER COMPONENTS
 */

// Feature Item (Dark Background)
interface FeatureItemLightProps {
  icon: React.ElementType;
  text: string;
  isInView: boolean;
  delay: number;
}

function FeatureItemLight({ icon: Icon, text, isInView, delay }: FeatureItemLightProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3"
    >
      <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3 h-3 text-emerald-950" />
      </div>
      <span className="text-slate-300">{text}</span>
    </motion.div>
  );
}

// Feature Item (Light Background)
interface FeatureItemProps {
  icon: React.ElementType;
  text: string;
  isInView: boolean;
  delay: number;
}

function FeatureItem({ icon: Icon, text, isInView, delay }: FeatureItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3"
    >
      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3 h-3 text-emerald-600" />
      </div>
      <span className="text-slate-700">{text}</span>
    </motion.div>
  );
}
