import React, { useEffect } from 'react';
import { useAI } from '../../context/AIContext';
import { useWizard } from '../../context/WizardContext';

/**
 * AIWizardBridge
 * 
 * Connects the AIContext (Intelligence) to the WizardContext (State/UI).
 * When the AI "decides" on an action (stored in lastAction), this component
 * dispatches it to the WizardContext to update the application state.
 */
export const AIWizardBridge = () => {
  const { lastAction } = useAI();
  const { handleAIEvent } = useWizard();

  useEffect(() => {
    if (lastAction) {
      console.log('[AIWizardBridge] Relaying Action:', lastAction);
      handleAIEvent(lastAction);
    }
  }, [lastAction, handleAIEvent]);

  return null; // This is a logic-only component
};
