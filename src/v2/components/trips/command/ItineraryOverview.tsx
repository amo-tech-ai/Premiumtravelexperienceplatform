/**
 * ITINERARY OVERVIEW
 * 
 * Shows summary of trip itinerary in command center
 */

import { TripV2, ItineraryV2 } from '../../../types';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';

interface ItineraryOverviewProps {
  trip: TripV2;
  itinerary: ItineraryV2 | null;
}

export function ItineraryOverview({ trip, itinerary }: ItineraryOverviewProps) {
  if (!itinerary) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-neutral-600">Loading itinerary...</p>
        </CardContent>
      </Card>
    );
  }
  
  const totalItems = itinerary.days.reduce((sum, day) => sum + day.items.length, 0);
  const totalCost = itinerary.days.reduce((sum, day) => sum + day.totalCost, 0);
  const totalDuration = itinerary.days.reduce((sum, day) => sum + day.totalDuration, 0);
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trip Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-medium">{totalItems}</div>
              <div className="text-sm text-neutral-600">Activities</div>
            </div>
            <div>
              <div className="text-2xl font-medium">{trip.duration}</div>
              <div className="text-sm text-neutral-600">Days</div>
            </div>
            <div>
              <div className="text-2xl font-medium">
                ${totalCost.toLocaleString()}
              </div>
              <div className="text-sm text-neutral-600">Planned</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daily Itinerary</CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {itinerary.days.map((day) => (
            <div
              key={day.dayNumber}
              className="border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-medium">
                    Day {day.dayNumber}
                    {day.title && ` — ${day.title}`}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {formatDate(day.date)}
                  </div>
                </div>
                {day.items.length === 0 && (
                  <Button variant="outline" size="sm">
                    Plan Day
                  </Button>
                )}
              </div>
              
              {day.items.length > 0 ? (
                <>
                  <div className="space-y-2 mb-3">
                    {day.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="text-sm flex items-center gap-2">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span className="text-neutral-600">{item.startTime}</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                    ))}
                    {day.items.length > 3 && (
                      <div className="text-sm text-neutral-500">
                        +{day.items.length - 3} more activities
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-neutral-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{day.items.length} activities</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{Math.floor(day.totalDuration / 60)}h {day.totalDuration % 60}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>${day.totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-neutral-500">No activities planned yet</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
