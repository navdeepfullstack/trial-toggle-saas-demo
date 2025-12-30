
import React from 'react';
import { useAuth } from '../App';
import { TrialMode, UserRole } from '../types';
import { ICONS } from '../constants';

const TrialBanner: React.FC = () => {
  const { user, trialConfig } = useAuth();
  
  if (!user || user.role === UserRole.ADMIN) return null;

  let message = "";
  let progress = 0;
  let isExpired = false;

  if (trialConfig.mode === TrialMode.PREDICTIONS) {
    const remaining = Math.max(0, trialConfig.maxPredictions - user.predictionCount);
    message = `${remaining} predictions remaining in your free trial.`;
    progress = (user.predictionCount / trialConfig.maxPredictions) * 100;
    isExpired = remaining <= 0;
  } else {
    const diffMs = Date.now() - user.createdAt;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const remainingDays = Math.max(0, trialConfig.trialDurationDays - diffDays);
    
    if (remainingDays > 0) {
      message = `${remainingDays.toFixed(1)} days remaining in your free trial.`;
      progress = (diffDays / trialConfig.trialDurationDays) * 100;
    } else {
      message = "Trial expired. Please upgrade to continue.";
      progress = 100;
      isExpired = true;
    }
  }

  return (
    <div className={`w-full py-2 px-4 flex items-center justify-between text-sm font-medium ${isExpired ? 'bg-red-50 text-red-800' : 'bg-indigo-50 text-indigo-800'}`}>
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {trialConfig.mode === TrialMode.PREDICTIONS ? <ICONS.Zap /> : <ICONS.Clock />}
          <span>{message}</span>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${isExpired ? 'bg-red-500' : 'bg-indigo-600'}`} 
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <button className={`px-4 py-1 rounded-md font-bold whitespace-nowrap transition-colors ${isExpired ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;
