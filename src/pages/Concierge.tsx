import React from 'react';
import { WizardLayout } from '../components/layout/WizardLayout';
import { ModeSelection } from '../components/wizard/ModeSelection';

const Concierge = () => {
  return (
    <WizardLayout title="Concierge">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ModeSelection />
      </div>
    </WizardLayout>
  );
};

export default Concierge;
