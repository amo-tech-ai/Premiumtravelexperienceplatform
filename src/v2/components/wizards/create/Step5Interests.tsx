/**
 * WIZARD STEP 5: INTERESTS
 */

import { TripV2 } from '../../../types';
import { Label } from '../../../../components/ui/label';
import { Badge } from '../../../../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../../../../components/ui/radio-group';

interface Step5InterestsProps {
  data: Partial<TripV2>;
  onUpdate: (updates: Partial<TripV2>) => void;
}

const interestOptions = [
  { id: 'food', label: 'Food & Dining', emoji: '🍽️' },
  { id: 'culture', label: 'Art & Culture', emoji: '🎨' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🎉' },
  { id: 'nature', label: 'Nature & Outdoors', emoji: '🌿' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'adventure', label: 'Adventure', emoji: '🏔️' },
  { id: 'relaxation', label: 'Relaxation', emoji: '🧘' },
  { id: 'history', label: 'History', emoji: '🏛️' },
  { id: 'photography', label: 'Photography', emoji: '📸' },
];

export function Step5Interests({ data, onUpdate }: Step5InterestsProps) {
  const interests = data.interests || [];
  const pace = data.pace || 'moderate';
  const style = data.style || 'comfort';
  
  const toggleInterest = (id: string) => {
    const newInterests = interests.includes(id)
      ? interests.filter(i => i !== id)
      : [...interests, id];
    
    onUpdate({ interests: newInterests });
  };
  
  const updatePace = (value: 'relaxed' | 'moderate' | 'packed') => {
    onUpdate({ pace: value });
  };
  
  const updateStyle = (value: 'luxury' | 'comfort' | 'budget') => {
    onUpdate({ style: value });
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl mb-2">What are you interested in?</h3>
        <p className="text-neutral-600">
          Select your travel interests and preferences
        </p>
      </div>
      
      {/* Interests */}
      <div>
        <Label className="mb-3 block">Interests</Label>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((option) => (
            <Badge
              key={option.id}
              variant={interests.includes(option.id) ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-neutral-100 transition-colors px-4 py-2"
              onClick={() => toggleInterest(option.id)}
            >
              <span className="mr-2">{option.emoji}</span>
              {option.label}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Travel Pace */}
      <div>
        <Label className="mb-3 block">Travel Pace</Label>
        <RadioGroup value={pace} onValueChange={(v) => updatePace(v as any)}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="relaxed" id="relaxed" />
              <Label htmlFor="relaxed" className="font-normal cursor-pointer">
                <span className="font-medium">Relaxed</span>
                <span className="text-neutral-600 text-sm ml-2">
                  Take it slow, plenty of downtime
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="moderate" />
              <Label htmlFor="moderate" className="font-normal cursor-pointer">
                <span className="font-medium">Moderate</span>
                <span className="text-neutral-600 text-sm ml-2">
                  Balanced mix of activities and rest
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="packed" id="packed" />
              <Label htmlFor="packed" className="font-normal cursor-pointer">
                <span className="font-medium">Packed</span>
                <span className="text-neutral-600 text-sm ml-2">
                  See and do as much as possible
                </span>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>
      
      {/* Travel Style */}
      <div>
        <Label className="mb-3 block">Travel Style</Label>
        <RadioGroup value={style} onValueChange={(v) => updateStyle(v as any)}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="luxury" id="luxury" />
              <Label htmlFor="luxury" className="font-normal cursor-pointer">
                <span className="font-medium">Luxury</span>
                <span className="text-neutral-600 text-sm ml-2">
                  Premium experiences and accommodations
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comfort" id="comfort" />
              <Label htmlFor="comfort" className="font-normal cursor-pointer">
                <span className="font-medium">Comfort</span>
                <span className="text-neutral-600 text-sm ml-2">
                  Good quality, best value
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="budget" id="budget" />
              <Label htmlFor="budget" className="font-normal cursor-pointer">
                <span className="font-medium">Budget</span>
                <span className="text-neutral-600 text-sm ml-2">
                  Maximize experiences, minimize costs
                </span>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
