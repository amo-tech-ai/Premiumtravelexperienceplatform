import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Calendar as CalendarIcon } from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import { WIZARD_CONFIG, WizardStep, WizardOption } from './WizardConfig';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { cn } from '../ui/utils';
import { GlassButton } from '../ui/GlassButton';

interface FilterWizardProps {
  onComplete: () => void;
}

export const FilterWizard = ({ onComplete }: FilterWizardProps) => {
  const { filters, ui, setUI, updateFilters } = useWizard();
  const steps = WIZARD_CONFIG[filters.intent] || [];
  
  const currentStepIndex = ui.currentStep;
  const currentStep = steps[currentStepIndex];

  // Local state for the current step's value to allow "Next" only when selected
  // In a real app, we might sync this with global state immediately or on "Next"
  // For now, let's read from global state if possible, or just sync.

  useEffect(() => {
    setUI({ totalSteps: steps.length });
  }, [steps.length, setUI]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setUI({ currentStep: currentStepIndex + 1 });
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setUI({ currentStep: currentStepIndex - 1 });
    }
  };

  const toggleTag = (value: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(value)
      ? currentTags.filter(t => t !== value)
      : [...currentTags, value];
    updateFilters({ tags: newTags });
  };

  const setGuestType = (value: string) => {
    // Mapping simple guest types to numbers
    let guests = 1;
    if (value === 'couple') guests = 2;
    if (value === 'group') guests = 4;
    if (value === 'family') guests = 4;
    
    updateFilters({ guests });
    // Also add as a tag for context
    const currentTags = filters.tags.filter(t => !['solo', 'couple', 'group', 'family'].includes(t));
    updateFilters({ tags: [...currentTags, value] });
  };

  const handleDateSelect = (option: 'tonight' | 'weekend' | 'custom') => {
    const now = new Date();
    let start = now;
    let end = now;
    let label = 'Tonight';

    if (option === 'tonight') {
      // already set
    } else if (option === 'weekend') {
      // Simple logic: next Friday to Sunday
      const day = now.getDay();
      const dist = 5 - day; // distance to Friday
      start.setDate(now.getDate() + dist);
      const endDate = new Date(start);
      endDate.setDate(start.getDate() + 2);
      end = endDate;
      label = 'This Weekend';
    }

    updateFilters({ dateRange: { start, end, label } });
  };

  if (!currentStep) return null;

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-8"
        >
          {/* Question Header */}
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-emerald-900">
              {currentStep.question}
            </h2>
            {currentStep.subtitle && (
              <p className="text-muted-foreground text-lg">
                {currentStep.subtitle}
              </p>
            )}
          </div>

          {/* Input Area */}
          <div className="min-h-[200px] py-4">
            {currentStep.type === 'CHIPS' && (
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {currentStep.options?.map((opt) => {
                  const isActive = filters.tags.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        if (currentStep.id === 'companions') setGuestType(opt.value);
                        else toggleTag(opt.value);
                      }}
                      className={cn(
                        "px-6 py-3 rounded-full text-lg transition-all duration-300 border",
                        isActive 
                          ? "bg-emerald-900 text-white border-emerald-900 shadow-lg scale-105" 
                          : "bg-white text-emerald-900 border-emerald-900/20 hover:border-emerald-900/50 hover:bg-emerald-50"
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            {currentStep.type === 'SLIDER' && (
               <div className="px-4 py-8 space-y-6">
                 <Slider 
                   value={[filters.budget.max]} 
                   max={currentStep.max || 1000} 
                   min={currentStep.min || 0}
                   step={10}
                   onValueChange={(vals) => updateFilters({ budget: { ...filters.budget, max: vals[0] } })}
                   className="w-full"
                 />
                 <div className="text-center font-serif text-2xl text-emerald-900">
                    Up to {currentStep.formatLabel ? currentStep.formatLabel(filters.budget.max) : filters.budget.max}
                 </div>
               </div>
            )}

            {currentStep.type === 'DATE' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <GlassButton 
                   className="h-32 flex flex-col items-center justify-center gap-2 text-lg hover:bg-emerald-50/50 hover:border-emerald-900/30"
                   onClick={() => handleDateSelect('tonight')}
                   variant={filters.dateRange.label === 'Tonight' ? 'default' : 'outline'}
                 >
                   <span>🌙</span>
                   <span>Tonight</span>
                 </GlassButton>
                 <GlassButton 
                   className="h-32 flex flex-col items-center justify-center gap-2 text-lg hover:bg-emerald-50/50 hover:border-emerald-900/30"
                   onClick={() => handleDateSelect('weekend')}
                   variant={filters.dateRange.label === 'This Weekend' ? 'default' : 'outline'}
                 >
                   <span>🥂</span>
                   <span>This Weekend</span>
                 </GlassButton>
                 <GlassButton 
                   className="h-32 flex flex-col items-center justify-center gap-2 text-lg hover:bg-emerald-50/50 hover:border-emerald-900/30"
                   onClick={() => handleDateSelect('custom')}
                 >
                   <CalendarIcon className="w-6 h-6" />
                   <span>Custom Date</span>
                 </GlassButton>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between mt-auto pt-8 border-t border-border/10">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          disabled={currentStepIndex === 0}
          className="text-muted-foreground hover:text-emerald-900"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Button 
          onClick={handleNext}
          className="bg-emerald-900 hover:bg-emerald-800 text-white rounded-full px-8 py-6 text-lg shadow-luxury"
        >
          {currentStepIndex === steps.length - 1 ? 'Reveal Recommendations' : 'Continue'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
