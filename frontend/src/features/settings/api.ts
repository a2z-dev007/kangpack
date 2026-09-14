import api from '@/lib/api';
import { Settings } from '@/types';

export const settingsApi = {
  getSettings: async (): Promise<Settings> => {
    const { data } = await api.get('/settings');
    return data.data || data;
  },

  getPublicSettings: async (): Promise<any> => {
    const { data } = await api.get('/settings/public');
    return data.data || data;
  },

  updateSettings: async (settings: Partial<Settings>): Promise<Settings> => {
    const { data } = await api.put('/settings', settings);
    return data.data || data;
  },
};
