import { apiGet, apiPost, apiPut, apiDelete } from '../baseApi';
import { Cart } from '../../types/cart.types';

export const cartsApi = {
  // Get all carts
  getAllCarts: (): Promise<Cart[]> => {
    return apiGet<Cart[]>('/carts');
  },

  // Get single cart
  getCart: (id: number): Promise<Cart> => {
    return apiGet<Cart>(`/carts/${id}`);
  },

  // Add new cart (POST)
  addCart: (cart: Omit<Cart, 'id'>): Promise<Cart> => {
    return apiPost<Cart>('/carts', cart);
  },

  // Update cart (PUT)
  updateCart: (id: number, cart: Partial<Cart>): Promise<Cart> => {
    return apiPut<Cart>(`/carts/${id}`, cart);
  },

  // Delete cart
  deleteCart: (id: number): Promise<Cart> => {
    return apiDelete<Cart>(`/carts/${id}`);
  },
};
