import { configureStore } from '@reduxjs/toolkit';
import countryReducer from '@/store/countrySlice';

export const store = configureStore({
  reducer: {
    countries: countryReducer,
  },
});

// RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
