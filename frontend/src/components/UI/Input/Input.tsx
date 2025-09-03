import React from 'react';
import styles from './Input.module.scss'; // Предполагаю, что здесь добавите .errorMessage { color: red; } или импортируйте из Form.module.scss если нужно

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string; // Новый пропс для ошибки
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({type, name, value, onChange, onBlur, placeholder, label, error, ...rest}, ref) => {
    return (
      <div className={styles.inputGroup}>
        <div className={styles.inputDiv}>
          <label htmlFor={name}>{label}</label>
          <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={styles.input}
            ref={ref}
            {...rest}
          />
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;