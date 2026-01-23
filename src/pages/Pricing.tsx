import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useSearchParams } from 'react-router';
import { Sparkles } from 'lucide-react';
import { PricingHero } from '../components/pricing/PricingHero';
import { PricingCard } from '../components/pricing/PricingCard';
import { FeatureComparisonTable } from '../components/pricing/FeatureComparisonTable';
import { AIAgentsShowcase } from '../components/pricing/AIAgentsShowcase';
import { PricingFAQ } from '../components/pricing/PricingFAQ';
import { PricingSocialProof } from '../components/pricing/PricingSocialProof';
import { PricingCTA } from '../components/pricing/PricingCTA';

export default function Pricing() {
  const [searchParams] = useSearchParams();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [highlightedPlan, setHighlightedPlan] = useState<string | null>(null);

  // Get URL parameters for highlighting specific plans
  useEffect(() => {
    const plan = searchParams.get('plan');
    const billing = searchParams.get('billing');
    
    if (plan) setHighlightedPlan(plan);
    if (billing === 'annual') setBillingCycle('annual');
  }, [searchParams]);

  // Scroll progress for storytelling
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Pricing data
  const pricingTiers = [
    {
      tier: 'explorer' as const,
      title: 'Explorer',
      icon: 'compass',
      price: {
        monthly: 0,
        annual: 0
      },
      agentCount: 2,
      features: {
        included: [
          'Create up to 3 trips',
          'Basic AI recommendations',
          'Manual itinerary building',
          'Mobile app access',
          'Community support',
          'Export to PDF'
        ],
        excluded: [
          'Advanced AI optimization',
          'Real-time collaboration',
          'Priority booking',
          'Budget tracking'
        ]
      },
      ctaText: 'Start Free',
      ctaLink: '/dashboard',
      badge: undefined,
      isPopular: false,
      isPremium: false
    },
    {
      tier: 'curator' as const,
      title: 'Curator',
      icon: 'sparkles',
      price: {
        monthly: 29,
        annual: 24
      },
      agentCount: 4,
      features: {
        included: [
          'Unlimited trips',
          'Advanced AI recommendations',
          'Automatic route optimization',
          'Real-time budget tracking',
          'Conflict detection',
          'Collaboration for up to 4 people',
          'Priority email support',
          'Export to PDF, JSON, Calendar',
          'Mobile notifications',
          'AI-powered suggestions',
          'Smart filters & search',
          'Trip health scores'
        ],
        excluded: [
          'Booking Assistant automation',
          'Event Curator',
          'Priority phone support',
          'Dedicated account manager'
        ]
      },
      ctaText: 'Start 14-Day Trial',
      ctaLink: '/dashboard?trial=curator',
      badge: 'Most Popular',
      isPopular: true,
      isPremium: false
    },
    {
      tier: 'concierge' as const,
      title: 'Concierge',
      icon: 'crown',
      price: {
        monthly: 79,
        annual: 67
      },
      agentCount: 6,
      features: {
        included: [
          'Everything in Curator, plus:',
          'Automated booking management',
          'Price monitoring & alerts',
          'Exclusive event access',
          'White-glove concierge chat',
          'Unlimited collaboration',
          'API access for integrations',
          'Priority phone + chat support',
          'Dedicated account manager',
          'Custom trip templates',
          'Advanced analytics dashboard',
          'VIP priority processing',
          'Personalized AI training',
          'Custom integrations',
          'SLA guarantees'
        ],
        excluded: []
      },
      ctaText: 'Get Concierge Access',
      ctaLink: '/dashboard?plan=concierge',
      badge: 'Premium',
      isPopular: false,
      isPremium: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute top-60 right-20 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
      </motion.div>

      <div className="relative z-10">
        {/* Hero Section */}
        <PricingHero 
          billingCycle={billingCycle} 
          onToggleBilling={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
        />

        {/* Pricing Cards Grid */}
        <section className="py-20 px-6 lg:px-12">
          <div className="container mx-auto max-w-7xl">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
            >
              {pricingTiers.map((tier) => (
                <PricingCard
                  key={tier.tier}
                  {...tier}
                  billingCycle={billingCycle}
                  isHighlighted={highlightedPlan === tier.tier}
                />
              ))}
            </motion.div>

            {/* Savings callout for annual billing */}
            {billingCycle === 'annual' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 text-center"
              >
                <div className="inline-flex items-center gap-2 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-200">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-900 font-semibold">
                    Save up to $144/year with annual billing
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-20 px-6 lg:px-12 bg-white/50 backdrop-blur-sm">
          <FeatureComparisonTable />
        </section>

        {/* AI Agents Showcase */}
        <section className="py-20 px-6 lg:px-12">
          <AIAgentsShowcase />
        </section>

        {/* Social Proof */}
        <section className="py-20 px-6 lg:px-12 bg-gradient-to-b from-white to-slate-50">
          <PricingSocialProof />
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6 lg:px-12">
          <PricingFAQ />
        </section>

        {/* Final CTA */}
        <PricingCTA />
      </div>
    </div>
  );
}