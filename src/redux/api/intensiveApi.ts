import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

import {
  IIntensive,
  IIntensiveCreate,
  IIntensiveUpdate,
} from '../../ts/interfaces/IIntensive';

const mapIntensive = (unmappedIntensive: any): IIntensive => {
  return {
    id: unmappedIntensive.id,
    name: unmappedIntensive.name,
    description: unmappedIntensive.description,
    isOpen: unmappedIntensive.is_open,
    open_dt: new Date(unmappedIntensive.open_dt),
    close_dt: new Date(unmappedIntensive.close_dt),
    flow: unmappedIntensive.flow[0],
  };
};

export const intensiveApi = createApi({
  reducerPath: 'intensiveApi',
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
    getIntensives: builder.query<IIntensive[], void>({
      query: () => '/intensives/',
      transformResponse: (response: any): IIntensive[] => {
        const mappedIntensives: IIntensive[] = response.results.map(
          (unmappedIntensive: any) => mapIntensive(unmappedIntensive)
        );

        return mappedIntensives;
      },
    }),
    getIntensive: builder.query<IIntensive, number>({
      query: (intensiveId) => `/intensives/${intensiveId}`,
      transformResponse: (response: any): IIntensive => mapIntensive(response),
    }),
    createIntensive: builder.mutation<IIntensive, IIntensiveCreate>({
      query: (data) => ({
        url: '/intensives/',
        method: 'POST',
        body: {
          ...data,
          university: 1,
          is_open: true,
          roles: [],
          flow: [],
          teachers_command: [],
          files: [],
          stages: [],
        },
      }),
      transformResponse: (response: any): IIntensive => mapIntensive(response),
    }),
    updateIntensive: builder.mutation<IIntensive, IIntensiveUpdate>({
      query: (data) => {
        const { id, ...restData } = data;

        return {
          url: `/intensives/${id}/`,
          method: 'PATCH',
          body: {
            ...restData,
            is_open: true,
            roles: [],
            flow: [],
            teachers_command: [],
            files: [],
            stages: [],
          },
        };
      },
      transformResponse: (response: any): IIntensive => mapIntensive(response),
    }),
    deleteIntensive: builder.mutation<void, number>({
      query: (id) => ({
        url: `/intensives/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetIntensivesQuery,
  useLazyGetIntensiveQuery,
  useGetIntensiveQuery,
  useCreateIntensiveMutation,
  useUpdateIntensiveMutation,
  useDeleteIntensiveMutation,
} = intensiveApi;
