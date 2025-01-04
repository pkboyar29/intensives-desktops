import { configureStore, createAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import userReducer from './slices/userSlice';
import intensiveReducer from './slices/intensiveSlice';
import teamReducer from './slices/teamSlice';

import { userApi } from './api/userApi';
import { intensiveApi } from './api/intensiveApi';
import { eventApi } from './api/eventApi';
import { teamApi } from './api/teamApi';
import { teacherApi } from './api/teacherApi';
import { studentApi } from './api/studentApi';
import { studentRoleApi } from './api/studentRoleApi';
import { stageApi } from './api/stageApi';
import { scheduleApi } from './api/scheduleApi';
import { audienceApi } from './api/audienceApi';
import { flowApi } from './api/flowApi';
import { columnApi } from './api/columnApi';
import { markStrategyApi } from './api/markStrategyApi';
import { criteriaApi } from './api/criteriaApi';
import { taskApi } from './api/taskApi';

// export const resetAllStates = createAction('resetAllStates');

export const store = configureStore({
  reducer: {
    user: userReducer,
    intensive: intensiveReducer,
    team: teamReducer,
    [userApi.reducerPath]: userApi.reducer,
    [intensiveApi.reducerPath]: intensiveApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
    [teacherApi.reducerPath]: teacherApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
    [studentRoleApi.reducerPath]: studentRoleApi.reducer,
    [stageApi.reducerPath]: stageApi.reducer,
    [scheduleApi.reducerPath]: scheduleApi.reducer,
    [audienceApi.reducerPath]: audienceApi.reducer,
    [flowApi.reducerPath]: flowApi.reducer,
    [columnApi.reducerPath]: columnApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [markStrategyApi.reducerPath]: markStrategyApi.reducer,
    [criteriaApi.reducerPath]: criteriaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      userApi.middleware,
      intensiveApi.middleware,
      eventApi.middleware,
      teamApi.middleware,
      teacherApi.middleware,
      studentApi.middleware,
      studentRoleApi.middleware,
      stageApi.middleware,
      scheduleApi.middleware,
      audienceApi.middleware,
      flowApi.middleware,
      columnApi.middleware,
      taskApi.middleware,
      markStrategyApi.middleware,
      criteriaApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
