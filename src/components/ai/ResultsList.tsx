import React from 'react';
import { motion } from 'motion/react';
import { DiningCard } from './cards/DiningCard';
import { PropertyCard } from '../real-estate/PropertyCard';
import { ExperienceCard } from '../ui/ExperienceCard';
import { AIIntent } from '../../context/AIContext';
import { MOCK_DINING_RESULTS, MOCK_STAY_RESULTS, MOCK_EVENT_RESULTS } from './MockData';
import { useNavigate } from 'react-router-dom';

interface ResultsListProps {
  intent: AIIntent;
}

export const ResultsList = ({ intent }: ResultsListProps) => {
  const navigate = useNavigate();

  // Determine content based on intent
  let content = null;

  if (intent === 'DINING') {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pb-24">
        {MOCK_DINING_RESULTS.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DiningCard {...item} onClick={() => navigate(`/restaurants/${item.id}`)} />
          </motion.div>
        ))}
      </div>
    );
  } else if (intent === 'STAYS' || intent === 'REAL_ESTATE') {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pb-24">
        {MOCK_STAY_RESULTS.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PropertyCard {...item} />
          </motion.div>
        ))}
      </div>
    );
  } else {
    // Default to Events/General
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pb-24">
        {MOCK_EVENT_RESULTS.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ExperienceCard {...item} onClick={() => navigate(`/experiences/${item.id}`)} />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-50 scrollbar-hide">
      {content}
    </div>
  );
};
