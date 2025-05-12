import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, buildUrl } from './baseQuery';

import {
  ITeacher,
  ITeacherAdmin,
  ITeacherPatch,
  ITeacherRegister,
} from '../../ts/interfaces/ITeacher';
import { mapUniversity } from './universityApi';

export const mapTeacher = (teacher: any): ITeacher => {
  return {
    id: teacher.id,
    name: getFullName(
      teacher.user.first_name,
      teacher.user.last_name,
      teacher.user.patronymic
    ),
  };
};

export const mapTeacherAdmin = (unmappedTeacher: any): ITeacherAdmin => {
  //console.log(unmappedTeacher);
  return {
    id: unmappedTeacher.user.id,
    firstName: unmappedTeacher.user.first_name,
    lastName: unmappedTeacher.user.last_name,
    patronymic: unmappedTeacher.user.patronymic,
    email: unmappedTeacher.user.email,
    //roles: unmappedStudent.roles.map((role: any) => mapRoleName(role.name)),
    university: mapUniversity(unmappedTeacher.university),
    isActive: unmappedTeacher.is_active,
    isManager: unmappedTeacher.is_manager,
  };
};

const getFullName = (
  firstName: string,
  lastName: string,
  patronymic: string
) => {
  return `${lastName} ${firstName[0]}.${patronymic[0]}.`;
};

export const teacherApi = createApi({
  reducerPath: 'teacherApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // TODO: when i can pass university to backend, then pass university here or get this university from token in backend?
    getTeachersInUniversity: builder.query<ITeacher[], void>({
      query: () => `teachers/`,
      transformResponse: (response: any): ITeacher[] =>
        response.results.map((teacher: any) => mapTeacher(teacher)),
    }),
    getTeachersAdmin: builder.query<
      {
        results: ITeacherAdmin[];
        count: number;
        next: string | null;
        previous: string | null;
      },
      {
        university_id?: number | null;
        search?: string;
        limit?: number;
        offset?: number;
      }
    >({
      query: (args) => buildUrl('/teachers', args),
      transformResponse: (response: any) => ({
        results: response.results.map((unmappedTeacher: any) =>
          mapTeacherAdmin(unmappedTeacher)
        ),
        count: response.count,
        next: response.next,
        previous: response.previous,
      }),
    }),
    registerTeacher: builder.mutation<ITeacherAdmin, ITeacherRegister>({
      query: (data) => ({
        url: '/teacher_register/',
        method: 'POST',
        body: {
          first_name: data.firstName,
          last_name: data.lastName,
          patronymic: data?.patronymic,
          email: data.email,
          university: data.university,
          is_manager: data.isManager,
        },
      }),
      transformResponse: (response: any): ITeacherAdmin =>
        mapTeacherAdmin(response[0]), // так как в ответе массив но всегда один элемент
    }),
    updateTeacher: builder.mutation<ITeacherAdmin, ITeacherPatch>({
      query: (data) => ({
        url: `/teachers/${data.id}/`,
        method: 'PATCH',
        body: {
          first_name: data.firstName,
          last_name: data.lastName,
          patronymic: data?.patronymic,
          email: data.email,
          university: data.university?.id,
          reset_password: data.resetPassword,
          is_manager: data.isManager,
        },
      }),
      transformResponse: (response: any): ITeacherAdmin =>
        mapTeacherAdmin(response),
    }),
    deleteTeacher: builder.mutation<void, number>({
      query: (id) => ({
        url: `/teachers/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetTeachersInUniversityQuery,
  useLazyGetTeachersAdminQuery,
  useRegisterTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherApi;
