import { io, Socket } from 'socket.io-client';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

class NotificationService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(notification: Notification) => void>> = new Map();

  constructor() {
    this.connect();
  }

  private connect() {
    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to notification server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notification server');
    });

    this.socket.on('notification', (notification: Notification) => {
      this.notifyListeners('notification', notification);
    });
  }

  subscribe(event: string, callback: (notification: Notification) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  unsubscribe(event: string, callback: (notification: Notification) => void) {
    this.listeners.get(event)?.delete(callback);
  }

  private notifyListeners(event: string, notification: Notification) {
    this.listeners.get(event)?.forEach(callback => callback(notification));
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    try {
      const response = await fetch('/api/notifications/unread');
      if (!response.ok) {
        throw new Error('Failed to get unread notifications');
      }
      return response.json();
    } catch (error) {
      console.error('Error getting unread notifications:', error);
      throw error;
    }
  }

  async sendNotification(userId: string, notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<void> {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...notification,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const notificationService = new NotificationService(); 