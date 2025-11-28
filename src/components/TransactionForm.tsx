import React, { useState, useEffect } from 'react';
import { TransactionFormData, ICategory } from '../types';
import { categoryService } from '../services/categoryService';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => Promise<void>;
  isLoading?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: '',
    description: '',
    category_id: 0,
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setFilteredCategories(categories.filter(cat => cat.type === formData.type));
  }, [formData.type, categories]);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) {
      alert('Пожалуйста, выберите категорию');
      return;
    }
    await onSubmit(formData);
    // Сброс формы после успешного добавления
    setFormData({
      amount: '',
      description: '',
      category_id: 0,
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    setFormData({ ...formData, type, category_id: 0 });
  };

  return (
    <div className="transaction-form" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Добавить транзакцию</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            style={{
              padding: '10px 20px',
              backgroundColor: formData.type === 'income' ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: 1,
              fontSize: '18px',
            }}
          >
            💰 Доход
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            style={{
              padding: '10px 20px',
              backgroundColor: formData.type === 'expense' ? '#dc3545' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: 1,
              fontSize: '18px',
            }}
          >
            💸 Расход
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label>Сумма:</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              disabled={isLoading}
              placeholder="0.00"
            />
          </div>

          <div>
            <label>Дата:</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Категория:</label>
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
            required
            disabled={isLoading}
          >
            <option value={0}>Выберите категорию</option>
            {filteredCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Описание:</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={isLoading}
            placeholder="Краткое описание"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: formData.type === 'income' ? '#28a745' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
            fontSize: '18px',
          }}
        >
          {isLoading ? 'Добавление...' : `Добавить ${formData.type === 'income' ? 'доход' : 'расход'}`}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;