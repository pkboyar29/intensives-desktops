import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth, buildUrl } from './baseQuery';

import {
  IStudent,
  IStudentAdmin,
  IStudentPatch,
  IStudentRegister,
} from '../../ts/interfaces/IStudent';
import { mapRoleName, mapUserAdmin } from './userApi';
import { mapGroup } from './groupApi';
import { mapStudentRole } from './studentRoleApi';
import { IUploadXlsxError } from '../../ts/interfaces/IUser';

// TODO: учесть, что patronymic (отчество) может быть необязательным
export const mapStudent = (unmappedStudent: any): IStudent => {
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

export const mapXlsxError = (unmappedError: any): IUploadXlsxError => {
  return {
    rowId: unmappedError.row_id,
    errorInfo: unmappedError.error_info,
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
        search?: string;
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
    registerStudent: builder.mutation<IStudentAdmin, IStudentRegister>({
      query: (data) => ({
        url: '/student_register/',
        method: 'POST',
        body: {
          first_name: data.firstName,
          last_name: data.lastName,
          patronymic: data?.patronymic,
          email: data.email,
          group: data.group,
        },
      }),
      transformResponse: (response: any): IStudentAdmin =>
        mapStudentAdmin(response[0]), // так как в ответе массив но всегда один элемент
    }),
    registerStudentsFileXlsx: builder.mutation<
      { results: IStudentAdmin[]; errors: IUploadXlsxError[] },
      { group?: string; file: File }
    >({
      query: ({ group, file }) => {
        const formData = new FormData();

        formData.append('file', file);
        if (group) {
          formData.append('group', group);
        }
        return {
          url: `/student_register/files/xlsx/`,
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: any) => ({
        results: response.results.map((unmappedStudent: any) =>
          mapStudentAdmin(unmappedStudent)
        ),
        errors: response.errors.map((unmappedError: any) =>
          mapXlsxError(unmappedError)
        ),
      }),
    }),
    updateStudent: builder.mutation<IStudentAdmin, IStudentPatch>({
      query: (data) => ({
        url: `/students/${data.id}/`,
        method: 'PATCH',
        body: {
          first_name: data.firstName,
          last_name: data.lastName,
          patronymic: data?.patronymic,
          email: data.email,
          group: data.group?.id,
          reset_password: data.resetPassword,
        },
      }),
      transformResponse: (response: any): IStudentAdmin =>
        mapStudentAdmin(response),
    }),
    deleteStudent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/students/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useLazyGetStudentsQuery,
  useLazyGetStudentsAdminQuery,
  useRegisterStudentMutation,
  useRegisterStudentsFileXlsxMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;
