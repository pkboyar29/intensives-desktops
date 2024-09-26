import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

import { IStage } from '../../ts/interfaces/IStage';

export const stageApi = createApi({
  reducerPath: 'stageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: 'same-origin',
    prepareHeaders: async (headers) => {
      headers.set(`Authorization`, `Bearer ${Cookies.get('access')}`);

      return headers;
    },
    mode: 'cors',
  }),
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
