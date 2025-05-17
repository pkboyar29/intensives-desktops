import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import { mapTeacher } from './teacherApi';

import {
  IIntensiveMark,
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

export const intensiveMarkApi = createApi({
  reducerPath: 'intensiveMarkApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
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
  useCreateIntensiveMarkMutation,
  useUpdateIntensiveMarkMutation,
  useDeleteIntensiveMarkMutation,
} = intensiveMarkApi;
