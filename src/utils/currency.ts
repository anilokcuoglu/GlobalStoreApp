import { Currency } from '../store/slices/currencySlice';

// Currency symbols
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  TRY: '₺',
};

// Currency names
export const CURRENCY_NAMES: Record<Currency, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  TRY: 'Turkish Lira',
};

// Convert price from USD to target currency
export const convertPrice = (usdPrice: number, targetCurrency: Currency, exchangeRates: Record<Currency, number>): number => {
  if (targetCurrency === 'USD') {
    return usdPrice;
  }
  
  return usdPrice * exchangeRates[targetCurrency];
};

// Format price with currency symbol
export const formatPrice = (price: number, currency: Currency): string => {
  const symbol = CURRENCY_SYMBOLS[currency];
  
  switch (currency) {
    case 'USD':
      return `${symbol}${price.toFixed(2)}`;
    case 'EUR':
      return `${symbol}${price.toFixed(2)}`;
    case 'TRY':
      return `${price.toFixed(2)} ${symbol}`;
    default:
      return `${symbol}${price.toFixed(2)}`;
  }
};

// Get currency conversion info for display
export const getCurrencyInfo = (currency: Currency) => ({
  symbol: CURRENCY_SYMBOLS[currency],
  name: CURRENCY_NAMES[currency],
  code: currency,
});
