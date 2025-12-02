import React from 'react';
import Modal from '../ui/Modal';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const socialLinks = [
    {
      name: 'GitHub',
      icon: '🐙',
      url: 'https://github.com/Densap11',
      color: '#333',
      description: 'Исходный код проекта'
    },
    {
      name: 'Telegram',
      icon: '✈️',
      url: 'https://t.me/your_telegram',
      color: '#0088cc',
      description: 'Для быстрой связи'
    },
    {
      name: 'Email',
      icon: '📧',
      url: 'mailto:your@email.com',
      color: '#D44638',
      description: 'your@email.com'
    },
    {
      name: 'VK',
      icon: '🌐',
      url: 'https://vk.com/your_profile',
      color: '#4C75A3',
      description: 'Социальная сеть'
    }
  ];

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Связь с разработчиком" 
      size="md"
    >
      <div style={{ color: '#A6A6A6' }}>
        
        <p style={{ marginBottom: '25px', lineHeight: '1.5' }}>
          Привет! Я разработчик этого приложения. 
          Если у вас есть вопросы, предложения или вы нашли ошибку — 
          свяжитесь со мной через любой удобный способ:
        </p>
        
        {/* Соцсети */}
        <div style={{ marginBottom: '30px' }}>
          {socialLinks.map((social, index) => (
            <button
              key={index}
              onClick={() => handleLinkClick(social.url)}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#1A1A1A',
                border: '1px solid #444',
                borderRadius: '6px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '10px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#222';
                e.currentTarget.style.borderColor = social.color;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#1A1A1A';
                e.currentTarget.style.borderColor = '#444';
              }}
            >
              <span style={{ 
                fontSize: '24px',
                backgroundColor: social.color + '20',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {social.icon}
              </span>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold',
                  color: '#FFFFFF'
                }}>
                  {social.name}
                </div>
                <div style={{ fontSize: '14px', color: '#A6A6A6' }}>
                  {social.description}
                </div>
              </div>
              <span style={{ fontSize: '20px' }}>→</span>
            </button>
          ))}
        </div>
        
        {/* Дополнительная информация */}
        <div style={{ 
          padding: '15px',
          backgroundColor: 'rgba(175, 240, 25, 0.1)',
          borderRadius: '4px',
          border: '1px solid rgba(175, 240, 25, 0.3)'
        }}>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
            💡 <strong>Приложение активно развивается!</strong><br/>
            Буду рад вашим идеям и отзывам для улучшения функциональности.
          </p>
        </div>
        
        {/* Кнопка закрытия */}
        <div style={{ marginTop: '25px', textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 30px',
              backgroundColor: 'transparent',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#A6A6A6',
              cursor: 'pointer'
            }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ContactModal;