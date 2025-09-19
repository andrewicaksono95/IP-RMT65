import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';

export const fetchFavorites = createAsyncThunk('favorites/fetch', async ()=> { const { data } = await api.get('/favorites'); return data; });
export const addFavorite = createAsyncThunk('favorites/add', async (payload)=> { const { data } = await api.post('/favorites', payload); return data; });
export const deleteFavorite = createAsyncThunk('favorites/delete', async (id)=> { await api.delete(`/favorites/${id}`); return id; });

const slice = createSlice({
  name: 'favorites',
  initialState: { items: [] },
  reducers: {},
  extraReducers: b => {
    b.addCase(fetchFavorites.fulfilled, (s,a)=> { s.items = a.payload; });
    b.addCase(addFavorite.fulfilled, (s,a)=> { s.items.push(a.payload); });
    b.addCase(deleteFavorite.fulfilled, (s,a)=> { s.items = s.items.filter(i=> i.id !== a.payload); });
  }
});
export default slice.reducer;
