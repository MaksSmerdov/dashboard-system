import * as React from "react";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import type { RootState } from "../../store/store.ts";
import { setCredentials, setError, setLoading } from "../../store/authSlice.ts";
import { getErrorMessage } from '../../utils/errors.ts';
import Button from "../../components/UI/Button/Button.tsx";
import styles from './Form.module.scss';

interface LoginFormData {
  email: string;
  password: string;
}

const BASE_URL = 'http://localhost:5000/api/auth';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as keyof LoginFormData]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(setError('Заполните все поля'));
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      dispatch(setError('Введите корректный email'));
      return;
    }

    dispatch(setLoading());
    try {
      const response = await axios.post(`${BASE_URL}/login`, formData);
      dispatch(setCredentials({ token: response.data.token, user: response.data.user }));
      setFormData({ email: '', password: '' });
    } catch (err: unknown) {
      dispatch(setError(getErrorMessage(err)));
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Вход</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Введите email"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Пароль</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Войти'}
        </Button>

        {/* Кнопка регистрации не должна сабмитить — лучше Link */}
        <Link to="/register" className={styles.linkButton}>
          Регистрация
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
