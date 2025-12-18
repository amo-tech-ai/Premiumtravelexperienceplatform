import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, Star, ArrowRight, Building2 } from 'lucide-react';
import { BookingSheet } from './BookingSheet';

interface DetailBookingCardProps {
  price?: number | string;
  rating?: number;
  reviewCount?: number;
  title: string;
  type: 'DINING' | 'EVENT' | 'STAY';
  externalLink?: string;
  subtitle?: string; // e.g., "Asking Price"
}

export const DetailBookingCard = ({ 
  price, 
  rating, 
  reviewCount, 
  title, 
  type,
  externalLink,
  subtitle
}: DetailBookingCardProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Helper to format price
  const formatPrice = (val: number | string) => {
      if (typeof val === 'number') return `$${val.toLocaleString()}`;
      return val;
  };

  const getButtonLabel = () => {
      if (type === 'DINING') return 'Request Table';
      if (type === 'STAY') return 'Schedule Viewing';
      return 'Book Now';
  };

  const getDescription = () => {
      if (type === 'DINING') return 'Tables fill up fast for sunset hours. We handle reservations directly with the host.';
      if (type === 'STAY') return 'This property is currently available. Schedule a private viewing with our real estate specialists.';
      return 'Limited availability for this experience. Secure your spot now.';
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 lg:p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            {price ? (
              <>
                <span className="text-3xl font-serif text-slate-900">{formatPrice(price)}</span>
                <span className="text-slate-500 font-light block text-sm mt-1"> 
                    {subtitle || (type === 'DINING' ? '/ person avg' : '/ person')}
                </span>
              </>
            ) : (
               <span className="text-3xl font-serif text-slate-900">Inquire</span>
            )}
          </div>
          {rating && (
            <div className="flex items-center gap-1 text-sm font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded-md">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {rating} {reviewCount ? `(${reviewCount})` : ''}
            </div>
          )}
        </div>

        <div className="space-y-4 mb-6">
           <p className="text-sm text-slate-600 leading-relaxed">
             {getDescription()}
           </p>
        </div>

        <motion.button 
          onClick={() => setIsSheetOpen(true)}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="w-full py-4 bg-emerald-900 text-white rounded-xl font-medium text-lg shadow-[0_10px_20px_rgba(6,78,59,0.2)] hover:shadow-[0_15px_30px_rgba(6,78,59,0.3)] mb-4"
        >
          {getButtonLabel()}
        </motion.button>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
           <p className="text-xs text-slate-400 mb-2">
             {type === 'STAY' 
                ? 'Verified listing. Escrow services available.' 
                : 'Free cancellation up to 24h before.'}
           </p>
        </div>
      </div>

      <BookingSheet 
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title={title}
        type={type}
        externalLink={externalLink}
      />
    </>
  );
};
