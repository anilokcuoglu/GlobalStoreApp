import { Product } from '../../types/product.types';
import { apiGet, apiPost, apiPut, apiDelete } from '../baseApi';

export const productsApi = {
  // Get all products
  getAllProducts: (): Promise<Product[]> => {
    return apiGet<Product[]>('/products');
  },

  // Get single product
  getProduct: (id: number): Promise<Product> => {
    return apiGet<Product>(`/products/${id}`);
  },

  // Add new product (POST)
  addProduct: (product: Omit<Product, 'id'>): Promise<Product> => {
    return apiPost<Product>('/products', product);
  },

  // Update product (PUT)
  updateProduct: (id: number, product: Partial<Product>): Promise<Product> => {
    return apiPut<Product>(`/products/${id}`, product);
  },

  // Delete product
  deleteProduct: (id: number): Promise<Product> => {
    return apiDelete<Product>(`/products/${id}`);
  },
};
