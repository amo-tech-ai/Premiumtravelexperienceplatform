/**
 * Calendar Screen Component - Weekly Schedule View
 * Shows availability and scheduled activities across a week
 * Designed for I Love Medellín: calm, modern, trustworthy
 */

import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarScreenProps {
  compact?: boolean;
}

interface ScheduleBlock {
  day: number; // 0-6 (Mon-Sun)
  startHour: number; // 0-23
  duration: number; // hours
  title: string;
  type: 'activity' | 'available' | 'blocked';
}

export function CalendarScreen({ compact = false }: CalendarScreenProps) {
  // Week data (Mon - Sun)
  const weekDays = [
    { short: 'Mon', date: '20', full: 'Monday' },
    { short: 'Tue', date: '21', full: 'Tuesday' },
    { short: 'Wed', date: '22', full: 'Wednesday' },
    { short: 'Thu', date: '23', full: 'Thursday' },
    { short: 'Fri', date: '24', full: 'Friday' },
    { short: 'Sat', date: '25', full: 'Saturday' },
    { short: 'Sun', date: '26', full: 'Sunday' }
  ];

  // Time slots (6 AM - 11 PM)
  const timeSlots = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'];

  // Scheduled activities
  const schedule: ScheduleBlock[] = [
    // Monday
    { day: 0, startHour: 9, duration: 2, title: 'Café Velvet', type: 'activity' },
    { day: 0, startHour: 14, duration: 3, title: 'Available', type: 'available' },
    
    // Wednesday
    { day: 2, startHour: 10, duration: 2, title: 'Museum Tour', type: 'activity' },
    { day: 2, startHour: 19, duration: 3, title: 'Available', type: 'available' },
    
    // Thursday
    { day: 3, startHour: 9, duration: 8, title: 'Available', type: 'available' },
    
    // Friday
    { day: 4, startHour: 20, duration: 3, title: 'Jazz Night', type: 'activity' },
    
    // Saturday
    { day: 5, startHour: 10, duration: 4, title: 'Available', type: 'available' },
    { day: 5, startHour: 19, duration: 3, title: 'Dinner Reserved', type: 'activity' },
  ];

  // Calculate position for time blocks
  const getBlockStyle = (block: ScheduleBlock) => {
    const startHourNormalized = block.startHour - 6; // Start from 6 AM
    const totalHours = 17; // 6 AM to 11 PM
    const top = (startHourNormalized / totalHours) * 100;
    const height = (block.duration / totalHours) * 100;
    
    return {
      top: `${top}%`,
      height: `${height}%`
    };
  };

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'activity':
        return 'bg-emerald-500 border-emerald-600';
      case 'available':
        return 'bg-emerald-100 border-emerald-300';
      case 'blocked':
        return 'bg-slate-200 border-slate-300';
      default:
        return 'bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`font-bold text-slate-900 ${compact ? 'text-lg' : 'text-xl'}`}>
            Set Your Schedule
          </h3>
          <p className={`text-slate-600 ${compact ? 'text-xs' : 'text-sm'}`}>
            January 20-26, 2026
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Previous week">
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Next week">
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Weekly Schedule Grid */}
        <div className="p-4">
          <div className="flex gap-2">
            
            {/* Time Labels Column */}
            <div className="w-12 flex-shrink-0 pt-8">
              <div className="relative h-48">
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className="absolute text-xs text-slate-500 -translate-y-1/2"
                    style={{ top: `${(index / (timeSlots.length - 1)) * 100}%` }}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>

            {/* Days Grid */}
            <div className="flex-1 grid grid-cols-7 gap-1.5">
              {weekDays.map((day, dayIndex) => (
                <div key={day.short} className="flex flex-col">
                  {/* Day Header */}
                  <div className="text-center pb-2 border-b border-slate-100">
                    <div className={`text-slate-600 font-medium ${compact ? 'text-xs' : 'text-xs'}`}>
                      {day.short}
                    </div>
                    <div className={`font-bold text-slate-900 ${compact ? 'text-sm' : 'text-base'}`}>
                      {day.date}
                    </div>
                  </div>

                  {/* Time Blocks Container */}
                  <div className="relative h-48 bg-slate-50 rounded-lg mt-2 border border-slate-100">
                    {/* Grid Lines */}
                    <div className="absolute inset-0">
                      {timeSlots.map((_, index) => (
                        <div
                          key={index}
                          className="absolute w-full border-t border-slate-100"
                          style={{ top: `${(index / (timeSlots.length - 1)) * 100}%` }}
                        />
                      ))}
                    </div>

                    {/* Scheduled Blocks */}
                    {schedule
                      .filter(block => block.day === dayIndex)
                      .map((block, blockIndex) => (
                        <div
                          key={blockIndex}
                          className={`absolute left-0.5 right-0.5 rounded-md border ${getBlockColor(block.type)} transition-all hover:scale-105 cursor-pointer`}
                          style={getBlockStyle(block)}
                        >
                          {block.duration >= 2 && (
                            <div className="p-1 flex items-center justify-center h-full">
                              <span className={`text-xs font-medium text-center ${
                                block.type === 'activity' ? 'text-white' : 'text-emerald-700'
                              }`}>
                                {block.title}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-500 border border-emerald-600" />
              <span className="text-slate-600">Scheduled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
              <span className="text-slate-600">Available</span>
            </div>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="bg-emerald-50 border-t border-emerald-100 px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-emerald-900">This week</p>
              <p className="text-emerald-700">3 activities · 4 open slots</p>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-emerald-900">Ready to book</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button className="w-full bg-emerald-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-emerald-700 transition-colors shadow-md">
        Continue Planning
      </button>
    </div>
  );
}
