import React from 'react';
import { ITransaction } from '../types';

interface BalanceCardProps {
  transactions: ITransaction[];
}

const BalanceCard: React.FC<BalanceCardProps> = ({ transactions }) => {
  const calculateBalance = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { balance: income - expense, income, expense };
  };

  const { balance, income, expense } = calculateBalance();

  const StatBlock: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ color, margin: 0 }}>
        {value >= 0 && label !== 'Расходы' ? '+' : ''}{value.toLocaleString('ru-RU')} ₽
      </h3>
      <p style={{ margin: 0, fontSize: '14px', color: '#6c757d' }}>{label}</p>
    </div>
  );

  return (
    <div className="balance-card">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <StatBlock value={balance} label="Баланс" color={balance >= 0 ? '#28a745' : '#dc3545'} />
        <StatBlock value={income} label="Доходы" color="#28a745" />
        <StatBlock value={expense} label="Расходы" color="#dc3545" />
      </div>
    </div>
  );
};

export default BalanceCard;