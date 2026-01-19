/**
 * Get Inspired Gallery - Horizontal Snap-Scroll
 * Production-ready with smooth scrolling
 */

import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface Destination {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

const DESTINATIONS: Destination[] = [
  {
    id: '1',
    title: 'Tokyo',
    subtitle: 'Ancient temples meet neon streets',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    href: '/explore?destination=tokyo',
  },
  {
    id: '2',
    title: 'Paris',
    subtitle: 'Romance, art, and culinary excellence',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    href: '/explore?destination=paris',
  },
  {
    id: '3',
    title: 'Bali',
    subtitle: 'Tropical paradise and spiritual retreats',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    href: '/explore?destination=bali',
  },
  {
    id: '4',
    title: 'New York',
    subtitle: 'The city that never sleeps',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    href: '/explore?destination=new-york',
  },
  {
    id: '5',
    title: 'Santorini',
    subtitle: 'Azure waters and white-washed beauty',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    href: '/explore?destination=santorini',
  },
  {
    id: '6',
    title: 'Dubai',
    subtitle: 'Modern luxury in the desert',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    href: '/explore?destination=dubai',
  },
];

export function GetInspiredGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative bg-emerald-950 py-24 md:py-32">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <p className="mb-4 text-sm uppercase tracking-wider text-amber-500">
              Get Inspired
            </p>
            <h2 className="font-serif text-4xl tracking-tight text-white md:text-5xl">
              Discover your next adventure
            </h2>
          </div>
          
          {/* Navigation Buttons */}
          <div className="hidden gap-2 md:flex">
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

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {DESTINATIONS.map((dest, index) => (
            <motion.a
              key={dest.id}
              href={dest.href}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-[500px] w-[350px] flex-shrink-0 snap-start overflow-hidden rounded-2xl"
            >
              {/* Image */}
              <img
                src={dest.image}
                alt={dest.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="mb-2 font-serif text-3xl">{dest.title}</h3>
                <p className="text-white/80">{dest.subtitle}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}