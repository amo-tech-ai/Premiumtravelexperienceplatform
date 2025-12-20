import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../ui/utils';

interface ComparisonFeature {
  category: 'AI Agents' | 'Trip Planning' | 'Booking' | 'Collaboration' | 'Support';
  name: string;
  description: string;
  explorer: boolean | string;
  curator: boolean | string;
  concierge: boolean | string;
}

const features: ComparisonFeature[] = [
  // AI Agents
  {
    category: 'AI Agents',
    name: 'Local Scout',
    description: 'Discovers hidden gems and local events',
    explorer: 'Basic',
    curator: 'Advanced',
    concierge: 'Premium'
  },
  {
    category: 'AI Agents',
    name: 'Dining Orchestrator',
    description: 'Finds perfect restaurants matching your taste',
    explorer: 'Basic',
    curator: 'Advanced',
    concierge: 'Premium'
  },
  {
    category: 'AI Agents',
    name: 'Itinerary Optimizer',
    description: 'Optimizes routes and saves travel time',
    explorer: false,
    curator: true,
    concierge: true
  },
  {
    category: 'AI Agents',
    name: 'Budget Guardian',
    description: 'Tracks spending and finds savings',
    explorer: false,
    curator: true,
    concierge: true
  },
  {
    category: 'AI Agents',
    name: 'Booking Assistant',
    description: 'Automates reservations and monitors prices',
    explorer: false,
    curator: false,
    concierge: true
  },
  {
    category: 'AI Agents',
    name: 'Event Curator',
    description: 'Finds exclusive events and experiences',
    explorer: false,
    curator: false,
    concierge: true
  },
  // Trip Planning
  {
    category: 'Trip Planning',
    name: 'Number of trips',
    description: 'How many trips you can create',
    explorer: 'Up to 3',
    curator: 'Unlimited',
    concierge: 'Unlimited'
  },
  {
    category: 'Trip Planning',
    name: 'AI recommendations',
    description: 'Personalized place recommendations',
    explorer: 'Basic',
    curator: 'Advanced',
    concierge: 'Premium'
  },
  {
    category: 'Trip Planning',
    name: 'Route optimization',
    description: 'Automatic route planning to save time',
    explorer: false,
    curator: true,
    concierge: true
  },
  {
    category: 'Trip Planning',
    name: 'Conflict detection',
    description: 'Detects scheduling conflicts',
    explorer: false,
    curator: true,
    concierge: true
  },
  {
    category: 'Trip Planning',
    name: 'Custom templates',
    description: 'Create reusable trip templates',
    explorer: false,
    curator: false,
    concierge: true
  },
  // Booking & Reservations
  {
    category: 'Booking',
    name: 'Manual booking links',
    description: 'Links to book places manually',
    explorer: true,
    curator: true,
    concierge: true
  },
  {
    category: 'Booking',
    name: 'Price monitoring',
    description: 'Track prices and get alerts',
    explorer: false,
    curator: true,
    concierge: true
  },
  {
    category: 'Booking',
    name: 'Automated booking',
    description: 'AI handles booking for you',
    explorer: false,
    curator: false,
    concierge: true
  },
  // Collaboration
  {
    category: 'Collaboration',
    name: 'Real-time collaboration',
    description: 'Collaborate with friends on trips',
    explorer: false,
    curator: 'Up to 4 people',
    concierge: 'Unlimited'
  },
  {
    category: 'Collaboration',
    name: 'Shared itineraries',
    description: 'Share trip plans with others',
    explorer: true,
    curator: true,
    concierge: true
  },
  {
    category: 'Collaboration',
    name: 'API access',
    description: 'Integrate with your own tools',
    explorer: false,
    curator: false,
    concierge: true
  },
  // Support
  {
    category: 'Support',
    name: 'Community forum',
    description: 'Access to community support',
    explorer: true,
    curator: true,
    concierge: true
  },
  {
    category: 'Support',
    name: 'Email support',
    description: 'Get help via email',
    explorer: false,
    curator: 'Priority',
    concierge: 'Priority'
  },
  {
    category: 'Support',
    name: 'Phone support',
    description: 'Direct phone assistance',
    explorer: false,
    curator: false,
    concierge: true
  },
  {
    category: 'Support',
    name: 'Dedicated manager',
    description: 'Personal account manager',
    explorer: false,
    curator: false,
    concierge: true
  }
];

const categories = ['AI Agents', 'Trip Planning', 'Booking', 'Collaboration', 'Support'] as const;

export const FeatureComparisonTable: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'explorer' | 'curator' | 'concierge'>('curator');

  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <Check className="w-5 h-5 text-emerald-600 mx-auto" />
        </motion.div>
      ) : (
        <span className="text-slate-300 text-center block">—</span>
      );
    }
    return (
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-sm text-slate-700 text-center block"
      >
        {value}
      </motion.span>
    );
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
          Compare Every Feature
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Choose the plan that fits your travel style
        </p>
      </motion.div>

      {/* Mobile: Tabs View */}
      <div className="lg:hidden">
        <Tabs value={selectedPlan} onValueChange={(v) => setSelectedPlan(v as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="explorer">Explorer</TabsTrigger>
            <TabsTrigger value="curator">Curator</TabsTrigger>
            <TabsTrigger value="concierge">Concierge</TabsTrigger>
          </TabsList>

          {categories.map((category) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 px-4 py-2 bg-slate-50 rounded-lg">
                {category}
              </h3>
              <div className="space-y-2">
                {features
                  .filter((f) => f.category === category)
                  .map((feature, index) => {
                    const value = feature[selectedPlan];
                    return (
                      <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">
                            {feature.name}
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-slate-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{feature.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div>{renderValue(value)}</div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          ))}
        </Tabs>
      </div>

      {/* Desktop: Table View */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200">
          <div className="grid grid-cols-4 gap-4 p-6">
            <div className="font-semibold text-slate-900">Feature</div>
            <div className="text-center font-semibold text-slate-900">Explorer</div>
            <div className="text-center font-semibold text-emerald-900">Curator</div>
            <div className="text-center font-semibold text-amber-900">Concierge</div>
          </div>
        </div>

        {/* Features by Category */}
        {categories.map((category, catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: catIndex * 0.1 }}
          >
            {/* Category Header */}
            <div className="bg-slate-50 border-y border-slate-200 px-6 py-3">
              <h3 className="font-semibold text-slate-900">{category}</h3>
            </div>

            {/* Features */}
            {features
              .filter((f) => f.category === category)
              .map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className={cn(
                    "grid grid-cols-4 gap-4 p-6 border-b border-slate-100 hover:bg-slate-50/50 transition-colors",
                    index % 2 === 0 && "bg-white"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-700">{feature.name}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex-shrink-0">
                            <Info className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p>{feature.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center justify-center">
                    {renderValue(feature.explorer)}
                  </div>
                  <div className="flex items-center justify-center">
                    {renderValue(feature.curator)}
                  </div>
                  <div className="flex items-center justify-center">
                    {renderValue(feature.concierge)}
                  </div>
                </motion.div>
              ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
