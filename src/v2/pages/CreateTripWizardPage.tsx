/**
 * CREATE TRIP WIZARD PAGE V2
 * 
 * Multi-step wizard for creating new trips
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripV2 } from '../context/TripV2Context';
import { TripV2 } from '../types';
import { X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Step1Destination } from '../components/wizards/create/Step1Destination';
import { Step2Dates } from '../components/wizards/create/Step2Dates';
import { Step3Travelers } from '../components/wizards/create/Step3Travelers';
import { Step4Budget } from '../components/wizards/create/Step4Budget';
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
      adults: 1,
      children: 0,
      type: 'solo',
    },
    interests: [],
    pace: 'moderate',
    style: 'comfort',
  });
  
  const totalSteps = 5;
  
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
    navigate('/v2/trips');
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
  
  return (
    <div className="min-h-screen bg-neutral-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-neutral-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl">Create New Trip</h2>
            <p className="text-sm text-neutral-600 mt-1">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-neutral-100">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && (
            <Step1Destination 
              data={tripData}
              onUpdate={updateTripData}
            />
          )}
          {currentStep === 2 && (
            <Step2Dates 
              data={tripData}
              onUpdate={updateTripData}
            />
          )}
          {currentStep === 3 && (
            <Step3Travelers 
              data={tripData}
              onUpdate={updateTripData}
            />
          )}
          {currentStep === 4 && (
            <Step4Budget 
              data={tripData}
              onUpdate={updateTripData}
            />
          )}
          {currentStep === 5 && (
            <Step5Interests 
              data={tripData}
              onUpdate={updateTripData}
            />
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-neutral-200 p-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          
          <Button onClick={handleNext}>
            {currentStep === totalSteps ? 'Create Trip' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
