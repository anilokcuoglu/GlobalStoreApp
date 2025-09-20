import { StorageService } from './storage';

const FAVORITES_KEY = 'favorites';

export const FavoritesService = {
  getFavorites: (): number[] => {
    try {
      const favorites = StorageService.getItem(FAVORITES_KEY);
      if (favorites) {
        return JSON.parse(favorites);
      }
      return [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  addToFavorites: (productId: number): boolean => {
    try {
      const favorites = FavoritesService.getFavorites();
      if (!favorites.includes(productId)) {
        favorites.push(productId);
        StorageService.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        console.log(`Product ${productId} added to favorites`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  },

  removeFromFavorites: (productId: number): boolean => {
    try {
      const favorites = FavoritesService.getFavorites();
      const updatedFavorites = favorites.filter(id => id !== productId);
      StorageService.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      console.log(`Product ${productId} removed from favorites`);
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  },

  isFavorite: (productId: number): boolean => {
    try {
      const favorites = FavoritesService.getFavorites();
      return favorites.includes(productId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  },

  toggleFavorite: (productId: number): boolean => {
    try {
      const isFavorite = FavoritesService.isFavorite(productId);
      if (isFavorite) {
        return FavoritesService.removeFromFavorites(productId);
      } else {
        return FavoritesService.addToFavorites(productId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  },

  clearAllFavorites: (): boolean => {
    try {
      StorageService.removeItem(FAVORITES_KEY);
      console.log('All favorites cleared');
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return false;
    }
  },
};
