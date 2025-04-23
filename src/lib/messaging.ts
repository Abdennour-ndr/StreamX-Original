import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from '@/config/firebase';

const messaging = getMessaging(app);

export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
}

export function onMessageListener() {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
}

export async function subscribeToTopic(token: string, topic: string) {
  try {
    const response = await fetch(`/api/messaging/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, topic }),
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe to topic');
    }

    return true;
  } catch (error) {
    console.error('Error subscribing to topic:', error);
    return false;
  }
} 