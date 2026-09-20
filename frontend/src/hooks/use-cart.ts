import { create } from 'zustand';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()((set, get) => ({
  items: typeof window !== 'undefined' 
    ? (() => {
        try {
          const parsed = JSON.parse(localStorage.getItem('cart') || '[]');
          return Array.isArray(parsed)
            ? parsed.filter((item: any) => item && item.product && typeof item.product === 'object' && item.product.price != null)
            : [];
        } catch {
          return [];
        }
      })()
    : [],

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.productId === product.id);

      let newItems;
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { productId: product.id, product, quantity }];
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(newItems));
      }

      return { items: newItems };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.productId !== productId);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(newItems));
      }

      return { items: newItems };
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set((state) => {
      const newItems = state.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );

      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(newItems));
      }

      return { items: newItems };
    });
  },

  clearCart: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce((total, item) => {
      return total + (item.product?.price || 0) * (item.quantity || 1);
    }, 0);
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
