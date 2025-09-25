import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';

export const googleLogin = createAsyncThunk('auth/googleLogin', async (id_token) => {
  const { data } = await api.post('/auth/google', { id_token });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
});

export const googleLoginWithCode = createAsyncThunk('auth/googleLoginWithCode', async ({ code, state }) => {
  const { data } = await api.post('/auth/google/exchange', { code, state });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data.user;
});

export const checkAuthStatus = createAsyncThunk('auth/checkStatus', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return rejectWithValue('No authentication found');
  }
  
  try {
    await api.get('/auth/verify');
    const user = JSON.parse(userStr);
    return user;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return rejectWithValue('Session expired');
  }
});

const slice = createSlice({
  name: 'auth',
  initialState: { 
    user: null,
    isLoading: false,
    isInitialized: false
  },
  reducers: { 
    logout: (s) => { 
      s.user = null; 
      localStorage.removeItem('token'); 
      localStorage.removeItem('user');
    },
    setInitialized: (s) => {
      s.isInitialized = true;
    }
  },
  extraReducers: b => {
    b.addCase(googleLogin.fulfilled, (s, a) => { 
      s.user = a.payload;
      s.isInitialized = true;
    });
    b.addCase(googleLoginWithCode.fulfilled, (s, a) => { 
      s.user = a.payload;
      s.isInitialized = true;
    });
    b.addCase(checkAuthStatus.pending, (s) => {
      s.isLoading = true;
    });
    b.addCase(checkAuthStatus.fulfilled, (s, a) => {
      s.user = a.payload;
      s.isLoading = false;
      s.isInitialized = true;
    });
    b.addCase(checkAuthStatus.rejected, (s) => {
      s.user = null;
      s.isLoading = false;
      s.isInitialized = true;
    });
  }
});

export const { logout, setInitialized } = slice.actions;
export default slice.reducer;
