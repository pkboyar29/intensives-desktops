import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, buildUrl } from './baseQuery';

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
    getCriterias: builder.query<
      {
        results: ICriteria[];
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
      query: (args) => buildUrl('/criterias', args),
      transformResponse: (response: any) => ({
        results: response.results.map((unmappedCriteria: any) =>
          mapCriteria(unmappedCriteria)
        ),
        count: response.count,
        next: response.next,
        previous: response.previous,
      }),
    }),
    createCriteria: builder.mutation<ICriteria, ICriteriaCreate>({
      query: (data) => ({
        url: '/criterias/',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any): ICriteria => mapCriteria(response),
    }),
    updateCriteria: builder.mutation<ICriteria, ICriteriaPatch>({
      query: (data) => ({
        url: `/criterias/${data.id}/`,
        method: 'PATCH',
        body: {
          name: data?.name,
        },
      }),
      transformResponse: (response: any): ICriteria => mapCriteria(response),
    }),
    deleteCriteria: builder.mutation<void, number>({
      query: (id) => ({
        url: `/criterias/${id}/`,
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
