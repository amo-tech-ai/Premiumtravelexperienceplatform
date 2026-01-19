import React from 'react';
import { useNavigate } from 'react-router';
import { MoreVertical } from 'lucide-react';
import { Trip } from '../../types/trip';
import { TouchTargetButton } from '../mobile/TouchTarget';

interface HorizontalTripCardProps {
  trip: Trip;
  onMenuClick: (trip: Trip) => void;
}

/**
 * HorizontalTripCard - Mobile-optimized trip card
 * 
 * Layout: Image (left) | Content (center) | Menu (right)
 * Full width, horizontal layout for better mobile readability
 * Height: 120px fixed for consistent list rhythm
 */
export function HorizontalTripCard({ trip, onMenuClick }: HorizontalTripCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/v2/trips/${trip.id}`);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMenuClick(trip);
  };

  // Calculate trip status
  const today = new Date();
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  
  let status: 'planning' | 'upcoming' | 'active' | 'completed' = 'planning';
  let statusColor = 'bg-gray-500';
  
  if (today >= startDate && today <= endDate) {
    status = 'active';
    statusColor = 'bg-green-500';
  } else if (today < startDate) {
    const daysUntil = Math.floor((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 30) {
      status = 'upcoming';
      statusColor = 'bg-blue-500';
    }
  } else {
    status = 'completed';
    statusColor = 'bg-purple-500';
  }

  // Calculate days
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate progress
  const totalDays = days;
  const plannedDays = trip.days?.filter(day => day.items && day.items.length > 0).length || 0;
  const progress = totalDays > 0 ? Math.round((plannedDays / totalDays) * 100) : 0;

  // Count items
  const itemCount = trip.days?.reduce((sum, day) => sum + (day.items?.length || 0), 0) || 0;

  // Format budget
  const budget = trip.budget ? `$${trip.budget.toLocaleString()}` : 'No budget';

  return (
    <div
      className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer active:scale-[0.98] p-3"
      style={{ height: '120px' }}
      onClick={handleCardClick}
    >
      {/* Image Section - 100x100px */}
      <div className="relative flex-shrink-0">
        {trip.imageUrl ? (
          <img
            src={trip.imageUrl}
            alt={trip.destination}
            className="w-[100px] h-[100px] rounded-lg object-cover"
          />
        ) : (
          <div className="w-[100px] h-[100px] rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">
              {trip.destination.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-1 left-1 px-2 py-0.5 rounded text-[10px] font-semibold text-white uppercase ${statusColor}`}>
          {status}
        </div>
      </div>

      {/* Content Section - Flexible width */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 truncate">
          {trip.title || `Trip to ${trip.destination}`}
        </h3>
        
        {/* Destination */}
        <p className="text-sm text-gray-600 truncate">
          {trip.destination}
        </p>
        
        {/* Dates */}
        <p className="text-sm text-gray-500">
          {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {' - '}
          {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        
        {/* Quick Stats */}
        <p className="text-xs text-gray-500">
          {days} {days === 1 ? 'day' : 'days'} • {itemCount} {itemCount === 1 ? 'item' : 'items'} • {budget}
        </p>
        
        {/* Progress */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((dot) => (
              <div
                key={dot}
                className={`w-1.5 h-1.5 rounded-full ${
                  dot <= Math.ceil(progress / 20) ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-500">{progress}% planned</span>
        </div>
      </div>

      {/* Menu Button - 48x48px touch target */}
      <div className="flex-shrink-0" onClick={handleMenuClick}>
        <TouchTargetButton
          variant="icon"
          size="md"
          aria-label="Trip options"
        >
          <MoreVertical className="w-5 h-5" />
        </TouchTargetButton>
      </div>
    </div>
  );
}