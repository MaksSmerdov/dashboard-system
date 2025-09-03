import {createSlice} from "@reduxjs/toolkit";

interface ThemeState {
  theme: 'light' | 'dark';
}

const savedTheme = localStorage.getItem("app_theme");
const initialState: ThemeState = {
  theme: savedTheme === 'light' ? 'light' : 'dark',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      localStorage.setItem("app_theme", newTheme);
    }
  }
});

export const {toggleTheme} = themeSlice.actions;
export default themeSlice.reducer;