import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

const PRESET_DEMO_USERS = {
  'farmer@agrilink.ai': {
    id: 'usr_farmer_01',
    name: 'Ramesh Sharma',
    email: 'farmer@agrilink.ai',
    role: 'farmer',
    phone: '+91 98310 44521',
    location: 'Hooghly, West Bengal',
    fpo_name: 'Hooghly Organic Farmer Cooperative (HOFC)',
    avatar: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23992?w=150&auto=format&fit=crop&q=80',
    password: 'farmer123'
  },
  'buyer@agrilink.ai': {
    id: 'usr_buyer_01',
    name: 'Pooja Verma',
    email: 'buyer@agrilink.ai',
    role: 'buyer',
    phone: '+91 98201 88390',
    location: 'Kolkata, West Bengal',
    fpo_name: 'FreshBites Kitchens & Retail',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    password: 'buyer123'
  },
  'admin@agrilink.ai': {
    id: 'usr_admin_01',
    name: 'FramX System Administrator',
    email: 'admin@agrilink.ai',
    role: 'admin',
    phone: '+91 99000 11223',
    location: 'National Operations Center, Delhi NCR',
    fpo_name: 'FramX Platform Core',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    password: 'admin123'
  },
  'logistics@agrilink.ai': {
    id: 'usr_logistics_01',
    name: 'GreenFleet Express Logistics',
    email: 'logistics@agrilink.ai',
    role: 'logistics',
    phone: '+91 94331 77650',
    location: 'Eastern Agri-Logistics Hub, Howrah',
    fpo_name: 'GreenFleet Cold Chains',
    avatar: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80',
    password: 'logistics123'
  },
};

const getLocalRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem('farmx_registered_users');
    return raw ? JSON.parse(raw) : { ...PRESET_DEMO_USERS };
  } catch {
    return { ...PRESET_DEMO_USERS };
  }
};

const saveLocalRegisteredUser = (userData) => {
  try {
    const existing = getLocalRegisteredUsers();
    existing[userData.email.toLowerCase()] = userData;
    localStorage.setItem('farmx_registered_users', JSON.stringify(existing));
  } catch (e) {
    console.error('Error saving local user', e);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('farmx_token') || localStorage.getItem('agrilink_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('farmx_token') || localStorage.getItem('agrilink_token');
      const storedUser = localStorage.getItem('farmx_user') || localStorage.getItem('agrilink_user');
      
      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } catch (err) {
          // fallback
        }
      } else {
        // Auto-login as Farmer demo by default so user can experience full app immediately
        const defaultFarmer = PRESET_DEMO_USERS['farmer@agrilink.ai'];
        setUser(defaultFarmer);
        setToken('demo_token_farmer_default');
        localStorage.setItem('farmx_token', 'demo_token_farmer_default');
        localStorage.setItem('farmx_user', JSON.stringify(defaultFarmer));
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const normalizedEmail = (email || '').toLowerCase().trim();
    if (!normalizedEmail || !password) {
      return { success: false, error: 'Please provide both email and password.' };
    }

    try {
      // 1. Try real backend API
      const res = await authAPI.login({ email: normalizedEmail, password });
      if (res?.data?.access_token && res?.data?.user) {
        const { access_token, user: loggedUser } = res.data;
        localStorage.setItem('farmx_token', access_token);
        localStorage.setItem('farmx_user', JSON.stringify(loggedUser));
        setToken(access_token);
        setUser(loggedUser);
        return { success: true, user: loggedUser };
      }
    } catch (err) {
      console.warn('Backend login unavailable, checking local accounts...', err);
    }

    // 2. Check preset demo users or registered users in localStorage
    const allUsers = getLocalRegisteredUsers();
    const matchedUser = allUsers[normalizedEmail];

    if (matchedUser) {
      if (matchedUser.password && matchedUser.password !== password) {
        return { success: false, error: 'Incorrect password for this account.' };
      }
      const dummyToken = `token_${matchedUser.role}_${Date.now()}`;
      localStorage.setItem('farmx_token', dummyToken);
      localStorage.setItem('farmx_user', JSON.stringify(matchedUser));
      setToken(dummyToken);
      setUser(matchedUser);
      return { success: true, user: matchedUser };
    }

    // 3. If new email entered with arbitrary password, dynamically generate authenticated account!
    const inferredRole = normalizedEmail.includes('farmer') ? 'farmer' : normalizedEmail.includes('admin') ? 'admin' : 'buyer';
    const dynamicUser = {
      id: `usr_${Date.now()}`,
      name: normalizedEmail.split('@')[0].replace('.', ' '),
      email: normalizedEmail,
      role: inferredRole,
      phone: '+91 98310 00000',
      location: 'Kolkata, West Bengal',
      fpo_name: inferredRole === 'farmer' ? 'Registered Farmer Co-op' : 'Direct Consumer',
      avatar: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23992?w=150&auto=format&fit=crop&q=80',
      password: password
    };
    saveLocalRegisteredUser(dynamicUser);

    const dummyToken = `token_${dynamicUser.role}_${Date.now()}`;
    localStorage.setItem('farmx_token', dummyToken);
    localStorage.setItem('farmx_user', JSON.stringify(dynamicUser));
    setToken(dummyToken);
    setUser(dynamicUser);
    return { success: true, user: dynamicUser };
  };

  const register = async (userData) => {
    const normalizedEmail = (userData.email || '').toLowerCase().trim();
    if (!normalizedEmail || !userData.password) {
      return { success: false, error: 'Please enter a valid email and password.' };
    }

    const avatarUrl = userData.role === 'farmer'
      ? 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23992?w=150&auto=format&fit=crop&q=80'
      : userData.role === 'admin'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      : userData.role === 'logistics'
      ? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';

    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name || 'FramX Member',
      email: normalizedEmail,
      role: userData.role || 'farmer',
      phone: userData.phone || '+91 98000 00000',
      location: userData.location || 'Kolkata, West Bengal',
      fpo_name: userData.fpo_name || (userData.role === 'farmer' ? 'Local Farmer Union' : 'Direct Buyer'),
      avatar: avatarUrl,
      password: userData.password,
      created_at: new Date().toISOString(),
    };

    // Save locally
    saveLocalRegisteredUser(newUser);

    // Also attempt backend registration
    try {
      await authAPI.register(userData);
    } catch (e) {
      console.warn('Backend register sync skipped (offline/client mode)');
    }

    const dummyToken = `token_${newUser.role}_${Date.now()}`;
    localStorage.setItem('farmx_token', dummyToken);
    localStorage.setItem('farmx_user', JSON.stringify(newUser));
    setToken(dummyToken);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const quickSwitchRole = async (roleName) => {
    const credentials = {
      farmer: { email: 'farmer@agrilink.ai', password: 'farmer123' },
      buyer: { email: 'buyer@agrilink.ai', password: 'buyer123' },
      admin: { email: 'admin@agrilink.ai', password: 'admin123' },
      logistics: { email: 'logistics@agrilink.ai', password: 'logistics123' },
    };
    const cred = credentials[roleName] || credentials.farmer;
    return await login(cred.email, cred.password);
  };

  const logout = () => {
    localStorage.removeItem('farmx_token');
    localStorage.removeItem('farmx_user');
    localStorage.removeItem('agrilink_token');
    localStorage.removeItem('agrilink_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        quickSwitchRole,
        isAuthenticated: !!user,
        isFarmer: user?.role === 'farmer',
        isBuyer: user?.role === 'buyer',
        isAdmin: user?.role === 'admin',
        isLogistics: user?.role === 'logistics',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
