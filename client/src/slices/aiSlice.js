import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';

export const fetchSuggestions = createAsyncThunk(
  'ai/suggest', 
  async (favoriteIds = []) => { 
    const params = favoriteIds.length > 0 ? { favoriteIds: favoriteIds.join(',') } : {};
    const { data } = await api.get('/ai/suggestions', { params }); 
    return data.suggestions; 
  }
);

const slice = createSlice({
  name: 'ai',
  initialState: { 
    suggestions: [],
    loading: false,
    error: null
  },
  reducers: {
    clearSuggestions: (state) => {
      state.suggestions = [];
    }
  },
  extraReducers: b => { 
    b.addCase(fetchSuggestions.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchSuggestions.fulfilled, (s, a) => { 
      s.suggestions = a.payload;
      s.loading = false; 
    });
    b.addCase(fetchSuggestions.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message;
    });
  }
});

export const { clearSuggestions } = slice.actions;
export default slice.reducer;
