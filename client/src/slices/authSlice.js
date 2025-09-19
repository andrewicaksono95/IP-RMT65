import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';

export const googleLogin = createAsyncThunk('auth/googleLogin', async (id_token) => {
  const { data } = await api.post('/auth/google', { id_token });
  localStorage.setItem('token', data.token);
  return data.user;
});

export const googleLoginWithCode = createAsyncThunk('auth/googleLoginWithCode', async ({ code, state }) => {
  const { data } = await api.post('/auth/google/exchange', { code, state });
  localStorage.setItem('token', data.token);
  return data.user;
});

const slice = createSlice({
  name: 'auth',
  initialState: { user: null },
  reducers: { logout: (s)=> { s.user=null; localStorage.removeItem('token'); } },
  extraReducers: b => {
    b.addCase(googleLogin.fulfilled, (s,a)=> { s.user = a.payload; });
    b.addCase(googleLoginWithCode.fulfilled, (s,a)=> { s.user = a.payload; });
  }
});
export const { logout } = slice.actions;
export default slice.reducer;
