import React, { useState } from 'react';
import { RegisterFormData } from '../types';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Добавьте этот импорт

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const { register, isLoading, error } = useAuth(); // Добавьте useAuth

  const handleSubmit = async (e: React.FormEvent) => { // Сделайте функцию async
    e.preventDefault();
    
    // Проверка совпадения паролей
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }
    
    try {
      console.log('Register data:', formData);
      await register(formData); // Вызов функции регистрации из контекста
      // После успешной регистрации пользователь автоматически перенаправится на главную
    } catch (error) {
      // Ошибка уже обработана в контексте
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="register-page">
      <h1>Регистрация</h1>
      
      {/* Показываем ошибки если есть */}
      {error && <div className="error-message" style={{color: 'red', marginBottom: '15px'}}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label>Подтвердите пароль:</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
      
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Уже есть аккаунт? <Link to="/login">Войдите</Link>
      </p>
    </div>
  );
};

export default RegisterPage;