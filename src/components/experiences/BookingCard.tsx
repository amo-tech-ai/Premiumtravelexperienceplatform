import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, Star, ArrowRight } from 'lucide-react';

export const BookingCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 lg:p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-3xl font-serif text-slate-900">$120</span>
          <span className="text-slate-500 font-light"> / person</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded-md">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          4.9 (128)
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="p-4 border border-slate-200 rounded-xl hover:border-emerald-500/50 transition-colors cursor-pointer group">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block group-hover:text-emerald-600">Date</label>
          <div className="flex items-center gap-2 text-slate-700">
             <Calendar className="w-4 h-4 text-emerald-600" />
             <span className="font-medium">Select Date</span>
          </div>
        </div>

        <div className="p-4 border border-slate-200 rounded-xl hover:border-emerald-500/50 transition-colors cursor-pointer group">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block group-hover:text-emerald-600">Guests</label>
          <div className="flex items-center gap-2 text-slate-700">
             <Users className="w-4 h-4 text-emerald-600" />
             <span className="font-medium">2 Guests</span>
          </div>
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-full py-4 bg-emerald-900 text-white rounded-xl font-medium text-lg shadow-[0_10px_20px_rgba(6,78,59,0.2)] hover:shadow-[0_15px_30px_rgba(6,78,59,0.3)] mb-4"
      >
        Reserve Experience
      </motion.button>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
      >
        Contact Concierge
      </motion.button>

      <div className="mt-6 pt-6 border-t border-slate-100 text-center">
         <p className="text-xs text-slate-400 mb-2">Free cancellation up to 24h before.</p>
      </div>
    </div>
  );
};
