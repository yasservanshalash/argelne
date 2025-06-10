// file: store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import productsReducer from './productsSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        orders: orderReducer,
        products: productsReducer,
    },
});

// These types are crucial for using Redux with TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;