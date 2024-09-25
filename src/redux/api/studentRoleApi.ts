import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

import {
  IStudentRole,
  IStudentRoleCreate,
} from '../../ts/interfaces/IStudentRole';

export const studentRoleApi = createApi({
  reducerPath: 'studentRolesApi',
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
    getStudentRoles: builder.query<IStudentRole[], void>({
      query: () => '/roles_on_intensives/',
      transformResponse: (response: any): IStudentRole[] =>
        response.results as IStudentRole[],
    }),
    createStudentRole: builder.mutation<IStudentRole, IStudentRoleCreate>({
      query: (data) => ({
        url: '/roles_on_intensives/',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any): IStudentRole =>
        response as IStudentRole,
    }),
    deleteStudentRole: builder.mutation<void, number>({
      query: (id) => ({
        url: `/roles_on_intensives/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetStudentRolesQuery,
  useCreateStudentRoleMutation,
  useDeleteStudentRoleMutation,
} = studentRoleApi;
