export interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  
  // Pricing & Discounts
  price: number;
  compareAtPrice?: number;
  cost?: number;
  discountType?: 'percentage' | 'fixed' | 'none';
  discountValue?: number;
  discountStartDate?: string;
  discountEndDate?: string;
  finalPrice?: number;
  isOnSale?: boolean;
  
  // Media
  images: string[];
  videos?: string[];
  
  // Category & Organization
  category: Category;
  subcategories?: Category[];
  brand?: string;
  tags?: string[];
  
  // Inventory
  stock: number;
  lowStockThreshold?: number;
  trackQuantity?: boolean;
  allowBackorder?: boolean;
  backorderLimit?: number;
  inventoryPolicy?: 'deny' | 'continue';
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'on_backorder';
  
  // Product Details
  sku: string;
  condition?: 'new' | 'refurbished' | 'used';
  weight?: number;
  weightUnit?: 'kg' | 'g' | 'lb' | 'oz';
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit?: 'cm' | 'm' | 'in' | 'ft';
  };
  

  // test
  // Status & Visibility
  isActive: boolean;
  isFeatured: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  isDigital?: boolean;
  requiresShipping?: boolean;
  
  // Shipping & Tax
  freeShipping?: boolean;
  shippingClass?: string;
  taxable?: boolean;
  taxClass?: string;
  
  // Variants & Attributes
  variants?: ProductVariant[];
  attributes?: { name: string; values: string[] }[];
  
  // Reviews & Ratings
  ratings?: {
    average: number;
    count: number;
  };
  reviewsEnabled?: boolean;
  
  // Additional Info
  specifications?: { name: string; value: string }[];
  warranty?: string;
  returnPolicy?: string;
  
  // SEO
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    canonicalUrl?: string;
  };
  
  // Analytics
  salesCount?: number;
  viewCount?: number;
  wishlistCount?: number;
  
  // Availability
  availableFrom?: string;
  availableUntil?: string;
  
  // Related Products
  relatedProducts?: string[];
  crossSellProducts?: string[];
  upSellProducts?: string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  variantId?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  variantId?: string;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  role: 'admin' | 'user' | 'staff';
  avatar?: string;
  phone?: string;
  addresses?: Address[];
  createdAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface Settings {
  id: string;
  storeName: string;
  storeDescription: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
  freeShippingThreshold?: number;
  email: string;
  phone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  features: {
    enableReviews: boolean;
    enableWishlist: boolean;
    enableCoupons: boolean;
  };
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
