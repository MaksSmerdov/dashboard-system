// src/store/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axios';

interface User {
  name: string;
  surname: string;
  email: string;
}
interface AuthState {
  token: string | null;
  user: User | null;
  error: string | null;
  loading: boolean;
}

const parseUser = (): User | null => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) as User : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  user: parseUser(),
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user?: User }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      state.error = null;
      state.loading = false;

      localStorage.setItem('token', action.payload.token);
      if (action.payload.user) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }

      // Устанавливаем заголовок для axios
      api.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      state.loading = false;

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Убираем заголовок
      delete api.defaults.headers.common['Authorization'];
    },
  },
});

export const { setCredentials, setError, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
