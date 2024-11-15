import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { IMarkStrategy } from '../../ts/interfaces/IMarkStrategy';

export const mapMarkStrategy = (unmappedMarkStrategy: any): IMarkStrategy => {
  return {
    id: unmappedMarkStrategy.id,
    name: unmappedMarkStrategy.name,
  };
};

export const markStrategyApi = createApi({
  reducerPath: 'markStrategyApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMarkStrategies: builder.query<IMarkStrategy[], void>({
      query: () => '/mark_strategy/',
      transformResponse: (response: any): IMarkStrategy[] =>
        response.results.map((unmappedMarkStrategy: any) =>
          mapMarkStrategy(unmappedMarkStrategy)
        ),
    }),
  }),
});

export const { useGetMarkStrategiesQuery } = markStrategyApi;
