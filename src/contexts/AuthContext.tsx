'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously as firebaseSignInAnonymously,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setAdminStatus: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdmin: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  setAdminStatus: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set persistence to LOCAL
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user?.uid);
      setCurrentUser(user);
      
      // التحقق من حالة المسؤول من localStorage
      try {
        const isAdminUser = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(isAdminUser);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
      
      setIsLoading(false);
    });

    // Check if there's a user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // إذا كان البريد الإلكتروني يحتوي على "admin"، نعتبره مسؤولاً
      // (هذا للتبسيط فقط، في التطبيق الحقيقي يجب التحقق من الصلاحيات من قاعدة البيانات)
      const isAdminUser = email.includes('admin');
      setIsAdmin(isAdminUser);
      localStorage.setItem('isAdmin', isAdminUser.toString());
      localStorage.setItem('user', JSON.stringify(userCredential.user));
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('user');
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const setAdminStatus = (status: boolean) => {
    setIsAdmin(status);
    localStorage.setItem('isAdmin', status.toString());
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAdmin,
      isLoading,
      login,
      logout,
      setAdminStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
} 