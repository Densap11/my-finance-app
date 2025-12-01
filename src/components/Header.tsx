import React from 'react';
import { Link} from 'react-router-dom';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{color: "white", fontSize: "32px"}}>DSfin</h1>

          <Link to="/" className='header-button'>Главная</Link>

          <Link to="/dashboard" className='header-button'> Аналитика</Link>
          <a href="" className='header-a'>Настройки</a>  
          <a href="" className='header-a'>Экспорт данных</a>
          <a href="" className='header-a'>Связь с разработчиком</a>
          <button onClick={onLogout} className="logout-button"> Выйти </button>

    </div>
  );
};

export default Header;