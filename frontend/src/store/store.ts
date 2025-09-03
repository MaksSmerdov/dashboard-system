import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import themeReducer from './slices/themeSlice.ts';
import dataReducer from './slices/dataSlice.ts';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    data: dataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;