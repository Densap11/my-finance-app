import { api } from './api';
import { ITransaction, TransactionFormData } from '../types';

export const transactionService = {
  async createTransaction(transactionData: TransactionFormData): Promise<ITransaction> {
    const response = await api.post<ITransaction>('/transactions', {
      ...transactionData,
      amount: parseFloat(transactionData.amount)
    });
    return response.data;
  },

  async getTransactions(): Promise<ITransaction[]> {
    const response = await api.get<ITransaction[]>('/transactions');
    return response.data;
  },

  async updateTransaction(id: number, transactionData: Partial<TransactionFormData>): Promise<ITransaction> {
    const data = transactionData.amount 
      ? { ...transactionData, amount: parseFloat(transactionData.amount) }
      : transactionData;
    
    const response = await api.put<ITransaction>(`/transactions/${id}`, data);
    return response.data;
  },

  async deleteTransaction(id: number): Promise<void> {
    await api.delete(`/transactions/${id}`);
  }
};