import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Check
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { Calendar } from "../components/ui/calendar";
import { cn } from "../components/ui/utils";

import { DateRange } from "react-day-picker@8.10.1";
import { addDays } from "date-fns@3.6.0";
import { useLocation } from "react-router-dom";

import { TripPlannerLayout } from "../components/itinerary/TripPlannerLayout";

// ----------------------------------------------------------------------
// Main Wizard Wrapper (Retains Setup Steps)
// ----------------------------------------------------------------------
export default function ItineraryWizard() {
  const location = useLocation();
  const initialState = location.state as { 
    budget?: number; 
    dateRange?: DateRange; 
    step?: number;
    interests?: string[];
    locationName?: string;
  } | null;

  const [step, setStep] = useState(initialState?.step || 1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialState?.dateRange || {
    from: new Date(),
    to: addDays(new Date(), 5),
  });
  const [interests, setInterests] = useState<string[]>(initialState?.interests || []);
  const [budget, setBudget] = useState([initialState?.budget || 2000]);
  const [locationName, setLocationName] = useState(initialState?.locationName || "Medellín");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Use existing wizard logic for steps 1-3
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setStep(4);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleInterest = (id: string) => {
    setInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // If at step 4, show the new Planner Interface
  if (step === 4) {
      return <TripPlannerLayout initialState={{ budget: budget[0], interests, locationName }} />;
  }

  // --- EXISTING WIZARD STEPS (1-3) ---
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-600"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
            <span className={step >= 1 ? "text-emerald-700" : ""}>Dates</span>
            <span className={step >= 2 ? "text-emerald-700" : ""}>Interests</span>
            <span className={step >= 3 ? "text-emerald-700" : ""}>Budget</span>
          </div>
        </div>

        <div className="text-center mb-10">
            <h1 className="font-serif text-3xl md:text-4xl text-slate-900 mb-3">
              {step === 1 && "When are you visiting?"}
              {step === 2 && "What inspires you?"}
              {step === 3 && "Set your budget"}
              {isGenerating && "Crafting your journey..."}
            </h1>
            <p className="text-slate-500">
              {step === 1 && "Select your travel dates to get started."}
              {step === 2 && "Choose a few themes for your trip."}
              {step === 3 && "Estimated total excluding flights."}
              {isGenerating && "Our AI is curating the perfect schedule."}
            </p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse" />
                </div>
                <p className="text-emerald-900 font-medium animate-pulse">Consulting local experts...</p>
              </motion.div>
            ) : (
              <>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full flex justify-center"
                  >
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      className="rounded-md border shadow-sm p-4"
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full"
                  >
                     <div className="grid grid-cols-2 gap-4 w-full">
                        {['Culture', 'Nature', 'Food', 'Nightlife', 'Art', 'Wellness'].map((id) => (
                        <button
                            key={id}
                            onClick={() => toggleInterest(id)}
                            className={cn(
                            "flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-200 gap-3 hover:scale-105",
                            interests.includes(id)
                                ? "border-emerald-600 bg-emerald-50 shadow-md"
                                : "border-slate-200 hover:border-emerald-200 bg-white"
                            )}
                        >
                            <span className="font-medium text-sm">{id}</span>
                            {interests.includes(id) && (
                            <div className="absolute top-3 right-3 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                                <Check className="w-2.5 h-2.5" />
                            </div>
                            )}
                        </button>
                        ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full max-w-sm space-y-8"
                  >
                    <div className="text-center">
                      <span className="text-5xl font-serif font-medium text-emerald-900">
                        ${budget[0]}
                      </span>
                      <span className="text-slate-400 ml-2">USD</span>
                    </div>
                    <Slider
                      defaultValue={[2000]}
                      max={10000}
                      step={100}
                      onValueChange={setBudget}
                      className="py-4"
                    />
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        {!isGenerating && (
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
              className={step === 1 ? "opacity-0" : "opacity-100"}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button 
              onClick={handleNext} 
              className="bg-emerald-900 hover:bg-emerald-800 text-white rounded-full px-8 py-6 shadow-lg shadow-emerald-900/20"
            >
              {step === 3 ? "Create Itinerary" : "Next"} <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
