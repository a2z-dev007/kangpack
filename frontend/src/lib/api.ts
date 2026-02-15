import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL, ROUTES } from './constants';

// Helper function to transform MongoDB _id to id
function transformMongoResponse(data: any): any {
  if (Array.isArray(data)) {
    return data.map(item => transformMongoResponse(item));
  }
  
  if (data && typeof data === 'object') {
    const transformed: any = {};
    
    for (const key in data) {
      if (key === '_id') {
        transformed.id = data[key];
      } else if (key === 'data' && (Array.isArray(data[key]) || typeof data[key] === 'object')) {
        transformed[key] = transformMongoResponse(data[key]);
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        transformed[key] = transformMongoResponse(data[key]);
      } else {
        transformed[key] = data[key];
      }
    }
    
    return transformed;
  }
  
  return data;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Helper to get or create session ID for guest users
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem('guest_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15);
    localStorage.setItem('guest_session_id', sessionId);
  }
  return sessionId;
}

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Always include session ID for cart/order guest tracking
    if (config.headers) {
      config.headers['x-session-id'] = getSessionId();
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Transform _id to id for MongoDB documents
    if (response.data) {
      response.data = transformMongoResponse(response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login')) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(
          `${API_URL}/auth/refresh-token`,
          { refreshToken },
          { 
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
          }
        );

        const authData = data.data;
        if (authData.accessToken) {
          localStorage.setItem('token', authData.accessToken);
          if (authData.refreshToken) {
            localStorage.setItem('refreshToken', authData.refreshToken);
          }
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${authData.accessToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = ROUTES.LOGIN;
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// API Error Handler
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
}
