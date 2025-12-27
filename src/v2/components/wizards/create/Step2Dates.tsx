/**
 * WIZARD STEP 2: DATES
 */

import { TripV2 } from '../../../types';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';

interface Step2DatesProps {
  data: Partial<TripV2>;
  onUpdate: (updates: Partial<TripV2>) => void;
}

export function Step2Dates({ data, onUpdate }: Step2DatesProps) {
  const handleStartDateChange = (date: string) => {
    onUpdate({ startDate: date });
  };
  
  const handleEndDateChange = (date: string) => {
    onUpdate({ endDate: date });
  };
  
  // Calculate duration
  const duration = data.startDate && data.endDate
    ? Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl mb-2">When are you traveling?</h3>
        <p className="text-neutral-600">
          Select your travel dates
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={data.startDate || ''}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="mt-1"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={data.endDate || ''}
            onChange={(e) => handleEndDateChange(e.target.value)}
            className="mt-1"
            min={data.startDate || new Date().toISOString().split('T')[0]}
          />
        </div>
        
        {duration > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <span className="font-medium">{duration} days</span> trip
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
