import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, buildUrl } from './baseQuery';

import { IStudent, IStudentAdmin } from '../../ts/interfaces/IStudent';
import { mapRoleName, mapUserAdmin } from './userApi';
import { mapGroup } from './groupApi';
import { mapStudentRole } from './studentRoleApi';

// TODO: учесть, что patronymic (отчество) может быть необязательным
export const mapStudent = (unmappedStudent: any): IStudent => {
  console.log(unmappedStudent);
  return {
    id: unmappedStudent.id,
    group: {
      id: unmappedStudent.group.id,
      flowId: unmappedStudent.group.flow.id,
    },
    nameWithGroup: getNameWithGroup(
      unmappedStudent.group.name,
      unmappedStudent.user.first_name,
      unmappedStudent.user.last_name,
      unmappedStudent.user.patronymic
    ),
  };
};

export const mapStudentAdmin = (unmappedStudent: any): IStudentAdmin => {
  return {
    //user: mapUserAdmin(unmappedStudent.user),
    id: unmappedStudent.user.id,
    firstName: unmappedStudent.user.first_name,
    lastName: unmappedStudent.user.last_name,
    patronymic: unmappedStudent.user.patronymic,
    email: unmappedStudent.user.email,
    //roles: unmappedStudent.roles.map((role: any) => mapRoleName(role.name)),
    group: mapGroup(unmappedStudent.group),
    listed: unmappedStudent.listed,
  };
};

const getNameWithGroup = (
  groupName: string,
  firstName: string,
  lastName: string,
  patronymic: string
): string => {
  return `${groupName} ${lastName} ${firstName[0]}. ${[patronymic[0]]}.`;
};

interface IStudentListQuery {
  search: string;
  flowsToExclude: number[];
}

export const studentApi = createApi({
  reducerPath: 'studentApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getStudents: builder.query<IStudent[], IStudentListQuery>({
      query: ({ search, flowsToExclude }) =>
        `students/?search=${search}&flows_exclude=${flowsToExclude.join(',')}`,
      transformResponse: (response: any): IStudent[] =>
        response.results.map((unmappedStudent: any) =>
          mapStudent(unmappedStudent)
        ),
    }),
    getStudentsAdmin: builder.query<
      {
        results: IStudentAdmin[];
        count: number;
        next: string | null;
        previous: string | null;
      },
      {
        group?: number | null;
        withChildrenMeta?: boolean;
        limit?: number;
        offset?: number;
      }
    >({
      query: (args) => buildUrl('/students', args),
      transformResponse: (response: any) => ({
        results: response.results.map((unmappedStudent: any) =>
          mapStudentAdmin(unmappedStudent)
        ),
        count: response.count,
        next: response.next,
        previous: response.previous,
      }),
    }),
  }),
});

export const { useLazyGetStudentsQuery, useLazyGetStudentsAdminQuery } =
  studentApi;
