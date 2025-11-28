import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { ITransaction } from '../../types';

Chart.register(...registerables);

interface MonthlyChartProps {
  transactions: ITransaction[];
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({ transactions }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Уничтожаем предыдущий график
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Группируем транзакции по месяцам
    const monthlyData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[monthKey].income += transaction.amount;
      } else {
        acc[monthKey].expense += transaction.amount;
      }
      
      return acc;
    }, {} as { [key: string]: { income: number; expense: number } });

    // Сортируем по дате и берем последние 6 месяцев
    const sortedMonths = Object.keys(monthlyData)
      .sort()
      .slice(-6);

    const labels = sortedMonths.map(month => {
      const [year, monthNum] = month.split('-');
      const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
      return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
    });

    const incomeData = sortedMonths.map(month => monthlyData[month].income);
    const expenseData = sortedMonths.map(month => monthlyData[month].expense);

    // Создаем график
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Доходы',
            data: incomeData,
            backgroundColor: '#28a745',
            borderColor: '#28a745',
            borderWidth: 1
          },
          {
            label: 'Расходы',
            data: expenseData,
            backgroundColor: '#dc3545',
            borderColor: '#dc3545',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value + ' ₽';
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Доходы и расходы по месяцам'
          }
        }
      }
    });

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [transactions]);

  return (
    <div style={{ height: '300px' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default MonthlyChart;