import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar, MapPin, Users, DollarSign, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { formatCurrency, daysBetween, formatDateRange } from '../../utils/formatting';
import { useNavigate } from 'react-router-dom';

interface CreateTripModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateTripModal({ open, onClose }: CreateTripModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: '2',
    tripType: 'couple' as 'solo' | 'couple' | 'family' | 'friends',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }

      // Check if dates are in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (start < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleCreate = () => {
    // Generate unique ID
    const tripId = `trip-${Date.now()}`;

    // Calculate number of days
    const days = formData.startDate && formData.endDate 
      ? daysBetween(formData.startDate, formData.endDate)
      : 0;

    // Create trip object
    const newTrip = {
      id: tripId,
      title: `${formData.destination} Trip`,
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      travelers: parseInt(formData.travelers, 10),
      tripType: formData.tripType,
      days,
      status: 'planning' as const,
      createdAt: new Date().toISOString(),
      image: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop`, // Placeholder
    };

    // Save to localStorage (temporary until Supabase)
    const existingTrips = JSON.parse(localStorage.getItem('trips') || '[]');
    existingTrips.push(newTrip);
    localStorage.setItem('trips', JSON.stringify(existingTrips));

    // Show success message
    toast.success(`Trip to ${formData.destination} created!`, {
      description: `${days} days · ${formData.tripType} trip`,
    });

    // Close modal
    onClose();

    // Navigate to trip details
    navigate(`/trip/${tripId}`);

    // Reset form
    setFormData({
      destination: '',
      startDate: '',
      endDate: '',
      budget: '',
      travelers: '2',
      tripType: 'couple',
    });
    setStep(1);
  };

  const handleClose = () => {
    onClose();
    // Reset on close
    setTimeout(() => {
      setStep(1);
      setFormData({
        destination: '',
        startDate: '',
        endDate: '',
        budget: '',
        travelers: '2',
        tripType: 'couple',
      });
      setErrors({});
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-emerald-950">
            {step === 1 && 'Where are you going?'}
            {step === 2 && 'When is your trip?'}
            {step === 3 && 'Trip details'}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && 'Tell us your destination'}
            {step === 2 && 'Choose your travel dates'}
            {step === 3 && 'Final details for your trip'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-emerald-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Destination */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="destination" className="text-sm font-medium text-slate-700">
                Destination
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="destination"
                  placeholder="e.g., Medellín, Paris, Tokyo"
                  value={formData.destination}
                  onChange={(e) => updateField('destination', e.target.value)}
                  className={`pl-11 h-12 text-base ${
                    errors.destination ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }`}
                  autoFocus
                />
              </div>
              {errors.destination && (
                <p className="text-sm text-red-600">{errors.destination}</p>
              )}
            </div>

            {/* Popular Destinations */}
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">
                Popular Destinations
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['Medellín', 'Cartagena', 'Bogotá', 'Barcelona', 'Tokyo', 'Paris'].map(
                  (city) => (
                    <Button
                      key={city}
                      variant="outline"
                      className="justify-start h-10"
                      onClick={() => updateField('destination', city)}
                    >
                      <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                      {city}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Dates */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium text-slate-700">
                  Start Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateField('startDate', e.target.value)}
                    className={`pl-10 h-12 ${
                      errors.startDate ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.startDate && (
                  <p className="text-xs text-red-600">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium text-slate-700">
                  End Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateField('endDate', e.target.value)}
                    className={`pl-10 h-12 ${
                      errors.endDate ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.endDate && (
                  <p className="text-xs text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Duration Display */}
            {formData.startDate && formData.endDate && !errors.endDate && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-emerald-900">
                      {formatDateRange(formData.startDate, formData.endDate)}
                    </p>
                    <p className="text-xs text-emerald-700">
                      {daysBetween(formData.startDate, formData.endDate)} days
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Travelers */}
            <div className="space-y-2">
              <Label htmlFor="travelers" className="text-sm font-medium text-slate-700">
                Number of Travelers
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.travelers}
                  onChange={(e) => updateField('travelers', e.target.value)}
                  className="pl-11 h-12"
                />
              </div>
            </div>

            {/* Trip Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Trip Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['solo', 'couple', 'family', 'friends'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={formData.tripType === type ? 'default' : 'outline'}
                    className={`h-12 capitalize ${
                      formData.tripType === type
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : ''
                    }`}
                    onClick={() => updateField('tripType', type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Budget (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm font-medium text-slate-700">
                Budget <span className="text-slate-400">(optional)</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  step="100"
                  placeholder="1500"
                  value={formData.budget}
                  onChange={(e) => updateField('budget', e.target.value)}
                  className="pl-11 h-12"
                />
              </div>
              {formData.budget && (
                <p className="text-xs text-slate-500">
                  Total budget: {formatCurrency(parseFloat(formData.budget))}
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-emerald-50 to-amber-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-emerald-950">
                    Your {formData.destination} adventure
                  </p>
                  <p className="text-xs text-slate-600">
                    {formData.startDate && formData.endDate && (
                      <>
                        {formatDateRange(formData.startDate, formData.endDate)} ·{' '}
                        {daysBetween(formData.startDate, formData.endDate)} days
                      </>
                    )}{' '}
                    · {formData.travelers} {formData.travelers === '1' ? 'traveler' : 'travelers'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={handleNext}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Trip
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
