import axios from 'axios';

// ─────────────────────────────────────
// API SERVICE WITH SECURE TOKEN HANDLING
// ─────────────────────────────────────

// Token storage in memory (NOT localStorage) for security
let accessToken = null;

// Create axios instance pointing to our backend
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  withCredentials: true // Send cookies (httpOnly refresh tokens)
});

// Request interceptor: Attach access token to every request
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle token expiration & refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint (httpOnly cookie automatically sent)
        const refreshResponse = await axios.post(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Update token in memory
        accessToken = refreshResponse.data.accessToken;

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        accessToken = null;
        localStorage.removeItem('staff');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ─── LOGIN FUNCTION ───
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    // Store access token in memory
    accessToken = response.data.accessToken;
    
    // Store staff info in localStorage (safe, non-sensitive)
    localStorage.setItem('staff', JSON.stringify(response.data.staff));
    
    return response.data;
  } catch (error) {
    // Don't expose internal errors to user
    throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
  }
};

// ─── REGISTER FUNCTION ───
export const register = async ({ restaurantName, adminName, email, password }) => {
  try {
    const response = await api.post('/auth/register', { restaurantName, adminName, email, password });
    accessToken = response.data.accessToken;
    localStorage.setItem('staff', JSON.stringify(response.data.staff));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
  }
};

// ─── LOGOUT FUNCTION ───
export const logout = async () => {
  try {
    await axios.post(
      `${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/auth/logout`,
      {},
      { withCredentials: true }
    );
  } catch {
    // Clear client state regardless of server response
  }
  accessToken = null;
  localStorage.removeItem('staff');
};

// ─── GET STORED ACCESS TOKEN ───
export const getAccessToken = () => accessToken;

// ─── SET ACCESS TOKEN ───
export const setAccessToken = (token) => {
  accessToken = token;
};

// ─── RESTORE SESSION ───
export const restoreSession = () => {
  try {
    const staff = localStorage.getItem('staff');
    return staff ? JSON.parse(staff) : null;
  } catch {
    localStorage.removeItem('staff');
    return null;
  }
};

export default api;
