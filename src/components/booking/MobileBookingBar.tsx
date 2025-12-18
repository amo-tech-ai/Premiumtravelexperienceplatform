import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookingSheet } from './BookingSheet';

interface MobileBookingBarProps {
  title: string;
  price?: number | string;
  type: 'DINING' | 'EVENT' | 'STAY';
  externalLink?: string;
}

export const MobileBookingBar = ({ title, price, type, externalLink }: MobileBookingBarProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-4 lg:hidden safe-area-pb">
        <div className="flex items-center justify-between gap-4">
            <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                    {type === 'DINING' ? 'Reserve Table' : 'Total Price'}
                </p>
                <p className="text-lg font-serif text-slate-900">
                    {price ? (typeof price === 'number' ? `$${price}` : price) : 'Inquire'}
                    <span className="text-xs font-sans text-slate-400 font-normal">
                        {type === 'DINING' ? '' : ' / person'}
                    </span>
                </p>
            </div>
            <button 
                onClick={() => setIsSheetOpen(true)}
                className="bg-emerald-900 text-white px-6 py-3 rounded-xl font-medium text-sm shadow-lg hover:bg-emerald-800 transition-colors"
            >
                {type === 'DINING' ? 'Request Table' : 'Check Availability'}
            </button>
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
