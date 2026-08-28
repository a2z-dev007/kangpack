import { create } from 'zustand';
import { Settings } from '@/types';

interface SettingsStore {
  settings: Settings | null;
  setSettings: (settings: Settings) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useSettings = create<SettingsStore>((set) => ({
  settings: null,
  isLoading: true,
  setSettings: (settings) => set({ settings, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
