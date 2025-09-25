import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';

export const fetchFruits = createAsyncThunk('fruits/fetch', async (params) => {
  const { data } = await api.get('/fruits', { params });
  return data;
});

export const fetchFruit = createAsyncThunk('fruits/fetchOne', async (id) => {
  const { data } = await api.get(`/fruits/${id}`);
  return data;
});

const slice = createSlice({
  name: 'fruits',
  initialState: { rows: [], count: 0, selected: null, status: 'idle', filters: {} },
  reducers: { reset: s=> { s.rows=[]; s.count=0; s.selected=null; } },
  extraReducers: b => {
    b.addCase(fetchFruits.pending, s=> { s.status='loading'; });
    b.addCase(fetchFruits.fulfilled, (s,a)=> { s.status='succeeded'; if ((a.meta.arg?.offset||0)===0) { s.rows=a.payload.rows; } else { s.rows.push(...a.payload.rows); } s.count=a.payload.count; });
    b.addCase(fetchFruit.pending, s=> { s.status='loading'; });
    b.addCase(fetchFruit.fulfilled, (s,a)=> { s.status='succeeded'; s.selected=a.payload; });
  }
});
export const { reset } = slice.actions;
export default slice.reducer;
