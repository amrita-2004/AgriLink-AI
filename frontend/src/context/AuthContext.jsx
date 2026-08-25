import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

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
          // Refresh profile in background
          const res = await authAPI.getMe();
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('agrilink_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session verification failed, using cached user');
        }
      } else {
        // Auto-login default buyer for instant frictionless evaluation if first time
        // or leave as null for landing page exploration
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      const { access_token, user: loggedUser } = res.data;
      localStorage.setItem('agrilink_token', access_token);
      localStorage.setItem('agrilink_user', JSON.stringify(loggedUser));
      setToken(access_token);
      setUser(loggedUser);
      return { success: true, user: loggedUser };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'Invalid email or password',
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      const { access_token, user: newUser } = res.data;
      localStorage.setItem('agrilink_token', access_token);
      localStorage.setItem('agrilink_user', JSON.stringify(newUser));
      setToken(access_token);
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'Registration failed',
      };
    }
  };

  const quickSwitchRole = async (roleName) => {
    // Helper to instantly login as demo farmer, buyer, or admin
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
