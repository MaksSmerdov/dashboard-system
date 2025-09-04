import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import type {ApiData, DataState} from '../../types/data';
import type {RootState} from "../store.ts";

// Временный список эндпоинтов с отображаемыми названиями
const API_ENDPOINTS = [
  {key: 'vr1', url: 'http://169.254.0.156:3002/api/vr1-data', displayName: 'ПК №1'},
  {key: 'vr2', url: 'http://169.254.0.156:3002/api/vr2-data', displayName: 'ПК №2'},
  {key: 'mpa2', url: 'http://169.254.0.156:3002/api/mpa2-data', displayName: 'МПА №2'},
  {key: 'mpa3', url: 'http://169.254.0.156:3002/api/mpa3-data', displayName: 'МПА №3'},
  {key: 'kotel1', url: 'http://169.254.0.166:3002/api/kotel1-data', displayName: 'Котел №1'},
  {key: 'kotel2', url: 'http://169.254.0.166:3002/api/kotel2-data', displayName: 'Котел №2'},
  {key: 'kotel3', url: 'http://169.254.0.166:3002/api/kotel3-data', displayName: 'Котел №3'},
];

// Async thunk для получения данных
export const fetchApiData = createAsyncThunk<
  { key: string; data: ApiData },
  string,
  { rejectValue: string }
>(
  'data/fetchApiData',
  async (key, {rejectWithValue}) => {
    try {
      const endpoint = API_ENDPOINTS.find((ep) => ep.key === key);
      if (!endpoint) {
        return rejectWithValue(`Неизвестный эндпоинт: ${key}`);
      }
      const response = await axios.get<ApiData>(endpoint.url, {
        headers: {Authorization: `Bearer ${localStorage.getItem('accessToken')}`},
      });
      return {key, data: response.data};
    } catch (error) {
      return rejectWithValue(`${error}`);
    }
  }
);

// Async thunk для получения данных со всех эндпоинтов
export const fetchAllApiData = createAsyncThunk<void, void, { rejectValue: string }>(
  'data/fetchAllApiData',
  async (_, {dispatch, getState}) => {
    const state = getState() as RootState;
    // Запускаем запросы только для эндпоинтов, у которых нет данных
    const endpointsToFetch = API_ENDPOINTS.filter((endpoint) => !state.data.data[endpoint.key]);
    if (endpointsToFetch.length === 0) {
      // Если все данные уже загружены, просто обновляем их без изменения loading
      await Promise.all(
        API_ENDPOINTS.map((endpoint) => dispatch(fetchApiData(endpoint.key)).unwrap())
      );
    } else {
      // Устанавливаем loading только для эндпоинтов, у которых нет данных
      await Promise.all(
        endpointsToFetch.map((endpoint) => dispatch(fetchApiData(endpoint.key)).unwrap())
      );
    }
  }
);

const initialState: DataState = {
  data: {},
  loading: {},
  error: {},
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiData.pending, (state, action) => {
        const key = action.meta.arg;
        // Устанавливаем loading только если данных ещё нет
        if (!state.data[key]) {
          state.loading[key] = 'pending';
          state.error[key] = null;
        }
      })
      .addCase(fetchApiData.fulfilled, (state, action) => {
        const {key, data} = action.payload;
        state.loading[key] = 'succeeded';
        state.data[key] = data;
        state.error[key] = null;
      })
      .addCase(fetchApiData.rejected, (state, action) => {
        const key = action.meta.arg;
        state.loading[key] = 'failed';
        state.error[key] = action.payload as string;
      })
      .addCase(fetchAllApiData.pending, (state) => {
        // Устанавливаем loading только для эндпоинтов без данных
        API_ENDPOINTS.forEach((ep) => {
          if (!state.data[ep.key]) {
            state.loading[ep.key] = 'pending';
            state.error[ep.key] = null;
          }
        });
      });
  },
});

export default dataSlice.reducer;

export {API_ENDPOINTS};
