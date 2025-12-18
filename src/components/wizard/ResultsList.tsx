import React from 'react';
import { motion } from 'motion/react';
import { Venue } from '../../types/wizard';
import { LuxuryCard } from '../ui/LuxuryCard';
import { Heart } from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import { cn } from '../ui/utils';

interface ResultsListProps {
  results: Venue[];
  onSelect: (id: string) => void;
}

export const ResultsList = ({ results, onSelect }: ResultsListProps) => {
  const { savedIds, toggleSaved } = useWizard();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6 pb-24 overflow-y-auto h-full scrollbar-hide">
      {results.map((venue, index) => {
        const isSaved = savedIds.includes(venue.id);
        
        return (
          <motion.div
            key={venue.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <LuxuryCard
              id={venue.id}
              title={venue.name}
              subtitle={venue.shortDescription}
              image={venue.images[0]}
              badge={{ 
                text: `${venue.ai.matchScore}% Match`, 
                variant: venue.ai.matchScore > 90 ? 'emerald' : 'neutral' 
              }}
              metaPrimary={venue.location.neighborhood}
              metaSecondary={"$".repeat(venue.priceLevel)}
              onClick={() => onSelect(venue.id)}
              status={venue.id === 'sold-out' ? 'sold_out' : 'active'}
              action={
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaved(venue.id);
                  }}
                  className={cn(
                    "p-2 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110",
                    isSaved 
                      ? "bg-white text-emerald-600 shadow-md" 
                      : "bg-black/20 text-white hover:bg-black/40"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
                </button>
              }
            />
          </motion.div>
        );
      })}
      
      {results.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center text-center p-12 text-muted-foreground">
          <p>No results found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
