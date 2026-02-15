import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, productsAdminApi, ordersAdminApi, usersAdminApi, couponsAdminApi, inventoryAdminApi, cmsAdminApi, settingsAdminApi, categoriesAdminApi } from './api';
import { PaginationParams } from '@/types';
import { toast } from 'sonner';

// Dashboard Queries
export const useDashboardStats = () => {
 return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: adminApi.getDashboardStats,
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'activity'],
    queryFn: adminApi.getRecentActivity,
  });
};

// Products Queries
export const useAdminProducts = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => productsAdminApi.getAll(params),
  });
};

export const useAdminProduct = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'products', id],
    queryFn: () => productsAdminApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsAdminApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => productsAdminApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsAdminApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });
};

export const useBulkUpdateProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsAdminApi.bulkUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Products updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update products');
    },
  });
};

export const useBulkDeleteProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productsAdminApi.bulkDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Products deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete products');
    },
  });
};

// Orders Queries
export const useAdminOrders = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: () => ordersAdminApi.getAll(params),
  });
};

export const useAdminOrder = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'orders', id],
    queryFn: () => ordersAdminApi.getById(id),
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => ordersAdminApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      toast.success('Order status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, paymentStatus }: { id: string; paymentStatus: string }) => ordersAdminApi.updatePaymentStatus(id, paymentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      toast.success('Payment status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update payment status');
    },
  });
};

export const useAddTracking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, trackingNumber, carrier }: { id: string; trackingNumber: string; carrier?: string }) =>
      ordersAdminApi.addTracking(id, trackingNumber, carrier),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      toast.success('Tracking number added');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add tracking');
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => ordersAdminApi.cancelOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      toast.success('Order cancelled');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    },
  });
};

// Users Queries
export const useAdminUsers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => usersAdminApi.getAll(params),
  });
};

export const useAdminUser = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => usersAdminApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersAdminApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => usersAdminApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersAdminApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });
};

// Coupons Queries
export const useAdminCoupons = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['admin', 'coupons', params],
    queryFn: () => couponsAdminApi.getAll(params),
  });
};

export const useAdminCoupon = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'coupons', id],
    queryFn: () => couponsAdminApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: couponsAdminApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      toast.success('Coupon created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => couponsAdminApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      toast.success('Coupon updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update coupon');
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: couponsAdminApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      toast.success('Coupon deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
    },
  });
};

// Settings Queries
export const useAdminSettings = () => {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: settingsAdminApi.get,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsAdminApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    },
  });
};

// Categories Queries
export const useAdminCategories = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['admin', 'categories', params],
    queryFn: () => categoriesAdminApi.getAll(params),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesAdminApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      toast.success('Category created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create category');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => categoriesAdminApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      toast.success('Category updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update category');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoriesAdminApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    },
  });
};
// Inventory Queries
export const useAdminInventory = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['admin', 'inventory', params],
    queryFn: () => inventoryAdminApi.getAll(params),
  });
};

export const useAdjustStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity, reason }: { productId: string; quantity: number; reason: string }) =>
      inventoryAdminApi.adjustStock(productId, quantity, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Stock adjusted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to adjust stock');
    },
  });
};

export const useAddStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity, reason }: { productId: string; quantity: number; reason: string }) =>
      inventoryAdminApi.addStock(productId, quantity, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Stock added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add stock');
    },
  });
};

export const useRemoveStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity, reason }: { productId: string; quantity: number; reason: string }) =>
      inventoryAdminApi.removeStock(productId, quantity, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Stock removed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove stock');
    },
  });
};

// CMS Queries
export const useAdminPages = () => {
  return useQuery({
    queryKey: ['admin', 'pages'],
    queryFn: () => cmsAdminApi.getAll(),
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => cmsAdminApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] });
      toast.success('Page created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create page');
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => cmsAdminApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] });
      toast.success('Page updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update page');
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cmsAdminApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pages'] });
      toast.success('Page deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete page');
    },
  });
};
