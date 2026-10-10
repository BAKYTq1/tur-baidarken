import { configureStore } from '@reduxjs/toolkit';
import { subscribe } from '../shared/i18n';
import lang, { langChanged } from './langSlice';
import tours from './toursSlice';
import reviews from './reviewsSlice';
import auth from './authSlice';

export const store = configureStore({
  reducer: { lang, tours, reviews, auth },
});

// i18n → Redux: любая смена языка (в том числе вне React) попадает в стор
subscribe((l) => store.dispatch(langChanged(l)));