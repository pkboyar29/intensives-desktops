import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { IStudent } from '../../ts/interfaces/IStudent';

// TODO: учесть, что patronymic (отчество) может быть необязательным
const mapStudent = (unmappedStudent: any): IStudent => {
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
    // TODO: переименовать потом на getFreeStudents
    getStudentsInFlow: builder.query<IStudent[], number>({
      query: (flowId) => `students/?flow_id=${flowId}`,
      transformResponse: (response: any): IStudent[] =>
        response.results.map((unmappedStudent: any) =>
          mapStudent(unmappedStudent)
        ),
    }),
  }),
});

export const { useLazyGetStudentsInFlowQuery } = studentApi;
