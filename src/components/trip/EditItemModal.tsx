import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Clock, DollarSign, Trash2, Save, Tag } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { formatTime, parseTime, formatDuration, parseDuration } from '../../utils/time';
import { formatCurrency } from '../../utils/formatting';
import type { TripItem } from '../trip-details/TripDetailsContext';

interface EditItemModalProps {
  open: boolean;
  onClose: () => void;
  item: TripItem | null;
  onSave: (updatedItem: TripItem) => void;
  onDelete: (itemId: string) => void;
}

export function EditItemModal({ open, onClose, item, onSave, onDelete }: EditItemModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    duration: '',
    cost: '',
    notes: '',
    type: 'activity' as TripItem['type'],
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Populate form when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        time: item.time || '',
        duration: item.duration || '',
        cost: item.cost ? item.cost.toString() : '',
        notes: item.notes || '',
        type: item.type || 'activity',
      });
    }
  }, [item]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!item) return;

    // Validate title
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    // Validate time format if provided
    if (formData.time && !parseTime(formData.time)) {
      toast.error('Invalid time format. Use "10:00 AM" or "14:00"');
      return;
    }

    // Create updated item
    const updatedItem: TripItem = {
      ...item,
      title: formData.title.trim(),
      time: formData.time || undefined,
      duration: formData.duration || undefined,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      notes: formData.notes.trim() || undefined,
      type: formData.type,
    };

    onSave(updatedItem);
    
    toast.success('Item updated', {
      description: formData.title,
    });

    onClose();
  };

  const handleDelete = () => {
    if (!item) return;

    onDelete(item.id);
    
    toast.success('Item deleted', {
      description: formData.title,
    });

    setShowDeleteConfirm(false);
    onClose();
  };

  const handleClose = () => {
    onClose();
    setShowDeleteConfirm(false);
  };

  // Quick time presets
  const timePresets = [
    { label: 'Morning', value: '9:00 AM' },
    { label: 'Noon', value: '12:00 PM' },
    { label: 'Afternoon', value: '3:00 PM' },
    { label: 'Evening', value: '6:00 PM' },
  ];

  // Quick duration presets
  const durationPresets = [
    { label: '30 min', value: '30m' },
    { label: '1 hour', value: '1h' },
    { label: '2 hours', value: '2h' },
    { label: '3 hours', value: '3h' },
    { label: 'Half day', value: '4h' },
    { label: 'Full day', value: '8h' },
  ];

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-emerald-950">
            Edit Activity
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Make changes to your trip item.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-slate-700">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g., Comuna 13 Graffiti Tour"
              className="h-12 text-base"
              autoFocus
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-slate-700">
              Category
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => updateField('type', value)}
            >
              <SelectTrigger className="h-12">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">🍽️ Dining</SelectItem>
                <SelectItem value="activity">🎯 Activity</SelectItem>
                <SelectItem value="logistics">🚗 Logistics</SelectItem>
                <SelectItem value="stay">🏨 Accommodation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-sm font-medium text-slate-700">
              Time
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => updateField('time', e.target.value)}
                placeholder="e.g., 10:00 AM or 14:00"
                className="pl-11 h-12"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {timePresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant="outline"
                  size="sm"
                  onClick={() => updateField('time', preset.value)}
                  className="h-8 text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium text-slate-700">
              Duration
            </Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => updateField('duration', e.target.value)}
              placeholder="e.g., 2h or 30m"
              className="h-12"
            />
            <div className="flex flex-wrap gap-2">
              {durationPresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant="outline"
                  size="sm"
                  onClick={() => updateField('duration', preset.value)}
                  className="h-8 text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Cost */}
          <div className="space-y-2">
            <Label htmlFor="cost" className="text-sm font-medium text-slate-700">
              Cost
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={(e) => updateField('cost', e.target.value)}
                placeholder="0.00"
                className="pl-11 h-12"
              />
            </div>
            {formData.cost && parseFloat(formData.cost) > 0 && (
              <p className="text-xs text-slate-500">
                Cost: {formatCurrency(parseFloat(formData.cost))}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Add any additional details, confirmation numbers, or reminders..."
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium text-red-900">
              Are you sure you want to delete this item?
            </p>
            <p className="text-xs text-red-700">
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="flex-1"
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        <DialogFooter className="gap-2 sm:gap-0">
          {!showDeleteConfirm && (
            <>
              <Button
                variant="ghost"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 sm:mr-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <div className="flex gap-2 flex-1 sm:flex-initial">
                <Button variant="outline" onClick={handleClose} className="flex-1 sm:flex-initial">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}