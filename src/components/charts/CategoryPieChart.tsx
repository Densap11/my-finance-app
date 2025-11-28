import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { ITransaction } from '../../types';

Chart.register(...registerables);

interface CategoryPieChartProps {
  transactions: ITransaction[];
  type: 'income' | 'expense';
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ transactions, type }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Фильтруем транзакции по типу
    const filteredTransactions = transactions.filter(t => t.type === type);
    
    // Группируем по категориям
    const categoryData = filteredTransactions.reduce((acc, transaction) => {
      const categoryName = transaction.category_name || 'Без категории';
      if (!acc[categoryName]) {
        acc[categoryName] = {
          amount: 0,
          color: transaction.category_color || '#007bff'
        };
      }
      acc[categoryName].amount += transaction.amount;
      return acc;
    }, {} as { [key: string]: { amount: number; color: string } });

    // Сортируем по сумме (по убыванию) и берем топ-6
    const sortedCategories = Object.entries(categoryData)
      .sort(([,a], [,b]) => b.amount - a.amount)
      .slice(0, 6);

    const labels = sortedCategories.map(([name]) => name);
    const data = sortedCategories.map(([, data]) => data.amount);
    const backgroundColors = sortedCategories.map(([, data]) => data.color);

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColors,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: `Распределение ${type === 'income' ? 'доходов' : 'расходов'}`
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [transactions, type]);

  return (
    <div style={{ height: '300px' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default CategoryPieChart;