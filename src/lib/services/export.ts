/**
 * Export Service
 * Production-ready export functionality for trips, itineraries, and calendars
 */

import { TripDay, TripItem } from '../../components/trip-details/TripDetailsContext';

// --- TYPES ---

export interface ExportOptions {
  format: 'pdf' | 'ical' | 'json' | 'csv';
  includeImages?: boolean;
  includeNotes?: boolean;
  includeBudget?: boolean;
}

export interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  url?: string;
}

// --- iCalendar Export ---

/**
 * Generate iCalendar (.ics) file from trip data
 */
export function generateICalendar(
  tripName: string,
  tripDates: { start: Date; end: Date },
  days: TripDay[],
  tripId?: string
): string {
  const events: CalendarEvent[] = [];

  // Convert trip items to calendar events
  days.forEach((day, dayIndex) => {
    const dayDate = new Date(tripDates.start);
    dayDate.setDate(dayDate.getDate() + dayIndex);

    day.items.forEach((item) => {
      if (!item.time || item.time === 'TBD') {
        return; // Skip items without time
      }

      const { startTime, endTime } = parseTimeRange(dayDate, item.time, item.duration);

      events.push({
        title: item.title,
        description: item.notes || item.description || '',
        location: item.location || '',
        startTime,
        endTime,
        url: item.url,
      });
    });
  });

  return createICalendarFile(tripName, events);
}

/**
 * Create iCalendar file content
 */
function createICalendarFile(calendarName: string, events: CalendarEvent[]): string {
  const lines: string[] = [];

  // Header
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//Local Scout//Trip Planner//EN');
  lines.push(`X-WR-CALNAME:${escapeICalValue(calendarName)}`);
  lines.push('X-WR-TIMEZONE:America/Bogota');
  lines.push('CALSCALE:GREGORIAN');

  // Events
  events.forEach((event, index) => {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${generateUID(index)}`);
    lines.push(`DTSTAMP:${formatICalDate(new Date())}`);
    lines.push(`DTSTART:${formatICalDate(event.startTime)}`);
    lines.push(`DTEND:${formatICalDate(event.endTime)}`);
    lines.push(`SUMMARY:${escapeICalValue(event.title)}`);

    if (event.description) {
      lines.push(`DESCRIPTION:${escapeICalValue(event.description)}`);
    }

    if (event.location) {
      lines.push(`LOCATION:${escapeICalValue(event.location)}`);
    }

    if (event.url) {
      lines.push(`URL:${event.url}`);
    }

    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  });

  // Footer
  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

/**
 * Format date for iCalendar (ISO 8601 format: YYYYMMDDTHHmmss)
 */
function formatICalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Escape special characters for iCalendar format
 */
function escapeICalValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generate unique ID for event
 */
function generateUID(index: number): string {
  const timestamp = Date.now();
  return `${timestamp}-${index}@localscout.app`;
}

/**
 * Parse time and duration to get start/end times
 */
function parseTimeRange(
  date: Date,
  timeStr: string,
  duration?: string
): { startTime: Date; endTime: Date } {
  const startTime = new Date(date);

  // Parse time (supports "10:00 AM", "14:00", etc.)
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);

  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const meridiem = timeMatch[3]?.toUpperCase();

    if (meridiem === 'PM' && hours < 12) {
      hours += 12;
    } else if (meridiem === 'AM' && hours === 12) {
      hours = 0;
    }

    startTime.setHours(hours, minutes, 0, 0);
  }

  // Parse duration (supports "2h", "30m", "1h 30m", etc.)
  let durationMinutes = 60; // Default 1 hour

  if (duration) {
    const hourMatch = duration.match(/(\d+)\s*h/i);
    const minuteMatch = duration.match(/(\d+)\s*m/i);

    durationMinutes = 0;
    if (hourMatch) durationMinutes += parseInt(hourMatch[1]) * 60;
    if (minuteMatch) durationMinutes += parseInt(minuteMatch[1]);
    if (durationMinutes === 0) durationMinutes = 60; // Fallback
  }

  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + durationMinutes);

  return { startTime, endTime };
}

// --- JSON Export ---

/**
 * Export trip as JSON
 */
export function exportAsJSON(tripData: any): string {
  return JSON.stringify(tripData, null, 2);
}

// --- CSV Export ---

/**
 * Export itinerary as CSV
 */
export function exportAsCSV(days: TripDay[]): string {
  const headers = ['Day', 'Time', 'Title', 'Type', 'Duration', 'Location', 'Cost', 'Status', 'Notes'];
  const rows: string[][] = [headers];

  days.forEach((day, dayIndex) => {
    day.items.forEach((item) => {
      rows.push([
        `Day ${dayIndex + 1}`,
        item.time || 'TBD',
        item.title,
        item.type || '',
        item.duration || '',
        item.location || '',
        item.cost?.toString() || '0',
        item.status || '',
        item.notes || item.description || '',
      ]);
    });
  });

  return rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
}

// --- Download Helpers ---

/**
 * Trigger file download in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download trip as iCalendar file
 */
export function downloadICalendar(
  tripName: string,
  tripDates: { start: Date; end: Date },
  days: TripDay[]
): void {
  const icsContent = generateICalendar(tripName, tripDates, days);
  const filename = `${tripName.replace(/[^a-z0-9]/gi, '-')}.ics`;
  downloadFile(icsContent, filename, 'text/calendar');
}

/**
 * Download trip as JSON
 */
export function downloadJSON(tripData: any, tripName: string): void {
  const jsonContent = exportAsJSON(tripData);
  const filename = `${tripName.replace(/[^a-z0-9]/gi, '-')}.json`;
  downloadFile(jsonContent, filename, 'application/json');
}

/**
 * Download itinerary as CSV
 */
export function downloadCSV(days: TripDay[], tripName: string): void {
  const csvContent = exportAsCSV(days);
  const filename = `${tripName.replace(/[^a-z0-9]/gi, '-')}-itinerary.csv`;
  downloadFile(csvContent, filename, 'text/csv');
}

// --- Share/Copy Helpers ---

/**
 * Copy trip link to clipboard
 */
export async function copyTripLink(tripId: string): Promise<void> {
  const url = `${window.location.origin}/trip/${tripId}`;

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(url);
  } else {
    // Fallback for older browsers
    const input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}

/**
 * Share trip using Web Share API (mobile-friendly)
 */
export async function shareTripNative(tripName: string, tripId: string): Promise<void> {
  const url = `${window.location.origin}/trip/${tripId}`;

  if (navigator.share) {
    await navigator.share({
      title: tripName,
      text: `Check out my trip: ${tripName}`,
      url,
    });
  } else {
    // Fallback to copy link
    await copyTripLink(tripId);
    throw new Error('FALLBACK_COPY'); // Signal to show "Link copied" message
  }
}

// --- Print Helper ---

/**
 * Prepare page for printing and trigger print dialog
 */
export function printTrip(): void {
  // Add print-specific styles
  const style = document.createElement('style');
  style.id = 'print-styles';
  style.textContent = `
    @media print {
      @page {
        margin: 1cm;
      }
      
      /* Hide non-essential elements */
      nav, .no-print, button, .print-hide {
        display: none !important;
      }
      
      /* Expand containers */
      .print-expand {
        max-height: none !important;
        overflow: visible !important;
      }
      
      /* Prevent page breaks inside items */
      .print-no-break {
        page-break-inside: avoid;
      }
      
      /* Adjust colors for print */
      .bg-gradient-to-br,
      .bg-gradient-to-r {
        background: white !important;
        color: black !important;
      }
      
      /* Show images properly */
      img {
        max-width: 100% !important;
        page-break-inside: avoid;
      }
    }
  `;

  document.head.appendChild(style);

  // Trigger print
  window.print();

  // Cleanup after print (or cancel)
  window.addEventListener(
    'afterprint',
    () => {
      const styleEl = document.getElementById('print-styles');
      if (styleEl) {
        styleEl.remove();
      }
    },
    { once: true }
  );
}

// --- Export All ---

export const ExportService = {
  generateICalendar,
  exportAsJSON,
  exportAsCSV,
  downloadICalendar,
  downloadJSON,
  downloadCSV,
  copyTripLink,
  shareTripNative,
  printTrip,
};

export default ExportService;
