import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Shield, Calendar, CheckCircle, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../ui/utils';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  plan: 'explorer' | 'curator' | 'concierge';
}

const testimonials: Testimonial[] = [
  {
    quote: 'The AI agents saved me 15+ hours of research. I just told it my budget and preferences, and it built the perfect week. Worth every penny.',
    author: 'Sarah Chen',
    role: 'Digital Nomad',
    avatar: 'https://i.pravatar.cc/100?img=25',
    rating: 5,
    plan: 'curator'
  },
  {
    quote: 'Booking Assistant got me a reservation at a fully booked restaurant. The Concierge plan feels like having a personal travel agent who never sleeps. Magic!',
    author: 'Marcus Johnson',
    role: 'Travel Blogger',
    avatar: 'https://i.pravatar.cc/100?img=32',
    rating: 5,
    plan: 'concierge'
  },
  {
    quote: 'Started with the free plan to test it out, upgraded to Curator after one trip. The route optimization alone saves me 2+ hours per day. Game changer.',
    author: 'Elena Rodriguez',
    role: 'Frequent Traveler',
    avatar: 'https://i.pravatar.cc/100?img=47',
    rating: 5,
    plan: 'curator'
  }
];

const trustBadges = [
  {
    icon: Shield,
    label: 'Secure Payment',
    description: 'Bank-level encryption'
  },
  {
    icon: Calendar,
    label: '14-Day Free Trial',
    description: 'On paid plans'
  },
  {
    icon: Lock,
    label: 'No Credit Card',
    description: 'For free plan'
  },
  {
    icon: CheckCircle,
    label: '30-Day Refund',
    description: 'Money-back guarantee'
  }
];

export const PricingSocialProof: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="container mx-auto max-w-7xl">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
          Loved by 2,000+ Travelers
        </h2>
        <p className="text-xl text-slate-600">
          Join thousands who've transformed their travel planning with AI
        </p>
      </motion.div>

      {/* Testimonial Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <div className="relative bg-white rounded-3xl p-12 md:p-16 shadow-2xl border border-slate-200 overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100 to-amber-100 rounded-full blur-3xl opacity-50" />
            
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                      >
                        <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-2xl md:text-3xl font-serif text-slate-900 mb-8 leading-relaxed">
                    "{currentTestimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.author}
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-slate-900">
                        {currentTestimonial.author}
                      </div>
                      <div className="text-slate-600">
                        {currentTestimonial.role}
                      </div>
                      <div className="text-sm text-emerald-600 font-medium mt-1">
                        Using {currentTestimonial.plan.charAt(0).toUpperCase() + currentTestimonial.plan.slice(1)} Plan
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-slate-600" />
          </button>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentIndex 
                    ? "w-8 bg-emerald-600" 
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                )}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {trustBadges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="font-semibold text-slate-900 mb-1">
                {badge.label}
              </div>
              <div className="text-sm text-slate-500">
                {badge.description}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <div className="inline-flex flex-col md:flex-row items-center gap-8 md:gap-12 px-12 py-8 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-2xl">
          <div>
            <div className="text-4xl font-bold text-emerald-900 mb-1">2,000+</div>
            <div className="text-slate-600">Active Travelers</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-slate-300" />
          <div>
            <div className="text-4xl font-bold text-emerald-900 mb-1">4.9/5</div>
            <div className="text-slate-600">Average Rating</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-slate-300" />
          <div>
            <div className="text-4xl font-bold text-emerald-900 mb-1">15hrs</div>
            <div className="text-slate-600">Saved Per Trip</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
