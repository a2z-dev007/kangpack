import api from '@/lib/api';
import { Category, PaginatedResponse, PaginationParams } from '@/types';

export const categoriesApi = {
    getCategories: async (params?: PaginationParams): Promise<PaginatedResponse<Category>> => {
        const { data } = await api.get('/categories', { params });
        return data;
    },

    getCategoryBySlug: async (slug: string): Promise<Category> => {
        const { data } = await api.get(`/categories/slug/${slug}`);
        return data.data;
    },

    getCategoryTree: async (): Promise<Category[]> => {
        const { data } = await api.get('/categories/tree');
        return data.data;
    },
};
