export interface IUser {
  id: number; // было string, теперь number (как в PostgreSQL SERIAL)
  name: string;
  email: string;
  created_at: string; // добавили поле из бэкенда
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface AuthState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ITransaction {
  id: number;
  user_id: number;
  amount: number;
  description: string;
  category_id: number;
  type: 'income' | 'expense';
  date: string;
  created_at: string;
  category_name?: string;
  category_color?: string;
}

export interface ICategory {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

export interface TransactionFormData {
  amount: string;
  description: string;
  category_id: number;
  type: 'income' | 'expense';
  date: string;
}