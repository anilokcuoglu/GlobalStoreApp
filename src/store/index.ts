import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import currencyReducer from './slices/currencySlice';

// Redux store'u yapılandır
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    currency: currencyReducer,
  },
  // Development ortamında Redux DevTools'u etkinleştir
//   devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
