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

    // Получаем все месяцы из транзакций
    const getAllMonths = () => {
      const months = new Set<string>();
      transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        months.add(monthKey);
      });
      
      // Если нет транзакций, показываем последние 6 месяцев
      if (months.size === 0) {
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          months.add(monthKey);
        }
      }
      
      return Array.from(months).sort();
    };

    // Группируем транзакции по месяцам
    const monthlyData = getAllMonths().reduce((acc, monthKey) => {
      acc[monthKey] = { income: 0, expense: 0 };
      return acc;
    }, {} as { [key: string]: { income: number; expense: number } });

    // Заполняем данные
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (monthlyData[monthKey]) {
        if (transaction.type === 'income') {
          monthlyData[monthKey].income += Number(transaction.amount);
        } else {
          monthlyData[monthKey].expense += Number(transaction.amount);
        }
      }
    });

    // Формируем labels и данные
    const sortedMonths = getAllMonths();
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
            backgroundColor: 'rgba(175, 240, 25, 0.7)',
            borderColor: '#AFF019',
            borderWidth: 2,
            borderRadius: 4,
            barPercentage: 0.7,
            categoryPercentage: 0.8
          },
          {
            label: 'Расходы',
            data: expenseData,
            backgroundColor: 'rgba(240, 136, 25, 0.7)',
            borderColor: '#F08819',
            borderWidth: 2,
            borderRadius: 4,
            barPercentage: 0.7,
            categoryPercentage: 0.8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#A6A6A6',
              font: {
                size: 12
              },
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(43, 43, 43, 0.9)',
            titleColor: '#FFFFFF',
            bodyColor: '#A6A6A6',
            borderColor: '#444',
            borderWidth: 1,
            cornerRadius: 6,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB'
                }).format(context.raw as number);
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(166, 166, 166, 0.1)',
            },
            ticks: {
              color: '#A6A6A6',
              font: {
                size: 11
              },
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(166, 166, 166, 0.1)',
            },
            ticks: {
              color: '#A6A6A6',
              font: {
                size: 11
              },
              callback: function(value) {
                return new Intl.NumberFormat('ru-RU', {
                  notation: 'compact',
                  compactDisplay: 'short'
                }).format(Number(value)) + ' ₽';
              },
              maxTicksLimit: 8
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        animation: {
          duration: 750,
          easing: 'easeOutQuart'
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
    <div style={{ 
      height: '300px', 
      position: 'relative',
      padding: '10px 0'
    }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default MonthlyChart;