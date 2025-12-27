/**
 * Add Activity Modal - Production-Ready CRUD Interface
 * Full form with validation, error handling, and success states
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import config from '../../config/runtime';

interface AddActivityModalProps {
  open: boolean;
  onClose: () => void;
  tripId: string;
  tripDays: number;
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

export function AddActivityModal({ open, onClose, tripId, tripDays, onSuccess }: AddActivityModalProps) {
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
        `https://${config.supabase.projectId}.supabase.co/functions/v1/make-server-fd8c4bf7/trips/${tripId}/items`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.supabase.anonKey}`,
          },
          body: JSON.stringify({
            ...formData,
            cost: formData.cost ? parseFloat(formData.cost) : 0,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add activity');
      }

      toast.success('Activity added successfully! 🎉');
      
      // Reset form
      setFormData({
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

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add activity');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form on cancel
    setFormData({
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
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
          <DialogDescription>
            Add a new activity, dining reservation, or accommodation to your itinerary
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
              placeholder="e.g., Visit Comuna 13, Dinner at El Cielo, Hotel Check-in"
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
              placeholder="What will you do here? Any special notes?"
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
              onClick={handleCancel}
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
                  Adding...
                </span>
              ) : (
                'Add Activity'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}