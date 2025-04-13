import axios from 'axios';
import config from '../config';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://gujarati-snacks-api.onrender.com/api'
  : 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    
    const originalRequest = error.config;

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await api.post('/auth/refresh-token');
        const { accessToken } = response.data;

        // Update the access token in the cookie
        document.cookie = `accessToken=${accessToken}; path=/; secure; sameSite=none`;

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Add request interceptor for tokens
api.interceptors.request.use(
  async (config) => {
    // Get CSRF token from cookie
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Get access token from cookie
    const accessToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get CSRF token
const getCsrfToken = async () => {
  try {
    await api.get('/health');
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    throw error;
  }
};

// Auth APIs
export const login = async (credentials) => {
  try {
    // First, get a CSRF token
    await getCsrfToken();
    
    // Then make the login request
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const signup = async (userData) => {
  try {
    // First, get a CSRF token
    await getCsrfToken();
    
    // Then make the signup request
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error.response?.data || { message: 'Signup failed' };
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
    // Clear cookies
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'XSRF-TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  } catch (error) {
    console.error('Logout error:', error);
    throw error.response?.data || { message: 'Logout failed' };
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    if (!response.data) {
      throw new Error('No user data received');
    }
    return response.data.user || response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    if (error.response?.status === 401) {
      // Clear any existing user data
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      throw new Error('Session expired. Please login again.');
    }
    throw error;
  }
};

// Product APIs
export const getProducts = (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.category) queryParams.append('category', params.category);
  if (params.search) queryParams.append('search', params.search);
  if (params.sort) queryParams.append('sort', params.sort);
  
  const queryString = queryParams.toString();
  return api.get(`/products${queryString ? `?${queryString}` : ''}`);
};
export const getProduct = (id) => api.get(`/products/${id}`);

// Cart APIs
export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity = 1) => 
  api.post('/cart/add', { productId, quantity });
export const updateCartItem = (productId, quantity) => 
  api.put('/cart/update', { productId, quantity });
export const removeFromCart = (productId) => 
  api.delete(`/cart/remove/${productId}`);
export const clearCart = () => api.delete('/cart/clear');

// Favorites APIs
export const getFavorites = () => api.get('/favorites');
export const addToFavorites = (productId) => 
  api.post('/favorites/add', { productId });
export const removeFromFavorites = (productId) => 
  api.delete(`/favorites/remove/${productId}`);
export const checkFavorite = (productId) => 
  api.get(`/favorites/check/${productId}`);

// Address APIs
export const getAddresses = () => api.get('/addresses');
export const addAddress = (address) => api.post('/addresses', address);
export const updateAddress = (id, address) => api.put(`/addresses/${id}`, address);
export const deleteAddress = (id) => api.delete(`/addresses/${id}`);
export const setDefaultAddress = (id) => api.put(`/addresses/${id}/default`);

// Order APIs
export const createOrder = (orderData) => api.post('/orders', orderData);
export const getOrders = () => api.get('/orders/myorders');
export const getOrder = (id) => api.get(`/orders/${id}`);

export const updateProfile = (userData) => api.put('/auth/profile', userData);

export default api; 