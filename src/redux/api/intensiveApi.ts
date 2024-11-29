import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
  IIntensive,
  IIntensiveCreate,
  IIntensiveUpdate,
} from '../../ts/interfaces/IIntensive';

import { mapTeacher } from './teacherApi';

const mapIntensive = (unmappedIntensive: any): IIntensive => {
  return {
    id: unmappedIntensive.id,
    name: unmappedIntensive.name,
    description: unmappedIntensive.description,
    isOpen: unmappedIntensive.is_open,
    openDate: new Date(unmappedIntensive.open_dt),
    closeDate: new Date(unmappedIntensive.close_dt),
    flows: unmappedIntensive.flows,
    teachers: unmappedIntensive.teachers.map((teacher: any) =>
      mapTeacher(teacher)
    ),
  };
};

export const intensiveApi = createApi({
  reducerPath: 'intensiveApi',
  baseQuery: baseQueryWithReauth,
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
          is_open: data.isOpen,
          open_dt: data.openDate,
          close_dt: data.closeDate,
          teachers: data.teacherIds,
          flows: data.flowIds,
          university: data.universityId,
          roles: data.roleIds,
        },
      }),
      transformResponse: (response: any): IIntensive => mapIntensive(response),
    }),
    // TODO: отправлять PUT запрос
    updateIntensive: builder.mutation<IIntensive, IIntensiveUpdate>({
      query: (data) => {
        const { id, ...restData } = data;

        return {
          url: `/intensives/${id}/`,
          method: 'PATCH',
          body: {
            ...restData,
            is_open: data.isOpen,
            open_dt: data.openDate,
            close_dt: data.closeDate,
            teachers: data.teacherIds,
            flows: data.flowIds,
            roles: data.roleIds,
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
