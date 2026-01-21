import React from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AIIntent } from '../../context/AIContext';
import { MOCK_DINING_RESULTS, MOCK_EVENT_RESULTS, MOCK_STAY_RESULTS } from './MockData';

interface ResultsMapProps {
    intent?: AIIntent;
}

export const ResultsMap = ({ intent }: ResultsMapProps) => {
  const navigate = useNavigate();

  // Select data source based on intent
  let items = [];
  let routePrefix = '';

  if (intent === 'DINING') {
    items = MOCK_DINING_RESULTS;
    routePrefix = '/restaurants';
  } else if (intent === 'REAL_ESTATE' || intent === 'STAYS') {
    items = MOCK_STAY_RESULTS;
    routePrefix = '/real-estate/listing';
  } else {
    items = MOCK_EVENT_RESULTS;
    routePrefix = '/experiences';
  }

  // Helper to generate deterministic pseudo-random positions for demo
  // In a real app, these would come from the item.lat/lng
  const getPosition = (index: number) => {
    const positions = [
        { top: '30%', left: '40%' },
        { top: '50%', left: '60%' },
        { top: '45%', left: '25%' },
        { top: '65%', left: '45%' },
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="w-full h-full relative bg-[#e5e7eb] overflow-hidden group">
      {/* Mock Map Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
            backgroundImage: `url("https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-75.5636,6.2518,12,0/800x600?access_token=placeholder")`, 
            backgroundSize: 'cover'
        }}
      >
        <div className="w-full h-full bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Interactive Pins */}
      {items.map((item, index) => {
        const pos = getPosition(index);
        return (
            <MockPin 
                key={item.id}
                top={pos.top} 
                left={pos.left} 
                label={item.title} 
                delay={0.2 + (index * 0.1)} 
                onClick={() => navigate(`${routePrefix}/${item.id}`)}
            />
        );
      })}

      <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg text-xs text-slate-500 max-w-[200px] pointer-events-none">
        <p>Interactive map demo. Pins link to detail pages.</p>
      </div>
    </div>
  );
};

const MockPin = ({ top, left, label, delay, onClick }: { top: string, left: string, label: string, delay: number, onClick: () => void }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, type: 'spring' }}
    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group/pin z-10"
    style={{ top, left }}
    onClick={(e) => {
        e.stopPropagation();
        onClick();
    }}
  >
    <div className="w-8 h-8 rounded-full bg-emerald-900 text-white flex items-center justify-center shadow-lg border-2 border-white group-hover/pin:scale-110 transition-transform relative z-20">
      <MapPin className="w-4 h-4" />
    </div>
    
    {/* Label Tooltip */}
    <div className="absolute top-full mt-2 px-3 py-1.5 bg-white rounded-lg shadow-xl text-xs font-bold text-slate-800 opacity-0 group-hover/pin:opacity-100 transition-all transform translate-y-2 group-hover/pin:translate-y-0 z-30 whitespace-nowrap border border-slate-100">
      {label}
      {/* Little triangle arrow */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-t border-l border-slate-100"></div>
    </div>
  </motion.div>
);