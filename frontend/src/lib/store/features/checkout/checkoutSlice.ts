import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address } from '@/types';

interface CheckoutState {
    currentStep: number;
    shippingAddress: Address | null;
    billingAddress: Address | null;
    paymentMethod: string | null;
    isProcessing: boolean;
    error: string | null;
    orderId: string | null;
}

const initialState: CheckoutState = {
    currentStep: 1, // 1: Info, 2: Shipping, 3: Payment
    shippingAddress: null,
    billingAddress: null,
    paymentMethod: null, // 'stripe', 'cod', etc.
    isProcessing: false,
    error: null,
    orderId: null,
};

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setStep: (state, action: PayloadAction<number>) => {
            state.currentStep = action.payload;
        },
        setShippingAddress: (state, action: PayloadAction<Address>) => {
            state.shippingAddress = action.payload;
        },
        setBillingAddress: (state, action: PayloadAction<Address>) => {
            state.billingAddress = action.payload;
        },
        setPaymentMethod: (state, action: PayloadAction<string>) => {
            state.paymentMethod = action.payload;
        },
        setProcessing: (state, action: PayloadAction<boolean>) => {
            state.isProcessing = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setOrderId: (state, action: PayloadAction<string | null>) => {
            state.orderId = action.payload;
        },
        resetCheckout: (state) => {
            return initialState;
        },
    },
});

export const {
    setStep,
    setShippingAddress,
    setBillingAddress,
    setPaymentMethod,
    setProcessing,
    setError,
    setOrderId,
    resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
