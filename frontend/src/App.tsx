// src/App.tsx
import * as React from "react";
import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Routes, Route, Navigate, BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import type {RootState} from "./store/store";
import {setCredentials, setError, logout} from "./store/slices/authSlice.ts";
import RegisterForm from './modules/Forms/RegisterForm';
import LoginForm from './modules/Forms/LoginForm';
import styles from './App.module.scss';
import Home from "./modules/Home/Home.tsx";

const BASE_URL = 'http://localhost:5000/api/auth';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const {token} = useSelector((state: RootState) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setChecking(false);
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      try {
        const response = await axios.get(`${BASE_URL}/me`);
        dispatch(setCredentials({token: storedToken, user: response.data.user}));
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          dispatch(setError('Токен недействителен, пожалуйста, войдите снова'));
          dispatch(logout());
        } else {
          dispatch(setError('Не удалось проверить токен. Проверьте соединение.'));
        }
      } finally {
        setChecking(false);
      }
    };

    checkToken();
  }, [dispatch]);

  // Синхронизируем axios столбец заголовка с текущим token в redux
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Пока мы проверяем токен, можно вернуть простой загрузчик (или null)
  if (checking) {
    return <div className={`${styles['container']}`}><p>Проверка сессии...</p></div>;
  }

  return (
    <BrowserRouter>
      <div className={`${styles['container']}`}>
        <Routes>
          <Route
            path="/register"
            element={token ? <Navigate to="/profile"/> : <RegisterForm/>}
          />
          <Route
            path="/login"
            element={token ? <Navigate to="/dashboard"/> : <LoginForm/>}
          />
          <Route
            path="/dashboard"
            element={token ? <Home/> : <Navigate to="/login"/>}
          />
          <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'}/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
