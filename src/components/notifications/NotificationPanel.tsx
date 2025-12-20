/**
 * Notification Panel
 * Display and manage user notifications
 */

import React, { useEffect, useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, X, Settings } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { motion, AnimatePresence } from 'motion/react';
import { getNotificationService, Notification } from '../../lib/services/notifications';
import { formatDistanceToNow } from '../../utils/formatting';

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState(getNotificationService().getPreferences());

  useEffect(() => {
    const service = getNotificationService();

    // Subscribe to notifications
    const unsubscribe = service.subscribe((notifications) => {
      setNotifications(notifications);
      setUnreadCount(service.getUnreadCount());
    });

    return unsubscribe;
  }, []);

  const handleMarkAsRead = (id: string) => {
    getNotificationService().markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    getNotificationService().markAllAsRead();
  };

  const handleDelete = (id: string) => {
    getNotificationService().delete(id);
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all notifications?')) {
      getNotificationService().clearAll();
    }
  };

  const handleToggleCategory = (category: string) => {
    const newPreferences = {
      ...preferences,
      categories: {
        ...preferences.categories,
        [category]: !preferences.categories[category as keyof typeof preferences.categories],
      },
    };
    setPreferences(newPreferences);
    getNotificationService().savePreferences(newPreferences);
  };

  const handleRequestPermission = async () => {
    const granted = await getNotificationService().requestBrowserPermission();
    if (granted) {
      setPreferences(getNotificationService().getPreferences());
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      itinerary: '📅',
      booking: '🎫',
      budget: '💰',
      ai_suggestion: '✨',
      collaboration: '👥',
      reminder: '⏰',
    };
    return icons[category] || '📬';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-slate-100 text-slate-700',
      normal: 'bg-blue-100 text-blue-700',
      high: 'bg-amber-100 text-amber-700',
      urgent: 'bg-red-100 text-red-700',
    };
    return colors[priority] || colors.normal;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-sm text-slate-500">
                  ({unreadCount} unread)
                </span>
              )}
            </SheetTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                className="h-8 w-8"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <AnimatePresence mode="wait">
          {showSettings ? (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-6 space-y-6"
            >
              <div>
                <h3 className="font-medium mb-4">Notification Settings</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="browser-notifications">Browser Notifications</Label>
                    {preferences.browserNotifications ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Enabled
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRequestPermission}
                      >
                        Enable
                      </Button>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Categories</p>
                    
                    {Object.entries(preferences.categories).map(([category, enabled]) => (
                      <div key={category} className="flex items-center justify-between">
                        <Label
                          htmlFor={category}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <span>{getCategoryIcon(category)}</span>
                          <span className="capitalize">
                            {category.replace('_', ' ')}
                          </span>
                        </Label>
                        <Switch
                          id={category}
                          checked={enabled}
                          onCheckedChange={() => handleToggleCategory(category)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="w-full"
              >
                Back to Notifications
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mt-6"
            >
              {notifications.length > 0 && (
                <div className="flex gap-2 mb-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                    className="flex-1"
                  >
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Mark All Read
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleClearAll}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              )}

              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2">
                  <AnimatePresence>
                    {notifications.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                      >
                        <Bell className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-slate-500">No notifications</p>
                        <p className="text-sm text-slate-400 mt-1">
                          You're all caught up!
                        </p>
                      </motion.div>
                    ) : (
                      notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className={`relative group rounded-lg border p-4 ${
                            notification.read
                              ? 'bg-white'
                              : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="text-2xl mt-1">
                              {getCategoryIcon(notification.category)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="font-medium text-sm">
                                  {notification.title}
                                </h4>
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${getPriorityColor(
                                    notification.priority
                                  )}`}
                                >
                                  {notification.priority}
                                </Badge>
                              </div>

                              <p className="text-sm text-slate-600 mb-2">
                                {notification.message}
                              </p>

                              <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-400">
                                  {formatDistanceToNow(notification.timestamp)}
                                </p>

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {!notification.read && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleMarkAsRead(notification.id)}
                                      className="h-7 px-2"
                                    >
                                      <Check className="w-3 h-3 mr-1" />
                                      Mark Read
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDelete(notification.id)}
                                    className="h-7 w-7 p-0"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>

                              {notification.actionUrl && (
                                <Button
                                  size="sm"
                                  variant="link"
                                  className="mt-2 h-auto p-0 text-violet-600"
                                  onClick={() => {
                                    window.location.href = notification.actionUrl!;
                                    handleMarkAsRead(notification.id);
                                  }}
                                >
                                  {notification.actionLabel || 'View Details'} →
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}

export default NotificationPanel;
