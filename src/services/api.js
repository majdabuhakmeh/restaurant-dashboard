import axios from 'axios';

// Create axios instance pointing to our backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
