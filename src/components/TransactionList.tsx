import React from 'react';
import { ITransaction } from '../types';

interface TransactionListProps {
  transactions: ITransaction[];
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, isLoading = false }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (isLoading) {
    return <div>Загрузка транзакций...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
        <h3>Транзакций пока нет</h3>
        <p>Добавьте первую транзакцию используя форму выше</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <h3>История транзакций</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Дата</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Категория</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Описание</th>
              <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>Сумма</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px' }}>{formatDate(transaction.date)}</td>
                <td style={{ padding: '12px' }}>
                  <span 
                    style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: transaction.category_color || '#007bff',
                      color: 'white',
                      fontSize: '12px'
                    }}
                  >
                    {transaction.category_name}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{transaction.description || '-'}</td>
                <td style={{ 
                  padding: '12px', 
                  textAlign: 'right',
                  color: transaction.type === 'income' ? '#28a745' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    disabled={isLoading}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;