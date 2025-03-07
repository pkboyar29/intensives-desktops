import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import {
  IEventMark,
  IEventMarkCreate,
  IEventMarkUpdate,
} from '../../ts/interfaces/IEventMark';

export const mapEventMark = (unmappedEventMark: any): IEventMark => {
  return {
    id: unmappedEventMark.id,
    mark: unmappedEventMark.mark,
    comment: unmappedEventMark.comment,
    criteria: unmappedEventMark.criteria,
    createdDate: unmappedEventMark.created_at,
    teacher: unmappedEventMark.teacher,
    eventAnswerId: unmappedEventMark.event_answer,
  };
};

export const eventMarkApi = createApi({
  reducerPath: 'eventMarkApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createEventMark: builder.mutation<IEventMark[], IEventMarkCreate[]>({
      query: (data) => ({
        url: '/event_marks/',
        method: 'POST',
        body: data.map((eventMark) => ({
          ...eventMark,
          event_answer: eventMark.eventAnswerId,
        })),
      }),
      transformResponse: (response: any) =>
        response.map((unmappedMark: any) => mapEventMark(unmappedMark)),
    }),
  }),
});

export const { useCreateEventMarkMutation } = eventMarkApi;
