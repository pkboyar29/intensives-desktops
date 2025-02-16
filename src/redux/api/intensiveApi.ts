import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
  IIntensive,
  IIntensiveCreate,
  IIntensiveUpdate,
  IIntensiveUploadFiles,
} from '../../ts/interfaces/IIntensive';

import { mapTeacher } from './teacherApi';
import { mapStudentRole } from './studentRoleApi';
import { mapFile } from './fileApi';
import { IFile, IUploadFile } from '../../ts/interfaces/IFile';

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
      query: (data) => ({
        url: '/intensives/',
        method: 'POST',
        body: {
          name: data.name,
          description: data.description,
          is_open: data.isOpen,
          open_dt: data.openDate,
          close_dt: data.closeDate,
          teachers: data.teacherIds,
          flows: data.flowIds,
          roles: data.roleIds,
        },
      }),
      transformResponse: (response: any): IIntensive => mapIntensive(response),
    }),
    updateIntensive: builder.mutation<IIntensive, IIntensiveUpdate>({
      query: (data) => {
        const { id: intensiveId } = data;

        return {
          url: `/intensives/${intensiveId}/`,
          method: 'PUT',
          body: {
            name: data.name,
            description: data.description,
            is_open: data.isOpen,
            open_dt: data.openDate,
            close_dt: data.closeDate,
            teachers: data.teacherIds,
            flows: data.flowIds,
            roles: data.roleIds,
            file_ids: data.fileIds,
          },
        };
      },
      transformResponse: (response: any): IIntensive => mapIntensive(response),
    }),
    uploadFiles: builder.mutation<IFile[], IUploadFile>({
      query: ({ contextId, files }) => {
        const formData = new FormData();
        if (Array.isArray(files)) {
          files.forEach((file) => formData.append('files', file));
        } else {
          formData.append('files', files);
        }

        return {
          url: `/intensives/${contextId}/files/upload/`,
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: any): IFile[] =>
        response.map((unmappedColumn: any) => mapFile(unmappedColumn)),
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
  useUploadFilesMutation,
  useDeleteIntensiveMutation,
} = intensiveApi;
