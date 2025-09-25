import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api.js';
import { cuteAlert } from '../utils/alerts.js';

export const fetchFavorites = createAsyncThunk('favorites/fetch', async () => { 
  const { data } = await api.get('/favorites'); 
  return data; 
});

export const addFavorite = createAsyncThunk('favorites/add', async (payload, { rejectWithValue }) => { 
  try {
    const { data } = await api.post('/favorites', payload); 
    cuteAlert.love(`Added to your favorites! 💖`, { duration: 3000 });
    return data; 
  } catch (error) {
    if (error.response?.status === 401) {
      cuteAlert.warning('Please login first to add favorites! 🔐', { duration: 4000 });
      return rejectWithValue('Not authenticated');
    } else if (error.response?.status === 409) {
      cuteAlert.info('This fruit is already in your favorites! 🍓', { duration: 3000 });
      return rejectWithValue('Already favorited');
    } else {
      cuteAlert.error('Failed to add to favorites. Please try again! 😔', { duration: 4000 });
      return rejectWithValue(error.message);
    }
  }
});

export const removeFavorite = createAsyncThunk('favorites/remove', async (id, { rejectWithValue }) => { 
  try {
    await api.delete(`/favorites/${id}`); 
    cuteAlert.info('Removed from your favorites 👋', { duration: 2000 });
    return id; 
  } catch (error) {
    cuteAlert.error('Failed to remove from favorites. Please try again! 😔', { duration: 3000 });
    return rejectWithValue(error.message);
  }
});

// Legacy alias for backwards compatibility
export const deleteFavorite = removeFavorite;

const slice = createSlice({
  name: 'favorites',
  initialState: { items: [], isLoading: false },
  reducers: {},
  extraReducers: b => {
    b.addCase(fetchFavorites.pending, (s) => { s.isLoading = true; });
    b.addCase(fetchFavorites.fulfilled, (s,a) => { 
      s.items = a.payload; 
      s.isLoading = false;
    });
    b.addCase(fetchFavorites.rejected, (s) => { s.isLoading = false; });
    
    b.addCase(addFavorite.fulfilled, (s,a) => { s.items.push(a.payload); });
    b.addCase(removeFavorite.fulfilled, (s,a) => { s.items = s.items.filter(i=> i.id !== a.payload); });
  }
});
export default slice.reducer;
