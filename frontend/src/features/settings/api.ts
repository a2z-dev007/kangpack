import api from '@/lib/api';
import { Settings } from '@/types';

export const settingsApi = {
  getSettings: async (): Promise<Settings> => {
    const { data } = await api.get('/settings');
    return data;
  },

  updateSettings: async (settings: Partial<Settings>): Promise<Settings> => {
    const { data } = await api.put('/admin/settings', settings);
    return data;
  },
};
