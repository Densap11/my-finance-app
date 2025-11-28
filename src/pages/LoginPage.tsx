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

  return (
    <div className="login-page">
      <h1>Вход в систему</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
      </p>
    </div>
  );
};

export default LoginPage;