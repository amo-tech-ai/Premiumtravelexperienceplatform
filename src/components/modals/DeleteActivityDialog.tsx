/**
 * Delete Activity Dialog - Production-Ready Delete Confirmation
 * Simple, safe confirmation dialog with error handling
 */

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import config from '../../config/runtime';

interface DeleteActivityDialogProps {
  open: boolean;
  onClose: () => void;
  tripId: string;
  activity: any;
  onSuccess: () => void;
}

export function DeleteActivityDialog({ open, onClose, tripId, activity, onSuccess }: DeleteActivityDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!activity) return;

    setLoading(true);

    try {
      const response = await fetch(
        `https://${config.supabase.projectId}.supabase.co/functions/v1/make-server-fd8c4bf7/trips/${tripId}/items/${activity.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${config.supabase.anonKey}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete activity');
      }

      toast.success('Activity deleted successfully');
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            Delete Activity
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete <span className="font-semibold text-foreground">"{activity?.title}"</span>?
            </p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. The activity will be permanently removed from your itinerary.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <AlertTriangle className="size-4" />
                Delete Activity
              </span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}