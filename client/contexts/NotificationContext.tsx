/**
 * Notification Context
 * Manages real-time notifications throughout the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './SupabaseAuthContext';
import { supabase, trackEvent } from '@/lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: 'booking_confirmation' | 'new_booking' | 'payment_success' | 'review_request' | 'system_update' | 'welcome';
  title: string;
  message: string;
  booking_id?: string;
  service_id?: string;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high';
  action_url?: string;
  created_at: string;
  updated_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'user_id' | 'is_read' | 'created_at' | 'updated_at'>) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotifications();
      setupRealtimeSubscription();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, user]);

  // Update unread count when notifications change
  useEffect(() => {
    const unread = notifications.filter(n => !n.is_read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading notifications:', error);
        return;
      }

      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const subscription = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Notification update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
            
            // Show browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(newNotification.title, {
                body: newNotification.message,
                icon: '/coastalconnect-logo.svg',
                tag: newNotification.id,
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedNotification = payload.new as Notification;
            setNotifications(prev =>
              prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setNotifications(prev => prev.filter(n => n.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const addNotification = async (notificationData: Omit<Notification, 'id' | 'user_id' | 'is_read' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([
          {
            ...notificationData,
            user_id: user.id,
            is_read: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        return;
      }

      // Track notification creation
      await trackEvent('notification_created', {
        notification_id: data.id,
        user_id: user.id,
        type: notificationData.type,
        priority: notificationData.priority,
      });

    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      // Track notification read
      await trackEvent('notification_read', {
        notification_id: notificationId,
        user_id: user?.id,
      });

    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      // Track bulk read action
      await trackEvent('notifications_mark_all_read', {
        user_id: user.id,
        count: unreadCount,
      });

    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Error deleting notification:', error);
        return;
      }

      // Track notification deletion
      await trackEvent('notification_deleted', {
        notification_id: notificationId,
        user_id: user?.id,
      });

    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const refreshNotifications = async () => {
    await loadNotifications();
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Browser notification permission helper
export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return Notification.permission === 'granted';
};
