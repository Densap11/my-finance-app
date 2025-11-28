import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ITransaction, TransactionFormData } from '../types';
import { transactionService } from '../services/transactionService';
import Dashboard from '../components/Dashboard';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      const transactionsData = await transactionService.getTransactions();
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const handleAddTransaction = async (transactionData: TransactionFormData) => {
    try {
      setIsLoading(true);
      const newTransaction = await transactionService.createTransaction(transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Ошибка при добавлении транзакции');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
      return;
    }

    try {
      await transactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Ошибка при удалении транзакции');
    }
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <Dashboard
      userName={user.name}
      transactions={transactions}
      isLoading={isLoading}
      isLoadingTransactions={isLoadingTransactions}
      onLogout={logout}
      onAddTransaction={handleAddTransaction}
      onDeleteTransaction={handleDeleteTransaction}
    />
  );
};

export default HomePage;