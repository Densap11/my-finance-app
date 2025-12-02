import React, { useState, useEffect } from 'react';
import { ITransaction } from '../types';
import { transactionService } from '../services/transactionService';
import RecentTransactions from '../components/RecentTransactions';
import StatisticsCards from '../components/analytics/StatisticsCards';
import MonthlyChart from '../components/charts/MonthlyChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import { useAuth } from '../contexts/AuthContext'; // Добавьте этот импорт
import Header from '../components/Header';




const DashboardPage: React.FC = () => {
  const { logout } = useAuth(); // Получаем функцию logout
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
      <Header onLogout={logout} />
      <div style={{ marginBottom: '30px'}}>
        <h1 style={{color: "white"}}>Аналитика финансов</h1>
        <p style={{ color: '#A6A6A6', marginTop: '10px' }}>
          Статистика и визуализация ваших доходов и расходов
        </p>
      </div>
      <StatisticsCards transactions={transactions} />

      {/* Реальные графики */}
      <div className='chartGrid'>
        {/* График доходов/расходов */}
        <div className='ChartDashboard'>
          <h3 style={{ margin:'auto' }}>Доходы и расходы по месяцам</h3>
          <MonthlyChart transactions={transactions} />
        </div>

        {/* Круговая диаграмма расходов */}
        <div className='ChartDashboard'>
          <h3 style={{ margin:'auto' }}>Расходы по категориям</h3>
          <CategoryPieChart transactions={transactions} type="expense" />
        </div>

        {/* Круговая диаграмма доходов */}
        <div className='ChartDashboard'>
          <h3 style={{ margin:'auto' }}>Доходы по категориям</h3>
          <CategoryPieChart transactions={transactions} type="income" />
        </div>

        {/* Последние транзакции */}
        <div className='ChartDashboard'>
          <h3 style={{ margin:'auto' }}>Последние транзакции</h3>
          <RecentTransactions transactions={transactions.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;