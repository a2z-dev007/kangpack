import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { handleApiError } from '@/lib/api';
import { Product, ApiResponse } from '@/types';
import { toast } from 'sonner';
import { QUERY_KEYS } from '@/lib/constants';
import { useAuth } from './use-auth';

export function useWishlist() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data: wishlist = [], isLoading: loading, refetch: fetchWishlist } = useQuery({
    queryKey: [QUERY_KEYS.WISHLIST],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Product[]>>('/users/profile/wishlist');
      return response.data.data;
    },
    enabled: isAuthenticated,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.post<ApiResponse<any>>('/users/profile/wishlist', { productId });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Added to wishlist');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WISHLIST] });
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.delete<ApiResponse<any>>(`/users/profile/wishlist/${productId}`);
      return response.data;
    },
    onSuccess: (_, productId) => {
      toast.success('Removed from wishlist');
      // Optimistically update the cache
      queryClient.setQueryData([QUERY_KEYS.WISHLIST], (old: Product[] | undefined) => {
        return old?.filter(item => (item.id !== productId && item._id !== productId)) || [];
      });
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });

  const clearWishlistMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete<ApiResponse<any>>('/users/profile/wishlist');
      return response.data;
    },
    onSuccess: () => {
      toast.success('Wishlist cleared');
      queryClient.setQueryData([QUERY_KEYS.WISHLIST], []);
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });

  return {
    wishlist,
    wishlistIds: wishlist.map(item => item.id || item._id),
    loading,
    fetchWishlist,
    addToWishlist: addToWishlistMutation.mutateAsync,
    removeFromWishlist: removeFromWishlistMutation.mutateAsync,
    clearWishlist: clearWishlistMutation.mutateAsync,
    isInWishlist: (productId: string) => wishlist.some(item => item.id === productId || item._id === productId),
  };
}
