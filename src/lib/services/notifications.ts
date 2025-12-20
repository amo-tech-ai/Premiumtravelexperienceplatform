/**
 * Notifications Service
 * Production-ready notification system with multiple channels
 */

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
export type NotificationCategory =
  | 'itinerary'
  | 'booking'
  | 'budget'
  | 'ai_suggestion'
  | 'collaboration'
  | 'reminder';

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  data?: any;
}

export interface NotificationPreferences {
  enabled: boolean;
  browserNotifications: boolean;
  emailNotifications: boolean;
  categories: Record<NotificationCategory, boolean>;
  quietHours?: {
    enabled: boolean;
    start: string; // "22:00"
    end: string; // "08:00"
  };
}

// --- NOTIFICATION SERVICE ---

export class NotificationService {
  private notifications: Notification[] = [];
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private preferences: NotificationPreferences;
  private storageKey = 'local_scout_notifications';
  private preferencesKey = 'local_scout_notification_preferences';

  constructor() {
    this.loadNotifications();
    this.preferences = this.loadPreferences();
  }

  /**
   * Load notifications from localStorage
   */
  private loadNotifications(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.notifications = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  /**
   * Save notifications to localStorage
   */
  private saveNotifications(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  /**
   * Load preferences from localStorage
   */
  private loadPreferences(): NotificationPreferences {
    try {
      const stored = localStorage.getItem(this.preferencesKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    }

    // Default preferences
    return {
      enabled: true,
      browserNotifications: false, // Require explicit permission
      emailNotifications: false,
      categories: {
        itinerary: true,
        booking: true,
        budget: true,
        ai_suggestion: true,
        collaboration: true,
        reminder: true,
      },
    };
  }

  /**
   * Save preferences to localStorage
   */
  savePreferences(preferences: NotificationPreferences): void {
    this.preferences = preferences;
    try {
      localStorage.setItem(this.preferencesKey, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    }
  }

  /**
   * Get current preferences
   */
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  /**
   * Request browser notification permission
   */
  async requestBrowserPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.preferences.browserNotifications = true;
      this.savePreferences(this.preferences);
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.preferences.browserNotifications = true;
        this.savePreferences(this.preferences);
        return true;
      }
    }

    return false;
  }

  /**
   * Check if we're in quiet hours
   */
  private isQuietHours(): boolean {
    if (!this.preferences.quietHours?.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const { start, end } = this.preferences.quietHours;

    if (start < end) {
      // Normal case: e.g., 22:00 - 08:00 next day
      return currentTime >= start || currentTime < end;
    } else {
      // Crosses midnight: e.g., 22:00 - 08:00
      return currentTime >= start && currentTime < end;
    }
  }

  /**
   * Send a notification
   */
  send(
    title: string,
    message: string,
    category: NotificationCategory,
    options?: {
      priority?: NotificationPriority;
      actionUrl?: string;
      actionLabel?: string;
      data?: any;
    }
  ): Notification {
    // Check if notifications are enabled for this category
    if (!this.preferences.enabled || !this.preferences.categories[category]) {
      console.log('Notification blocked by preferences:', category);
      return {
        id: '',
        title,
        message,
        category,
        priority: options?.priority || 'normal',
        timestamp: new Date(),
        read: true,
      };
    }

    // Create notification
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      category,
      priority: options?.priority || 'normal',
      timestamp: new Date(),
      read: false,
      actionUrl: options?.actionUrl,
      actionLabel: options?.actionLabel,
      data: options?.data,
    };

    // Add to list
    this.notifications.unshift(notification);

    // Limit to last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    this.saveNotifications();

    // Send browser notification if enabled and not in quiet hours
    if (
      this.preferences.browserNotifications &&
      !this.isQuietHours() &&
      (options?.priority === 'high' || options?.priority === 'urgent')
    ) {
      this.sendBrowserNotification(notification);
    }

    return notification;
  }

  /**
   * Send browser notification
   */
  private sendBrowserNotification(notification: Notification): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    try {
      const browserNotif = new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192.png', // Assumes PWA icon
        badge: '/badge-72.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent',
      });

      browserNotif.onclick = () => {
        if (notification.actionUrl) {
          window.focus();
          window.location.href = notification.actionUrl;
        }
        browserNotif.close();
      };
    } catch (error) {
      console.error('Failed to send browser notification:', error);
    }
  }

  /**
   * Get all notifications
   */
  getAll(): Notification[] {
    return [...this.notifications];
  }

  /**
   * Get unread count
   */
  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  /**
   * Mark as read
   */
  markAsRead(id: string): void {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  /**
   * Mark all as read
   */
  markAllAsRead(): void {
    this.notifications.forEach((n) => {
      n.read = true;
    });
    this.saveNotifications();
  }

  /**
   * Delete notification
   */
  delete(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.saveNotifications();
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications = [];
    this.saveNotifications();
  }

  /**
   * Subscribe to notification updates
   */
  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.add(listener);

    // Call immediately with current state
    listener([...this.notifications]);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    const notifications = [...this.notifications];
    this.listeners.forEach((listener) => listener(notifications));
  }
}

// --- SINGLETON ---

let notificationService: NotificationService | null = null;

export function getNotificationService(): NotificationService {
  if (!notificationService) {
    notificationService = new NotificationService();
  }
  return notificationService;
}

// --- HELPER FUNCTIONS ---

/**
 * Schedule a notification for later
 */
export function scheduleNotification(
  title: string,
  message: string,
  category: NotificationCategory,
  scheduleTime: Date,
  options?: {
    priority?: NotificationPriority;
    actionUrl?: string;
    actionLabel?: string;
    data?: any;
  }
): void {
  const delay = scheduleTime.getTime() - Date.now();

  if (delay <= 0) {
    // Send immediately
    getNotificationService().send(title, message, category, options);
  } else {
    // Schedule for later
    setTimeout(() => {
      getNotificationService().send(title, message, category, options);
    }, delay);
  }
}

/**
 * Send reminder notification for itinerary item
 */
export function sendItineraryReminder(
  itemTitle: string,
  itemTime: Date,
  minutesBefore: number = 30
): void {
  const reminderTime = new Date(itemTime.getTime() - minutesBefore * 60 * 1000);

  scheduleNotification(
    'Upcoming Activity',
    `${itemTitle} starts in ${minutesBefore} minutes`,
    'reminder',
    reminderTime,
    {
      priority: 'high',
      actionUrl: '/itinerary',
      actionLabel: 'View Itinerary',
    }
  );
}

// --- EXPORTS ---

export default NotificationService;
