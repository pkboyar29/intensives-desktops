import { createSlice } from '@reduxjs/toolkit';
// import teamApi

import { ITeam } from '../../ts/interfaces/ITeam';

interface TeamState {
  data: ITeam | null;
}

const initialState: TeamState = {
  data: null,
};

const teamSlice = createSlice({
  name: 'currentTeam',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {},
});

export const { reset: resetTeamState } = teamSlice.actions;
export default teamSlice.reducer;
