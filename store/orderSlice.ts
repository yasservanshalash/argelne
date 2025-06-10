// file: store/orderSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from './cartSlice';

export interface Order {
    orderId: string;
    items: CartItem[];
    totalPrice: number;
    orderDate: string; // ISO string format
    deliveryLocation: {
        latitude: number;
        longitude: number;
    };
    addressNotes: string;
    paymentMethod: string;
    status: 'Pending' | 'Confirmed' | 'Out for Delivery' | 'Delivered';
}

interface OrderState {
    history: Order[];
}

const initialState: OrderState = {
    history: [],
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        addOrder: (state, action: PayloadAction<Order>) => {
            // Add the new order to the beginning of the history array
            state.history.unshift(action.payload);
        },
    },
});

export const { addOrder } = orderSlice.actions;
export default orderSlice.reducer;