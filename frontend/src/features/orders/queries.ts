import { useQuery } from '@tanstack/react-query';
import { ordersApi } from './api';
import { PaginationParams } from '@/types';

export const useOrders = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.getOrders(params),
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getOrder(id),
    enabled: !!id,
  });
};
