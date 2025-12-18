import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export interface FollowUpOption {
  id: string;
  label: string;
  value: string;
}

interface FollowUpQuestionProps {
  question: string;
  options: FollowUpOption[];
  onSelect: (value: string) => void;
  onSkip?: () => void;
}

export const FollowUpQuestion = ({ question, options, onSelect, onSkip }: FollowUpQuestionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-amber-400/30 rounded-xl p-5 shadow-[0_8px_16px_rgb(0,0,0,0.04)] max-w-sm mt-2 ml-10"
    >
      <h4 className="text-slate-900 font-bold font-sans text-sm mb-4 leading-tight">
        {question}
      </h4>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.value)}
            className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all active:scale-95"
          >
            {opt.label}
          </button>
        ))}
      </div>

      {onSkip && (
        <button 
          onClick={onSkip}
          className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 font-medium uppercase tracking-wide transition-colors"
        >
          Skip this <ArrowRight className="w-2.5 h-2.5" />
        </button>
      )}
    </motion.div>
  );
};
