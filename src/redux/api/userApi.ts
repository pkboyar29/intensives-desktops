import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import Cookies from 'js-cookie';

import { ISignIn, ISignInResponse, IUser } from '../../ts/interfaces/IUser';

export const userApi = createApi({
  reducerPath: 'userApi',
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
        // console.log('we are in transformResponse');
        // console.log(response);

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
          middleName: response.middle_name,
          email: response.email,
          roleId: response.role.id,
        };
      },
    }),
  }),
});

export const { useGetUserQuery, useLazyGetUserQuery, useSignInMutation } =
  userApi;
