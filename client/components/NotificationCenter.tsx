/**
 * Notification Center Component
 * Displays user notifications with real-time updates
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { useNotifications, Notification, requestNotificationPermission } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  X,
  Calendar,
  CreditCard,
  Star,
  AlertCircle,
  Info,
  Gift,
  Settings,
  ExternalLink,
  Trash2,
} from 'lucide-react';

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'booking_confirmation':
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case 'new_booking':
      return <BellRing className="h-4 w-4 text-green-500" />;
    case 'payment_success':
      return <CreditCard className="h-4 w-4 text-green-500" />;
    case 'review_request':
      return <Star className="h-4 w-4 text-yellow-500" />;
    case 'system_update':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'welcome':
      return <Gift className="h-4 w-4 text-purple-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const getPriorityColor = (priority: Notification['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const handleAction = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    
    if (notification.action_url) {
      window.open(notification.action_url, '_blank');
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });

  return (
    <div className={`p-4 border-l-4 ${notification.is_read ? 'bg-gray-50 border-gray-300' : 'bg-white border-orange-500'} hover:bg-gray-50 transition-colors`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className={`text-sm font-medium ${notification.is_read ? 'text-gray-600' : 'text-gray-900'}`}>
                {notification.title}
              </h4>
              {!notification.is_read && (
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
              )}
            </div>
            
            <p className={`text-sm ${notification.is_read ? 'text-gray-500' : 'text-gray-700'} leading-relaxed`}>
              {notification.message}
            </p>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">{timeAgo}</span>
              
              <div className="flex items-center space-x-1">
                {notification.action_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAction}
                    className="h-6 px-2 text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Button>
                )}
                
                {!notification.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="h-6 px-2 text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark Read
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(notification.id)}
                  className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotificationCenter() {
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    refreshNotifications 
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);

  const handleEnableBrowserNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      // You could show a success message here
      console.log('Browser notifications enabled');
    }
  };

  if (!user) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative text-gray-600 hover:text-orange-600"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-96 p-0 mr-4" 
        align="end"
        side="bottom"
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    <CheckCheck className="h-4 w-4 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshNotifications}
                  disabled={loading}
                  className="text-xs"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <div className="text-sm text-gray-600">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </div>
            )}
          </CardHeader>
          
          <Separator />
          
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No notifications</h3>
                <p className="text-sm text-gray-600">You're all caught up!</p>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
          
          {notifications.length > 0 && (
            <>
              <Separator />
              <div className="p-3">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>
                    {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                  </span>
                  
                  {'Notification' in window && Notification.permission === 'default' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEnableBrowserNotifications}
                      className="text-xs text-orange-600 hover:text-orange-700"
                    >
                      Enable browser notifications
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  );
}
