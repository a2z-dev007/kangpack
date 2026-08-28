import api from '@/lib/api';
import { Product, PaginatedResponse, PaginationParams } from '@/types';

export const productsApi = {
  getProducts: async (params?: PaginationParams): Promise<PaginatedResponse<Product>> => {
    const { data } = await api.get('/products', { params });
    return data;
  },

  getProduct: async (slug: string): Promise<Product> => {
    const { data } = await api.get(`/products/slug/${slug}`);
    return data.data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const { data } = await api.get('/products/featured');
    return data.data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const { data } = await api.get('/products/search', { params: { q: query } });
    return data.data;
  },

  // Admin endpoints
  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    const { data } = await api.post('/admin/products', productData);
    return data.data;
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const { data } = await api.put(`/admin/products/${id}`, productData);
    return data.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },
};
