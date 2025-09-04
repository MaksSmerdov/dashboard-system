import * as React from 'react';
import {useForm, type SubmitHandler} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import type {RootState} from '../../store/store';
import {setCredentials, setError, setLoading} from '../../store/slices/authSlice';
import {getErrorMessage} from '../../utils/errors';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import styles from './Form.module.scss';

interface RegisterFormData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

const BASE_URL = 'http://localhost:5000/api/auth';

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch();
  const {error: authError, loading} = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    setError: setFormError,
  } = useForm<RegisterFormData>();

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    dispatch(setLoading());
    try {
      const response = await axios.post(`${BASE_URL}/register`, data, {withCredentials: true});
      dispatch(setCredentials({token: response.data.accessToken, user: response.data.user}));
      reset();
      navigate('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        serverErrors.forEach((error: { path: string; msg: string }) => {
          setFormError(error.path as keyof RegisterFormData, {message: error.msg});
        });
      } else {
        dispatch(setError(getErrorMessage(err)));
      }
    }
  };

  return (
    <div className={`${styles['form-container']}`}>
      <h2 className={`${styles['form-title']}`}>Регистрация</h2>
      {authError && <span className={`${styles['form__error']}`}>{authError}</span>}
      <form className={`${styles['form-inputs']}`} onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          {...register('name', {
            required: 'Заполните поле',
            pattern: {
              value: /^[а-яА-ЯёЁ\s-]+$/,
              message: 'Имя должно содержать только русские буквы',
            },
          })}
          placeholder="Введите имя"
          label="Имя"
          error={errors.name?.message}
        />

        <Input
          type="text"
          {...register('surname', {
            required: 'Заполните поле',
            pattern: {
              value: /^[а-яА-ЯёЁ\s-]+$/,
              message: 'Фамилия должна содержать только русские буквы',
            },
          })}
          placeholder="Введите фамилию"
          label="Фамилия"
          error={errors.surname?.message}
        />

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
          {...register('password', {
            required: 'Заполните поле',
            minLength: {
              value: 6,
              message: 'Пароль должен быть не короче 6 символов',
            },
          })}
          placeholder="Введите пароль"
          label="Пароль"
          error={errors.password?.message}
        />
        <Button style={{marginTop: '20px'}} type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
