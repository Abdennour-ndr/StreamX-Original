import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
  }),
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID
};

// Initialize Firebase Admin if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];

// Initialize Firebase Admin services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
export const admin = app; 