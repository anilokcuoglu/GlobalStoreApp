export interface AuthCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  password: string;
}
