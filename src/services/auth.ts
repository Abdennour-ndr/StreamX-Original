import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { DatabaseService } from './database';
import { IUserCreate } from '@/models/User';

const db = new DatabaseService();

export class AuthService {
  async signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  }

  async signUpWithEmail(email: string, password: string): Promise<FirebaseUser> {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user in MongoDB
    const userData: IUserCreate = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || undefined,
      photoURL: user.photoURL || undefined,
      watchHistory: [],
      ratings: [],
      preferences: {
        notifications: true,
        emailUpdates: true,
        autoplay: true,
        language: 'en',
        videoQuality: 'auto',
      },
    };
    await db.createUser(userData);

    return user;
  }

  async signInWithGoogle(): Promise<FirebaseUser> {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);

    // Check if user exists in MongoDB
    const dbUser = await db.getUserByUid(user.uid);
    if (!dbUser) {
      // Create user in MongoDB if they don't exist
      const userData: IUserCreate = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || undefined,
        photoURL: user.photoURL || undefined,
        watchHistory: [],
        ratings: [],
        preferences: {
          notifications: true,
          emailUpdates: true,
          autoplay: true,
          language: 'en',
          videoQuality: 'auto',
        },
      };
      await db.createUser(userData);
    }

    return user;
  }

  async signOut(): Promise<void> {
    await signOut(auth);
  }

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  async updateProfile(displayName?: string, photoURL?: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('No user logged in');

    await updateProfile(user, {
      displayName: displayName || user.displayName,
      photoURL: photoURL || user.photoURL,
    });

    // Update user in MongoDB
    await db.updateUser(user.uid, {
      displayName: displayName || user.displayName || undefined,
      photoURL: photoURL || user.photoURL || undefined,
    });
  }
} 