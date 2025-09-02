import * as React from "react";
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import type {RootState} from "../../store/store.ts";
import {setCredentials, setError, setLoading} from "../../store/authSlice.ts";
import styles from './Form.module.scss';
import {getErrorMessage} from '../../utils/errors.ts';
import Input from "../../components/UI/Input/Input.tsx";

interface RegisterFormData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

const BASE_URL = 'http://localhost:5000/api/auth';

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch();
  const {error, loading} = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    surname: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name as keyof RegisterFormData]: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.surname || !formData.email || !formData.password) {
      dispatch(setError('Заполните все поля'));
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      dispatch(setError('Введите корректный email'));
      return;
    }
    if (!/^[а-яА-ЯёЁ\s-]+$/.test(formData.name) || !/^[а-яА-ЯёЁ\s-]+$/.test(formData.surname)) {
      dispatch(setError('Имя и фамилия должны содержать только русские буквы, пробелы или дефисы'));
      return;
    }
    if (formData.password.length < 6) {
      dispatch(setError('Пароль должен быть не короче 6 символов'));
      return;
    }

    dispatch(setLoading());
    try {
      const response = await axios.post(`${BASE_URL}/register`, formData);
      dispatch(setCredentials({token: response.data.token, user: response.data.user}));
      setFormData({name: '', surname: '', email: '', password: ''});
    } catch (err: unknown) {
      dispatch(setError(getErrorMessage(err)));
    }
  };

  return (
    <div className={`${styles['form-container']}`}>
      <h2 className={`${styles['form-title']}`}>Регистрация</h2>
      {error && <p className={`${styles['form__error']}`}>{error}</p>}
      <form className={`${styles['form-inputs']}`} onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Введите имя"
          label="Имя"
        />
        <Input
          type="text"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          placeholder="Введите фамилию"
          label="Фамилия"
        />
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Введите email"
          label="Email"
        />
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Введите пароль"
          label="Пароль"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
