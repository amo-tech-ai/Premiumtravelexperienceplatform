import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router';

interface AIAgent {
  name: string;
  icon: LucideIcon;
  description: string;
  helpText: string;
  color: string;
}

interface AIAgentsShowcaseProps {
  agents: AIAgent[];
}

export function AIAgentsShowcase({ agents }: AIAgentsShowcaseProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              Your AI Team
            </h2>
            <p className="text-xl text-slate-300">
              Specialized agents working together for your perfect trip
            </p>
          </motion.div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {agents.map((agent, index) => {
              const Icon = agent.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="group"
                >
                  <div className="h-full bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 hover:border-amber-400/50 hover:bg-slate-800/70 transition-all">
                    {/* Icon */}
                    <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center mb-4 
                      transition-transform group-hover:scale-110
                      ${agent.color === 'emerald' && 'bg-emerald-500/20 text-emerald-400'}
                      ${agent.color === 'amber' && 'bg-amber-400/20 text-amber-400'}
                      ${agent.color === 'blue' && 'bg-blue-500/20 text-blue-400'}
                      ${agent.color === 'purple' && 'bg-purple-500/20 text-purple-400'}
                      ${agent.color === 'rose' && 'bg-rose-500/20 text-rose-400'}
                      ${agent.color === 'cyan' && 'bg-cyan-500/20 text-cyan-400'}
                    `}>
                      <Icon className="w-7 h-7" />
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-xl text-white mb-2">
                      {agent.name}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                      {agent.description}
                    </p>

                    {/* Help Text */}
                    <div className="pt-4 border-t border-slate-700">
                      <div className="text-xs text-slate-500 mb-2">
                        How it helps you:
                      </div>
                      <p className={`
                        text-sm font-medium leading-relaxed
                        ${agent.color === 'emerald' && 'text-emerald-400'}
                        ${agent.color === 'amber' && 'text-amber-400'}
                        ${agent.color === 'blue' && 'text-blue-400'}
                        ${agent.color === 'purple' && 'text-purple-400'}
                        ${agent.color === 'rose' && 'text-rose-400'}
                        ${agent.color === 'cyan' && 'text-cyan-400'}
                      `}>
                        {agent.helpText}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md"
            >
              <Link to="/how-it-works">
                See All AI Agents
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}