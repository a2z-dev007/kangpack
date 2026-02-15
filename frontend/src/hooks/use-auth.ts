import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

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
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isAdmin: user?.role === 'admin',
        }),
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false, isAdmin: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
