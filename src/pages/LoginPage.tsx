import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginFormData } from '../types';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (error) {
      // Ошибка уже обработана в контексте
    }
  };

  // Функция для красивого отображения ошибок
  const getErrorMessage = (error: string | null) => {
    if (!error) return null;
    
    const errorMessages: { [key: string]: string } = {
      'Invalid credentials': 'Неверный email или пароль',
      'User not found': 'Пользователь не найден',
      'Network Error': 'Ошибка соединения с сервером',
      'default': 'Произошла ошибка при входе'
    };

    return errorMessages[error] || errorMessages['default'];
  };

  return (
    <div className="login-page">
      <h1 style={{color:'white',}}>Вход в систему</h1>
      
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
          <label style={{color:'white'}}>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            disabled={isLoading}
            className='login-input'
          />
        </div>
        <div>
          <label style={{color:'white'}}>Пароль:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            disabled={isLoading}
            className='login-input'
          />
        </div>
        <button type="submit" disabled={isLoading} className='login-btn'>
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>
      
      <p style={{ marginTop: '20px', textAlign: 'center', color:'white' }}>
        Нет аккаунта? <Link to="/register" style={{color: '#AFF019',}}>Зарегистрируйтесь</Link>
      </p>
    </div>
  );
};

export default LoginPage;