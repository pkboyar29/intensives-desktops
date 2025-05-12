import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, buildUrl } from './baseQuery';

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
    getMarkStrategies: builder.query<
      {
        results: IMarkStrategy[];
        count: number;
        next: string | null;
        previous: string | null;
      },
      {
        search?: string;
        limit?: number;
        offset?: number;
      }
    >({
      query: (args) => buildUrl('/mark_strategies', args),
      transformResponse: (response: any) => ({
        results: response.results.map((unmappedMarkStrategy: any) =>
          mapMarkStrategy(unmappedMarkStrategy)
        ),
        count: response.count,
        next: response.next,
        previous: response.previous,
      }),
    }),
    createMarkStrategy: builder.mutation<IMarkStrategy, IMarkStrategyCreate>({
      query: (data) => ({
        url: '/mark_strategies/',
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
        url: `/mark_strategies/${data.id}/`,
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
        url: `/mark_strategies/${id}/`,
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
