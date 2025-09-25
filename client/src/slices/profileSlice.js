import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';

export const fetchProfile = createAsyncThunk('profile/fetch', async ()=> { const { data } = await api.get('/profile'); return data; });
export const updateProfile = createAsyncThunk('profile/update', async (payload)=> { const { data } = await api.put('/profile', payload); return data; });

const slice = createSlice({
  name: 'profile',
  initialState: { data: null },
  reducers: {},
  extraReducers: b => {
    b.addCase(fetchProfile.fulfilled, (s,a)=> { s.data = a.payload; });
    b.addCase(updateProfile.fulfilled, (s,a)=> { s.data = a.payload; });
  }
});
export default slice.reducer;
