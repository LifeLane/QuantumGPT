
// Central place for shared TypeScript types

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  // Add other user-related fields as needed
  // e.g., image?: string | null;
  // e.g., role?: 'user' | 'admin';
}

// You might define other shared types here, for example:
// export interface Subscription {
//   id: string;
//   userId: string;
//   plan: 'free' | 'pro' | 'elite';
//   status: 'active' | 'canceled' | 'past_due';
//   currentPeriodEnd: Date;
// }
