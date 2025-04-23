import React, { createContext, useContext } from 'react';
import { DatabaseService } from '@/services/database';
import { StripeService, PLANS } from '@/services/stripe';
import { IUser } from '@/models/User';
import { IContent } from '@/models/Content';

interface DatabaseContextType {
  // User operations
  createUser: (userData: IUser) => Promise<IUser>;
  getUserByUid: (uid: string) => Promise<IUser | null>;
  updateUser: (uid: string, update: Partial<IUser>) => Promise<IUser | null>;

  // Content operations
  createContent: (contentData: IContent) => Promise<IContent>;
  getContent: (id: string) => Promise<IContent | null>;
  listContent: (
    filter?: Partial<IContent>,
    page?: number,
    limit?: number
  ) => Promise<{ content: IContent[]; total: number }>;
  updateContent: (id: string, update: Partial<IContent>) => Promise<IContent | null>;

  // Watch history operations
  addToWatchHistory: (uid: string, contentId: string, progress: number) => Promise<void>;

  // Rating operations
  addRating: (uid: string, contentId: string, rating: number) => Promise<void>;

  // Subscription operations
  updateSubscription: (
    uid: string,
    status: IUser['subscriptionStatus'],
    tier: IUser['subscriptionTier']
  ) => Promise<void>;
  createCheckoutSession: (user: IUser, planId: keyof typeof PLANS) => Promise<string>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const dbService = new DatabaseService();
  const stripeService = new StripeService();

  const value: DatabaseContextType = {
    // User operations
    createUser: dbService.createUser.bind(dbService),
    getUserByUid: dbService.getUserByUid.bind(dbService),
    updateUser: dbService.updateUser.bind(dbService),

    // Content operations
    createContent: dbService.createContent.bind(dbService),
    getContent: dbService.getContent.bind(dbService),
    listContent: dbService.listContent.bind(dbService),
    updateContent: dbService.updateContent.bind(dbService),

    // Watch history operations
    addToWatchHistory: dbService.addToWatchHistory.bind(dbService),

    // Rating operations
    addRating: dbService.addRating.bind(dbService),

    // Subscription operations
    updateSubscription: dbService.updateSubscription.bind(dbService),
    createCheckoutSession: stripeService.createCheckoutSession.bind(stripeService),
    cancelSubscription: stripeService.cancelSubscription.bind(stripeService),
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
} 