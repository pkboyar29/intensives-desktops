import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import userReducer from './slices/userSlice';
import intensiveReducer from './slices/intensiveSlice';
import teamReducer from './slices/teamSlice';

import { userApi } from './api/userApi';
import { intensiveApi } from './api/intensiveApi';
import { eventApi } from './api/eventApi';
import { teamApi } from './api/teamApi';
import { teacherOnIntensiveApi } from './api/teacherOnIntensiveApi';
import { studentRoleApi } from './api/studentRoleApi';
import { stageApi } from './api/stageApi';
import { audienceApi } from './api/audienceApi';

export const store = configureStore({
  reducer: {
    user: userReducer,
    intensive: intensiveReducer,
    team: teamReducer,
    // is it necessary to do it below?
    [userApi.reducerPath]: userApi.reducer,
    [intensiveApi.reducerPath]: intensiveApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
    [teacherOnIntensiveApi.reducerPath]: teacherOnIntensiveApi.reducer,
    [studentRoleApi.reducerPath]: studentRoleApi.reducer,
    [stageApi.reducerPath]: stageApi.reducer,
    [audienceApi.reducerPath]: audienceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      userApi.middleware,
      intensiveApi.middleware,
      eventApi.middleware,
      teamApi.middleware,
      teacherOnIntensiveApi.middleware,
      studentRoleApi.middleware,
      stageApi.middleware,
      audienceApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
