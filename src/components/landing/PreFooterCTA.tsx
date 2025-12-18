import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface PreFooterCTAProps {
  headline?: string;
  subheadline?: string;
}

export const PreFooterCTA: React.FC<PreFooterCTAProps> = ({ 
  headline = "Let the Concierge Plan It For You",
  subheadline = "Events, restaurants, stays, and experiences — intelligently connected in one place."
}) => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-24 bg-secondary/30 relative overflow-hidden">
      {/* Optional subtle texture/gradient could go here */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/50 to-transparent opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
            Not sure what to choose?
          </span>
          
          <h2 className="text-4xl md:text-5xl font-serif text-primary font-medium leading-tight">
            {headline}
          </h2>
          
          <p className="text-lg text-muted-foreground font-light max-w-lg mx-auto">
            {subheadline}
          </p>
          
          <div className="pt-4 flex flex-col items-center gap-3">
            <Button 
              size="lg" 
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg px-8 py-6 h-auto text-lg group"
              onClick={() => navigate('/concierge')}
            >
              <Sparkles className="w-5 h-5 mr-2 text-accent group-hover:animate-pulse" />
              Ask the Concierge
            </Button>
            
            <span className="text-xs text-muted-foreground/80 font-medium">
              Takes less than a minute
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
