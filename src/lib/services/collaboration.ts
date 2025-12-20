/**
 * Collaboration Service
 * Real-time collaboration and trip sharing features
 */

export type UserRole = 'owner' | 'editor' | 'viewer';
export type SharePermission = 'view' | 'edit' | 'admin';

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  joinedAt: Date;
  lastActive?: Date;
  isOnline?: boolean;
}

export interface ShareLink {
  id: string;
  tripId: string;
  url: string;
  permission: SharePermission;
  expiresAt?: Date;
  password?: string;
  createdAt: Date;
  accessCount: number;
}

export interface ActivityLog {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  action: string;
  description: string;
  timestamp: Date;
  data?: any;
}

export interface Presence {
  userId: string;
  userName: string;
  avatar?: string;
  cursor?: { x: number; y: number };
  selection?: string; // Item ID they're viewing/editing
  lastSeen: Date;
}

// --- COLLABORATION SERVICE ---

export class CollaborationService {
  private collaborators: Map<string, Collaborator[]> = new Map();
  private shareLinks: Map<string, ShareLink[]> = new Map();
  private activityLogs: Map<string, ActivityLog[]> = new Map();
  private presences: Map<string, Presence[]> = new Map();
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private storageKey = 'local_scout_collaboration';

  constructor() {
    this.loadFromStorage();
    this.setupPresenceTracking();
  }

  /**
   * Load data from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        
        // Restore collaborators
        if (data.collaborators) {
          Object.entries(data.collaborators).forEach(([tripId, collabs]: [string, any]) => {
            this.collaborators.set(
              tripId,
              collabs.map((c: any) => ({
                ...c,
                joinedAt: new Date(c.joinedAt),
                lastActive: c.lastActive ? new Date(c.lastActive) : undefined,
              }))
            );
          });
        }

        // Restore share links
        if (data.shareLinks) {
          Object.entries(data.shareLinks).forEach(([tripId, links]: [string, any]) => {
            this.shareLinks.set(
              tripId,
              links.map((l: any) => ({
                ...l,
                createdAt: new Date(l.createdAt),
                expiresAt: l.expiresAt ? new Date(l.expiresAt) : undefined,
              }))
            );
          });
        }

        // Restore activity logs
        if (data.activityLogs) {
          Object.entries(data.activityLogs).forEach(([tripId, logs]: [string, any]) => {
            this.activityLogs.set(
              tripId,
              logs.map((l: any) => ({
                ...l,
                timestamp: new Date(l.timestamp),
              }))
            );
          });
        }
      }
    } catch (error) {
      console.error('Failed to load collaboration data:', error);
    }
  }

  /**
   * Save data to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = {
        collaborators: Object.fromEntries(this.collaborators),
        shareLinks: Object.fromEntries(this.shareLinks),
        activityLogs: Object.fromEntries(this.activityLogs),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save collaboration data:', error);
    }
  }

  /**
   * Add collaborator to trip
   */
  addCollaborator(tripId: string, collaborator: Omit<Collaborator, 'joinedAt'>): void {
    const collabs = this.collaborators.get(tripId) || [];
    
    const newCollaborator: Collaborator = {
      ...collaborator,
      joinedAt: new Date(),
    };

    collabs.push(newCollaborator);
    this.collaborators.set(tripId, collabs);

    this.logActivity(tripId, 'system', 'System', 'collaborator_added', `${collaborator.name} joined the trip`);
    this.saveToStorage();
    this.notifyListeners(tripId, 'collaborator_added', newCollaborator);
  }

  /**
   * Remove collaborator from trip
   */
  removeCollaborator(tripId: string, collaboratorId: string): void {
    const collabs = this.collaborators.get(tripId) || [];
    const filtered = collabs.filter((c) => c.id !== collaboratorId);
    
    this.collaborators.set(tripId, filtered);
    this.saveToStorage();
    this.notifyListeners(tripId, 'collaborator_removed', collaboratorId);
  }

  /**
   * Update collaborator role
   */
  updateCollaboratorRole(tripId: string, collaboratorId: string, role: UserRole): void {
    const collabs = this.collaborators.get(tripId) || [];
    const collaborator = collabs.find((c) => c.id === collaboratorId);
    
    if (collaborator) {
      collaborator.role = role;
      this.collaborators.set(tripId, collabs);
      this.saveToStorage();
      this.notifyListeners(tripId, 'collaborator_updated', collaborator);
    }
  }

  /**
   * Get collaborators for trip
   */
  getCollaborators(tripId: string): Collaborator[] {
    return this.collaborators.get(tripId) || [];
  }

  /**
   * Create share link
   */
  createShareLink(
    tripId: string,
    permission: SharePermission,
    options?: {
      expiresIn?: number; // milliseconds
      password?: string;
    }
  ): ShareLink {
    const links = this.shareLinks.get(tripId) || [];

    const linkId = this.generateId();
    const shareLink: ShareLink = {
      id: linkId,
      tripId,
      url: `${window.location.origin}/trip/${tripId}/share/${linkId}`,
      permission,
      createdAt: new Date(),
      accessCount: 0,
      expiresAt: options?.expiresIn
        ? new Date(Date.now() + options.expiresIn)
        : undefined,
      password: options?.password,
    };

    links.push(shareLink);
    this.shareLinks.set(tripId, links);

    this.logActivity(tripId, 'system', 'System', 'share_link_created', `Share link created with ${permission} permission`);
    this.saveToStorage();

    return shareLink;
  }

  /**
   * Revoke share link
   */
  revokeShareLink(tripId: string, linkId: string): void {
    const links = this.shareLinks.get(tripId) || [];
    const filtered = links.filter((l) => l.id !== linkId);
    
    this.shareLinks.set(tripId, filtered);
    this.saveToStorage();
  }

  /**
   * Get share links for trip
   */
  getShareLinks(tripId: string): ShareLink[] {
    return (this.shareLinks.get(tripId) || []).filter((link) => {
      // Filter out expired links
      if (link.expiresAt && link.expiresAt < new Date()) {
        return false;
      }
      return true;
    });
  }

  /**
   * Validate share link access
   */
  validateShareLink(
    linkId: string,
    password?: string
  ): { valid: boolean; link?: ShareLink; error?: string } {
    // Find link across all trips
    for (const [tripId, links] of this.shareLinks.entries()) {
      const link = links.find((l) => l.id === linkId);
      
      if (link) {
        // Check expiration
        if (link.expiresAt && link.expiresAt < new Date()) {
          return { valid: false, error: 'Link has expired' };
        }

        // Check password
        if (link.password && link.password !== password) {
          return { valid: false, error: 'Invalid password' };
        }

        // Increment access count
        link.accessCount++;
        this.saveToStorage();

        return { valid: true, link };
      }
    }

    return { valid: false, error: 'Link not found' };
  }

  /**
   * Log activity
   */
  logActivity(
    tripId: string,
    userId: string,
    userName: string,
    action: string,
    description: string,
    data?: any
  ): void {
    const logs = this.activityLogs.get(tripId) || [];

    const log: ActivityLog = {
      id: this.generateId(),
      tripId,
      userId,
      userName,
      action,
      description,
      timestamp: new Date(),
      data,
    };

    logs.unshift(log);

    // Keep last 100 logs
    if (logs.length > 100) {
      logs.splice(100);
    }

    this.activityLogs.set(tripId, logs);
    this.saveToStorage();
    this.notifyListeners(tripId, 'activity_logged', log);
  }

  /**
   * Get activity logs for trip
   */
  getActivityLogs(tripId: string, limit: number = 50): ActivityLog[] {
    const logs = this.activityLogs.get(tripId) || [];
    return logs.slice(0, limit);
  }

  /**
   * Update user presence
   */
  updatePresence(tripId: string, presence: Presence): void {
    const presences = this.presences.get(tripId) || [];
    
    // Remove old presence for this user
    const filtered = presences.filter((p) => p.userId !== presence.userId);
    
    // Add new presence
    filtered.push({
      ...presence,
      lastSeen: new Date(),
    });

    this.presences.set(tripId, filtered);
    this.notifyListeners(tripId, 'presence_updated', presence);
  }

  /**
   * Get active presences for trip
   */
  getPresences(tripId: string): Presence[] {
    const presences = this.presences.get(tripId) || [];
    const now = Date.now();

    // Filter out stale presences (older than 2 minutes)
    return presences.filter((p) => {
      const age = now - p.lastSeen.getTime();
      return age < 2 * 60 * 1000;
    });
  }

  /**
   * Setup presence tracking
   */
  private setupPresenceTracking(): void {
    // Clean up stale presences every 30 seconds
    setInterval(() => {
      for (const [tripId, presences] of this.presences.entries()) {
        const filtered = presences.filter((p) => {
          const age = Date.now() - p.lastSeen.getTime();
          return age < 2 * 60 * 1000;
        });
        this.presences.set(tripId, filtered);
      }
    }, 30000);
  }

  /**
   * Subscribe to collaboration events
   */
  subscribe(
    tripId: string,
    listener: (event: string, data: any) => void
  ): () => void {
    const key = `${tripId}_listeners`;
    const listeners = this.listeners.get(key) || new Set();
    
    const wrapper = (data: any) => listener(data.event, data.data);
    listeners.add(wrapper);
    this.listeners.set(key, listeners);

    return () => {
      listeners.delete(wrapper);
    };
  }

  /**
   * Notify listeners
   */
  private notifyListeners(tripId: string, event: string, data: any): void {
    const key = `${tripId}_listeners`;
    const listeners = this.listeners.get(key);
    
    if (listeners) {
      listeners.forEach((listener) => listener({ event, data }));
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Export collaboration data for trip
   */
  exportData(tripId: string): any {
    return {
      collaborators: this.collaborators.get(tripId) || [],
      shareLinks: this.shareLinks.get(tripId) || [],
      activityLogs: this.activityLogs.get(tripId) || [],
    };
  }
}

// --- SINGLETON ---

let collaborationService: CollaborationService | null = null;

export function getCollaborationService(): CollaborationService {
  if (!collaborationService) {
    collaborationService = new CollaborationService();
  }
  return collaborationService;
}

// --- EXPORTS ---

export default CollaborationService;
