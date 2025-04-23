export interface Subscription {
  active: boolean;
  plan: string;
  startDate: Date;
  endDate: Date;
  paymentMethod: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  subscription?: Subscription;
  preferences?: {
    notifications: boolean;
    emailUpdates: boolean;
    autoplay: boolean;
    language: string;
    videoQuality: string;
  };
  createdAt: Date;
  lastLogin: Date;
} 