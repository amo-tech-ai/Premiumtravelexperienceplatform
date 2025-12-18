import React, { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetFooter, 
  SheetTitle,
  SheetDescription 
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Venue } from '../../types/wizard';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  CheckCircle2, 
  CreditCard,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../ui/utils';
import { motion, AnimatePresence } from 'motion/react';

interface BookingSheetProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
}

type BookingStep = 'DETAILS' | 'CONFIRMATION' | 'SUCCESS';

export const BookingSheet = ({ venue, isOpen, onClose }: BookingSheetProps) => {
  const [step, setStep] = useState<BookingStep>('DETAILS');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [guests, setGuests] = useState<string>("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!venue) return null;

  const handleConfirm = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('SUCCESS');
    }, 1500);
  };

  const resetFlow = () => {
    setStep('DETAILS');
    setDate(new Date());
    setTime("");
    setGuests("2");
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && resetFlow()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md md:max-w-lg p-0 bg-white border-l border-border/50 shadow-2xl z-[110]"
      >
        <AnimatePresence mode="wait">
          {step === 'DETAILS' && (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <SheetHeader className="p-6 border-b border-border/50">
                <SheetTitle className="text-xl font-serif text-slate-900">Request Reservation</SheetTitle>
                <SheetDescription>
                  at {venue.name}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Date Picker */}
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="p-3 bg-white rounded-md border shadow-md"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time & Guests Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Select onValueChange={setTime} value={time}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Guests</Label>
                    <Select onValueChange={setGuests} value={guests}>
                      <SelectTrigger>
                        <SelectValue placeholder="Guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>{num} People</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <h4 className="font-medium text-sm text-slate-900">Contact Details</h4>
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                      placeholder="Jane Doe" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      placeholder="jane@example.com" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Special Requests (Optional)</Label>
                    <Input placeholder="Allergies, anniversary, etc." />
                  </div>
                </div>
              </div>

              <SheetFooter className="p-6 border-t border-border/50 bg-slate-50">
                <Button 
                  className="w-full bg-emerald-900 hover:bg-emerald-800 text-white"
                  size="lg"
                  onClick={() => setStep('CONFIRMATION')}
                  disabled={!date || !time || !name || !email}
                >
                  Continue to Review
                </Button>
              </SheetFooter>
            </motion.div>
          )}

          {step === 'CONFIRMATION' && (
            <motion.div 
              key="confirmation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <SheetHeader className="p-6 border-b border-border/50 flex flex-row items-center gap-2">
                <Button variant="ghost" size="icon" className="-ml-2" onClick={() => setStep('DETAILS')}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                  <SheetTitle className="text-xl font-serif text-slate-900">Review Booking</SheetTitle>
                  <SheetDescription>One last check</SheetDescription>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Summary Card */}
                <div className="bg-slate-50 p-4 rounded-xl border border-border/50 space-y-4">
                  <div className="flex gap-4">
                    <img 
                      src={venue.images[0]} 
                      alt={venue.name} 
                      className="w-20 h-20 rounded-lg object-cover" 
                    />
                    <div>
                      <h3 className="font-medium text-slate-900">{venue.name}</h3>
                      <p className="text-sm text-muted-foreground">{venue.location.address}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs font-medium bg-white border px-1.5 py-0.5 rounded text-emerald-800">
                          {venue.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/10">
                    <div>
                      <span className="text-xs text-muted-foreground block">Date</span>
                      <span className="text-sm font-medium">{date ? format(date, "MMM d, yyyy") : '-'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Time</span>
                      <span className="text-sm font-medium">{time}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Guests</span>
                      <span className="text-sm font-medium">{guests} People</span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-slate-900">Payment Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reservation Deposit</span>
                    <span>$50.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span>$5.00</span>
                  </div>
                  <div className="border-t border-border/50 pt-2 flex justify-between font-medium text-slate-900">
                    <span>Total</span>
                    <span>$55.00</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    * The deposit will be deducted from your final bill.
                  </p>
                </div>

                {/* Payment Method Stub */}
                <div className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
                  <div className="bg-slate-100 p-2 rounded-full">
                    <CreditCard className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Apple Pay</p>
                    <p className="text-xs text-muted-foreground">Ending in 4242</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-emerald-900">Change</Button>
                </div>
              </div>

              <SheetFooter className="p-6 border-t border-border/50 bg-slate-50">
                <Button 
                  className="w-full bg-emerald-900 hover:bg-emerald-800 text-white"
                  size="lg"
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Confirm & Pay"}
                </Button>
              </SheetFooter>
            </motion.div>
          )}

          {step === 'SUCCESS' && (
             <motion.div 
               key="success"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col h-full items-center justify-center p-8 text-center"
             >
               <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                 <CheckCircle2 className="w-10 h-10 text-emerald-600" />
               </div>
               <h2 className="text-2xl font-serif text-slate-900 mb-2">Reservation Confirmed!</h2>
               <p className="text-muted-foreground mb-8">
                 Your table at {venue.name} is booked for {date ? format(date, "MMMM d") : ''} at {time}.
               </p>
               <div className="w-full space-y-3">
                 <Button className="w-full bg-slate-900 text-white" onClick={onClose}>
                   Done
                 </Button>
                 <Button variant="ghost" className="w-full" onClick={onClose}>
                   Add to Calendar
                 </Button>
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
};
