import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
// Redux store'u yapılandır
export const store = configureStore({
  reducer: {
    products: productsReducer,
  },
  // Development ortamında Redux DevTools'u etkinleştir
//   devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
