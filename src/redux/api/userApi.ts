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
        return {
          id: response.id,
          teacherId: response.teacher_id,
          studentId: response.student_id,
          firstName: response.first_name,
          lastName: response.last_name,
          patronymic: response.patronymic,
          email: response.email,
          roles: response.roles.map((role: any) => role.name),
          currentRole: null,
        };
      },
    }),
  }),
});

export const { useLazyGetUserQuery, useSignInMutation } = userApi;
