import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import { mapTeacher } from './teacherApi';
import { mapStudent } from './studentApi';

import {
  IIntensiveMark,
  IIntensiveMarkManager,
  IIntensiveMarkCreate,
  IIntensiveMarkUpdate,
} from '../../ts/interfaces/IIntensiveMark';

export const mapIntensiveMark = (unmappedMark: any): IIntensiveMark => {
  return {
    id: unmappedMark.id,
    mark: unmappedMark.mark,
    comment: unmappedMark.comment,
    teacher: mapTeacher(unmappedMark.teacher),
    student: unmappedMark.student,
    createdDate: new Date(unmappedMark.created_at),
    updatedDate: new Date(unmappedMark.updated_at),
  };
};

export const mapIntensiveMarkManager = (
  unmappedMark: any
): IIntensiveMarkManager => {
  return {
    id: unmappedMark.id,
    student: mapStudent(unmappedMark.student),
    teacher: mapTeacher(unmappedMark.teacher),
    mark: unmappedMark.mark,
  };
};

export const intensiveMarkApi = createApi({
  reducerPath: 'intensiveMarkApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getIntensiveMarks: builder.query<IIntensiveMarkManager[], number>({
      query: (intensiveId) => `/intensive_marks/?intensive_id=${intensiveId}`,
      transformResponse: (response: any): IIntensiveMarkManager[] =>
        response.map((unmappedMark: any) =>
          mapIntensiveMarkManager(unmappedMark)
        ),
    }),
    exportIntensiveMarks: builder.query<
      { file: Blob; fileName: string },
      {
        intensiveId: number;
        groupId?: number;
      }
    >({
      query: ({ intensiveId, groupId }) => {
        const searchParams = new URLSearchParams();
        searchParams.append('intensive_id', intensiveId.toString());
        if (groupId) {
          searchParams.append('group_id', groupId.toString());
        }

        return {
          url: `/intensive_marks/export/?${searchParams.toString()}`,
          method: 'GET',
          responseHandler: (response) => response.blob(),
        };
      },
      transformResponse: (response: Blob, meta: any) => {
        const contentDispositionHeader = meta.response.headers.get(
          'Content-Disposition'
        );
        return {
          file: response,
          fileName: decodeURI(contentDispositionHeader.substring(29)),
        };
      },
    }),
    createIntensiveMark: builder.mutation<IIntensiveMark, IIntensiveMarkCreate>(
      {
        query: ({ teamId, ...data }) => ({
          url: `/intensive_marks/?team_id=${teamId}`,
          method: 'POST',
          body: {
            ...data,
          },
        }),
        transformResponse: (response: any): IIntensiveMark =>
          mapIntensiveMark(response),
      }
    ),
    updateIntensiveMark: builder.mutation<IIntensiveMark, IIntensiveMarkUpdate>(
      {
        query: ({ id, ...data }) => ({
          url: `/intensive_marks/${id}/`,
          method: 'PUT',
          body: {
            ...data,
          },
        }),
        transformResponse: (response: any): IIntensiveMark =>
          mapIntensiveMark(response),
      }
    ),
    deleteIntensiveMark: builder.mutation<void, number>({
      query: (id) => ({
        url: `/intensive_marks/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetIntensiveMarksQuery,
  useLazyExportIntensiveMarksQuery,
  useCreateIntensiveMarkMutation,
  useUpdateIntensiveMarkMutation,
  useDeleteIntensiveMarkMutation,
} = intensiveMarkApi;
