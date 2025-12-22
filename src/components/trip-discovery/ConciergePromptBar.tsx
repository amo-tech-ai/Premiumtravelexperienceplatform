import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils/utils';

interface ConciergePromptBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

const QUICK_ACTIONS = [
  { label: 'More luxury', icon: '✨' },
  { label: 'Quieter places', icon: '🤫' },
  { label: 'Only walkable', icon: '🚶' },
  { label: 'Add a day trip', icon: '🗺️' }
];

export function ConciergePromptBar({ onSearch, className }: ConciergePromptBarProps) {
  const [query, setQuery] = useState('');

  return (
    <div className={cn("w-full max-w-3xl mx-auto space-y-4", className)}>
      <div className="bg-white rounded-2xl shadow-luxury border border-emerald-900/10 p-2 flex items-center gap-2 relative overflow-hidden group">
        
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="pl-4 text-emerald-900/40">
           <Sparkles className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
          placeholder="Ask your concierge anything..."
          className="flex-1 bg-transparent border-none outline-none text-emerald-900 placeholder:text-emerald-900/40 text-lg h-12"
        />

        <div className="flex items-center gap-1 pr-1">
          <Button 
            onClick={() => onSearch(query)}
            className="bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl h-10 w-10 p-0 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
        <span className="text-sm text-emerald-900/60 font-medium whitespace-nowrap mr-2">
           Suggestions:
        </span>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => onSearch(action.label)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-900/10 rounded-full text-xs font-medium text-emerald-900/80 hover:bg-emerald-50 hover:border-emerald-200 transition-colors whitespace-nowrap shadow-sm"
          >
            <span>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}