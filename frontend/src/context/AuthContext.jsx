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
  },
  'admin@agrilink.ai': {
    id: 'usr_admin_01',
    name: 'AgriLink System Administrator',
    email: 'admin@agrilink.ai',
    role: 'admin',
    phone: '+91 99000 11223',
    location: 'National Operations Center, Delhi NCR',
    fpo_name: 'AgriLink Platform Core',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
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
  },
};

const getLocalRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem('agrilink_registered_users');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveLocalRegisteredUser = (userData) => {
  try {
    const existing = getLocalRegisteredUsers();
    existing[userData.email.toLowerCase()] = userData;
    localStorage.setItem('agrilink_registered_users', JSON.stringify(existing));
  } catch (e) {
    console.error('Error saving local user', e);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('agrilink_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('agrilink_token');
      const storedUser = localStorage.getItem('agrilink_user');
      
      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Refresh profile in background if backend is online
          const res = await authAPI.getMe();
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('agrilink_user', JSON.stringify(res.data));
          }
        } catch (err) {
          // Session verification fallback: keep cached user
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const normalizedEmail = (email || '').toLowerCase().trim();

    try {
      const res = await authAPI.login({ email: normalizedEmail, password });
      const { access_token, user: loggedUser } = res.data;
      localStorage.setItem('agrilink_token', access_token);
      localStorage.setItem('agrilink_user', JSON.stringify(loggedUser));
      setToken(access_token);
      setUser(loggedUser);
      return { success: true, user: loggedUser };
    } catch (err) {
      // Check if backend specifically returned 400/401 credentials error
      if (err.response && err.response.status === 401) {
        return {
          success: false,
          error: err.response?.data?.detail || 'Incorrect email or password.',
        };
      }

      // Check if matches preset demo users for instant offline / client demo mode
      if (PRESET_DEMO_USERS[normalizedEmail]) {
        const demoUser = PRESET_DEMO_USERS[normalizedEmail];
        const dummyToken = `demo_token_${demoUser.role}_${Date.now()}`;
        localStorage.setItem('agrilink_token', dummyToken);
        localStorage.setItem('agrilink_user', JSON.stringify(demoUser));
        setToken(dummyToken);
        setUser(demoUser);
        return { success: true, user: demoUser };
      }

      // Check locally registered users
      const localUsers = getLocalRegisteredUsers();
      if (localUsers[normalizedEmail]) {
        const localUser = localUsers[normalizedEmail];
        if (localUser.password && localUser.password !== password) {
          return { success: false, error: 'Incorrect password for this account.' };
        }
        const dummyToken = `demo_token_${localUser.role}_${Date.now()}`;
        localStorage.setItem('agrilink_token', dummyToken);
        localStorage.setItem('agrilink_user', JSON.stringify(localUser));
        setToken(dummyToken);
        setUser(localUser);
        return { success: true, user: localUser };
      }

      return {
        success: false,
        error: err.response?.data?.detail || 'Unable to sign in. Please verify your credentials or use 1-Click Instant Demo login.',
      };
    }
  };

  const register = async (userData) => {
    const normalizedEmail = (userData.email || '').toLowerCase().trim();
    const payload = {
      ...userData,
      email: normalizedEmail,
    };

    try {
      const res = await authAPI.register(payload);
      const { access_token, user: newUser } = res.data;
      localStorage.setItem('agrilink_token', access_token);
      localStorage.setItem('agrilink_user', JSON.stringify(newUser));
      setToken(access_token);
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      if (err.response && err.response.data?.detail) {
        return {
          success: false,
          error: err.response.data.detail,
        };
      }

      // Offline / Client fallback: save registered user locally and log in
      const avatarUrl = payload.role === 'farmer'
        ? 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23992?w=150&auto=format&fit=crop&q=80'
        : payload.role === 'admin'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : payload.role === 'logistics'
        ? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';

      const newUser = {
        id: `usr_${Date.now()}`,
        name: payload.name || 'AgriLink Member',
        email: normalizedEmail,
        role: payload.role || 'buyer',
        phone: payload.phone || '+91 98000 00000',
        location: payload.location || 'India',
        fpo_name: payload.fpo_name || '',
        avatar: avatarUrl,
        password: payload.password,
        created_at: new Date().toISOString(),
      };

      saveLocalRegisteredUser(newUser);

      const dummyToken = `demo_token_${newUser.role}_${Date.now()}`;
      localStorage.setItem('agrilink_token', dummyToken);
      localStorage.setItem('agrilink_user', JSON.stringify(newUser));
      setToken(dummyToken);
      setUser(newUser);
      return { success: true, user: newUser };
    }
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

