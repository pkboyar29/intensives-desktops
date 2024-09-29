import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

import { ITeacherToChoose } from '../../ts/interfaces/ITeacher';

const mapTeacherToChoose = (teacher: any): ITeacherToChoose => {
  return {
    id: teacher.id,
    name: teacher.teacher.user.last_name,
  };
};

export const teacherOnIntensiveApi = createApi({
  reducerPath: 'teacherOnIntensiveApi',
  baseQuery,
  endpoints: (builder) => ({
    getTeachersOnIntensive: builder.query<ITeacherToChoose[], number>({
      query: (intensiveId) =>
        `teachers_on_intensives/?intensive=${intensiveId}`,
      transformResponse: (response: any): ITeacherToChoose[] =>
        response.results.map((teacher: any) => mapTeacherToChoose(teacher)),
    }),
  }),
});

export const { useLazyGetTeachersOnIntensiveQuery } = teacherOnIntensiveApi;
