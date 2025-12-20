import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  TrendingUp,
  Sparkles,
  AlertCircle,
  Coffee,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../ui/utils';
import type { TripItem, TripDay } from '../TripDetailsContext';

interface DaySectionProps {
  day: TripDay;
  dayIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
  onAddItem: () => void;
  onOptimize: () => void;
  children: React.ReactNode;
  totalDuration?: string;
  totalDistance?: string;
  hasConflicts?: boolean;
}

export const DaySection = ({
  day,
  dayIndex,
  isExpanded,
  onToggle,
  onAddItem,
  onOptimize,
  children,
  totalDuration,
  totalDistance,
  hasConflicts = false
}: DaySectionProps) => {
  const isEmpty = day.items.length === 0;

  // Calculate time of day distribution
  const getMorningItems = () => day.items.filter(item => {
    if (!item.time) return false;
    const hour = parseInt(item.time.split(':')[0]);
    return hour >= 6 && hour < 12;
  });

  const getAfternoonItems = () => day.items.filter(item => {
    if (!item.time) return false;
    const hour = parseInt(item.time.split(':')[0]);
    return hour >= 12 && hour < 18;
  });

  const getEveningItems = () => day.items.filter(item => {
    if (!item.time) return false;
    const hour = parseInt(item.time.split(':')[0]);
    return hour >= 18 || hour < 6;
  });

  return (
    <div className="mb-6">
      {/* Day Header */}
      <button
        onClick={onToggle}
        className={cn(
          "w-full group relative overflow-hidden rounded-2xl transition-all duration-300",
          isExpanded 
            ? "bg-white shadow-lg border-2 border-emerald-200" 
            : "bg-white hover:bg-slate-50 shadow-sm border border-slate-200 hover:border-emerald-200"
        )}
      >
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Left: Day Info */}
            <div className="flex items-center gap-4">
              {/* Expand Icon */}
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                isExpanded 
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg" 
                  : "bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600"
              )}>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </div>

              {/* Day Label */}
              <div className="text-left">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Day {day.day}
                  </h3>
                  <span className="text-sm text-slate-500">
                    {day.date}
                  </span>
                </div>

                {/* Summary Stats */}
                {!isEmpty && (
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3 h-3" />
                      <span>{day.items.length} {day.items.length === 1 ? 'stop' : 'stops'}</span>
                    </div>
                    {totalDuration && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{totalDuration}</span>
                      </div>
                    )}
                    {totalDistance && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <TrendingUp className="w-3 h-3" />
                        <span>{totalDistance}</span>
                      </div>
                    )}
                    {hasConflicts && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        <span>Conflicts detected</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Time Distribution Pills */}
                {!isEmpty && isExpanded && (
                  <div className="flex items-center gap-2 mt-2">
                    {getMorningItems().length > 0 && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-medium">
                        <Sun className="w-2.5 h-2.5" />
                        <span>{getMorningItems().length} morning</span>
                      </div>
                    )}
                    {getAfternoonItems().length > 0 && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full text-[10px] font-medium">
                        <Coffee className="w-2.5 h-2.5" />
                        <span>{getAfternoonItems().length} afternoon</span>
                      </div>
                    )}
                    {getEveningItems().length > 0 && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-medium">
                        <Moon className="w-2.5 h-2.5" />
                        <span>{getEveningItems().length} evening</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {!isEmpty && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOptimize();
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 hover:bg-emerald-50"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Optimize
                </Button>
              )}
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddItem();
                }}
                className={cn(
                  "transition-all",
                  isEmpty 
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-md" 
                    : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                )}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Gradient Bar (when expanded) */}
        {isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400" />
        )}
      </button>

      {/* Day Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-6 px-6">
              {isEmpty ? (
                /* Empty State */
                <div className="relative pb-8">
                  {/* Timeline Line */}
                  <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-200 via-slate-100 to-transparent" />
                  
                  <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                      No plans for this day yet
                    </h4>
                    <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                      Add activities, meals, or experiences to build your perfect day in Medellín
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddItem();
                        }}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-md"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Item
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOptimize();
                        }}
                        variant="outline"
                        className="border-slate-200 hover:bg-slate-50"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Let AI Build
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Items List */
                <div className="relative pb-8">
                  {/* Timeline Line */}
                  <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-blue-200 to-purple-200" />
                  
                  {/* Items */}
                  <div className="space-y-4">
                    {children}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
