import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

import { IFlow } from '../../ts/interfaces/IFlow';

export const flowApi = createApi({
  reducerPath: 'flowApi',
  baseQuery,
  endpoints: (builder) => ({
    getFlows: builder.query<IFlow[], void>({
      query: () => '/flows/',
      transformResponse: (response: any): IFlow[] =>
        response.results as IFlow[],
    }),
  }),
});

export const { useGetFlowsQuery } = flowApi;
