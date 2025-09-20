import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/product.types';
import { productsApi } from '../../services/api/products';

// State interface'ini tanımla
interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
}

// Initial state
const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
};

// Async Thunk - API çağrıları için
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    return await productsApi.getAllProducts();
  },
);

// Tek bir ürün getir
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number) => {
    return await productsApi.getProduct(id);
  },
);

// Products Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Synchronous actions
    clearError: state => {
      state.error = null;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    clearProducts: state => {
      state.products = [];
    },
  },
  extraReducers: builder => {
    // fetchProducts için reducer'lar
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ürünler yüklenemedi';
      })
      // fetchProductById için reducer'lar
      .addCase(fetchProductById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ürün yüklenemedi';
      });
  },
});

// Actions'ları export et
export const { clearError, setSelectedProduct, clearProducts } =
  productsSlice.actions;

// Reducer'ı export et
export default productsSlice.reducer;
