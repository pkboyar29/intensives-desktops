import { createSlice } from '@reduxjs/toolkit';

import { IIntensive } from '../../ts/interfaces/IIntensive';

interface IntensiveState {
  data: IIntensive | null;
}

const initialState: IntensiveState = {
  data: null,
};

const intensiveSlice = createSlice({
  name: 'currentIntensive',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default intensiveSlice.reducer;
