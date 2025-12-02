import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SettingsModal from './modals/SettingsModal';
import ExportModal from './modals/ExportModal';
import ContactModal from './modals/ContactModal';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  // Состояния для модалок
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Обработчики кликов
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSettingsOpen(true);
  };

  const handleExportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExportOpen(true);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsContactOpen(true);
  };

  return (
    <div >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{color: "white", fontSize: "32px"}}>DSfin</h1><Link to="/" className='header-button'>Главная</Link>
        <Link to="/dashboard" className='header-button'>Аналитика</Link>
        <a 
          href="#" 
          className='header-a'
          onClick={handleSettingsClick}
        >
          Настройки
        </a>
        
        <a 
          href="#" 
          className='header-a'
          onClick={handleExportClick}
        >
          Экспорт данных
        </a>
        
        <a 
          href="#" 
          className='header-a'
          onClick={handleContactClick}
        >
          Связь с разработчиком
        </a>
        <button onClick={onLogout} className="logout-button">Выйти</button>
      </div>

      {/* Модальные окна рендерятся здесь, но они position: fixed */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
      
      <ExportModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
      />
      
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
    </div>
  );
};

export default Header;