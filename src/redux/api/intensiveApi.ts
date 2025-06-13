import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import { mapTeacher } from './teacherApi';
import { mapStudent } from './studentApi';
import { mapStudentRole } from './studentRoleApi';
import { mapFile } from './fileApi';

import {
  IIntensive,
  IIntensiveCreate,
  IIntensiveShort,
  IIntensiveUpdate,
} from '../../ts/interfaces/IIntensive';
import { IStudent } from '../../ts/interfaces/IStudent';

const mapIntensive = (unmappedIntensive: any): IIntensive => {
  return {
    id: unmappedIntensive.id,
    name: unmappedIntensive.name,
    description: unmappedIntensive.description,
    isVisible: unmappedIntensive.is_visible,
    openDate: new Date(unmappedIntensive.open_dt),
    closeDate: new Date(unmappedIntensive.close_dt),
    flows: unmappedIntensive.flows,
    specificStudents: unmappedIntensive.specific_students.map((student: any) =>
      mapStudent(student)
    ),
    teachers: unmappedIntensive.teachers.map((teacher: any) =>
      mapTeacher(teacher)
    ),
    managers: unmappedIntensive.managers.map((manager: any) =>
      mapTeacher(manager)
    ),
    creatorId: unmappedIntensive.creator,
    roles: unmappedIntensive.roles.map((role: any) => mapStudentRole(role)),
    files: unmappedIntensive.files.map((file: any) => mapFile(file)),
  };
};

const mapIntensiveShort = (unmappedIntensive: any): IIntensiveShort => {
  return {
    id: unmappedIntensive.id,
    name: unmappedIntensive.name,
    description: unmappedIntensive.description,
    isVisible: unmappedIntensive.is_visible,
    openDate: new Date(unmappedIntensive.open_dt),
    closeDate: new Date(unmappedIntensive.close_dt),
    flows: unmappedIntensive.flows,
    teachers: unmappedIntensive.teachers,
  };
};

export const intensiveApi = createApi({
  reducerPath: 'intensiveApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getIntensives: builder.query<
      {
        results: IIntensiveShort[];
        count: number;
        next: string | null;
        previous: string | null;
      },
      {
        isMentor: boolean;
        page: number;
        search: string;
        visibility?: 'all' | 'visible' | 'invisible';
        relevance: 'all' | 'relevant' | 'past';
        sortOption: 'fromOldToNew' | 'fromNewToOld';
      }
    >({
      query: ({
        isMentor,
        page,
        search,
        visibility,
        relevance,
        sortOption,
      }) => {
        const params = new URLSearchParams();
        params.append('is_mentor', isMentor.toString());
        params.append('page', page.toString());
        params.append('search', search);
        params.append('relevance', relevance);
        params.append(
          'ordering',
          sortOption === 'fromOldToNew' ? 'open_dt' : '-open_dt'
        );

        if (visibility) {
          params.append('visibility', visibility);
        }

        return `/intensives/?${params.toString()}`;
      },
      transformResponse: (response: any) => {
        const mappedIntensives: IIntensiveShort[] = response.results.map(
          (unmappedIntensive: any) => mapIntensiveShort(unmappedIntensive)
        );

        return {
          results: mappedIntensives,
          count: response.count,
          next: response.next,
          previous: response.previous,
        };
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
          is_visible: data.isVisible,
          open_dt: data.openDate,
          close_dt: data.closeDate,
          teachers: data.teacherIds,
          managers: data.managerIds,
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
            is_visible: data.isVisible,
            open_dt: data.openDate,
            close_dt: data.closeDate,
            teachers: data.teacherIds,
            managers: data.managerIds,
            flows: data.flowIds,
            specific_student_ids: data.specificStudentsIds,
            roles: data.roleIds,
            file_ids: data.fileIds,
          },
        };
      },
      transformResponse: (response: any): IIntensive => mapIntensive(response),
    }),
    updateIntensiveVisibility: builder.mutation<
      string,
      { visibility: boolean; intensiveId: number }
    >({
      query: (data) => ({
        url: `/intensives/${data.intensiveId}/visibility/`,
        method: 'PATCH',
        body: {
          visibility: data.visibility,
        },
      }),
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
  useLazyGetIntensivesQuery,
  useGetIntensiveQuery,
  useCreateIntensiveMutation,
  useUpdateIntensiveMutation,
  useUpdateIntensiveVisibilityMutation,
  useDeleteIntensiveMutation,
  useLazyGetFreeStudentsQuery,
  useLazyGetSpecificFreeStudentsQuery,
} = intensiveApi;
