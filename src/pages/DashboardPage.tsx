import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ITransaction } from '../types';
import { transactionService } from '../services/transactionService';
import StatisticsCards from '../components/analytics/StatisticsCards';
import MonthlyChart from '../components/charts/MonthlyChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const transactionsData = await transactionService.getTransactions();
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div>Загрузка аналитики...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div style={{ marginBottom: '30px' }}>
        <h1>Аналитика финансов</h1>
        <p style={{ color: '#666', marginTop: '10px' }}>
          Статистика и визуализация ваших доходов и расходов
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#007bff',
              border: '1px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '10px'
            }}
          >
            ← На главную
          </button>
          <h1 style={{ margin: 0 }}>Аналитика финансов</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>
            Статистика и визуализация ваших доходов и расходов
          </p>
        </div>
      </div>
      <StatisticsCards transactions={transactions} />

      {/* Реальные графики */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px', 
        marginTop: '30px' 
      }}>
        {/* График доходов/расходов */}
        <div style={{
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}>
          <h3 style={{ marginBottom: '15px' }}>Доходы и расходы по месяцам</h3>
          <MonthlyChart transactions={transactions} />
        </div>

        {/* Круговая диаграмма расходов */}
        <div style={{
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}>
          <h3 style={{ marginBottom: '15px' }}>Расходы по категориям</h3>
          <CategoryPieChart transactions={transactions} type="expense" />
        </div>
      </div>

      {/* Второй ряд графиков */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px', 
        marginTop: '20px' 
      }}>
        {/* Круговая диаграмма доходов */}
        <div style={{
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}>
          <h3 style={{ marginBottom: '15px' }}>Доходы по категориям</h3>
          <CategoryPieChart transactions={transactions} type="income" />
        </div>

        {/* Последние транзакции */}
        <div style={{
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}>
          <h3 style={{ marginBottom: '15px' }}>Последние транзакции</h3>
          <RecentTransactions transactions={transactions.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
};

// Компонент последних транзакций
const RecentTransactions: React.FC<{ transactions: ITransaction[] }> = ({ transactions }) => {
  // Функция для форматирования валюты
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (transactions.length === 0) {
    return <div style={{ color: '#666', textAlign: 'center', padding: '20px' }}>Нет транзакций</div>;
  }

  return (
    <div>
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #f0f0f0'
          }}
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
              <div style={{ fontSize: '12px', color: '#666' }}>
                {new Date(transaction.date).toLocaleDateString('ru-RU')}
                {transaction.description && ` • ${transaction.description}`}
              </div>
            </div>
          </div>
          
          <div
            style={{
              color: transaction.type === 'income' ? '#28a745' : '#dc3545',
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

export default DashboardPage;