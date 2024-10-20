import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { IStudent } from '../../ts/interfaces/IStudent';

// TODO: учесть, что patronymic (отчество) может быть необязательным
export const mapStudent = (unmappedStudent: any): IStudent => {
  return {
    id: unmappedStudent.id,
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

export const studentApi = createApi({
  reducerPath: 'studentApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getFreeStudents: builder.query<IStudent[], number>({
      query: (intensiveId) => `students/free/?intensive_id=${intensiveId}`,
      transformResponse: (response: any): IStudent[] =>
        response.map((unmappedStudent: any) => mapStudent(unmappedStudent)),
    }),
  }),
});

export const { useLazyGetFreeStudentsQuery } = studentApi;
