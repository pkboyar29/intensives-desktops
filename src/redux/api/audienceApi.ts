import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
  IAudience,
  IAudienceCreate,
  IAudiencePatch,
} from '../../ts/interfaces/IAudience';

export const mapAudience = (unmappedAudience: any): IAudience => {
  return {
    id: unmappedAudience.id,
    name: unmappedAudience.name,
    building: unmappedAudience.building,
  };
};

export const audienceApi = createApi({
  reducerPath: 'audienceApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAudiences: builder.query<
      {
        results: IAudience[];
        count: number;
        next: string | null;
        previous: string | null;
      },
      {
        building?: number | null;
        page?: number;
        pageSize?: number;
      }
    >({
      query: ({ building, page, pageSize }) =>
        `/audiences/${page ? `?page=` + page : ''}${
          pageSize ? `&pageSize=` + pageSize : ''
        }${building ? `&universities=` + building : ''}`,
      transformResponse: (response: any) => ({
        results: response.results.map((unmappedAudience: any) =>
          mapAudience(unmappedAudience)
        ),
        count: response.count,
        next: response.next,
        previous: response.previous,
      }),
    }),
    createAudience: builder.mutation<IAudience, IAudienceCreate>({
      query: (data) => ({
        url: '/audiences/',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any): IAudience => mapAudience(response),
    }),
    updateAudience: builder.mutation<IAudience, IAudiencePatch>({
      query: ({ id, ...patch }) => ({
        url: `/audiences/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      transformResponse: (response: any): IAudience => mapAudience(response),
    }),
    deleteAudience: builder.mutation<void, number>({
      query: (id) => ({
        url: `/audiences/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAudiencesQuery,
  useLazyGetAudiencesQuery,
  useCreateAudienceMutation,
  useUpdateAudienceMutation,
  useDeleteAudienceMutation,
} = audienceApi;
