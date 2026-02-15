import api from '@/lib/api';
import { Order, PaginatedResponse, PaginationParams } from '@/types';

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    variantId?: string;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  couponCode?: string;
  notes?: string;
}

export const ordersApi = {
  getOrders: async (params?: PaginationParams): Promise<PaginatedResponse<Order>> => {
    const { data } = await api.get('/orders', { params });
    return data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },

  // Admin endpoints
  getAllOrders: async (params?: PaginationParams): Promise<PaginatedResponse<Order>> => {
    const { data } = await api.get('/admin/orders', { params });
    return data;
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const { data } = await api.patch(`/admin/orders/${id}/status`, { status });
    return data;
  },

  updatePaymentStatus: async (id: string, paymentStatus: string): Promise<Order> => {
    const { data } = await api.patch(`/admin/orders/${id}/payment-status`, { paymentStatus });
    return data;
  },
};
