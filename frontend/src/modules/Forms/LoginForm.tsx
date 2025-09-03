import * as React from 'react';
import {useForm, type SubmitHandler} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import type {RootState} from '../../store/store.ts';
import {setCredentials, setError, setLoading} from '../../store/slices/authSlice.ts';
import {getErrorMessage} from '../../utils/errors.ts';
import Button from '../../components/UI/Button/Button.tsx';
import Input from '../../components/UI/Input/Input.tsx';
import styles from './Form.module.scss';

interface LoginFormData {
  email: string;
  password: string;
}

const BASE_URL = 'http://localhost:5000/api/auth';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const {error: authError, loading} = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    setError: setFormError, // Добавляем для обработки серверных ошибок под полями
  } = useForm<LoginFormData>();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    dispatch(setLoading());
    try {
      const response = await axios.post(`${BASE_URL}/login`, data);
      dispatch(setCredentials({token: response.data.token, user: response.data.user}));
      reset();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        // Аналогично RegisterForm: Устанавливаем ошибки под поля, если сервер возвращает структурированные ошибки
        const serverErrors = err.response.data.errors;
        Object.keys(serverErrors).forEach((field) => {
          setFormError(field as keyof LoginFormData, {message: serverErrors[field]});
        });
      } else {
        dispatch(setError(getErrorMessage(err)));
      }
    }
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Навигация на страницу регистрации
  };

  return (
    <div className={`${styles['form-container']}`}>
      <h2 className={`${styles['form-title']}`}>Вход</h2>
      {authError && <span className={`${styles['form__error']}`}>{authError}</span>}
      <form className={`${styles['form-inputs']}`} onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="email"
          {...register('email', {
            required: 'Заполните поле',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Введите корректный email',
            },
          })}
          placeholder="Введите email"
          label="Email"
          error={errors.email?.message}
        />

        <Input
          type="password"
          {...register('password', {required: 'Заполните поле'})}
          placeholder="Введите пароль"
          label="Пароль"
          error={errors.password?.message}
        />
        {authError && <span className={`${styles['form__error--login']}`}>{authError}</span>}
        <Button style={{marginTop: '20px'}} type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Войти'}
        </Button>
        <Button onClick={handleRegisterClick} disabled={loading}>
          Регистрация
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;