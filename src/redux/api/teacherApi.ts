import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

import { ITeacher, ITeacherOnIntensive } from '../../ts/interfaces/ITeacher';

export const mapTeacherOnIntensive = (
  teacherOnIntensive: any
): ITeacherOnIntensive => {
  return {
    id: teacherOnIntensive.id,
    name: getFullName(
      teacherOnIntensive.teacher.user.first_name,
      teacherOnIntensive.teacher.user.last_name,
      teacherOnIntensive.teacher.user.middle_name
    ),
  };
};

const mapTeacherInUniversity = (teacher: any): ITeacher => {
  return {
    id: teacher.id,
    name: getFullName(
      teacher.user.first_name,
      teacher.user.last_name,
      teacher.user.middle_name
    ),
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
  baseQuery,
  endpoints: (builder) => ({
    getTeachersOnIntensive: builder.query<ITeacherOnIntensive[], number>({
      query: (intensiveId) =>
        `teachers_on_intensives/?intensive=${intensiveId}`,
      transformResponse: (response: any): ITeacherOnIntensive[] =>
        response.results.map((teacher: any) => mapTeacherOnIntensive(teacher)),
    }),
    // TODO: when i can pass university to backend, then pass university here
    getTeachersInUniversity: builder.query<ITeacher[], void>({
      query: () => `teachers/`,
      transformResponse: (response: any): ITeacher[] =>
        response.results.map((teacher: any) => mapTeacherInUniversity(teacher)),
    }),
  }),
});

export const {
  useLazyGetTeachersOnIntensiveQuery,
  useGetTeachersInUniversityQuery,
} = teacherApi;
