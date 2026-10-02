import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { clearAuthCookie, setAuthCookie } from '@/lib/auth-cookie';

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  logout: () => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      setUser: (user) => {
        if (user && typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) setAuthCookie(token);
        }
        set({
          user,
          isAuthenticated: !!user,
          isAdmin: user?.role === 'admin',
        });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        clearAuthCookie();
        set({ user: null, isAuthenticated: false, isAdmin: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
