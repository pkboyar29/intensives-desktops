import { createSlice } from '@reduxjs/toolkit';
import { intensiveApi } from '../api/intensiveApi';

import { IIntensive } from '../../ts/interfaces/IIntensive';
import { fileApi } from '../api/fileApi';

interface IntensiveState {
  data: IIntensive | null;
}

const initialState: IntensiveState = {
  data: null,
};

const intensiveSlice = createSlice({
  name: 'currentIntensive',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        intensiveApi.endpoints.getIntensive.matchFulfilled,
        (state, { payload }) => {
          state.data = payload;
        }
      )
      .addMatcher(
        intensiveApi.endpoints.createIntensive.matchFulfilled,
        (state, { payload }) => {
          state.data = payload;
        }
      )
      .addMatcher(
        intensiveApi.endpoints.updateIntensive.matchFulfilled,
        (state, { payload }) => {
          state.data = payload;
        }
      )
      .addMatcher(
        intensiveApi.endpoints.updateIntensiveOpenness.matchFulfilled,
        (state) => {
          if (state.data) {
            state.data = { ...state.data, isOpen: !state.data.isOpen };
          }
        }
      )
      /*
      .addMatcher(
        intensiveApi.endpoints.uploadFiles.matchFulfilled,
        (state, { payload }) => {
          if (state.data) {
            // Добавляем загруженные файлы к текущим в состоянии
            state.data.files = [...state.data.files, ...payload];
          }
        }
      )
        */
      .addMatcher(
        fileApi.endpoints.uploadFiles.matchFulfilled,
        (state, { meta, payload }) => {
          const { arg } = meta;
          // Добавляем загруженные файлы к текущим в состоянии если вызвался запрос на загрузку файлов интенсиву
          if (
            arg.originalArgs.context === 'intensives' &&
            state.data?.id === arg.originalArgs.contextId
          ) {
            if (state.data) {
              state.data.files = [...state.data?.files, ...payload];
            }
          }
        }
      )
      .addMatcher(
        intensiveApi.endpoints.deleteIntensive.matchFulfilled,
        (state) => {
          state.data = null;
        }
      );
  },
});

export const { reset: resetIntensiveState } = intensiveSlice.actions;
export default intensiveSlice.reducer;
