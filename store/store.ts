// file: store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice'; // <-- 1. IMPORT THE NEW REDUCER

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        orders: orderReducer, // <-- 2. REGISTER THE REDUCER HERE
    },
});

// These types are crucial for using Redux with TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;