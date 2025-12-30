
import { User, TrialMode, UserRole, TrialConfig, AppStats } from './types';

const USERS_KEY = 'saas_demo_users';
const CONFIG_KEY = 'saas_demo_config';
const AUTH_KEY = 'saas_demo_auth';

const DEFAULT_CONFIG: TrialConfig = {
  mode: TrialMode.PREDICTIONS,
  maxPredictions: 3,
  trialDurationDays: 3,
};

// Seed admin user if none exists
const seedData = () => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if (users.length === 0) {
    const admin: User = {
      id: 'admin-01',
      email: 'admin@demo.com',
      role: UserRole.ADMIN,
      createdAt: Date.now(),
      predictionCount: 0
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([admin]));
  }
  if (!localStorage.getItem(CONFIG_KEY)) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
  }
};

seedData();

export const backendService = {
  // Config
  getTrialConfig: (): TrialConfig => {
    return JSON.parse(localStorage.getItem(CONFIG_KEY) || JSON.stringify(DEFAULT_CONFIG));
  },

  updateTrialConfig: (config: TrialConfig): TrialConfig => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    return config;
  },

  // Auth
  login: async (email: string): Promise<{ user: User; token: string }> => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    let user = users.find(u => u.email === email);
    
    if (!user) {
      // Create new user if doesn't exist (simpler for demo)
      user = {
        id: Math.random().toString(36).substring(7),
        email,
        role: email.includes('admin') ? UserRole.ADMIN : UserRole.USER,
        createdAt: Date.now(),
        predictionCount: 0
      };
      users.push(user);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
    const token = btoa(JSON.stringify(user));
    localStorage.setItem(AUTH_KEY, token);
    return { user, token };
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  getMe: (): User | null => {
    const token = localStorage.getItem(AUTH_KEY);
    if (!token) return null;
    try {
      const parsed = JSON.parse(atob(token));
      // Re-fetch from DB to get latest stats
      const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      return users.find(u => u.id === parsed.id) || null;
    } catch {
      return null;
    }
  },

  // Predictions
  makePrediction: async (userId: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    const config = backendService.getTrialConfig();
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return { success: false, message: "User not found" };
    
    const user = users[userIndex];
    
    // Check constraints based on mode
    if (user.role !== UserRole.ADMIN) {
      if (config.mode === TrialMode.PREDICTIONS) {
        if (user.predictionCount >= config.maxPredictions) {
          return { success: false, message: "Prediction limit reached. Please upgrade!" };
        }
      } else {
        const diffDays = (Date.now() - user.createdAt) / (1000 * 60 * 60 * 24);
        if (diffDays > config.trialDurationDays) {
          return { success: false, message: "Trial period expired. Please upgrade!" };
        }
      }
    }

    // Success logic
    users[userIndex].predictionCount += 1;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return { success: true, user: users[userIndex] };
  },

  // Admin Data
  getStats: (): AppStats => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const config = backendService.getTrialConfig();
    
    const totalPredictions = users.reduce((acc, u) => acc + u.predictionCount, 0);
    const activeTrials = users.filter(u => {
      if (u.role === UserRole.ADMIN) return true;
      if (config.mode === TrialMode.PREDICTIONS) {
        return u.predictionCount < config.maxPredictions;
      } else {
        const diffDays = (Date.now() - u.createdAt) / (1000 * 60 * 60 * 24);
        return diffDays < config.trialDurationDays;
      }
    }).length;

    return {
      totalUsers: users.length,
      activeTrials,
      totalPredictions
    };
  },

  getAllUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }
};
