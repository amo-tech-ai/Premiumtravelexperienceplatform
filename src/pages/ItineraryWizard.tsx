import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar } from "../components/ui/calendar";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { ChevronRight, ChevronLeft, Check, Sparkles, ChevronUp, ChevronDown, MessageSquare, Save, MapPin } from "lucide-react";
import { cn } from "../components/ui/utils";
import { DateRange } from "react-day-picker@8.10.1";
import { addDays, format } from "date-fns@3.6.0";
import { useNavigate, useLocation } from "react-router-dom";
import { useAI } from "../context/AIContext";
import { toast } from "sonner@2.0.3";

import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// DND Imports
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Types
interface Activity {
  id: string;
  time: string;
  title: string;
  category: string;
  image?: string;
  isSavedItem?: boolean;
}

const INTERESTS = [
  { id: "culture", label: "Culture & History", icon: "🏛️" },
  { id: "nature", label: "Nature & Hiking", icon: "🌿" },
  { id: "food", label: "Gastronomy", icon: "🍽️" },
  { id: "nightlife", label: "Nightlife", icon: "🍸" },
  { id: "art", label: "Art & Design", icon: "🎨" },
  { id: "wellness", label: "Wellness", icon: "🧘" }
];

const ACTIVITY_POOL: Record<string, { title: string; category: string }[]> = {
  culture: [
    { title: 'Botero Plaza Tour', category: 'Culture' },
    { title: 'Comuna 13 History Walk', category: 'Culture' },
    { title: 'Museo de Antioquia', category: 'Culture' },
    { title: 'Pueblito Paisa Visit', category: 'Culture' }
  ],
  nature: [
    { title: 'Cable Car to Arví Park', category: 'Nature' },
    { title: 'Botanical Gardens', category: 'Nature' },
    { title: 'Parque Lleras Green Walk', category: 'Nature' }
  ],
  food: [
    { title: 'Breakfast at Pergamino', category: 'Food' },
    { title: 'Lunch at El Cielo', category: 'Food' },
    { title: 'Dinner at Oci.Mde', category: 'Food' },
    { title: 'Coffee Tasting Workshop', category: 'Food' }
  ],
  nightlife: [
    { title: 'Cocktails at Envy Rooftop', category: 'Nightlife' },
    { title: 'Salsa Dancing at Eslabón', category: 'Nightlife' }
  ],
  art: [
    { title: 'Modern Art Museum', category: 'Art' },
    { title: 'Street Art Graffiti Tour', category: 'Art' }
  ],
  wellness: [
    { title: 'Morning Yoga in Poblado', category: 'Wellness' },
    { title: 'Spa Treatment at Click Clack', category: 'Wellness' }
  ]
};

const DEFAULT_ACTIVITIES = [
    { title: 'Breakfast at Pergamino', category: 'Food' },
    { title: 'Botero Plaza Tour', category: 'Culture' },
    { title: 'Lunch at Carmen', category: 'Food' },
    { title: 'Explore El Poblado', category: 'Culture' },
    { title: 'Dinner at Don Diablo', category: 'Food' }
];

const generateActivities = (selectedInterests: string[], savedItems: any[] = []): Activity[] => {
  let pool: { title: string; category: string; image?: string; id?: string }[] = [];
  
  // 1. Prioritize Saved Items
  const savedActivities = savedItems.map(item => ({
    id: item.id,
    title: item.title,
    category: item.type === 'experience' ? 'Experience' : 'Dining', // Simple mapping
    image: item.image,
    isSavedItem: true
  }));

  // 2. Fill with Interest-based items
  if (selectedInterests.length === 0) {
    pool = DEFAULT_ACTIVITIES;
  } else {
    selectedInterests.forEach(interest => {
       if (ACTIVITY_POOL[interest]) {
         pool.push(...ACTIVITY_POOL[interest]);
       }
    });
  }

  // Combine: Start with saved items, fill the rest from pool
  let finalSelection = [...savedActivities];
  
  // Calculate how many more we need to reach 5
  const needed = 5 - finalSelection.length;
  
  if (needed > 0) {
      const shuffledPool = pool
        .filter(p => !finalSelection.some(s => s.title === p.title)) // Avoid duplicates
        .sort(() => 0.5 - Math.random())
        .slice(0, needed);
      finalSelection = [...finalSelection, ...shuffledPool];
  }

  // Limit to 5-7 items max for the demo
  finalSelection = finalSelection.slice(0, 7);

  const times = ['09:00 AM', '11:00 AM', '01:00 PM', '04:00 PM', '07:00 PM', '09:00 PM', '11:00 PM'];
  
  return finalSelection.map((item, i) => ({
    id: item.id || `generated-${i}`,
    time: times[i] || 'Flexible',
    title: item.title,
    category: item.category,
    image: item.image,
    isSavedItem: (item as any).isSavedItem
  }));
};

// ----------------------------------------------------------------------
// Draggable Item Component
// ----------------------------------------------------------------------
const ActivityItem = ({ activity, index, total, moveActivity, manualMove }: { 
  activity: Activity, 
  index: number, 
  total: number,
  moveActivity: (dragIndex: number, hoverIndex: number) => void,
  manualMove: (index: number, direction: 'up' | 'down') => void
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'activity',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'activity',
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveActivity(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div 
      ref={ref}
      className={cn(
        "flex gap-4 p-4 bg-white rounded-xl border mb-3 hover:shadow-md transition-all group relative cursor-grab active:cursor-grabbing",
        isDragging ? "opacity-50" : "opacity-100",
        activity.isSavedItem ? "border-emerald-200 bg-emerald-50/30" : "border-slate-100"
      )}
    >
      <div className="w-16 pt-1 text-sm font-medium text-slate-400 text-right hidden md:block">
        {activity.time}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
             {activity.image && (
                 <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                     <ImageWithFallback src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
                 </div>
             )}
             <div>
                <h4 className="font-medium text-slate-900">{activity.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-full inline-block font-medium">
                    {activity.category}
                    </span>
                    {activity.isSavedItem && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                            <Check className="w-3 h-3" /> From Collection
                        </span>
                    )}
                </div>
             </div>
          </div>

          {/* Mobile Move Controls */}
          <div className="flex flex-col md:hidden gap-1 ml-2">
            <button 
              onClick={(e) => { e.stopPropagation(); manualMove(index, 'up'); }}
              disabled={index === 0}
              className="p-1 bg-slate-100 rounded disabled:opacity-30"
            >
              <ChevronUp className="w-4 h-4 text-slate-600" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); manualMove(index, 'down'); }}
              disabled={index === total - 1}
              className="p-1 bg-slate-100 rounded disabled:opacity-30"
            >
              <ChevronDown className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
        <div className="md:hidden text-xs text-slate-400 mt-1">
          {activity.time}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Result View
// ----------------------------------------------------------------------
function ItineraryResult({ dateRange, interests, budget, locationName = "Medellín" }: any) {
  const navigate = useNavigate();
  const { injectMessage, saveItem, savedItems } = useAI();
  const [activities, setActivities] = useState<Activity[]>([]);

  // Generate activities based on interests on mount
  React.useEffect(() => {
    // Pass savedItems to generator
    const generated = generateActivities(interests, savedItems);
    setActivities(generated);
  }, [interests]); // Keep stable, don't re-shuffle on every savedItem change unless intentful

  const moveActivity = (dragIndex: number, hoverIndex: number) => {
    const dragItem = activities[dragIndex];
    const newActivities = [...activities];
    newActivities.splice(dragIndex, 1);
    newActivities.splice(hoverIndex, 0, dragItem);
    setActivities(newActivities);
  };

  const manualMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      moveActivity(index, index - 1);
    } else if (direction === 'down' && index < activities.length - 1) {
      moveActivity(index, index + 1);
    }
  };

  const handleConsultConcierge = () => {
    // 1. Create a summary string
    const summary = `I've created a preliminary itinerary for my trip to ${locationName}. Interests: ${interests.join(", ")}. Budget: $${budget}. Planned activities: ${activities.map(a => a.title).join(", ")}. Can you help me refine this and book the restaurants?`;
    
    // 2. Inject into AI Context and Open Chat
    injectMessage(summary, 'user', 'ITINERARY');
    useAI().toggleOpen(); // Open the chat overlay immediately
  };

  const handleSaveItinerary = () => {
    saveItem({
        id: `trip-${Date.now()}`,
        type: 'itinerary',
        title: `Trip to ${locationName}`,
        price: `$${budget}`,
        date: dateRange?.from ? `${format(dateRange.from, 'MMM d')} - ${dateRange.to ? format(dateRange.to, 'MMM d') : ''}` : 'Dates TBD',
        image: "https://images.unsplash.com/photo-1599582106603-946654a9388c?auto=format&fit=crop&q=80",
        data: { activities, interests, budget },
        notes: `${activities.length} Activities • $${budget} Budget`,
        location: `${locationName}, Colombia`
    });
    toast.success("Itinerary saved to Dashboard");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-slate-50 pb-20">
        {/* Header Hero */}
        <div className="bg-emerald-900 text-white pt-32 pb-24 px-6 rounded-b-[3rem] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-sm font-medium mb-4 backdrop-blur-md border border-white/10 text-emerald-100">
              Trip to {locationName}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Your Curated Journey
            </h1>
            <p className="text-emerald-100/80 max-w-lg mx-auto text-lg font-light">
              Based on your budget of ${budget} and love for {interests.map((i: string) => INTERESTS.find(x => x.id === i)?.label).join(", ")}.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Timeline */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif text-xl font-bold text-slate-900">Day 1 Itinerary</h3>
                  <span className="text-sm text-slate-400 hidden md:block">Drag to reorder</span>
                </div>
                
                {activities.map((activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    index={index}
                    total={activities.length}
                    activity={activity}
                    moveActivity={moveActivity}
                    manualMove={manualMove}
                  />
                ))}

                <Button variant="outline" className="w-full mt-4 border-dashed border-2 border-slate-200 text-slate-500 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50">
                  + Add Activity
                </Button>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              {/* Cost Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 sticky top-24">
                <h3 className="font-serif text-lg font-bold mb-4 text-slate-900">Estimated Cost</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Activities</span>
                    <span className="font-medium">$180</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Dining</span>
                    <span className="font-medium">$250</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Transport</span>
                    <span className="font-medium">$40</span>
                  </div>
                  <div className="h-px bg-slate-100 my-2" />
                  <div className="flex justify-between font-medium text-lg">
                    <span className="text-slate-700">Total</span>
                    <span className="text-emerald-700">$470</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                    <Button 
                        onClick={handleSaveItinerary}
                        variant="outline"
                        className="w-full border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 rounded-xl py-6"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save to Dashboard
                    </Button>
                    <Button 
                        onClick={handleConsultConcierge}
                        className="w-full bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl py-6 shadow-lg shadow-emerald-900/20"
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Discuss with Concierge
                    </Button>
                    <p className="text-xs text-center text-slate-400">
                        Refine this plan with our AI expert.
                    </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DndProvider>
  );
}

// ----------------------------------------------------------------------
// Main Wizard Component
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
  const { savedItems } = useAI();

  // If we jumped straight to results (step 4) via state, we might want to simulate generation first
  // But for now, let's just respect the passed step.
  
  React.useEffect(() => {
     if (initialState?.step === 4) {
         setIsGenerating(true);
         const timer = setTimeout(() => setIsGenerating(false), 2000);
         return () => clearTimeout(timer);
     }
  }, [initialState]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setStep(4); // Result View
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

  if (step === 4) {
    return <ItineraryResult dateRange={dateRange} interests={interests} budget={budget[0]} locationName={locationName} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
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

        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
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
          </motion.div>
        </div>

        {/* Content */}
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
                <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-emerald-600"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
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
                    {/* Saved Items Alert */}
                    {savedItems.length > 0 && (
                      <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-emerald-900">Found {savedItems.length} Saved Places</p>
                           <p className="text-xs text-emerald-700">We'll prioritize these in your itinerary.</p>
                        </div>
                        <div className="flex -space-x-2 ml-auto">
                           {savedItems.slice(0, 3).map((item, i) => (
                             <div key={item.id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-200">
                                <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
                             </div>
                           ))}
                           {savedItems.length > 3 && (
                             <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                               +{savedItems.length - 3}
                             </div>
                           )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 w-full">
                    {INTERESTS.map((interest) => (
                      <button
                        key={interest.id}
                        onClick={() => toggleInterest(interest.id)}
                        className={cn(
                          "flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-200 gap-3 hover:scale-105",
                          interests.includes(interest.id)
                            ? "border-emerald-600 bg-emerald-50 shadow-md"
                            : "border-slate-200 hover:border-emerald-200 bg-white"
                        )}
                      >
                        <span className="text-3xl">{interest.icon}</span>
                        <span className={cn(
                          "font-medium text-sm",
                          interests.includes(interest.id) ? "text-emerald-900" : "text-slate-600"
                        )}>{interest.label}</span>
                        {interests.includes(interest.id) && (
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
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Economy</span>
                      <span>Luxury</span>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
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
