import axios from 'axios';
import config from '../config';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://gujarati-snacks-api.onrender.com'
  : 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is not 401 or request has already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Get refresh token from cookie
      const refreshToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('refreshToken='))
        ?.split('=')[1];

      if (!refreshToken) {
        console.log('No refresh token found, redirecting to login');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Try to refresh the token
      const response = await api.post('/api/auth/refresh-token', { refreshToken });
      const { accessToken } = response.data;

      // Update access token in cookie
      document.cookie = `accessToken=${accessToken}; path=/; secure; sameSite=none; maxAge=3600000`;

      // Retry the original request
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      // Clear tokens and redirect to login
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'XSRF-TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

// Get CSRF token
const getCsrfToken = async () => {
  try {
    console.log('Getting CSRF token from health endpoint');
    const response = await api.get('/api/health', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    // Log response headers for debugging
    console.log('Health endpoint response headers:', response.headers);
    
    // Get CSRF token from response headers (case insensitive)
    const csrfToken = response.headers['x-csrf-token'] || 
                     response.headers['X-CSRF-Token'] ||
                     response.headers['x-csrf-token']?.toLowerCase() || 
                     response.headers['X-CSRF-Token']?.toLowerCase();
    
    console.log('Received CSRF token from server:', csrfToken);
    
    if (csrfToken) {
      // Set CSRF token in cookie with proper options
      const cookieString = `XSRF-TOKEN=${csrfToken}; path=/; secure; samesite=none`;
      document.cookie = cookieString;
      console.log('Setting cookie with string:', cookieString);
      
      // Verify the cookie was set correctly
      const allCookies = document.cookie;
      console.log('All cookies after setting:', allCookies);
      
      // Verify the token was set correctly
      const tokenFromCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      
      console.log('Verified token from cookies:', tokenFromCookie);
      return csrfToken;
    }
    return null;
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    return null;
  }
};

// Add request interceptor for tokens
api.interceptors.request.use(
  async (config) => {
    // Skip token checks for health endpoint
    if (config.url === '/api/health') {
      return config;
    }

    // Skip token checks for login/signup requests
    if (config.url === '/api/auth/login' || config.url === '/api/auth/signup') {
      return config;
    }

    // Get access token from cookie
    const accessToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Get CSRF token from cookie
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = async (credentials) => {
  try {
    console.log('Starting login process');
    // First, get a CSRF token
    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      throw new Error('Failed to get CSRF token');
    }
    
    // Then make the login request with CSRF token
    console.log('Making login request with credentials');
    const response = await api.post('/api/auth/login', credentials, {
      headers: {
        'X-CSRF-Token': csrfToken
      }
    });
    
    // Set both access and refresh tokens
    const { accessToken, refreshToken, user } = response.data;
    
    // Set access token cookie
    document.cookie = `accessToken=${accessToken}; path=/; secure; sameSite=none; maxAge=3600000`;
    
    // Set refresh token cookie
    document.cookie = `refreshToken=${refreshToken}; path=/; secure; sameSite=none; maxAge=604800000`;
    
    console.log('Login successful, tokens set');
    
    // Return user data directly from login response
    return { user, accessToken, refreshToken };
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const signup = async (userData) => {
  try {
    console.log('Starting signup process');
    // First, get a CSRF token
    await getCsrfToken();
    
    // Then make the signup request
    console.log('Making signup request with user data:', userData);
    const response = await api.post('/api/auth/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error.response?.data || { message: 'Signup failed' };
  }
};

export const logout = async () => {
  try {
    await api.post('/api/auth/logout');
    // Clear all tokens
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'XSRF-TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  } catch (error) {
    console.error('Logout error:', error);
    throw error.response?.data || { message: 'Logout failed' };
  }
};

export const getProfile = async () => {
  try {
    console.log('Fetching user profile');
    const response = await api.get('/api/auth/profile');
    console.log('Profile API response:', response.data);
    
    if (!response.data) {
      console.error('No user data received from profile API');
      throw new Error('No user data received');
    }
    
    // Return the user data directly
    return response.data.user || response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    if (error.response?.status === 401) {
      console.log('Unauthorized - clearing tokens');
      // Clear any existing user data
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      // Clear tokens
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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
  return api.get(`/api/products${queryString ? `?${queryString}` : ''}`);
};

export const getProduct = (id) => api.get(`/api/products/${id}`);

// Cart APIs
export const getCart = () => api.get('/api/cart');
export const addToCart = (productId, quantity = 1) => 
  api.post('/api/cart/add', { productId, quantity });
export const updateCartItem = (productId, quantity) => 
  api.put('/api/cart/update', { productId, quantity });
export const removeFromCart = (productId) => 
  api.delete(`/api/cart/remove/${productId}`);
export const clearCart = () => api.delete('/api/cart/clear');

// Favorites APIs
export const getFavorites = () => api.get('/api/favorites');
export const addToFavorites = (productId) => 
  api.post('/api/favorites/add', { productId });
export const removeFromFavorites = (productId) => 
  api.delete(`/api/favorites/remove/${productId}`);
export const checkFavorite = (productId) => 
  api.get(`/api/favorites/check/${productId}`);

// Address APIs
export const getAddresses = () => api.get('/api/addresses');
export const addAddress = (address) => api.post('/api/addresses', address);
export const updateAddress = (id, address) => api.put(`/api/addresses/${id}`, address);
export const deleteAddress = (id) => api.delete(`/api/addresses/${id}`);
export const setDefaultAddress = (id) => api.put(`/api/addresses/${id}/default`);

// Order APIs
export const createOrder = (orderData) => api.post('/api/orders', orderData);
export const getOrders = () => api.get('/api/orders/myorders');
export const getOrder = (id) => api.get(`/api/orders/${id}`);

export const updateProfile = (userData) => api.put('/api/auth/profile', userData);

export default api; 