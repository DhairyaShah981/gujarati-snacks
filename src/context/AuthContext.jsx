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
      console.log('Starting fetchUser');
      const response = await getProfile();
      console.log('Profile API response:', response);
      
      if (response) {
        console.log('Setting user from profile:', response);
        setUser(response);
        localStorage.setItem('user', JSON.stringify(response));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response?.status === 401) {
        console.log('Unauthorized - clearing user data');
        setUser(null);
        localStorage.removeItem('user');
        // Don't redirect here, let the interceptor handle it
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status');
        const storedUser = localStorage.getItem('user');
        console.log('Stored user:', storedUser);
        
        if (storedUser) {
          console.log('Found stored user, setting in context');
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Only fetch profile if we have a stored user
          try {
            await fetchUser();
          } catch (error) {
            console.error('Error fetching profile:', error);
            // Don't clear user data on profile fetch error
            // Let the interceptor handle token refresh
          }
        } else {
          console.log('No stored user found');
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      console.log('Starting handleLogin in AuthContext');
      setError(null);
      
      // Call login API
      console.log('Calling login API with credentials');
      const response = await login(credentials);
      console.log('Login API response:', response);
      
      // Extract user data from response
      const userData = response.user;
      console.log('Extracted user data:', userData);
      
      if (userData) {
        console.log('Setting user in context:', userData);
        setUser(userData);
        
        // Store user data in localStorage
        console.log('Storing user data in localStorage');
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Don't fetch profile immediately after login
        // The tokens need time to be properly set
        console.log('Login process completed successfully');
        return response;
      } else {
        console.error('No user data received in login response');
        throw new Error('No user data received');
      }
    } catch (err) {
      console.error('Error in handleLogin:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to login';
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
      console.log('Starting logout process');
      await logout();
      console.log('Logout API call successful');
      
      // Clear all data
      setUser(null);
      localStorage.removeItem('user');
      console.log('User data cleared');
    } catch (err) {
      console.error('Error in handleLogout:', err);
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
      const response = await api.post('/api/addresses', addressData);
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
      const response = await api.put(`/api/addresses/${addressId}`, addressData);
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
      const response = await api.delete(`/api/addresses/${addressId}`);
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
      const response = await api.put(`/api/addresses/${addressId}/default`, {});
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