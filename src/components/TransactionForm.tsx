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
    <div className="transaction-form" >
      <h2 style={{margin: "0px",}}>Добавить транзакцию</h2>
      <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", height:"auto"}}>
        <div style={{ display: 'flex', gap: '15px',}}>
          <button type="button" onClick={() => handleTypeChange('income')} className='transaction-button-income'>
            Доход
          </button>
          <button type="button" onClick={() => handleTypeChange('expense')} className='transaction-button-expense'>
            Расход
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '0'}}>
          <div>
            <label className='transaction-form-lable'>Сумма:</label>
            <input 
              className='transaction-form-input'
              type="number"
              step="100"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })} // ДОБАВИЛ ЭТУ СТРОКУ
              required
              disabled={isLoading}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className='transaction-form-lable'>Дата:</label>
            <input className='transaction-form-input'
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className='transaction-form-lable'>Категория:</label>
          <select className='transaction-form-input'
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
          <label className='transaction-form-lable'>Описание:</label>
          <input className='transaction-form-input'
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
          className='transaction-button-submit'
          style={{
            backgroundColor: formData.type === 'income' ? '#AFF019' : '#F08819',
          }}
        >
          {isLoading ? 'Добавление...' : `Добавить ${formData.type === 'income' ? 'доход' : 'расход'}`}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;