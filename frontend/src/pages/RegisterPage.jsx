import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Mail, User, Phone, MapPin, Building, ArrowRight, ShieldCheck, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer',
    phone: '',
    location: '',
    fpo_name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectUserByRole = (role) => {
    if (role === 'admin') navigate('/admin-dashboard');
    else if (role === 'farmer') navigate('/farmer-dashboard');
    else if (role === 'logistics') navigate('/logistics');
    else navigate('/buyer-dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all required fields (Name, Email, Password).');
      return;
    }

    setLoading(true);
    const res = await register(formData);
    setLoading(false);
    if (res.success) {
      redirectUserByRole(formData.role);
    } else {
      setError(res.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-700 to-emerald-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-600/30">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="font-display font-black text-2xl text-slate-900">Join FarmX AI Marketplace</h1>
          <p className="text-xs text-slate-500">Connect directly without intermediaries and trade fairly with AI insights</p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200 animate-in fade-in duration-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Role Picker */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Select Your Account Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: 'farmer', label: '🌾 Farmer / FPO', sub: 'Sell harvests' },
                  { role: 'buyer', label: '🛒 Bulk Buyer', sub: 'Buy direct' },
                  { role: 'logistics', label: '🚚 Logistics', sub: 'Cold fleet' },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: item.role })}
                    className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                      formData.role === item.role
                        ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500/20 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={formData.role === 'farmer' ? "e.g. Ramesh Sharma" : formData.role === 'buyer' ? "e.g. Pooja Verma" : "e.g. Amit Sen"}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  {formData.role === 'farmer' ? 'FPO / Cooperative' : formData.role === 'buyer' ? 'Company / Business' : 'Fleet Agency Name'}
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={formData.role === 'farmer' ? "e.g. Hooghly Farmers FPO" : formData.role === 'buyer' ? "e.g. FreshBites Retail" : "e.g. GreenFleet Cold Chain"}
                    value={formData.fpo_name}
                    onChange={(e) => setFormData({ ...formData, fpo_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="+91 98310 44521"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  {formData.role === 'farmer' ? 'Farm Location / District' : formData.role === 'buyer' ? 'Delivery City / Hub' : 'Operating Base / Hub'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Kolkata, West Bengal"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Join FarmX AI Marketplace'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:underline">
              Sign In to Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;

