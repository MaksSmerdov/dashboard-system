import * as React from 'react';
import {useForm, type SubmitHandler} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import type {RootState} from '../../store/store';
import {setCredentials, setError, setLoading} from '../../store/slices/authSlice';
import {getErrorMessage} from '../../utils/errors';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
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
    setError: setFormError,
  } = useForm<LoginFormData>();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    dispatch(setLoading());
    try {
      const response = await axios.post(`${BASE_URL}/login`, data, {withCredentials: true});
      dispatch(setCredentials({token: response.data.accessToken, user: response.data.user}));
      reset();
      navigate('/dashboard'); // Перенаправляем после успешного входа
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        serverErrors.forEach((error: { path: string; msg: string }) => {
          setFormError(error.path as keyof LoginFormData, {message: error.msg});
        });
      } else {
        dispatch(setError(getErrorMessage(err)));
      }
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
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