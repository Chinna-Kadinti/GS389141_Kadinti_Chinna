import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/auth.types';

const initialState: User = {
  username: '',
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.username = '';
      state.isAuthenticated = false;
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;