import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import userReducer from './slices/userSlice';
import intensiveReducer from './slices/intensiveSlice';
import teamReducer from './slices/teamSlice';

import { userApi } from './api/userApi';
import { intensiveApi } from './api/intensiveApi';
import { studentRoleApi } from './api/studentRoleApi';

export const store = configureStore({
  reducer: {
    user: userReducer,
    intensive: intensiveReducer,
    team: teamReducer,
    // is it necessary to do it below?
    [userApi.reducerPath]: userApi.reducer,
    [intensiveApi.reducerPath]: intensiveApi.reducer,
    [studentRoleApi.reducerPath]: studentRoleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      intensiveApi.middleware,
      studentRoleApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
