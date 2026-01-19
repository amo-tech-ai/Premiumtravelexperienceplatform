import { useState } from 'react';
import { X, Loader2, Plus, MapPin, Calendar, Users, DollarSign, Info, ChevronDown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useNavigate } from 'react-router';
import config from '../../config/runtime';
import { motion } from 'motion/react';

import { useWizard } from '../../context/WizardContext';
import { useTrips } from '../../hooks/useTrips';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { ImageWithFallback } from '../figma/ImageWithFallback';

import { addDays, format } from 'date-fns@3.6.0';
import type { 
  LocationSelectProps, 
  DateSelectProps, 
  TravelersSelectProps, 
  BudgetSelectProps,
  BudgetOption 
} from '../../src/types/trips';

// --- Sub-components for Form Steps (Inline for now to keep context together) ---

// 1. Location Selection
const LocationSelect = ({ value, onChange, onClose }: LocationSelectProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
        <input 
          autoFocus
          type="text" 
          placeholder="Search destinations" 
          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Popular</p>
        {['Medellín', 'Cartagena', 'Bogotá', 'Santa Marta'].map(city => (
          <button 
            key={city}
            onClick={() => { onChange(city); onClose(); }}
            className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden">
               <img src={`https://source.unsplash.com/random/100x100/?${city}`} className="w-full h-full object-cover" alt={city} />
            </div>
            <span className="font-medium text-slate-700">{city}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// 2. Date Selection
const DateSelect = ({ onClose }: DateSelectProps) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June'];
  const [days, setDays] = useState(5);

  return (
    <div className="space-y-6">
      <div className="flex justify-center bg-slate-100 p-1 rounded-full w-max mx-auto">
         <button className="px-4 py-1.5 rounded-full bg-white shadow-sm text-sm font-medium">Dates</button>
         <button className="px-4 py-1.5 rounded-full text-slate-500 text-sm font-medium hover:text-slate-900">Flexible</button>
      </div>

      <div className="text-center">
        <label className="text-sm font-medium text-slate-900 mb-2 block">How many days?</label>
        <div className="flex items-center justify-center gap-4">
           <button onClick={() => setDays(d => Math.max(1, d - 1))} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">
             -
           </button>
           <span className="text-xl font-bold w-8 text-center">{days}</span>
           <button onClick={() => setDays(d => d + 1)} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">
             +
           </button>
        </div>
      </div>

      <div>
         <label className="text-sm font-medium text-slate-900 mb-3 block">Travel in January</label>
         <div className="grid grid-cols-3 gap-3">
            {months.map(m => (
               <button key={m} className={cn(
                 "border rounded-xl p-3 flex flex-col items-center gap-2 hover:border-slate-900 transition-colors",
                 m === 'January' ? "border-slate-900 bg-slate-50" : "border-slate-200"
               )}>
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <span className="text-sm font-medium">{m}</span>
               </button>
            ))}
         </div>
      </div>
      
      <Button onClick={onClose} className="w-full bg-slate-900 text-white rounded-full">Update</Button>
    </div>
  );
};

// 3. Travelers Selection
const TravelersSelect = ({ count, onChange, onClose }: TravelersSelectProps) => {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between p-2">
          <div>
             <p className="font-bold text-slate-900">Adults</p>
             <p className="text-sm text-slate-500">Ages 13 or above</p>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => onChange(Math.max(1, count - 1))} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">-</button>
             <span className="font-medium w-4 text-center">{count}</span>
             <button onClick={() => onChange(count + 1)} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">+</button>
          </div>
       </div>
       <div className="flex items-center justify-between p-2 border-t border-slate-100">
          <div>
             <p className="font-bold text-slate-900">Children</p>
             <p className="text-sm text-slate-500">Ages 2-12</p>
          </div>
          <div className="flex items-center gap-4">
             <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">-</button>
             <span className="font-medium w-4 text-center">0</span>
             <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50">+</button>
          </div>
       </div>
       <Button onClick={onClose} className="w-full bg-slate-900 text-white rounded-full mt-4">Update</Button>
    </div>
  );
};

// 4. Budget Selection
const BudgetSelect = ({ selected, onChange, onClose }: BudgetSelectProps) => {
  const options: BudgetOption[] = [
    { label: 'Any budget', val: 'any' },
    { label: 'On a budget', val: '$', icon: '$' },
    { label: 'Sensibly priced', val: '$$', icon: '$$' },
    { label: 'Upscale', val: '$$$', icon: '$$$' },
    { label: 'Luxury', val: '$$$$', icon: '$$$$' },
  ];

  return (
    <div className="space-y-4">
       <h3 className="text-center font-bold text-lg mb-2">Budget</h3>
       <p className="text-center text-sm text-slate-500 mb-6">Select your budget range</p>
       
       <div className="space-y-3">
         {options.map((opt) => (
           <button 
             key={opt.val}
             onClick={() => onChange(opt.val)}
             className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
           >
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                selected === opt.val ? "border-slate-900" : "border-slate-300"
              )}>
                 {selected === opt.val && <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />}
              </div>
              <span className="flex-1 text-left font-medium text-slate-900">
                {opt.icon && <span className="font-mono mr-2 text-slate-500 group-hover:text-slate-900">{opt.icon}</span>}
                {opt.label}
              </span>
           </button>
         ))}
       </div>

       <Button onClick={onClose} className="w-full bg-slate-900 text-white rounded-full mt-4">Update</Button>
    </div>
  );
};


// --- MAIN MODAL COMPONENT ---

export function TripCreateModal() {
  const { ui, closeCreateTrip } = useWizard();
  const { createTrip } = useTrips();
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [location, setLocation] = useState("Pereira");
  const [days, setDays] = useState(5);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState("$$$$");
  const [isRoadTrip, setIsRoadTrip] = useState(false);

  if (!ui.isCreateTripOpen) return null;

  const handleFieldClick = (field: string) => {
    setActiveField(field === activeField ? null : field);
  };

  const handleCreateTrip = async () => {
    // Validation
    if (!location || location.trim() === '') {
      toast.error('Please select a destination');
      return;
    }

    setLoading(true);
    try {
      // Calculate dates
      const startDate = new Date();
      const endDate = addDays(startDate, days);

      // Create trip in database
      const newTrip = await createTrip({
        title: `Trip to ${location}`,
        destination: location,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        status: 'draft'
      });

      if (newTrip) {
        toast.success('Trip created successfully!');
        closeCreateTrip();
        navigate(`/app/trip/${newTrip.id}`);
      }
    } catch (error) {
      toast.error('Failed to create trip');
      if (config.isDev) {
        console.error('Error creating trip:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeCreateTrip}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px]"
      >
        {/* Close Button */}
        <button 
          onClick={closeCreateTrip}
          className="absolute top-4 left-4 z-20 w-8 h-8 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <X className="w-5 h-5 text-slate-900" />
        </button>

        {/* LEFT: Image Section */}
        <div className="w-full md:w-[40%] bg-slate-200 relative min-h-[200px] md:min-h-full">
           <ImageWithFallback 
             src="https://images.unsplash.com/photo-1591528659550-b8f2a58b8d43?q=80&w=1000&auto=format&fit=crop"
             alt="Destination"
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
           <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-3xl font-bold mb-1">{location || "Where to?"}</h2>
              <div className="text-sm font-medium opacity-90 flex flex-wrap gap-2">
                 <span>{days} days in Jan</span>
                 <span>•</span>
                 <span>{travelers} travelers</span>
              </div>
              <div className="text-sm font-medium opacity-90 mt-1">
                 {budget}
              </div>
           </div>
           
           <button className="absolute bottom-6 right-6 text-white/60 hover:text-white">
              <Info className="w-5 h-5" />
           </button>
        </div>

        {/* RIGHT: Form Section */}
        <div className="w-full md:w-[60%] p-6 md:p-10 flex flex-col overflow-y-auto">
           <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center md:text-left">Create trip</h2>
           
           {/* Main Search Input */}
           <div className="mb-8">
              <div className="relative">
                 <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where to?" 
                    className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-full text-slate-900 font-medium shadow-sm focus:ring-2 focus:ring-slate-900 focus:outline-none"
                 />
                 {location && (
                    <button onClick={() => setLocation('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                       <X className="w-4 h-4" />
                    </button>
                 )}
              </div>
           </div>

           {/* Form Fields Stack */}
           <div className="space-y-4 flex-1">
              
              {/* 1. Where */}
              <div className="space-y-2">
                 <p className="font-bold text-sm text-slate-900">Where</p>
                 <div className="flex items-center gap-2 p-2 border border-slate-200 rounded-xl hover:border-slate-400 transition-colors cursor-pointer" onClick={() => handleFieldClick('location')}>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                       <img src="https://images.unsplash.com/photo-1591528659550-b8f2a58b8d43?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="Pereira" />
                    </div>
                    <div className="flex-1">
                       <span className="font-medium text-slate-900">{location || "Select location"}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setLocation(''); }} className="p-1 hover:bg-slate-100 rounded-full">
                       <X className="w-4 h-4 text-slate-400" />
                    </button>
                 </div>
                 
                 <div className="flex items-center justify-between mt-2 pl-1">
                    <button className="flex items-center gap-1 text-sm text-slate-500 font-medium hover:text-slate-900">
                       <Plus className="w-4 h-4" /> Add location
                    </button>
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-slate-900">Road trip?</span>
                       <button 
                         onClick={() => setIsRoadTrip(!isRoadTrip)}
                         className={cn("w-10 h-6 rounded-full relative transition-colors", isRoadTrip ? "bg-slate-900" : "bg-slate-200")}
                       >
                          <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm", isRoadTrip ? "left-5" : "left-1")} />
                       </button>
                    </div>
                 </div>
              </div>

              {/* 2. When */}
              <div className="relative">
                 <p className="font-bold text-sm text-slate-900 mb-2">When</p>
                 <button 
                   onClick={() => handleFieldClick('dates')}
                   className="w-full text-left p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-900 transition-colors"
                 >
                    <span className="font-medium text-slate-900">{days} days in Jan</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                 </button>
                 {activeField === 'dates' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-6 z-20">
                       <DateSelect onClose={() => setActiveField(null)} />
                    </div>
                 )}
              </div>

              {/* 3. Who */}
              <div className="relative">
                 <p className="font-bold text-sm text-slate-900 mb-2">Who</p>
                 <button 
                   onClick={() => handleFieldClick('who')}
                   className="w-full text-left p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-900 transition-colors"
                 >
                    <span className="font-medium text-slate-900">{travelers} travelers</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                 </button>
                 {activeField === 'who' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-6 z-20">
                       <TravelersSelect count={travelers} onChange={setTravelers} onClose={() => setActiveField(null)} />
                    </div>
                 )}
              </div>

              {/* 4. Budget */}
              <div className="relative">
                 <p className="font-bold text-sm text-slate-900 mb-2">Budget</p>
                 <button 
                   onClick={() => handleFieldClick('budget')}
                   className="w-full text-left p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-900 transition-colors"
                 >
                    <span className="font-medium text-slate-900">{budget}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                 </button>
                 {activeField === 'budget' && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-6 z-20">
                       <BudgetSelect selected={budget} onChange={setBudget} onClose={() => setActiveField(null)} />
                    </div>
                 )}
              </div>

           </div>

           {/* Footer Action */}
           <div className="mt-8 pt-4">
              <Button 
                onClick={handleCreateTrip}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-full h-12 text-lg font-medium"
                disabled={loading}
              >
                 {loading ? "Creating..." : "Create trip"}
              </Button>
           </div>

        </div>
      </motion.div>
    </div>
  );
}