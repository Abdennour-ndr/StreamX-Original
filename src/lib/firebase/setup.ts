import { auth, db } from './config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export async function setupSuperAdmin(email: string, password: string, displayName: string) {
  try {
    // Validate input
    if (!email || !password || !displayName) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create the user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      displayName: displayName,
      role: 'superadmin',
      createdAt: new Date().toISOString()
    });

    console.log('Superadmin created successfully:', user.uid);
    return user;
  } catch (error: any) {
    console.error('Error creating superadmin:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered. Please use a different email.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Please enter a valid email address.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Please use a stronger password.');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Email/password accounts are not enabled. Please contact support.');
    } else {
      throw new Error(`Failed to create superadmin account: ${error.message}`);
    }
  }
} 