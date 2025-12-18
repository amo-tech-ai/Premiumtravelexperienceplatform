import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { CheckCircle, CreditCard, Calendar, Users, ArrowRight, Loader2, Plane, Hotel } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../ui/utils';

interface BookingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  tripDetails: {
    total: number;
    days: number;
    travelers: number;
    location: string;
    dates: string;
  };
}

const STEPS = [
  { id: 'review', title: 'Review Itinerary' },
  { id: 'payment', title: 'Payment Details' },
  { id: 'confirm', title: 'Confirmation' }
];

export function BookingFlow({ isOpen, onClose, onComplete, tripDetails }: BookingFlowProps) {
  const [step, setStep] = useState<'review' | 'payment' | 'processing' | 'success'>('review');
  
  // Reset on open
  useEffect(() => {
    if (isOpen) setStep('review');
  }, [isOpen]);

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onComplete();
      }, 1500);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-slate-50 gap-0">
        
        {/* Header Progress */}
        <div className="bg-white p-6 border-b border-slate-200">
           <DialogHeader className="mb-4">
              <DialogTitle className="font-serif text-2xl">Complete Booking</DialogTitle>
              <DialogDescription>Secure your trip to {tripDetails.location}</DialogDescription>
           </DialogHeader>

           {/* Progress Steps */}
           <div className="flex items-center justify-between px-4">
              {STEPS.map((s, i) => {
                 const isActive = step === s.id || (step === 'processing' && s.id === 'payment') || (step === 'success' && s.id === 'confirm');
                 const isCompleted = (step === 'payment' && i === 0) || (step === 'processing' && i <= 1) || step === 'success';
                 
                 return (
                    <div key={s.id} className="flex flex-col items-center gap-2 relative z-10">
                       <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500",
                          isCompleted ? "bg-emerald-500 text-white" : isActive ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500"
                       )}>
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : i + 1}
                       </div>
                       <span className={cn("text-[10px] font-bold uppercase tracking-wider", isActive || isCompleted ? "text-slate-900" : "text-slate-400")}>{s.title}</span>
                    </div>
                 );
              })}
              {/* Connector Line */}
              <div className="absolute left-10 right-10 top-[76px] h-0.5 bg-slate-200 -z-0">
                 <motion.div 
                    className="h-full bg-emerald-500" 
                    initial={{ width: '0%' }}
                    animate={{ width: step === 'payment' ? '50%' : step === 'success' ? '100%' : '0%' }}
                 />
              </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[300px]">
           <AnimatePresence mode="wait">
              {step === 'review' && (
                 <motion.div 
                    key="review"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                 >
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
                       <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                          <div>
                             <h4 className="font-bold text-slate-900 text-lg">Trip Summary</h4>
                             <p className="text-sm text-slate-500">{tripDetails.dates}</p>
                          </div>
                          <div className="text-right">
                             <p className="font-bold text-slate-900 text-xl">${tripDetails.total.toLocaleString()}</p>
                             <p className="text-xs text-slate-500">Total Estimate</p>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                              <Users className="w-5 h-5 text-slate-400" />
                              <div>
                                  <p className="text-xs text-slate-500 font-bold">Travelers</p>
                                  <p className="text-sm font-semibold">{tripDetails.travelers} Guests</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                              <Calendar className="w-5 h-5 text-slate-400" />
                              <div>
                                  <p className="text-xs text-slate-500 font-bold">Duration</p>
                                  <p className="text-sm font-semibold">{tripDetails.days} Days</p>
                              </div>
                          </div>
                       </div>

                       <div className="space-y-2 pt-2">
                           <div className="flex justify-between text-sm">
                               <span className="text-slate-500">Flight Estimate</span>
                               <span className="font-medium">$850</span>
                           </div>
                           <div className="flex justify-between text-sm">
                               <span className="text-slate-500">Accommodation (5 nights)</span>
                               <span className="font-medium">$1,200</span>
                           </div>
                           <div className="flex justify-between text-sm">
                               <span className="text-slate-500">Experiences & Fees</span>
                               <span className="font-medium">$450</span>
                           </div>
                       </div>
                    </div>
                 </motion.div>
              )}

              {step === 'payment' && (
                  <motion.div 
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                     <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="flex items-center gap-3 mb-4">
                           <CreditCard className="w-5 h-5 text-emerald-600" />
                           <h4 className="font-bold text-slate-900">Payment Method</h4>
                        </div>
                        
                        <div className="space-y-3">
                           <div className="p-3 border border-emerald-500 bg-emerald-50/50 rounded-lg flex items-center justify-between cursor-pointer">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center text-[8px] text-white font-mono">VISA</div>
                                  <span className="font-semibold text-sm">•••• 4242</span>
                               </div>
                               <div className="w-4 h-4 rounded-full border-[5px] border-emerald-500 bg-white" />
                           </div>
                           <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between cursor-pointer hover:bg-slate-50">
                               <div className="flex items-center gap-3">
                                  <span className="font-bold text-sm">Apple Pay</span>
                               </div>
                               <div className="w-4 h-4 rounded-full border border-slate-300" />
                           </div>
                        </div>
                     </div>
                     <p className="text-xs text-slate-400 text-center px-8">
                        By confirming, you agree to the Terms of Service and Cancellation Policy.
                     </p>
                  </motion.div>
              )}

              {step === 'processing' && (
                  <motion.div 
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                     <div className="relative">
                        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Plane className="w-4 h-4 text-emerald-700 animate-pulse" />
                        </div>
                     </div>
                     <h3 className="font-bold text-lg mt-6 text-slate-900">Confirming bookings...</h3>
                     <p className="text-slate-500 text-sm">Please wait while we secure your itinerary.</p>
                  </motion.div>
              )}
              
              {step === 'success' && (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                     <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
                        <CheckCircle className="w-8 h-8" />
                     </div>
                     <h3 className="font-serif font-bold text-2xl text-slate-900">Trip Confirmed!</h3>
                     <p className="text-slate-500 max-w-xs mx-auto mt-2">
                        Your itinerary for {tripDetails.location} is all set. We've sent a confirmation email to you.
                     </p>
                  </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Footer Actions */}
        {step !== 'processing' && step !== 'success' && (
            <DialogFooter className="p-6 bg-white border-t border-slate-200">
                <Button variant="ghost" onClick={() => step === 'review' ? onClose() : setStep('review')}>
                    {step === 'review' ? 'Cancel' : 'Back'}
                </Button>
                <Button 
                   onClick={() => step === 'review' ? setStep('payment') : handlePay()}
                   className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                >
                    {step === 'review' ? 'Continue to Payment' : `Pay $${tripDetails.total.toLocaleString()}`}
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
