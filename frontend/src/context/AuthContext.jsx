import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// ─── Local DB ───────────────────────────────────────────────────────────────
const DB_KEY = 'agrilink_ai_users_db';

const getDB = () => {
  try { return JSON.parse(localStorage.getItem(DB_KEY) || '{}'); }
  catch { return {}; }
};
const saveDB = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db));

// Pre-seed demo accounts on first load
const seedDemoAccounts = () => {
  const db = getDB();
  const demos = {
    'farmer@agrilink.ai': {
      id: 'usr_farmer_01', name: 'Ramesh Sharma', email: 'farmer@agrilink.ai',
      password: 'farmer123', role: 'farmer', phone: '+91 98310 44521',
      location: 'Hooghly, West Bengal', fpo_name: 'Hooghly Organic Farmer Cooperative',
      avatar: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23992?w=150&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    },
    'buyer@agrilink.ai': {
      id: 'usr_buyer_01', name: 'Pooja Verma', email: 'buyer@agrilink.ai',
      password: 'buyer123', role: 'buyer', phone: '+91 98201 88390',
      location: 'Kolkata, West Bengal', fpo_name: 'FreshBites Kitchens & Retail',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    },
    'admin@agrilink.ai': {
      id: 'usr_admin_01', name: 'AgriLink_AI Administrator', email: 'admin@agrilink.ai',
      password: 'admin123', role: 'admin', phone: '+91 99000 11223',
      location: 'Delhi NCR', fpo_name: 'AgriLink_AI Platform Core',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    },
    'logistics@agrilink.ai': {
      id: 'usr_logistics_01', name: 'GreenFleet Express', email: 'logistics@agrilink.ai',
      password: 'logistics123', role: 'logistics', phone: '+91 94331 77650',
      location: 'Howrah, West Bengal', fpo_name: 'GreenFleet Cold Chains',
      avatar: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    },
  };
  let updated = false;
  Object.entries(demos).forEach(([email, user]) => {
    if (!db[email]) { db[email] = user; updated = true; }
  });
  if (updated) saveDB(db);
};

const AVATAR_MAP = {
  farmer: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23992?w=150&auto=format&fit=crop&q=80',
  admin: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  logistics: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80',
  buyer: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
};

// ─── Try real backend, always fall back silently ─────────────────────────────
const tryBackend = async (path, body = null) => {
  try {
    const token = localStorage.getItem('agrilink_ai_token');
    const res = await fetch(`http://127.0.0.1:8000${path}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { ok: false, error: err.detail || 'Server error' };
    }
    return { ok: true, data: await res.json() };
  } catch {
    return { ok: false, error: 'offline' };
  }
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedDemoAccounts();
    const storedUser = localStorage.getItem('agrilink_ai_user');
    const storedToken = localStorage.getItem('agrilink_ai_token');
    if (storedUser && storedToken) {
      try { setUser(JSON.parse(storedUser)); setToken(storedToken); }
      catch { /* invalid JSON, ignore */ }
    }
    setLoading(false);
  }, []);

  // ── REGISTER ──────────────────────────────────────────────────────────────
  const register = async (formData) => {
    const email = (formData.email || '').toLowerCase().trim();
    const password = (formData.password || '').trim();

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }
    if (!formData.name || !formData.name.trim()) {
      return { success: false, error: 'Full name is required.' };
    }

    // Check if email already registered locally
    const db = getDB();
    if (db[email]) {
      return { success: false, error: 'This email is already registered. Please log in instead.' };
    }

    // Try backend first
    const backendRes = await tryBackend('/api/auth/register', { ...formData, email, password });
    if (backendRes.ok && backendRes.data?.access_token) {
      const { access_token, user: backendUser } = backendRes.data;
      // Also save locally so they can log in offline
      db[email] = { ...backendUser, password };
      saveDB(db);
      localStorage.setItem('agrilink_ai_token', access_token);
      localStorage.setItem('agrilink_ai_user', JSON.stringify(backendUser));
      setToken(access_token);
      setUser(backendUser);
      return { success: true, user: backendUser };
    }

    // Offline / Vercel fallback: save to localStorage
    const newUser = {
      id: `usr_${Date.now()}`,
      name: formData.name.trim(),
      email,
      role: formData.role || 'farmer',
      phone: formData.phone || '',
      location: formData.location || '',
      fpo_name: formData.fpo_name || '',
      avatar: AVATAR_MAP[formData.role] || AVATAR_MAP.buyer,
      password,
      created_at: new Date().toISOString(),
    };

    db[email] = newUser;
    saveDB(db);

    const tok = `tok_${newUser.role}_${Date.now()}`;
    localStorage.setItem('agrilink_ai_token', tok);
    localStorage.setItem('agrilink_ai_user', JSON.stringify(newUser));
    setToken(tok);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const normalizedEmail = (email || '').toLowerCase().trim();
    if (!normalizedEmail || !password) {
      return { success: false, error: 'Please enter your email and password.' };
    }

    // Try backend first
    const backendRes = await tryBackend('/api/auth/login', { email: normalizedEmail, password });
    if (backendRes.ok && backendRes.data?.access_token) {
      const { access_token, user: backendUser } = backendRes.data;
      const db = getDB();
      db[normalizedEmail] = { ...backendUser, password };
      saveDB(db);
      localStorage.setItem('agrilink_ai_token', access_token);
      localStorage.setItem('agrilink_ai_user', JSON.stringify(backendUser));
      setToken(access_token);
      setUser(backendUser);
      return { success: true, user: backendUser };
    }

    // Wrong credentials from backend
    if (backendRes.error && backendRes.error !== 'offline') {
      return { success: false, error: backendRes.error };
    }

    // Offline fallback: check local DB
    const db = getDB();
    const localUser = db[normalizedEmail];
    if (!localUser) {
      return { success: false, error: 'No account found with this email. Please register first.' };
    }
    if (localUser.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const tok = `tok_${localUser.role}_${Date.now()}`;
    localStorage.setItem('agrilink_ai_token', tok);
    localStorage.setItem('agrilink_ai_user', JSON.stringify(localUser));
    setToken(tok);
    setUser(localUser);
    return { success: true, user: localUser };
  };

  // ── QUICK ROLE SWITCH ─────────────────────────────────────────────────────
  const quickSwitchRole = async (roleName) => {
    const map = {
      farmer: ['farmer@agrilink.ai', 'farmer123'],
      buyer: ['buyer@agrilink.ai', 'buyer123'],
      admin: ['admin@agrilink.ai', 'admin123'],
      logistics: ['logistics@agrilink.ai', 'logistics123'],
    };
    const [e, p] = map[roleName] || map.farmer;
    return login(e, p);
  };

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('agrilink_ai_token');
    localStorage.removeItem('agrilink_ai_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, logout, quickSwitchRole,
      isAuthenticated: !!user,
      isFarmer: user?.role === 'farmer',
      isBuyer: user?.role === 'buyer',
      isAdmin: user?.role === 'admin',
      isLogistics: user?.role === 'logistics',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
