import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { ITeacher } from '../../ts/interfaces/ITeacher';

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
  }),
});

export const { useGetTeachersInUniversityQuery } = teacherApi;
