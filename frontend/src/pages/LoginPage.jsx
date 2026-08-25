import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, quickSwitchRole } = useAuth();
  const [email, setEmail] = useState('farmer@agrilink.ai');
  const [password, setPassword] = useState('farmer123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      if (res.user.role === 'admin') navigate('/admin-dashboard');
      else if (res.user.role === 'farmer') navigate('/farmer-dashboard');
      else navigate('/marketplace');
    } else {
      setError(res.error);
    }
  };

  const handleQuickDemoLogin = (role) => {
    quickSwitchRole(role).then((res) => {
      if (res.success) {
        if (role === 'admin') navigate('/admin-dashboard');
        else if (role === 'farmer') navigate('/farmer-dashboard');
        else navigate('/marketplace');
      }
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Logo and Intro */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-700 to-emerald-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-600/30">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="font-display font-black text-2xl text-slate-900">Sign in to AgriLink AI</h1>
          <p className="text-xs text-slate-500">Access your role-specific dashboard & direct marketplace</p>
        </div>

        {/* 1-Click Demo Login Chips */}
        <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>1-Click Instant Demo Login:</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('farmer')}
              className="py-2 rounded-xl bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 transition-all shadow-xs"
            >
              🌾 Farmer FPO
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('buyer')}
              className="py-2 rounded-xl bg-white text-blue-800 border border-blue-300 hover:bg-blue-50 transition-all shadow-xs"
            >
              🛒 Bulk Buyer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="py-2 rounded-xl bg-white text-purple-800 border border-purple-300 hover:bg-purple-50 transition-all shadow-xs"
            >
              ⚡ Admin Panel
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700">Password</label>
                <span className="text-[11px] text-brand-600 hover:underline cursor-pointer">Forgot?</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-600/30 transition-all flex items-center justify-center gap-2 hover:scale-102"
            >
              {loading ? 'Authenticating...' : 'Sign In to Account'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:underline">
              Create Free Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
