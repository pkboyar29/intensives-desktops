import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { IStudentRole } from '../../ts/interfaces/IStudentRole';

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
  }),
});

export const { useGetStudentRolesQuery } = studentRoleApi;
