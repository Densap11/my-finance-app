import { api } from './api';
import { IUser, IAuthResponse, LoginFormData, RegisterFormData } from '../types';

export const authService = {
  async register(userData: RegisterFormData): Promise<IAuthResponse> {
    const response = await api.post<IAuthResponse>('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password
    });
    return response.data;
  },

  async login(credentials: LoginFormData): Promise<IAuthResponse> {
    const response = await api.post<IAuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async getProfile(): Promise<IUser> {
    const response = await api.get<IUser>('/auth/profile');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  saveAuthData(authData: IAuthResponse): void {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  },

  getStoredUser(): IUser | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  }
};