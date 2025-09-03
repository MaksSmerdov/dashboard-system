// src/components/Modal.tsx
import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string; // Опциональный заголовок
}

const Modal: React.FC<ModalProps> = ({isOpen, onClose, children, title}) => {
  if (!isOpen) return null;


  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  // Стили для модального окна
  const modalStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    maxWidth: '500px',
    maxHeight: '700px',
    overflow: 'auto',
    width: '100%',
    position: 'relative',
  };

  // Стили для кнопки закрытия
  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  };

  return ReactDOM.createPortal(
    <div style={overlayStyle} onClick={onClose}> {/* Закрытие по клику на оверлей */}
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}> {/* Предотвращаем закрытие по клику внутри */}
        {title && <h2>{title}</h2>}
        <button style={closeButtonStyle} onClick={onClose}>
          &times; {/* Крестик */}
        </button>
        {children}
      </div>
    </div>,
    document.body // Рендерим в body
  );
};

export default Modal;