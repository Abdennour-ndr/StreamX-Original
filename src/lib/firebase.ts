import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// تكوين Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// تجنب تهيئة Firebase متعددة
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// تهيئة خدمات Firebase
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// استيراد وتصدير لملف التكوين
export { app, db, auth, storage };

// Helper functions for Firestore
export const getCollection = (collectionName: string) => {
  return db.collection(collectionName);
};

export const getDocument = (collectionName: string, documentId: string) => {
  return db.collection(collectionName).doc(documentId);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const isUserAdmin = async (userId: string) => {
  if (!userId) return false;
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    return userData?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}; 