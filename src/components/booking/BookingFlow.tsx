import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ShieldCheck, CreditCard, Calendar, Users, ArrowRight, Lock, ChevronLeft, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { cn } from '../ui/utils';
import { ImageWithFallback } from '../figma/ImageWithFallback';

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

type Step = 'intent' | 'details' | 'payment' | 'success';

export const BookingFlow: React.FC<BookingFlowProps> = ({ 
  isOpen, 
  onClose, 
  onComplete,
  tripDetails 
}) => {
  const [step, setStep] = useState<Step>('intent');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [guestDetails, setGuestDetails] = useState({
      firstName: '',
      lastName: '',
      email: '',
      requests: ''
  });
  const [paymentDetails, setPaymentDetails] = useState({
      cardNumber: '',
      expiry: '',
      cvc: '',
      name: ''
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
        setStep('intent');
        setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateDetails = () => {
      const newErrors: Record<string, boolean> = {};
      if (!guestDetails.firstName.trim()) newErrors.firstName = true;
      if (!guestDetails.lastName.trim()) newErrors.lastName = true;
      if (!guestDetails.email.trim() || !guestDetails.email.includes('@')) newErrors.email = true;
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
      const newErrors: Record<string, boolean> = {};
      if (!paymentDetails.cardNumber.trim()) newErrors.cardNumber = true;
      if (!paymentDetails.expiry.trim()) newErrors.expiry = true;
      if (!paymentDetails.cvc.trim()) newErrors.cvc = true;
      if (!paymentDetails.name.trim()) newErrors.name = true;

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const nextStep = (next: Step) => {
    setStep(next);
  };

  // --------------------------------------------------------------------------
  // STEP 1: INTENT MODAL (Soft Commit)
  // --------------------------------------------------------------------------
  const IntentStep = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600" />
      <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
        <X className="w-5 h-5" />
      </button>

      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">Ready to lock it in?</h2>
        <p className="text-slate-600">You're about to book a <span className="font-semibold text-emerald-800">{tripDetails.days}-day trip</span> to {tripDetails.location} for <span className="font-semibold text-emerald-800">{tripDetails.travelers} travelers</span>.</p>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-3 border border-slate-100">
        <div className="flex items-center gap-3 text-sm text-slate-700">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>{tripDetails.dates}</span>
          <button className="ml-auto text-xs text-emerald-600 font-medium hover:underline">Edit</button>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-700">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>{tripDetails.travelers} Guests</span>
          <button className="ml-auto text-xs text-emerald-600 font-medium hover:underline">Edit</button>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg mb-8">
        <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-800/80">Final price may vary slightly based on real-time availability. We'll hold these rates for 15 minutes.</p>
      </div>

      <div className="space-y-3">
        <Button onClick={() => nextStep('details')} className="w-full bg-emerald-900 hover:bg-emerald-800 text-white py-6 text-lg rounded-xl">
          Continue to Booking
        </Button>
        <Button onClick={onClose} variant="ghost" className="w-full">
          Back to Itinerary
        </Button>
      </div>
    </motion.div>
  );

  // --------------------------------------------------------------------------
  // STEP 2: DETAILS (Form)
  // --------------------------------------------------------------------------
  const DetailsStep = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]"
    >
      {/* Left: Form */}
      <div className="flex-1 p-8 md:p-10 overflow-y-auto">
        <div className="flex items-center gap-2 mb-8">
            <button onClick={() => setStep('intent')} className="text-slate-400 hover:text-emerald-700 transition-colors">
                <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-2xl font-bold text-slate-900">Guest Details</h2>
            <span className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Step 2 of 4</span>
        </div>

        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className={cn(errors.firstName && "text-red-500")}>First Name</Label>
                    <Input 
                        value={guestDetails.firstName}
                        onChange={(e) => {
                            setGuestDetails({...guestDetails, firstName: e.target.value});
                            if (errors.firstName) setErrors({...errors, firstName: false});
                        }}
                        placeholder="e.g. Sofia" 
                        className={cn("bg-slate-50 border-slate-200", errors.firstName && "border-red-300 ring-red-200 bg-red-50")} 
                    />
                </div>
                <div className="space-y-2">
                    <Label className={cn(errors.lastName && "text-red-500")}>Last Name</Label>
                    <Input 
                        value={guestDetails.lastName}
                        onChange={(e) => {
                            setGuestDetails({...guestDetails, lastName: e.target.value});
                            if (errors.lastName) setErrors({...errors, lastName: false});
                        }}
                        placeholder="e.g. Martinez" 
                        className={cn("bg-slate-50 border-slate-200", errors.lastName && "border-red-300 ring-red-200 bg-red-50")} 
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className={cn(errors.email && "text-red-500")}>Email Address</Label>
                <Input 
                    type="email" 
                    value={guestDetails.email}
                    onChange={(e) => {
                        setGuestDetails({...guestDetails, email: e.target.value});
                        if (errors.email) setErrors({...errors, email: false});
                    }}
                    placeholder="sofia@example.com" 
                    className={cn("bg-slate-50 border-slate-200", errors.email && "border-red-300 ring-red-200 bg-red-50")} 
                />
                {errors.email ? (
                    <p className="text-[10px] text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Valid email required</p>
                ) : (
                    <p className="text-[10px] text-slate-500">We'll send your confirmation and tickets here.</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Special Requests (Optional)</Label>
                <textarea 
                    value={guestDetails.requests}
                    onChange={(e) => setGuestDetails({...guestDetails, requests: e.target.value})}
                    className="w-full min-h-[100px] rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Dietary restrictions, accessibility needs, or surprise requests..."
                />
            </div>

            <div className="pt-4">
                <Button 
                    onClick={() => {
                        if (validateDetails()) nextStep('payment');
                    }} 
                    className="w-full bg-emerald-900 hover:bg-emerald-800 text-white py-6 rounded-xl"
                >
                    Continue to Payment <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
      </div>

      {/* Right: Summary */}
      <div className="w-full md:w-80 bg-slate-50 p-8 border-l border-slate-100 flex flex-col">
        <h3 className="font-serif text-lg font-bold text-slate-900 mb-6">Booking Summary</h3>
        
        <div className="space-y-4 flex-1">
            <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">${tripDetails.total}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-slate-600">Taxes & Fees</span>
                <span className="font-medium text-slate-900">${Math.round(tripDetails.total * 0.12)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-end">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-serif text-2xl font-bold text-emerald-900">${Math.round(tripDetails.total * 1.12)}</span>
            </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 mt-6 space-y-3">
             <div className="flex items-start gap-2 text-xs text-slate-500">
                <CreditCard className="w-3 h-3 mt-0.5 text-emerald-600" />
                <span>Free cancellation until 48h before trip.</span>
             </div>
             <div className="flex items-start gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-3 h-3 mt-0.5 text-emerald-600" />
                <span>Bank-level encryption.</span>
             </div>
        </div>
      </div>
    </motion.div>
  );

  // --------------------------------------------------------------------------
  // STEP 3: PAYMENT
  // --------------------------------------------------------------------------
  const PaymentStep = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl"
    >
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => setStep('details')} className="text-slate-400 hover:text-emerald-700 transition-colors">
            <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-serif text-2xl font-bold text-slate-900">Secure Payment</h2>
        <Lock className="w-4 h-4 ml-auto text-emerald-600" />
      </div>

      <div className="space-y-6">
         {/* Method Selection (Visual Only) */}
         <div className="grid grid-cols-2 gap-3">
            <div className="border-2 border-emerald-600 bg-emerald-50 text-emerald-800 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer">
                <CreditCard className="w-6 h-6" />
                <span className="text-xs font-bold">Card</span>
            </div>
            <div className="border border-slate-200 text-slate-500 hover:border-emerald-200 hover:bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                <span className="text-xl font-bold">Pay</span>
                <span className="text-xs font-medium">Apple Pay</span>
            </div>
         </div>

         <div className="space-y-4">
            <div className="space-y-2">
                <Label className={cn(errors.cardNumber && "text-red-500")}>Card Number</Label>
                <div className="relative">
                    <Input 
                        value={paymentDetails.cardNumber}
                        onChange={(e) => {
                             setPaymentDetails({...paymentDetails, cardNumber: e.target.value});
                             if(errors.cardNumber) setErrors({...errors, cardNumber: false});
                        }}
                        placeholder="0000 0000 0000 0000" 
                        className={cn("pl-10 font-mono", errors.cardNumber && "border-red-300")} 
                    />
                    <CreditCard className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label className={cn(errors.expiry && "text-red-500")}>Expiry</Label>
                    <Input 
                        value={paymentDetails.expiry}
                        onChange={(e) => {
                            setPaymentDetails({...paymentDetails, expiry: e.target.value});
                            if(errors.expiry) setErrors({...errors, expiry: false});
                        }}
                        placeholder="MM/YY" 
                        className={cn("font-mono", errors.expiry && "border-red-300")}
                    />
                </div>
                 <div className="space-y-2">
                    <Label className={cn(errors.cvc && "text-red-500")}>CVC</Label>
                    <Input 
                        value={paymentDetails.cvc}
                        onChange={(e) => {
                            setPaymentDetails({...paymentDetails, cvc: e.target.value});
                            if(errors.cvc) setErrors({...errors, cvc: false});
                        }}
                        placeholder="123" 
                        className={cn("font-mono", errors.cvc && "border-red-300")}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label className={cn(errors.name && "text-red-500")}>Cardholder Name</Label>
                <Input 
                    value={paymentDetails.name}
                    onChange={(e) => {
                        setPaymentDetails({...paymentDetails, name: e.target.value});
                        if(errors.name) setErrors({...errors, name: false});
                    }}
                    placeholder="Name on card" 
                    className={cn(errors.name && "border-red-300")}
                />
            </div>
         </div>

         <Button 
            onClick={() => {
                if (validatePayment()) {
                    setIsProcessing(true);
                    setTimeout(() => {
                        setIsProcessing(false);
                        nextStep('success');
                    }, 2000);
                }
            }} 
            disabled={isProcessing}
            className="w-full bg-emerald-900 hover:bg-emerald-800 text-white py-6 rounded-xl relative overflow-hidden"
         >
            {isProcessing ? (
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                </span>
            ) : (
                `Pay $${Math.round(tripDetails.total * 1.12)}`
            )}
         </Button>
         
         <div className="flex justify-center">
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Payments processed securely by Stripe
            </p>
         </div>
      </div>
    </motion.div>
  );

  // --------------------------------------------------------------------------
  // STEP 4: SUCCESS
  // --------------------------------------------------------------------------
  const generateICS = () => {
    const event = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:20250114T090000Z`, // Hardcoded for demo, normally dynamic
      `DTEND:20250119T180000Z`,
      `SUMMARY:Trip to ${tripDetails.location}`,
      `DESCRIPTION:Luxury trip for ${tripDetails.travelers} travelers. View your itinerary in the app.`,
      `LOCATION:${tripDetails.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([event], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'medellin-trip.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SuccessStep = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden"
    >
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-32 bg-emerald-900/5 -z-10 rounded-b-[50%]" />
        
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-4 ring-white">
            <Check className="w-10 h-10 text-emerald-600" />
        </div>

        <h2 className="font-serif text-3xl font-bold text-slate-900 mb-2">You're going to Medellín!</h2>
        <p className="text-slate-600 mb-8">Your trip has been confirmed. A receipt and detailed itinerary have been sent to <strong>{guestDetails.email}</strong>.</p>

        <div className="bg-slate-50 rounded-xl p-4 text-left space-y-4 mb-8">
            <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <div>
                    <p className="text-sm font-semibold text-slate-900">Check your email</p>
                    <p className="text-xs text-slate-500">We sent the confirmation to your inbox.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <div>
                    <p className="text-sm font-semibold text-slate-900">Invite your friends</p>
                    <p className="text-xs text-slate-500">Share the itinerary link so they can view it.</p>
                </div>
            </div>
             <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <div>
                    <p className="text-sm font-semibold text-slate-900">Meet your Concierge</p>
                    <p className="text-xs text-slate-500">Our AI assistant is now active to help you prepare.</p>
                </div>
            </div>
        </div>
        
        <div className="space-y-3">
            <Button 
                onClick={onComplete}
                className="w-full bg-emerald-900 hover:bg-emerald-800 text-white py-6 rounded-xl shadow-lg shadow-emerald-900/20"
            >
                Open Concierge Assistant
            </Button>
            <Button 
                onClick={generateICS}
                variant="ghost"
                className="w-full text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
            >
                <Calendar className="w-4 h-4 mr-2" /> Add to Calendar
            </Button>
        </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative z-10 w-full flex justify-center pointer-events-none [&>*]:pointer-events-auto">
                <AnimatePresence mode="wait">
                    {step === 'intent' && <IntentStep key="intent" />}
                    {step === 'details' && <DetailsStep key="details" />}
                    {step === 'payment' && <PaymentStep key="payment" />}
                    {step === 'success' && <SuccessStep key="success" />}
                </AnimatePresence>
            </div>
        </div>
    </AnimatePresence>
  );
};
