import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
  IIntensive,
  IIntensiveCreate,
  IIntensiveUpdate,
} from '../../ts/interfaces/IIntensive';

import { mapTeacher } from './teacherApi';
import { mapStudentRole } from './studentRoleApi';
import { mapFile } from './fileApi';

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
    roles: unmappedIntensive.roles.map((role: any) => mapStudentRole(role)),
    files: unmappedIntensive.files.map((file: any) => mapFile(file)),
  };
};

export const intensiveApi = createApi({
  reducerPath: 'intensiveApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getIntensives: builder.query<IIntensive[], void>({
      query: () => '/intensives/',
      transformResponse: (response: any): IIntensive[] => {
        const mappedIntensives: IIntensive[] = response.map(
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
      query: (data) => {
        const formData = new FormData();

        // Добавляем обычные поля
        formData.append('name', data.name);
        if (data.description) {
          formData.append("description", data.description);
        }
        formData.append('is_open', data.isOpen.toString());
        formData.append('open_dt', data.openDate);
        formData.append('close_dt', data.closeDate);
        data.teacherIds.forEach((id) => formData.append("teachers", String(id)));
        data.flowIds.forEach((id) => formData.append("flows", String(id)));
        data.roleIds.forEach((id) => formData.append("roles", String(id)));

        // Добавляем файлы
        if (data.files) {
          data.files.forEach((file) => formData.append('files', file));
        }

        return {
          url: '/intensives/',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: any): IIntensive => mapIntensive(response),
    }),
    updateIntensive: builder.mutation<IIntensive, IIntensiveUpdate>({
      query: (data) => {
        const { id: intensiveId } = data;
        const formData = new FormData();

        formData.append('name', data.name);
        if (data.description) {
          formData.append("description", data.description);
        }
        formData.append('is_open', data.isOpen.toString());
        formData.append('open_dt', data.openDate);
        formData.append('close_dt', data.closeDate);
        data.teacherIds.forEach((id) => formData.append("teachers", String(id)));
        data.flowIds.forEach((id) => formData.append("flows", String(id)));
        data.roleIds.forEach((id) => formData.append("roles", String(id)));
        
        if (data.fileIds) {
          data.fileIds.forEach((id) => formData.append("file_ids", String(id)));
        }
        
        if (data.files) {
          data.files.forEach((file) => formData.append('files', file));
        }

        return {
          url: `/intensives/${intensiveId}/`,
          method: 'PUT',
          body: formData,
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
