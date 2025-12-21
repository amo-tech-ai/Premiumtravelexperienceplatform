/**
 * Hero Section - Luxury Homepage
 * 
 * Production-ready hero with:
 * - Parallax background
 * - Editorial typography (72px Canela)
 * - Smooth scroll animations
 * - Responsive design
 * 
 * Reference: /docs/rules/master-design-spec.md (Section 2.1)
 */

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  primaryCTA?: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  backgroundImage?: string;
}

export function HeroSection({
  headline = 'Your Next Adventure Awaits',
  subheadline = 'AI-powered travel planning that feels like having a personal concierge',
  primaryCTA = { label: 'Plan Your Trip', href: '/app/trips' },
  secondaryCTA = { label: 'Explore Collections', href: '/collections' },
  backgroundImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80',
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Parallax background (0.5x scroll speed)
  const backgroundY = useTransform(scrollY, [0, 500], [0, 250]);

  // Fade out content on scroll
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Scale down content slightly on scroll
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-stone-900"
    >
      {/* Parallax Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 h-[120vh]"
      >
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-900/20 to-stone-900/60" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative flex h-full items-center justify-center px-6 text-center"
      >
        <div className="max-w-4xl space-y-8">
          {/* Headline - Editorial Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif text-6xl tracking-tight text-white md:text-7xl lg:text-8xl"
            style={{
              fontFamily: 'Canela, Georgia, serif',
              fontWeight: 300,
              lineHeight: 1.1,
            }}
          >
            {headline}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl"
          >
            {subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="h-14 px-8 text-base shadow-lg transition-all hover:shadow-xl"
              onClick={() => (window.location.href = primaryCTA.href)}
            >
              {primaryCTA.label}
            </Button>

            {secondaryCTA && (
              <Button
                size="lg"
                variant="outline"
                className="h-14 border-white/20 bg-white/10 px-8 text-base text-white backdrop-blur-sm transition-all hover:bg-white/20"
                onClick={() => (window.location.href = secondaryCTA.href)}
              >
                {secondaryCTA.label}
              </Button>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-sm uppercase tracking-wider">Scroll</span>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
