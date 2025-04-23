import { ObjectId } from 'mongodb';

export interface IWatchHistoryItem {
  contentId: string;
  timestamp: Date;
  progress: number;
}

export interface IRatingItem {
  contentId: string;
  rating: number;
  timestamp: Date;
}

export interface IUserPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  autoplay: boolean;
  language: string;
  videoQuality: 'auto' | '1080p' | '720p' | '480p';
}

export interface IUser {
  _id?: ObjectId;
  uid: string;  // Firebase UID
  email: string;
  displayName?: string;
  photoURL?: string;
  stripeCustomerId?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'cancelled' | 'past_due';
  subscriptionTier?: 'free' | 'premium';
  watchHistory: IWatchHistoryItem[];
  ratings: IRatingItem[];
  preferences: IUserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate extends Omit<IUser, '_id' | 'createdAt' | 'updatedAt'> {
  createdAt?: Date;
  updatedAt?: Date;
}

export const defaultUserPreferences: IUserPreferences = {
  notifications: true,
  emailUpdates: true,
  autoplay: true,
  language: 'en',
  videoQuality: 'auto',
};

export const createUser = (data: IUserCreate): IUser => {
  const now = new Date();
  return {
    ...data,
    preferences: data.preferences || defaultUserPreferences,
    watchHistory: data.watchHistory || [],
    ratings: data.ratings || [],
    subscriptionStatus: data.subscriptionStatus || 'inactive',
    subscriptionTier: data.subscriptionTier || 'free',
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
  };
}; 