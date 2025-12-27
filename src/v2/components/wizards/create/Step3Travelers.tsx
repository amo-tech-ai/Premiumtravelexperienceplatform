/**
 * WIZARD STEP 3: TRAVELERS
 */

import { TripV2 } from '../../../types';
import { Label } from '../../../../components/ui/label';
import { Button } from '../../../../components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../../../../components/ui/radio-group';

interface Step3TravelersProps {
  data: Partial<TripV2>;
  onUpdate: (updates: Partial<TripV2>) => void;
}

export function Step3Travelers({ data, onUpdate }: Step3TravelersProps) {
  const adults = data.travelers?.adults || 1;
  const children = data.travelers?.children || 0;
  const type = data.travelers?.type || 'solo';
  
  const updateAdults = (value: number) => {
    onUpdate({
      travelers: {
        ...data.travelers!,
        adults: Math.max(1, value),
      },
    });
  };
  
  const updateChildren = (value: number) => {
    onUpdate({
      travelers: {
        ...data.travelers!,
        children: Math.max(0, value),
      },
    });
  };
  
  const updateType = (value: 'solo' | 'couple' | 'family' | 'friends') => {
    onUpdate({
      travelers: {
        ...data.travelers!,
        type: value,
      },
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl mb-2">Who's coming along?</h3>
        <p className="text-neutral-600">
          Tell us about your travel companions
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Adults */}
        <div>
          <Label className="mb-3 block">Adults</Label>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => updateAdults(adults - 1)}
              disabled={adults <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-2xl font-medium min-w-[3rem] text-center">
              {adults}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => updateAdults(adults + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Children */}
        <div>
          <Label className="mb-3 block">Children</Label>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => updateChildren(children - 1)}
              disabled={children <= 0}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-2xl font-medium min-w-[3rem] text-center">
              {children}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => updateChildren(children + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Trip Type */}
        <div>
          <Label className="mb-3 block">Traveling as</Label>
          <RadioGroup value={type} onValueChange={(v) => updateType(v as any)}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="solo" id="solo" />
                <Label htmlFor="solo" className="font-normal cursor-pointer">
                  Solo traveler
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="couple" id="couple" />
                <Label htmlFor="couple" className="font-normal cursor-pointer">
                  Couple
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="family" id="family" />
                <Label htmlFor="family" className="font-normal cursor-pointer">
                  Family
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friends" id="friends" />
                <Label htmlFor="friends" className="font-normal cursor-pointer">
                  Friends
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
