import { useState, useCallback } from 'react';
import api, { handleApiError } from '@/lib/api';
import { Address, ApiResponse, User } from '@/types';
import { useAuth } from './use-auth';
import { toast } from 'sonner';

export function useProfile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse<User>>('/auth/profile');
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const addAddress = async (address: Omit<Address, 'id'>) => {
    setLoading(true);
    try {
      const response = await api.post<ApiResponse<User>>('/users/profile/addresses', address);
      if (response.data.success) {
        setUser(response.data.data);
        toast.success('Address added successfully');
        return true;
      }
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
    return false;
  };

  const updateAddress = async (addressId: string, address: Address) => {
    setLoading(true);
    try {
      const response = await api.put<ApiResponse<User>>(`/users/profile/addresses/${addressId}`, address);
      if (response.data.success) {
        setUser(response.data.data);
        toast.success('Address updated successfully');
        return true;
      }
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
    return false;
  };

  const deleteAddress = async (addressId: string) => {
    setLoading(true);
    try {
      const response = await api.delete<ApiResponse<User>>(`/users/profile/addresses/${addressId}`);
      if (response.data.success) {
        setUser(response.data.data);
        toast.success('Address deleted successfully');
        return true;
      }
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
    return false;
  };

  const updateProfile = async (data: Partial<User>) => {
    setLoading(true);
    try {
      const response = await api.put<ApiResponse<User>>('/users/profile/update', data);
      if (response.data.success) {
        setUser(response.data.data);
        toast.success('Profile updated successfully');
        return true;
      }
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
    return false;
  };

  return {
    user,
    loading,
    fetchProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    updateProfile,
  };
}
