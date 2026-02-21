import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  role: 'admin' | 'user' | 'staff';
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('📡 Calling login API...');
    const { data } = await api.post('/auth/login', credentials);
    console.log('📨 Raw response:', data);

    // Backend wraps response in { success, message, data }
    const authData = data.data;
    console.log('📦 Auth data:', authData);
    console.log('👤 User data:', authData.user);
    console.log('🔑 Has accessToken:', !!authData.accessToken);
    console.log('🔄 Has refreshToken:', !!authData.refreshToken);

    if (authData.accessToken) {
      localStorage.setItem('token', authData.accessToken);
      console.log('💾 Token stored');
    }
    if (authData.refreshToken) {
      localStorage.setItem('refreshToken', authData.refreshToken);
      console.log('💾 Refresh token stored');
    }

    // Normalize user data - backend uses firstName/lastName, frontend uses name
    if (authData.user && !authData.user.name && authData.user.firstName) {
      authData.user.name = `${authData.user.firstName} ${authData.user.lastName || ''}`.trim();
      console.log('✏️ Normalized name:', authData.user.name);
    }
    if (authData.user && authData.user._id) {
      authData.user.id = authData.user._id;
      console.log('✏️ Normalized id:', authData.user.id);
    }

    console.log('✅ Returning auth data');
    return authData;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', userData);
    const authData = data.data;
    if (authData.accessToken) {
      localStorage.setItem('token', authData.accessToken);
    }
    if (authData.refreshToken) {
      localStorage.setItem('refreshToken', authData.refreshToken);
    }

    // Normalize user data
    if (authData.user && !authData.user.name && authData.user.firstName) {
      authData.user.name = `${authData.user.firstName} ${authData.user.lastName || ''}`.trim();
    }
    if (authData.user && authData.user._id) {
      authData.user.id = authData.user._id;
    }

    return authData;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get('/auth/profile');
    const user = data.data;

    // Normalize user data
    if (user && !user.name && user.firstName) {
      user.name = `${user.firstName} ${user.lastName || ''}`.trim();
    }
    if (user && user._id) {
      user.id = user._id;
    }

    return user;
  },

  refreshToken: async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refreshToken');
    const { data } = await api.post('/auth/refresh-token', { refreshToken });
    const authData = data.data;
    if (authData.accessToken) {
      localStorage.setItem('token', authData.accessToken);
    }
    if (authData.refreshToken) {
      localStorage.setItem('refreshToken', authData.refreshToken);
    }
    return authData.accessToken;
  },
};

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}
