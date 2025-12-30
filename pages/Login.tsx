
import React, { useState } from 'react';
import { useAuth } from '../App';
import { APP_NAME } from '../constants';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600));
    await login(email);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-indigo-100 p-8 border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white text-3xl font-bold mb-4 shadow-lg shadow-indigo-200">
            T
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{APP_NAME}</h1>
          <p className="text-slate-500">Experience the future of trial management.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="mt-2 text-xs text-slate-400">
              Tip: Use an email with "admin" to get admin access.
            </p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200"
          >
            {loading ? 'Entering...' : 'Get Started'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                <p className="text-[10px] uppercase tracking-widest text-indigo-600 font-bold mb-1">User Demo</p>
                <p className="text-xs text-slate-600 font-medium">user@demo.com</p>
            </div>
            <div className="p-3 rounded-lg bg-violet-50 border border-violet-100">
                <p className="text-[10px] uppercase tracking-widest text-violet-600 font-bold mb-1">Admin Demo</p>
                <p className="text-xs text-slate-600 font-medium">admin@demo.com</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
