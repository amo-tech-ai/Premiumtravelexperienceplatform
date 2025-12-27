/**
 * EDIT ITEM MODAL
 * 
 * Modal for editing existing itinerary items
 */

import { useState, useEffect } from 'react';
import { useTripV2 } from '../../../context/TripV2Context';
import { ItineraryItemV2, ItemType } from '../../../types';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Textarea } from '../../../../components/ui/textarea';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItineraryItemV2;
  dayNumber: number;
}

export function EditItemModal({ isOpen, onClose, item, dayNumber }: EditItemModalProps) {
  const { updateItineraryItem } = useTripV2();
  
  const [form, setForm] = useState({
    type: item.type,
    name: item.name,
    startTime: item.startTime,
    endTime: item.endTime || '',
    duration: item.duration || 60,
    cost: item.cost || 0,
    location: item.location?.neighborhood || '',
    description: item.description || '',
    notes: item.notes || '',
    bookingStatus: item.bookingStatus,
  });
  
  // Reset form when item changes
  useEffect(() => {
    setForm({
      type: item.type,
      name: item.name,
      startTime: item.startTime,
      endTime: item.endTime || '',
      duration: item.duration || 60,
      cost: item.cost || 0,
      location: item.location?.neighborhood || '',
      description: item.description || '',
      notes: item.notes || '',
      bookingStatus: item.bookingStatus,
    });
  }, [item]);
  
  const handleSave = () => {
    const updates: Partial<ItineraryItemV2> = {
      type: form.type,
      name: form.name,
      startTime: form.startTime,
      endTime: form.endTime || undefined,
      duration: form.duration,
      cost: form.cost,
      location: form.location ? {
        address: '',
        neighborhood: form.location,
        coordinates: item.location?.coordinates || { lat: 0, lng: 0 },
      } : undefined,
      description: form.description || undefined,
      notes: form.notes || undefined,
      bookingStatus: form.bookingStatus,
    };
    
    updateItineraryItem(dayNumber, item.id, updates);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Activity Type */}
          <div>
            <Label htmlFor="edit-type">Activity Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) => setForm({ ...form, type: v as ItemType })}
            >
              <SelectTrigger id="edit-type" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activity">Activity</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="attraction">Attraction</SelectItem>
                <SelectItem value="stay">Accommodation</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="custom">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Name */}
          <div>
            <Label htmlFor="edit-name">Activity Name</Label>
            <Input
              id="edit-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1"
            />
          </div>
          
          {/* Times */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-startTime">Start Time</Label>
              <Input
                id="edit-startTime"
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-endTime">End Time</Label>
              <Input
                id="edit-endTime"
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          
          {/* Duration & Cost */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-duration">Duration (minutes)</Label>
              <Input
                id="edit-duration"
                type="number"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })}
                className="mt-1"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="edit-cost">Cost (USD)</Label>
              <Input
                id="edit-cost"
                type="number"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })}
                className="mt-1"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          {/* Booking Status */}
          <div>
            <Label htmlFor="edit-booking">Booking Status</Label>
            <Select
              value={form.bookingStatus}
              onValueChange={(v) => setForm({ ...form, bookingStatus: v as any })}
            >
              <SelectTrigger id="edit-booking" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="required">Required</SelectItem>
                <SelectItem value="requested">Requested</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Location */}
          <div>
            <Label htmlFor="edit-location">Location</Label>
            <Input
              id="edit-location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="mt-1"
              placeholder="e.g., El Poblado"
            />
          </div>
          
          {/* Description */}
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>
          
          {/* Notes */}
          <div>
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1"
              rows={2}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!form.name || !form.startTime}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
