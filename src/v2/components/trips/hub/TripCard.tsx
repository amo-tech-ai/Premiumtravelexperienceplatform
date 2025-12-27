/**
 * TRIP CARD V2
 * 
 * Card component for displaying trip summary in hub view
 */

import { TripV2 } from '../../../types';
import { Calendar, DollarSign, Users, MapPin } from 'lucide-react';
import { Card, CardContent } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Progress } from '../../../../components/ui/progress';

interface TripCardProps {
  trip: TripV2;
  onClick: () => void;
  isPast?: boolean;
}

export function TripCard({ trip, onClick, isPast = false }: TripCardProps) {
  // Format dates
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  // Get status badge color
  const getStatusColor = (status: TripV2['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-neutral-100 text-neutral-700';
      case 'planning':
        return 'bg-blue-100 text-blue-700';
      case 'booked':
        return 'bg-green-100 text-green-700';
      case 'active':
        return 'bg-purple-100 text-purple-700';
      case 'completed':
        return 'bg-neutral-100 text-neutral-600';
      case 'archived':
        return 'bg-neutral-100 text-neutral-500';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };
  
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
        isPast ? 'opacity-75' : ''
      }`}
      onClick={onClick}
    >
      {/* Cover Image */}
      {trip.coverImage && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img 
            src={trip.coverImage} 
            alt={trip.destination.city}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl mb-1">
              {trip.destination.city}
            </h3>
            <p className="text-sm text-neutral-600">
              {trip.destination.country}
            </p>
          </div>
          <Badge className={getStatusColor(trip.status)}>
            {trip.status}
          </Badge>
        </div>
        
        {/* Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <MapPin className="w-4 h-4" />
            <span>{trip.duration} days</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Users className="w-4 h-4" />
            <span>
              {trip.travelers.adults} {trip.travelers.adults === 1 ? 'adult' : 'adults'}
              {trip.travelers.children > 0 && `, ${trip.travelers.children} ${trip.travelers.children === 1 ? 'child' : 'children'}`}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <DollarSign className="w-4 h-4" />
            <span>
              {trip.budget.currency} {trip.budget.total.toLocaleString()}
              {trip.budget.type === 'per_person' && '/person'}
            </span>
          </div>
        </div>
        
        {/* Progress */}
        {!isPast && trip.status !== 'completed' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Progress</span>
              <span className="font-medium">{trip.progress}%</span>
            </div>
            <Progress value={trip.progress} className="h-2" />
          </div>
        )}
        
        {/* Budget Used (if active) */}
        {trip.status === 'active' && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Budget Used</span>
              <span className="font-medium">
                {trip.budget.currency} {trip.budget.spent.toLocaleString()} / {trip.budget.total.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
