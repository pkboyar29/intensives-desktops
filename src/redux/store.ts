import { configureStore, createAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import userReducer from './slices/userSlice';
import intensiveReducer from './slices/intensiveSlice';
import teamReducer from './slices/teamSlice';
import kanbanReducer from './slices/kanbanSlice';
import windowReducer from './slices/windowSlice';

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
import { fileApi } from './api/fileApi';
import { eventAnswerApi } from './api/eventAnswerApi';
import { eventMarkApi } from './api/eventMarkApi';
import { questionApi } from './api/questionApi';
import { testApi } from './api/testApi';
import { testIntensiveApi } from './api/testIntensiveApi';
import { universityApi } from './api/universityApi';
import { buildingApi } from './api/buildingApi';
import { groupApi } from './api/groupApi';
import { educationApi } from './api/educationApi';
import { relatedListApi } from './api/relatedListApi';
import { breadcrumbApi } from './api/breadcrumbApi';
import { educationRequestApi } from './api/educationRequestApi';
import { educationRequestAnswerApi } from './api/educationRequestAnswerApi';
import { intensiveMarkApi } from './api/intensiveMarkApi';
import { intensiveAnswerApi } from './api/intensiveAnswerApi';

// export const resetAllStates = createAction('resetAllStates');

export const store = configureStore({
  reducer: {
    user: userReducer,
    intensive: intensiveReducer,
    team: teamReducer,
    kanban: kanbanReducer,
    window: windowReducer,
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
    [fileApi.reducerPath]: fileApi.reducer,
    [eventAnswerApi.reducerPath]: eventAnswerApi.reducer,
    [eventMarkApi.reducerPath]: eventMarkApi.reducer,
    [questionApi.reducerPath]: questionApi.reducer,
    [testApi.reducerPath]: testApi.reducer,
    [testIntensiveApi.reducerPath]: testIntensiveApi.reducer,
    [universityApi.reducerPath]: universityApi.reducer,
    [buildingApi.reducerPath]: buildingApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [educationApi.reducerPath]: educationApi.reducer,
    [relatedListApi.reducerPath]: relatedListApi.reducer,
    [breadcrumbApi.reducerPath]: breadcrumbApi.reducer,
    [educationRequestApi.reducerPath]: educationRequestApi.reducer,
    [educationRequestAnswerApi.reducerPath]: educationRequestAnswerApi.reducer,
    [intensiveMarkApi.reducerPath]: intensiveMarkApi.reducer,
    [intensiveAnswerApi.reducerPath]: intensiveAnswerApi.reducer,
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
      criteriaApi.middleware,
      fileApi.middleware,
      eventAnswerApi.middleware,
      eventMarkApi.middleware,
      questionApi.middleware,
      testApi.middleware,
      testIntensiveApi.middleware,
      universityApi.middleware,
      buildingApi.middleware,
      groupApi.middleware,
      educationApi.middleware,
      relatedListApi.middleware,
      breadcrumbApi.middleware,
      educationRequestApi.middleware,
      educationRequestAnswerApi.middleware,
      intensiveMarkApi.middleware,
      intensiveAnswerApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
