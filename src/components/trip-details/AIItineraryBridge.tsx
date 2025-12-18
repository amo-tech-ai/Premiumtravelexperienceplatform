import { useEffect } from 'react';
import { useAI } from '../../context/AIContext';
import { useTripDetails } from './TripDetailsContext';
import { toast } from 'sonner@2.0.3';

export function AIItineraryBridge() {
  const { lastAction } = useAI();
  const { addItemToDay, autoGenerateTrip } = useTripDetails();

  useEffect(() => {
    if (!lastAction) return;

    // Handle Itinerary Actions
    if (lastAction.type === 'ADD_TO_ITINERARY') {
       const { dayIndex, item } = lastAction.payload;
       addItemToDay(dayIndex, item);
       // Toast handled by context, but we could add AI-specific feedback here if needed
    }

    if (lastAction.type === 'AUTO_GENERATE_ITINERARY') {
       autoGenerateTrip();
    }

  }, [lastAction, addItemToDay, autoGenerateTrip]);

  return null; // Logic only component
}
