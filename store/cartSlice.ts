// file: store/cartSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of a single item in our cart
export interface CartItem {
    cartId: string; // A unique ID for this specific item in the cart
    id: string; // The original product ID
    name: string;
    imageUrl: string;
    quantity: number;
    headType: string;
    extraCoals: number;
    price: number; // The calculated price for this specific configuration
}

// Define the shape of the entire cart state
interface CartState {
    items: CartItem[];
}

// The initial state is an empty cart
const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // This is where the 'addItem' action creator is generated
        addItem: (state, action: PayloadAction<CartItem>) => {
            state.items.push(action.payload);
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.cartId !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        },
    }
});

// This line is CRITICAL. It makes the actions available for import.
export const { addItem, removeItem, clearCart } = cartSlice.actions;

// This line exports the reducer function to be used in the store.
export default cartSlice.reducer;