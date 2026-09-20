import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, productsAdminApi, ordersAdminApi, usersAdminApi, couponsAdminApi, inventoryAdminApi, cmsAdminApi, settingsAdminApi, categoriesAdminApi, reviewsAdminApi, paymentsAdminApi, contactsAdminApi, faqsAdminApi, testimonialsAdminApi, AdminFaq, AdminTestimonial } from './api';
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
export const useAdminProducts = (params?: PaginationParams & { isAdmin?: boolean }) => {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => productsAdminApi.getAll(params),
  });
};

export const useAdminProductStats = () => {
  return useQuery({
    queryKey: ['admin', 'products', 'stats'],
    queryFn: productsAdminApi.getStats,
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'stats'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'stats'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'stats'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'stats'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'stats'] });
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
      const msg = error.response?.data?.errors?.[0]?.message || error.response?.data?.message || 'Failed to create coupon';
      toast.error(msg);
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
      const msg = error.response?.data?.errors?.[0]?.message || error.response?.data?.message || 'Failed to update coupon';
      toast.error(msg);
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
      queryClient.invalidateQueries({ queryKey: ['public-settings'] });
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    },
  });
};

// Categories Queries
export const useAdminCategories = (params?: PaginationParams & { search?: string; includeInactive?: boolean }) => {
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

// Reviews Queries
export const useAdminReviews = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['admin', 'reviews', params],
    queryFn: () => reviewsAdminApi.getAll(params),
  });
};

export const useApproveReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewsAdminApi.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Review approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve review');
    },
  });
};

export const useRespondToReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      reviewsAdminApi.respond(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Response added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add response');
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewsAdminApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Review deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    },
  });
};

// Payments Queries
export const useAdminPayments = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['admin', 'payments', params],
    queryFn: () => paymentsAdminApi.getAll(params),
  });
};

export const useUpdatePaymentTransactionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      paymentsAdminApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'payments'] });
      toast.success('Payment status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update payment status');
    },
  });
};

export const useProcessRefund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount, reason }: { id: string; amount: number; reason?: string }) =>
      paymentsAdminApi.processRefund(id, amount, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'payments'] });
      toast.success('Refund processed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to process refund');
    },
  });
};

// Contacts Queries
export const useAdminContacts = (params?: PaginationParams & { status?: string; search?: string }) => {
  return useQuery({
    queryKey: ['admin', 'contacts', params],
    queryFn: () => contactsAdminApi.getAll(params),
  });
};

export const useAdminContactStats = () => {
  return useQuery({
    queryKey: ['admin', 'contacts', 'stats'],
    queryFn: contactsAdminApi.getStats,
  });
};

export const useAdminContact = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'contacts', id],
    queryFn: () => contactsAdminApi.getById(id),
    enabled: !!id,
  });
};

export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, adminNotes }: { id: string; status?: string; adminNotes?: string }) =>
      contactsAdminApi.updateStatus(id, { status, adminNotes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('Contact inquiry updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update contact inquiry');
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactsAdminApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      toast.success('Contact inquiry deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete contact inquiry');
    },
  });
};

// ==========================================
// FAQ Admin Queries & Mutations
// ==========================================
export const useAdminFaqs = (params?: PaginationParams & { category?: string; isActive?: boolean; search?: string }) => {
  return useQuery({
    queryKey: ['admin', 'faqs', params],
    queryFn: () => faqsAdminApi.getAll(params),
  });
};

export const useAdminFaqStats = () => {
  return useQuery({
    queryKey: ['admin', 'faqs', 'stats'],
    queryFn: faqsAdminApi.getStats,
  });
};

export const useAdminFaq = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'faqs', id],
    queryFn: () => faqsAdminApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (faqData: Partial<AdminFaq>) => faqsAdminApi.create(faqData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('FAQ created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create FAQ');
    },
  });
};

export const useUpdateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminFaq> }) => faqsAdminApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('FAQ updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update FAQ');
    },
  });
};

export const useToggleFaqStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => faqsAdminApi.toggleStatus(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success(`FAQ ${data?.isActive ? 'activated' : 'deactivated'}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to toggle FAQ status');
    },
  });
};

export const useReorderFaqs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: string; order: number }[]) => faqsAdminApi.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('FAQs reordered successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reorder FAQs');
    },
  });
};

export const useDeleteFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => faqsAdminApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success('FAQ deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete FAQ');
    },
  });
};

// ==========================================
// Testimonial Admin Queries & Mutations
// ==========================================
export const useAdminTestimonials = (params?: PaginationParams & { rating?: number; isActive?: boolean; search?: string }) => {
  return useQuery({
    queryKey: ['admin', 'testimonials', params],
    queryFn: () => testimonialsAdminApi.getAll(params),
  });
};

export const useAdminTestimonialStats = () => {
  return useQuery({
    queryKey: ['admin', 'testimonials', 'stats'],
    queryFn: testimonialsAdminApi.getStats,
  });
};

export const useAdminTestimonial = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'testimonials', id],
    queryFn: () => testimonialsAdminApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (testimonialData: Partial<AdminTestimonial>) => testimonialsAdminApi.create(testimonialData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create testimonial');
    },
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminTestimonial> }) => testimonialsAdminApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update testimonial');
    },
  });
};

export const useToggleTestimonialStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => testimonialsAdminApi.toggleStatus(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success(`Testimonial ${data?.isActive ? 'activated' : 'deactivated'}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to toggle testimonial status');
    },
  });
};

export const useReorderTestimonials = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: string; order: number }[]) => testimonialsAdminApi.reorder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonials reordered successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reorder testimonials');
    },
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => testimonialsAdminApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete testimonial');
    },
  });
};


