import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
  ICriteria,
  ICriteriaCreate,
  ICriteriaPatch,
} from '../../ts/interfaces/ICriteria';
import { IColumnCreate } from '../../ts/interfaces/IColumn';

export const mapCriteria = (unmappedCriteria: any): ICriteria => {
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
      query: () => `/criteria/`,
      transformResponse: (response: any): ICriteria[] =>
        response.results.map((unmappedCriteria: any) =>
          mapCriteria(unmappedCriteria)
        ),
    }),
    createCriteria: builder.mutation<ICriteria, ICriteriaCreate>({
      query: (data) => ({
        url: '/criteria/',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any): ICriteria => mapCriteria(response),
    }),
    updateCriteria: builder.mutation<ICriteria, ICriteriaPatch>({
      query: (data) => ({
        url: `/criteria/${data.id}/`,
        method: 'PATCH',
        body: {
          name: data?.name,
        },
      }),
      transformResponse: (response: any): ICriteria => mapCriteria(response),
    }),
    deleteCriteria: builder.mutation<void, number>({
      query: (id) => ({
        url: `/criteria/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCriteriasQuery,
  useLazyGetCriteriasQuery,
  useCreateCriteriaMutation,
  useUpdateCriteriaMutation,
  useDeleteCriteriaMutation,
} = criteriaApi;
