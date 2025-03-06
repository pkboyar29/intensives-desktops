import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

import { mapEventAnswer } from './eventAnswerApi';

import {
  IEventMark,
  IEventMarkCreate,
  IEventMarkUpdate,
} from '../../ts/interfaces/IEventMark';

export const mapEventMark = (unmappedEventMark: any): IEventMark => {
  console.log(unmappedEventMark);
  return {
    id: unmappedEventMark.id,
    mark: unmappedEventMark.mark,
    comment: unmappedEventMark.comment,
    createdDate: unmappedEventMark.created_at,
    teacher: unmappedEventMark.teacher,
    eventAnswer: mapEventAnswer(unmappedEventMark.event_answer),
  };
};

export const eventMarkApi = createApi({
  reducerPath: 'eventMarkApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createEventMark: builder.mutation<IEventMark, IEventMarkCreate>({
      query: (data) => ({
        url: '/event_marks/',
        method: 'POST',
        body: {
          ...data,
          event_answer: data.eventAnswerId,
        },
      }),
      transformResponse: (response: any) => mapEventMark(response),
    }),
    createCriteriaMarks: builder.mutation<IEventMark, IEventMarkCreate[]>({
      query: (data) => ({
        url: '/event_marks/',
        method: 'POST',
        body: data.map((eventMark) => ({
          ...eventMark,
          event_answer: eventMark.eventAnswerId,
        })),
      }),
      transformResponse: (response: any) =>
        response.map((unmappedEventMark: any) =>
          mapEventMark(unmappedEventMark)
        ),
    }),
  }),
});

export const { useCreateEventMarkMutation, useCreateCriteriaMarksMutation } =
  eventMarkApi;
