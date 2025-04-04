import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import {
  IUniversity,
  IUniversityCreate,
  IUniversityPatch,
} from '../../ts/interfaces/IUniversity';
import { childEntitiesMeta } from '../../ts/types/types';

export const mapUniversity = (unmappedUniversity: any): IUniversity => {
  return {
    id: unmappedUniversity.id,
    name: unmappedUniversity.name,
  };
};

export const universityApi = createApi({
  reducerPath: 'universityApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getUniversities: builder.query<
      {
        results: IUniversity[];
        count: number;
        next: string | null;
        previous: string | null;
        childEntitiesMeta?: childEntitiesMeta[];
      },
      { withChildrenMeta?: boolean; page?: number; pageSize?: number }
    >({
      query: ({ withChildrenMeta, page, pageSize }) =>
        `/universities/${page ? `?page=` + page : ''}${
          pageSize ? `&pageSize=` + pageSize : ''
        }${withChildrenMeta ? `&withChildrenMeta=` + withChildrenMeta : ''}`,
      transformResponse: (response: any) => ({
        results: response.results.map((unmappedUniversity: any) =>
          mapUniversity(unmappedUniversity)
        ),
        count: response.count,
        next: response.next,
        previous: response.previous,
        childEntitiesMeta: response.child_entities_meta,
      }),
    }),
    createUniversity: builder.mutation<IUniversity, IUniversityCreate>({
      query: (data) => ({
        url: '/universities/',
        method: 'POST',
        body: {
          name: data.name,
        },
      }),
      transformResponse: (response: any): IUniversity =>
        mapUniversity(response),
    }),
    updateUniversity: builder.mutation<IUniversity, IUniversityPatch>({
      query: (data) => ({
        url: `/universities/${data.id}`,
        method: 'PATCH',
        body: {
          name: data?.name,
        },
      }),
      transformResponse: (response: any): IUniversity =>
        mapUniversity(response),
    }),
    deleteUniversity: builder.mutation<void, number>({
      query: (id) => ({
        url: `/universities/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useLazyGetUniversitiesQuery,
  useCreateUniversityMutation,
  useUpdateUniversityMutation,
  useDeleteUniversityMutation,
} = universityApi;
