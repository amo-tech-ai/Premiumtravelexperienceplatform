import React, { useState } from 'react';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from "../ui/drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Sparkles, ExternalLink, Calendar, Users, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BookingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'DINING' | 'EVENT' | 'STAY';
  externalLink?: string; // If provided, shows "Instant Book" option
}

export const BookingSheet = ({ isOpen, onClose, title, type, externalLink }: BookingSheetProps) => {
  const [step, setStep] = useState<'OPTIONS' | 'FORM' | 'SUCCESS'>('OPTIONS');

  // Reset state when opening
  React.useEffect(() => {
    if (isOpen) setStep('OPTIONS');
  }, [isOpen]);

  const handleExternalClick = () => {
    if (externalLink) {
      window.open(externalLink, '_blank');
      onClose();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-w-xl mx-auto rounded-t-[2rem]">
        <DrawerHeader className="text-center">
          <DrawerTitle className="font-serif text-2xl text-emerald-900 mb-2">
            {step === 'SUCCESS' ? 'Request Received' : `Reserve ${title}`}
          </DrawerTitle>
          <DrawerDescription>
            {step === 'OPTIONS' && "Choose how you would like to secure your spot."}
            {step === 'FORM' && "Our concierge team will handle everything for you."}
            {step === 'SUCCESS' && "We'll confirm via WhatsApp shortly."}
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 'OPTIONS' && (
              <motion.div
                key="options"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Option 1: External Instant Book */}
                {externalLink && (
                  <button
                    onClick={handleExternalClick}
                    className="w-full group bg-slate-50 hover:bg-slate-100 border border-slate-200 p-4 rounded-xl flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <ExternalLink className="w-5 h-5 text-slate-900" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-slate-900">Instant Booking</h4>
                        <p className="text-xs text-slate-500">Book directly via {type === 'DINING' ? 'OpenTable' : 'Provider'}</p>
                      </div>
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-900 border border-slate-100 group-hover:border-slate-300">
                        Fastest
                    </div>
                  </button>
                )}

                {/* Option 2: Concierge Request */}
                <button
                  onClick={() => setStep('FORM')}
                  className="w-full group bg-emerald-900 hover:bg-emerald-800 text-white p-4 rounded-xl flex items-center justify-between transition-all shadow-luxury"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold">Concierge Request</h4>
                      <p className="text-xs text-emerald-100/70">We handle special requests & VIP tables</p>
                    </div>
                  </div>
                  <div className="bg-emerald-800 px-3 py-1 rounded-full text-xs font-bold text-emerald-100 border border-emerald-700">
                      Recommended
                  </div>
                </button>
              </motion.div>
            )}

            {step === 'FORM' && (
               <BookingForm onBack={() => setStep('OPTIONS')} onSubmit={() => setStep('SUCCESS')} />
            )}

            {step === 'SUCCESS' && (
               <SuccessView onClose={onClose} />
            )}
          </AnimatePresence>
        </div>

        <DrawerFooter className="pt-2">
            {step === 'OPTIONS' && (
                <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DrawerClose>
            )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const BookingForm = ({ onBack, onSubmit }: { onBack: () => void, onSubmit: () => void }) => {
    // Mock submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(onSubmit, 500);
    };

    return (
        <motion.form
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
            onSubmit={handleSubmit}
        >
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Date
                    </label>
                    <Input type="date" required className="bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Time
                    </label>
                    <Input type="time" required className="bg-slate-50 border-slate-200" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Guests
                </label>
                <select className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option>2 People</option>
                    <option>3 People</option>
                    <option>4 People</option>
                    <option>5+ (Group)</option>
                </select>
            </div>

            <div className="space-y-2">
                 <label className="text-xs font-medium text-slate-600">Special Requests</label>
                 <Textarea placeholder="Allergies, anniversaries, or preferred seating..." className="bg-slate-50 border-slate-200 resize-none h-24" />
            </div>

            <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                    Back
                </Button>
                <Button type="submit" className="flex-1 bg-emerald-900 hover:bg-emerald-800 text-white">
                    Submit Request
                </Button>
            </div>
        </motion.form>
    );
};

const SuccessView = ({ onClose }: { onClose: () => void }) => (
    <motion.div
        key="success"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
    >
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-xl text-slate-900 mb-2">You're all set!</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
            Our concierge has received your request. We'll send a confirmation to your WhatsApp within 15 minutes.
        </p>
        <Button onClick={onClose} className="w-full bg-slate-900 text-white">
            Return to Concierge
        </Button>
    </motion.div>
);
