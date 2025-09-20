import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';

// Redux store'u yapılandır
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
  // Development ortamında Redux DevTools'u etkinleştir
//   devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
