import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { ISignIn, ISignInResponse, IUser } from '../../ts/interfaces/IUser';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signIn: builder.mutation<ISignInResponse, ISignIn>({
      query: (credentials) => ({
        url: '/token/',
        method: 'POST',
        body: credentials,
      }),
    }),
    getUser: builder.query<IUser, void>({
      query: () => '/users/me',
      transformResponse: (response: any): IUser => {
        //   let student_id = null;
        //   if (response.role.id === 1) {
        //     const studentResponse = await axios.get(
        //       `${import.meta.env.VITE_BACKEND_URL}/students/`,
        //       { headers: await authHeader() }
        //     );
        //     const allStudents = studentResponse.data.results;
        //     const ourStudent = allStudents.find(
        //       (student: any) => student.user.id === response.id
        //     );
        //     student_id = ourStudent.id;
        //   }

        //   let teacher_id = null;
        //   if (response.role.id === 3) {
        //     const teachersResponse = await axios.get(
        //       `${import.meta.env.VITE_BACKEND_URL}/teachers/`,
        //       { headers: await authHeader() }
        //     );
        //     const allTeachers = teachersResponse.data.results;
        //     const ourTeacher = allTeachers.find(
        //       (teacher: any) => teacher.user.id === response.id
        //     );
        //     teacher_id = ourTeacher.id;
        //   }

        return {
          id: response.id,
          teacher_id: 0,
          student_id: 0,
          firstName: response.first_name,
          lastName: response.last_name,
          patronymic: response.patronymic,
          email: response.email,
          roleNames: response.roles.map((role: any) => role.name),
        };
      },
    }),
  }),
});

export const { useLazyGetUserQuery, useSignInMutation } = userApi;
