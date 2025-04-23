import { db } from './config';
import { doc, getDoc } from 'firebase/firestore';

export async function isSuperAdmin(userId: string): Promise<boolean> {
  try {
    const adminDoc = await getDoc(doc(db, 'Admin', userId));
    if (!adminDoc.exists()) {
      return false;
    }
    
    const adminData = adminDoc.data();
    return adminData.role === 'SuperAdmin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function getAdminName(userId: string): Promise<string | null> {
  try {
    const adminDoc = await getDoc(doc(db, 'Admin', userId));
    if (!adminDoc.exists()) {
      return null;
    }
    
    const adminData = adminDoc.data();
    return adminData.name || null;
  } catch (error) {
    console.error('Error getting admin name:', error);
    return null;
  }
} 