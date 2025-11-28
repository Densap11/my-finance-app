import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onLogout }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <h1>DSfin</h1>
        
        {/* Навигация */}
        <nav style={{ display: 'flex', gap: '15px' }}>
          <Link 
            to="/"
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              textDecoration: 'none',
              backgroundColor: isActive('/') ? '#007bff' : 'transparent',
              color: isActive('/') ? 'white' : '#007bff',
              border: isActive('/') ? 'none' : '1px solid #007bff'
            }}
          >
            Главная
          </Link>
          
          <Link 
            to="/dashboard"
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              textDecoration: 'none',
              backgroundColor: isActive('/dashboard') ? '#007bff' : 'transparent',
              color: isActive('/dashboard') ? 'white' : '#007bff',
              border: isActive('/dashboard') ? 'none' : '1px solid #007bff'
            }}
          >
            Аналитика
          </Link>
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>Привет, {userName}!</span>
        <button onClick={onLogout} className="logout-button">
          Выйти
        </button>
      </div>
    </div>
  );
};

export default Header;