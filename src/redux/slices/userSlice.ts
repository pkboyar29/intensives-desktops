import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userApi } from '../api/userApi';

import { IUser, UserRole } from '../../ts/interfaces/IUser';

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
    setCurrentRole: (state, action: PayloadAction<UserRole>) => {
      if (state.data) {
        state.data = {
          ...state.data,
          currentRole: action.payload,
        };
      }
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

export const { reset: resetUserState, setCurrentRole } = userSlice.actions;
export default userSlice.reducer;
