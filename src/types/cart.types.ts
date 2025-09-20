import { Product } from './product.types';

export interface Cart {
  id: number;
  userId: number;
  products: Product[];
}
