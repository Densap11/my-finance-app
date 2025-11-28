import { api } from './api';
import { ICategory } from '../types';

export const categoryService = {
  async getCategories(): Promise<ICategory[]> {
    const response = await api.get<ICategory[]>('/categories');
    return response.data;
  },

  async getCategoriesByType(type: 'income' | 'expense'): Promise<ICategory[]> {
    const response = await api.get<ICategory[]>(`/categories/${type}`);
    return response.data;
  }
};