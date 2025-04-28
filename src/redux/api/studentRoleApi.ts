import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
  IStudentRole,
  IStudentRoleCreate,
  IStudentRolePatch,
} from '../../ts/interfaces/IStudentRole';

export const mapStudentRole = (unmappedStudentRole: any): IStudentRole => {
  return {
    id: unmappedStudentRole.id,
    name: unmappedStudentRole.name,
  };
};

export const studentRoleApi = createApi({
  reducerPath: 'studentRolesApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getStudentRoles: builder.query<IStudentRole[], void>({
      query: () => '/student_roles/',
      transformResponse: (response: any): IStudentRole[] =>
        response.results.map((unmappedStudentRole: any) =>
          mapStudentRole(unmappedStudentRole)
        ),
    }),
    createStudentRole: builder.mutation<IStudentRole, IStudentRoleCreate>({
      query: (data) => ({
        url: '/student_roles/',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any): IStudentRole =>
        mapStudentRole(response),
    }),
    updateStudentRole: builder.mutation<IStudentRole, IStudentRolePatch>({
      query: (data) => ({
        url: `/student_roles/${data.id}/`,
        method: 'PATCH',
        body: {
          name: data?.name,
        },
      }),
      transformResponse: (response: any): IStudentRole =>
        mapStudentRole(response),
    }),
    deleteStudentRole: builder.mutation<void, number>({
      query: (id) => ({
        url: `/student_roles/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetStudentRolesQuery,
  useLazyGetStudentRolesQuery,
  useCreateStudentRoleMutation,
  useUpdateStudentRoleMutation,
  useDeleteStudentRoleMutation,
} = studentRoleApi;
