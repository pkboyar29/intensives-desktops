import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
  ITeacher,
  ITeacherEvent,
  ITeacherOnIntensive,
} from '../../ts/interfaces/ITeacher';

export const mapTeacherEvent = (teacherEvent: any): ITeacherEvent => {
  return {
    id: teacherEvent.id,
    teacherOnIntensiveId: teacherEvent.teacher_on_intensive.id,
    teacherId: teacherEvent.teacher_on_intensive.teacher.id,
    name: getFullName(
      teacherEvent.teacher_on_intensive.teacher.user.first_name,
      teacherEvent.teacher_on_intensive.teacher.user.last_name,
      teacherEvent.teacher_on_intensive.teacher.user.patronymic
    ),
  };
};

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
    getTeachersOnIntensive: builder.query<ITeacherOnIntensive[], number>({
      query: (intensiveId) =>
        `teachers_on_intensives/?intensive=${intensiveId}`,
      transformResponse: (response: any): ITeacherOnIntensive[] => {
        return response.results.map((teacher: any) =>
          mapTeacherOnIntensive(teacher)
        );
      },
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
  useGetTeachersOnIntensiveQuery,
  useLazyGetTeachersOnIntensiveQuery,
  useGetTeachersInUniversityQuery,
} = teacherApi;
