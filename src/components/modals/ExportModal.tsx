import React, { useState } from 'react';
import Modal from '../ui/Modal';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState('excel');
  const [dateRange, setDateRange] = useState('all');
  const [includeCategories, setIncludeCategories] = useState(true);

  const handleExport = () => {
    // Здесь будет логика экспорта
    console.log('Экспорт данных:', { format, dateRange, includeCategories });
    
    // Имитация экспорта
    alert(`Данные экспортированы в формате ${format.toUpperCase()}`);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Экспорт данных" 
      size="md"
    >
      <div style={{ color: '#A6A6A6' }}>
        
        {/* Формат */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            color: '#FFFFFF'
          }}>
            Формат
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setFormat('excel')}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: format === 'excel' ? '#444' : '#1A1A1A',
                border: `1px solid ${format === 'excel' ? '#AFF019' : '#444'}`,
                borderRadius: '4px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>📊</span>
              Excel
            </button>
            <button
              type="button"
              onClick={() => setFormat('pdf')}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: format === 'pdf' ? '#444' : '#1A1A1A',
                border: `1px solid ${format === 'pdf' ? '#AFF019' : '#444'}`,
                borderRadius: '4px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>📄</span>
              PDF
            </button>
          </div>
        </div>
        
        {/* Период */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            color: '#FFFFFF'
          }}>
            Период
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#1A1A1A',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#FFFFFF'
            }}
          >
            <option value="all">За всё время</option>
            <option value="month">Текущий месяц</option>
            <option value="3months">Последние 3 месяца</option>
            <option value="year">Текущий год</option>
          </select>
        </div>
        
        {/* Опции */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={includeCategories}
              onChange={(e) => setIncludeCategories(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            <span style={{ color: '#FFFFFF' }}>Включать категории</span>
          </label>
          
          <label style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              defaultChecked
              style={{ width: '18px', height: '18px' }}
            />
            <span style={{ color: '#FFFFFF' }}>Включать графики</span>
          </label>
        </div>
        
        {/* Информация */}
        <div style={{ 
          padding: '15px',
          backgroundColor: 'rgba(175, 240, 25, 0.1)',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid rgba(175, 240, 25, 0.3)'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#A6A6A6' }}>
            ⚡ Функция экспорта находится в разработке. 
            В будущем вы сможете скачивать полные отчеты в выбранном формате.
          </p>
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
            onClick={handleExport}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#F08819',
              border: 'none',
              borderRadius: '4px',
              color: '#000',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Экспортировать
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;