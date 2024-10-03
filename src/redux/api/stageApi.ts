import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

import { IStage } from '../../ts/interfaces/IStage';

export const stageApi = createApi({
  reducerPath: 'stageApi',
  baseQuery,
  endpoints: (builder) => ({
    // TODO: stop getting all stages. get stages for specific intensive (when this endpoint will appear)
    getStages: builder.query<IStage[], void>({
      query: () => '/stages/',
      transformResponse: (response: any): IStage[] =>
        response.results as IStage[],
    }),
  }),
});

export const { useLazyGetStagesQuery } = stageApi;
