export interface AuthCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterResponse {
  id: number;
}
