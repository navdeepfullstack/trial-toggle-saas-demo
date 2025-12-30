
import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthState, User, TrialConfig, UserRole } from './types';
import { backendService } from './backendService';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import TrialBanner from './components/TrialBanner';
import { APP_NAME, ICONS } from './constants';

interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
  trialConfig: TrialConfig;
  updateConfig: (newConfig: TrialConfig) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                {APP_NAME}
              </span>
            </div>
            
            {user && (
              <div className="flex items-center gap-6">
                <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 font-medium">Dashboard</Link>
                {user.role === UserRole.ADMIN && (
                  <Link to="/admin" className="text-slate-600 hover:text-indigo-600 font-medium flex items-center gap-1">
                    <ICONS.Shield /> Admin
                  </Link>
                )}
                <div className="h-6 w-[1px] bg-slate-200"></div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 hidden sm:block">{user.email}</span>
                  <button 
                    onClick={logout}
                    className="text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {user && <TrialBanner />}
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="bg-slate-50 border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} TrialToggle SaaS Demo. Built with React & Tailwind.
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null
  });
  const [trialConfig, setTrialConfig] = useState<TrialConfig>(backendService.getTrialConfig());

  useEffect(() => {
    const me = backendService.getMe();
    if (me) {
      setAuthState({
        user: me,
        isAuthenticated: true,
        token: localStorage.getItem('saas_demo_auth')
      });
    }
  }, []);

  const login = async (email: string) => {
    const { user, token } = await backendService.login(email);
    setAuthState({ user, isAuthenticated: true, token });
  };

  const logout = () => {
    backendService.logout();
    setAuthState({ user: null, isAuthenticated: false, token: null });
  };

  const refreshUser = () => {
    const me = backendService.getMe();
    if (me) {
      setAuthState(prev => ({ ...prev, user: me }));
    }
  };

  const updateConfig = (newConfig: TrialConfig) => {
    const updated = backendService.updateTrialConfig(newConfig);
    setTrialConfig(updated);
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, refreshUser, trialConfig, updateConfig }}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={!authState.isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={
            authState.isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />
          } />
          <Route path="/admin" element={
            authState.isAuthenticated && authState.user?.role === UserRole.ADMIN 
              ? <Layout><Admin /></Layout> 
              : <Navigate to="/dashboard" />
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}
