import React, { useState } from 'react';
import Modal from '../ui/Modal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [currency, setCurrency] = useState('RUB');
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    // Здесь будет сохранение настроек
    console.log('Сохранение настроек:', { currency, theme, notifications });
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Настройки" 
      size="lg"
    >
      <div style={{ color: '#A6A6A6' }}>
        
        {/* Валюта */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            color: '#FFFFFF'
          }}>
            Валюта
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#1A1A1A',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#FFFFFF'
            }}
          >
            <option value="RUB">Рубли (₽)</option>
            <option value="USD">Доллары ($)</option>
            <option value="EUR">Евро (€)</option>
          </select>
        </div>
        
        {/* Тема */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            color: '#FFFFFF'
          }}>
            Тема
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: theme === 'dark' ? '#444' : '#1A1A1A',
                border: `1px solid ${theme === 'dark' ? '#AFF019' : '#444'}`,
                borderRadius: '4px',
                color: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              Тёмная
            </button>
            <button
              type="button"
              onClick={() => setTheme('light')}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: theme === 'light' ? '#444' : '#1A1A1A',
                border: `1px solid ${theme === 'light' ? '#AFF019' : '#444'}`,
                borderRadius: '4px',
                color: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              Светлая
            </button>
          </div>
        </div>
        
        {/* Уведомления */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            <span style={{ color: '#FFFFFF' }}>Уведомления о превышении бюджета</span>
          </label>
        </div>
        
        {/* Кнопки */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: 'transparent',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#A6A6A6',
              cursor: 'pointer'
            }}
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#AFF019',
              border: 'none',
              borderRadius: '4px',
              color: '#000',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Сохранить
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;