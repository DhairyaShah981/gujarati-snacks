import { createContext, useContext, useState, useEffect } from 'react';
import { login, signup, logout, getProfile } from '../services/api';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await getProfile();
      const userData = response.data?.user || response.data || null;
      setUser(userData);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      setError(null);
      const response = await login(credentials);
      const userData = response.data?.user || response.data || null;
      if (userData) {
        setUser(userData);
        // Fetch profile to ensure we have the latest user data
        await fetchUser();
      }
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to login';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleSignup = async (userData) => {
    try {
      setError(null);
      const response = await signup(userData);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      const newUser = response.data.user || null;
      if (!newUser) {
        throw new Error('User data not received');
      }

      setUser(newUser);
      return response.data;
    } catch (err) {
      console.error('Signup error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to signup';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      setError(null);
      await logout();
      setUser(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to logout';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      // Check if response.data exists and has user property
      const updatedUser = response.data?.user || response.data || null;
      setUser(updatedUser);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Address management functions
  const addAddress = async (addressData) => {
    try {
      const response = await api.post('/addresses', addressData);
      await fetchUser();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add address';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      const response = await api.put(`/addresses/${addressId}`, addressData);
      await fetchUser();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update address';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const response = await api.delete(`/addresses/${addressId}`);
      await fetchUser();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete address';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const response = await api.put(`/addresses/${addressId}/default`, {});
      await fetchUser();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to set default address';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 