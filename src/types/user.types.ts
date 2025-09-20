export interface User {
  id: number;
  username: string;
  password: string;
  email?: string;
  name?: {
    firstname?: string;
    lastname?: string;
  };
  phone?: string;
  address?: {
    city?: string;
    street?: string;
    number?: number;
    zipcode?: string;
    geolocation?: {
      lat?: string;
      long?: string;
    };
  };
}

export type CreateUserRequest = Omit<User, 'id'>;
export type UpdateUserRequest = Partial<Omit<User, 'id'>>;
