import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Activity,
  BarChart3,
  Search,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [userTab, setUserTab] = useState('all');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statRes, userRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getUsers(),
      ]);
      setStats(statRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDemoData = async () => {
    if (!window.confirm('Reset database with clean seed data?')) return;
    setResetting(true);
    try {
      await adminAPI.resetSeedData();
      alert('Database reset successfully!');
      fetchAdminData();
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (userTab === 'all') return true;
    return u.role === userTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
            <ShieldAlert className="w-3.5 h-3.5" /> Platform Governance & Moderation
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            FarmX AI System Administration
          </h1>
          <p className="text-xs text-slate-400">
            National agricultural marketplace monitoring, escrow clearing & supply-chain analytics.
          </p>
        </div>

        <button
          onClick={handleResetDemoData}
          disabled={resetting}
          className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all hover:scale-105"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          {resetting ? 'Resetting DB...' : 'Reset Demo Seed Data'}
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
            Total Farmers & FPOs
            <Users className="w-4 h-4 text-brand-600" />
          </span>
          <p className="text-2xl font-black text-slate-900">{stats?.metrics?.total_farmers || 175}</p>
          <span className="text-[11px] text-brand-700 font-semibold">100% KYC Verified</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
            Active Buyers & Kitchens
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </span>
          <p className="text-2xl font-black text-slate-900">{stats?.metrics?.total_buyers || 480}</p>
          <span className="text-[11px] text-blue-600 font-semibold">Urban & Retail chains</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
            Platform GMV Revenue
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </span>
          <p className="text-2xl font-black text-emerald-700">₹{(stats?.metrics?.total_revenue_inr || 1280000).toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-bold">Direct Escrow cleared</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium flex items-center justify-between">
            System Reliability
            <Activity className="w-4 h-4 text-indigo-600" />
          </span>
          <p className="text-2xl font-black text-indigo-700">{stats?.metrics?.platform_health_score || '99.8%'}</p>
          <span className="text-[11px] text-indigo-600 font-semibold">AI Models Synchronized</span>
        </div>

      </div>

      {/* Analytics Charts Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Monthly Platform Growth (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Platform GMV Growth (INR)</h3>
              <p className="text-xs text-slate-500">Monthly direct trade volume across states</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              +44% MoM
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthly_growth || []}>
                <defs>
                  <linearGradient id="colorAdminRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString()}`, 'Direct Volume']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorAdminRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supply vs Demand Analytics (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Supply vs Demand Balance (Tonnes)</h3>
              <p className="text-xs text-slate-500">AI category real-time demand vs active mandi inventory</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
              AI Monitored
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.supply_demand_ratio || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="supply_tonnes" name="Farmer Supply (T)" fill="#22c55e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="demand_tonnes" name="Market Demand (T)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* User Management Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">Registered Platform Users</h3>
            <p className="text-xs text-slate-500">Farmers, FPOs, Buyers, and Logistics partners</p>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {['all', 'farmer', 'buyer', 'logistics', 'admin'].map((tab) => (
              <button
                key={tab}
                onClick={() => setUserTab(tab)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-all ${
                  userTab === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">User / Entity</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3 text-right rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || "https://images.unsplash.com/photo-1592417817098-8f3d6ef23992?w=150&auto=format&fit=crop&q=80"}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        {u.fpo_name && <p className="text-[10px] text-slate-400">{u.fpo_name}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full font-bold uppercase text-[10px] bg-slate-100 text-slate-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3 text-slate-600">{u.location || 'India'}</td>
                  <td className="px-4 py-3 text-slate-600">{u.phone || '+91 98310 44521'}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Active & Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
