import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TDiscoverData } from './discoverTypes';

const initialState: TDiscoverData = {
  swipingData: [],
};

export const discoverSlice = createSlice({
  name: 'discover',
  initialState,
  reducers: {
    resetDiscoverSlice: () => initialState,
    setSwipingDataRedux: (state, action: PayloadAction<any>) => {
      state.swipingData = action.payload;
    },
    addSwipingDataRedux: (state, action: PayloadAction<any>) => {
      state.swipingData = [...state.swipingData, ...action.payload];
    },
  },
});

export const { resetDiscoverSlice, setSwipingDataRedux, addSwipingDataRedux } = discoverSlice.actions;

export default discoverSlice.reducer;
