/**
 * TRIP DETAILS
 * 
 * Detailed view of trip metadata and preferences
 */

import { TripV2 } from '../../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';

interface TripDetailsProps {
  trip: TripV2;
}

export function TripDetails({ trip }: TripDetailsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-neutral-600 mb-1">Destination</div>
            <div className="font-medium">
              {trip.destination.city}, {trip.destination.country}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-neutral-600 mb-1">Dates</div>
            <div className="font-medium">
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-neutral-600 mb-1">Duration</div>
            <div className="font-medium">{trip.duration} days</div>
          </div>
          
          <div>
            <div className="text-sm text-neutral-600 mb-1">Status</div>
            <Badge>{trip.status}</Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Travelers */}
      <Card>
        <CardHeader>
          <CardTitle>Travelers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-neutral-600 mb-1">Group Type</div>
            <div className="font-medium capitalize">{trip.travelers.type}</div>
          </div>
          
          <div>
            <div className="text-sm text-neutral-600 mb-1">Adults</div>
            <div className="font-medium">{trip.travelers.adults}</div>
          </div>
          
          <div>
            <div className="text-sm text-neutral-600 mb-1">Children</div>
            <div className="font-medium">{trip.travelers.children}</div>
          </div>
        </CardContent>
      </Card>
      
      {/* Budget */}
      <Card>
        <CardHeader>
          <CardTitle>Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-neutral-600 mb-1">Total Budget</div>
            <div className="font-medium">
              {trip.budget.currency} {trip.budget.total.toLocaleString()}
              {trip.budget.type === 'per_person' && ' per person'}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-neutral-600 mb-1">Spent</div>
            <div className="font-medium">
              {trip.budget.currency} {trip.budget.spent.toLocaleString()}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-neutral-600 mb-1">Remaining</div>
            <div className="font-medium text-green-600">
              {trip.budget.currency} {(trip.budget.total - trip.budget.spent).toLocaleString()}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-neutral-600 mb-1">Includes</div>
            <div className="flex flex-wrap gap-2">
              {trip.budget.includes.map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-neutral-600 mb-1">Interests</div>
            <div className="flex flex-wrap gap-2">
              {trip.interests.map((interest) => (
                <Badge key={interest} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-neutral-600 mb-1">Travel Pace</div>
            <div className="font-medium capitalize">{trip.pace}</div>
          </div>
          
          <div>
            <div className="text-sm text-neutral-600 mb-1">Travel Style</div>
            <div className="font-medium capitalize">{trip.style}</div>
          </div>
          
          {trip.dietary && trip.dietary.length > 0 && (
            <div>
              <div className="text-sm text-neutral-600 mb-1">Dietary</div>
              <div className="flex flex-wrap gap-2">
                {trip.dietary.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
