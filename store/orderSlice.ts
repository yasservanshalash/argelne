// file: store/orderSlice.ts

import { FirebaseOrder, ordersService } from '@/services/firebase';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
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
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    history: [],
    loading: false,
    error: null,
};

// Async thunks for Firebase operations
export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData: Omit<FirebaseOrder, 'id' | 'orderDate'>, { rejectWithValue }) => {
        try {
            const orderId = await ordersService.add(orderData);
            return { id: orderId, ...orderData };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to create order');
        }
    }
);

export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async (userId: string | undefined, { rejectWithValue }) => {
        try {
            const orders = await ordersService.getUserOrders(userId);
            // Convert Firebase orders to local Order format
            return orders.map(order => ({
                orderId: order.orderId,
                items: order.items,
                totalPrice: order.totalPrice,
                orderDate: order.orderDate.toDate().toISOString(),
                deliveryLocation: order.deliveryLocation,
                addressNotes: order.addressNotes,
                paymentMethod: order.paymentMethod,
                status: order.status,
            })) as Order[];
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch orders');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        addOrder: (state, action: PayloadAction<Order>) => {
            // Add the new order to the beginning of the history array
            state.history.unshift(action.payload);
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                // Convert Firebase order to local format and add to history
                const order: Order = {
                    orderId: action.payload.orderId,
                    items: action.payload.items,
                    totalPrice: action.payload.totalPrice,
                    orderDate: new Date().toISOString(),
                    deliveryLocation: action.payload.deliveryLocation,
                    addressNotes: action.payload.addressNotes,
                    paymentMethod: action.payload.paymentMethod,
                    status: action.payload.status,
                };
                state.history.unshift(order);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch orders
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.loading = false;
                state.history = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { addOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;