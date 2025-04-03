import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    incremented: (state, action) => {
      state.value += action.payload;
    },
    decremented: (state, action) => {
      state.value -= action.payload;
    }
  }
});

export const { incremented, decremented } = counterSlice.actions;

const reducer = counterSlice.reducer;

export default reducer;
