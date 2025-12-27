/**
 * ITINERARY ITEM CARD
 * 
 * Display card for itinerary item with actions
 */

import { useState } from 'react';
import { ItineraryItemV2 } from '../../../types';
import { useTripV2 } from '../../../context/TripV2Context';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  MoreVertical,
  Edit,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components/ui/alert-dialog';
import { EditItemModal } from './EditItemModal';

interface ItineraryItemCardProps {
  item: ItineraryItemV2;
  dayNumber: number;
  hasConflict?: boolean;
}

export function ItineraryItemCard({ item, dayNumber, hasConflict }: ItineraryItemCardProps) {
  const { removeItineraryItem } = useTripV2();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const handleDelete = () => {
    removeItineraryItem(dayNumber, item.id);
    setIsDeleteOpen(false);
  };
  
  // Get type icon
  const getTypeIcon = () => {
    switch (item.type) {
      case 'restaurant':
        return '🍽️';
      case 'activity':
        return '🎯';
      case 'attraction':
        return '🏛️';
      case 'stay':
        return '🏨';
      case 'transport':
        return '🚗';
      default:
        return '📍';
    }
  };
  
  // Get booking status color
  const getBookingColor = () => {
    switch (item.bookingStatus) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'requested':
        return 'bg-yellow-100 text-yellow-700';
      case 'required':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };
  
  return (
    <>
      <div 
        className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
          hasConflict ? 'border-red-300 bg-red-50' : 'border-neutral-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-2xl">{getTypeIcon()}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{item.name}</h4>
              {item.description && (
                <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsDeleteOpen(true)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Details */}
        <div className="space-y-2">
          {/* Time */}
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Clock className="w-4 h-4" />
            <span>
              {item.startTime}
              {item.endTime && ` - ${item.endTime}`}
              {item.duration && ` (${Math.floor(item.duration / 60)}h ${item.duration % 60}m)`}
            </span>
          </div>
          
          {/* Location */}
          {item.location && (
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <MapPin className="w-4 h-4" />
              <span className="truncate">
                {item.location.neighborhood || item.location.address}
              </span>
            </div>
          )}
          
          {/* Cost */}
          {item.cost !== undefined && item.cost > 0 && (
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <DollarSign className="w-4 h-4" />
              <span>
                ${item.cost.toLocaleString()}
                {item.costType === 'per_person' && ' per person'}
              </span>
            </div>
          )}
        </div>
        
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {item.bookingStatus !== 'none' && (
            <Badge className={getBookingColor()}>
              {item.bookingStatus}
            </Badge>
          )}
          {item.addedBy === 'ai' && (
            <Badge variant="secondary">
              AI Suggested
            </Badge>
          )}
          {item.details.reservationRequired && (
            <Badge variant="outline">
              Reservation Required
            </Badge>
          )}
        </div>
        
        {/* Conflict Warning */}
        {hasConflict && (
          <div className="mt-3 flex items-start gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <span>Time conflict with another activity</span>
          </div>
        )}
        
        {/* Notes */}
        {item.notes && (
          <div className="mt-3 pt-3 border-t border-neutral-200 text-sm text-neutral-600">
            <strong>Note:</strong> {item.notes}
          </div>
        )}
      </div>
      
      {/* Edit Modal */}
      <EditItemModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        item={item}
        dayNumber={dayNumber}
      />
      
      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Activity?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{item.name}" from your itinerary?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
