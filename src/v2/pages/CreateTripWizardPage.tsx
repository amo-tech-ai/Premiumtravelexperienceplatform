/**
 * CREATE TRIP WIZARD PAGE V2
 * 
 * Mobile-optimized 4-step wizard (reduced from 5 steps)
 * Uses linear progress bar instead of dots
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripV2 } from '../context/TripV2Context';
import { TripV2 } from '../types';
import { X, ChevronLeft } from 'lucide-react';
import { TouchTargetButton } from '../components/mobile/TouchTarget';
import { LinearProgress } from '../components/ui/LinearProgress';
import { Step1Destination } from '../components/wizards/create/Step1Destination';
import { Step2Dates } from '../components/wizards/create/Step2Dates';
import { Step3Details } from '../components/wizards/create/Step3Details';
import { Step5Interests } from '../components/wizards/create/Step5Interests';

export default function CreateTripWizardPage() {
  const navigate = useNavigate();
  const { createTrip } = useTripV2();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState<Partial<TripV2>>({
    budget: {
      total: 0,
      currency: 'USD',
      type: 'per_person',
      includes: [],
      spent: 0,
    },
    travelers: {
      adults: 2,
      children: 0,
      type: 'couple',
    },
    interests: [],
    pace: 'moderate',
    style: 'comfort',
  });
  
  const totalSteps = 4; // Reduced from 5
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleClose = () => {
    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
      navigate('/v2/trips');
    }
  };
  
  const handleComplete = () => {
    // Validate and create trip
    if (!tripData.destination || !tripData.startDate || !tripData.endDate) {
      return;
    }
    
    // Calculate duration
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const newTrip: TripV2 = {
      id: `trip-${Date.now()}`,
      userId: 'user-1', // TODO: Get from auth
      destination: tripData.destination!,
      startDate: tripData.startDate!,
      endDate: tripData.endDate!,
      duration,
      timezone: 'America/Bogota', // TODO: Get from destination
      travelers: tripData.travelers!,
      budget: tripData.budget!,
      interests: tripData.interests || [],
      pace: tripData.pace || 'moderate',
      style: tripData.style || 'comfort',
      dietary: tripData.dietary,
      status: 'draft',
      progress: 0,
      permissions: {
        'user-1': 'owner',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    createTrip(newTrip);
    navigate(`/v2/trips/${newTrip.id}`);
  };
  
  const updateTripData = (updates: Partial<TripV2>) => {
    setTripData({ ...tripData, ...updates });
  };
  
  // Check if current step is valid
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!tripData.destination;
      case 2:
        return !!tripData.startDate && !!tripData.endDate;
      case 3:
        return (tripData.travelers?.adults || 0) > 0;
      case 4:
        return true; // Interests are optional
      default:
        return false;
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header with Linear Progress */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-4">
            <TouchTargetButton
              variant="ghost"
              size="md"
              onClick={handleBack}
              disabled={currentStep === 1}
              aria-label="Go back"
              className="gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </TouchTargetButton>
            
            <h1 className="text-lg font-semibold text-gray-900">Create Trip</h1>
            
            <TouchTargetButton
              variant="ghost"
              size="md"
              onClick={handleClose}
              aria-label="Close wizard"
            >
              <X className="w-5 h-5" />
            </TouchTargetButton>
          </div>
          
          {/* Linear Progress Bar */}
          <div className="px-4 pb-4">
            <LinearProgress currentStep={currentStep} totalSteps={totalSteps} />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {currentStep === 1 && (
          <Step1Destination
            destination={tripData.destination || ''}
            onDestinationChange={(destination) => updateTripData({ destination })}
          />
        )}
        
        {currentStep === 2 && (
          <Step2Dates
            startDate={tripData.startDate || ''}
            endDate={tripData.endDate || ''}
            onStartDateChange={(startDate) => updateTripData({ startDate })}
            onEndDateChange={(endDate) => updateTripData({ endDate })}
          />
        )}
        
        {currentStep === 3 && (
          <Step3Details
            adults={tripData.travelers?.adults || 2}
            children={tripData.travelers?.children || 0}
            budget={tripData.budget?.total || 0}
            onAdultsChange={(adults) =>
              updateTripData({
                travelers: { ...tripData.travelers!, adults },
              })
            }
            onChildrenChange={(children) =>
              updateTripData({
                travelers: { ...tripData.travelers!, children },
              })
            }
            onBudgetChange={(total) =>
              updateTripData({
                budget: { ...tripData.budget!, total },
              })
            }
          />
        )}
        
        {currentStep === 4 && (
          <Step5Interests
            interests={tripData.interests || []}
            pace={tripData.pace || 'moderate'}
            style={tripData.style || 'comfort'}
            dietary={tripData.dietary}
            onInterestsChange={(interests) => updateTripData({ interests })}
            onPaceChange={(pace) => updateTripData({ pace })}
            onStyleChange={(style) => updateTripData({ style })}
            onDietaryChange={(dietary) => updateTripData({ dietary })}
          />
        )}
      </div>

      {/* Sticky Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-3 pb-safe">
          <TouchTargetButton
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={!isStepValid()}
            className="w-full"
          >
            {currentStep === totalSteps ? 'Create Trip' : 'Next'}
          </TouchTargetButton>
          
          {!isStepValid() && (
            <p className="text-sm text-gray-600 text-center mt-2">
              {currentStep === 1 && 'Please enter a destination'}
              {currentStep === 2 && 'Please select travel dates'}
              {currentStep === 3 && 'At least 1 adult traveler is required'}
            </p>
          )}
        </div>
      </div>

      {/* Bottom padding to prevent content being hidden under sticky footer */}
      <div className="h-24" aria-hidden="true" />
    </div>
  );
}