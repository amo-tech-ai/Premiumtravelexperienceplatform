/**
 * CONFLICT DETECTION ENGINE
 * 
 * Detects scheduling and logical conflicts across all trip entities:
 * - Time overlaps
 * - Travel time conflicts
 * - Location distance issues
 * - Budget conflicts
 * - Availability conflicts
 */

import {
  TripEntity,
  TripDay,
  ScheduleConflict,
  Location,
  Restaurant,
  Event,
  Destination,
  Activity,
  Travel
} from './types/TripTypes';

// ============================================================================
// CONFLICT DETECTOR CLASS
// ============================================================================

export class ConflictDetector {
  
  /**
   * Check for conflicts when adding a new entity
   */
  detectConflicts(
    newEntity: TripEntity,
    existingDay: TripDay,
    options: ConflictDetectionOptions = {}
  ): ScheduleConflict[] {
    const conflicts: ScheduleConflict[] = [];

    // Time-based conflicts
    if (this.hasTimeInfo(newEntity)) {
      conflicts.push(...this.detectTimeConflicts(newEntity, existingDay));
      conflicts.push(...this.detectTravelTimeConflicts(newEntity, existingDay));
    }

    // Location-based conflicts
    if (newEntity.location) {
      conflicts.push(...this.detectLocationConflicts(newEntity, existingDay, options));
    }

    // Availability conflicts
    conflicts.push(...this.detectAvailabilityConflicts(newEntity));

    // Budget conflicts (checked at trip level, not day level)
    // This is handled by BudgetTracker

    return conflicts;
  }

  /**
   * Detect time overlap conflicts
   */
  private detectTimeConflicts(
    newEntity: TripEntity,
    day: TripDay
  ): ScheduleConflict[] {
    const conflicts: ScheduleConflict[] = [];
    
    const newStart = this.getStartTime(newEntity);
    const newEnd = this.getEndTime(newEntity);
    
    if (!newStart || !newEnd) return conflicts;

    // Check against all existing items
    day.items.forEach(existing => {
      const existingStart = this.getStartTime(existing);
      const existingEnd = this.getEndTime(existing);
      
      if (!existingStart || !existingEnd) return;

      // Check for overlap
      if (this.doTimesOverlap(newStart, newEnd, existingStart, existingEnd)) {
        const overlap = this.calculateOverlap(newStart, newEnd, existingStart, existingEnd);
        
        conflicts.push({
          id: `conflict-time-${Date.now()}`,
          type: 'overlap',
          severity: overlap > 30 ? 'blocking' : overlap > 15 ? 'major' : 'minor',
          conflictingItems: [existing.id],
          message: `Time conflict with "${existing.name}". Overlaps by ${overlap} minutes.`,
          suggestions: [
            `Reschedule "${newEntity.name}" to after ${this.formatTime(existingEnd)}`,
            `Shorten "${existing.name}" duration`,
            `Move "${existing.name}" to different time slot`
          ],
          autoResolvable: overlap <= 15
        });
      }

      // Check for tight timing (less than 15 min buffer)
      else if (this.isTightTiming(newStart, newEnd, existingStart, existingEnd)) {
        conflicts.push({
          id: `conflict-tight-${Date.now()}`,
          type: 'tight_timing',
          severity: 'minor',
          conflictingItems: [existing.id],
          message: `Very tight timing with "${existing.name}". Consider adding buffer time.`,
          suggestions: [
            'Add 15-30 minute buffer between activities',
            'Allow extra time for transitions'
          ],
          autoResolvable: true
        });
      }
    });

    return conflicts;
  }

  /**
   * Detect travel time conflicts
   */
  private detectTravelTimeConflicts(
    newEntity: TripEntity,
    day: TripDay
  ): ScheduleConflict[] {
    const conflicts: ScheduleConflict[] = [];
    
    const newStart = this.getStartTime(newEntity);
    if (!newStart || !newEntity.location) return conflicts;

    // Find the previous activity
    const previousActivity = this.findPreviousActivity(newEntity, day);
    if (!previousActivity || !previousActivity.location) return conflicts;

    const previousEnd = this.getEndTime(previousActivity);
    if (!previousEnd) return conflicts;

    // Calculate travel time needed
    const travelTime = this.estimateTravelTime(
      previousActivity.location,
      newEntity.location
    );

    const timeAvailable = (newStart.getTime() - previousEnd.getTime()) / (1000 * 60);

    if (timeAvailable < travelTime) {
      const shortage = travelTime - timeAvailable;
      
      conflicts.push({
        id: `conflict-travel-${Date.now()}`,
        type: 'travel_time',
        severity: shortage > 30 ? 'blocking' : shortage > 15 ? 'major' : 'minor',
        conflictingItems: [previousActivity.id],
        message: `Not enough travel time from "${previousActivity.name}". Need ${Math.ceil(travelTime)} min, have ${Math.floor(timeAvailable)} min.`,
        suggestions: [
          `Start "${newEntity.name}" ${Math.ceil(shortage)} minutes later`,
          `End "${previousActivity.name}" ${Math.ceil(shortage)} minutes earlier`,
          `Use faster transportation (taxi instead of walking)`
        ],
        autoResolvable: shortage <= 10
      });
    }

    return conflicts;
  }

  /**
   * Detect location-based conflicts
   */
  private detectLocationConflicts(
    newEntity: TripEntity,
    day: TripDay,
    options: ConflictDetectionOptions
  ): ScheduleConflict[] {
    const conflicts: ScheduleConflict[] = [];
    
    if (!newEntity.location || !options.maxTravelDistance) return conflicts;

    // Check if location is too far from other activities
    day.items.forEach(existing => {
      if (!existing.location) return;

      const distance = this.calculateDistance(
        newEntity.location!,
        existing.location
      );

      if (distance > options.maxTravelDistance!) {
        conflicts.push({
          id: `conflict-distance-${Date.now()}`,
          type: 'location_distance',
          severity: 'minor',
          conflictingItems: [existing.id],
          message: `"${newEntity.name}" is ${(distance / 1000).toFixed(1)} km from "${existing.name}". Consider grouping nearby activities.`,
          suggestions: [
            'Group activities by neighborhood',
            'Add transportation time to schedule',
            'Consider alternative locations'
          ],
          autoResolvable: false
        });
      }
    });

    return conflicts;
  }

  /**
   * Detect availability conflicts
   */
  private detectAvailabilityConflicts(entity: TripEntity): ScheduleConflict[] {
    const conflicts: ScheduleConflict[] = [];

    // Restaurant availability
    if (entity.type === 'restaurant') {
      const restaurant = entity as Restaurant;
      if (restaurant.currentStatus === 'closed') {
        conflicts.push({
          id: `conflict-closed-${Date.now()}`,
          type: 'closed',
          severity: 'blocking',
          conflictingItems: [entity.id],
          message: `"${restaurant.name}" is closed at the selected time.`,
          suggestions: [
            'Choose a different time when restaurant is open',
            'Select alternative restaurant'
          ],
          autoResolvable: false
        });
      }
    }

    // Event availability
    if (entity.type === 'event') {
      const event = entity as Event;
      if (event.ticketAvailability === 'sold_out') {
        conflicts.push({
          id: `conflict-soldout-${Date.now()}`,
          type: 'fully_booked',
          severity: 'blocking',
          conflictingItems: [entity.id],
          message: `"${event.name}" is sold out.`,
          suggestions: [
            'Join waitlist if available',
            'Look for similar events',
            'Choose alternative date'
          ],
          autoResolvable: false
        });
      }
    }

    return conflicts;
  }

  /**
   * Auto-resolve conflicts when possible
   */
  autoResolveConflicts(
    conflicts: ScheduleConflict[],
    entity: TripEntity,
    day: TripDay
  ): { resolved: boolean; updatedEntity?: TripEntity; message: string } {
    const resolvable = conflicts.filter(c => c.autoResolvable);
    
    if (resolvable.length === 0) {
      return {
        resolved: false,
        message: 'No auto-resolvable conflicts found.'
      };
    }

    // Try to resolve time conflicts by shifting start time
    const timeConflict = resolvable.find(c => c.type === 'overlap' || c.type === 'tight_timing');
    if (timeConflict && this.hasTimeInfo(entity)) {
      const conflictingEntity = day.items.find(i => i.id === timeConflict.conflictingItems[0]);
      if (conflictingEntity) {
        const conflictEnd = this.getEndTime(conflictingEntity);
        if (conflictEnd) {
          // Add 15 minute buffer
          const newStart = new Date(conflictEnd.getTime() + 15 * 60 * 1000);
          
          const updatedEntity = this.updateStartTime(entity, newStart);
          
          return {
            resolved: true,
            updatedEntity,
            message: `Rescheduled to ${this.formatTime(newStart)} to avoid conflict.`
          };
        }
      }
    }

    return {
      resolved: false,
      message: 'Could not auto-resolve conflicts.'
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private hasTimeInfo(entity: TripEntity): boolean {
    return !!(
      ('startTime' in entity && entity.startTime) ||
      ('reservationTime' in entity && entity.reservationTime) ||
      ('visitTime' in entity && entity.visitTime)
    );
  }

  private getStartTime(entity: TripEntity): Date | null {
    if ('startTime' in entity && entity.startTime) return entity.startTime;
    if ('reservationTime' in entity && entity.reservationTime) return entity.reservationTime;
    if ('visitTime' in entity && entity.visitTime) return entity.visitTime;
    if ('departureTime' in entity && entity.departureTime) return entity.departureTime;
    return null;
  }

  private getEndTime(entity: TripEntity): Date | null {
    const start = this.getStartTime(entity);
    if (!start) return null;

    let duration = 0;
    if ('duration' in entity && entity.duration) {
      duration = entity.duration;
    } else if ('estimatedDuration' in entity && entity.estimatedDuration) {
      duration = entity.estimatedDuration;
    } else {
      // Default durations by type
      if (entity.type === 'restaurant') duration = 90; // 1.5 hours
      else if (entity.type === 'event') duration = 120; // 2 hours
      else if (entity.type === 'destination') duration = 60; // 1 hour
      else duration = 30; // Default 30 min
    }

    return new Date(start.getTime() + duration * 60 * 1000);
  }

  private doTimesOverlap(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): boolean {
    return start1 < end2 && end1 > start2;
  }

  private calculateOverlap(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): number {
    const overlapStart = Math.max(start1.getTime(), start2.getTime());
    const overlapEnd = Math.min(end1.getTime(), end2.getTime());
    return Math.max(0, (overlapEnd - overlapStart) / (1000 * 60));
  }

  private isTightTiming(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): boolean {
    const gap1 = (start2.getTime() - end1.getTime()) / (1000 * 60);
    const gap2 = (start1.getTime() - end2.getTime()) / (1000 * 60);
    return (gap1 > 0 && gap1 < 15) || (gap2 > 0 && gap2 < 15);
  }

  private findPreviousActivity(
    entity: TripEntity,
    day: TripDay
  ): TripEntity | null {
    const entityStart = this.getStartTime(entity);
    if (!entityStart) return null;

    let previous: TripEntity | null = null;
    let previousEnd: Date | null = null;

    day.items.forEach(item => {
      const itemEnd = this.getEndTime(item);
      if (itemEnd && itemEnd <= entityStart) {
        if (!previousEnd || itemEnd > previousEnd) {
          previous = item;
          previousEnd = itemEnd;
        }
      }
    });

    return previous;
  }

  private estimateTravelTime(from: Location, to: Location): number {
    const distance = this.calculateDistance(from, to);
    
    // Rough estimates:
    // Walking: 5 km/h = 83 m/min
    // Driving: 30 km/h (city) = 500 m/min
    
    const walkingTime = distance / 83;
    const drivingTime = distance / 500;
    
    // Use walking for short distances, driving for longer
    return distance < 1000 ? walkingTime : Math.min(walkingTime, drivingTime + 10);
  }

  private calculateDistance(loc1: Location, loc2: Location): number {
    if (loc1.coordinates && loc2.coordinates) {
      return this.haversineDistance(
        loc1.coordinates.lat,
        loc1.coordinates.lng,
        loc2.coordinates.lat,
        loc2.coordinates.lng
      );
    }
    
    // Fallback: estimate based on neighborhood
    if (loc1.neighborhood === loc2.neighborhood) return 500; // 500m
    return 3000; // 3km default
  }

  private haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private updateStartTime(entity: TripEntity, newStart: Date): TripEntity {
    if ('startTime' in entity) {
      return { ...entity, startTime: newStart };
    }
    if ('reservationTime' in entity) {
      return { ...entity, reservationTime: newStart };
    }
    if ('visitTime' in entity) {
      return { ...entity, visitTime: newStart };
    }
    return entity;
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }
}

// ============================================================================
// TYPES
// ============================================================================

export interface ConflictDetectionOptions {
  maxTravelDistance?: number; // meters
  minBufferTime?: number; // minutes
  strictMode?: boolean;
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const conflictDetector = new ConflictDetector();
