import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WizardLayout } from '../components/layout/WizardLayout';
import { FilterWizard } from '../components/wizard/FilterWizard';
import { useWizard } from '../context/WizardContext';
import { UserIntent } from '../types/wizard';

export const WizardFlow = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { setIntent, filters } = useWizard();

  useEffect(() => {
    if (category) {
      // Map URL param to UserIntent
      const intentMap: Record<string, UserIntent> = {
        'dining': 'DINING',
        'events': 'EVENTS',
        'stays': 'STAYS',
        'tourist': 'TOURIST'
      };
      
      const targetIntent = intentMap[category.toLowerCase()];
      if (targetIntent && filters.intent !== targetIntent) {
        setIntent(targetIntent);
      }
    }
  }, [category, setIntent, filters.intent]);

  const handleComplete = () => {
    // Navigate to results
    // In real app, we might trigger an AI search here
    navigate('/results');
  };

  const getTitle = () => {
    switch (category?.toLowerCase()) {
      case 'dining': return 'Curate Your Dining Experience';
      case 'events': return 'Find Exclusive Events';
      case 'stays': return 'Book Your Luxury Stay';
      case 'tourist': return 'Plan Your Adventure';
      default: return 'Concierge';
    }
  };

  return (
    <WizardLayout 
      title={getTitle()} 
      showBack 
      onBack={() => navigate('/concierge')}
    >
      <div className="h-full py-8">
        <FilterWizard onComplete={handleComplete} />
      </div>
    </WizardLayout>
  );
};

export default WizardFlow;
