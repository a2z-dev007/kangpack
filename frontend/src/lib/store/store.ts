import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import checkoutReducer from './features/checkout/checkoutSlice';

// Middleware to save cart to localStorage
const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
    const result = next(action);
    if (action.type?.startsWith('cart/')) {
        const cartState = store.getState().cart;
        if (typeof window !== 'undefined') {
            const validItems = (cartState?.items || []).filter(
                (item: any) => item && item.product && typeof item.product === 'object' && item.product.price != null
            );
            localStorage.setItem('cart', JSON.stringify(validItems));
        }
    }
    return result;
};

// Function to load initial state from localStorage
const loadState = () => {
    try {
        if (typeof window === 'undefined') {
            return undefined;
        }
        const serializedState = localStorage.getItem('cart');
        if (serializedState === null) {
            return undefined;
        }
        const parsed = JSON.parse(serializedState);
        const validItems = Array.isArray(parsed)
            ? parsed.filter(
                (item: any) => item && item.product && typeof item.product === 'object' && item.product.price != null
            )
            : [];

        return {
            cart: {
                items: validItems,
                isOpen: false,
                isLoading: false,
                error: null
            }
        };
    } catch (err) {
        return undefined;
    }
};

export const makeStore = () => {
    return configureStore({
        reducer: {
            cart: cartReducer,
            checkout: checkoutReducer,
        },
        preloadedState: loadState(),
        middleware: (getDefaultMiddleware: any) =>
            getDefaultMiddleware().concat(localStorageMiddleware),
    } as any);
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
