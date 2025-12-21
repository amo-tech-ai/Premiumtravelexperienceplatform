/**
 * Edit Activity Modal - Production-Ready Edit Interface
 * Pre-populates form with existing data, handles updates
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import { MapPin, DollarSign, Clock, Calendar, Tag } from 'lucide-react';

interface EditActivityModalProps {
  open: boolean;
  onClose: () => void;
  tripId: string;
  tripDays: number;
  activity: any; // The activity to edit
  onSuccess: () => void;
}

interface ActivityFormData {
  title: string;
  description: string;
  day: number;
  startTime: string;
  endTime: string;
  type: string;
  cost: string;
  location: {
    name: string;
    address: string;
    lat: number | null;
    lng: number | null;
  };
  notes: string;
}

const ACTIVITY_TYPES = [
  { value: 'activity', label: 'Activity', icon: '🎯' },
  { value: 'dining', label: 'Dining', icon: '🍽️' },
  { value: 'accommodation', label: 'Accommodation', icon: '🏨' },
  { value: 'transport', label: 'Transport', icon: '🚗' },
  { value: 'event', label: 'Event', icon: '🎉' },
  { value: 'other', label: 'Other', icon: '📌' },
];

export function EditActivityModal({ open, onClose, tripId, tripDays, activity, onSuccess }: EditActivityModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ActivityFormData>({
    title: '',
    description: '',
    day: 1,
    startTime: '',
    endTime: '',
    type: 'activity',
    cost: '',
    location: {
      name: '',
      address: '',
      lat: null,
      lng: null,
    },
    notes: '',
  });

  // Pre-populate form when activity changes
  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title || '',
        description: activity.description || '',
        day: activity.day || 1,
        startTime: activity.startTime || '',
        endTime: activity.endTime || '',
        type: activity.type || 'activity',
        cost: activity.cost ? String(activity.cost) : '',
        location: {
          name: activity.location?.name || '',
          address: activity.location?.address || '',
          lat: activity.location?.lat || null,
          lng: activity.location?.lng || null,
        },
        notes: activity.notes || '',
      });
    }
  }, [activity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter an activity title');
      return;
    }

    if (formData.day < 1 || formData.day > tripDays) {
      toast.error(`Please select a day between 1 and ${tripDays}`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-fd8c4bf7/trips/${tripId}/items/${activity.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            ...formData,
            cost: formData.cost ? parseFloat(formData.cost) : 0,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update activity');
      }

      toast.success('Activity updated successfully! ✨');
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
          <DialogDescription>
            Update the details of your activity
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Activity Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <Tag className="size-4" />
              Activity Title *
            </Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Visit Comuna 13, Dinner at El Cielo"
              className="text-base"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What will you do here?"
              rows={3}
              className="text-base resize-none"
            />
          </div>

          {/* Day and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day" className="flex items-center gap-2">
                <Calendar className="size-4" />
                Day *
              </Label>
              <Select
                value={String(formData.day)}
                onValueChange={(val) => setFormData({ ...formData, day: parseInt(val) })}
              >
                <SelectTrigger id="day">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: tripDays }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={String(day)}>
                      Day {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(val) => setFormData({ ...formData, type: val })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Start and End Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-2">
                <Clock className="size-4" />
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="flex items-center gap-2">
                <Clock className="size-4" />
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="text-base"
              />
            </div>
          </div>

          {/* Cost */}
          <div className="space-y-2">
            <Label htmlFor="cost" className="flex items-center gap-2">
              <DollarSign className="size-4" />
              Cost (USD)
            </Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              min="0"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="0.00"
              className="text-base"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="size-4" />
              Location
            </Label>
            <Input
              id="location"
              value={formData.location.name}
              onChange={(e) => setFormData({
                ...formData,
                location: { ...formData.location, name: e.target.value }
              })}
              placeholder="Place name, address, or neighborhood"
              className="text-base"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Booking confirmation, dress code, special requirements..."
              rows={2}
              className="text-base resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title.trim()}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
