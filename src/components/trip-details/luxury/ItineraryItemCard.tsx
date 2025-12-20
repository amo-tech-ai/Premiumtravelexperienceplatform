import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GripVertical,
  Edit2,
  MoreVertical,
  Trash2,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Copy,
  MoveRight
} from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../ui/utils';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { useDrag } from 'react-dnd';
import type { TripItem } from '../TripDetailsContext';

interface ItineraryItemCardProps {
  item: TripItem;
  dayIndex: number;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onMoveToDay?: () => void;
  showWarning?: boolean;
  warningMessage?: string;
}

export const ItineraryItemCard = ({
  item,
  dayIndex,
  onEdit,
  onDelete,
  onDuplicate,
  onMoveToDay,
  showWarning = false,
  warningMessage
}: ItineraryItemCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TRIP_ITEM',
    item: { id: item.id, fromDayIndex: dayIndex, type: 'TRIP_ITEM' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const categoryConfig = {
    logistics: { 
      color: 'text-slate-600', 
      bg: 'bg-slate-50', 
      border: 'border-slate-200',
      icon: '✈️'
    },
    food: { 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      border: 'border-orange-200',
      icon: '🍽️'
    },
    activity: { 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-200',
      icon: '🎯'
    },
    stay: { 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      border: 'border-blue-200',
      icon: '🏨'
    }
  };

  const config = categoryConfig[item.type];

  const statusConfig = {
    planned: { label: 'Planned', color: 'text-slate-500', bg: 'bg-slate-100' },
    booked: { label: 'Booked', color: 'text-blue-600', bg: 'bg-blue-50' },
    confirmed: { label: 'Confirmed', color: 'text-emerald-600', bg: 'bg-emerald-50' }
  };

  const status = statusConfig[item.status || 'planned'];

  return (
    <motion.div
      ref={drag}
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "group relative bg-white rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 cursor-grab active:cursor-grabbing ml-4",
        isDragging 
          ? "opacity-40 ring-2 ring-emerald-400 bg-emerald-50 scale-105" 
          : showWarning
          ? "border-amber-200 hover:border-amber-300"
          : "border-slate-200 hover:border-emerald-200"
      )}
    >
      {/* Warning Banner */}
      {showWarning && warningMessage && (
        <div className="absolute -top-2 left-4 right-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs text-amber-800 shadow-sm z-10">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}

      <div className="p-4 flex gap-4">
        {/* Time Column */}
        <div className="flex flex-col items-center gap-1 min-w-[70px] pt-1">
          <div className="text-sm font-bold text-slate-900">
            {item.time || '—'}
          </div>
          {item.duration && (
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <Clock className="w-2.5 h-2.5" />
              <span>{item.duration}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 leading-snug truncate">
                {item.title}
              </h3>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                onClick={onEdit}
                className="h-7 w-7 hover:bg-slate-100"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
              </Button>

              {/* More Menu */}
              <div className="relative">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowMenu(!showMenu)}
                  className="h-7 w-7 hover:bg-slate-100"
                >
                  <MoreVertical className="w-3.5 h-3.5 text-slate-500" />
                </Button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                      {onDuplicate && (
                        <button
                          onClick={() => {
                            onDuplicate();
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4 text-slate-500" />
                          <span>Duplicate</span>
                        </button>
                      )}
                      {onMoveToDay && (
                        <button
                          onClick={() => {
                            onMoveToDay();
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                        >
                          <MoveRight className="w-4 h-4 text-slate-500" />
                          <span>Move to day...</span>
                        </button>
                      )}
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        onClick={() => {
                          onDelete();
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Category */}
            <span className={cn(
              "text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold flex items-center gap-1",
              config.bg, config.color, config.border, "border"
            )}>
              <span>{config.icon}</span>
              <span>{item.type}</span>
            </span>

            {/* Cost */}
            {item.cost && (
              <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200 flex items-center gap-1">
                <DollarSign className="w-2.5 h-2.5" />
                <span>${item.cost}</span>
              </span>
            )}

            {/* Status */}
            {item.status && item.status !== 'planned' && (
              <span className={cn(
                "text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1",
                status.bg, status.color
              )}>
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>{status.label}</span>
              </span>
            )}
          </div>

          {/* Notes */}
          {item.notes && (
            <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg mb-3 border border-slate-100">
              "{item.notes}"
            </p>
          )}

          {/* Image */}
          {item.image && (
            <div className="mt-3 h-40 rounded-lg overflow-hidden relative border border-slate-200">
              <ImageWithFallback
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Timeline Dot */}
      <div 
        className={cn(
          "absolute top-7 -left-[27px] w-3 h-3 rounded-full bg-white border-2 z-10 group-hover:scale-125 transition-transform",
          isDragging ? "border-emerald-400" : "border-emerald-500"
        )}
      />
    </motion.div>
  );
};
