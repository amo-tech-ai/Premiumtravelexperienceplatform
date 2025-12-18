import React from 'react';
import { motion } from 'motion/react';
import { Map, List, Grid2X2 } from 'lucide-react';

export type ViewMode = 'LIST' | 'MAP' | 'PHOTOS';

interface ResultsTabsProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  resultCount?: number;
}

export const ResultsTabs = ({ activeView, onViewChange, resultCount = 0 }: ResultsTabsProps) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-luxury border border-white/20 flex items-center gap-1">
      <TabButton 
        isActive={activeView === 'LIST'} 
        onClick={() => onViewChange('LIST')}
        icon={List}
        label={`List ${resultCount > 0 ? `(${resultCount})` : ''}`}
      />
      <TabButton 
        isActive={activeView === 'MAP'} 
        onClick={() => onViewChange('MAP')}
        icon={Map}
        label="Map"
      />
      {/* 
      <TabButton 
        isActive={activeView === 'PHOTOS'} 
        onClick={() => onViewChange('PHOTOS')}
        icon={Grid2X2}
        label="Photos"
      />
      */}
    </div>
  );
};

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

const TabButton = ({ isActive, onClick, icon: Icon, label }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`
      relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300
      ${isActive ? 'text-white' : 'text-slate-600 hover:bg-slate-100'}
    `}
  >
    {isActive && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-emerald-900 rounded-full shadow-md"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <span className="relative z-10 flex items-center gap-2">
      <Icon className="w-4 h-4" />
      {label}
    </span>
  </button>
);
