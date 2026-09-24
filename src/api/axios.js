import axios from 'axios';

// En desarrollo, Vite hace proxy de /api → localhost:4000/api
// En producción, VITE_API_URL debe apuntar al dominio del backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Importante para enviar Cookies HttpOnly
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para inyectar token de autorización si está en localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptores para manejar errores globales
api.interceptors.response.use(
  (response) => {
    // Si la respuesta incluye un token, guardarlo automáticamente
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado o inválido
      // localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
