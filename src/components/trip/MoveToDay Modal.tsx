/**
 * Move to Day Modal
 * Allows users to move itinerary items between days
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Calendar, ArrowRight, Check } from 'lucide-react';
import { cn } from '../ui/utils';
import type { TripItem, TripDay } from '../trip-details/TripDetailsContext';

interface MoveToDayModalProps {
  open: boolean;
  onClose: () => void;
  item: TripItem | null;
  currentDayIndex: number;
  days: TripDay[];
  onMove: (fromDay: number, toDay: number, itemId: string) => void;
}

export function MoveToDayModal({
  open,
  onClose,
  item,
  currentDayIndex,
  days,
  onMove,
}: MoveToDayModalProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  if (!item) return null;

  const handleConfirm = () => {
    if (selectedDayIndex === null) return;
    onMove(currentDayIndex, selectedDayIndex, item.id);
    onClose();
    setSelectedDayIndex(null);
  };

  const handleCancel = () => {
    onClose();
    setSelectedDayIndex(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Move to Another Day</DialogTitle>
          <DialogDescription>
            Select which day you'd like to move "{item.title}" to
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {/* Current Day Info */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div className="flex-1">
              <p className="text-xs text-slate-500 font-medium">Currently on</p>
              <p className="text-sm font-medium text-slate-900">
                Day {currentDayIndex + 1} - {days[currentDayIndex]?.date}
              </p>
            </div>
          </div>

          {/* Day Selection */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-3">
              Move to:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {days.map((day, index) => {
                const isCurrent = index === currentDayIndex;
                const isSelected = index === selectedDayIndex;
                
                return (
                  <button
                    key={day.day}
                    onClick={() => !isCurrent && setSelectedDayIndex(index)}
                    disabled={isCurrent}
                    className={cn(
                      "relative p-4 rounded-xl border-2 transition-all text-left",
                      isCurrent 
                        ? "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                        : isSelected
                        ? "border-emerald-500 bg-emerald-50 shadow-md"
                        : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30 cursor-pointer"
                    )}
                  >
                    {/* Selected Check */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}

                    {/* Day Info */}
                    <div className="space-y-1">
                      <p className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        isSelected ? "text-emerald-700" : "text-slate-500"
                      )}>
                        Day {day.day}
                      </p>
                      <p className={cn(
                        "text-sm font-medium",
                        isSelected ? "text-emerald-900" : "text-slate-900"
                      )}>
                        {day.date}
                      </p>
                      <p className="text-xs text-slate-500">
                        {day.items.length} {day.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>

                    {/* Current Badge */}
                    {isCurrent && (
                      <div className="absolute top-2 right-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          {selectedDayIndex !== null && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-700">
                <ArrowRight className="w-4 h-4" />
                <p className="text-xs font-bold uppercase tracking-wider">
                  Moving to
                </p>
              </div>
              <p className="text-sm text-emerald-900">
                <span className="font-semibold">{item.title}</span> will be moved to{' '}
                <span className="font-semibold">Day {selectedDayIndex + 1}</span>
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedDayIndex === null}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Move Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
