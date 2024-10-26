import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { ITeacher, ITeacherOnIntensive } from '../../ts/interfaces/ITeacher';

export const mapTeacherOnIntensive = (
  teacherOnIntensive: any
): ITeacherOnIntensive => {
  return {
    id: teacherOnIntensive.id,
    teacherId: teacherOnIntensive.teacher.id,
    name: getFullName(
      teacherOnIntensive.teacher.user.first_name,
      teacherOnIntensive.teacher.user.last_name,
      teacherOnIntensive.teacher.user.patronymic
    ),
  };
};

const mapTeacherInUniversity = (teacher: any): ITeacher => {
  return {
    id: teacher.id,
    name: getFullName(
      teacher.user.first_name,
      teacher.user.last_name,
      teacher.user.patronymic
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
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // TODO: тут я храню только id препода на интенсиве, однако надо еще хранить id препода
    getTeachersOnIntensive: builder.query<ITeacherOnIntensive[], number>({
      query: (intensiveId) => `teachers_on_intensives/?intensiv=${intensiveId}`,
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
