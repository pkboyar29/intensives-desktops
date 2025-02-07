import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { teamApi } from '../api/teamApi';

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
    setTeam: (state, action: PayloadAction<ITeam>) => {
      state.data = action.payload;
    },
    reset: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      teamApi.endpoints.getMyTeam.matchFulfilled,
      (state, { payload }) => {
        state.data = payload;
      }
    );
  },
});

export const { reset: resetTeamState, setTeam } = teamSlice.actions;
export default teamSlice.reducer;
