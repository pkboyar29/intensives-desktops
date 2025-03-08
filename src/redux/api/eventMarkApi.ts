import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
  IEventMark,
  IEventMarkCreate,
  IEventMarksCreate,
  IEventMarkUpdate,
} from '../../ts/interfaces/IEventMark';

export const mapEventMark = (unmappedEventMark: any): IEventMark => {
  return {
    id: unmappedEventMark.id,
    mark: unmappedEventMark.mark,
    comment: unmappedEventMark.comment,
    criteria: unmappedEventMark.criteria,
    createdDate: unmappedEventMark.created_dt,
    updatedDate: unmappedEventMark.updated_dt,
    teacher: unmappedEventMark.teacher,
    eventAnswerId: unmappedEventMark.event_answer,
  };
};

export const eventMarkApi = createApi({
  reducerPath: 'eventMarkApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createEventMark: builder.mutation<IEventMark[], IEventMarksCreate>({
      query: (data) => ({
        url: `/event_marks/?event_answer_id=${data.eventAnswerId}`,
        method: 'POST',
        body: data.marksToCreate.map((eventMark) => ({
          ...eventMark,
        })),
      }),
      transformResponse: (response: any) =>
        response.map((unmappedMark: any) => mapEventMark(unmappedMark)),
    }),
    updateEventMark: builder.mutation<IEventMark, IEventMarkUpdate>({
      query: (data) => ({
        url: `/event_marks/${data.eventMarkId}/`,
        method: 'PUT',
        body: {
          mark: data.mark,
          comment: data.comment,
        },
      }),
    }),
  }),
});

export const { useCreateEventMarkMutation, useUpdateEventMarkMutation } =
  eventMarkApi;
