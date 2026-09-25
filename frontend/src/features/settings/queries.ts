import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from './api';
import { toast } from '@/lib/toast';
import { Settings } from '@/types';

export const usePublicSettings = () => {
  return useQuery({
    queryKey: ['public-settings'],
    queryFn: settingsApi.getPublicSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.getSettings,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Partial<Settings>) => settingsApi.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['public-settings'] });
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    },
  });
};
