export interface User {
  id: number;
  username: string;
  password: string;
}

export type CreateUserRequest = Omit<User, 'id'>;
export type UpdateUserRequest = Partial<Omit<User, 'id'>>;
