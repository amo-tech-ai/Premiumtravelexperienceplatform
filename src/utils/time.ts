/**
 * Time Utility Functions
 * Parsing, formatting, conflict detection, duration calculations
 */

/**
 * Parse time string to Date object
 * Supports formats: "10:00 AM", "2:30 PM", "14:00", "9:00am"
 * 
 * @param timeString - Time in various formats
 * @param baseDate - Optional base date (defaults to today)
 * @returns Date object or null if invalid
 * 
 * @example
 * parseTime("10:00 AM") // Today at 10:00 AM
 * parseTime("2:30 PM", new Date("2024-01-15")) // Jan 15, 2024 at 2:30 PM
 */
export function parseTime(timeString: string, baseDate?: Date): Date | null {
  if (!timeString) return null;

  const base = baseDate || new Date();
  const cleanTime = timeString.trim().toLowerCase();

  // Match patterns: "10:00 AM", "2:30 PM", "14:00"
  const timeRegex = /^(\d{1,2}):(\d{2})\s*(am|pm)?$/i;
  const match = cleanTime.match(timeRegex);

  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3];

  // Validate
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  // Convert 12-hour to 24-hour format
  if (meridiem) {
    if (meridiem === 'pm' && hours !== 12) {
      hours += 12;
    } else if (meridiem === 'am' && hours === 12) {
      hours = 0;
    }
  }

  const result = new Date(base);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/**
 * Format Date to time string
 * 
 * @param date - Date object
 * @param format - "12h" or "24h"
 * @returns Formatted time string
 * 
 * @example
 * formatTime(new Date("2024-01-15 14:30"), "12h") // "2:30 PM"
 * formatTime(new Date("2024-01-15 14:30"), "24h") // "14:30"
 */
export function formatTime(date: Date, format: '12h' | '24h' = '12h'): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (format === '24h') {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // 12-hour format
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Parse duration string to minutes
 * Supports: "2h", "30m", "1.5h", "2h 30m"
 * 
 * @param durationString - Duration in various formats
 * @returns Total minutes
 * 
 * @example
 * parseDuration("2h") // 120
 * parseDuration("1.5h") // 90
 * parseDuration("2h 30m") // 150
 */
export function parseDuration(durationString: string): number {
  if (!durationString) return 0;

  const clean = durationString.toLowerCase().trim();
  let totalMinutes = 0;

  // Match hours: "2h" or "1.5h"
  const hoursMatch = clean.match(/(\d+\.?\d*)\s*h/);
  if (hoursMatch) {
    totalMinutes += parseFloat(hoursMatch[1]) * 60;
  }

  // Match minutes: "30m"
  const minutesMatch = clean.match(/(\d+)\s*m(?!on)/); // Negative lookbehind for "mon"
  if (minutesMatch) {
    totalMinutes += parseInt(minutesMatch[1], 10);
  }

  return totalMinutes;
}

/**
 * Format minutes to duration string
 * 
 * @param minutes - Total minutes
 * @returns Human-readable duration
 * 
 * @example
 * formatDuration(90) // "1.5h"
 * formatDuration(150) // "2h 30m"
 * formatDuration(45) // "45m"
 */
export function formatDuration(minutes: number): string {
  if (minutes === 0) return '0m';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else if (mins === 30) {
    return `${hours}.5h`;
  } else {
    return `${hours}h ${mins}m`;
  }
}

/**
 * Add duration to a time
 * 
 * @param startTime - Start date/time
 * @param durationMinutes - Duration in minutes
 * @returns End date/time
 */
export function addDuration(startTime: Date, durationMinutes: number): Date {
  const result = new Date(startTime);
  result.setMinutes(result.getMinutes() + durationMinutes);
  return result;
}

/**
 * Check if two time ranges overlap
 * 
 * @param start1 - First range start
 * @param end1 - First range end
 * @param start2 - Second range start
 * @param end2 - Second range end
 * @returns True if ranges overlap
 * 
 * @example
 * checkTimeOverlap(
 *   parseTime("10:00 AM"), parseTime("12:00 PM"),
 *   parseTime("11:00 AM"), parseTime("1:00 PM")
 * ) // true (overlaps 11:00-12:00)
 */
export function checkTimeOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && start2 < end1;
}

/**
 * Format time range
 * 
 * @param start - Start time
 * @param end - End time
 * @returns Formatted range string
 * 
 * @example
 * formatTimeRange(
 *   parseTime("10:00 AM"), 
 *   parseTime("12:00 PM")
 * ) // "10:00 AM - 12:00 PM"
 */
export function formatTimeRange(start: Date, end: Date): string {
  return `${formatTime(start)} - ${formatTime(end)}`;
}

/**
 * Calculate time between two times
 * 
 * @param start - Start time
 * @param end - End time
 * @returns Minutes between times
 */
export function getTimeDifference(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}

/**
 * Check if time is valid for a specific day
 * (Not in the past for today, always valid for future days)
 */
export function isValidTime(time: Date, dayDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkDay = new Date(dayDate);
  checkDay.setHours(0, 0, 0, 0);

  // If day is in the future, any time is valid
  if (checkDay > today) return true;

  // If day is today, time must be in the future
  if (checkDay.getTime() === today.getTime()) {
    return time > new Date();
  }

  // Past days are invalid
  return false;
}

/**
 * Round time to nearest interval
 * Useful for scheduling
 * 
 * @param time - Time to round
 * @param intervalMinutes - Interval (default: 15 minutes)
 * @returns Rounded time
 * 
 * @example
 * roundToInterval(parseTime("10:07 AM"), 15) // 10:00 AM
 * roundToInterval(parseTime("10:17 AM"), 15) // 10:15 AM
 */
export function roundToInterval(time: Date, intervalMinutes: number = 15): Date {
  const minutes = time.getMinutes();
  const roundedMinutes = Math.round(minutes / intervalMinutes) * intervalMinutes;
  
  const result = new Date(time);
  result.setMinutes(roundedMinutes, 0, 0);
  
  return result;
}

/**
 * Get available time slots for a day
 * Returns array of potential start times
 * 
 * @param startHour - First available hour (default: 8)
 * @param endHour - Last available hour (default: 22)
 * @param intervalMinutes - Time between slots (default: 30)
 * @returns Array of available times
 */
export function getAvailableSlots(
  dayDate: Date,
  startHour: number = 8,
  endHour: number = 22,
  intervalMinutes: number = 30
): Date[] {
  const slots: Date[] = [];
  const current = new Date(dayDate);
  current.setHours(startHour, 0, 0, 0);

  const end = new Date(dayDate);
  end.setHours(endHour, 0, 0, 0);

  while (current <= end) {
    slots.push(new Date(current));
    current.setMinutes(current.getMinutes() + intervalMinutes);
  }

  return slots;
}

/**
 * Find gaps in a schedule
 * Returns free time slots between activities
 */
export function findGaps(
  items: Array<{ start_time: string; end_time: string }>,
  dayDate: Date,
  minGapMinutes: number = 30
): Array<{ start: Date; end: Date; duration: number }> {
  if (items.length === 0) return [];

  // Parse and sort by start time
  const parsed = items
    .map((item) => ({
      start: parseTime(item.start_time, dayDate),
      end: parseTime(item.end_time, dayDate),
    }))
    .filter((item) => item.start && item.end)
    .sort((a, b) => a.start!.getTime() - b.start!.getTime());

  const gaps: Array<{ start: Date; end: Date; duration: number }> = [];

  for (let i = 0; i < parsed.length - 1; i++) {
    const currentEnd = parsed[i].end!;
    const nextStart = parsed[i + 1].start!;
    const gapMinutes = getTimeDifference(currentEnd, nextStart);

    if (gapMinutes >= minGapMinutes) {
      gaps.push({
        start: currentEnd,
        end: nextStart,
        duration: gapMinutes,
      });
    }
  }

  return gaps;
}

/**
 * Calculate optimal break time between activities
 * Based on travel distance
 * 
 * @param distanceKm - Distance to travel
 * @returns Recommended break time in minutes
 */
export function calculateBreakTime(distanceKm: number): number {
  // Base break: 15 minutes
  const BASE_BREAK = 15;
  
  // Add travel time assuming 5 km/h walking speed
  const WALKING_SPEED = 5;
  const travelTime = (distanceKm / WALKING_SPEED) * 60;
  
  // Round up to nearest 15 minutes
  const totalTime = BASE_BREAK + travelTime;
  return Math.ceil(totalTime / 15) * 15;
}
