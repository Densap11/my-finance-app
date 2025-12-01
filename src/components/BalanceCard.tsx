import React from 'react';
import { ITransaction } from '../types';

interface BalanceCardProps {
  transactions: ITransaction[];
}

const BalanceCard: React.FC<BalanceCardProps> = ({ transactions }) => {
  const formatCurrency = (amount: number) => {
    const numberAmount = Number(amount);
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numberAmount);
  };

  const calculateBalance = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0); // Добавил Number()
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0); // Добавил Number()
    
    return { balance: income - expense, income, expense };
  };

  const { balance, income, expense } = calculateBalance();

  const StatBlock: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => (
    <div style={{ textAlign: 'center', fontSize: '20px'}}>
      <h3 style={{ color, margin: 0 }}>
        {value >= 0 && label !== 'Расходы' ? '+' : ''}{formatCurrency(value)} {/* Используем formatCurrency */}
      </h3>
      <p style={{ margin: 0, fontSize: '15px', color: '#6c757d' }}>{label}</p>
    </div>
  );

  return (
    <div className="balance-card">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <StatBlock value={balance} label="Баланс" color={balance >= 0 ? '#AFF019' : '#F08819'} />
        <StatBlock value={income} label="Доходы" color="#AFF019" />
        <StatBlock value={expense} label="Расходы" color="#F08819" />
      </div>
    </div>
  );
};

export default BalanceCard;