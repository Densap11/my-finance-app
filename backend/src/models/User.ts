export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  created_at: Date;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}