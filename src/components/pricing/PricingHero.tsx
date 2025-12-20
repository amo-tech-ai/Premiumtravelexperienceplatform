import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';

interface PricingHeroProps {
  billingCycle: 'monthly' | 'annual';
  onToggleBilling: () => void;
}

export const PricingHero: React.FC<PricingHeroProps> = ({
  billingCycle,
  onToggleBilling
}) => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-amber-50/30 to-emerald-50/50" />
      
      {/* Animated blur orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-amber-300/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10 container mx-auto max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Badge 
            variant="outline" 
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white/80 backdrop-blur-sm border-emerald-200 text-emerald-900"
          >
            <Sparkles className="w-4 h-4" />
            Pricing
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-emerald-900 via-emerald-700 to-emerald-900 bg-clip-text text-transparent">
            Choose Your
          </span>
          <br />
          <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
            Intelligence Level
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-600 mb-4 max-w-2xl mx-auto"
        >
          AI agents that work for you — from free to full concierge
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base text-slate-500 mb-12 max-w-xl mx-auto"
        >
          All plans include the core trip planner. Unlock more AI power as you grow.
        </motion.p>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-md px-8 py-4 rounded-2xl shadow-xl shadow-emerald-900/5 border border-slate-200/50"
        >
          <span className={`text-base font-semibold transition-colors ${
            billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'
          }`}>
            Monthly
          </span>
          
          <Switch
            checked={billingCycle === 'annual'}
            onCheckedChange={onToggleBilling}
            className="data-[state=checked]:bg-emerald-600"
          />
          
          <span className={`text-base font-semibold transition-colors ${
            billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-400'
          }`}>
            Annual
          </span>

          {/* Savings badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: billingCycle === 'annual' ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Badge className="bg-emerald-100 text-emerald-900 border-emerald-200 px-3 py-1">
              Save 15%
            </Badge>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex flex-col items-center gap-2 text-slate-400"
          >
            <span className="text-sm font-medium">Explore plans</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
