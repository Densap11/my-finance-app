import React from 'react';
import { ITransaction } from '../types';

interface TransactionListProps {
  transactions: ITransaction[];
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, isLoading = false }) => {
  const formatCurrency = (amount: number) => {
    // Преобразуем в число и форматируем
    const numberAmount = Number(amount);
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numberAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (isLoading) {
    return <div>Загрузка транзакций...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#A6A6A6' }}>
        <h3>Транзакций пока нет</h3>
        <p>Добавьте первую транзакцию используя форму выше</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <h3>История транзакций</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{ }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #A6A6A6', backgroundColor: '#2B2B2B' }}>Дата</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #A6A6A6', backgroundColor: '#2B2B2B'  }}>Категория</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #A6A6A6', backgroundColor: '#2B2B2B'  }}>Описание</th>
              <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #A6A6A6', backgroundColor: '#2B2B2B'  }}>Сумма</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #A6A6A6', backgroundColor: '#2B2B2B'  }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id} style={{ borderBottom: '1px solid #A6A6A6' }}>
                <td style={{ padding: '12px' }}>{formatDate(transaction.date)}</td>
                <td style={{ padding: '12px' }}>
                  <span className='transaction-list-span'
                    style={{
                      backgroundColor: transaction.category_color || '#007bff',
                    }}
                  >
                    {transaction.category_name}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{transaction.description || '-'}</td>
                <td style={{ 
                  padding: '12px', 
                  textAlign: 'right',
                  color: transaction.type === 'income' ? '#AFF019' : '#F08819',
                  fontWeight: 'bold'
                }}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    disabled={isLoading}
                    className='transaction-list-delete'
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