import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import { mapTeacher } from './teacherApi';
import { mapStudent } from './studentApi';
import { mapStudentRole } from './studentRoleApi';
import { mapFile } from './fileApi';

import {
  IIntensive,
  IIntensiveCreate,
  IIntensiveUpdate,
} from '../../ts/interfaces/IIntensive';
import { IStudent } from '../../ts/interfaces/IStudent';

const mapIntensive = (unmappedIntensive: any): IIntensive => {
  return {
    id: unmappedIntensive.id,
    name: unmappedIntensive.name,
    description: unmappedIntensive.description,
    isOpen: unmappedIntensive.is_open,
    openDate: new Date(unmappedIntensive.open_dt),
    closeDate: new Date(unmappedIntensive.close_dt),
    flows: unmappedIntensive.flows,
    specificStudents: unmappedIntensive.specific_students.map((student: any) =>
      mapStudent(student)
    ),
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
          specific_student_ids: data.specificStudentsIds,
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
            specific_student_ids: data.specificStudentsIds,
            roles: data.roleIds,
            file_ids: data.fileIds,
          },
        };
      },
      transformResponse: (response: any): IIntensive => mapIntensive(response),
    }),
    getFreeStudents: builder.query<IStudent[], number>({
      query: (intensiveId) => `intensives/${intensiveId}/free/`,
      transformResponse: (response: any): IStudent[] =>
        response.map((unmappedStudent: any) => mapStudent(unmappedStudent)),
    }),
    getSpecificFreeStudents: builder.query<IStudent[], number>({
      query: (intensiveId) => `intensives/${intensiveId}/specific-free/`,
      transformResponse: (response: any): IStudent[] =>
        response.map((unmappedStudent: any) => mapStudent(unmappedStudent)),
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
  useLazyGetFreeStudentsQuery,
  useLazyGetSpecificFreeStudentsQuery,
} = intensiveApi;
