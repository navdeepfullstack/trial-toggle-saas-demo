
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { backendService } from '../backendService';
import { TrialMode, AppStats, User } from '../types';
import { ICONS } from '../constants';

const Admin: React.FC = () => {
  const { trialConfig, updateConfig } = useAuth();
  const [stats, setStats] = useState<AppStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setStats(backendService.getStats());
    setUsers(backendService.getAllUsers());
  };

  const handleToggleMode = (mode: TrialMode) => {
    updateConfig({
      ...trialConfig,
      mode
    });
    // Give it a moment to update stats logic
    setTimeout(refreshData, 100);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin Control</h1>
          <p className="text-lg text-slate-500 mt-2">Manage global trial configurations and monitor usage.</p>
        </div>
        <button 
          onClick={refreshData}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-medium transition-colors flex items-center gap-2 text-sm"
        >
          <ICONS.Check /> Refresh Data
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <ICONS.Users />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <ICONS.Check />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Trials</p>
              <p className="text-2xl font-bold text-slate-900">{stats?.activeTrials || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <ICONS.Zap />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total API Calls</p>
              <p className="text-2xl font-bold text-slate-900">{stats?.totalPredictions || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trial Toggle System */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">Trial Mode Switcher</h2>
          <p className="text-sm text-slate-500">Toggle between usage-based and time-based limits for all users.</p>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div 
            onClick={() => handleToggleMode(TrialMode.PREDICTIONS)}
            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer group ${trialConfig.mode === TrialMode.PREDICTIONS ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${trialConfig.mode === TrialMode.PREDICTIONS ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                <ICONS.Zap />
              </div>
              {trialConfig.mode === TrialMode.PREDICTIONS && (
                <span className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Active</span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Mode A: Usage-Based</h3>
            <p className="text-sm text-slate-500">Users are limited to <strong>{trialConfig.maxPredictions} predictions</strong> total. Trial never expires by time.</p>
          </div>

          <div 
            onClick={() => handleToggleMode(TrialMode.DAYS)}
            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer group ${trialConfig.mode === TrialMode.DAYS ? 'border-violet-600 bg-violet-50/50 ring-4 ring-violet-50' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${trialConfig.mode === TrialMode.DAYS ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                <ICONS.Clock />
              </div>
              {trialConfig.mode === TrialMode.DAYS && (
                <span className="bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Active</span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Mode B: Time-Based</h3>
            <p className="text-sm text-slate-500">Users have <strong>{trialConfig.trialDurationDays} days</strong> of unlimited predictions. Access expires automatically.</p>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Registered Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Predictions</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => {
                const isTrialExpired = trialConfig.mode === TrialMode.PREDICTIONS 
                  ? u.predictionCount >= trialConfig.maxPredictions 
                  : ((Date.now() - u.createdAt) / (1000 * 60 * 60 * 24)) > trialConfig.trialDurationDays;

                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{u.email}</p>
                      <p className="text-xs text-slate-400 font-mono">{u.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${u.role === 'ADMIN' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{u.predictionCount}</span>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600" 
                            style={{ width: `${Math.min(100, (u.predictionCount / trialConfig.maxPredictions) * 100)}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {u.role === 'ADMIN' ? (
                        <span className="text-xs font-medium text-emerald-600">Unlimited</span>
                      ) : (
                        <span className={`text-xs font-medium ${isTrialExpired ? 'text-red-600' : 'text-indigo-600'}`}>
                          {isTrialExpired ? 'Blocked' : 'Trial Active'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
