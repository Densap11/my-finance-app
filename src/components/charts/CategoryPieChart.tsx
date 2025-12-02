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
    
    // Если нет транзакций этого типа
    if (filteredTransactions.length === 0) {
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      // Создаем пустой график с сообщением
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Нет данных'],
          datasets: [{
            data: [1],
            backgroundColor: ['rgba(166, 166, 166, 0.2)'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
          },
          animation: { duration: 0 }
        }
      });
      
      // Добавляем текст в центр
      const centerX = chartRef.current.width / 2;
      const centerY = chartRef.current.height / 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#A6A6A6';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Нет ${type === 'income' ? 'доходов' : 'расходов'}`, centerX, centerY);
      
      return;
    }
    
    // Группируем по категориям
    const categoryData = filteredTransactions.reduce((acc, transaction) => {
      const categoryName = transaction.category_name || 'Без категории';
      const color = transaction.category_color || (type === 'income' ? '#AFF019' : '#F08819');
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          amount: 0,
          color: color,
          count: 0
        };
      }
      acc[categoryName].amount += Number(transaction.amount);
      acc[categoryName].count += 1;
      return acc;
    }, {} as { [key: string]: { amount: number; color: string; count: number } });

    // Сортируем по сумме (по убыванию) и берем топ-6, остальное объединяем в "Другие"
    const allCategories = Object.entries(categoryData)
      .sort(([,a], [,b]) => b.amount - a.amount);

    const topCategories = allCategories.slice(0, 5);
    const otherCategories = allCategories.slice(5);

    // Если есть другие категории, объединяем их
    let labels: string[], data: number[], backgroundColors: string[], categoryCounts: number[];
    
    if (otherCategories.length > 0) {
      const otherTotal = otherCategories.reduce((sum, [, cat]) => sum + cat.amount, 0);
      const otherCount = otherCategories.reduce((sum, [, cat]) => sum + cat.count, 0);
      
      labels = [...topCategories.map(([name]) => name), 'Другие'];
      data = [...topCategories.map(([, cat]) => cat.amount), otherTotal];
      backgroundColors = [...topCategories.map(([, cat]) => cat.color), 'rgba(166, 166, 166, 0.7)'];
      categoryCounts = [...topCategories.map(([, cat]) => cat.count), otherCount];
    } else {
      labels = topCategories.map(([name]) => name);
      data = topCategories.map(([, cat]) => cat.amount);
      backgroundColors = topCategories.map(([, cat]) => cat.color);
      categoryCounts = topCategories.map(([, cat]) => cat.count);
    }

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
            borderWidth: 5,
            borderColor: '#2B2B2B',
            hoverOffset: 15,
            hoverBorderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#A6A6A6',
              font: {
                size: 11
              },
              padding: 12,
              usePointStyle: true,
              pointStyle: 'circle',
              generateLabels: (chart) => {
                const data = chart.data;
                if (data.labels && data.datasets && data.datasets[0]?.data) {
                  const dataset = data.datasets[0];
                  const total = (dataset.data as number[]).reduce((a, b) => a + b, 0);
                  
                  return data.labels.map((label, i) => {
                    const value = dataset.data[i] as number;
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                    
                    // Безопасное получение цвета
                    let fillStyle = '#A6A6A6';
                    if (dataset.backgroundColor) {
                      if (Array.isArray(dataset.backgroundColor)) {
                        fillStyle = dataset.backgroundColor[i] as string || '#A6A6A6';
                      } else if (typeof dataset.backgroundColor === 'string') {
                        fillStyle = dataset.backgroundColor;
                      }
                    }
                    
                    return {
                      text: `${label} (${percentage}%)`,
                      fillStyle: fillStyle,
                      fontColor: '#A6A6A6',
                      hidden: false,
                      index: i,
                      strokeStyle: 'transparent',
                      lineWidth: 0
                    };
                  });
                }
                return [];
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(43, 43, 43, 0.95)',
            titleColor: '#FFFFFF',
            bodyColor: '#A6A6A6',
            borderColor: '#444',
            borderWidth: 1,
            cornerRadius: 6,
            displayColors: true,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw as number;
                const dataset = context.dataset;
                const total = dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                const count = categoryCounts[context.dataIndex] || 0;
                
                const lines = [
                  `${label}: ${new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB'
                  }).format(value)}`,
                  `Доля: ${percentage}%`
                ];
                
                if (count > 1) {
                  lines.push(`Транзакций: ${count}`);
                }
                
                return lines;
              }
            }
          },
          title: {
            display: false
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1000,
          easing: 'easeOutQuart'
        },
        interaction: {
          intersect: false,
          mode: 'nearest'
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
    <div style={{ 
      height: '300px', 
      position: 'relative',
      padding: '10px 0'
    }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default CategoryPieChart;