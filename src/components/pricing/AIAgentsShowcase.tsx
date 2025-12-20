import React from 'react';
import { motion } from 'motion/react';
import { Compass, Utensils, Route, DollarSign, Calendar, Ticket, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';

interface Agent {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  demoLink: string;
  availableIn: Array<'explorer' | 'curator' | 'concierge'>;
  color: {
    bg: string;
    text: string;
    glow: string;
  };
}

const agents: Agent[] = [
  {
    id: 'local-scout',
    name: 'Local Scout',
    icon: Compass,
    description: 'Discovers hidden gems and local events based on your interests',
    demoLink: '/concierge?agent=local-scout',
    availableIn: ['explorer', 'curator', 'concierge'],
    color: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      glow: 'from-blue-400 to-blue-600'
    }
  },
  {
    id: 'dining-orchestrator',
    name: 'Dining Orchestrator',
    icon: Utensils,
    description: 'Finds perfect restaurants matching your taste and dietary preferences',
    demoLink: '/concierge?agent=dining',
    availableIn: ['explorer', 'curator', 'concierge'],
    color: {
      bg: 'bg-rose-100',
      text: 'text-rose-600',
      glow: 'from-rose-400 to-rose-600'
    }
  },
  {
    id: 'itinerary-optimizer',
    name: 'Itinerary Optimizer',
    icon: Route,
    description: 'Optimizes routes and saves travel time with smart planning',
    demoLink: '/concierge?agent=optimizer',
    availableIn: ['curator', 'concierge'],
    color: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      glow: 'from-purple-400 to-purple-600'
    }
  },
  {
    id: 'budget-guardian',
    name: 'Budget Guardian',
    icon: DollarSign,
    description: 'Tracks spending and finds savings without compromising experience',
    demoLink: '/concierge?agent=budget',
    availableIn: ['curator', 'concierge'],
    color: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-600',
      glow: 'from-emerald-400 to-emerald-600'
    }
  },
  {
    id: 'booking-assistant',
    name: 'Booking Assistant',
    icon: Calendar,
    description: 'Automates reservations and monitors prices for best deals',
    demoLink: '/concierge?agent=booking',
    availableIn: ['concierge'],
    color: {
      bg: 'bg-amber-100',
      text: 'text-amber-600',
      glow: 'from-amber-400 to-amber-600'
    }
  },
  {
    id: 'event-curator',
    name: 'Event Curator',
    icon: Ticket,
    description: 'Finds exclusive events and unique experiences you\'ll love',
    demoLink: '/concierge?agent=events',
    availableIn: ['concierge'],
    color: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-600',
      glow: 'from-indigo-400 to-indigo-600'
    }
  }
];

const getTierBadge = (availableIn: Agent['availableIn']) => {
  if (availableIn.includes('explorer')) {
    return { label: 'All Plans', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  } else if (availableIn.includes('curator')) {
    return { label: 'Curator+', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  } else {
    return { label: 'Concierge Only', color: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white border-none' };
  }
};

export const AIAgentsShowcase: React.FC = () => {
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
          Meet Your AI Travel Team
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Each agent specializes in a different aspect of travel planning, working together to create your perfect trip
        </p>
      </motion.div>

      {/* Agents Grid */}
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
              staggerChildren: 0.1
            }
          }
        }}
      >
        {agents.map((agent, index) => {
          const Icon = agent.icon;
          const tierBadge = getTierBadge(agent.availableIn);

          return (
            <motion.a
              key={agent.id}
              href={agent.demoLink}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative block"
            >
              {/* Glow effect on hover */}
              <div className={cn(
                "absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500",
                `bg-gradient-to-r ${agent.color.glow}`
              )} />

              {/* Card */}
              <div className="relative h-full bg-white rounded-3xl p-8 border-2 border-slate-200 group-hover:border-transparent shadow-lg group-hover:shadow-2xl transition-all duration-300">
                {/* Tier Badge */}
                <div className="absolute top-6 right-6">
                  <Badge className={cn("px-3 py-1 text-xs font-semibold", tierBadge.color)}>
                    {tierBadge.label}
                  </Badge>
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                    agent.color.bg
                  )}
                >
                  <Icon className={cn("w-8 h-8", agent.color.text)} />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-serif font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                  {agent.name}
                </h3>

                <p className="text-slate-600 mb-6 leading-relaxed">
                  {agent.description}
                </p>

                {/* See in Action Link */}
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">
                  <span>See in Action</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>

                {/* Decorative gradient on hover */}
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  `bg-gradient-to-r ${agent.color.glow}`
                )} />
              </div>
            </motion.a>
          );
        })}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <p className="text-slate-600 mb-6">
          Want to see all agents in action?
        </p>
        <a
          href="/concierge"
          className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all hover:scale-105"
        >
          Try AI Concierge Demo
          <ArrowRight className="w-5 h-5" />
        </a>
      </motion.div>
    </div>
  );
};