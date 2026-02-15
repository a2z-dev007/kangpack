import api from '@/lib/api';
import { PaginatedResponse, PaginationParams } from '@/types';

// Dashboard Stats
export interface DashboardStats {
  users: {
    total: number;
    newThisMonth: number;
    activeUsers: number;
  };
  products: {
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    revenue: number;
  };
  payments: {
    totalRevenue: number;
    pendingAmount: number;
    refundedAmount: number;
  };
}

export interface RecentActivity {
  orders: any[];
  users: any[];
}

// Stats APIs
export const adminApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const [users, products, orders, payments] = await Promise.all([
      api.get('/users/stats'),
      api.get('/products/admin/stats'),
      api.get('/orders/stats'),
      api.get('/payments/stats'),
    ]);

    return {
      users: users.data.data,
      products: products.data.data,
      orders: orders.data.data,
      payments: payments.data.data,
    };
  },

  getRecentActivity: async (): Promise<RecentActivity> => {
    const [orders, users] = await Promise.all([
      api.get('/orders', { params: { limit: 5, sort: 'createdAt', order: 'desc' } }),
      api.get('/users', { params: { limit: 5, sort: 'createdAt', order: 'desc' } }),
    ]);

    return {
      orders: orders.data.data,
      users: users.data.data,
    };
  },
};

// Products Admin APIs
export const productsAdminApi = {
  getAll: async (params?: PaginationParams) => {
    const { data } = await api.get('/products', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/products/${id}`);
    return data.data;
  },

  create: async (productData: FormData) => {
    const { data } = await api.post('/products', productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  update: async (id: string, productData: FormData) => {
    const { data } = await api.put(`/products/${id}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  bulkUpdate: async (updates: { ids: string[]; updates: any }) => {
    const { data } = await api.put('/products/bulk/update', updates);
    return data;
  },

  bulkDelete: async (ids: string[]) => {
    const { data } = await api.delete('/products/bulk/delete', { data: { ids } });
    return data;
  },
};

// Orders Admin APIs
export const ordersAdminApi = {
  getAll: async (params?: PaginationParams) => {
    const { data } = await api.get('/orders', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/orders/${id}`);
    return data.data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    return data.data;
  },

  updatePaymentStatus: async (id: string, paymentStatus: string) => {
    const { data } = await api.put(`/orders/${id}/payment`, { paymentStatus });
    return data.data;
  },

  addTracking: async (id: string, trackingNumber: string, carrier?: string) => {
    const { data } = await api.put(`/orders/${id}/tracking`, { trackingNumber, carrier });
    return data.data;
  },

  cancelOrder: async (id: string, reason?: string) => {
    const { data } = await api.post(`/orders/${id}/cancel`, { reason });
    return data.data;
  },
};

// Users Admin APIs
export const usersAdminApi = {
  getAll: async (params?: PaginationParams) => {
    const { data } = await api.get('/users', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/users/${id}`);
    return data.data;
  },

  create: async (userData: any) => {
    const { data } = await api.post('/users', userData);
    return data.data;
  },

  update: async (id: string, userData: any) => {
    const { data } = await api.put(`/users/${id}`, userData);
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};

// Coupons Admin APIs
export const couponsAdminApi = {
  getAll: async (params?: PaginationParams) => {
    const { data } = await api.get('/coupons', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/coupons/${id}`);
    return data.data;
  },

  create: async (couponData: any) => {
    const { data } = await api.post('/coupons', couponData);
    return data.data;
  },

  update: async (id: string, couponData: any) => {
    const { data } = await api.put(`/coupons/${id}`, couponData);
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/coupons/${id}`);
    return data;
  },

  validate: async (code: string) => {
    const { data } = await api.post('/coupons/validate', { code });
    return data.data;
  },
};

// Inventory Admin APIs
export const inventoryAdminApi = {
  getAll: async (params?: PaginationParams) => {
    const { data } = await api.get('/inventory', { params });
    return data;
  },

  getByProduct: async (productId: string) => {
    const { data } = await api.get(`/inventory/product/${productId}`);
    return data.data;
  },

  adjustStock: async (productId: string, quantity: number, reason: string) => {
    const { data } = await api.post('/inventory/adjust', { productId, quantity, reason });
    return data.data;
  },

  addStock: async (productId: string, quantity: number, reason: string) => {
    const { data } = await api.post('/inventory/add', { productId, quantity, reason });
    return data.data;
  },

  removeStock: async (productId: string, quantity: number, reason: string) => {
    const { data } = await api.post('/inventory/remove', { productId, quantity, reason });
    return data.data;
  },
};

// CMS Admin APIs
export const cmsAdminApi = {
  getAll: async (params?: PaginationParams) => {
    const { data } = await api.get('/cms', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/cms/${id}`);
    return data.data;
  },

  create: async (pageData: any) => {
    const { data } = await api.post('/cms', pageData);
    return data.data;
  },

  update: async (id: string, pageData: any) => {
    const { data } = await api.put(`/cms/${id}`, pageData);
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/cms/${id}`);
    return data;
  },

  publish: async (id: string) => {
    const { data } = await api.post(`/cms/${id}/publish`);
    return data.data;
  },

  unpublish: async (id: string) => {
    const { data } = await api.post(`/cms/${id}/unpublish`);
    return data.data;
  },
};

// Settings Admin APIs
export const settingsAdminApi = {
  get: async () => {
    const { data } = await api.get('/settings');
    return data.data;
  },

  update: async (settings: any) => {
    const { data } = await api.put('/settings', settings);
    return data.data;
  },
};

// Categories Admin APIs
export const categoriesAdminApi = {
  getAll: async (params?: PaginationParams) => {
    const { data } = await api.get('/categories', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/categories/${id}`);
    return data.data;
  },

  create: async (categoryData: any) => {
    const { data } = await api.post('/categories', categoryData);
    return data.data;
  },

  update: async (id: string, categoryData: any) => {
    const { data } = await api.put(`/categories/${id}`, categoryData);
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },
};
