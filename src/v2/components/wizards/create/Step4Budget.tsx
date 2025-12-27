/**
 * WIZARD STEP 4: BUDGET
 */

import { TripV2 } from '../../../types';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { RadioGroup, RadioGroupItem } from '../../../../components/ui/radio-group';
import { Checkbox } from '../../../../components/ui/checkbox';

interface Step4BudgetProps {
  data: Partial<TripV2>;
  onUpdate: (updates: Partial<TripV2>) => void;
}

export function Step4Budget({ data, onUpdate }: Step4BudgetProps) {
  const budget = data.budget || {
    total: 0,
    currency: 'USD',
    type: 'per_person',
    includes: [],
    spent: 0,
  };
  
  const handleTotalChange = (value: string) => {
    onUpdate({
      budget: {
        ...budget,
        total: parseFloat(value) || 0,
      },
    });
  };
  
  const handleTypeChange = (value: 'total' | 'per_person') => {
    onUpdate({
      budget: {
        ...budget,
        type: value,
      },
    });
  };
  
  const handleIncludeToggle = (item: string, checked: boolean) => {
    const includes = checked
      ? [...budget.includes, item as any]
      : budget.includes.filter((i) => i !== item);
    
    onUpdate({
      budget: {
        ...budget,
        includes,
      },
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl mb-2">What's your budget?</h3>
        <p className="text-neutral-600">
          Set your trip budget
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Total Budget */}
        <div>
          <Label htmlFor="budget">Total Budget (USD)</Label>
          <Input
            id="budget"
            type="number"
            placeholder="2400"
            value={budget.total || ''}
            onChange={(e) => handleTotalChange(e.target.value)}
            className="mt-1"
            min="0"
          />
        </div>
        
        {/* Budget Type */}
        <div>
          <Label className="mb-3 block">Budget Type</Label>
          <RadioGroup value={budget.type} onValueChange={(v) => handleTypeChange(v as any)}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="total" id="total" />
                <Label htmlFor="total" className="font-normal cursor-pointer">
                  Total for trip
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="per_person" id="per_person" />
                <Label htmlFor="per_person" className="font-normal cursor-pointer">
                  Per person
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        {/* Includes */}
        <div>
          <Label className="mb-3 block">Budget Includes</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="accommodation"
                checked={budget.includes.includes('accommodation')}
                onCheckedChange={(checked) => handleIncludeToggle('accommodation', checked as boolean)}
              />
              <Label htmlFor="accommodation" className="font-normal cursor-pointer">
                Accommodation
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="activities"
                checked={budget.includes.includes('activities')}
                onCheckedChange={(checked) => handleIncludeToggle('activities', checked as boolean)}
              />
              <Label htmlFor="activities" className="font-normal cursor-pointer">
                Activities & Attractions
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="food"
                checked={budget.includes.includes('food')}
                onCheckedChange={(checked) => handleIncludeToggle('food', checked as boolean)}
              />
              <Label htmlFor="food" className="font-normal cursor-pointer">
                Food & Dining
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="flights"
                checked={budget.includes.includes('flights')}
                onCheckedChange={(checked) => handleIncludeToggle('flights', checked as boolean)}
              />
              <Label htmlFor="flights" className="font-normal cursor-pointer">
                Flights
              </Label>
            </div>
          </div>
        </div>
        
        {/* Budget Info */}
        {budget.total > 0 && (
          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-sm text-neutral-700">
              <span className="font-medium">
                ${budget.total.toLocaleString()} USD
              </span>
              {budget.type === 'per_person' ? ' per person' : ' total'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
