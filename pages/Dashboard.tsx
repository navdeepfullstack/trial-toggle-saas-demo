
import React, { useState } from 'react';
import { useAuth } from '../App';
import { backendService } from '../backendService';
import { GoogleGenAI } from "@google/genai";
import { ICONS } from '../constants';

const Dashboard: React.FC = () => {
  const { user, refreshUser, trialConfig } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!prompt.trim() || !user) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    // Call simulated backend prediction
    const res = await backendService.makePrediction(user.id);
    
    if (!res.success) {
      setError(res.message || "Something went wrong");
      setLoading(false);
      return;
    }

    try {
      // Small "Gemini" integration for realism
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Predict the outcome or give feedback on: ${prompt}`,
      });
      setResult(response.text || "No prediction generated.");
      refreshUser();
    } catch (e) {
      // Fallback for demo if API fails
      setResult(`[Demo Mock Output] Analyzing "${prompt}"... Logic indicates a high probability of success.`);
      refreshUser();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Predictor Hub</h1>
        <p className="text-lg text-slate-500 mt-2">Use our AI engine to forecast your business metrics.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Interface */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ICONS.Zap /> New Prediction
            </h2>
            <div className="space-y-4">
              <textarea 
                className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none text-slate-700"
                placeholder="Describe what you want to predict (e.g., 'Next quarter sales growth based on current churn rates')..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
              />
              <button 
                onClick={handlePredict}
                disabled={loading || !prompt.trim()}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
              >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing AI...</span>
                    </>
                ) : 'Run Analysis'}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 flex items-start gap-3">
              <div className="mt-0.5"><ICONS.Clock /></div>
              <div>
                <p className="font-bold">Access Restricted</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-slate-900 text-slate-50 p-8 rounded-2xl shadow-xl space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-indigo-400 font-bold text-xs uppercase tracking-widest">AI Result</h3>
              <div className="prose prose-invert max-w-none">
                <p className="leading-relaxed whitespace-pre-wrap">{result}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <h3 className="font-bold text-slate-900 mb-4">Your Usage</h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Predictions Made</p>
                <p className="text-3xl font-black text-slate-900">{user?.predictionCount || 0}</p>
              </div>
              
              <div className="pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Trial Mode</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                  {trialConfig.mode === 'PREDICTIONS' ? (
                    <><ICONS.Zap /> Usage-Based</>
                  ) : (
                    <><ICONS.Clock /> Time-Based</>
                  )}
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Account Role</p>
                <p className="text-sm font-semibold text-slate-800 capitalize">{user?.role.toLowerCase()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl text-white">
            <h3 className="font-bold mb-2">Need more?</h3>
            <p className="text-indigo-100 text-sm mb-6">Upgrade to Pro for unlimited predictions and 24/7 support.</p>
            <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                View Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
