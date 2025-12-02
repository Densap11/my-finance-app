import React from 'react';
import { ITransaction } from '../../types';

interface StatisticsCardsProps {
  transactions: ITransaction[];
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ transactions }) => {
  const calculateStats = () => {
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    // Правильно суммируем числа
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const balance = totalIncome - totalExpense;
    
    return {
      totalIncome,
      totalExpense,
      balance,
      incomeCount: incomeTransactions.length,
      expenseCount: expenseTransactions.length
    };
  };

  const stats = calculateStats();

  // Функция для красивого форматирования чисел
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    subtitle: string;
    color: string;
  }> = ({ title, value, subtitle, color }) => (
    <div className='dashboard-statcard'>
      <div style={{ fontSize: '15px', color: '#A6A6A6', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '30px', fontWeight: 'bold', color, marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: '#A6A6A6' }}>{subtitle}</div>
    </div>
  );

  return (
    <div className='dashboard-statcard-cont'>
      <StatCard
        title="Общий баланс"
        value={`${stats.balance >= 0 ? '+' : ''}${formatCurrency(stats.balance)} ₽`}
        subtitle="За все время"
        color={stats.balance >= 0 ? '#AFF019' : '#F08819'}
      />
      
      <StatCard
        title="Доходы"
        value={`+${formatCurrency(stats.totalIncome)} ₽`}
        subtitle={`${stats.incomeCount} транзакций`}
        color="#AFF019"
      />
      
      <StatCard
        title="Расходы"
        value={`-${formatCurrency(stats.totalExpense)} ₽`}
        subtitle={`${stats.expenseCount} транзакций`}
        color="#F08819"
      />
      
      <StatCard
        title="Всего транзакций"
        value={transactions.length.toString()}
        subtitle="Доходы и расходы"
        color="#007bff"
      />
    </div>
  );
};

export default StatisticsCards;