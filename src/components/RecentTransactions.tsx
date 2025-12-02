import React from 'react';
import { ITransaction } from '../types';

interface RecentTransactionsProps {
  transactions: ITransaction[];
  maxItems?: number;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions, 
  maxItems = 5 
}) => {
  // Функция для форматирования валюты
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Берем только последние N транзакций
  const recentTransactions = transactions.slice(0, maxItems);

  if (recentTransactions.length === 0) {
    return (
      <div style={{ 
        color: '#A6A6A6', 
        textAlign: 'center', 
        padding: '20px',
        fontStyle: 'italic'
      }}>
        Нет транзакций для отображения
      </div>
    );
  }

  return (
    <div>
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className='transaction-list-short'
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: transaction.category_color || '#007bff'
              }}
            ></div>
            <div>
              <div style={{ fontWeight: '500' }}>{transaction.category_name}</div>
              <div style={{ fontSize: '12px', color: '#A6A6A6' }}>
                {new Date(transaction.date).toLocaleDateString('ru-RU')}
                {transaction.description && ` • ${transaction.description}`}
              </div>
            </div>
          </div>
          
          <div
            style={{
              color: transaction.type === 'income' ? '#AFF019' : '#F08819',
              fontWeight: 'bold'
            }}
          >
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))} ₽
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentTransactions;