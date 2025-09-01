import * as React from "react";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import type {RootState} from "../../../store/store.ts";
import { setCredentials, setError, setLoading} from "../../../store/authSlice.ts";
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      dispatch(setError((err as any).response?.data?.msg || 'Ошибка авторизации'));
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
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Войти'}
        </button>
        <button type="submit" disabled={loading}>
          Регистрация
        </button>
      </form>
    </div>
  );
};

export default LoginForm;