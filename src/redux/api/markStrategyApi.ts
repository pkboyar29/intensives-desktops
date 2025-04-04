import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
  IMarkStrategy,
  IMarkStrategyCreate,
  IMarkStrategyPatch,
} from '../../ts/interfaces/IMarkStrategy';

export const mapMarkStrategy = (unmappedMarkStrategy: any): IMarkStrategy => {
  return {
    id: unmappedMarkStrategy.id,
    name: unmappedMarkStrategy.name,
    lowBound: unmappedMarkStrategy.low_bound,
    highBound: unmappedMarkStrategy.high_bound,
  };
};

export const markStrategyApi = createApi({
  reducerPath: 'markStrategyApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMarkStrategies: builder.query<IMarkStrategy[], void>({
      query: () => `/mark_strategy/`,
      transformResponse: (response: any): IMarkStrategy[] =>
        response.results.map((unmappedMarkStrategies: any) =>
          mapMarkStrategy(unmappedMarkStrategies)
        ),
    }),
    createMarkStrategy: builder.mutation<IMarkStrategy, IMarkStrategyCreate>({
      query: (data) => ({
        url: '/mark_strategy/',
        method: 'POST',
        body: {
          name: data.name,
          low_bound: data.lowBound,
          high_bound: data.highBound,
        },
      }),
      transformResponse: (response: any): IMarkStrategy =>
        mapMarkStrategy(response),
    }),
    updateMarkStrategy: builder.mutation<IMarkStrategy, IMarkStrategyPatch>({
      query: (data) => ({
        url: `/mark_strategy/${data.id}`,
        method: 'PATCH',
        body: {
          name: data?.name,
          low_bound: data?.lowBound,
          high_bound: data?.highBound,
        },
      }),
      transformResponse: (response: any): IMarkStrategy =>
        mapMarkStrategy(response),
    }),
    deleteMarkStrategy: builder.mutation<void, number>({
      query: (id) => ({
        url: `/mark_strategy/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetMarkStrategiesQuery,
  useLazyGetMarkStrategiesQuery,
  useCreateMarkStrategyMutation,
  useUpdateMarkStrategyMutation,
  useDeleteMarkStrategyMutation,
} = markStrategyApi;
