import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { IStudent } from '../../ts/interfaces/IStudent';

// TODO: учесть, что patronymic (отчество) может быть необязательным
export const mapStudent = (unmappedStudent: any): IStudent => {
  return {
    id: unmappedStudent.id,
    groupId: unmappedStudent.group.id,
    nameWithGroup: getNameWithGroup(
      unmappedStudent.group.name,
      unmappedStudent.user.first_name,
      unmappedStudent.user.last_name,
      unmappedStudent.user.patronymic
    ),
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
  }),
});

export const { useLazyGetStudentsQuery } = studentApi;
