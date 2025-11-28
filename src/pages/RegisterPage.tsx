import React, { useState } from 'react';
import { RegisterFormData } from '../types';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const { register, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }
    
    try {
      await register(formData);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  // Функция для красивого отображения ошибок регистрации
  const getErrorMessage = (error: string | null) => {
    if (!error) return null;
    
    const errorMessages: { [key: string]: string } = {
      'User already exists': 'Пользователь с таким email уже существует',
      'Invalid credentials': 'Неверные данные',
      'Network Error': 'Ошибка соединения с сервером',
      'default': 'Произошла ошибка при регистрации'
    };

    return errorMessages[error] || errorMessages['default'];
  };

  return (
    <div className="register-page">
      <h1>Регистрация</h1>
      
      {/* Красивое отображение ошибки */}
      {error && (
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #f5c6cb',
          color: '#721c24',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{
            display: 'inline-block',
            width: '20px',
            height: '20px',
            backgroundColor: '#dc3545',
            color: 'white',
            borderRadius: '50%',
            textAlign: 'center',
            lineHeight: '20px',
            fontSize: '14px'
          }}>!</span>
          {getErrorMessage(error)}
        </div>
      )}
      
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