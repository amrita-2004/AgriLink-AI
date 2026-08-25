import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sprout,
  ShoppingBag,
  Cpu,
  Truck,
  LayoutDashboard,
  User,
  LogOut,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ onOpenDemoModal }) => {
  const { user, logout, quickSwitchRole, isAuthenticated, isFarmer, isBuyer, isAdmin, isLogistics } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const getDashboardPath = () => {
    if (isAdmin) return '/admin-dashboard';
    if (isFarmer) return '/farmer-dashboard';
    if (isLogistics) return '/logistics';
    return '/buyer-dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 animate-float" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
                  FramX<span className="text-brand-600">.AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-brand-100 text-brand-700 rounded-md uppercase tracking-wider">
                  Smart Market
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">Direct Farm-to-Buyer AI Platform</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/marketplace"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/marketplace')
                  ? 'text-brand-700 bg-brand-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-brand-600" />
              Marketplace
            </Link>

            <Link
              to="/ai-analytics"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/ai-analytics')
                  ? 'text-brand-700 bg-brand-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-600" />
              AI Intelligence
            </Link>

            <Link
              to="/logistics"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/logistics')
                  ? 'text-brand-700 bg-brand-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Truck className="w-4 h-4 text-indigo-600" />
              Smart Logistics
            </Link>

            {/* Role-based Dashboard Direct Link */}
            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  location.pathname.includes('dashboard') || (isLogistics && location.pathname === '/logistics')
                    ? 'text-brand-700 bg-brand-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-600" />
                {isAdmin ? 'Admin Panel' : isFarmer ? 'Farmer Portal' : isLogistics ? 'Fleet Hub' : 'My Orders'}
              </Link>
            )}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* 1-Click Interactive Demo Button */}
            <button
              onClick={onOpenDemoModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-md shadow-amber-500/25 hover:opacity-95 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Demo</span>
            </button>

            {/* Quick Demo Role Switcher Pills */}
            <div className="hidden xl:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs">
              <span className="px-2 text-slate-500 font-medium">Switch:</span>
              <button
                onClick={() => { quickSwitchRole('farmer'); navigate('/farmer-dashboard'); }}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  isFarmer ? 'bg-white text-brand-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Farmer profile"
              >
                🌾 Farmer
              </button>
              <button
                onClick={() => { quickSwitchRole('buyer'); navigate('/buyer-dashboard'); }}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  isBuyer ? 'bg-white text-brand-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Buyer profile"
              >
                🛒 Buyer
              </button>
              <button
                onClick={() => { quickSwitchRole('admin'); navigate('/admin-dashboard'); }}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  isAdmin ? 'bg-white text-brand-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Admin profile"
              >
                ⚡ Admin
              </button>
              <button
                onClick={() => { quickSwitchRole('logistics'); navigate('/logistics'); }}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  isLogistics ? 'bg-white text-brand-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Logistics profile"
              >
                🚚 Logistics
              </button>
            </div>

            {/* Notifications */}
            <NotificationDropdown />

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
                    <img
                      src={user?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/40"
                    />
                    <span className="text-xs font-semibold text-slate-800 hidden md:block max-w-[100px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
                  </button>

                  <div className="absolute right-0 mt-1 w-52 rounded-xl bg-white shadow-xl border border-slate-200/80 py-1.5 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 capitalize">{user?.role} • {user?.location || 'India'}</p>
                    </div>
                    <Link
                      to={getDashboardPath()}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-brand-600" />
                      Role Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 font-medium text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm shadow-brand-600/30 transition-all hover:scale-105"
                >
                  Join Market
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg md:hidden hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => { onOpenDemoModal(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> 1-Click Interactive Demo Flow
          </button>
          
          <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl text-center text-[11px] my-2">
            <button onClick={() => { quickSwitchRole('farmer'); navigate('/farmer-dashboard'); setMobileMenuOpen(false); }} className="py-1.5 rounded-lg bg-white font-bold text-brand-700">🌾 Farmer</button>
            <button onClick={() => { quickSwitchRole('buyer'); navigate('/buyer-dashboard'); setMobileMenuOpen(false); }} className="py-1.5 rounded-lg bg-white font-bold text-brand-700">🛒 Buyer</button>
            <button onClick={() => { quickSwitchRole('admin'); navigate('/admin-dashboard'); setMobileMenuOpen(false); }} className="py-1.5 rounded-lg bg-white font-bold text-brand-700">⚡ Admin</button>
            <button onClick={() => { quickSwitchRole('logistics'); navigate('/logistics'); setMobileMenuOpen(false); }} className="py-1.5 rounded-lg bg-white font-bold text-brand-700">🚚 Fleet</button>
          </div>

          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-2 pt-1 pb-2 border-b border-slate-100">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-center text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs"
              >
                Join Market
              </Link>
            </div>
          )}

          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-medium text-sm"
          >
            <ShoppingBag className="w-5 h-5 text-brand-600" /> Marketplace
          </Link>
          <Link
            to="/ai-analytics"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-medium text-sm"
          >
            <Cpu className="w-5 h-5 text-emerald-600" /> AI Demand & Price Engine
          </Link>
          <Link
            to="/logistics"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-medium text-sm"
          >
            <Truck className="w-5 h-5 text-indigo-600" /> Smart Route Logistics
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-medium text-sm"
              >
                <LayoutDashboard className="w-5 h-5 text-amber-600" /> Role Dashboard
              </Link>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium text-sm text-left"
              >
                <LogOut className="w-5 h-5" /> Sign Out ({user?.name})
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
