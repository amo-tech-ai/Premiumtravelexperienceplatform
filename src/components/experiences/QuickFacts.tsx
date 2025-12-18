import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface FactProps {
  icon: LucideIcon;
  label: string;
}

interface QuickFactsProps {
  facts: FactProps[];
}

export const QuickFacts = ({ facts }: QuickFactsProps) => {
  return (
    <div className="w-full bg-white border-b border-slate-100">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex overflow-x-auto pb-4 pt-8 lg:py-10 gap-4 lg:gap-8 scrollbar-hide">
          {facts.map((fact, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-xl border border-slate-100 min-w-[160px] cursor-default"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100/50 flex items-center justify-center text-emerald-800">
                <fact.icon className="w-5 h-5" />
              </div>
              <span className="font-medium text-slate-700">{fact.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
