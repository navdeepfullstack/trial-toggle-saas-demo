
export enum TrialMode {
  PREDICTIONS = 'PREDICTIONS',
  DAYS = 'DAYS'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: number;
  predictionCount: number;
}

export interface TrialConfig {
  mode: TrialMode;
  maxPredictions: number;
  trialDurationDays: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface AppStats {
  totalUsers: number;
  activeTrials: number;
  totalPredictions: number;
}
