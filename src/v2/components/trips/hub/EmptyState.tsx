/**
 * EMPTY STATE V2
 * 
 * Shown when user has no trips yet
 */

import { Plane } from 'lucide-react';
import { Button } from '../../../../components/ui/button';

interface EmptyStateProps {
  onCreateTrip: () => void;
}

export function EmptyState({ onCreateTrip }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
        <Plane className="w-10 h-10 text-neutral-400" />
      </div>
      
      <h2 className="text-2xl mb-3 text-center">
        Start Your Next Adventure
      </h2>
      
      <p className="text-neutral-600 text-center max-w-md mb-8">
        Create a trip to organize your itinerary, discover the best experiences,
        and make the most of your travels.
      </p>
      
      <Button onClick={onCreateTrip} size="lg">
        Create Your First Trip
      </Button>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl">
        <div className="text-center">
          <div className="text-3xl mb-2">🗺️</div>
          <h3 className="font-medium mb-1">Plan Together</h3>
          <p className="text-sm text-neutral-600">
            Collaborate with travel companions in real-time
          </p>
        </div>
        
        <div className="text-center">
          <div className="text-3xl mb-2">🤖</div>
          <h3 className="font-medium mb-1">AI Assistant</h3>
          <p className="text-sm text-neutral-600">
            Get personalized recommendations and itineraries
          </p>
        </div>
        
        <div className="text-center">
          <div className="text-3xl mb-2">📱</div>
          <h3 className="font-medium mb-1">Mobile Ready</h3>
          <p className="text-sm text-neutral-600">
            Access your plans anywhere, anytime
          </p>
        </div>
      </div>
    </div>
  );
}
