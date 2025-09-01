import * as React from "react";
import type {ButtonHTMLAttributes} from "react";
import styles from './Button.module.scss'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({children, ...props}) => {
  const buttonClasses = `${styles['button']} btn-reset`;
  return (
    <button {...props} className={buttonClasses}>
      {children}
    </button>
  )
}

export default Button;