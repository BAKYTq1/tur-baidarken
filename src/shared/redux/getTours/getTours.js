import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { publicApi } from '../shared/api/public';
import { flattenLoc } from '../shared/lib/loc'; // перенесите сюда loc.js
import { selectLang } from './langSlice';

export const fetchTours = createAsyncThunk(
  'tours/fetch',
  async (_, { signal, rejectWithValue }) => {
    try {
      return await publicApi.tours(signal);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
  {
    // не грузим повторно, если уже загружено или грузится
    condition: (_, { getState }) => getState().tours.status === 'idle',
  },
);

const toursSlice = createSlice({
  name: 'tours',
  initialState: { items: [], status: 'idle', error: null }, // idle | loading | ready | failed
  reducers: {
    resetTours: () => ({ items: [], status: 'idle', error: null }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTours.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(fetchTours.fulfilled, (s, a) => {
        s.status = 'ready';
        s.items = a.payload;
      })
      .addCase(fetchTours.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload || a.error.message;
      });
  },
});

export const { resetTours } = toursSlice.actions;

const selectRaw = (state) => state.tours.items;
export const selectToursStatus = (state) => state.tours.status;
export const selectToursError = (state) => state.tours.error;

// Туры уже на языке посетителя: { ru, en, kg } → строки
export const selectTours = createSelector([selectRaw, selectLang], (items, lang) =>
  flattenLoc(items, lang),
);

// Один тур по id (id из URL приходит строкой, поэтому сравниваем как строки)
export const selectTourById = (state, id) =>
  selectTours(state).find((t) => String(t.id) === String(id));

export default toursSlice.reducer;