import { createSlice, nanoid } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'ui',
  initialState: { active: 0, errors: [] },
  reducers: {
    requestStarted: s=> { s.active++; },
    requestFinished: s=> { s.active = Math.max(0, s.active-1); },
    pushError: {
      reducer: (s,a)=> { s.errors.push(a.payload); },
      prepare: (message)=> ({ payload: { id: nanoid(), message } })
    },
    dismissError: (s,a)=> { s.errors = s.errors.filter(e=> e.id !== a.payload); }
  }
});
export const { requestStarted, requestFinished, pushError, dismissError } = slice.actions;
export default slice.reducer;
