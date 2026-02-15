export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug: string) => `/product/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/profile',
  DASHBOARD: '/profile/dashboard',
  ORDERS: '/profile/orders',
  ADDRESSES: '/profile/addresses',
  WISHLIST: '/profile/wishlist',

  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_COUPONS: '/admin/coupons',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CATEGORIES: 'categories',
  CART: 'cart',
  ORDERS: 'orders',
  USER: 'user',
  SETTINGS: 'settings',
  CUSTOMERS: 'customers',
  COUPONS: 'coupons',
} as const;

export const STORAGE_KEYS = {
  CART: 'cart',
  WISHLIST: 'wishlist',
  THEME: 'theme',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;
