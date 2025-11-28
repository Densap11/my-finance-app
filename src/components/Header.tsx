import React from 'react';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onLogout }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
      <h1>💰 Финансовый трекер</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>Привет, {userName}!</span>
        <button 
          onClick={onLogout}
          className="logout-button"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};

export default Header;