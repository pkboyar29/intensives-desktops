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
    setCurrentUser: (state, action: PayloadAction<IUser>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.toggleNotifications.matchFulfilled,
      (state) => {
        if (state.data) {
          state.data = {
            ...state.data,
            notificationDisabled: !state.data.notificationDisabled,
          };
        }
      }
    );
  },
});

export const {
  reset: resetUserState,
  setCurrentRole,
  setCurrentUser,
} = userSlice.actions;
export default userSlice.reducer;
