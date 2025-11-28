import React from 'react';
import Header from './Header';
import BalanceCard from './BalanceCard';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList'; // Убедитесь что это исправленная версия
import { ITransaction, TransactionFormData } from '../types';

interface DashboardProps {
  userName: string;
  transactions: ITransaction[];
  isLoading: boolean;
  isLoadingTransactions: boolean;
  onLogout: () => void;
  onAddTransaction: (data: TransactionFormData) => Promise<void>;
  onDeleteTransaction: (id: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userName,
  transactions,
  isLoading,
  isLoadingTransactions,
  onLogout,
  onAddTransaction,
  onDeleteTransaction
}) => {
  return (
    <div className="dashboard">
      <Header userName={userName} onLogout={onLogout} />
      
      <BalanceCard transactions={transactions} />

      <TransactionForm onSubmit={onAddTransaction} isLoading={isLoading} />
      
      <TransactionList 
        transactions={transactions} 
        onDelete={onDeleteTransaction} 
        isLoading={isLoadingTransactions}
      />
    </div>
  );
};

export default Dashboard;