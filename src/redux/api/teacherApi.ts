import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, buildUrl } from './baseQuery';

import { ITeacher, ITeacherAdmin } from '../../ts/interfaces/ITeacher';
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
  return {
    id: unmappedTeacher.user.id,
    firstName: unmappedTeacher.user.first_name,
    lastName: unmappedTeacher.user.last_name,
    patronymic: unmappedTeacher.user.patronymic,
    email: unmappedTeacher.user.email,
    //roles: unmappedStudent.roles.map((role: any) => mapRoleName(role.name)),
    university: mapUniversity(unmappedTeacher.university),
    isActive: unmappedTeacher.is_active,
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
  }),
});

export const { useGetTeachersInUniversityQuery, useLazyGetTeachersAdminQuery } =
  teacherApi;
