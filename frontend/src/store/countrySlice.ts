import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CountryState {
  value: number;
}

const initialState: CountryState = {
  value: 0,
};

export const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = countrySlice.actions;

export default countrySlice.reducer;
