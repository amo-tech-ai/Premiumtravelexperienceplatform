/**
 * How It Works Section - Luxury Homepage
 * 
 * Production-ready section with:
 * - 3-column feature grid
 * - AI concierge introduction
 * - Interactive chat input
 * - Scroll-triggered animations
 * 
 * Reference: /docs/rules/master-design-spec.md (Section 2.2)
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, Sparkles, Map, Calendar } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Bot className="h-8 w-8" />,
    title: 'AI Concierge',
    description:
      'Chat naturally with our AI travel expert. No forms, no complexity—just tell us what you want.',
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: 'Smart Recommendations',
    description:
      'Get personalized suggestions based on your preferences, budget, and travel style.',
  },
  {
    icon: <Map className="h-8 w-8" />,
    title: 'Instant Itineraries',
    description:
      'We organize everything on a beautiful map and timeline. Edit, optimize, and share with ease.',
  },
];

export function HowItWorksSection() {
  const [chatValue, setChatValue] = useState('');

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatValue.trim()) return;

    // Navigate to concierge with query
    window.location.href = `/concierge?q=${encodeURIComponent(chatValue)}`;
  };

  return (
    <section className="relative bg-stone-50 py-24 md:py-32">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <p className="mb-4 text-sm uppercase tracking-wider text-amber-600">
            How It Works
          </p>
          <h2 className="mb-6 font-serif text-4xl tracking-tight text-stone-900 md:text-5xl lg:text-6xl">
            Travel planning, simplified
          </h2>
          <p className="text-lg text-stone-600">
            Our AI concierge handles the research, planning, and organization.
            You just enjoy the journey.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mx-auto mb-16 grid max-w-6xl gap-12 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mb-3 text-xl text-stone-900">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-stone-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Chat Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto max-w-2xl"
        >
          <form onSubmit={handleChatSubmit} className="relative">
            <Input
              type="text"
              value={chatValue}
              onChange={(e) => setChatValue(e.target.value)}
              placeholder="Ask me anything... 'Plan a weekend in Paris' or 'Find hidden gems in Tokyo'"
              className="h-16 rounded-2xl border-2 border-stone-200 bg-white pl-6 pr-32 text-base shadow-sm transition-all focus:border-amber-500 focus:shadow-md"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
            >
              Try it
            </Button>
          </form>

          {/* Example Queries */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[
              'Weekend in Barcelona',
              'Romantic getaway',
              'Family trip to Japan',
              'Solo adventure',
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setChatValue(example)}
                className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 transition-colors hover:border-amber-500 hover:text-amber-600"
              >
                {example}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
