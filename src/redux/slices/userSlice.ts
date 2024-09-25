import { createSlice } from '@reduxjs/toolkit';
import { userApi } from '../api/userApi';

import { IUser } from '../../ts/interfaces/IUser';

interface UserState {
  data: IUser | null;
}

const initialState: UserState = {
  data: null,
};

const userSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getUser.matchFulfilled,
      (state, { payload }) => {
        state.data = payload;
      }
    );
  },
});

export const { reset: resetUserState } = userSlice.actions;
export default userSlice.reducer;
