import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';

export const fetchSuggestions = createAsyncThunk('ai/suggest', async ()=> { const { data } = await api.get('/ai/suggestions'); return data.suggestions; });

const slice = createSlice({
  name: 'ai',
  initialState: { suggestions: [] },
  reducers: {},
  extraReducers: b => { b.addCase(fetchSuggestions.fulfilled, (s,a)=> { s.suggestions = a.payload; }); }
});
export default slice.reducer;
