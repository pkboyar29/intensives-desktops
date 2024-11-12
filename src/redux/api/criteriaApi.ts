import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { ICriteria } from '../../ts/interfaces/ICriteria';

const mapCriteria = (unmappedCriteria: any): ICriteria => {
  return {
    id: unmappedCriteria.id,
    name: unmappedCriteria.name,
  };
};

export const criteriaApi = createApi({
  reducerPath: 'criteriaApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getCriterias: builder.query<ICriteria[], void>({
      query: () => '/criteria/',
      transformResponse: (response: any): ICriteria[] =>
        response.results.map((unmappedCriteria: any) =>
          mapCriteria(unmappedCriteria)
        ),
    }),
  }),
});

export const { useGetCriteriasQuery } = criteriaApi;
