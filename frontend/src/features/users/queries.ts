import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from './api';
import { useAuth } from '@/hooks/use-auth';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from 'sonner';
import { User } from '@/types';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: (userData: Partial<User>) => usersApi.updateProfile(userData),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData([QUERY_KEYS.USER], updatedUser);
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
}
