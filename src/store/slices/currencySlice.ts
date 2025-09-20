import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { StorageService } from '../../utils/storage';

export type Currency = 'USD' | 'EUR' | 'TRY';

export interface CurrencyState {
  selectedCurrency: Currency;
  exchangeRates: {
    USD: number;
    EUR: number;
    TRY: number;
  };
  lastUpdated: number | null;
  isLoading: boolean;
}

export const loadCurrencyFromStorage = createAsyncThunk(
  'currency/loadFromStorage',
  async (): Promise<Currency> => {
    const savedCurrency = await StorageService.getSelectedCurrency();
    return (savedCurrency as Currency) || 'USD';
  },
);

export const saveCurrencyToStorage = createAsyncThunk(
  'currency/saveToStorage',
  async (currency: Currency): Promise<Currency> => {
    await StorageService.setSelectedCurrency(currency);
    return currency;
  },
);

const initialState: CurrencyState = {
  selectedCurrency: 'USD',
  exchangeRates: {
    USD: 1,
    EUR: 0.85,
    TRY: 30.5,
  },
  lastUpdated: null,
  isLoading: false,
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<Currency>) => {
      state.selectedCurrency = action.payload;
    },
    updateExchangeRates: (
      state,
      action: PayloadAction<{ USD: number; EUR: number; TRY: number }>,
    ) => {
      state.exchangeRates = action.payload;
      state.lastUpdated = Date.now();
    },
  },
  extraReducers: builder => {
    builder
      // Load currency from storage
      .addCase(loadCurrencyFromStorage.pending, state => {
        state.isLoading = true;
      })
      .addCase(loadCurrencyFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCurrency = action.payload;
      })
      .addCase(loadCurrencyFromStorage.rejected, state => {
        state.isLoading = false;
      })
      // Save currency to storage
      .addCase(saveCurrencyToStorage.pending, state => {
        state.isLoading = true;
      })
      .addCase(saveCurrencyToStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCurrency = action.payload;
      })
      .addCase(saveCurrencyToStorage.rejected, state => {
        state.isLoading = false;
      });
  },
});

export const { setCurrency, updateExchangeRates } = currencySlice.actions;
export default currencySlice.reducer;
