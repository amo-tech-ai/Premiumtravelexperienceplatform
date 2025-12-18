import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Ticket, BedDouble, Compass, ArrowRight } from 'lucide-react';
import { useAI, AIIntent } from '../../context/AIContext';

interface ModeCardProps {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick: () => void;
  delay: number;
}

const ModeCard = ({ icon: Icon, label, description, onClick, delay }: ModeCardProps) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    onClick={onClick}
    className="flex flex-col items-start p-6 bg-white rounded-2xl shadow-sm hover:shadow-luxury hover:ring-1 hover:ring-accent/50 transition-all text-left group w-full border border-transparent"
  >
    <div className="p-3 rounded-full bg-emerald-50 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-serif font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
      {label}
    </h3>
    <p className="text-sm text-slate-500 font-light leading-relaxed">
      {description}
    </p>
  </motion.button>
);

interface ModeSelectionProps {
  onSelect: () => void;
}

export const ModeSelection = ({ onSelect }: ModeSelectionProps) => {
  const { setIntent, sendMessage } = useAI();

  const handleSelect = (intent: AIIntent, message: string) => {
    setIntent(intent);
    onSelect();
    // Optionally trigger a welcome message from AI
    // sendMessage(message); // If we want to auto-start chat
  };

  const modes = [
    {
      id: 'DINING' as AIIntent,
      label: 'Dining',
      description: 'Reservations at top-rated restaurants & hidden speakeasies.',
      icon: Utensils,
      message: "I'd like to find a restaurant."
    },
    {
      id: 'EVENTS' as AIIntent,
      label: 'Events',
      description: 'Concerts, gallery openings, and exclusive parties.',
      icon: Ticket,
      message: "What events are happening?"
    },
    {
      id: 'STAYS' as AIIntent,
      label: 'Stays',
      description: 'Luxury villas, penthouses, and boutique hotels.',
      icon: BedDouble,
      message: "I'm looking for a place to stay."
    },
    {
      id: 'TOURIST' as AIIntent,
      label: 'Tourist',
      description: 'Guided tours, cultural experiences, and day trips.',
      icon: Compass,
      message: "I want to explore the city."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-50 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Left Side (Desktop) / Top (Mobile) - Header */}
        <div className="w-full md:w-1/3 bg-primary p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 leading-tight">
              How can I <br/> <span className="text-accent">help you</span> today?
            </h1>
            <p className="text-white/70 font-light text-lg mb-8">
              Select a category to start your personalized concierge experience.
            </p>
            
            <div className="hidden md:flex items-center gap-2 text-sm text-accent font-medium uppercase tracking-widest opacity-80">
              <span className="w-8 h-[1px] bg-accent" />
              Medellín AI
            </div>
          </motion.div>
        </div>

        {/* Right Side - Grid */}
        <div className="w-full md:w-2/3 p-6 md:p-10 bg-slate-50 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modes.map((mode, idx) => (
              <ModeCard 
                key={mode.id}
                {...mode}
                delay={0.3 + (idx * 0.1)}
                onClick={() => handleSelect(mode.id, mode.message)}
              />
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <button 
              onClick={() => handleSelect('GENERAL', "I have a general question.")}
              className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              Skip to General Chat <ArrowRight className="w-3 h-3" />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
