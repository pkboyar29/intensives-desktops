import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

import { ITeacherToChoose } from '../../ts/interfaces/ITeacher';

const mapTeacherToChoose = (teacher: any): ITeacherToChoose => {
  return {
    id: teacher.id,
    name: teacher.teacher.user.last_name,
  };
};

export const teacherOnIntensiveApi = createApi({
  reducerPath: 'teacherOnIntensiveApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: 'same-origin',
    prepareHeaders: async (headers) => {
      headers.set(`Authorization`, `Bearer ${Cookies.get('access')}`);

      return headers;
    },
    mode: 'cors',
  }),
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
