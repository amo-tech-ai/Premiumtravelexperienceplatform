/**
 * WIZARD STEP 1: DESTINATION
 */

import { TripV2 } from '../../../types';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Badge } from '../../../../components/ui/badge';

interface Step1DestinationProps {
  data: Partial<TripV2>;
  onUpdate: (updates: Partial<TripV2>) => void;
}

const popularDestinations = [
  { city: 'Medellín', country: 'Colombia', emoji: '🌴' },
  { city: 'Cartagena', country: 'Colombia', emoji: '🏖️' },
  { city: 'Bogotá', country: 'Colombia', emoji: '🏔️' },
  { city: 'Cali', country: 'Colombia', emoji: '💃' },
];

export function Step1Destination({ data, onUpdate }: Step1DestinationProps) {
  const handleCityChange = (city: string) => {
    onUpdate({
      destination: {
        ...(data.destination || {}),
        city,
        country: data.destination?.country || '',
      },
    });
  };
  
  const handleCountryChange = (country: string) => {
    onUpdate({
      destination: {
        ...(data.destination || {}),
        city: data.destination?.city || '',
        country,
      },
    });
  };
  
  const handlePopularClick = (dest: typeof popularDestinations[0]) => {
    onUpdate({
      destination: {
        city: dest.city,
        country: dest.country,
      },
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl mb-2">Where are you going?</h3>
        <p className="text-neutral-600">
          Choose your destination to start planning
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="city">City or Destination</Label>
          <Input
            id="city"
            placeholder="e.g., Medellín"
            value={data.destination?.city || ''}
            onChange={(e) => handleCityChange(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            placeholder="e.g., Colombia"
            value={data.destination?.country || ''}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      
      <div>
        <Label className="mb-3 block">Popular Destinations</Label>
        <div className="flex flex-wrap gap-2">
          {popularDestinations.map((dest) => (
            <Badge
              key={`${dest.city}-${dest.country}`}
              variant="outline"
              className="cursor-pointer hover:bg-neutral-100 transition-colors px-4 py-2"
              onClick={() => handlePopularClick(dest)}
            >
              <span className="mr-2">{dest.emoji}</span>
              {dest.city}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
