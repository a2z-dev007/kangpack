import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CartItem, Product } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    isLoading: boolean;
    error: string | null;
}

// Async Thunks
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/carts');
            return response.data.data.items;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ product, quantity, variantId }: { product: Product; quantity: number; variantId?: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/carts/items', {
                productId: product.id,
                quantity,
                variantId
            });
            // Optimistic return or use backend response
            // The backend returns the updated cart. We can use that or just the item.
            // For smoother UI, we'll return the input data and let extraReducers handle it, 
            // but ideally we sync with backend response.
            return { product, quantity, variantId, cart: response.data.data }; 
        } catch (error: any) {
             toast.error(error.response?.data?.message || 'Failed to add to cart');
            return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ productId, quantity, variantId }: { productId: string; quantity: number; variantId?: string }, { rejectWithValue }) => {
        try {
            await api.put(`/carts/items/${productId}`, {
                quantity,
                variantId
            });
            return { productId, quantity, variantId };
        } catch (error: any) {
             toast.error(error.response?.data?.message || 'Failed to update cart');
            return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
        }
    }
);

export const removeCartItem = createAsyncThunk(
    'cart/removeCartItem',
    async ({ productId, variantId }: { productId: string; variantId?: string }, { rejectWithValue }) => {
        try {
            await api.delete(`/carts/items/${productId}`, {
               params: { variantId }
            });
            return { productId, variantId };
        } catch (error: any) {
             toast.error(error.response?.data?.message || 'Failed to remove from cart');
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
        }
    }
);

export const clearCartAsync = createAsyncThunk(
    'cart/clearCartAsync',
    async (_, { rejectWithValue }) => {
        try {
             await api.delete('/carts');
             return;
        } catch (error: any) {
             return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
        }
    }
);


const initialState: CartState = {
    items: [],
    isOpen: false,
    isLoading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Local reducers (if you want to keep them for optimistic updates, or remove them in favor of extraReducers)
        // We will repurpose them or rely on extraReducers. 
        // For this implementation, let's rely on extraReducers for syncing.
        
        clearCart: (state) => {
            state.items = [];
        },
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
        setCartOpen: (state, action: PayloadAction<boolean>) => {
            state.isOpen = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch Cart
        builder.addCase(fetchCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchCart.fulfilled, (state, action) => {
            state.isLoading = false;
            // Map backend items to frontend structure if needed
            // Backend returns: { product: {...}, quantity: 5, variantId, ... }
            // Frontend expects: { productId, product: {...}, quantity, variantId }
            // It seems the backend `Cart` model has `items: [{ product: Schema.Types.ObjectId, ... }]`
            // But checking `CartsController.getCart` -> populated 'items.product'
            // So `action.payload` is an array of items where `product` is an object.
            
            state.items = action.payload.map((item: any) => ({
                productId: item.product._id || item.product.id,
                product: item.product,
                quantity: item.quantity,
                variantId: item.variant // Note: Backend uses 'variant', frontend 'variantId' - check consistency
            }));
        });
        builder.addCase(fetchCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        builder.addCase(addToCart.fulfilled, (state, action) => {
            const { product, quantity, variantId } = action.payload;
            const existingItem = state.items.find(
                (item) => item.productId === product.id && (item.variantId || null) === (variantId || null)
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({
                    productId: product.id,
                    product,
                    quantity,
                    variantId,
                });
            }
        });

        // Update Item
        builder.addCase(updateCartItem.fulfilled, (state, action) => {
            const { productId, quantity, variantId } = action.payload;
            if (quantity <= 0) {
                state.items = state.items.filter(
                    (item) => !(item.productId === productId && (item.variantId || null) === (variantId || null))
                );
            } else {
                const item = state.items.find(
                    (item) => item.productId === productId && (item.variantId || null) === (variantId || null)
                );
                if (item) {
                    item.quantity = quantity;
                }
            }
        });

        // Remove Item
        builder.addCase(removeCartItem.fulfilled, (state, action) => {
             state.items = state.items.filter(
                (item) => !(item.productId === action.payload.productId && (item.variantId || null) === (action.payload.variantId || null))
            );
            toast.success('Removed from cart');
        });

        // Clear CartAsync
        builder.addCase(clearCartAsync.fulfilled, (state) => {
            state.items = [];
        });
    },
});

export const { clearCart, toggleCart, setCartOpen } = cartSlice.actions;
export default cartSlice.reducer;
