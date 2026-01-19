/**
 * Home V3 - I Love Medellín Landing Page
 * Clean, modern hero with masonry image grid
 */

import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  Home, 
  Car, 
  Utensils, 
  Calendar, 
  Plane,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { HowItWorksScrollSection } from '../components/HowItWorksScrollSection';

export default function HomeV3() {
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 500;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Masonry Grid Images - Colombia destinations
  const masonryImages = [
    // A. City & Urban Life (2 images)
    {
      src: 'https://images.unsplash.com/photo-1720630275162-eb3734164d05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRlbGxpbiUyMHNreWxpbmUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzY4ODE0NzIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Medellín skyline with mountains',
      category: 'city'
    },
    {
      src: 'https://images.unsplash.com/photo-1612199327011-7acf33177b01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRlbGxpbiUyMHJvb2Z0b3AlMjBjaXR5JTIwdmlld3xlbnwxfHx8fDE3Njg4MTQ3MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Medellín rooftop view',
      category: 'city'
    },
    // B. Nature & Landscapes (3 images)
    {
      src: 'https://images.unsplash.com/photo-1754380578509-7a0fbe72ac4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYSUyMGNhcmliYmVhbiUyMGJlYWNofGVufDF8fHx8MTc2ODgxNDcyMnww&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Caribbean beach Colombia',
      category: 'nature'
    },
    {
      src: 'https://images.unsplash.com/photo-1666990985570-cbdabbf55bed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYSUyMHdhdGVyZmFsbCUyMG5hdHVyZXxlbnwxfHx8fDE3Njg4MTQ3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Colombian waterfall',
      category: 'nature'
    },
    {
      src: 'https://images.unsplash.com/photo-1635991062422-b3e2f8c36dce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYSUyMGdyZWVuJTIwanVuZ2xlJTIwbW91bnRhaW5zfGVufDF8fHx8MTc2ODgxNDcyMnww&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Colombian green mountains',
      category: 'nature'
    },
    // C. Experiences & Lifestyle (2 images)
    {
      src: 'https://images.unsplash.com/photo-1644621967217-bc7681c46aec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYSUyMGNhZmUlMjBjb2ZmZWUlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzY4ODE0NzIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Colombian café lifestyle',
      category: 'experience'
    },
    {
      src: 'https://images.unsplash.com/photo-1759375204445-3ae9415f376e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYSUyMHN0cmVldCUyMGNpdHklMjBsaWZlfGVufDF8fHx8MTc2ODgxNDcyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Colombian street life',
      category: 'experience'
    },
    // D. Culture / Iconic Moments (2 images)
    {
      src: 'https://images.unsplash.com/photo-1678422151003-4a920e7a3de8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJ0YWdlbmElMjBjb2xvcmZ1bCUyMGhvdXNlc3xlbnwxfHx8fDE3Njg4MTQ3MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Cartagena colorful architecture',
      category: 'culture'
    },
    {
      src: 'https://images.unsplash.com/photo-1633830786693-6192ef6d06a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYSUyMHN1bnNldCUyMGJlYWNoJTIwcGFsbXxlbnwxfHx8fDE3Njg4MTQ3MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      alt: 'Colombian sunset beach',
      category: 'culture'
    },
  ];

  const features = [
    {
      icon: Home,
      title: 'Rentals',
      description: 'Curated apartments for short and long stays',
      href: '/real-estate',
    },
    {
      icon: Car,
      title: 'Auto',
      description: 'Premium car rentals and road trip planning',
      href: '/explore',
    },
    {
      icon: Utensils,
      title: 'Restaurants',
      description: 'Local gems and fine dining experiences',
      href: '/explore',
    },
    {
      icon: Calendar,
      title: 'Events',
      description: 'Concerts, meetups, and cultural experiences',
      href: '/explore',
    },
    {
      icon: Plane,
      title: 'Travel',
      description: 'Day trips and weekend getaways',
      href: '/experiences',
    },
  ];

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Tell the AI what you want',
      description: 'Share your preferences, dates, and budget in natural language',
      prompt: '"Find a 2-month apartment in Laureles with a view"',
    },
    {
      step: '02',
      title: 'AI curates options',
      description: 'Our intelligent system searches and filters the best matches',
      prompt: 'Analyzing 300+ listings...',
    },
    {
      step: '03',
      title: 'You review & approve',
      description: 'Browse recommendations and choose what you like',
      prompt: 'Found 8 perfect matches',
    },
    {
      step: '04',
      title: 'Book and enjoy',
      description: 'Confirm your selection and let us handle the details',
      prompt: 'Reservation confirmed ✓',
    },
  ];

  const featureSections = [
    {
      title: 'Find the right place — not just any place',
      subtitle: 'Rentals',
      description: 'Whether you need a week or a year, our AI understands your lifestyle and finds apartments that feel like home. Local knowledge meets intelligent matching.',
      image: 'https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3Njg3Mjk3NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      cta: 'Browse Rentals',
      href: '/real-estate',
    },
    {
      title: 'Drive your adventure',
      subtitle: 'Auto',
      description: 'From city cruising to mountain expeditions, get the perfect vehicle with pre-planned routes and local driving tips.',
      image: 'https://images.unsplash.com/photo-1687993320725-c4c2708ef074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjByZW50YWx8ZW58MXx8fHwxNzY4NzM5NzcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      cta: 'Explore Auto',
      href: '/explore',
    },
    {
      title: 'Taste the city',
      subtitle: 'Restaurants',
      description: 'Beyond tourist traps. Our AI learns your palate and reveals hidden culinary gems approved by locals.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3Njg3MDUwNDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      cta: 'Find Restaurants',
      href: '/explore',
    },
    {
      title: 'Never miss the moment',
      subtitle: 'Events',
      description: 'Live music, art shows, cultural festivals — the AI keeps you connected to what\'s happening now.',
      image: 'https://images.unsplash.com/photo-1669670617524-5f08060c8dcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwZXZlbnQlMjBjcm93ZHxlbnwxfHx8fDE3Njg3NDc1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      cta: 'Discover Events',
      href: '/explore',
    },
    {
      title: 'Escape beyond the city',
      subtitle: 'Travel',
      description: 'Weekend getaways and day trips designed for your pace. Coffee country, coastal towns, mountain retreats.',
      image: 'https://images.unsplash.com/photo-1768405384053-81a5c3e57766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMHRyYXZlbCUyMHZhY2F0aW9ufGVufDF8fHx8MTc2ODgwNTg0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      cta: 'Plan Your Trip',
      href: '/experiences',
    },
  ];

  const aiDifferentiators = [
    {
      icon: Sparkles,
      title: 'One AI, many features',
      description: 'A single intelligent concierge that understands all your needs — from housing to dining to adventures.',
    },
    {
      icon: Shield,
      title: 'You always approve',
      description: 'The AI recommends, you decide. No automatic bookings, no surprises. Complete control at every step.',
    },
    {
      icon: MapPin,
      title: 'Built for Medellín',
      description: 'Trained on local data, cultural context, and real-time availability. Not generic — deeply local.',
    },
  ];

  const inspirationSlides = [
    {
      image: 'https://images.unsplash.com/photo-1640768239887-77479f49a7dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRlbGxpbiUyMGNvbG9tYmlhJTIwY2l0eSUyMGFlcmlhbHxlbnwxfHx8fDE3Njg4MDU4NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      caption: 'Medellín skyline',
    },
    {
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      caption: 'Coffee region escapes',
    },
    {
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      caption: 'Caribbean coast',
    },
    {
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      caption: 'Mountain adventures',
    },
    {
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      caption: 'Urban exploration',
    },
  ];

  const collections = [
    {
      title: 'Vibrant Nightlife',
      tag: 'Events',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    },
    {
      title: 'Nature Escapes',
      tag: 'Travel',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    },
    {
      title: 'Prime Real Estate',
      tag: 'Rentals',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    },
    {
      title: 'Culinary Journey',
      tag: 'Restaurants',
      image: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. HERO SECTION - Clean Two-Column Layout with Masonry Grid */}
      <section className="relative py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Hero Container with rounded background */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-0 min-h-[600px]">
              
              {/* LEFT COLUMN - Text & Actions (45%) */}
              <div className="lg:col-span-5 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Brand Mention */}
                  <div className="mb-8">
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                      I Love Medellín
                    </span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                    Your Next Adventure Starts Here in Colombia
                  </h1>

                  {/* Supporting Text */}
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                    Welcome to I Love Colombia — your guide to discovering cities, experiences, and unforgettable trips across the country.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Button
                      size="lg"
                      onClick={() => navigate('/explore')}
                      className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-base px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                      Explore experiences
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate('/app/concierge')}
                      className="border-2 border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 text-base px-8 py-6 rounded-full font-semibold"
                    >
                      Subscribe
                    </Button>
                  </div>

                  {/* Trust Indicator */}
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Free to explore • No credit card required</span>
                  </div>
                </motion.div>
              </div>

              {/* RIGHT COLUMN - Masonry Image Grid (55%) */}
              <div className="lg:col-span-7 p-6 md:p-8 bg-gradient-to-br from-slate-50 to-white flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-full"
                >
                  {/* Masonry Grid using CSS Grid */}
                  <div className="grid grid-cols-3 gap-3 auto-rows-[140px]">
                    
                    {/* Row 1 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all group"
                    >
                      <img
                        src={masonryImages[0].src}
                        alt={masonryImages[0].alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all group"
                    >
                      <img
                        src={masonryImages[1].src}
                        alt={masonryImages[1].alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </motion.div>

                    {/* Row 2 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="col-span-1 row-span-2 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all group"
                    >
                      <img
                        src={masonryImages[2].src}
                        alt={masonryImages[2].alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all group"
                    >
                      <img
                        src={masonryImages[3].src}
                        alt={masonryImages[3].alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all group"
                    >
                      <img
                        src={masonryImages[4].src}
                        alt={masonryImages[4].alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </motion.div>

                    {/* Row 3 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 }}
                      className="col-span-2 row-span-1 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all group"
                    >
                      <img
                        src={masonryImages[5].src}
                        alt={masonryImages[5].alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all group"
                    >
                      <img
                        src={masonryImages[6].src}
                        alt={masonryImages[6].alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </motion.div>

                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. GET INSPIRED / DISCOVER SLIDER */}
      <section className="relative py-24 px-6 bg-emerald-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 flex items-end justify-between"
          >
            <div>
              <p className="text-amber-400 uppercase tracking-wider text-sm font-bold mb-4">
                Get Inspired
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">
                Discover your next adventure
              </h2>
            </div>

            <div className="hidden md:flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => scroll('left')}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => scroll('right')}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          {/* Horizontal Slider */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {inspirationSlides.map((slide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative h-[400px] w-[350px] flex-shrink-0 snap-start overflow-hidden rounded-2xl group cursor-pointer"
              >
                <img
                  src={slide.image}
                  alt={slide.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-xl font-serif">{slide.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. QUICK FEATURE OVERVIEW */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(feature.href)}
                className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <div className="mb-4 w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <feature.icon className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS - Scroll-Driven Product Demo */}
      <HowItWorksScrollSection />

      {/* 5. FEATURE SECTIONS (Alternating Layout) */}
      {featureSections.map((section, index) => (
        <section
          key={section.subtitle}
          className={`py-24 px-6 ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
        >
          <div className="max-w-7xl mx-auto">
            <div className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={index % 2 === 1 ? 'md:col-start-2' : ''}
              >
                <p className="text-amber-500 uppercase tracking-wider text-sm font-bold mb-4">
                  {section.subtitle}
                </p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                  {section.title}
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  {section.description}
                </p>
                <Button
                  onClick={() => navigate(section.href)}
                  variant="outline"
                  size="lg"
                  className="border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white font-bold rounded-xl"
                >
                  {section.cta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative h-[400px] rounded-2xl overflow-hidden shadow-xl ${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}
              >
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* 6. AI DIFFERENTIATION */}
      <section className="py-32 px-6 bg-emerald-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-amber-400 uppercase tracking-wider text-sm font-bold mb-4">
              Intelligent by Design
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
              AI that works for you, not instead of you
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {aiDifferentiators.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center p-8"
              >
                <div className="mb-6 w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-2xl text-white mb-4">{item.title}</h3>
                <p className="text-slate-300 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CURATED COLLECTIONS */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-amber-500 uppercase tracking-wider text-sm font-bold mb-4">
              Curated Collections
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900">
              Experiences designed for you
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative h-[350px] overflow-hidden rounded-2xl shadow-lg cursor-pointer"
              >
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-amber-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                    {collection.tag}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white text-2xl font-serif">{collection.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TRUST & SOCIAL PROOF */}
      <section className="py-24 px-6 bg-emerald-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-6xl font-bold text-amber-400 mb-2">120+</div>
              <p className="text-slate-300 text-lg">Curated experiences</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-6xl font-bold text-amber-400 mb-2">15+</div>
              <p className="text-slate-300 text-lg">Destinations covered</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-6xl font-bold text-amber-400 mb-2">98%</div>
              <p className="text-slate-300 text-lg">Satisfaction rate</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="py-32 px-6 bg-gradient-to-b from-slate-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Let the Concierge Plan It For You
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Preview everything. Approve only what you like.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/app/concierge')}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-lg px-10 py-6 rounded-xl"
          >
            Ask the Concierge
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Free to explore</span>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}